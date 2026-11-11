/**
 * Precios SUMA STUDIO · Referencias MXN antes de IVA.
 * Catálogo único para tarjetas, cotizador y mensajes WhatsApp.
 * Las licencias, pauta, mensajería, IA y consumos externos NO están incluidos.
 * Precios de entrada y rangos ORIENTATIVOS para UNA empresa y UNA sede; nunca cotizaciones cerradas.
 * El software de terceros puede cobrar licencias por usuario, canal o mensaje.
 */
export const pricingSettings = {
  currency: "MXN",
  adBudgets: [1500, 3000, 6000, 9000, 12000],
  defaultAdBudget: 3000,
  websiteMaintenanceMonthly: 490,
  flexiblePaymentsMinForSix: 10000,
} as const;

export const pricingPlans = [
  {
    id: "ads",
    number: "01",
    name: "SUMA Ads",
    label: "Atraer clientes",
    tagline: "Anuncios en Facebook e Instagram sin complicaciones.",
    audience: "Para que más personas conozcan tu negocio y te escriban o reserven.",
    setup: 990,
    setupMax: 3900,
    monthly: 1990,
    monthlyMax: 4900,
    launchWindow: "3 a 5 días hábiles",
    setupIncludes: [
      "Preparamos una campaña básica para una sede.",
      "Conectamos el anuncio con tu WhatsApp o enlace de reservas.",
    ],
    monthlyIncludes: [
      "Revisamos y ajustamos una campaña dos veces al mes.",
      "Preparamos un diseño sencillo al mes y te explicamos los resultados.",
    ],
    featured: false,
    includes: [
      "1 campaña y 1 diseño sencillo al mes",
      "Revisión quincenal y resumen de resultados",
      "El dinero de los anuncios se paga aparte",
    ],
    boundaries: "Entrada para una sede y una campaña sencilla. Más campañas, diseños, video o seguimiento intensivo se cotizan aparte. No respondemos mensajes por ti.",
    action: "Consultar publicidad",
  },
  {
    id: "flow",
    number: "02",
    name: "SUMA Flow",
    label: "Organizar clientes",
    tagline: "Que ninguna consulta quede olvidada.",
    audience: "Para ordenar a las personas que preguntan por tus servicios y saber a quién dar seguimiento.",
    setup: 2490,
    setupMax: 7900,
    monthly: 1490,
    monthlyMax: 3900,
    launchWindow: "5 a 10 días hábiles",
    setupIncludes: [
      "Organizamos las consultas en un CRM existente (una lista de clientes con seguimiento).",
      "Definimos etapas y responsables para una sede.",
      "Configuramos una regla automática sencilla y te enseñamos a usarla.",
    ],
    monthlyIncludes: [
      "Revisamos el proceso una vez al mes.",
      "Un ajuste pequeño dentro del proceso y un resumen mensual.",
    ],
    featured: true,
    includes: [
      "Lista organizada de clientes y pasos para dar seguimiento",
      "1 regla automática sencilla al inicio",
      "Revisión mensual, 1 ajuste pequeño e informe",
    ],
    boundaries: "Entrada para una sede y un proceso sencillo. Más reglas, canales o sedes requieren otra cotización. No incluye licencias ni un bot que conteste solo.",
    action: "Consultar seguimiento",
  },
  {
    id: "growth",
    number: "03",
    name: "SUMA Growth",
    label: "Atraer y organizar",
    tagline: "Publicidad y seguimiento en un mismo plan.",
    audience: "Para atraer nuevos interesados y llevar el control de cada consulta.",
    setup: 4990,
    setupMax: 14900,
    monthly: 3990,
    monthlyMax: 9900,
    launchWindow: "7 a 15 días hábiles",
    setupIncludes: [
      "Configuramos el proceso básico de SUMA Flow para una sede.",
      "Preparamos una campaña inicial en Facebook e Instagram.",
    ],
    monthlyIncludes: [
      "Revisamos las consultas y su seguimiento una vez al mes.",
      "Gestionamos una campaña, hasta dos diseños sencillos al mes y un resumen.",
    ],
    featured: false,
    includes: [
      "Lo esencial de Flow + 1 campaña de anuncios",
      "Hasta 2 diseños sencillos al mes",
      "Revisiones y resumen mensual",
    ],
    boundaries: "El precio desde es para una sede, una regla sencilla y una campaña. Más anuncios o automatizaciones elevan el presupuesto. Pauta, licencias y bot IA aparte.",
    action: "Consultar plan completo",
  },
] as const;

export type PricingPlanId = (typeof pricingPlans)[number]["id"];
export type PricingPlan = (typeof pricingPlans)[number];

export const individualServices = [
  {
    id: "meta-ads", name: "Anuncios en Facebook e Instagram", category: "Captación",
    setup: 990, setupMax: 3900, monthly: 1990, monthlyMax: 4900, from: true,
    detail: "1 campaña sencilla y 1 diseño al mes, con revisión y resumen. El presupuesto de anuncios va aparte.",
  },
  {
    id: "google-ads", name: "Anuncios en Google", category: "Captación",
    setup: 1490, setupMax: 4900, monthly: 2490, monthlyMax: 5900, from: true,
    detail: "Una campaña de búsqueda sencilla, ajustes e informe mensual. El presupuesto de anuncios va aparte.",
  },
  {
    id: "crm-gestionado", name: "Organizar clientes (CRM)", category: "Atención",
    setup: 2490, setupMax: 7900, monthly: 1490, monthlyMax: 3900, from: true,
    detail: "Ordenamos consultas, seguimiento y una regla automática sencilla en un CRM existente. Licencias aparte.",
  },
  {
    id: "chatbot-guiado", name: "Menú de respuestas automáticas (sin IA)", category: "Atención",
    setup: 1490, setupMax: 4900, monthly: 590, monthlyMax: 1490, from: true,
    detail: "Opciones para dudas frecuentes y paso a una persona, en canal compatible. Plataforma y mensajes aparte.",
  },
  {
    id: "chatbot-ia", name: "Asistente con IA para WhatsApp", category: "Atención",
    setup: 6900, setupMax: 24900, monthly: 1990, monthlyMax: 6900, from: true,
    detail: "Versión básica: preguntas frecuentes, respuestas con IA y paso al equipo. API oficial y consumos aparte.",
  },
  {
    id: "reservas", name: "Configurar agenda de reservas", category: "Operación",
    setup: 990, setupMax: 3900, monthly: 0, monthlyMax: 0, from: true,
    detail: "Configuración básica de una agenda ya existente. No creamos software nuevo; licencia aparte.",
  },
  {
    id: "automatizacion", name: "Una tarea automática", category: "Operación",
    setup: 1490, setupMax: 6900, monthly: 0, monthlyMax: 0, from: true,
    detail: "Una acción sencilla: aviso de cita o seguimiento. Herramientas y consumos aparte.",
  },
  {
    id: "seo-local", name: "Ayudarte a aparecer en Google (SEO local)", category: "Presencia",
    setup: 990, setupMax: 3900, monthly: 990, monthlyMax: 3990, from: true,
    detail: "Revisamos tu presencia local y actualizamos información básica; seguimiento mensual sin garantías de posición.",
  },
  {
    id: "landing", name: "Página sencilla para recibir clientes", category: "Presencia",
    setup: 2990, setupMax: 8900, monthly: 0, monthlyMax: 0, from: true,
    detail: "Una página para celular con información, WhatsApp o formulario. Hosting y dominio aparte.",
  },
  {
    id: "web", name: "Página web para tu negocio", category: "Presencia",
    setup: 6990, setupMax: 19900, monthly: 0, monthlyMax: 0, from: true,
    detail: "Desde tres páginas informativas sencillas. Más páginas, tienda, reservas o funciones se cotizan aparte.",
  },
  {
    id: "crm-medida", name: "Sistema de clientes hecho a medida", category: "Desarrollo",
    setup: 29900, setupMax: 129000, monthly: 0, monthlyMax: 0, from: true,
    detail: "Desde un módulo básico a medida. Alcance, seguridad, acceso y soporte sujetos a cotización.",
  },
  {
    id: "mantenimiento-crm", name: "Soporte para sistemas a medida", category: "Desarrollo",
    setup: 0, setupMax: 0, monthly: 1490, monthlyMax: 6900, from: true,
    detail: "Revisión y correcciones básicas según contrato. Sin nuevas funciones ni servidores.",
  },
  {
    id: "app", name: "Aplicación móvil a medida", category: "Desarrollo",
    setup: 59000, setupMax: 189000, monthly: 0, monthlyMax: 0, from: true,
    detail: "Desde una app sencilla para una plataforma. Publicación en tiendas y mantenimiento aparte.",
  },
] as const;

/** Plazos orientativos, no comprometidos hasta confirmar alcance, insumos y accesos. */
export const individualServiceDeliveryTimes: Record<(typeof individualServices)[number]["id"], string> = {
  "meta-ads": "3 a 5 días hábiles",
  "google-ads": "5 a 8 días hábiles",
  "crm-gestionado": "5 a 10 días hábiles",
  "chatbot-guiado": "5 a 10 días hábiles",
  "chatbot-ia": "2 a 4 semanas, sujeto a integración y autorizaciones",
  "reservas": "2 a 5 días hábiles",
  "automatizacion": "3 a 7 días hábiles",
  "seo-local": "5 a 10 días hábiles para el arranque",
  "landing": "4 a 10 días hábiles",
  "web": "10 a 20 días hábiles",
  "crm-medida": "A definir después del diagnóstico técnico",
  "mantenimiento-crm": "Inicio sujeto a revisión de la herramienta",
  "app": "A definir después del diagnóstico técnico",
};

export type IndividualServiceId = (typeof individualServices)[number]["id"];
export type IndividualService = (typeof individualServices)[number];

export const pricingFaqs = [
  {
    q: "¿Qué significa «desde» y por qué hay un rango?",
    a: "«Desde» es el precio mínimo para la versión sencilla que describimos. El rango es una guía para proyectos de tamaño pequeño o mediano. Si necesitas más campañas, páginas, reglas o sedes, revisamos tu caso y te enviamos el precio final antes de empezar. El rango no es un máximo garantizado.",
  },
  {
    q: "¿Qué pago una vez y qué pago cada mes?",
    a: "El pago inicial sirve para preparar o crear lo contratado. La mensualidad cubre el trabajo de cada mes según el plan; no incluye cambios ilimitados. Si eliges solo una página web o una tarea automática, no hay mensualidad de SUMA obligatoria.",
  },
  {
    q: "¿Puedo dividir el pago inicial?",
    a: "Puedes solicitar 3 pagos de implementación, o 6 cuando el proyecto inicial es de al menos $10,000. Está sujeto a acuerdo escrito. Cada mensualidad del servicio sigue cobrándose por separado. Los importes del calculador son mínimos orientativos, no una financiación aprobada.",
  },
  {
    q: "¿En cuánto tiempo estará listo?",
    a: "Como referencia: Ads 3 a 5 días hábiles, Flow 5 a 10 y Growth 7 a 15. Los plazos empiezan cuando recibimos accesos, materiales y aprobaciones; terceros como Meta pueden tardar más. La fecha exacta se acuerda en la propuesta.",
  },
  {
    q: "¿La página web tiene cuota mensual?",
    a: "No hay mensualidad obligatoria de SUMA por crear una landing o web. El dominio, el alojamiento (hosting), mantenimiento y futuras mejoras se pagan aparte cuando correspondan. Revisiones, garantía y entrega se confirman por escrito.",
  },
  {
    q: "¿Si cancelo, qué pasa con mi información?",
    a: "Antes de contratar acordamos por escrito el plazo, cancelación, accesos y entrega de información. Si usas un software de otra empresa, su licencia y sus reglas se pagan y aplican por separado.",
  },
  {
    q: "¿SUMA cobra por cada persona que usa el CRM?",
    a: "No cobramos una tarifa extra de SUMA por integrante dentro del alcance acordado. Algunos CRM externos sí cobran licencias por usuario; te avisamos antes. Más personas no significa mensajes ni automatizaciones ilimitados.",
  },
  {
    q: "¿Me entregan un CRM propio?",
    a: "Flow organiza tu negocio usando un programa existente, no construye un software nuevo. Si necesitas un CRM hecho especialmente para ti, cotizamos desarrollo a medida desde $29,900 según las funciones.",
  },
  {
    q: "¿Qué gastos van aparte?",
    a: "El dinero para mostrar anuncios, licencias del CRM o agenda, hosting, dominio, WhatsApp API y mensajes, uso de IA y funciones extra. Te los explicamos antes de contratar. Las conexiones con Wellhub, TotalPass o reservadores requieren validar permisos.",
  },
  {
    q: "¿Flow o Growth incluyen un chatbot que contesta solo?",
    a: "No. Incluyen organización de consultas y una regla automática sencilla en el nivel de entrada. Un menú de respuestas o un asistente con IA se cotiza aparte, según el canal y los mensajes necesarios.",
  },
] as const;
