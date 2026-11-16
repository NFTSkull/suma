import { site } from "@/content/site";
import { automationCopy, integrationOptions, moduleIds, studioDisplayName } from "./catalog";
import type { DemoState } from "./types";
import { capabilitiesOf, moduleCopy, plural, termsOf, verticalOf } from "./verticals";

/**
 * Resumen comercial de la configuración para pedir una propuesta.
 * Sin precios de SUMA: se cotiza después de revisar el caso. Distingue lo que
 * funciona en la simulación de lo que se desarrollaría (integraciones).
 */
export function configSummary(state: DemoState) {
  const c = state.config;
  const v = verticalOf(c);
  const t = termsOf(c);
  const caps = capabilitiesOf(c);
  const s = state.settings;
  const chosen = moduleIds.filter((m) => c.modules.includes(m));
  const extra = moduleIds.filter((m) => !c.modules.includes(m));
  const activeAutomations = state.automations.filter((a) => a.enabled).map((a) => automationCopy(a.id, t).name);
  const modality = caps.mode === "hibrido" ? "sesiones individuales y actividades grupales" : caps.mode === "citas" ? "citas individuales por especialista y espacio" : "clases grupales con cupo";

  const sections: { label: string; value: string }[] = [
    { label: "Negocio", value: `${studioDisplayName(c)} · ${v.name}` },
    { label: "Cómo opera", value: `${modality}; ${plural(state.instructors.length, t.staff)}, ${plural(state.rooms.length, t.space)}${state.branches.length > 1 ? `, ${state.branches.length} sucursales` : ""}` },
    { label: `Lo que ofrece`, value: state.classTypes.map((x) => x.name).join(", ") },
    { label: "Cómo vende", value: [caps.appointments ? `pago por ${t.offering.one}` : null, ...state.plans.filter((p) => p.enabled).map((p) => p.name)].filter(Boolean).join(", ") || "Por definir" },
    { label: "Lo que quiere controlar", value: chosen.length ? chosen.map((m) => moduleCopy(m, c).name).join(", ") : "Por definir" },
    {
      label: "Reglas personalizadas",
      value: [
        `cancelación con ${s.cancellationHours} h de anticipación`,
        caps.waitlist ? (s.waitlist ? "lista de espera automática" : "sin lista de espera") : null,
        `aviso de vencimiento ${s.expiryWarningDays} días antes`,
      ].filter(Boolean).join("; "),
    },
    { label: "Automatizaciones de interés", value: activeAutomations.length ? activeAutomations.join("; ") : "Ninguna por ahora" },
    { label: "Integraciones a cotizar", value: c.integrations.length ? c.integrations.join(", ") : "Ninguna por ahora" },
    { label: "Necesidades adicionales", value: c.needs.trim() || "Sin comentarios" },
  ];

  /** Lo que se probó en la demo (simulado, con datos ficticios). */
  const included = [
    caps.groups ? "Agenda de clases con cupo, lista de espera y asistencia" : null,
    caps.appointments ? `Agenda de ${t.booking.many} sin empalmes de ${t.staff.one} ni ${t.space.one}` : null,
    `Fichas de ${t.client.many} con historial y seguimiento`,
    `${t.plans} con ${t.credit.many}, vencimientos y renovaciones`,
    "Pagos, pendientes e ingresos por periodo",
    "Reportes que se recalculan solos",
    `Portal para ${t.client.many}`,
  ].filter(Boolean) as string[];
  const additional = extra.map((m) => moduleCopy(m, c).name);
  const integrations = integrationOptions.filter((x) => !c.integrations.includes(x));
  const benefits = [
    caps.appointments ? "Menos huecos y cero empalmes en la agenda" : "Clases llenas sin sobrecupo ni dobles reservas",
    `Saber en un vistazo qué ${t.client.many} necesitan seguimiento`,
    "Cobros y pendientes claros cada semana",
    "Recordatorios y seguimientos preparados por el sistema",
  ];

  const text = [
    `Mi negocio en SUMA Wellness OS (demostración con datos ficticios)`,
    ...sections.map((x) => `• ${x.label}: ${x.value}`),
  ].join("\n");
  return { sections, included, additional, integrations, benefits, text };
}

/** Solo prepara el texto; WhatsApp se abre únicamente si la persona pulsa el botón. */
export function proposalWhatsAppHref(state: DemoState) {
  const message = [
    "Hola, SUMA STUDIO. Configuré mi negocio en la demo de SUMA Wellness OS y quiero una propuesta.",
    "",
    configSummary(state).text,
    "",
    "Entiendo que la demo usa datos ficticios, no incluye precios y que las integraciones se cotizan aparte.",
  ].join("\n");
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
