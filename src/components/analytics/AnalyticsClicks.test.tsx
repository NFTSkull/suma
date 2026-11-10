import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { contactMethodOf, serviceCtaAttrs } from "@/lib/analytics";
import { AnalyticsClicks } from "./AnalyticsClicks";

type DL = Window & { dataLayer?: Record<string, unknown>[] };
const layer = () => (window as DL).dataLayer ?? [];

function Page() {
  return (
    <>
      <AnalyticsClicks />
      <a href="mailto:hola@ejemplo.mx">Correo</a>
      <a href="https://wa.me/528100000000">WhatsApp</a>
      <a href="tel:+528100000000">Teléfono</a>
      <a href="/contacto" {...serviceCtaAttrs("crm", "hero")}>
        <span>Hablemos de tu proyecto</span>
      </a>
      <a href="/contacto" {...serviceCtaAttrs("crm", "closing")}>
        Cierre
      </a>
      <a href="https://wa.me/528114688882" {...serviceCtaAttrs("crm", "hero")}>CTA CRM por WhatsApp</a>
      <a href="/servicios">Servicios</a>
    </>
  );
}

describe("AnalyticsClicks", () => {
  beforeEach(() => {
    (window as DL).dataLayer = [];
  });

  it("registra contact_click por canal, sin la dirección ni el número", () => {
    render(<Page />);
    fireEvent.click(screen.getByText("Correo"));
    fireEvent.click(screen.getByText("WhatsApp"));
    fireEvent.click(screen.getByText("Teléfono"));
    expect(layer()).toEqual([
      { event: "contact_click", contact_method: "email" },
      { event: "contact_click", contact_method: "whatsapp" },
      { event: "contact_click", contact_method: "phone" },
    ]);
  });

  it("registra service_cta_click con servicio y ubicación, también al hacer clic en un hijo del enlace", () => {
    render(<Page />);
    fireEvent.click(screen.getByText("Hablemos de tu proyecto"));
    fireEvent.click(screen.getByText("Cierre"));
    expect(layer()).toEqual([
      { event: "service_cta_click", service: "crm", cta_location: "hero" },
      { event: "service_cta_click", service: "crm", cta_location: "closing" },
    ]);
  });

  it("un CTA de servicio a WhatsApp registra contacto y servicio una sola vez cada uno", () => {
    render(<Page />);
    fireEvent.click(screen.getByText("CTA CRM por WhatsApp"));
    expect(layer()).toEqual([
      { event: "contact_click", contact_method: "whatsapp" },
      { event: "service_cta_click", service: "crm", cta_location: "hero" },
    ]);
  });

  it("ignora enlaces normales y genera un solo evento por clic", () => {
    render(<Page />);
    fireEvent.click(screen.getByText("Servicios"));
    expect(layer()).toEqual([]);
    fireEvent.click(screen.getByText("Correo"));
    expect(layer()).toHaveLength(1);
  });

  it("contactMethodOf reconoce los canales", () => {
    expect(contactMethodOf("mailto:a@b.mx")).toBe("email");
    expect(contactMethodOf("tel:8100000000")).toBe("phone");
    expect(contactMethodOf("https://api.whatsapp.com/send?phone=52")).toBe("whatsapp");
    expect(contactMethodOf("/contacto")).toBeNull();
    expect(contactMethodOf("https://example.com/wa.me/")).toBeNull();
  });
});
