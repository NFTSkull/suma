import { describe, expect, it } from "vitest";
import { individualServices, pricingPlans } from "./pricing";
import { describeSelectedServices, planStories, serviceStories } from "./sales-clarity";

describe("Mensajes comprensibles SUMA", () => {
  it("cubre todos los planes y servicios, sin dejar módulos sin explicación", () => {
    for (const plan of pricingPlans) {
      expect(planStories[plan.id].intro.length).toBeGreaterThan(25);
      expect(planStories[plan.id].steps).toHaveLength(3);
      expect(planStories[plan.id].boundary.length).toBeGreaterThan(20);
    }
    for (const service of individualServices) {
      expect(serviceStories[service.id]?.length).toBeGreaterThan(20);
    }
  });
  it("describe únicamente funciones seleccionadas, no introduce otras opciones", () => {
    const chosen = describeSelectedServices(["crm-gestionado", "chatbot-guiado"]);
    expect(chosen).toHaveLength(2);
    expect(chosen[0]).toMatch(/quién preguntó|quién responde/);
    expect(chosen[1]).toContain("predefinidas");
    expect(describeSelectedServices([])).toEqual([]);
  });
});
