import "server-only";
import { createHash } from "node:crypto";
import { z } from "zod";
import { businessTypeOptions, serviceInterestOptions, type ContactData } from "./contact-schema";
import { legalEffectiveDate } from "@/content/site";

export type DeliveryProvider = "webhook" | "resend";

export type DeliveryConfig =
  | { provider: "webhook"; url: string }
  | { provider: "resend"; apiKey: string; to: string[]; from: string };

/** Motivo (sin secretos ni datos personales) por el que no hay proveedor utilizable. */
export type DeliveryConfigIssue =
  | "webhook_url_invalid"
  | "resend_api_key_invalid"
  | "resend_to_invalid"
  | "resend_from_missing"
  | "resend_from_invalid";

export type DeliveryResult = { ok: true; providerId?: string } | { ok: false; providerStatus?: number };

const emailSchema = z.email();
/** `contacto@dominio` o `Nombre <contacto@dominio>`. */
const senderSchema = z
  .string()
  .trim()
  .transform((v) => ({ raw: v, address: (v.match(/<([^>]+)>\s*$/)?.[1] ?? v).trim() }))
  .refine(({ address }) => emailSchema.safeParse(address).success)
  // El remitente de pruebas de Resend solo entrega a la cuenta dueña: nunca debe usarse en producción.
  .refine(({ address }) => !address.toLowerCase().endsWith("@resend.dev"));

const webhookSchema = z.url({ protocol: /^https$/ });
const resendKeySchema = z.string().regex(/^re_\S+$/);
/** Uno o varios destinatarios separados por comas. */
const recipientsSchema = z
  .string()
  .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean))
  .pipe(z.array(emailSchema).min(1).max(5));

/**
 * Proveedor de entrega a partir de las variables de entorno. Un webhook tiene
 * prioridad sobre Resend. Si la configuración es incompleta o inválida no hay
 * proveedor y la API responde `503 not_configured` (nunca simula éxito).
 */
export function getDeliveryConfig(env: NodeJS.ProcessEnv = process.env): {
  config: DeliveryConfig | null;
  issue?: DeliveryConfigIssue;
} {
  if (env.CONTACT_WEBHOOK_URL) {
    const url = webhookSchema.safeParse(env.CONTACT_WEBHOOK_URL.trim());
    return url.success ? { config: { provider: "webhook", url: url.data } } : { config: null, issue: "webhook_url_invalid" };
  }
  if (env.RESEND_API_KEY || env.CONTACT_TO_EMAIL || env.CONTACT_FROM_EMAIL) {
    if (!resendKeySchema.safeParse(env.RESEND_API_KEY?.trim()).success) return { config: null, issue: "resend_api_key_invalid" };
    const to = recipientsSchema.safeParse(env.CONTACT_TO_EMAIL ?? "");
    if (!to.success) return { config: null, issue: "resend_to_invalid" };
    if (!env.CONTACT_FROM_EMAIL?.trim()) return { config: null, issue: "resend_from_missing" };
    const from = senderSchema.safeParse(env.CONTACT_FROM_EMAIL);
    if (!from.success) return { config: null, issue: "resend_from_invalid" };
    return {
      config: { provider: "resend", apiKey: env.RESEND_API_KEY!.trim(), to: to.data, from: from.data.raw },
    };
  }
  return { config: null };
}

const label = <T extends readonly { id: string; label: string }[]>(opts: T, id: string) =>
  opts.find((o) => o.id === id)?.label ?? id;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatLead(data: ContactData) {
  const now = new Date();
  return {
    nombre: data.nombre,
    negocio: data.negocio,
    tipoNegocio: label(businessTypeOptions, data.tipoNegocio),
    email: data.email,
    whatsapp: data.whatsapp,
    servicios: data.servicios.map((s) => label(serviceInterestOptions, s)),
    mensaje: data.mensaje ?? "",
    contexto: data.contexto ?? null,
    recibido: now.toISOString(),
    consentimientos: {
      privacidad: true,
      marketing: data.marketing ?? false,
      timestamp: now.toISOString(),
      avisoVersion: legalEffectiveDate,
    },
  };
}

/**
 * Misma solicitud ⇒ misma clave: si el envío se repite (reintento de red, doble
 * clic), Resend devuelve la respuesta original sin mandar otro correo (24 h).
 */
export function leadIdempotencyKey(data: ContactData): string {
  const fingerprint = JSON.stringify([data.email, data.whatsapp, data.negocio, data.tipoNegocio, data.servicios, data.mensaje ?? ""]);
  return `contact-lead/${createHash("sha256").update(fingerprint).digest("hex")}`;
}

export async function deliverLead(
  config: DeliveryConfig,
  data: ContactData,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  const lead = formatLead(data);
  const signal = AbortSignal.timeout(8000);

  if (config.provider === "webhook") {
    const res = await fetchImpl(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "sumastudio-web", lead }),
      signal,
    });
    return res.ok ? { ok: true } : { ok: false, providerStatus: res.status };
  }

  const fields = Object.entries({
    Nombre: lead.nombre,
    Negocio: lead.negocio,
    "Tipo de negocio": lead.tipoNegocio,
    Correo: lead.email,
    WhatsApp: lead.whatsapp,
    Servicios: lead.servicios.join(", "),
    Mensaje: lead.mensaje || "—",
    "Contexto del selector": lead.contexto ? JSON.stringify(lead.contexto) : "—",
    "Consiente marketing": lead.consentimientos.marketing ? "Sí" : "No",
    "Consentimiento registrado": lead.consentimientos.timestamp,
    "Versión del aviso": lead.consentimientos.avisoVersion,
  });
  const html = `<table cellpadding="6">${fields
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(String(v))}</td></tr>`)
    .join("")}</table>`;
  const text = fields.map(([k, v]) => `${k}: ${v}`).join("\n");

  const res = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": leadIdempotencyKey(data),
    },
    body: JSON.stringify({
      from: config.from,
      to: config.to,
      reply_to: lead.email,
      subject: `Nuevo proyecto: ${lead.negocio}`,
      html,
      text,
    }),
    signal,
  });
  if (!res.ok) return { ok: false, providerStatus: res.status };
  // Solo cuenta como entregado si Resend devuelve el id del correo aceptado.
  const body = (await res.json().catch(() => null)) as { id?: unknown } | null;
  return typeof body?.id === "string" && body.id ? { ok: true, providerId: body.id } : { ok: false, providerStatus: res.status };
}
