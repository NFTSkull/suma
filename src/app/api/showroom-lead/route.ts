import { actionLog } from "@/lib/action-log";
import { deliverShowroomLead, getDeliveryConfig, type DeliveryResult } from "@/lib/contact-delivery";
import { antiSpamSchema, fieldErrors, isSilentlyDiscarded, showroomLeadSchema } from "@/lib/contact-schema";
import { contactRateLimiter } from "@/lib/rate-limit";

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anon";
}

/** Extraer parámetros de atribución de headers y URL */
function extractAttribution(request: Request): Record<string, string | undefined> {
  const url = new URL(request.url);
  return {
    utm_source: url.searchParams.get("utm_source") || undefined,
    utm_medium: url.searchParams.get("utm_medium") || undefined,
    utm_campaign: url.searchParams.get("utm_campaign") || undefined,
    utm_content: url.searchParams.get("utm_content") || undefined,
    utm_term: url.searchParams.get("utm_term") || undefined,
    fbclid: url.searchParams.get("fbclid") || undefined,
    gclid: url.searchParams.get("gclid") || undefined,
    li_fat_id: url.searchParams.get("li_fat_id") || undefined,
    referrer: request.headers.get("referer") || undefined,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    actionLog({ action: "showroom_lead.submit", outcome: "invalid_json" });
    return json(400, { ok: false, error: "invalid_json" });
  }

  if (!contactRateLimiter.check(clientKey(request)).ok) {
    actionLog({ action: "showroom_lead.submit", outcome: "rate_limited" });
    return json(429, { ok: false, error: "rate_limited" });
  }

  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const { sitio, inicio, ...fields } = raw;

  const spam = antiSpamSchema.safeParse({ sitio, inicio });
  if (!spam.success || isSilentlyDiscarded(spam.data, Date.now())) {
    actionLog({ action: "showroom_lead.submit", outcome: "spam_discarded" });
    return json(200, { ok: true });
  }

  const parsed = showroomLeadSchema.safeParse(fields);
  if (!parsed.success) {
    actionLog({ action: "showroom_lead.submit", outcome: "validation_failed" });
    return json(422, { ok: false, error: "validation", fields: fieldErrors(parsed.error) });
  }

  const attribution = extractAttribution(request);
  const meta = {
    fromShowroom: true,
    hasConfig: Boolean(parsed.data.showroomConfig),
    wantsDemoPersonalizada: parsed.data.quieroDemoPersonalizada,
  };

  const { config, issue } = getDeliveryConfig();
  if (!config) {
    actionLog({ action: "showroom_lead.submit", outcome: "not_configured", ...(issue ? { reason: issue } : {}), ...meta });
    return json(503, { ok: false, error: "not_configured" });
  }

  let result: DeliveryResult = { ok: false };
  try {
    result = await deliverShowroomLead(config, parsed.data, attribution);
  } catch {
    result = { ok: false };
  }

  actionLog({
    action: "showroom_lead.submit",
    outcome: result.ok ? "delivered" : "delivery_failed",
    provider: config.provider,
    ...(result.ok && result.providerId ? { providerId: result.providerId } : {}),
    ...(!result.ok && result.providerStatus ? { providerStatus: result.providerStatus } : {}),
    ...meta,
  });

  return result.ok ? json(200, { ok: true, delivered: true }) : json(502, { ok: false, error: "delivery_failed" });
}
