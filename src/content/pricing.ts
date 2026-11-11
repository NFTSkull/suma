/**
 * Precios SUMA STUDIO · Referencias MXN antes de IVA.
 * Catálogo único para tarjetas, cotizador y mensajes WhatsApp.
 * Las licencias, pauta, mensajería, IA y consumos externos NO están incluidos.
 * Precio fijo de servicio para UNA empresa y UNA sede; no se cobra por asiento de SUMA.
 * El software de terceros puede cobrar licencias por usuario, canal o mensaje.
 */
export const pricingSettings = {
  currency: "MXN",
  adBudgets: [3000, 6000, 9000, 12000],
  defaultAdBudget: 6000,
  websiteMaintenanceMonthly: 990,
  flexiblePaymentsMinForSix: 10000,
} as const;

export const pricingPlans = [
  {
    id: "ads",
    number: "01",
    name: "SUMA Ads",
    label: "Más clientes",
    tagline: "Publicidad que lleva a una conversación o reserva.",
    audience: "Ya tienes WhatsApp, un reservador o una web; quieres que más personas conozcan tu negocio.",
    setup: 2900,
    monthly: 3900,
    featured: false,
    includes: [
      "Una campaña activa en Meta Ads",
      "Hasta dos creativos estáticos al mes",
      "Segmentación local y ruta a tu WhatsApp o reservador",
      "Medición de consultas según posibilidades del canal",
      "Optimización semanal e informe mensual",
    ],
    boundaries: "Una sede. Sin pauta incluida, CRM, atención de mensajes ni web nueva.",
    action: "Elegir publicidad",
  },
  {
    id: "flow",
    number: "02",
    name: "SUMA Flow",
    label: "CRM + seguimiento",
    tagline: "Organiza consultas, responsables y próximos pasos.",
    audience: "Para negocios que ya reciben interesados y necesitan orden y automatización sin crear un software desde cero.",
    setup: 5900,
    monthly: 2900,
    featured: true,
    includes: [
      "Diagnóstico de un proceso comercial y una sede",
      "Configuración de un CRM o herramienta existente",
      "Un embudo comercial, asignación y seguimiento de interesados",
      "Hasta dos automatizaciones sencillas",
      "Guía de respuesta por WhatsApp y transferencia al equipo",
      "Capacitación inicial e informe mensual",
    ],
    boundaries: "SUMA no cobra extra por integrantes del equipo. Las licencias de software externo sí pueden cobrar por usuario. Sin bot IA avanzado, CRM propio ni integración no comprobada.",
    action: "Elegir CRM + seguimiento",
  },
  {
    id: "growth",
    number: "03",
    name: "SUMA Growth",
    label: "Captar + convertir",
    tagline: "Publicidad y seguimiento trabajando juntos.",
    audience: "Para estudios y spas que buscan nuevos clientes y un proceso claro hasta su primera visita.",
    setup: 12900,
    monthly: 6900,
    featured: false,
    includes: [
      "Alcance base de SUMA Flow para una sede",
      "Hasta dos campañas activas de Meta Ads",
      "Hasta cuatro creativos estáticos al mes",
      "Optimización de la ruta a tu web o reservador existente",
      "Medición de consultas y seguimiento por etapa",
      "Optimización semanal e informe mensual",
    ],
    boundaries: "No incluye pauta, landing nueva, chatbot IA, licencias externas ni desarrollos a medida. Una sede.",
    action: "Elegir crecimiento",
  },
] as const;

export type PricingPlanId = (typeof pricingPlans)[number]["id"];
export type PricingPlan = (typeof pricingPlans)[number];

export const individualServices = [
  {
    id: "meta-ads", name: "Gestión de Meta Ads", category: "Captación",
    setup: 2900, monthly: 3900, from: false,
    detail: "Una campaña, dos creativos estáticos/mes, medición y optimización. Pauta aparte.",
  },
  {
    id: "google-ads", name: "Gestión de Google Ads", category: "Captación",
    setup: 3500, monthly: 4900, from: true,
    detail: "Una campaña de búsqueda, configuración y optimización. Inversión y terceros aparte; alcance por validar.",
  },
  {
    id: "crm-gestionado", name: "CRM + seguimiento administrado", category: "Atención",
    setup: 5900, monthly: 2900, from: false,
    detail: "Configurar un CRM existente, un embudo y hasta dos automatizaciones. Licencias externas aparte.",
  },
  {
    id: "chatbot-guiado", name: "Chatbot guiado (sin IA)", category: "Atención",
    setup: 3900, monthly: 1190, from: true,
    detail: "Preguntas frecuentes y transferencia al equipo, sujeto a viabilidad del canal y costos externos.",
  },
  {
    id: "chatbot-ia", name: "Asistente de WhatsApp con IA", category: "Atención",
    setup: 14900, monthly: 3900, from: true,
    detail: "Atención con IA y escalamiento humano, sujeto a API oficial, integración y consumo externo.",
  },
  {
    id: "reservas", name: "Configurar reservador existente", category: "Operación",
    setup: 2900, monthly: 0, from: false,
    detail: "Configuración inicial de una plataforma y una sede, sin desarrollo propio.",
  },
  {
    id: "automatizacion", name: "Automatización puntual", category: "Operación",
    setup: 3900, monthly: 0, from: true,
    detail: "Un flujo definido de avisos, seguimiento o traspaso de datos. Herramientas aparte.",
  },
  {
    id: "seo-local", name: "SEO local y presencia en búsquedas", category: "Presencia",
    setup: 2900, monthly: 1990, from: true,
    detail: "Revisión inicial, optimización local y seguimiento mensual. Sin garantía de posiciones.",
  },
  {
    id: "landing", name: "Landing page profesional", category: "Presencia",
    setup: 5900, monthly: 0, from: false,
    detail: "Diseño móvil, formulario o WhatsApp y SEO técnico inicial. Mantenimiento opcional.",
  },
  {
    id: "web", name: "Sitio web corporativo", category: "Presencia",
    setup: 14900, monthly: 0, from: true,
    detail: "De cuatro a seis páginas; diseño y funciones según alcance.",
  },
  {
    id: "crm-medida", name: "CRM desarrollado a medida", category: "Desarrollo",
    setup: 49900, monthly: 0, from: true,
    detail: "Software propio según módulos. Sin tarifa SUMA por usuario interno; capacidad, seguridad, soporte e infraestructura se acuerdan. Mantenimiento opcional.",
  },
  {
    id: "mantenimiento-crm", name: "Soporte mensual de CRM a medida", category: "Desarrollo",
    setup: 0, monthly: 2990, from: true,
    detail: "Seguimiento técnico y mantenimiento base sujeto a infraestructura, uso y alcance.",
  },
  {
    id: "app", name: "Aplicación móvil a medida", category: "Desarrollo",
    setup: 90000, monthly: 0, from: true,
    detail: "Proyecto evaluado por funciones y plataformas; publicación en tiendas aparte.",
  },
] as const;

export type IndividualServiceId = (typeof individualServices)[number]["id"];
export type IndividualService = (typeof individualServices)[number];

export const pricingFaqs = [
  {
    q: "¿Puedo pagar la implementación o un desarrollo único en mensualidades?",
    a: "Sí, puedes solicitar dividir la implementación en 3 pagos mensuales, o en 6 cuando la implementación base es de al menos $10,000. El total de implementación no cambia en la simulación. Son parcialidades sujetas a confirmación comercial por escrito, NO financiamiento aprobado automáticamente ni cargos automáticos: por separado se cobra cualquier servicio mensual y las herramientas externas. En desarrollos a medida, los pagos también pueden organizarse por entregables aprobados.",
  },
  {
    q: "¿SUMA cobra por cada usuario de mi equipo?",
    a: "No añadimos un cargo propio por asiento en la configuración y el seguimiento de CRM de una misma empresa. Si tu CRM usa licencias externas, sus tarifas por usuario se presupuestan aparte. Un CRM desarrollado por SUMA puede cotizarse sin tarifa por usuario interno, con capacidad técnica y uso razonable acordados. Usuarios de equipo no significa mensajes, clientes ni operaciones ilimitadas.",
  },
  {
    q: "¿Estoy contratando un software propio o un servicio administrado?",
    a: "SUMA Flow configura y mejora una herramienta existente; no incluye una plataforma nueva de nuestra propiedad ni licencias. Si necesitas un CRM desarrollado para tu operación, lo cotizamos desde $49,900 de implementación y con soporte opcional desde $2,990/mes, según alcance.",
  },
  {
    q: "¿Cuánto cuesta cada paquete?",
    a: "SUMA Ads: $2,900 de implementación y $3,900/mes. SUMA Flow: $5,900 de implementación y $2,900/mes. SUMA Growth: $12,900 de implementación y $6,900/mes. Precios base para una empresa y una sede, antes de IVA, con implementación y primera mensualidad cobradas por separado.",
  },
  {
    q: "¿Puedo contratar solo un servicio?",
    a: "Sí. Puedes seleccionar anuncios, CRM administrado, chatbot, automatizaciones, SEO, web o desarrollo a medida. Los precios desde son mínimos orientativos; el alcance e integraciones se confirman antes de contratar.",
  },
  {
    q: "¿Mi negocio necesita página nueva o cambiar las reservas?",
    a: "No. Podemos aprovechar WhatsApp y tu plataforma actual, incluso si usas Wellhub, TotalPass o Fitpass como canal comercial. Acceder a datos privados o automatizar reservas exige comprobar permisos, compatibilidad e integración; no ofrecemos esa función sin validarla.",
  },
  {
    q: "¿Cuáles son los gastos que se pagan aparte?",
    a: "Pauta de Meta o Google, licencias del software, acceso a WhatsApp API y tarifas de mensajes, consumo de IA, dominio, hosting adicional, pasarelas de pago y desarrollos fuera del alcance. Para más de una sede se prepara una propuesta ajustada.",
  },
  {
    q: "¿El chatbot de IA está incluido en Flow o Growth?",
    a: "No. Los planes incluyen estructura de atención o automatizaciones sencillas según su ficha. Los chatbots se cotizan aparte: guiado desde $3,900 de implementación + $1,190/mes, o con IA desde $14,900 + $3,900/mes, más servicios externos.",
  },
] as const;
