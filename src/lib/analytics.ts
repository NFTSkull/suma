import type { PricingPlanId } from "@/content/pricing";
import type { ServiceSlug } from "@/types/content";
import { readAnalyticsConsent } from "@/lib/consent";

/**
 * Eventos de conversión para GA4 vía Google Tag Manager (`dataLayer`).
 * Solo identificadores de catálogo: nunca nombres, correos, teléfonos, mensajes
 * ni texto escrito por la persona. Las páginas vistas las mide GA4 (medición
 * mejorada por cambios de historial); aquí no se envía `page_view`.
 */
export type AnalyticsEvent =
  | {
      event: "generate_lead";
      form_name: "contacto";
      lead_source: "contact_form";
      business_type: string;
      services: string;
      from_selector: boolean;
    }
  | {
      event: "form_error";
      form_name: "contacto";
      error_type: "not_configured" | "rate_limited" | "validation" | "delivery_failed" | "unconfirmed" | "server_error" | "network";
    }
  | { event: "contact_click"; contact_method: "email" | "whatsapp" | "phone" }
  | { event: "pricing_plan_selected"; plan: PricingPlanId }
  | { event: "pricing_cta_click"; plan: PricingPlanId; source: "card" | "estimator" }
  | { event: "service_cta_click"; service: ServiceSlug; cta_location: "hero" | "closing" }
  | {
      event: "needs_selector_completed";
      business_type: string;
      challenge: string;
      recommended_services: string;
    };

type DataLayerWindow = Window & { dataLayer?: unknown[] };

export function track(payload: AnalyticsEvent): void {
  // No almacenar eventos previos a la aceptación. GTM se carga después
  // del consentimiento y procesaría retroactivamente la cola de dataLayer.
  if (typeof window === "undefined" || readAnalyticsConsent() !== "granted") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

/** Canal de contacto según el href, o null si no es un canal de contacto directo. */
export function contactMethodOf(href: string): "email" | "whatsapp" | "phone" | null {
  if (/^mailto:/i.test(href)) return "email";
  if (/^tel:/i.test(href)) return "phone";
  if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href) || /^whatsapp:/i.test(href)) return "whatsapp";
  return null;
}

/** Atributos para marcar un CTA de contacto en una página de servicio. */
export const serviceCtaAttrs = (service: ServiceSlug, location: "hero" | "closing") => ({
  "data-analytics": "service_cta",
  "data-service": service,
  "data-cta-location": location,
});
