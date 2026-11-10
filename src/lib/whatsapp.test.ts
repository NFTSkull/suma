import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { whatsappUrlFor } from "./whatsapp";

describe("mensaje contextual de WhatsApp", () => {
  it("mantiene el contacto oficial cuando no existe contexto", () => {
    expect(whatsappUrlFor()).toBe(site.contact.whatsappUrl);
  });

  it("incluye servicio sin cambiar el número de contacto", () => {
    const url = new URL(whatsappUrlFor({ service: "CRM personalizado" }));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/528114688882");
    expect(url.searchParams.get("text")).toContain("servicio: CRM personalizado");
  });

  it("incluye el tipo de negocio y reto públicos del selector", () => {
    const url = new URL(whatsappUrlFor({ industry: "Spa o centro de bienestar", challenge: "Ordenar mis citas" }));
    const text = url.searchParams.get("text");
    expect(text).toContain("negocio: Spa o centro de bienestar");
    expect(text).toContain("necesidad: Ordenar mis citas");
    expect(text).not.toContain("undefined");
  });
});
