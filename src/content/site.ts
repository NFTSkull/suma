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
  /**
   * Datos de contacto reales. Se dejan en null hasta que la marca los confirme;
   * la interfaz solo los muestra cuando existen.
   */
  contact: {
    email: null as string | null,
    whatsapp: null as string | null,
  },
  social: [] as { label: string; href: string }[],
  /** Contenedor de Google Tag Manager. */
  gtmId: "GTM-W2CSD45N",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "es_MX",
} as const;

export const demoDisclaimer =
  "Demostración conceptual. Las soluciones se personalizan para cada negocio.";
