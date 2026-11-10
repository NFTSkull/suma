import { describe, expect, it } from "vitest";
import { individualServices } from "@/content/pricing";
import { showroomExperiences, showroomIndustries } from "@/content/showroom";
import { showroomEstimate, showroomWhatsAppHref, toggleShowroomService, type ShowroomSelection } from "./showroom";

const initial: ShowroomSelection = {
  businessName: "Estudio Test",
  industry: "pilates",
  experience: "crm",
  serviceIds: ["crm-gestionado"],
  locations: 1,
  teamUsers: 5,
  platform: "WhatsApp / Instagram",
};

describe("Showroom SUMA", () => {
  it("cubre cada tipo de experiencia con un servicio público real", () => {
    const ids = new Set(individualServices.map((s) => s.id));
    expect(showroomExperiences).toHaveLength(9);
    expect(showroomIndustries.length).toBeGreaterThanOrEqual(4);
    for (const experience of showroomExperiences) expect(ids.has(experience.serviceId)).toBe(true);
  });
  it("el precio para CRM aprovecha el catálogo de la web", () => {
    const quote = showroomEstimate(initial);
    expect(quote.setup).toBe(9900);
    expect(quote.monthlySuma).toBe(3900);
    expect(quote.firstPaymentSuma).toBe(13800);
    expect(quote.isStartingPrice).toBe(false);
  });
  it("puede combinar chatbot sin un descuento ficticio", () => {
    const quote = showroomEstimate({ ...initial, experience: "chatbot", serviceIds: ["crm-gestionado", "chatbot-ia"] });
    expect(quote.setup).toBe(29800);
    expect(quote.monthlySuma).toBe(8800);
    expect(quote.firstPaymentSuma).toBe(38600);
    expect(quote.isStartingPrice).toBe(true);
  });
  it("no factura dos veces el módulo CRM dentro de Flow", () => {
    const quote = showroomEstimate({ ...initial, mode: "package", planId: "flow", serviceIds: ["crm-gestionado", "chatbot-ia"] });
    expect(quote.services.map(s => s.id)).toEqual(["chatbot-ia"]);
    expect(quote.setup).toBe(29800);
  });
  it("sin tarifa SUMA por asiento; múltiples sedes requieren ajuste", () => {
    const a = showroomEstimate({ ...initial, teamUsers: 1 });
    const b = showroomEstimate({ ...initial, teamUsers: 500, locations: 3 });
    expect(a.monthlySuma).toBe(b.monthlySuma);
    expect(b.isStartingPrice).toBe(true);
  });
  it("los chatbots y CRMs alternativos no pueden seleccionarse simultáneamente", () => {
    expect(toggleShowroomService(["chatbot-guiado"], "chatbot-ia")).toEqual(["chatbot-ia"]);
    expect(toggleShowroomService(["crm-medida", "reservas"], "crm-gestionado")).toEqual(["reservas", "crm-gestionado"]);
    expect(toggleShowroomService(["reservas"], "reservas")).toEqual([]);
  });
  it("la negociación solicita revisión, no altera ni rebaja el precio", () => {
    const proposal = { ...initial, budget: "$4,000/mes", notes: "Me interesa la agenda actual" };
    const original = showroomEstimate(initial);
    expect(showroomEstimate(proposal).firstPaymentSuma).toBe(original.firstPaymentSuma);
    const url = showroomWhatsAppHref(proposal, "budget");
    expect(url).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    const text = decodeURIComponent(url.split("?text=")[1]);
    expect(text).toContain("ajustar la propuesta según mi presupuesto");
    expect(text).toContain("$4,000/mes");
    expect(text).toContain("antes de IVA");
    expect(text).toContain("ficticios");
  });
  it("el diagnóstico solo solicita coordinar una sesión, no promete reserva", () => {
    const text = decodeURIComponent(showroomWhatsAppHref({ ...initial, availability: "Entre semana, tardes" }, "diagnostic").split("?text=")[1]);
    expect(text).toContain("solicitar una sesión");
    expect(text).toContain("Entre semana, tardes");
    expect(text).toContain("validemos alcance");
    expect(text).not.toMatch(/cita confirmada/i);
  });
  it("la revisión de impacto lleva la simulación aparte de las notas y nombra bien el periodo", () => {
    const longNotes = "x".repeat(170);
    const summary = "Simulación base (supuestos por validar): diferencia de +$1,932/mes.";
    const text = decodeURIComponent(showroomWhatsAppHref({ ...initial, months: 6, notes: longNotes, impactSummary: summary }, "impact").split("?text=")[1]);
    expect(text).toContain("Quiero revisar con SUMA mi simulación de impacto");
    expect(text).toContain(summary);
    expect(text).toContain("Periodo de referencia: 6 meses.");
    expect(decodeURIComponent(showroomWhatsAppHref(initial, "quote").split("?text=")[1])).toContain("Periodo de referencia: 1 mes.");
  });
});
