import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { formatMXN } from "@/lib/pricing";
import { PricingEstimator } from "./PricingEstimator";

type DL = Window & { dataLayer?: Record<string, unknown>[] };

describe("PricingEstimator", () => {
  beforeEach(() => {
    localStorage.setItem("suma-consent", JSON.stringify({ v: 1, analytics: "granted" }));
    (window as DL).dataLayer = [];
  });

  it("inicia en Flow, cotiza instalación y mensualidad y permite WhatsApp", () => {
    render(<PricingEstimator />);
    expect(screen.getByRole("button", { name: "SUMA Flow" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(formatMXN(13800))).toBeInTheDocument();
    expect(screen.getByText(formatMXN(21600))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "flow");
  });

  it("al elegir Ads separa la pauta del cobro a SUMA", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("button", { name: "SUMA Ads" }));
    expect(screen.getByText(formatMXN(10800))).toBeInTheDocument();
    expect(screen.getAllByText(formatMXN(6000), { exact: false }).length).toBeGreaterThan(0);
    expect((window as DL).dataLayer).toContainEqual({ event: "pricing_plan_selected", plan: "ads" });
  });

  it("se puede contratar solo una herramienta y seleccionarla en el configurador", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("button", { name: "Solo servicios" }));
    expect(screen.getByText(/selecciona al menos un servicio/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Configurar reservador existente" }));
    expect(screen.getAllByText(formatMXN(4900), { exact: true }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /personalizar y consultar por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "individuales");
  });

  it("informa sin recargo de SUMA por asiento y sedes extra no se multiplican automáticamente", () => {
    render(<PricingEstimator />);
    expect(screen.getByText(/sin recargo de SUMA por asiento/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Número de sedes"), { target: { value: "3" } });
    expect(screen.getByText(/cotizaremos las demás/i)).toBeInTheDocument();
  });
});
