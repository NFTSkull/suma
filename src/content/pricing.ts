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
    label: "Dar a conocer mi negocio",
    tagline: "Anuncios para que más personas descubran tus servicios.",
    audience: "Si ya tienes WhatsApp o reservas y quieres recibir más consultas, empezamos por Instagram y Facebook.",
    setup: 2900,
    monthly: 3900,
    featured: false,
    includes: [
      "Una campaña de anuncios en Instagram y Facebook",
      "Hasta dos imágenes publicitarias al mes",
      "Anuncios dirigidos a tu zona y enlace a WhatsApp o reservas",
      "Medición de clics y consultas cuando el canal lo permita",
      "Revisión semanal de anuncios y resumen mensual",
    ],
    boundaries: "Para una sede. El dinero que se invierte en anuncios va aparte. No contestamos mensajes ni creamos una página nueva.",
    action: "Elegir publicidad",
  },
  {
    id: "flow",
    number: "02",
    name: "SUMA Flow",
    label: "Ordenar y atender consultas",
    tagline: "Que ninguna consulta se pierda por falta de organización.",
    audience: "Si te llegan mensajes y quieres saber quién preguntó, quién le responde y qué sigue, este plan es para ti.",
    setup: 5900,
    monthly: 2900,
    featured: true,
    includes: [
      "Revisamos cómo atiendes hoy a las personas interesadas",
      "Organizamos contactos en una herramienta existente (CRM)",
      "Ves cada consulta, quién la atiende y cuál es el siguiente paso",
      "Hasta dos tareas automáticas sencillas, como avisos o recordatorios",
      "Guía para que tu equipo responda y dé seguimiento por WhatsApp",
      "Te enseñamos a usarlo y revisamos su funcionamiento cada mes",
    ],
    boundaries: "Configuramos una herramienta existente; no fabricamos un CRM nuevo ni respondemos mensajes por tu equipo. Las licencias externas se pagan aparte.",
    action: "Elegir CRM + seguimiento",
  },
  {
    id: "growth",
    number: "03",
    name: "SUMA Growth",
    label: "Publicidad + seguimiento",
    tagline: "Atrae consultas y organiza lo que pasa después.",
    audience: "Si quieres anuncios y también tener orden en las respuestas y el seguimiento de tu equipo, combina ambos servicios.",
    setup: 12900,
    monthly: 6900,
    featured: false,
    includes: [
      "Todo el servicio base de SUMA Flow para una sede",
      "Hasta dos campañas de anuncios en Instagram y Facebook",
      "Hasta cuatro imágenes publicitarias al mes",
      "Revisamos que el anuncio lleve claramente a tu WhatsApp o reservas",
      "Ves las consultas y si tu equipo les dio seguimiento",
      "Revisión semanal y resumen mensual",
    ],
    boundaries: "Para una sede. No incluye el dinero de anuncios, bot con IA, página nueva, licencias ni desarrollos personalizados.",
    action: "Elegir crecimiento",
  },
] as const;

export type PricingPlanId = (typeof pricingPlans)[number]["id"];
export type PricingPlan = (typeof pricingPlans)[number];

export const individualServices = [
  {
    id: "meta-ads", name: "Anuncios en Instagram y Facebook", category: "Captación",
    setup: 2900, monthly: 3900, from: false,
    detail: "Creamos y revisamos una campaña con hasta dos imágenes al mes. El dinero de los anuncios se paga aparte.",
  },
  {
    id: "google-ads", name: "Anuncios en Google", category: "Captación",
    setup: 3500, monthly: 4900, from: true,
    detail: "Preparamos anuncios para búsquedas de tus servicios. Presupuesto publicitario aparte; alcance por validar.",
  },
  {
    id: "crm-gestionado", name: "Organizar clientes y dar seguimiento (CRM)", category: "Atención",
    setup: 5900, monthly: 2900, from: false,
    detail: "Organizamos quién te escribe, qué busca, quién le responde y qué sigue. Incluye hasta dos tareas automáticas sencillas; licencias aparte.",
  },
  {
    id: "chatbot-guiado", name: "Respuestas automáticas con opciones (sin IA)", category: "Atención",
    setup: 3900, monthly: 1190, from: true,
    detail: "Un menú de respuestas predefinidas para preguntas frecuentes; permite pasar a una persona si el canal lo admite.",
  },
  {
    id: "chatbot-ia", name: "Asistente de WhatsApp con IA", category: "Atención",
    setup: 14900, monthly: 3900, from: true,
    detail: "Un asistente que responde preguntas y puede pasar la conversación a tu equipo. Requiere revisión del canal y costos externos.",
  },
  {
    id: "reservas", name: "Configurar tus reservas actuales", category: "Operación",
    setup: 2900, monthly: 0, from: false,
    detail: "Ponemos a punto el sistema de horarios y reservas que ya utilizas, para una sede, sin crear una plataforma nueva.",
  },
  {
    id: "automatizacion", name: "Automatizar una tarea repetitiva", category: "Operación",
    setup: 3900, monthly: 0, from: true,
    detail: "Un proceso sencillo, como preparar un aviso o actualizar una lista, sujeto a permisos y herramientas disponibles.",
  },
  {
    id: "seo-local", name: "Mejorar tu presencia en Google (SEO local)", category: "Presencia",
    setup: 2900, monthly: 1990, from: true,
    detail: "Revisamos cómo aparece tu negocio en Google y mejoramos la información disponible. No garantizamos posiciones.",
  },
  {
    id: "landing", name: "Página para recibir consultas (landing)", category: "Presencia",
    setup: 5900, monthly: 0, from: false,
    detail: "Una página clara sobre un servicio, con acceso a WhatsApp o formulario. Mantenimiento opcional.",
  },
  {
    id: "web", name: "Sitio web para tu negocio", category: "Presencia",
    setup: 14900, monthly: 0, from: true,
    detail: "De cuatro a seis páginas para presentar tu negocio, servicios y contacto. Funciones según alcance.",
  },
  {
    id: "crm-medida", name: "CRM hecho a medida para tu negocio", category: "Desarrollo",
    setup: 49900, monthly: 0, from: true,
    detail: "Creamos un sistema para tus procesos, después de definir funciones, acceso del equipo, seguridad y soporte.",
  },
  {
    id: "mantenimiento-crm", name: "Soporte para tu CRM a medida", category: "Desarrollo",
    setup: 0, monthly: 2990, from: true,
    detail: "Seguimiento técnico y mantenimiento base sujeto a infraestructura, uso y alcance.",
  },
  {
    id: "app", name: "Aplicación móvil para tu negocio", category: "Desarrollo",
    setup: 90000, monthly: 0, from: true,
    detail: "Proyecto evaluado por funciones y plataformas; publicación en tiendas aparte.",
  },
] as const;

export type IndividualServiceId = (typeof individualServices)[number]["id"];
export type IndividualService = (typeof individualServices)[number];

export const pricingFaqs = [
  {
    q: "¿Qué es un CRM y para qué me serviría?",
    a: "Es un lugar para organizar las personas que preguntan por tu negocio: su nombre, qué necesitan, quién les respondió y cuál es el siguiente paso. Por ejemplo, después de preguntar por una clase de prueba, tu equipo puede marcar si ya le compartió horarios o si necesita darle seguimiento. SUMA Flow configura una herramienta existente; no contesta automáticamente los mensajes sin integraciones aprobadas.",
  },
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
