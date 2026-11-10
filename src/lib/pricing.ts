import { pricingPlans, pricingSettings, type PricingPlanId } from "@/content/pricing";
import { site } from "@/content/site";

export const formatMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(amount);

export type PricingSelection = {
  planId: PricingPlanId;
  months: number;
  startMaintenance?: boolean;
  growthAdBudget?: number;
};

export function estimatePricing(selection: PricingSelection) {
  const plan = pricingPlans.find((entry) => entry.id === selection.planId) ?? pricingPlans[0];
  const months = Number.isFinite(selection.months) ? Math.max(1, Math.min(12, Math.floor(selection.months))) : 1;
  const monthlySuma = plan.id === "start"
    ? (selection.startMaintenance ? pricingSettings.startMaintenanceMonthly : 0)
    : plan.monthly;
  const monthlyAds = plan.id === "growth"
    ? Math.max(0, Number.isFinite(selection.growthAdBudget) ? selection.growthAdBudget ?? 0 : 0)
    : 0;
  return {
    plan,
    months,
    setup: plan.setup,
    monthlySuma,
    monthlyAds,
    firstPaymentSuma: plan.setup + monthlySuma,
    totalSuma: plan.setup + months * monthlySuma,
    totalExternalAds: months * monthlyAds,
    totalWithAds: plan.setup + months * (monthlySuma + monthlyAds),
  };
}

/** Solo genera un enlace; nunca envía mensajes ni realiza pagos. */
export function pricingWhatsAppHref(selection: PricingSelection): string {
  const quote = estimatePricing(selection);
  const lines = [
    "Hola, vi los precios en SUMA STUDIO.",
    `Me interesa ${quote.plan.name} para mi negocio wellness.`,
    `Implementación base: ${formatMXN(quote.setup)} MXN; servicio mensual SUMA: ${formatMXN(quote.monthlySuma)} MXN.`,
    `Estoy considerando ${quote.months} ${quote.months === 1 ? "mes" : "meses"}.`,
    ...(quote.monthlyAds ? [`Presupuesto de anuncios contemplado: ${formatMXN(quote.monthlyAds)} MXN/mes (aparte).`] : []),
    "¿Podemos revisar el alcance y preparar una cotización?",
  ];
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
