/**
 * CATÁLOGO ÚNICO DE PRECIOS DE SUMA STUDIO.
 * Editar aquí para actualizar tarjetas, estimador y mensajes comerciales.
 * Valores en MXN, antes de IVA. No incluye terceros.
 */
export const pricingSettings = {
  currency: "MXN",
  startMaintenanceMonthly: 990,
  growthAdBudgets: [6000, 8000, 10000, 12000],
  defaultGrowthAdBudget: 8000,
} as const;

export const pricingPlans = [
  {
    id: "start",
    number: "01",
    name: "SUMA Start",
    label: "Presencia digital",
    tagline: "Que te encuentren y sepan cómo contactarte.",
    audience: "Para un estudio o profesional que necesita presentar su negocio con claridad.",
    setup: 8900,
    monthly: 0,
    featured: false,
    includes: [
      "Landing page profesional de una sección larga",
      "Diseño responsivo y enfoque móvil",
      "Servicios, formulario y acceso directo a WhatsApp",
      "SEO técnico inicial y medición básica",
      "Dos rondas de ajustes dentro del alcance",
    ],
    boundaries: "No incluye CRM, campañas de anuncios ni reservas automatizadas.",
    action: "Quiero conocer Start",
  },
  {
    id: "flow",
    number: "02",
    name: "SUMA Flow",
    label: "Operación y seguimiento",
    tagline: "Que ninguna conversación se quede sin seguimiento.",
    audience: "Para estudios y spas que ya reciben interesados y necesitan orden operativo.",
    setup: 14900,
    monthly: 4900,
    featured: true,
    includes: [
      "Diagnóstico de procesos y una sede",
      "Configuración de un CRM o herramienta existente",
      "Embudo de prospectos y organización de solicitudes",
      "Hasta dos automatizaciones sencillas",
      "Estructura de atención por WhatsApp y escalamiento humano",
      "Capacitación inicial y reporte mensual",
    ],
    boundaries: "No incluye construir un CRM propio, un bot de IA avanzado ni reservas confirmadas sin integración comprobada.",
    action: "Quiero conocer Flow",
  },
  {
    id: "growth",
    number: "03",
    name: "SUMA Growth",
    label: "Adquisición y crecimiento",
    tagline: "Que más personas correctas descubran tu estudio.",
    audience: "Para negocios consolidados con presupuesto y capacidad para atender más clientes.",
    setup: 24900,
    monthly: 9900,
    featured: false,
    includes: [
      "Todo el alcance base de SUMA Flow",
      "Una landing enfocada en conversión",
      "Medición de campañas y seguimiento de oportunidades",
      "Gestión de Meta Ads con hasta dos campañas activas",
      "Hasta cuatro creativos estáticos al mes",
      "Optimización semanal e informe de resultados",
    ],
    boundaries: "No incluye inversión publicitaria, promesas de ventas ni desarrollo ilimitado.",
    action: "Quiero conocer Growth",
  },
] as const;

export type PricingPlanId = (typeof pricingPlans)[number]["id"];
export type PricingPlan = (typeof pricingPlans)[number];

export const individualServices = [
  { name: "Configurar software de reservas existente", price: "$4,900", detail: "Pago único · una plataforma y una sede" },
  { name: "Landing page profesional", price: "$8,900", detail: "Pago único · alcance estándar Start" },
  { name: "Sitio web corporativo", price: "Desde $18,900", detail: "4 a 6 páginas según contenidos y funciones" },
  { name: "Gestión de Meta Ads", price: "$4,900 + $5,900/mes", detail: "Implementación + gestión · publicidad aparte" },
  { name: "Asistente de WhatsApp con IA", price: "Desde $19,900 + $4,900/mes", detail: "Implementación + operación · sujeto a viabilidad de API" },
  { name: "CRM desarrollado a medida", price: "Desde $49,900", detail: "Presupuesto según módulos e integraciones" },
  { name: "Aplicación móvil a medida", price: "Desde $90,000", detail: "Requiere evaluación técnica y alcance específico" },
] as const;

export const pricingFaqs = [
  {
    q: "¿Cuánto cuesta trabajar con SUMA STUDIO?",
    a: "SUMA Start cuesta $8,900 de implementación, sin mensualidad obligatoria. SUMA Flow cuesta $14,900 de implementación más $4,900 al mes. SUMA Growth cuesta $24,900 de implementación más $9,900 al mes. Los importes son bases en pesos mexicanos antes de IVA.",
  },
  {
    q: "¿El primer mes ya está incluido?",
    a: "No. La implementación y la operación mensual se cobran por separado. El primer pago base es $8,900 en Start, $19,800 en Flow y $34,800 en Growth, antes de IVA y sin servicios externos.",
  },
  {
    q: "¿Tengo que pagar mensualidad en SUMA Start?",
    a: "No. SUMA Start es un proyecto de pago único. Puedes contratar mantenimiento opcional por $990 al mes. Dominio, hosting y herramientas de terceros se cotizan por separado.",
  },
  {
    q: "¿Incluyen el presupuesto de anuncios y las licencias?",
    a: "No. La inversión de Meta Ads, las licencias, el hosting extraordinario, las plataformas de terceros y los costos de WhatsApp API o IA se pagan aparte, después de una estimación previa.",
  },
  {
    q: "¿Puedo cambiar o combinar los paquetes?",
    a: "Sí. Estos paquetes son puntos de partida, no soluciones rígidas. Podemos adaptar el alcance y cotizar de forma independiente una herramienta de reservas, un asistente de IA o un CRM personalizado.",
  },
  {
    q: "¿Cuándo conviene crear un CRM a medida?",
    a: "Cuando las herramientas existentes no resuelven los procesos reales de tu estudio o necesitas integraciones particulares. Primero evaluamos si configurar software existente es suficiente y más económico.",
  },
] as const;
