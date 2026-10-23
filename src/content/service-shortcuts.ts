import type { ServiceSlug } from "@/types/content";

export type ServiceShortcut = { label: string; service: ServiceSlug };

/** Necesidades del selector de "Lo que hacemos", en el mismo orden que las tarjetas. */
export const serviceShortcuts: readonly ServiceShortcut[] = [
  { label: "Responder mensajes", service: "chatbots" },
  { label: "Organizar clientes y citas", service: "crm" },
  { label: "Crear una experiencia móvil", service: "aplicaciones-moviles" },
  { label: "Mejorar mi página web", service: "paginas-web" },
  { label: "Atraer más clientes", service: "publicidad-digital" },
];

/** Id estable de la tarjeta de cada servicio en la home. */
export const capabilityAnchorId = (slug: ServiceSlug) => `servicio-${slug}`;
