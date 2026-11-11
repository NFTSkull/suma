import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatMXN, formatMXNExact } from "@/lib/pricing";
import { ShowroomBuilder } from "./ShowroomBuilder";

const summary = () => screen.getByRole("list", { name: "Lo que estás eligiendo" });

describe("ShowroomBuilder", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("permite personalizar nombre, elegir demo y añadir un módulo", () => {
    render(<ShowroomBuilder />);
    expect(screen.getByText("Estudio Aurora")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Casa Luz" } });
    expect(screen.getByText("Casa Luz")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Chatbot para WhatsApp/i }));
    expect(screen.getByText(/Prueba una conversación de ejemplo/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Añadir a mi propuesta +" }));
    expect(screen.getByRole("status")).toHaveTextContent("Ya está en tu propuesta");
    expect(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).toBeChecked();
    expect(within(summary()).getByText("Asistente con IA para WhatsApp")).toBeInTheDocument();
    expect(screen.getAllByText(formatMXNExact(6610)).length).toBeGreaterThan(0);
  });

  it("no duplica CRM al pasar al paquete Flow, y no eleva la cuota por equipo", () => {
    render(<ShowroomBuilder />);
    expect(screen.getAllByText(formatMXNExact(2320)).length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText("Personas del equipo"), { target: { value: "50" } });
    expect(screen.getAllByText(formatMXNExact(2320)).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    expect(screen.getAllByText(formatMXNExact(2320)).length).toBeGreaterThan(0);
    expect(screen.queryByRole("checkbox", { name: "Organizar clientes (CRM)" })).not.toBeInTheDocument();
    expect(screen.getByText(/Qué incluye SUMA Flow/)).toBeInTheDocument();
  });

  it("desglosa lo que se compra, muestra el IVA y explica qué incluye cada módulo elegido", () => {
    render(<ShowroomBuilder />);
    expect(within(summary()).getByText("Organizar clientes (CRM)")).toBeInTheDocument();
    expect(screen.getByText(/Ordenamos consultas, seguimiento/)).toBeInTheDocument();
    // ($2,490 / 3 + $1,490) × 1.16
    expect(screen.getByText(formatMXNExact(2691.20))).toBeInTheDocument();
    for (const step of ["Descubrimos", "Diseñamos", "Construimos", "Evolucionamos"]) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }
  });

  it("muestra primero los módulos recomendados para el objetivo y permite ver el catálogo completo", () => {
    render(<ShowroomBuilder />);
    // «Responder mejor» → CRM, chatbot con IA y automatización.
    expect(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Una tarea automática" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Aplicación móvil a medida" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ver los 13 módulos/ }));
    expect(screen.getByRole("checkbox", { name: "Aplicación móvil a medida" })).toBeInTheDocument();
  });

  it("el periodo del simulador y el de la propuesta son el mismo", () => {
    render(<ShowroomBuilder />);
    fireEvent.click(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "6 m" }));
    expect(screen.getByLabelText("Periodo")).toHaveValue("6");
    expect(screen.getByText(/Total mínimo: pago inicial \+ 6 meses de servicio/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Periodo"), { target: { value: "12" } });
    expect(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "12 m" })).toHaveAttribute("aria-pressed", "true");
  });

  it("permite pagar la implementación en 1 o 3 abonos y conserva el costo completo", () => {
    render(<ShowroomBuilder />);
    expect(screen.getAllByText(formatMXNExact(2320)).length).toBeGreaterThan(0);
    fireEvent.click(within(screen.getByRole("group", { name: "Pagar implementación" })).getByRole("button", { name: "Un pago" }));
    expect(screen.getAllByText(formatMXNExact(3980)).length).toBeGreaterThan(0);
    fireEvent.click(within(screen.getByRole("group", { name: "Pagar implementación" })).getByRole("button", { name: "3 mensualidades" }));
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    expect(decodeURIComponent(href!.split("?text=")[1])).toContain("3 abonos mensuales");
  });

  it("genera un enlace WhatsApp con los detalles, pero no envía ni agenda una cita", () => {
    render(<ShowroomBuilder />);
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    expect(decodeURIComponent(href!.split("?text=")[1])).toContain("Organizar clientes (CRM)");
    expect(screen.getByText(/Esta solicitud no agenda automáticamente una cita/i)).toBeInTheDocument();
  });

  it("recomienda tres experiencias sin esconder el catálogo completo", () => {
    render(<ShowroomBuilder />);
    expect(screen.getByRole("button", { name: /Chatbot para WhatsApp/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Campañas digitales/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Atraer más clientes" }));
    expect(screen.getByRole("button", { name: /Campañas digitales/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Chatbot para WhatsApp/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ver las 9 demos/i }));
    expect(screen.getByRole("button", { name: /Chatbot para WhatsApp/i })).toBeInTheDocument();
  });
});

describe("ShowroomBuilder · analítica GA4", () => {
  type DL = Window & { dataLayer?: Record<string, unknown>[] };
  const layer = () => ((window as DL).dataLayer ?? []).filter((item) => String(item.event).startsWith("showroom_"));

  beforeEach(() => {
    localStorage.setItem("suma-consent", JSON.stringify({ v: 1, analytics: "granted" }));
    (window as DL).dataLayer = [];
  });
  afterEach(() => vi.useRealTimers());

  it("personalizar envía giro y estilo una sola vez, nunca el nombre del negocio", () => {
    render(<ShowroomBuilder />);
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Casa Luz Pilates" } });
    fireEvent.change(screen.getByLabelText("Estilo de la demo"), { target: { value: "salvia" } });
    expect(layer()).toEqual([{ event: "showroom_personalized", industry: "pilates", style: "suma" }]);
    expect(JSON.stringify((window as DL).dataLayer)).not.toContain("Casa Luz");
  });

  it("elegir objetivo o demo registra el identificador de la demo mostrada", () => {
    render(<ShowroomBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "Atraer más clientes" }));
    fireEvent.click(screen.getByRole("button", { name: /Ver las 9 demos/i }));
    fireEvent.click(screen.getByRole("button", { name: /Chatbot para WhatsApp/i }));
    expect(layer()).toEqual([
      { event: "showroom_demo_viewed", goal: "captar", experience: "ads" },
      { event: "showroom_demo_viewed", goal: "captar", experience: "chatbot" },
    ]);
  });

  it("los cambios de propuesta se agrupan en un solo evento sin importes ni notas", () => {
    vi.useFakeTimers();
    render(<ShowroomBuilder />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Una tarea automática" }));
    fireEvent.change(screen.getByLabelText("Periodo"), { target: { value: "6" } });
    fireEvent.change(screen.getByLabelText("Algo más (opcional)"), { target: { value: "Tengo Fitco" } });
    expect(layer()).toEqual([]);
    act(() => vi.advanceTimersByTime(1600));
    expect(layer()).toEqual([{ event: "showroom_quote_updated", mode: "services", plan: "none", services_count: 2, months: 6 }]);
    expect(JSON.stringify((window as DL).dataLayer)).not.toContain("Fitco");
  });

  it("en paquete solo cuenta los módulos extra que se cobran", () => {
    vi.useFakeTimers();
    render(<ShowroomBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    act(() => vi.advanceTimersByTime(1600));
    expect(layer()).toEqual([{ event: "showroom_quote_updated", mode: "package", plan: "flow", services_count: 0, months: 1 }]);
  });

  it("sin consentimiento no se registra nada", () => {
    localStorage.setItem("suma-consent", JSON.stringify({ v: 1, analytics: "denied" }));
    render(<ShowroomBuilder />);
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Casa Luz" } });
    fireEvent.click(screen.getByRole("button", { name: "Atraer más clientes" }));
    expect((window as DL).dataLayer).toEqual([]);
  });
});
