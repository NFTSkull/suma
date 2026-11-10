import { site } from "@/content/site";

/**
 * Contexto comercial en el mensaje prellenado de WhatsApp.
 * Utilizar exclusivamente etiquetas públicas de catálogo; nunca nombres,
 * correos, teléfonos, preguntas libres ni datos personales.
 */
export function whatsappUrlFor({
  service,
  industry,
  challenge,
}: {
  service?: string;
  industry?: string;
  challenge?: string;
} = {}): string {
  const details = [
    service ? `servicio: ${service}` : null,
    industry ? `negocio: ${industry}` : null,
    challenge ? `necesidad: ${challenge}` : null,
  ].filter(Boolean);

  if (!details.length) return site.contact.whatsappUrl;

  const message = `Hola, vi SUMA STUDIO. Me interesa platicar sobre mi proyecto (${details.join("; ")}). ¿Podemos conversar?`;
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
