"use client";

import Script from "next/script";
import { useAnalyticsConsent } from "./useAnalyticsConsent";

/** Fragmento oficial de GTM, sin cambios salvo el id del contenedor. */
export const gtmSnippet = (id: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`;

/**
 * Carga GTM solo con consentimiento de medición. Sin elección o con rechazo no se
 * descarga gtm.js. No hay `<noscript>`: sin JavaScript no se puede pedir
 * consentimiento, así que tampoco se mide.
 */
const productionHosts = ["www.sumastudio.mx", "sumastudio.mx"] as const;

/**
 * GA4 no debe mezclar visitas de localhost ni previews de Vercel con usuarios reales.
 * `allowedHosts` admite una lista explícita en tests y en futuras instalaciones.
 */
export function GoogleTagManager({
  id,
  allowedHosts = productionHosts,
}: {
  id: string;
  allowedHosts?: readonly string[];
}) {
  const consent = useAnalyticsConsent();
  if (consent !== "granted" || typeof window === "undefined" || !allowedHosts.includes(window.location.hostname)) return null;
  return (
    <Script id="google-tag-manager" strategy="afterInteractive">
      {gtmSnippet(id)}
    </Script>
  );
}
