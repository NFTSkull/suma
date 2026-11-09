"use client";

import { useEffect } from "react";
import { contactMethodOf, track } from "@/lib/analytics";
import type { ServiceSlug } from "@/types/content";

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
        return;
      }

      if (link.dataset.analytics === "service_cta" && link.dataset.service) {
        track({
          event: "service_cta_click",
          service: link.dataset.service as ServiceSlug,
          cta_location: link.dataset.ctaLocation === "closing" ? "closing" : "hero",
        });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
