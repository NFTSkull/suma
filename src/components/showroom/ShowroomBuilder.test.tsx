import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatMXN, formatMXNExact } from "@/lib/pricing";
import { ShowroomBuilder } from "./ShowroomBuilder";

const summary = () => screen.getByRole("list", { name: "Lo que estás eligiendo" });

describe("ShowroomBuilder", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
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
    expect(screen.getAllByText(formatMXNExact(4290)).length).toBeGreaterThan(0);
  });

  it("no duplica CRM al pasar al paquete Flow, y no eleva la cuota por equipo", () => {
    render(<ShowroomBuilder />);
    expect(screen.getByText(/Elige al menos un módulo para ver cuánto pagarías/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Personas del equipo"), { target: { value: "50" } });
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    expect(screen.getAllByText(formatMXNExact(2320)).length).toBeGreaterThan(0);
    expect(screen.queryByRole("checkbox", { name: "Organizar clientes (CRM)" })).not.toBeInTheDocument();
    expect(screen.getByText(/Qué incluye SUMA Flow/)).toBeInTheDocument();
  });

  it("desglosa lo que se compra, muestra el IVA y explica qué incluye cada módulo elegido", () => {
    render(<ShowroomBuilder />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Organizar clientes (CRM)" }));
    expect(within(summary()).getByText("Organizar clientes (CRM)")).toBeInTheDocument();
    expect(screen.getByText(/Sabes quién preguntó/)).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole("checkbox", { name: "Organizar clientes (CRM)" }));
    fireEvent.click(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "6 m" }));
    expect(screen.getByLabelText("Periodo")).toHaveValue("6");
    expect(screen.getByText(/Total mínimo: pago inicial \+ 6 meses de servicio/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Periodo"), { target: { value: "12" } });
    expect(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "12 m" })).toHaveAttribute("aria-pressed", "true");
  });

  it("permite pagar la implementación en 1 o 3 abonos y conserva el costo completo", () => {
    render(<ShowroomBuilder />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Organizar clientes (CRM)" }));
    expect(screen.getAllByText(formatMXNExact(2320)).length).toBeGreaterThan(0);
    fireEvent.click(within(screen.getByRole("group", { name: "Pagar implementación" })).getByRole("button", { name: "Un pago" }));
    expect(screen.getAllByText(formatMXNExact(3980)).length).toBeGreaterThan(0);
    fireEvent.click(within(screen.getByRole("group", { name: "Pagar implementación" })).getByRole("button", { name: "3 mensualidades" }));
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    expect(decodeURIComponent(href!.split("?text=")[1])).toContain("Referencia:");
  });

  it("genera un enlace WhatsApp con los detalles, pero no envía ni agenda una cita", () => {
    render(<ShowroomBuilder />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Organizar clientes (CRM)" }));
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    expect(decodeURIComponent(href!.split("?text=")[1])).toContain("Organizar clientes (CRM)");
    expect(screen.getByText(/Esta solicitud no agenda automáticamente una cita/i)).toBeInTheDocument();
  });

  it("no agrega CRM sin permiso al elegir Ads, ni lo envía en WhatsApp", () => {
    render(<ShowroomBuilder />);
    expect(screen.queryByRole("list", { name: "Lo que estás eligiendo" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    fireEvent.click(screen.getByRole("button", { name: /SUMA Ads/ }));
    expect(within(summary()).getByText(/SUMA Ads/)).toBeInTheDocument();
    expect(within(summary()).queryByText("Organizar clientes (CRM)")).not.toBeInTheDocument();
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    const msg = decodeURIComponent(href!.split("?text=")[1]);
    expect(msg).toContain("SUMA Ads");
    expect(msg).not.toContain("Asistente con IA para WhatsApp");
    expect(msg).not.toContain("Organizar clientes (CRM)");
  });

  it("limpia extras del paquete anterior al cambiar de Flow a Growth", () => {
    render(<ShowroomBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" }));
    expect(within(summary()).getByText("Asistente con IA para WhatsApp")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /SUMA Growth/ }));
    expect(within(summary()).queryByText("Asistente con IA para WhatsApp")).not.toBeInTheDocument();
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

  it("persiste la configuración en sessionStorage y la recupera al volver", () => {
    const { unmount } = render(<ShowroomBuilder />);
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Mi Estudio" } });
    fireEvent.click(screen.getByRole("checkbox", { name: "Organizar clientes (CRM)" }));
    fireEvent.change(screen.getByLabelText("Periodo"), { target: { value: "6" } });
    unmount();
    
    // Re-renderizar: debe recuperar los valores guardados
    render(<ShowroomBuilder />);
    expect(screen.getByLabelText("Nombre de tu negocio")).toHaveValue("Mi Estudio");
    expect(screen.getByRole("checkbox", { name: "Organizar clientes (CRM)" })).toBeChecked();
    expect(screen.getByLabelText("Periodo")).toHaveValue("6");
  });

  it("el mensaje de WhatsApp no excede ~800 caracteres con muchos servicios", () => {
    render(<ShowroomBuilder />);
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Estudio de Bienestar" } });
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    // Expandir para ver todos los módulos
    const expandButton = screen.getByRole("button", { name: /Ver los.*módulos/ });
    fireEvent.click(expandButton);
    // Seleccionar varios módulos
    fireEvent.click(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Una tarea automática" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Página sencilla para recibir clientes" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Anuncios en Google" }));
    
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    const msg = decodeURIComponent(href!.split("?text=")[1]);
    expect(msg.length).toBeLessThan(850); // Margen de seguridad bajo 1000
    expect(msg).toContain("SUMA Flow");
    expect(msg).toContain("módulos adicionales"); // Debe abreviar la lista
  });
});

describe("ShowroomBuilder · analítica GA4", () => {
  type DL = Window & { dataLayer?: Record<string, unknown>[] };
  const layer = () => ((window as DL).dataLayer ?? []).filter((item) => String(item.event).startsWith("showroom_"));

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
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
    expect(layer()).toEqual([{ event: "showroom_quote_updated", mode: "services", plan: "none", services_count: 1, months: 6 }]);
    expect(JSON.stringify((window as DL).dataLayer)).not.toContain("Fitco");
  });

  it("en paquete solo cuenta los módulos extra que se cobran", () => {
    vi.useFakeTimers();
    render(<ShowroomBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    act(() => vi.advanceTimersByTime(1600));
    expect(layer()).toEqual([{ event: "showroom_quote_updated", mode: "package", plan: "flow", services_count: 0, months: 3 }]);
  });

  it("sin consentimiento no se registra nada", () => {
    localStorage.setItem("suma-consent", JSON.stringify({ v: 1, analytics: "denied" }));
    render(<ShowroomBuilder />);
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Casa Luz" } });
    fireEvent.click(screen.getByRole("button", { name: "Atraer más clientes" }));
    expect((window as DL).dataLayer).toEqual([]);
  });
});
