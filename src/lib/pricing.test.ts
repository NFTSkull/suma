import { describe, expect, it } from "vitest";
import { pricingPlans } from "@/content/pricing";
import { estimatePricing, formatMXN, pricingWhatsAppHref } from "./pricing";

describe("catálogo de precios SUMA", () => {
  it("tiene tres planes únicos y precios iniciales coherentes", () => {
    expect(pricingPlans.map((plan) => plan.id)).toEqual(["start", "flow", "growth"]);
    expect(new Set(pricingPlans.map((plan) => plan.id)).size).toBe(3);
    expect(pricingPlans.map((plan) => plan.setup)).toEqual([8900, 14900, 24900]);
    expect(pricingPlans.map((plan) => plan.monthly)).toEqual([0, 4900, 9900]);
  });

  it("primer pago: implementación más primer mes, excepto Start sin mantenimiento", () => {
    expect(estimatePricing({ planId: "start", months: 1 }).firstPaymentSuma).toBe(8900);
    expect(estimatePricing({ planId: "flow", months: 1 }).firstPaymentSuma).toBe(19800);
    expect(estimatePricing({ planId: "growth", months: 1 }).firstPaymentSuma).toBe(34800);
  });

  it("Start tiene mantenimiento realmente opcional", () => {
    expect(estimatePricing({ planId: "start", months: 3 }).totalSuma).toBe(8900);
    expect(estimatePricing({ planId: "start", months: 3, startMaintenance: true }).totalSuma).toBe(11870);
    expect(estimatePricing({ planId: "start", months: 3, startMaintenance: true }).monthlySuma).toBe(990);
  });

  it("el presupuesto de publicidad no se mezcla con ingresos de SUMA", () => {
    const quote = estimatePricing({ planId: "growth", months: 3, growthAdBudget: 8000 });
    expect(quote.totalSuma).toBe(54600);
    expect(quote.totalExternalAds).toBe(24000);
    expect(quote.totalWithAds).toBe(78600);
    expect(estimatePricing({ planId: "flow", months: 3, growthAdBudget: 8000 }).monthlyAds).toBe(0);
  });

  it("acota periodos inválidos para que el cotizador no muestre importes negativos", () => {
    expect(estimatePricing({ planId: "flow", months: -10 }).months).toBe(1);
    expect(estimatePricing({ planId: "flow", months: 100 }).months).toBe(12);
    expect(estimatePricing({ planId: "flow", months: Number.NaN }).months).toBe(1);
  });

  it("el mensaje de WhatsApp usa número oficial y el paquete sin datos personales", () => {
    const href = pricingWhatsAppHref({ planId: "flow", months: 3 });
    expect(href).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    const text = decodeURIComponent(href.split("?text=")[1]);
    expect(text).toContain("SUMA Flow");
    expect(text).toContain(formatMXN(14900));
    expect(text).toContain(formatMXN(4900));
    expect(text).not.toMatch(/@|RFC|NSS/i);
  });
});
