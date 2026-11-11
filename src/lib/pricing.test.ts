import { describe, expect, it } from "vitest";
import { individualServices, pricingPlans } from "@/content/pricing";
import { availableSetupPayments, estimatePricing, formatMXN, pricingWhatsAppHref, setupPaymentSchedule } from "./pricing";

describe("precios configurables SUMA", () => {
  it("ofrece planes de mercado con setup, mensualidad y alcance claros", () => {
    expect(pricingPlans.map((plan) => plan.id)).toEqual(["ads", "flow", "growth"]);
    expect(pricingPlans.map((plan) => plan.setup)).toEqual([990, 2490, 3290]);
    expect(pricingPlans.map((plan) => plan.monthly)).toEqual([1990, 1490, 3290]);
    expect(pricingPlans.map((plan) => plan.setupMax)).toEqual([3900, 7900, 14900]);
    expect(pricingPlans.map((plan) => plan.monthlyMax)).toEqual([4900, 3900, 9900]);
    expect(individualServices.every((s) => s.from && s.setupMax >= s.setup && s.monthlyMax >= s.monthly)).toBe(true);
    expect(new Set(individualServices.map((s) => s.id)).size).toBe(individualServices.length);
  });

  it("distingue instalación, mensualidad, pauta y primer pago", () => {
    expect(estimatePricing({ planId: "ads", months: 1 }).firstPaymentSuma).toBe(2980);
    expect(estimatePricing({ planId: "flow", months: 1 }).firstPaymentSuma).toBe(3980);
    expect(estimatePricing({ planId: "growth", months: 1 }).firstPaymentSuma).toBe(6580);
    const ads = estimatePricing({ planId: "ads", months: 3, adBudget: 6000 });
    expect(ads.totalSuma).toBe(6960);
    expect(ads.totalExternalAds).toBe(18000);
    expect(ads.totalWithAds).toBe(24960);
    const growth = estimatePricing({ planId: "growth", months: 3, adBudget: 9000 });
    expect(growth.totalSuma).toBe(13160);
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
    expect(quote.setup).toBe(10190);
    expect(quote.monthlySuma).toBe(5280);
    expect(quote.isStartingPrice).toBe(true);
  });

  it("ofrece 3 pagos en proyectos pequeños y hasta 6 en implementaciones mayores", () => {
    expect(availableSetupPayments(990)).toEqual([1, 3]);
    expect(availableSetupPayments(10190)).toEqual([1, 3, 6]);
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

  it("el mensaje de WhatsApp solo incluye el plan y las funciones elegidas", () => {
    const href = pricingWhatsAppHref({planId:"growth",months:1,serviceIds:["chatbot-ia"],setupPayments:6});
    const msg = decodeURIComponent(href.split("?text=")[1]);
    expect(msg).toContain("SUMA Growth");
    expect(msg).toContain("Asistente con IA para WhatsApp");
    expect(msg).toContain("antes de IVA");
    expect(msg).not.toContain("deuda");
    expect(msg).not.toContain("Equipo:");
    expect(msg.length).toBeLessThan(420);
  });

  it("Growth es ligeramente más económico que Ads y Flow y no inventa más servicios", () => {
    const ads = estimatePricing({ planId: "ads", months: 1 });
    const flow = estimatePricing({ planId: "flow", months: 1 });
    const growth = estimatePricing({ planId: "growth", months: 1 });
    expect(growth.setup).toBeLessThan(ads.setup + flow.setup);
    expect(growth.monthlySuma).toBeLessThan(ads.monthlySuma + flow.monthlySuma);
    expect(growth.setup).toBe(3290);
    expect(growth.monthlySuma).toBe(3290);
    expect(pricingPlans.find((p) => p.id === "flow")?.includes).toContain("Hasta 2 tareas automáticas sencillas al inicio");
    expect(pricingPlans.find((p) => p.id === "growth")?.setupIncludes.some((s) => s.includes("hasta dos"))).toBe(true);
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
    expect(message).toContain("Asistente con IA para WhatsApp");
    expect(message).toContain("más de una sede");
    expect(message).not.toContain("25 integrantes");
    expect(message).not.toContain("Atraer más clientes");
    expect(message).not.toContain("Rangos orientativos");
    expect(message).not.toContain("6900");
    expect(message.length).toBeLessThan(420);
    expect(message).not.toMatch(/RFC|NSS/i);
  });
});
