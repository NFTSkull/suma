import { actionLog } from "@/lib/action-log";
import { deliverLead, getDeliveryConfig, type DeliveryResult } from "@/lib/contact-delivery";
import { antiSpamSchema, contactSchema, fieldErrors, isSilentlyDiscarded } from "@/lib/contact-schema";
import { contactRateLimiter } from "@/lib/rate-limit";

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anon";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    actionLog({ action: "contact.submit", outcome: "invalid_json" });
    return json(400, { ok: false, error: "invalid_json" });
  }

  if (!contactRateLimiter.check(clientKey(request)).ok) {
    actionLog({ action: "contact.submit", outcome: "rate_limited" });
    return json(429, { ok: false, error: "rate_limited" });
  }

  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const { sitio, inicio, ...fields } = raw;

  const spam = antiSpamSchema.safeParse({ sitio, inicio });
  if (!spam.success || isSilentlyDiscarded(spam.data, Date.now())) {
    actionLog({ action: "contact.submit", outcome: "spam_discarded" });
    return json(200, { ok: true });
  }

  const parsed = contactSchema.safeParse(fields);
  if (!parsed.success) {
    actionLog({ action: "contact.submit", outcome: "validation_failed" });
    return json(422, { ok: false, error: "validation", fields: fieldErrors(parsed.error) });
  }

  const meta = {
    servicios: parsed.data.servicios,
    tipoNegocio: parsed.data.tipoNegocio,
    fromSelector: Boolean(parsed.data.contexto),
  };

  const { config, issue } = getDeliveryConfig();
  if (!config) {
    actionLog({ action: "contact.submit", outcome: "not_configured", ...(issue ? { reason: issue } : {}), ...meta });
    return json(503, { ok: false, error: "not_configured" });
  }

  let result: DeliveryResult = { ok: false };
  try {
    result = await deliverLead(config, parsed.data);
  } catch {
    result = { ok: false };
  }

  actionLog({
    action: "contact.submit",
    outcome: result.ok ? "delivered" : "delivery_failed",
    provider: config.provider,
    ...(result.ok && result.providerId ? { providerId: result.providerId } : {}),
    ...(!result.ok && result.providerStatus ? { providerStatus: result.providerStatus } : {}),
    ...meta,
  });

  // `delivered: true` solo cuando el proveedor confirmó; el descarte anti-spam responde `{ ok: true }` sin ese campo.
  return result.ok ? json(200, { ok: true, delivered: true }) : json(502, { ok: false, error: "delivery_failed" });
}
