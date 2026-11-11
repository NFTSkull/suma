import { describe, expect, it } from "vitest";
import { individualServices, pricingPlans } from "@/content/pricing";
import { availableSetupPayments, estimatePricing, formatMXN, pricingWhatsAppHref, setupPaymentSchedule } from "./pricing";

describe("precios configurables SUMA", () => {
  it("ofrece planes de mercado con setup, mensualidad y alcance claros", () => {
    expect(pricingPlans.map((plan) => plan.id)).toEqual(["ads", "flow", "growth"]);
    expect(pricingPlans.map((plan) => plan.setup)).toEqual([990, 2490, 4990]);
    expect(pricingPlans.map((plan) => plan.monthly)).toEqual([1990, 1490, 3990]);
    expect(new Set(individualServices.map((s) => s.id)).size).toBe(individualServices.length);
  });

  it("distingue instalación, mensualidad, pauta y primer pago", () => {
    expect(estimatePricing({ planId: "ads", months: 1 }).firstPaymentSuma).toBe(2980);
    expect(estimatePricing({ planId: "flow", months: 1 }).firstPaymentSuma).toBe(3980);
    expect(estimatePricing({ planId: "growth", months: 1 }).firstPaymentSuma).toBe(8980);
    const ads = estimatePricing({ planId: "ads", months: 3, adBudget: 6000 });
    expect(ads.totalSuma).toBe(6960);
    expect(ads.totalExternalAds).toBe(18000);
    expect(ads.totalWithAds).toBe(24960);
    const growth = estimatePricing({ planId: "growth", months: 3, adBudget: 9000 });
    expect(growth.totalSuma).toBe(16960);
    expect(growth.totalExternalAds).toBe(27000);
  });

  it("permite únicamente servicios individuales, sin forzar paquete", () => {
    const estimate = estimatePricing({
      mode: "services", planId: "flow", months: 3,
      serviceIds: ["reservas", "seo-local"],
    });
    expect(estimate.setup).toBe(1980);
    expect(estimate.monthlySuma).toBe(990);
    expect(estimate.totalSuma).toBe(4950);
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
    expect(quote.setup).toBe(11890);
    expect(quote.monthlySuma).toBe(5980);
    expect(quote.isStartingPrice).toBe(true);
  });

  it("ofrece 3 pagos en proyectos pequeños y hasta 6 en implementaciones mayores", () => {
    expect(availableSetupPayments(990)).toEqual([1, 3]);
    expect(availableSetupPayments(11890)).toEqual([1, 3, 6]);
    expect(availableSetupPayments(0)).toEqual([1]);
    expect(setupPaymentSchedule(2490, 3).schedule).toEqual([830, 830, 830]);
    expect(setupPaymentSchedule(2490, 3).schedule.reduce((a, b) => a + b, 0)).toBeCloseTo(2490, 2);
  });

  it("una parcialidad cambia el desembolso, nunca el costo del contrato", () => {
    const full = estimatePricing({planId:"flow",months:3,setupPayments:1});
    const flexible = estimatePricing({planId:"flow",months:3,setupPayments:3});
    expect(full.firstPaymentSuma).toBe(3980);
    expect(flexible.firstPaymentSuma).toBe(2320);
    expect(flexible.setupInstallment).toBe(830);
    expect(flexible.setupFinalInstallment).toBe(830);
    expect(flexible.totalSuma).toBe(full.totalSuma);
    expect(flexible.setupMax).toBe(7900);
    expect(flexible.monthlyMax).toBe(3900);
    expect(flexible.totalSumaMax).toBe(19600);
    expect(flexible.isStartingPrice).toBe(true);
    expect(flexible.setup).toBe(2490);
  });

  it("módulos de pago único permiten parcialidades sin inventar membresías", () => {
    const landing = estimatePricing({mode:"services",planId:"flow",months:1,serviceIds:["landing"],setupPayments:3});
    expect(landing.monthlySuma).toBe(0);
    expect(landing.firstPaymentSuma).toBe(996.67);
    expect(landing.totalSuma).toBe(2990);
  });

  it("la propuesta WhatsApp expresa parcialidades y totalidad pendiente", () => {
    const href = pricingWhatsAppHref({planId:"growth",months:1,serviceIds:["chatbot-ia"],setupPayments:6});
    const msg = decodeURIComponent(href.split("?text=")[1]);
    expect(msg).toContain("6 pagos mensuales");
    expect(msg).toContain("Total de implementación sin descontar");
    expect(msg).toContain("sujeto");
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
    expect(message).toContain(formatMXN(14900));
    expect(message).toContain("sin IVA, licencias de terceros");
    expect(message).not.toMatch(/RFC|NSS/i);
  });
});
