import {
  individualServices,
  pricingPlans,
  type IndividualServiceId,
  type PricingPlanId,
} from "@/content/pricing";
import { site } from "@/content/site";

export const formatMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(amount);

/** Mostrar centavos en las parcialidades evita redondeos comerciales engañosos. */
export const formatMXNExact = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

export type SetupPayments = 1 | 3 | 6;
export const availableSetupPayments = (setup: number): SetupPayments[] =>
  setup <= 0 ? [1] : setup >= 10000 ? [1, 3, 6] : [1, 3];

const asCents = (value: number) => Math.round(value * 100);
export function setupPaymentSchedule(setup: number, selected: SetupPayments = 1) {
  const amountCents = asCents(Math.max(0, setup));
  const options = availableSetupPayments(setup);
  const payments = options.includes(selected) ? selected : 1;
  const firstCents = Math.round(amountCents / payments);
  const lastCents = amountCents - firstCents * (payments - 1);
  return {
    payments,
    firstPayment: firstCents / 100,
    finalPayment: lastCents / 100,
    schedule: Array.from({ length: payments }, (_, index) =>
      (index === payments - 1 ? lastCents : firstCents) / 100),
  };
}

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
  /** Parcialidades simuladas de la implementación, NO una contratación ni financiación automática. */
  setupPayments?: SetupPayments;
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
  const setupMax = (mode === "package" ? plan.setupMax : 0) + services.reduce((sum, s) => sum + s.setupMax, 0);
  const monthlyMax = (mode === "package" ? plan.monthlyMax : 0) + services.reduce((sum, s) => sum + s.monthlyMax, 0);
  const hasAds = (mode === "package" && (plan.id === "ads" || plan.id === "growth")) ||
    services.some((s) => s.id === "meta-ads" || s.id === "google-ads");
  const monthlyAds = hasAds ? Math.max(0, Number.isFinite(selection.adBudget) ? selection.adBudget ?? 0 : 0) : 0;
  const isStartingPrice = mode === "package" || services.some((s) => s.from) || locations > 1;
  const paymentPlan = setupPaymentSchedule(setup, selection.setupPayments ?? 1);
  return {
    plan, mode, services, months, locations, teamUsers, isStartingPrice, hasAds,
    isEmpty: mode === "services" && services.length === 0,
    setup, setupMax, monthlySuma, monthlyMax, monthlyAds,
    setupPayments: paymentPlan.payments,
    setupInstallment: paymentPlan.firstPayment,
    setupFinalInstallment: paymentPlan.finalPayment,
    setupSchedule: paymentPlan.schedule,
    /** Desembolso inicial a SUMA, con primer abono del setup + primera mensualidad. */
    firstPaymentSuma: Math.round((paymentPlan.firstPayment + monthlySuma) * 100) / 100,
    /** Compromiso de costo total incluyendo TODO el setup, incluso parcialidades fuera del periodo elegido. */
    totalSuma: setup + months * monthlySuma,
    totalSumaMax: setupMax + months * monthlyMax,
    totalExternalAds: months * monthlyAds,
    totalWithAds: setup + months * (monthlySuma + monthlyAds),
  };
}

/** Mensaje breve de contacto. La persona puede revisarlo antes de enviarlo. */
export function pricingWhatsAppHref(selection: PricingSelection): string {
  const q = estimatePricing(selection);
  const safe = (value: string | undefined, limit = 110) =>
    (value ?? "").trim().replace(/[\r\n\t]+/g, " ").slice(0, limit);
  const selected = q.mode === "package"
    ? q.plan.name + (q.services.length ? " + " + q.services.map((service) => service.name).join(", ") : "")
    : q.services.length ? q.services.map((service) => service.name).join(", ") : "una recomendación";
  const lines = [
    "Hola, SUMA. Quiero conocer una propuesta.",
    "Me interesa: " + selected + ".",
    ...((q.isEmpty || q.locations > 1) ? [] : [
      "Referencia desde " + formatMXN(q.setup) + " de inicio + " + formatMXN(q.monthlySuma) +
      "/mes, antes de IVA; terceros aparte.",
    ]),
    ...(q.locations > 1 ? ["Tengo más de una sede; necesito una cotización adaptada."] : []),
    ...(safe(selection.notes) ? ["Nota: " + safe(selection.notes) + "."] : []),
    "¿Me ayudan a definir qué incluye?",
  ];
  return "https://wa.me/" + site.contact.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
}
