import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { formatMXN, formatMXNExact } from "@/lib/pricing";
import { PricingEstimator } from "./PricingEstimator";

type DL = Window & { dataLayer?: Record<string, unknown>[] };

describe("PricingEstimator", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/precios");
    localStorage.setItem("suma-consent", JSON.stringify({ v: 1, analytics: "granted" }));
    (window as DL).dataLayer = [];
  });

  it("inicia en Flow, cotiza instalación y mensualidad y permite WhatsApp", () => {
    render(<PricingEstimator />);
    expect(screen.getByRole("button", { name: "SUMA Flow" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(formatMXNExact(2320))).toBeInTheDocument();
    expect(screen.getAllByText(formatMXN(6960), { exact: false }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "flow");
  });

  it("al elegir Ads separa la pauta del cobro a SUMA", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("button", { name: "SUMA Ads" }));
    expect(screen.getByText(formatMXNExact(2320))).toBeInTheDocument();
    expect(screen.getAllByText(formatMXN(3000), { exact: false }).length).toBeGreaterThan(0);
    expect((window as DL).dataLayer).toContainEqual({ event: "pricing_plan_selected", plan: "ads" });
  });

  it("se puede contratar solo una herramienta y seleccionarla en el configurador", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("button", { name: "Solo servicios" }));
    expect(screen.getByText(/selecciona al menos un servicio/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Configurar agenda de reservas" }));
    expect(screen.getAllByText(formatMXN(990), { exact: true }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "individuales");
  });

  it("no conserva servicios extra cuando cambia de Flow a Ads o Growth", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" }));
    expect(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "SUMA Ads" }));
    expect(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).not.toBeChecked();
    const href = screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i }).getAttribute("href");
    const text = decodeURIComponent(href!.split("?text=")[1]);
    expect(text).toContain("SUMA Ads");
    expect(text).not.toContain("Asistente con IA para WhatsApp");
  });

  it("ofrece un pago o 3 abonos y aclara el total del contrato", () => {
    render(<PricingEstimator />);
    expect(screen.getByRole("button", { name: "3 mensualidades" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Un pago" }));
    expect(screen.getByText(formatMXNExact(3980))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "3 mensualidades" }));
    expect(screen.getByText(formatMXNExact(2320))).toBeInTheDocument();
    expect(screen.getByText(/Este ejemplo incluye todo el pago inicial/i)).toBeInTheDocument();
  });

  it("informa sin recargo de SUMA por asiento y sedes extra no se multiplican automáticamente", () => {
    render(<PricingEstimator />);
    expect(screen.getByText(/sin recargo de SUMA por asiento/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Número de sedes"), { target: { value: "3" } });
    expect(screen.getByText(/cotizaremos las demás/i)).toBeInTheDocument();
  });

  it("entra al configurador con el servicio elegido desde la tarjeta", () => {
    window.history.replaceState({}, "", "/precios?servicio=chatbot-ia#simulador");
    render(<PricingEstimator />);
    expect(screen.getByRole("button", { name: "Solo servicios" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).toBeChecked();
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "individuales");
  });

});
