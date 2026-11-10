import type { IndividualServiceId } from "@/content/pricing";

/** Conceptos para el showroom. No son integraciones reales ni funcionalidades contratadas. */
export const showroomExperiences = [
  {
    id: "crm",
    title: "CRM y seguimiento",
    category: "Operación",
    serviceId: "crm-gestionado",
    lead: "Visualiza tus interesados, responsables y próximos pasos.",
    detail: "Un embudo claro que aprovecha tus herramientas existentes.",
    href: "/servicios/crm",
  },
  {
    id: "chatbot",
    title: "Chatbot para WhatsApp",
    category: "Atención",
    serviceId: "chatbot-ia",
    lead: "Prueba una conversación de ejemplo con respuestas y transferencia al equipo.",
    detail: "Respuestas simuladas; conectar WhatsApp e IA requiere revisión técnica.",
    href: "/servicios/chatbots",
  },
  {
    id: "ads",
    title: "Campañas digitales",
    category: "Captación",
    serviceId: "meta-ads",
    lead: "Mira cómo podría verse un anuncio de tu negocio.",
    detail: "Creativos ilustrativos, sin promesas de alcance o resultados.",
    href: "/servicios/publicidad-digital",
  },
  {
    id: "reservas",
    title: "Reservas y disponibilidad",
    category: "Experiencia",
    serviceId: "reservas",
    lead: "Simula el recorrido desde consultar horarios hasta solicitar una clase.",
    detail: "No sustituye plataformas de reservas; requiere permisos para integrar.",
    href: "/industrias/yoga-pilates",
  },
  {
    id: "web",
    title: "Sitio web o landing",
    category: "Presencia",
    serviceId: "landing",
    lead: "Previsualiza una portada sencilla adaptada a tu marca.",
    detail: "La web es opcional si ya tienes una que funciona.",
    href: "/servicios/paginas-web",
  },
  {
    id: "automatizacion",
    title: "Automatizaciones",
    category: "Operación",
    serviceId: "automatizacion",
    lead: "Explora un flujo de seguimiento después de una consulta.",
    detail: "Proceso ilustrativo; el disparador real depende de tus herramientas.",
    href: "/soluciones",
  },
  {
    id: "app",
    title: "Aplicación para alumnos",
    category: "Desarrollo",
    serviceId: "app",
    lead: "Imagina una aplicación para tus clases y membresías.",
    detail: "Concepto visual. El desarrollo se cotiza según funciones y plataformas.",
    href: "/servicios/aplicaciones-moviles",
  },
  {
    id: "seo",
    title: "Presencia en Google",
    category: "Visibilidad",
    serviceId: "seo-local",
    lead: "Previsualiza cómo presentarías tu negocio en una búsqueda local.",
    detail: "Ilustración de un resultado, no una promesa de posición o ficha creada.",
    href: "/precios",
  },
  {
    id: "crm-medida",
    title: "CRM a medida",
    category: "Desarrollo",
    serviceId: "crm-medida",
    lead: "Visualiza módulos, roles y vistas pensadas para tu operación.",
    detail: "Un producto propio requiere definición de alcance, infraestructura y seguridad.",
    href: "/servicios/crm",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  category: string;
  serviceId: IndividualServiceId;
  lead: string;
  detail: string;
  href: string;
}>;

export type ShowroomExperienceId = (typeof showroomExperiences)[number]["id"];

export const showroomIndustries = [
  { id: "pilates", name: "Pilates / yoga", example: "Estudio Aurora", offering: "Clase de Reformer", cta: "Conoce nuestras clases" },
  { id: "spa", name: "Spa / wellness", example: "Aura Wellness", offering: "Ritual de bienestar", cta: "Descubre experiencias" },
  { id: "fitness", name: "Fitness boutique", example: "Movimiento Club", offering: "Clase de prueba", cta: "Explora horarios" },
  { id: "beauty", name: "Estética / belleza", example: "Casa Lumina", offering: "Tu primera experiencia", cta: "Solicitar información" },
  { id: "other", name: "Otro negocio", example: "Mi Estudio", offering: "Servicio destacado", cta: "Conoce más" },
] as const;

export type ShowroomIndustryId = (typeof showroomIndustries)[number]["id"];

export const showroomPalettes = [
  { id: "suma", label: "Azul editorial", base: "bg-suma-navy", light: "bg-suma-cream", text: "text-suma-navy", accent: "bg-suma-orange", accentText: "text-suma-orange" },
  { id: "almendra", label: "Almendra", base: "bg-[#4D453D]", light: "bg-[#F6F0E5]", text: "text-[#4D453D]", accent: "bg-[#C3A17B]", accentText: "text-[#C3A17B]" },
  { id: "salvia", label: "Salvia", base: "bg-[#294E42]", light: "bg-[#EEF3EB]", text: "text-[#294E42]", accent: "bg-[#B5D4AD]", accentText: "text-[#B5D4AD]" },
] as const;

export type ShowroomPaletteId = (typeof showroomPalettes)[number]["id"];
