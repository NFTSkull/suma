import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors } from "./contact-schema";

const validPayload = {
  nombre: "Ana López",
  negocio: "Estudio Flow",
  tipoNegocio: "yoga-pilates",
  email: "Ana@Ejemplo.com ",
  whatsapp: "+52 (81) 1234-5678",
  servicios: ["chatbots", "crm", "crm"],
  mensaje: "",
  privacidad: true,
};

describe("contactSchema", () => {
  it("acepta un payload válido y normaliza campos", () => {
    const r = contactSchema.safeParse(validPayload);
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.email).toBe("ana@ejemplo.com");
    expect(r.data.whatsapp).toBe("528112345678");
    expect(r.data.servicios).toEqual(["chatbots", "crm"]);
    expect(r.data.mensaje).toBeUndefined();
  });

  it("rechaza correo inválido con mensaje en español", () => {
    const r = contactSchema.safeParse({ ...validPayload, email: "ana@" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error).email).toMatch(/correo/);
  });

  it("rechaza WhatsApp corto", () => {
    const r = contactSchema.safeParse({ ...validPayload, whatsapp: "12345" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error).whatsapp).toBeDefined();
  });

  it("exige al menos un servicio y el consentimiento", () => {
    const r = contactSchema.safeParse({ ...validPayload, servicios: [], privacidad: false });
    expect(r.success).toBe(false);
    if (r.success) return;
    const errors = fieldErrors(r.error);
    expect(errors.servicios).toBeDefined();
    expect(errors.privacidad).toBeDefined();
  });

  it("rechaza servicios y tipos de negocio desconocidos", () => {
    expect(contactSchema.safeParse({ ...validPayload, servicios: ["seo"] }).success).toBe(false);
    expect(contactSchema.safeParse({ ...validPayload, tipoNegocio: "banco" }).success).toBe(false);
  });

  it("rechaza contexto con claves o valores inesperados", () => {
    expect(contactSchema.safeParse({ ...validPayload, contexto: { negocio: "spa", reto: "orden" } }).success).toBe(true);
    expect(contactSchema.safeParse({ ...validPayload, contexto: { negocio: "<script>" } }).success).toBe(false);
    expect(contactSchema.safeParse({ ...validPayload, contexto: { extra: "x" } }).success).toBe(false);
  });

  it("limita el mensaje a 1500 caracteres", () => {
    expect(contactSchema.safeParse({ ...validPayload, mensaje: "a".repeat(1501) }).success).toBe(false);
  });
});
