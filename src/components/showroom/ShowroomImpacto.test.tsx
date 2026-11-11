import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShowroomImpacto } from "./ShowroomImpacto";
import { showroomEstimate, type ShowroomSelection } from "@/lib/showroom";
import { formatMXN } from "@/lib/pricing";

const selection: ShowroomSelection = {
  businessName: "Estudio Aurora",
  industry: "pilates",
  experience: "crm",
  serviceIds: ["crm-gestionado"],
  locations: 1,
  teamUsers: 5,
  platform: "WhatsApp / Instagram",
};

const decoded = (href: string | null) => decodeURIComponent(href!.split("?text=")[1]);

describe("ShowroomImpacto · interacción", () => {
  it("parte de un ejemplo marcado campo por campo y explica el cálculo paso a paso", () => {
    render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} />);
    expect(screen.getByText(/Partimos de un estudio de ejemplo/)).toBeInTheDocument();
    expect(screen.getAllByText("Ejemplo").length).toBeGreaterThanOrEqual(4);
    // 180 consultas × 30% = 54 sin respuesta × 40% × 25% = 5.4 clientes × $1,800 = $9,720; 60% = $5,832; − $1,490 = +$4,342.
    expect(screen.getByText(/54 sin respuesta × 40% recuperadas × 25% compran/)).toBeInTheDocument();
    expect(screen.getByText(formatMXN(9720))).toBeInTheDocument();
    expect(screen.getByText(formatMXN(5832))).toBeInTheDocument();
    expect(screen.getByText("−" + formatMXN(1490))).toBeInTheDocument();
    expect(screen.getByText("+" + formatMXN(4342))).toBeInTheDocument();
    expect(screen.getByText(/Si estos supuestos se cumplen, el margen estimado cubriría la mensualidad/)).toBeInTheDocument();
    expect(screen.getByText(/harían falta 2 clientes nuevos al mes/)).toBeInTheDocument();
    expect(screen.getByText(/podrían liberarse/)).toBeInTheDocument();
    expect(screen.getAllByText(/No garantizado/i).length).toBeGreaterThan(0);
  });

  it("nunca promete resultados: sin frases afirmativas de rentabilidad", () => {
    const { container } = render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/se paga sola|garantizamos|recuperarás|vas a ganar|cubren la mensualidad/i);
    expect(text).toContain("Supone el mismo resultado cada mes desde el primero");
  });

  it("al editar un dato lo marca como propio; el escenario conservador reduce el resultado", () => {
    render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} />);
    fireEvent.change(screen.getByLabelText("Consultas nuevas al mes"), { target: { value: "360" } });
    expect(screen.getByText("Usando 1 de 4 datos tuyos.")).toBeInTheDocument();
    // Leyenda del encabezado + la etiqueta del campo editado.
    expect(screen.getAllByText("Tu dato")).toHaveLength(2);
    expect(screen.getByText(formatMXN(19440))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Conservador" }));
    expect(screen.getByText(formatMXN(9720))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Volver al ejemplo" }));
    expect(screen.getByText(/Partimos de un estudio de ejemplo/)).toBeInTheDocument();
  });

  it("sin consultas no cubre la mensualidad y nunca afirma que los datos se guardan", () => {
    render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} />);
    fireEvent.change(screen.getByLabelText("Consultas nuevas al mes"), { target: { value: "0" } });
    expect(screen.getByText(/el margen estimado no alcanzaría a cubrir la mensualidad/)).toBeInTheDocument();
    expect(screen.getByText(/la implementación no se recuperaría/)).toBeInTheDocument();
    expect(screen.getByText(/se calcula en tu navegador y no se guarda/)).toBeInTheDocument();
  });

  it("el periodo se comparte con la propuesta y el balance resta la implementación", () => {
    const onMonthsChange = vi.fn();
    const { rerender } = render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} onMonthsChange={onMonthsChange} />);
    expect(screen.getByText("+" + formatMXN(1852))).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "12 m" }));
    expect(onMonthsChange).toHaveBeenCalledWith(12);
    const year = { ...selection, months: 12 };
    rerender(<ShowroomImpacto selection={year} quote={showroomEstimate(year)} onMonthsChange={onMonthsChange} />);
    // 12 × $4,342 − $2,490 = $49,614
    expect(screen.getByText("+" + formatMXN(49614))).toBeInTheDocument();
    expect(screen.getByText(/se recuperaría en ~1 mes/)).toBeInTheDocument();
  });

  it("sin módulos de seguimiento no atribuye clientes, diferencia ni horas a lo elegido", () => {
    const adsSelection: ShowroomSelection = { ...selection, mode: "package", planId: "ads", serviceIds: [] };
    render(<ShowroomImpacto selection={adsSelection} quote={showroomEstimate(adsSelection)} />);
    expect(screen.getByText(/Oportunidad si alguien atiende esas consultas/)).toBeInTheDocument();
    expect(screen.getByText(/no la comparamos contra tu mensualidad/)).toBeInTheDocument();
    expect(screen.queryByText(/Diferencia estimada al mes/)).not.toBeInTheDocument();
    expect(screen.queryByText(/cubriría la mensualidad/)).not.toBeInTheDocument();
    expect(screen.queryByText(/podrían liberarse/)).not.toBeInTheDocument();
    const text = decoded(screen.getByRole("link", { name: /Quiero que SUMA revise mis números/ }).getAttribute("href"));
    expect(text).toContain("Me interesa: SUMA Ads");
    expect(text).not.toMatch(/diferencia de/);
  });

  it("el soporte de CRM o el SEO solos tampoco se presentan como fuente de clientes", () => {
    for (const serviceIds of [["mantenimiento-crm"], ["seo-local"], ["landing", "reservas"]] as ShowroomSelection["serviceIds"][]) {
      const only: ShowroomSelection = { ...selection, serviceIds };
      const { unmount } = render(<ShowroomImpacto selection={only} quote={showroomEstimate(only)} />);
      expect(screen.queryByText(/Diferencia estimada al mes/)).not.toBeInTheDocument();
      unmount();
    }
  });

  it("GA4: un solo showroom_impact_used con escenario, periodo y cuántos datos propios, sin cifras", () => {
    vi.useFakeTimers();
    localStorage.setItem("suma-consent", JSON.stringify({ v: 1, analytics: "granted" }));
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = [];
    render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} />);
    fireEvent.change(screen.getByLabelText("Consultas nuevas al mes"), { target: { value: "360" } });
    fireEvent.click(screen.getByRole("button", { name: "Conservador" }));
    act(() => vi.advanceTimersByTime(1600));
    fireEvent.change(screen.getByLabelText("Margen que te queda (%)"), { target: { value: "50" } });
    act(() => vi.advanceTimersByTime(1600));
    expect(w.dataLayer).toEqual([{ event: "showroom_impact_used", scenario: "conservative", months: 1, own_data_count: 1 }]);
    expect(JSON.stringify(w.dataLayer)).not.toContain("360");
    vi.useRealTimers();
    localStorage.clear();
  });

  it("el mensaje de WhatsApp conserva las notas del cliente y añade el resumen de supuestos", () => {
    const withNotes = { ...selection, notes: "Tengo dos sedes en San Pedro" };
    render(<ShowroomImpacto selection={withNotes} quote={showroomEstimate(withNotes)} />);
    const text = decoded(screen.getByRole("link", { name: /Quiero que SUMA revise mis números/ }).getAttribute("href"));
    expect(text).toContain("Quiero revisar una simulación con datos reales");
    expect(text).toContain("Nota: Tengo dos sedes en San Pedro.");
    expect(text).not.toContain("Escenario base (supuestos por validar)");
    expect(text).toContain("Estudio Aurora");
    expect(text.length).toBeLessThan(430);
  });
});
