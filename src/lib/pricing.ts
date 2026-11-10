import {
  individualServices,
  pricingPlans,
  type IndividualServiceId,
  type PricingPlanId,
} from "@/content/pricing";
import { site } from "@/content/site";

export const formatMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(amount);

export type PricingSelection = {
  mode?: "package" | "services";
  planId: PricingPlanId;
  months: number;
  adBudget?: number;
  serviceIds?: IndividualServiceId[];
  locations?: number;
  teamUsers?: number;
  businessType?: string;
  goal?: string;
  platform?: string;
  notes?: string;
};

export function estimatePricing(selection: PricingSelection) {
  const mode = selection.mode ?? "package";
  const plan = pricingPlans.find((entry) => entry.id === selection.planId) ?? pricingPlans[0];
  const months = Number.isFinite(selection.months) ? Math.max(1, Math.min(12, Math.floor(selection.months))) : 1;
  const locations = Number.isFinite(selection.locations) ? Math.max(1, Math.min(20, Math.floor(selection.locations!))) : 1;
  const teamUsers = Number.isFinite(selection.teamUsers) ? Math.max(1, Math.min(10000, Math.floor(selection.teamUsers!))) : 1;
  const included: string[] = mode === "package" ? (
    plan.id === "growth" ? ["meta-ads", "crm-gestionado"]
      : plan.id === "ads" ? ["meta-ads"] : ["crm-gestionado"]
  ) : [];
  const services = individualServices.filter((entry) =>
    selection.serviceIds?.includes(entry.id) && !included.includes(entry.id)
  );
  const setup = (mode === "package" ? plan.setup : 0) + services.reduce((sum, s) => sum + s.setup, 0);
  const monthlySuma = (mode === "package" ? plan.monthly : 0) + services.reduce((sum, s) => sum + s.monthly, 0);
  const hasAds = (mode === "package" && (plan.id === "ads" || plan.id === "growth")) ||
    services.some((s) => s.id === "meta-ads" || s.id === "google-ads");
  const monthlyAds = hasAds ? Math.max(0, Number.isFinite(selection.adBudget) ? selection.adBudget ?? 0 : 0) : 0;
  const isStartingPrice = services.some((s) => s.from) || locations > 1;
  return {
    plan, mode, services, months, locations, teamUsers, isStartingPrice, hasAds,
    isEmpty: mode === "services" && services.length === 0,
    setup, monthlySuma, monthlyAds,
    firstPaymentSuma: setup + monthlySuma,
    totalSuma: setup + months * monthlySuma,
    totalExternalAds: months * monthlyAds,
    totalWithAds: setup + months * (monthlySuma + monthlyAds),
  };
}

/** Solo genera un enlace. No envía mensajes, crea leads ni realiza pagos. */
export function pricingWhatsAppHref(selection: PricingSelection): string {
  const q = estimatePricing(selection);
  const summary = q.mode === "package" ? q.plan.name : "servicios individuales";
  const safe = (value: string | undefined, limit = 130) => (value ?? "").trim().slice(0, limit);
  const lines = [
    "Hola, SUMA STUDIO. Quiero personalizar una propuesta.",
    "Modalidad: " + summary + ".",
    ...(q.services.length ? ["Servicios adicionales: " + q.services.map((s) => s.name).join(", ") + "."] : []),
    ...(safe(selection.businessType) ? ["Negocio: " + safe(selection.businessType) + "."] : []),
    ...(safe(selection.goal) ? ["Prioridad: " + safe(selection.goal) + "."] : []),
    ...(safe(selection.platform) ? ["Reservas/canales actuales: " + safe(selection.platform) + "."] : []),
    "Equipo: " + q.teamUsers + " integrantes. Sedes: " + q.locations + ".",
    "Periodo estimado: " + q.months + (q.months === 1 ? " mes." : " meses."),
    "Referencia de SUMA" + (q.isStartingPrice ? " desde" : "") + ": implementación " + formatMXN(q.setup) + "; mensualidad " + formatMXN(q.monthlySuma) + ".",
    "Referencia primer pago a SUMA: " + formatMXN(q.firstPaymentSuma) + " antes de IVA.",
    ...(q.monthlyAds ? ["Pauta considerada: " + formatMXN(q.monthlyAds) + "/mes, pagada aparte."] : []),
    ...(q.locations > 1 ? ["Solicito cotización adicional por sedes."] : []),
    ...(safe(selection.notes, 180) ? ["Nota: " + safe(selection.notes, 180) + "."] : []),
    "Los importes son orientativos: sin IVA, licencias de terceros ni consumos API/IA. Validar alcance e integraciones antes de contratar.",
    "¿Podemos revisar la propuesta?",
  ];
  return "https://wa.me/" + site.contact.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
}
