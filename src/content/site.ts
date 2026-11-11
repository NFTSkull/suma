import { resolveSiteTarget } from "@/lib/site-url";

const target = resolveSiteTarget({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
});

export const site = {
  name: "SUMA STUDIO",
  institutionalDescriptor: "Creaciones y Producciones",
  serviceDescriptor: "Tecnología y experiencias digitales para negocios de bienestar",
  tagline: "Diseñado para fluir",
  location: {
    city: "Monterrey",
    region: "Nuevo León",
    country: "México",
    label: "Desde Monterrey, Nuevo León · Para todo México",
  },
  /** Único teléfono de contacto aprobado para SUMA STUDIO (México, +52). */
  contact: {
    email: "ventas@sumastudio.mx",
    phone: "8114688882",
    phoneDisplay: "81 1468 8882",
    phoneE164: "+528114688882",
    whatsapp: "528114688882",
    whatsappUrl: "https://wa.me/528114688882?text=Hola%2C%20vi%20SUMA%20STUDIO%20y%20me%20gustar%C3%ADa%20platicar%20sobre%20un%20proyecto.",
  },
  social: [
    { label: "LinkedIn · SUMA STUDIO", href: "https://www.linkedin.com/company/sumastudio-tecnologia/" },
  ] as { label: string; href: string }[],
  /** Contenedor de Google Tag Manager. */
  gtmId: "GTM-W2CSD45N",
  url: target.url,
  /** Falso en previews de Vercel: robots y metadata piden no indexar. */
  indexable: target.indexable,
  locale: "es_MX",
} as const;

export const demoDisclaimer =
  "Demostración conceptual. Las soluciones se personalizan para cada negocio.";
