import { site } from "@/content/site";
import { automationCatalog, modules, studioDisplayName, studioTypes } from "./catalog";
import type { DemoState } from "./types";

/** Resumen de la configuración para pedir una propuesta. Sin precios: SUMA cotiza después de revisarlo. */
export function configSummary(state: DemoState) {
  const c = state.config;
  const s = state.settings;
  const activeAutomations = state.automations.filter((a) => a.enabled).map((a) => automationCatalog[a.id].when.toLowerCase());
  const sections: { label: string; value: string }[] = [
    { label: "Estudio", value: `${studioDisplayName(c)} · ${studioTypes[c.type].name}` },
    { label: "Módulos", value: c.modules.length ? c.modules.map((m) => modules[m].name).join(", ") : "Ninguno" },
    { label: "Equipo y espacios", value: `${state.instructors.length} instructor${state.instructors.length === 1 ? "" : "es"}, ${state.rooms.length} sala${state.rooms.length === 1 ? "" : "s"}, ${state.branches.length} sucursal${state.branches.length === 1 ? "" : "es"}` },
    { label: "Clases", value: state.classTypes.map((t) => t.name).join(", ") },
    { label: "Paquetes", value: state.plans.filter((p) => p.enabled).map((p) => p.name).join(", ") },
    {
      label: "Reglas personalizadas",
      value: [
        `cancelación con ${s.cancellationHours} h de anticipación (${s.lateCancel === "pierde" ? "si cancela tarde pierde el crédito" : "siempre devuelve el crédito"})`,
        s.waitlist ? "lista de espera automática" : "sin lista de espera",
        `aviso de vencimiento ${s.expiryWarningDays} días antes`,
      ].join("; "),
    },
    { label: "Automatizaciones de interés", value: activeAutomations.length ? activeAutomations.join("; ") : "Ninguna por ahora" },
    { label: "Integraciones solicitadas", value: c.integrations.length ? c.integrations.join(", ") : "Ninguna por ahora" },
    { label: "Necesidades adicionales", value: c.needs.trim() || "Sin comentarios" },
  ];
  const text = ["Mi sistema en SUMA Studio OS (demostración con datos ficticios)", ...sections.map((x) => `• ${x.label}: ${x.value}`)].join("\n");
  return { sections, text };
}

/** Solo prepara el texto; WhatsApp se abre únicamente si la persona pulsa el botón. */
export function proposalWhatsAppHref(state: DemoState) {
  const message = [
    "Hola, SUMA STUDIO. Probé la demo de SUMA Studio OS y quiero una propuesta personalizada.",
    "",
    configSummary(state).text,
    "",
    "Entiendo que la demo usa datos ficticios y no incluye precios.",
  ].join("\n");
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
