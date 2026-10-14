import type { ServiceSlug } from "@/types/content";

export const businessOptions = [
  { id: "yoga-pilates", label: "Yoga, Pilates o Barre" },
  { id: "spa", label: "Spa o centro de bienestar" },
  { id: "fitness", label: "Fitness boutique" },
  { id: "marca", label: "Marca o tienda wellness" },
  { id: "retiros", label: "Experiencias y retiros" },
  { id: "otro", label: "Otro" },
] as const;

export const challengeOptions = [
  { id: "consultas", label: "Recibo muchas consultas y no puedo responder todas." },
  { id: "orden", label: "Necesito ordenar mis citas y clientes." },
  { id: "vender", label: "Quiero vender más o atraer nuevos clientes." },
  { id: "web", label: "Necesito una página web." },
  { id: "app", label: "Quiero desarrollar una aplicación." },
  { id: "conectar", label: "Necesito conectar varias herramientas." },
] as const;

export type BusinessId = (typeof businessOptions)[number]["id"];
export type ChallengeId = (typeof challengeOptions)[number]["id"];

export type Recommendation = {
  service: ServiceSlug;
  /** Por qué encaja con lo que eligió la persona. */
  why: string;
  /** Qué problema concreto aborda. */
  problem: string;
};

export type SelectorRule = {
  challenge: ChallengeId;
  /** Si se omite, la regla aplica a cualquier tipo de negocio. */
  business?: BusinessId[];
  summary: string;
  recommendations: Recommendation[];
};

/**
 * Reglas transparentes y editables. Se elige la regla más específica:
 * primero la que coincide con negocio + reto; si no existe, la genérica del reto.
 */
export const selectorRules: SelectorRule[] = [
  // ── Consultas ──────────────────────────────────────────────
  {
    challenge: "consultas",
    business: ["yoga-pilates"],
    summary:
      "Podrías comenzar con un asistente digital que responda preguntas frecuentes y facilite las solicitudes de reserva. Más adelante podemos conectarlo con un sistema de gestión.",
    recommendations: [
      { service: "chatbots", why: "Responde horarios, niveles y disponibilidad de clases mientras estás en el estudio.", problem: "Mensajes acumulados al terminar cada clase." },
      { service: "crm", why: "Cuando el volumen crezca, las solicitudes pueden registrarse directo en tu sistema de alumnos.", problem: "Reservas repartidas entre chats y notas." },
    ],
  },
  {
    challenge: "consultas",
    business: ["spa"],
    summary:
      "Un asistente con el tono cálido de tu spa puede presentar tratamientos y recibir solicitudes de cita mientras estás en cabina.",
    recommendations: [
      { service: "chatbots", why: "Presenta tu menú de tratamientos y recibe solicitudes con la información necesaria.", problem: "Consultas sin respuesta durante las sesiones." },
      { service: "crm", why: "Las solicitudes llegan a una agenda ordenada con historial del cliente.", problem: "Citas pendientes de confirmar." },
    ],
  },
  {
    challenge: "consultas",
    business: ["marca"],
    summary:
      "Un asistente puede resolver dudas de producto, envíos y uso antes de la compra, y tu sitio puede responder lo esencial desde la primera visita.",
    recommendations: [
      { service: "chatbots", why: "Resuelve dudas sobre ingredientes, envíos y formas de uso en cualquier horario.", problem: "Compras que se detienen por una duda sin respuesta." },
      { service: "paginas-web", why: "Fichas de producto claras reducen las preguntas repetidas.", problem: "Información de producto incompleta." },
    ],
  },
  {
    challenge: "consultas",
    business: ["retiros"],
    summary:
      "Un asistente puede explicar qué incluye cada experiencia y registrar a los interesados, mientras una página de experiencia responde lo esencial.",
    recommendations: [
      { service: "chatbots", why: "Explica itinerario, hospedaje y cómo apartar un lugar.", problem: "Las mismas preguntas antes de cada edición." },
      { service: "paginas-web", why: "Una página de experiencia completa responde antes de que pregunten.", problem: "Información dispersa en publicaciones." },
    ],
  },
  {
    challenge: "consultas",
    summary: "Un asistente digital puede responder lo frecuente y pasarte las conversaciones que necesitan atención personal.",
    recommendations: [
      { service: "chatbots", why: "Atiende las preguntas repetidas con la información que tú defines.", problem: "Mensajes sin responder a tiempo." },
      { service: "crm", why: "Registra cada solicitud para darle seguimiento.", problem: "Interesados que se olvidan entre conversaciones." },
    ],
  },
  // ── Orden ──────────────────────────────────────────────────
  {
    challenge: "orden",
    business: ["spa"],
    summary: "Un CRM diseñado para tu spa puede coordinar cabinas, terapeutas e historial de cada cliente en una sola vista.",
    recommendations: [
      { service: "crm", why: "Agenda por cabina y terapeuta, con preferencias y tratamientos anteriores.", problem: "Citas y datos de clientes en lugares distintos." },
      { service: "chatbots", why: "Envía confirmaciones y recordatorios para reducir ausencias.", problem: "Confirmaciones manuales de último minuto." },
    ],
  },
  {
    challenge: "orden",
    business: ["yoga-pilates", "fitness"],
    summary: "Un sistema para alumnos, paquetes y asistencias te da claridad, y más adelante tus clientes pueden consultarlo desde una app.",
    recommendations: [
      { service: "crm", why: "Paquetes, clases restantes, asistencias y listas de espera en un solo lugar.", problem: "Membresías y reservas difíciles de controlar." },
      { service: "aplicaciones-moviles", why: "Tus clientes consultan y reservan sin escribirte.", problem: "Mensajes operativos repetitivos." },
    ],
  },
  {
    challenge: "orden",
    summary: "Un CRM personalizado puede reunir clientes, citas y seguimientos en un solo lugar diseñado para tu operación.",
    recommendations: [
      { service: "crm", why: "Organiza la información que hoy vive en varias herramientas.", problem: "Datos dispersos y tareas olvidadas." },
    ],
  },
  // ── Vender ─────────────────────────────────────────────────
  {
    challenge: "vender",
    business: ["marca"],
    summary: "Una campaña de producto conectada con una tienda en línea bien diseñada es un buen punto de partida.",
    recommendations: [
      { service: "publicidad-digital", why: "Campañas de producto dirigidas a personas afines a tu marca.", problem: "Productos que no llegan a nuevos compradores." },
      { service: "paginas-web", why: "Una tienda que cuenta la historia de cada producto convierte mejor el interés.", problem: "Visitas que no se convierten en compras." },
      { service: "crm", why: "Seguimiento de compradores para impulsar recompras.", problem: "Clientes que compran una sola vez." },
    ],
  },
  {
    challenge: "vender",
    business: ["yoga-pilates", "fitness"],
    summary: "Campañas de clase de prueba con una página de reserva clara pueden atraer nuevos alumnos cerca de tu estudio.",
    recommendations: [
      { service: "publicidad-digital", why: "Anuncios de clase muestra para personas en tu zona.", problem: "Clases y horarios que no se llenan." },
      { service: "paginas-web", why: "Una landing con reserva directa convierte el interés en visitas.", problem: "Interesados que no saben cómo reservar." },
    ],
  },
  {
    challenge: "vender",
    summary: "Una estrategia de publicidad digital con una página enfocada puede conectar tu oferta con las personas adecuadas.",
    recommendations: [
      { service: "publicidad-digital", why: "Campañas con objetivo claro y medición de consultas.", problem: "No saber qué genera nuevos clientes." },
      { service: "paginas-web", why: "Una página que explica tu oferta y facilita el contacto.", problem: "Visitas que no se convierten." },
    ],
  },
  // ── Web ────────────────────────────────────────────────────
  {
    challenge: "web",
    business: ["marca"],
    summary: "Una tienda en línea con identidad propia puede ser el centro de tu experiencia digital.",
    recommendations: [
      { service: "paginas-web", why: "Ecommerce con fichas de producto, rituales y una compra sencilla.", problem: "Una tienda genérica que no refleja tu marca." },
      { service: "publicidad-digital", why: "Cuando la tienda esté lista, campañas para atraer compradores.", problem: "Poco tráfico hacia la tienda." },
    ],
  },
  {
    challenge: "web",
    summary: "Un sitio editorial, rápido y claro puede transmitir la calidad de tu experiencia y facilitar el primer contacto.",
    recommendations: [
      { service: "paginas-web", why: "Diseño a la altura de tu espacio, pensado primero para el celular.", problem: "Una presencia digital que no te representa." },
      { service: "chatbots", why: "Un asistente en tu sitio puede responder mientras exploran.", problem: "Visitantes con dudas que se van sin preguntar." },
    ],
  },
  // ── App ────────────────────────────────────────────────────
  {
    challenge: "app",
    summary: "Una app con tu identidad puede acompañar a tus clientes, y necesita un sistema detrás que organice reservas y membresías.",
    recommendations: [
      { service: "aplicaciones-moviles", why: "Reservas, membresías y novedades en el teléfono de tus clientes.", problem: "Una relación que termina al salir de tu espacio." },
      { service: "crm", why: "La base que organiza la información que la app muestra.", problem: "Datos sin un sistema central." },
    ],
  },
  // ── Conectar ───────────────────────────────────────────────
  {
    challenge: "conectar",
    summary: "Podemos revisar las herramientas que ya usas y conectarlas alrededor de un sistema central para que la información fluya.",
    recommendations: [
      { service: "crm", why: "Un sistema central que reúne la información de tus herramientas.", problem: "Datos duplicados y tareas manuales." },
      { service: "chatbots", why: "Las conversaciones alimentan el sistema sin copiar y pegar.", problem: "Solicitudes que se pierden entre canales." },
      { service: "paginas-web", why: "Formularios y reservas del sitio llegan al mismo lugar.", problem: "Contactos que llegan por canales aislados." },
    ],
  },
];
