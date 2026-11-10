import { describe, expect, it } from "vitest";
import { primaryCta } from "./navigation";
import { site } from "./site";

describe("canal de contacto oficial SUMA", () => {
  it("apunta todos los contactos telefónicos al número confirmado", () => {
    expect(site.contact.phone).toBe("8114688882");
    expect(site.contact.phoneE164).toBe("+528114688882");
    expect(site.contact.whatsapp).toBe("528114688882");
    const url = new URL(site.contact.whatsappUrl);
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/528114688882");
    expect(url.searchParams.get("text")).toContain("SUMA STUDIO");
    expect(primaryCta.href).toBe(site.contact.whatsappUrl);
  });
});
