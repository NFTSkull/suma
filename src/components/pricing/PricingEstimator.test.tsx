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
    expect(screen.getByRole("button", { name: /SUMA Flow/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(formatMXNExact(4866.67))).toBeInTheDocument();
    expect(screen.getByText(formatMXN(14600))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "flow");
  });

  it("al elegir Ads separa la pauta del cobro a SUMA", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("button", { name: /SUMA Ads/ }));
    expect(screen.getByText(formatMXNExact(4866.67))).toBeInTheDocument();
    expect(screen.getAllByText(formatMXN(6000), { exact: false }).length).toBeGreaterThan(0);
    expect((window as DL).dataLayer).toContainEqual({ event: "pricing_plan_selected", plan: "ads" });
  });

  it("se puede contratar solo una herramienta y seleccionarla en el configurador", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("button", { name: "Elegir funciones" }));
    expect(screen.getByText(/selecciona al menos un servicio/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Configurar tus reservas actuales" }));
    expect(screen.getAllByText(formatMXN(2900), { exact: true }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "individuales");
  });

  it("explica en lenguaje cotidiano qué pasa al cambiar de plan", () => {
    render(<PricingEstimator />);
    expect(screen.getAllByText("De una consulta a un siguiente paso claro")).toBeInTheDocument();
    expect(screen.getAllByText(/CRM significa un lugar para organizar/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver funciones opcionales" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("checkbox", { name: "Asistente de WhatsApp con IA" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /SUMA Ads/ }));
    expect(screen.getAllByText("De un anuncio a una consulta")).toBeInTheDocument();
    expect(screen.getByText(/SUMA no responde los mensajes/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ver funciones opcionales" }));
    expect(screen.getByRole("checkbox", { name: "Organizar clientes y dar seguimiento (CRM)" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Organizar clientes y dar seguimiento (CRM)" }));
    expect(screen.getByText(/También elegiste:/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 extra seleccionado" })).toHaveAttribute("aria-expanded", "true");
  });

  it("ofrece un pago o 3 abonos y aclara el total del contrato", () => {
    render(<PricingEstimator />);
    expect(screen.getByRole("button", { name: "3 mensualidades" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Un pago" }));
    expect(screen.getByText(formatMXNExact(8800))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "3 mensualidades" }));
    expect(screen.getByText(formatMXNExact(4866.67))).toBeInTheDocument();
    expect(screen.getByText(/El costo total incluye todas las parcialidades/i)).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: "Elegir funciones" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("checkbox", { name: "Asistente de WhatsApp con IA" })).toBeChecked();
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "individuales");
  });

});
