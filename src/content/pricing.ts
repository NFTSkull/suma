/**
 * CATÁLOGO ÚNICO DE PRECIOS DE SUMA STUDIO.
 * Montos base MXN antes de IVA; publicidad, WhatsApp API, licencias y terceros aparte.
 * Enfoque: captar clientes, atender consultas y convertirlas usando herramientas existentes.
 */
export const pricingSettings = {
  currency: "MXN",
  websiteMaintenanceMonthly: 990,
  adBudgets: [3000, 6000, 9000, 12000],
  defaultAdBudget: 6000,
} as const;

export const pricingPlans = [
  {
    id: "ads",
    number: "01",
    name: "SUMA Ads",
    label: "Atraer nuevos clientes",
    tagline: "Más personas descubren tus clases y servicios.",
    audience: "Para negocios con web, WhatsApp o reservador que ya funcionan y quieren atraer nuevos clientes.",
    setup: 4900,
    monthly: 5900,
    featured: false,
    includes: [
      "Diagnóstico de oferta, zona y canal de conversión",
      "Gestión de una campaña activa en Meta Ads",
      "Hasta dos creativos estáticos al mes",
      "Anuncios hacia tu WhatsApp o sistema de reservas existente",
      "Medición de consultas donde el canal lo permita",
      "Optimización semanal y reporte mensual",
    ],
    boundaries: "No incluye inversión en anuncios, atención de mensajes, CRM, chatbot ni creación de página web. Una sede.",
    action: "Quiero atraer clientes",
  },
  {
    id: "flow",
    number: "02",
    name: "SUMA Flow",
    label: "Atender y dar seguimiento",
    tagline: "Que cada consulta tenga un siguiente paso.",
    audience: "Para negocios que ya reciben consultas y quieren responder, organizar y acompañar mejor a sus interesados.",
    setup: 14900,
    monthly: 4900,
    featured: false,
    includes: [
      "Diagnóstico de procesos de una sede",
      "Configuración de un CRM o herramienta existente",
      "Embudo de interesados y responsables de seguimiento",
      "Hasta dos automatizaciones sencillas: avisos, recordatorios o seguimiento",
      "Estructura de atención por WhatsApp con traspaso al equipo",
      "Capacitación inicial y reporte mensual",
    ],
    boundaries: "No incluye campañas, un CRM a medida, chatbot avanzado con IA ni reservas confirmadas sin integración autorizada.",
    action: "Quiero mejorar atención",
  },
  {
    id: "growth",
    number: "03",
    name: "SUMA Growth",
    label: "Captación + conversión",
    tagline: "Atrae clientes y acompáñalos hasta su siguiente paso.",
    audience: "Para estudios y spas que quieren campañas y seguimiento conectados, sin sustituir las plataformas que ya utilizan.",
    setup: 24900,
    monthly: 9900,
    featured: true,
    includes: [
      "Alcance base de SUMA Flow para una sede",
      "Gestión de hasta dos campañas activas en Meta Ads",
      "Hasta cuatro creativos estáticos al mes",
      "Landing de conversión o mejora de la ruta existente hacia reservas",
      "Medición de consultas y seguimiento de oportunidades",
      "Optimización semanal y reporte mensual",
    ],
    boundaries: "No incluye inversión publicitaria, web corporativa completa, asistente avanzado con IA ni integraciones no verificadas.",
    action: "Quiero crecer con SUMA",
  },
] as const;

export type PricingPlanId = (typeof pricingPlans)[number]["id"];
export type PricingPlan = (typeof pricingPlans)[number];

export const individualServices = [
  { name: "Asistente de WhatsApp con IA", price: "Desde $19,900 + $4,900/mes", detail: "Atención frecuente y traspaso humano · sujeto a viabilidad de API y costos externos" },
  { name: "Gestión de Meta Ads (SUMA Ads)", price: "$4,900 + $5,900/mes", detail: "Implementación + gestión · anuncios pagados aparte; no requiere web nueva" },
  { name: "Configurar software de reservas existente", price: "$4,900", detail: "Pago único · una plataforma y una sede, sujeto a permisos y viabilidad" },
  { name: "Landing page profesional", price: "$8,900", detail: "Pago único · presencia digital; mantenimiento opcional desde $990/mes" },
  { name: "Sitio web corporativo", price: "Desde $18,900", detail: "4 a 6 páginas según contenidos y funciones" },
  { name: "CRM desarrollado a medida", price: "Desde $49,900", detail: "Cuando configurar la herramienta existente no resuelve el proceso" },
  { name: "Aplicación móvil a medida", price: "Desde $90,000", detail: "Requiere evaluación técnica y alcance específico" },
] as const;

export const pricingFaqs = [
  {
    q: "¿Necesito una página web nueva para trabajar con SUMA?",
    a: "No. SUMA Ads puede enviar interesados a tu WhatsApp o sistema de reservas existente. SUMA Flow trabaja con tu operación actual. En Growth revisamos si hace falta una landing o basta con mejorar la ruta de conversión que ya tienes.",
  },
  {
    q: "¿Cuánto cuestan los tres planes?",
    a: "SUMA Ads cuesta $4,900 de implementación y $5,900 al mes. SUMA Flow cuesta $14,900 de implementación y $4,900 al mes. SUMA Growth cuesta $24,900 de implementación y $9,900 al mes. Son precios base antes de IVA para una sede; implementación y mensualidad se cobran por separado.",
  },
  {
    q: "¿Cuánto pago para comenzar?",
    a: "El primer pago base es $10,800 en Ads, $19,800 en Flow y $34,800 en Growth, antes de IVA. La inversión publicitaria, licencias y servicios externos no están incluidos.",
  },
  {
    q: "¿Pueden aprovechar Wellhub, TotalPass, Fitpass o mi reservador?",
    a: "Sí podemos diseñar campañas y un recorrido hacia tus canales actuales sin sustituirlos. Leer datos de clientes, reservas o créditos desde esas plataformas depende de sus permisos, acuerdos e integraciones disponibles; no lo prometemos antes de validarlo.",
  },
  {
    q: "¿SUMA Flow incluye un chatbot con inteligencia artificial?",
    a: "Flow incluye estructura de atención y hasta dos automatizaciones sencillas, no un bot avanzado de IA. El asistente de WhatsApp con IA se ofrece por separado, sujeto a viabilidad de API y costos externos.",
  },
  {
    q: "¿El presupuesto de anuncios y las licencias están incluidos?",
    a: "No. La pauta de Meta, licencias, hosting adicional, WhatsApp API y consumo de IA se pagan aparte, previa estimación. Growth incluye gestión de Meta Ads, no una gestión independiente de Google Ads.",
  },
  {
    q: "¿Y si solo necesito publicidad, automatización o una web?",
    a: "Puedes contratar servicios por separado. Primero revisamos tu objetivo: atraer clientes, atender consultas o recuperar oportunidades; después recomendamos el alcance mínimo que de verdad necesitas.",
  },
] as const;
