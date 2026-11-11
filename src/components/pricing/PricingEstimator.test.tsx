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
    fireEvent.click(screen.getByRole("button", { name: "Elegir servicios" }));
    expect(screen.getByText(/Marca una función para ver qué incluye/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Configurar agenda de reservas" }));
    expect(screen.getAllByText(formatMXN(990), { exact: true }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "individuales");
  });

  it("no conserva servicios extra cuando cambia de Flow a Ads o Growth", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("button", { name: "Ver funciones opcionales" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" }));
    expect(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "SUMA Ads" }));
    expect(screen.queryByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).not.toBeInTheDocument();
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
    expect(screen.getByText(/Este total incluye toda la configuración/i)).toBeInTheDocument();
  });

  it("informa sin recargo de SUMA por asiento y sedes extra no se multiplican automáticamente", () => {
    render(<PricingEstimator />);
    expect(screen.getByText(/SUMA no cobra extra por integrante/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("¿Cuántas sucursales tienes?"), { target: { value: "3" } });
    expect(screen.getByText(/Las demás necesitan una cotización/i)).toBeInTheDocument();
  });

  it("explica los conceptos del desglose sin cambiar precios", () => {
    render(<PricingEstimator />);
    expect(screen.getAllByText("¿Qué es?").length).toBeGreaterThan(3);
    expect(screen.getAllByText("¿Qué es SUMA Flow?").length).toBeGreaterThan(0);
    expect(screen.getByText("Pago de configuración (una vez)")).toBeInTheDocument();
    expect(screen.getByText("Servicio de SUMA al mes")).toBeInTheDocument();
    expect(screen.getByText(formatMXNExact(2320))).toBeInTheDocument();
    expect(screen.getByText(/Con IVA general del 16%/)).toBeInTheDocument();
  });

  it("los extras se muestran solo cuando los solicita", () => {
    render(<PricingEstimator />);
    expect(screen.queryByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "Ver funciones opcionales" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver funciones opcionales" })).toHaveAttribute("aria-expanded", "true");
  });

  it("entra al configurador con el servicio elegido desde la tarjeta", () => {
    window.history.replaceState({}, "", "/precios?servicio=chatbot-ia#simulador");
    render(<PricingEstimator />);
    expect(screen.getByRole("button", { name: "Elegir servicios" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).toBeChecked();
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "individuales");
  });

});
