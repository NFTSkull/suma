import "server-only";
import { businessTypeOptions, serviceInterestOptions, type ContactData } from "./contact-schema";

export type DeliveryProvider = "webhook" | "resend";

export type DeliveryConfig =
  | { provider: "webhook"; url: string }
  | { provider: "resend"; apiKey: string; to: string; from: string }
  | null;

export function getDeliveryConfig(env: NodeJS.ProcessEnv = process.env): DeliveryConfig {
  if (env.CONTACT_WEBHOOK_URL) return { provider: "webhook", url: env.CONTACT_WEBHOOK_URL };
  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) {
    return {
      provider: "resend",
      apiKey: env.RESEND_API_KEY,
      to: env.CONTACT_TO_EMAIL,
      from: env.CONTACT_FROM_EMAIL ?? "SUMA STUDIO <onboarding@resend.dev>",
    };
  }
  return null;
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
  return {
    nombre: data.nombre,
    negocio: data.negocio,
    tipoNegocio: label(businessTypeOptions, data.tipoNegocio),
    email: data.email,
    whatsapp: data.whatsapp,
    servicios: data.servicios.map((s) => label(serviceInterestOptions, s)),
    mensaje: data.mensaje ?? "",
    contexto: data.contexto ?? null,
    recibido: new Date().toISOString(),
  };
}

export async function deliverLead(
  config: Exclude<DeliveryConfig, null>,
  data: ContactData,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const lead = formatLead(data);
  const signal = AbortSignal.timeout(8000);

  if (config.provider === "webhook") {
    const res = await fetchImpl(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "sumastudio-web", lead }),
      signal,
    });
    return res.ok;
  }

  const rows = Object.entries({
    Nombre: lead.nombre,
    Negocio: lead.negocio,
    "Tipo de negocio": lead.tipoNegocio,
    Correo: lead.email,
    WhatsApp: lead.whatsapp,
    Servicios: lead.servicios.join(", "),
    Mensaje: lead.mensaje || "—",
    "Contexto del selector": lead.contexto ? JSON.stringify(lead.contexto) : "—",
  })
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(String(v))}</td></tr>`)
    .join("");

  const res = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: lead.email,
      subject: `Nuevo proyecto: ${lead.negocio}`,
      html: `<table cellpadding="6">${rows}</table>`,
    }),
    signal,
  });
  return res.ok;
}
