import { describe, expect, it } from "vitest";
import { individualServices, pricingSettings } from "@/content/pricing";
import { estimatePricing } from "@/lib/pricing";
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
    expect(quote.setup).toBe(2490);
    expect(quote.monthlySuma).toBe(1490);
    expect(quote.firstPaymentSuma).toBe(3980);
    expect(quote.isStartingPrice).toBe(true);
    expect(quote.setupMax).toBe(7900);
    expect(quote.monthlyMax).toBe(3900);
  });
  it("la misma selección da el mismo total independientemente de la pantalla", () => {
    const months = pricingSettings.defaultMonths;
    const setupPayments = pricingSettings.defaultSetupPayments;
    const adBudget = pricingSettings.defaultAdBudget;
    const common = { mode: "package" as const, planId: "flow" as const, serviceIds: [] as [], months, setupPayments, adBudget, locations: 1, teamUsers: 5 };
    const fromPricing = estimatePricing(common);
    const fromShowroom = showroomEstimate({ ...initial, ...common });
    expect(fromShowroom.totalSuma).toBe(fromPricing.totalSuma);
    expect(fromShowroom.firstPaymentSuma).toBe(fromPricing.firstPaymentSuma);
    expect(fromPricing.totalSuma).toBe(6960);
  });
  it("puede combinar chatbot sin un descuento ficticio", () => {
    const quote = showroomEstimate({ ...initial, experience: "chatbot", serviceIds: ["crm-gestionado", "chatbot-ia"] });
    expect(quote.setup).toBe(9390);
    expect(quote.monthlySuma).toBe(3480);
    expect(quote.firstPaymentSuma).toBe(12870);
    expect(quote.isStartingPrice).toBe(true);
  });
  it("mantiene notas y parcialidades en WhatsApp sin cambiar setup real", () => {
    const planned = { ...initial, setupPayments: 3 as const, notes:"No quiero cambiar mi agenda" };
    const quote = showroomEstimate(planned);
    expect(quote.setup).toBe(2490);
    expect(quote.firstPaymentSuma).toBe(2320);
    const msg = decodeURIComponent(showroomWhatsAppHref(planned, "quote").split("?text=")[1]);
    expect(msg).not.toContain("deuda");
    expect(msg.length).toBeLessThan(420);
    expect(msg).toContain("No quiero cambiar mi agenda");
  });
  it("no factura dos veces el módulo CRM dentro de Flow", () => {
    const quote = showroomEstimate({ ...initial, mode: "package", planId: "flow", serviceIds: ["crm-gestionado", "chatbot-ia"] });
    expect(quote.services.map(s => s.id)).toEqual(["chatbot-ia"]);
    expect(quote.setup).toBe(9390);
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
    expect(text).toContain("ajustar el alcance a mi presupuesto");
    expect(text).toContain("$4,000/mes");
    expect(text).toContain("sin IVA ni terceros");
    expect(text).not.toContain("Estudio Aurora");
  });
  it("el diagnóstico solo solicita coordinar una sesión, no promete reserva", () => {
    const text = decodeURIComponent(showroomWhatsAppHref({ ...initial, availability: "Entre semana, tardes" }, "diagnostic").split("?text=")[1]);
    expect(text).toContain("revisar las opciones");
    expect(text).not.toContain("Entre semana, tardes");
    expect(text).toContain("¿Podemos revisar lo que incluye?");
    expect(text).not.toMatch(/cita confirmada/i);
  });
  it("la revisión de impacto propone validar datos sin añadir proyecciones ficticias", () => {
    const longNotes = "x".repeat(170);
    const summary = "Simulación base (supuestos por validar): diferencia de +$1,932/mes.";
    const text = decodeURIComponent(showroomWhatsAppHref({ ...initial, months: 6, notes: longNotes, impactSummary: summary }, "impact").split("?text=")[1]);
    expect(text).toContain("Quiero revisar una simulación con datos reales");
    expect(text).not.toContain(summary);
    expect(text).not.toContain("Periodo de referencia");
    expect(text).not.toContain("Estudio Aurora");
    expect(text.length).toBeLessThan(430);
  });

  it("no inventa el nombre del negocio, ni envía servicios no marcados", () => {
    const text = decodeURIComponent(showroomWhatsAppHref({
      ...initial, businessName: "", mode: "services", serviceIds: [],
    }, "quote").split("?text=")[1]);
    expect(text).toContain("una recomendación");
    expect(text).not.toContain("Estudio Aurora");
    expect(text).not.toContain("Organizar clientes (CRM)");
    expect(text).not.toContain("Total de implementación");
    expect(text).not.toContain("$0");
    expect(text.length).toBeLessThan(300);
  });

  it("abrevia la lista de servicios cuando hay muchos para no exceder ~800 caracteres", () => {
    // Seleccionar muchos servicios
    const manyServices = individualServices.slice(0, 8).map(s => s.id);
    const text = decodeURIComponent(showroomWhatsAppHref({
      ...initial, 
      businessName: "Estudio de Bienestar Integral",
      mode: "services", 
      serviceIds: manyServices,
      notes: "Necesito integrar con Fitco y tener reportes mensuales de todas las métricas",
      budget: "$8,000 - $12,000 mensuales",
    }, "quote").split("?text=")[1]);
    
    // Debe truncar la lista de servicios
    expect(text).toContain("y ");
    expect(text).toContain(" más");
    // Total debe ser menor a 850 chars (margen de seguridad)
    expect(text.length).toBeLessThan(850);
  });

  it("en paquete con varios extras abrevia correctamente", () => {
    const text = decodeURIComponent(showroomWhatsAppHref({
      ...initial, 
      mode: "package", 
      planId: "growth",
      serviceIds: ["chatbot-ia", "automatizacion", "landing", "seo-local"],
    }, "quote").split("?text=")[1]);
    
    expect(text).toContain("SUMA Growth");
    expect(text).toContain("módulos adicionales");
    expect(text.length).toBeLessThan(500);
  });
});
