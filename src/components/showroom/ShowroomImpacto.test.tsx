import { fireEvent, render, screen, within } from "@testing-library/react";
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
    // 180 consultas × 30% = 54 sin respuesta × 40% × 25% = 5.4 clientes × $1,800 = $9,720; 60% = $5,832; − $3,900 = +$1,932.
    expect(screen.getByText(/54 sin respuesta × 40% recuperadas × 25% compran/)).toBeInTheDocument();
    expect(screen.getByText(formatMXN(9720))).toBeInTheDocument();
    expect(screen.getByText(formatMXN(5832))).toBeInTheDocument();
    expect(screen.getByText("−" + formatMXN(3900))).toBeInTheDocument();
    expect(screen.getByText("+" + formatMXN(1932))).toBeInTheDocument();
    expect(screen.getByText(/la mensualidad se paga sola/)).toBeInTheDocument();
    expect(screen.getAllByText(/No garantizado/i).length).toBeGreaterThan(0);
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
    expect(screen.getByText(/todavía no se cubre la mensualidad/)).toBeInTheDocument();
    expect(screen.getByText(/se calcula en tu navegador y no se guarda/)).toBeInTheDocument();
  });

  it("el periodo se comparte con la propuesta y el balance resta la implementación", () => {
    const onMonthsChange = vi.fn();
    const { rerender } = render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} onMonthsChange={onMonthsChange} />);
    expect(screen.getByText("-" + formatMXN(7968).replace("$", "$"))).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "12 m" }));
    expect(onMonthsChange).toHaveBeenCalledWith(12);
    const year = { ...selection, months: 12 };
    rerender(<ShowroomImpacto selection={year} quote={showroomEstimate(year)} onMonthsChange={onMonthsChange} />);
    // 12 × $1,932 − $9,900 = $13,284
    expect(screen.getByText("+" + formatMXN(13284))).toBeInTheDocument();
    expect(screen.getByText(/se recuperaría en ~6 meses/)).toBeInTheDocument();
  });

  it("sin implementación no dice que la implementación «no se recupera»", () => {
    const seo: ShowroomSelection = { ...selection, serviceIds: ["mantenimiento-crm"] };
    render(<ShowroomImpacto selection={seo} quote={showroomEstimate(seo)} />);
    fireEvent.change(screen.getByLabelText("Consultas nuevas al mes"), { target: { value: "0" } });
    expect(screen.getByText("Esta selección no tiene costo de implementación.")).toBeInTheDocument();
    expect(screen.queryByText(/la implementación no se recupera/)).not.toBeInTheDocument();
  });

  it("advierte cuando el paquete elegido no incluye seguimiento", () => {
    const adsSelection: ShowroomSelection = { ...selection, mode: "package", planId: "ads", serviceIds: [] };
    render(<ShowroomImpacto selection={adsSelection} quote={showroomEstimate(adsSelection)} />);
    expect(screen.getByText(/Publicidad, SEO o una web por sí solos no lo hacen/)).toBeInTheDocument();
  });

  it("el mensaje de WhatsApp conserva las notas del cliente y añade el resumen de supuestos", () => {
    const withNotes = { ...selection, notes: "Tengo dos sedes en San Pedro" };
    render(<ShowroomImpacto selection={withNotes} quote={showroomEstimate(withNotes)} />);
    const text = decoded(screen.getByRole("link", { name: /Quiero que SUMA revise mis números/ }).getAttribute("href"));
    expect(text).toContain("Quiero revisar con SUMA mi simulación de impacto");
    expect(text).toContain("Quiero agregar o revisar: Tengo dos sedes en San Pedro.");
    expect(text).toContain("supuestos por validar");
    expect(text).toContain(formatMXN(9720));
    expect(text).toContain("diferencia de +" + formatMXN(1932) + "/mes");
    expect(text).toContain("Mensualidad SUMA " + formatMXN(3900));
    expect(text).not.toContain("..");
  });
});
