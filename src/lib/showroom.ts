import type { IndividualServiceId, PricingPlanId } from "@/content/pricing";
import { showroomExperiences, showroomIndustries, type ShowroomExperienceId, type ShowroomIndustryId } from "@/content/showroom";
import { site } from "@/content/site";
import { estimatePricing, formatMXN, type SetupPayments } from "@/lib/pricing";

export type ShowroomIntent = "quote" | "budget" | "diagnostic" | "impact";
export type ShowroomSelection = {
  businessName: string;
  industry: ShowroomIndustryId;
  experience: ShowroomExperienceId;
  serviceIds: IndividualServiceId[];
  mode?: "services" | "package";
  planId?: PricingPlanId;
  months?: number;
  setupPayments?: SetupPayments;
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
    setupPayments: selection.setupPayments ?? 1,
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

/** Mensaje breve y fiel a lo que la persona eligió. No envía ni reserva nada. */
export function showroomWhatsAppHref(selection: ShowroomSelection, intent: ShowroomIntent) {
  const q = showroomEstimate(selection);
  const safe = (value: string | undefined, limit: number) =>
    (value ?? "").trim().replace(/[\r\n\t]+/g, " ").slice(0, limit);
  const businessName = safe(selection.businessName, 55);
  const extras = q.services.map((s) => s.name);
  const selected = q.mode === "package"
    ? q.plan.name + (extras.length ? " + " + extras.join(", ") : "")
    : extras.length ? extras.join(", ") : "una recomendación";
  const goal: Record<ShowroomIntent, string> = {
    quote: "Quiero una propuesta",
    budget: "Quiero ajustar el alcance a mi presupuesto",
    diagnostic: "Quiero revisar las opciones para mi negocio",
    impact: "Quiero revisar una simulación con datos reales",
  };
  const lines = [
    "Hola, SUMA. " + goal[intent] + (businessName ? " para " + businessName : "") + ".",
    "Me interesa: " + selected + ".",
    ...(q.isEmpty || q.locations > 1 ? [] : [
      "Precio de referencia desde " + formatMXN(q.setup) + " de inicio + " +
      formatMXN(q.monthlySuma) + "/mes, antes de IVA; terceros aparte.",
    ]),
    ...(q.locations > 1 ? ["Necesito considerar varias sedes; el precio debe cotizarse."] : []),
    ...(intent === "budget" && safe(selection.budget, 35)
      ? ["Mi presupuesto aproximado: " + safe(selection.budget, 35) + "."] : []),
    ...(safe(selection.notes, 100) ? ["Nota: " + safe(selection.notes, 100) + "."] : []),
    "¿Podemos revisar lo que incluye?",
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
