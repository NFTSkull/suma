import { describe, expect, it } from "vitest";
import { pricingPlans } from "@/content/pricing";
import { estimatePricing, formatMXN, pricingWhatsAppHref } from "./pricing";

describe("catálogo comercial SUMA", () => {
  it("ofrece tres planes centrados en captación y atención, sin exigir web", () => {
    expect(pricingPlans.map((plan) => plan.id)).toEqual(["ads", "flow", "growth"]);
    expect(new Set(pricingPlans.map((plan) => plan.id)).size).toBe(3);
    expect(pricingPlans.map((plan) => plan.setup)).toEqual([4900, 14900, 24900]);
    expect(pricingPlans.map((plan) => plan.monthly)).toEqual([5900, 4900, 9900]);
    expect(pricingPlans.every((plan) => !/web nueva obligatoria/i.test(plan.boundaries))).toBe(true);
  });

  it("separa implementación de la mensualidad desde el primer pago", () => {
    expect(estimatePricing({ planId: "ads", months: 1 }).firstPaymentSuma).toBe(10800);
    expect(estimatePricing({ planId: "flow", months: 1 }).firstPaymentSuma).toBe(19800);
    expect(estimatePricing({ planId: "growth", months: 1 }).firstPaymentSuma).toBe(34800);
  });

  it("la pauta de Meta está separada del ingreso SUMA en Ads y Growth", () => {
    const ads = estimatePricing({ planId: "ads", months: 3, adBudget: 6000 });
    expect(ads.totalSuma).toBe(22600);
    expect(ads.totalExternalAds).toBe(18000);
    expect(ads.totalWithAds).toBe(40600);

    const growth = estimatePricing({ planId: "growth", months: 3, adBudget: 8000 });
    expect(growth.totalSuma).toBe(54600);
    expect(growth.totalExternalAds).toBe(24000);
    expect(growth.totalWithAds).toBe(78600);
    expect(estimatePricing({ planId: "flow", months: 3, adBudget: 8000 }).monthlyAds).toBe(0);
  });

  it("nunca muestra inversión publicitaria negativa o periodos fuera de rango", () => {
    expect(estimatePricing({ planId: "ads", months: 3, adBudget: -100 }).monthlyAds).toBe(0);
    expect(estimatePricing({ planId: "ads", months: -10 }).months).toBe(1);
    expect(estimatePricing({ planId: "flow", months: 100 }).months).toBe(12);
    expect(estimatePricing({ planId: "growth", months: Number.NaN }).months).toBe(1);
  });

  it("mantiene el WhatsApp correcto, sin datos privados ni pauta como ingreso", () => {
    const href = pricingWhatsAppHref({ planId: "ads", months: 3, adBudget: 6000 });
    expect(href).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    const message = decodeURIComponent(href.split("?text=")[1]);
    expect(message).toContain("SUMA Ads");
    expect(message).toContain(formatMXN(4900));
    expect(message).toContain(formatMXN(5900));
    expect(message).toContain("aparte");
    expect(message).not.toMatch(/@|RFC|NSS/i);
  });
});
