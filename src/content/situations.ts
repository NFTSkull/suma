import type { ServiceSlug } from "@/types/content";

export type Situation = {
  id: string;
  number: string;
  title: string;
  explanation: string;
  solution: { service: ServiceSlug; label: string; text: string };
};

export const situations: Situation[] = [
  {
    id: "mensajes",
    number: "01",
    title: "Terminas una clase y tienes muchos mensajes sin responder.",
    explanation: "Las preguntas sobre horarios, precios y disponibilidad llegan justo cuando estás atendiendo. Cuando por fin respondes, algunas personas ya reservaron en otro lugar.",
    solution: { service: "chatbots", label: "Asistente inteligente", text: "Responde lo frecuente en cualquier horario y te pasa lo importante con contexto." },
  },
  {
    id: "reservas",
    number: "02",
    title: "Tus reservas viven entre WhatsApp, notas y calendarios.",
    explanation: "Cada herramienta tiene una parte de la información y nadie tiene la imagen completa. Un cambio de horario se convierte en varias tareas.",
    solution: { service: "crm", label: "CRM personalizado", text: "Reservas, clientes y membresías en un solo lugar, visibles para tu equipo." },
  },
  {
    id: "clientes",
    number: "03",
    title: "Quieres conocer mejor a tus clientes, pero la información está dispersa.",
    explanation: "Sabes que hay clientes frecuentes y otros que dejaron de venir, pero reunir esa información toma demasiado tiempo.",
    solution: { service: "crm", label: "CRM personalizado", text: "Historial, preferencias y seguimiento de cada persona, listos cuando los necesitas." },
  },
  {
    id: "web",
    number: "04",
    title: "Tu negocio es hermoso, pero tu página web no le hace justicia.",
    explanation: "Lo que se siente en tu espacio no se percibe en línea. Las personas no encuentran horarios, precios ni cómo reservar.",
    solution: { service: "paginas-web", label: "Página web", text: "Un sitio editorial, rápido y claro que transmite la calidad de tu experiencia." },
  },
  {
    id: "publicidad",
    number: "05",
    title: "Publicas constantemente y no sabes qué genera consultas reales.",
    explanation: "El contenido requiere tiempo y energía, pero es difícil saber qué publicaciones o anuncios atraen a nuevos clientes.",
    solution: { service: "publicidad-digital", label: "Publicidad digital", text: "Campañas con objetivo claro y medición de consultas para decidir con información." },
  },
  {
    id: "app",
    number: "06",
    title: "Quieres ofrecer membresías, reservas y beneficios desde una aplicación.",
    explanation: "Tus clientes quieren resolver todo desde su teléfono y tu marca merece estar ahí con su propia identidad.",
    solution: { service: "aplicaciones-moviles", label: "Aplicación móvil", text: "Reservas, membresías y novedades en una app con la identidad de tu negocio." },
  },
];
