import type { IndividualServiceId, PricingPlanId } from "@/content/pricing";

/**
 * Una explicación comercial simple de lo que un cliente puede hacer.
 * Es un ejemplo de alcance, no un compromiso de integración automática ni de resultados.
 */
export const planStories: Record<PricingPlanId, {
  goal: string;
  title: string;
  intro: string;
  steps: readonly [string, string, string];
  boundary: string;
}> = {
  ads: {
    goal: "Quiero que más personas me conozcan",
    title: "De un anuncio a una consulta",
    intro: "Ideal si ya tienes cómo recibir y atender los mensajes.",
    steps: [
      "Preparamos anuncios en Instagram y Facebook para tu zona.",
      "Quien tenga interés llega a tu WhatsApp o sistema de reservas.",
      "Revisamos los anuncios y ajustamos lo que podamos medir.",
    ],
    boundary: "SUMA no responde los mensajes ni incluye el dinero de los anuncios.",
  },
  flow: {
    goal: "Quiero ordenar los mensajes y no olvidar seguimientos",
    title: "De una consulta a un siguiente paso claro",
    intro: "CRM significa un lugar para organizar a tus clientes e interesados; no necesitas saber usar uno hoy.",
    steps: [
      "Registras quién preguntó, qué necesita y de dónde llegó.",
      "Tu equipo ve quién debe responder y qué tarea sigue.",
      "Puedes preparar recordatorios y revisar qué consultas siguen pendientes.",
    ],
    boundary: "Configuramos una herramienta existente; no incluye responder por ti, software propio ni licencias externas.",
  },
  growth: {
    goal: "Quiero atraer interesados y organizar su atención",
    title: "Anuncios y seguimiento en el mismo plan",
    intro: "Combina la publicidad de SUMA Ads con el orden comercial de SUMA Flow.",
    steps: [
      "Creamos anuncios para que posibles clientes conozcan tu negocio.",
      "Organizamos las consultas que tu equipo recibe y el paso siguiente.",
      "Revisamos campañas y seguimiento para encontrar oportunidades de mejora.",
    ],
    boundary: "No garantiza ventas ni conecta automáticamente plataformas; la pauta y las licencias se pagan aparte.",
  },
};

export const serviceStories: Record<IndividualServiceId, string> = {
  "meta-ads": "Anuncios de Instagram y Facebook para que más personas conozcan tu negocio.",
  "google-ads": "Anuncios en Google para aparecer ante búsquedas relevantes.",
  "crm-gestionado": "Una lista organizada de interesados: quién preguntó, quién responde y qué sigue.",
  "chatbot-guiado": "Respuestas predefinidas para preguntas comunes y opción de hablar con tu equipo.",
  "chatbot-ia": "Un asistente que puede responder preguntas y pasar conversaciones a una persona, si el canal lo permite.",
  "reservas": "Ponemos a punto tu herramienta de reservas actual sin crear otra plataforma.",
  "automatizacion": "Una tarea repetitiva puede ejecutarse con reglas acordadas, cuando exista acceso y autorización.",
  "seo-local": "Mejoramos la información y presencia de tu negocio en búsquedas locales, sin prometer posiciones.",
  "landing": "Una página sencilla para explicar tu oferta y dirigir consultas a WhatsApp o un formulario.",
  "web": "Un sitio con páginas sobre tu negocio, sus servicios y formas de contacto.",
  "crm-medida": "Un sistema para tu operación, diseñado por etapas tras definir lo que necesitas.",
  "mantenimiento-crm": "Soporte técnico para mantener un CRM a medida dentro de un alcance acordado.",
  "app": "Una aplicación propia, cuyo diseño y funciones se definen antes de cotizarla.",
};

export function describeSelectedServices(ids: readonly IndividualServiceId[]): string[] {
  return ids.slice(0, 3).map((id) => serviceStories[id]);
}
