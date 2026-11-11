import type { IndividualServiceId, PricingPlanId } from "@/content/pricing";
import { showroomExperiences, showroomIndustries, type ShowroomExperienceId, type ShowroomIndustryId } from "@/content/showroom";
import { site } from "@/content/site";
import { estimatePricing, formatMXN } from "@/lib/pricing";

export type ShowroomIntent = "quote" | "budget" | "diagnostic" | "impact";
export type ShowroomSelection = {
  businessName: string;
  industry: ShowroomIndustryId;
  experience: ShowroomExperienceId;
  serviceIds: IndividualServiceId[];
  mode?: "services" | "package";
  planId?: PricingPlanId;
  months?: number;
  adBudget?: number;
  locations: number;
  teamUsers: number;
  platform: string;
  budget?: string;
  notes?: string;
  availability?: string;
  impactSummary?: string;
};

/** Reuse the published catalog; no hidden discount, license assumption or price per seat. */
export function showroomEstimate(selection: ShowroomSelection) {
  return estimatePricing({
    mode: selection.mode ?? "services",
    planId: selection.planId ?? "flow",
    months: selection.months ?? 1,
    adBudget: selection.adBudget ?? 0,
    serviceIds: selection.serviceIds,
    locations: selection.locations,
    teamUsers: selection.teamUsers,
  });
}

export function getShowroomIndustry(id: string) {
  return showroomIndustries.find((industry) => industry.id === id) ?? showroomIndustries[0];
}
export function getShowroomExperience(id: string) {
  return showroomExperiences.find((experience) => experience.id === id) ?? showroomExperiences[0];
}

/** This prepares an editable WhatsApp message; it never submits a lead or books a meeting. */
export function showroomWhatsAppHref(selection: ShowroomSelection, intent: ShowroomIntent) {
  const q = showroomEstimate(selection);
  const selectedExperience = getShowroomExperience(selection.experience);
  const industry = getShowroomIndustry(selection.industry);
  const safe = (value: string | undefined, length: number) =>
    (value ?? "").trim().replace(/[\r\n\t]+/g, " ").slice(0, length);
  const subjects: Record<ShowroomIntent, string> = {
    diagnostic: "Quiero solicitar una sesión de diagnóstico para revisar funciones más avanzadas.",
    budget: "Quiero ajustar la propuesta según mi presupuesto; sé que eso puede modificar el alcance.",
    impact: "Quiero revisar con SUMA mi simulación de impacto y validar los supuestos con mis datos reales.",
    quote: "Quiero revisar mi propuesta personalizada del Showroom de SUMA.",
  };
  const subject = subjects[intent];
  const lines = [
    "Hola, SUMA STUDIO.",
    subject,
    "Negocio: " + safe(selection.businessName || industry.example, 55) + ".",
    "Giro: " + industry.name + ".",
    "Experiencia vista: " + selectedExperience.title + " (demo con datos ficticios).",
    "Modelo: " + (q.mode === "package" ? q.plan.name : "Servicios individuales") + ".",
    "Servicios adicionales: " + (q.services.length ? q.services.map((s) => s.name).join(", ") : "Sin complementos") + ".",
    "Periodo de referencia: " + q.months + (q.months === 1 ? " mes." : " meses."),
    ...(q.monthlyAds ? ["Presupuesto publicitario contemplado: " + formatMXN(q.monthlyAds) + "/mes (externo)."] : []),
    "Equipo: " + q.teamUsers + " personas. Sedes: " + q.locations + ".",
    ...(safe(selection.platform, 65) ? ["Herramientas actuales: " + safe(selection.platform, 65) + "."] : []),
    ...(q.isEmpty ? ["Solicito recomendación de alcance y presupuesto."] : [
      "Estimación base SUMA" + (q.isStartingPrice ? " desde" : "") + ": " + formatMXN(q.setup) + " implementación + " + formatMXN(q.monthlySuma) + "/mes.",
      "Primer pago orientativo SUMA: " + formatMXN(q.firstPaymentSuma) + ".",
    ]),
    ...(intent === "budget" && safe(selection.budget, 40) ? ["Presupuesto que tengo en mente: " + safe(selection.budget, 40) + "."] : []),
    ...(intent === "diagnostic" && safe(selection.availability, 40) ? ["Horario preferido para coordinar: " + safe(selection.availability, 40) + "."] : []),
    ...(intent === "impact" && safe(selection.impactSummary, 400) ? [safe(selection.impactSummary, 400)] : []),
    ...(safe(selection.notes, 180) ? ["Quiero agregar o revisar: " + safe(selection.notes, 180).replace(/\.+$/, "") + "."] : []),
    "Importes antes de IVA; costos de licencias, campañas, WhatsApp API, IA, hosting y terceros aparte.",
    ...(q.locations > 1 ? ["Requiero validar costo multi-sede."] : []),
    "La demostración no es software operativo ni confirma integraciones. Por favor validemos alcance y disponibilidad.",
  ];
  return "https://wa.me/" + site.contact.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
}

/** Prevent redundant choices for features that are alternative implementations. */
export function toggleShowroomService(current: IndividualServiceId[], next: IndividualServiceId): IndividualServiceId[] {
  if (current.includes(next)) return current.filter((id) => id !== next);
  const alternatives: Partial<Record<IndividualServiceId, IndividualServiceId[]>> = {
    "chatbot-ia": ["chatbot-guiado"],
    "chatbot-guiado": ["chatbot-ia"],
    "crm-medida": ["crm-gestionado"],
    "crm-gestionado": ["crm-medida"],
  };
  return [...current.filter((id) => !(alternatives[next] ?? []).includes(id)), next];
}
