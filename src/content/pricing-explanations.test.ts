import { describe, expect, it } from "vitest";
import { individualServices, pricingPlans } from "@/content/pricing";
import { planExplanations, pricingConcepts, serviceExplanations } from "./pricing-explanations";

describe("Explicaciones claras de precios SUMA", () => {
  it("todos los planes y servicios tienen una definición, un ejemplo y límites", () => {
    for (const plan of pricingPlans) {
      const explanation = planExplanations[plan.id];
      expect(explanation.what.length).toBeGreaterThan(40);
      expect(explanation.example.length).toBeGreaterThan(20);
      expect(explanation.excluded.length).toBeGreaterThan(20);
    }
    for (const service of individualServices) {
      const explanation = serviceExplanations[service.id];
      expect(explanation.what.length).toBeGreaterThan(35);
      expect(explanation.example.length).toBeGreaterThan(20);
      expect(explanation.excluded.length).toBeGreaterThan(25);
    }
    expect(Object.keys(serviceExplanations)).toHaveLength(individualServices.length);
  });

  it("explica pago inicial, mensualidad, IVA, abonos, rangos y gastos externos", () => {
    for (const concept of ["setup", "monthly", "payments", "external", "range", "period", "vat"] as const) {
      expect(pricingConcepts[concept].what.length).toBeGreaterThan(25);
      expect(pricingConcepts[concept].example.length).toBeGreaterThan(25);
      expect(pricingConcepts[concept].excluded.length).toBeGreaterThan(20);
    }
  });
});
