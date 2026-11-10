import { describe, expect, it } from "vitest";
import { individualServices, pricingPlans } from "@/content/pricing";
import { estimatePricing, formatMXN, pricingWhatsAppHref } from "./pricing";

describe("precios configurables SUMA", () => {
  it("ofrece planes de mercado con setup, mensualidad y alcance claros", () => {
    expect(pricingPlans.map((plan) => plan.id)).toEqual(["ads", "flow", "growth"]);
    expect(pricingPlans.map((plan) => plan.setup)).toEqual([4900, 9900, 19900]);
    expect(pricingPlans.map((plan) => plan.monthly)).toEqual([5900, 3900, 8900]);
    expect(new Set(individualServices.map((s) => s.id)).size).toBe(individualServices.length);
  });

  it("distingue instalación, mensualidad, pauta y primer pago", () => {
    expect(estimatePricing({ planId: "ads", months: 1 }).firstPaymentSuma).toBe(10800);
    expect(estimatePricing({ planId: "flow", months: 1 }).firstPaymentSuma).toBe(13800);
    expect(estimatePricing({ planId: "growth", months: 1 }).firstPaymentSuma).toBe(28800);
    const ads = estimatePricing({ planId: "ads", months: 3, adBudget: 6000 });
    expect(ads.totalSuma).toBe(22600);
    expect(ads.totalExternalAds).toBe(18000);
    expect(ads.totalWithAds).toBe(40600);
    const growth = estimatePricing({ planId: "growth", months: 3, adBudget: 9000 });
    expect(growth.totalSuma).toBe(46600);
    expect(growth.totalExternalAds).toBe(27000);
  });

  it("permite únicamente servicios individuales, sin forzar paquete", () => {
    const estimate = estimatePricing({
      mode: "services", planId: "flow", months: 3,
      serviceIds: ["reservas", "seo-local"],
    });
    expect(estimate.setup).toBe(9800);
    expect(estimate.monthlySuma).toBe(2490);
    expect(estimate.totalSuma).toBe(17270);
    expect(estimate.isStartingPrice).toBe(true);
    expect(estimate.hasAds).toBe(false);
    expect(estimatePricing({ mode: "services", planId: "ads", months: 1 }).isEmpty).toBe(true);
  });

  it("no vuelve a cobrar servicios incluidos en paquete", () => {
    const quote = estimatePricing({
      planId: "growth", months: 1,
      serviceIds: ["meta-ads", "crm-gestionado", "chatbot-ia"],
    });
    expect(quote.services.map(s => s.id)).toEqual(["chatbot-ia"]);
    expect(quote.setup).toBe(39800);
    expect(quote.monthlySuma).toBe(13800);
    expect(quote.isStartingPrice).toBe(true);
  });

  it("usuarios del equipo no elevan el precio de SUMA y sedes extras requieren cotización", () => {
    const a = estimatePricing({ planId: "flow", months: 3, teamUsers: 1 });
    const b = estimatePricing({ planId: "flow", months: 3, teamUsers: 500, locations: 3 });
    expect(a.totalSuma).toBe(b.totalSuma);
    expect(b.isStartingPrice).toBe(true);
    expect(b.locations).toBe(3);
    expect(estimatePricing({ planId: "flow", months: 100 }).months).toBe(12);
    expect(estimatePricing({ planId: "ads", months: 3, adBudget: -100 }).monthlyAds).toBe(0);
  });

  it("WhatsApp refleja la selección y marca costos externos aparte", () => {
    const href = pricingWhatsAppHref({
      mode: "services", planId: "flow", months: 3, serviceIds: ["chatbot-ia"],
      teamUsers: 25, locations: 2, platform: "Fitco / Fitune",
      businessType: "Pilates / yoga", goal: "Responder consultas",
    });
    expect(href).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    const message = decodeURIComponent(href.split("?text=")[1]);
    expect(message).toContain("servicios individuales");
    expect(message).toContain("Asistente de WhatsApp con IA");
    expect(message).toContain("25 integrantes");
    expect(message).toContain("2.");
    expect(message).toContain(formatMXN(19900));
    expect(message).toContain("aparte");
    expect(message).not.toMatch(/RFC|NSS/i);
  });
});
