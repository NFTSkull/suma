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

  it("inicia en Flow y presenta un desglose de primer pago y tres meses", () => {
    render(<PricingEstimator />);
    expect(screen.getByRole("button", { name: "SUMA Flow" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(formatMXN(19800))).toBeInTheDocument();
    expect(screen.getByText(formatMXN(29600))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /revisar mi propuesta por WhatsApp/i })).toHaveAttribute("data-pricing-plan", "flow");
  });

  it("ajusta meses, cambia de plan y conserva publicidad como gasto externo", () => {
    render(<PricingEstimator />);
    fireEvent.change(screen.getByLabelText("Periodo de referencia"), { target: { value: "6" } });
    expect(screen.getByText(formatMXN(44300))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "SUMA Growth" }));
    expect(screen.getByText(formatMXN(34800))).toBeInTheDocument();
    expect(screen.getByText(formatMXN(48000), { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /revisar mi propuesta por WhatsApp/i })).toHaveAttribute("data-pricing-source", "estimator");
  });

  it("permite Start sin mantenimiento y añadirlo de forma opcional", () => {
    render(<PricingEstimator />);
    fireEvent.click(screen.getByRole("button", { name: "SUMA Start" }));
    const checkbox = screen.getByRole("checkbox", { name: /agregar mantenimiento opcional/i });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText(formatMXN(9890))).toBeInTheDocument();
    expect((window as DL).dataLayer).toContainEqual({ event: "pricing_plan_selected", plan: "start" });
  });
});
