import type { IndividualServiceId, PricingPlanId } from "@/content/pricing";
import { showroomExperiences, showroomIndustries, type ShowroomExperienceId, type ShowroomIndustryId } from "@/content/showroom";
import { site } from "@/content/site";
import { estimatePricing, formatMXN, type SetupPayments } from "@/lib/pricing";

export type ShowroomIntent = "quote" | "budget" | "diagnostic" | "impact";

/** Clave para persistir la configuración del showroom en sessionStorage */
export const SHOWROOM_STORAGE_KEY = "suma-showroom-config";
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

/** 
 * Mensaje breve y fiel a lo que la persona eligió. No envía ni reserva nada.
 * Límite: ~800 caracteres para dejar margen al límite de WhatsApp (~1000).
 */
export function showroomWhatsAppHref(selection: ShowroomSelection, intent: ShowroomIntent) {
  const q = showroomEstimate(selection);
  const safe = (value: string | undefined, limit: number) =>
    (value ?? "").trim().replace(/[\r\n\t]+/g, " ").slice(0, limit);
  const businessName = safe(selection.businessName, 45);
  
  // Construir lista de servicios con límite razonable
  const extras = q.services.map((s) => s.name);
  let selected: string;
  if (q.mode === "package") {
    const extrasText = extras.length <= 2 
      ? (extras.length ? " + " + extras.join(", ") : "")
      : ` + ${extras.length} módulos adicionales`;
    selected = q.plan.name + extrasText;
  } else {
    selected = extras.length === 0 
      ? "una recomendación"
      : extras.length <= 3
        ? extras.join(", ")
        : extras.slice(0, 2).join(", ") + ` y ${extras.length - 2} más`;
  }
  
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
      "Referencia: " + formatMXN(q.setup) + " inicio + " +
      formatMXN(q.monthlySuma) + "/mes (sin IVA ni terceros).",
    ]),
    ...(q.locations > 1 ? ["Con varias sedes; requiere cotización específica."] : []),
    ...(intent === "budget" && safe(selection.budget, 30)
      ? ["Presupuesto aprox: " + safe(selection.budget, 30) + "."] : []),
    ...(safe(selection.notes, 80) ? ["Nota: " + safe(selection.notes, 80) + "."] : []),
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

/** Guardar configuración del showroom en sessionStorage */
export function saveShowroomConfig(selection: Partial<ShowroomSelection>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SHOWROOM_STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // Silently fail if storage is not available
  }
}

/** Recuperar configuración del showroom desde sessionStorage */
export function loadShowroomConfig(): Partial<ShowroomSelection> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SHOWROOM_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<ShowroomSelection>;
  } catch {
    return null;
  }
}

/** Limpiar configuración guardada del showroom */
export function clearShowroomConfig(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SHOWROOM_STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
