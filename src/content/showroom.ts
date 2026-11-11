import type { IndividualServiceId } from "@/content/pricing";

/** Conceptos para el showroom. No son integraciones reales ni funcionalidades contratadas. */
export const showroomExperiences = [
  {
    id: "crm",
    title: "CRM y seguimiento",
    category: "Operación",
    serviceId: "crm-gestionado",
    lead: "Mira quién te escribió, quién le responde y qué queda por hacer.",
    detail: "CRM es un lugar para organizar las consultas. Puedes empezar con una herramienta existente; no necesitas crear software desde cero.",
    href: "/servicios/crm",
  },
  {
    id: "chatbot",
    title: "Chatbot para WhatsApp",
    category: "Atención",
    serviceId: "chatbot-ia",
    lead: "Haz clic en una pregunta para ver cómo podría responder un asistente.",
    detail: "Es una conversación ficticia: conectar tu WhatsApp y la IA requiere permisos y revisión técnica.",
    href: "/servicios/chatbots",
  },
  {
    id: "ads",
    title: "Campañas digitales",
    category: "Captación",
    serviceId: "meta-ads",
    lead: "Compara dos ejemplos de anuncios que llevan a tu WhatsApp o reservas.",
    detail: "Creativos ilustrativos, sin promesas de alcance o resultados.",
    href: "/servicios/publicidad-digital",
  },
  {
    id: "reservas",
    title: "Reservas y disponibilidad",
    category: "Experiencia",
    serviceId: "reservas",
    lead: "Elige un horario ficticio y descubre lo que vería tu cliente.",
    detail: "No sustituye plataformas de reservas; requiere permisos para integrar.",
    href: "/industrias/yoga-pilates",
  },
  {
    id: "web",
    title: "Sitio web o landing",
    category: "Presencia",
    serviceId: "landing",
    lead: "Prueba el botón de una página diseñada con el estilo de tu negocio.",
    detail: "La web es opcional si ya tienes una que funciona.",
    href: "/servicios/paginas-web",
  },
  {
    id: "automatizacion",
    title: "Automatizaciones",
    category: "Operación",
    serviceId: "automatizacion",
    lead: "Ve cómo una consulta podría llegar a tu equipo y convertirse en una tarea.",
    detail: "No se envía nada automáticamente en esta demo. Para hacerlo real revisamos tus herramientas y permisos.",
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
    lead: "Imagina la pantalla que usaría tu equipo y cómo se reparten las consultas.",
    detail: "Este ejemplo no es un sistema terminado: el software propio necesita diagnóstico, presupuesto y pruebas.",
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
