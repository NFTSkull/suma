"use client";

import { useEffect } from "react";
import { contactMethodOf, track } from "@/lib/analytics";
import { pricingPlans, type PricingPlanId } from "@/content/pricing";
import type { ShowroomIntent } from "@/lib/showroom";
import type { ServiceSlug } from "@/types/content";

const showroomIntents: readonly ShowroomIntent[] = ["quote", "budget", "diagnostic", "impact"];

/**
 * Un solo listener delegado (fase de captura) para clics en canales de contacto
 * y CTA de servicio. Se monta una vez en el layout raíz, así que cada clic genera
 * a lo sumo un evento y no hace falta convertir los enlaces en componentes cliente.
 */
export function AnalyticsClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const method = contactMethodOf(link.getAttribute("href") ?? "");
      if (method) {
        track({ event: "contact_click", contact_method: method });
      }

      // La selección de precios se mide sin nombre, teléfono, importe variable ni texto libre.
      const pricingPlan = link.dataset.pricingPlan;
      if (pricingPlans.some((plan) => plan.id === pricingPlan)) {
        track({
          event: "pricing_cta_click",
          plan: pricingPlan as PricingPlanId,
          source: link.dataset.pricingSource === "estimator" ? "estimator" : "card",
        });
      }

      // Cuando un CTA de servicio abre WhatsApp se registran los dos eventos,
      // una sola vez cada uno: contacto y servicio de origen (sin datos personales).
      if (link.dataset.analytics === "service_cta" && link.dataset.service) {
        track({
          event: "service_cta_click",
          service: link.dataset.service as ServiceSlug,
          cta_location: link.dataset.ctaLocation === "closing" ? "closing" : "hero",
        });
      }

      const intent = link.dataset.showroomIntent;
      if (link.dataset.analytics === "showroom_whatsapp" && showroomIntents.some((id) => id === intent)) {
        track({ event: "showroom_whatsapp_click", intent: intent as ShowroomIntent });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
