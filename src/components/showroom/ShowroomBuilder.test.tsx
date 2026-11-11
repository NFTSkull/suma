import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatMXN, formatMXNExact } from "@/lib/pricing";
import { ShowroomBuilder } from "./ShowroomBuilder";

type DL = Window & { dataLayer?: Record<string, unknown>[] };
const layer = () =>
  ((window as DL).dataLayer ?? []).filter((item) => String(item.event).startsWith("showroom_"));

function startWizard() {
  fireEvent.click(screen.getByRole("button", { name: /Iniciar experiencia/i }));
}
function completePersonalization() {
  startWizard();
  fireEvent.click(screen.getByRole("button", { name: /Omitir nombre y seguir/i }));
  fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
  fireEvent.click(screen.getByRole("button", { name: /Probar mi demo/i }));
}
function openQuote() {
  fireEvent.click(screen.getByRole("button", { name: /Ir directo a mi propuesta/i }));
}
function openAdvanced() {
  fireEvent.click(screen.getByText(/Cambiar mi plan o agregar funciones/i));
}
function addCRM() {
  fireEvent.click(screen.getByRole("button", { name: /Quiero incluir esta solución/i }));
}

describe("ShowroomBuilder · recorrido guiado", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => vi.useRealTimers());

  it("empieza con Iniciar y no muestra formularios ni precios antes de comenzar", () => {
    render(<ShowroomBuilder />);
    expect(screen.getByRole("button", { name: /Iniciar experiencia/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/Nombre de tu negocio/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Enviar mi propuesta por WhatsApp/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Mi propuesta estimada/i)).not.toBeInTheDocument();
  });

  it("pregunta nombre, giro y estilo uno a la vez, con regreso sin perder datos", () => {
    render(<ShowroomBuilder />);
    startWizard();
    const name = screen.getByLabelText("Nombre de tu negocio (opcional)");
    fireEvent.change(name, { target: { value: "Casa Luz Pilates" } });
    expect(screen.queryByLabelText("Tipo de negocio")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    expect(screen.getByLabelText("Tipo de negocio")).toHaveValue("pilates");
    expect(screen.queryByLabelText("Estilo de colores")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    fireEvent.change(screen.getByLabelText("Estilo de colores"), { target: { value: "salvia" } });
    fireEvent.click(screen.getByRole("button", { name: /Atrás/i }));
    fireEvent.click(screen.getByRole("button", { name: /Atrás/i }));
    expect(screen.getByLabelText("Nombre de tu negocio (opcional)")).toHaveValue("Casa Luz Pilates");
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    expect(screen.getByLabelText("Estilo de colores")).toHaveValue("salvia");
    fireEvent.click(screen.getByRole("button", { name: /Probar mi demo/i }));
    expect(screen.getByText("Casa Luz Pilates")).toBeInTheDocument();
    expect(screen.getByText(/Paso 2 de 4/)).toBeInTheDocument();
  });

  it("no inventa un nombre de negocio cuando lo omites", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    expect(screen.getByText("Tu negocio · ejemplo")).toBeInTheDocument();
    expect(screen.queryByText("Estudio Aurora")).not.toBeInTheDocument();
    openQuote();
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    expect(decodeURIComponent(href!.split("?text=")[1])).not.toContain("Estudio Aurora");
  });

  it("cada clic en una demo cambia la vista y permite probar el ejemplo", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    expect(screen.getByText(/Consultas de clientes · ejemplo/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Chatbot para WhatsApp/i }));
    expect(screen.getByText(/Asistente · escenario ilustrativo/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Chatbot para WhatsApp/i })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: /Ver las 9 demos/i }));
    fireEvent.click(screen.getByRole("button", { name: /Campañas digitales/i }));
    expect(screen.getByRole("button", { name: /Campañas digitales/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Prototipo con datos ficticios/)).toBeInTheDocument();
  });

  it("seleccionar una demo NO la cobra; añadirla sí actualiza la propuesta", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    expect(screen.getByText(/Todavía no has añadido ninguna solución/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Chatbot para WhatsApp/i }));
    expect(screen.getByText(/Todavía no has añadido ninguna solución/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Quiero incluir esta solución/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Añadido a tu propuesta");
    openQuote();
    const summary = screen.getByRole("list", { name: "Lo que estás eligiendo" });
    expect(within(summary).getByText("Asistente con IA para WhatsApp")).toBeInTheDocument();
    expect(screen.getAllByText(formatMXNExact(4290)).length).toBeGreaterThan(0);
  });

  it("la persona puede quitar la función antes de continuar", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    addCRM();
    expect(screen.getByRole("status")).toHaveTextContent("Añadido a tu propuesta");
    fireEvent.click(screen.getByRole("button", { name: "Quitar" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    openQuote();
    expect(screen.queryByRole("list", { name: "Lo que estás eligiendo" })).not.toBeInTheDocument();
  });

  it("puede calcular de forma opcional, volver a la demo y mantener la selección", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    addCRM();
    fireEvent.click(screen.getByRole("button", { name: /Siguiente: calcular/i }));
    expect(screen.getByRole("group", { name: "Periodo a evaluar" })).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "6 m" }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente: mi propuesta/i }));
    expect(screen.getByLabelText("Periodo")).toHaveValue("6");
    expect(screen.getByText(/Total mínimo: pago inicial \+ 6 meses de servicio/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Cambiar la solución que probé/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Añadido a tu propuesta");
  });

  it("sin ningún servicio evita mostrar cifras de rentabilidad ficticias", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    fireEvent.click(screen.getByRole("button", { name: /Siguiente: calcular/i }));
    expect(screen.getByText(/Para evitar resultados engañosos/)).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Periodo a evaluar" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Pedir una recomendación/i }));
    expect(screen.getByText(/Elige al menos un módulo para ver cuánto pagarías/)).toBeInTheDocument();
  });

  it("una propuesta de CRM muestra el IVA y el pago inicial completo sin duplicarlo", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    addCRM();
    openQuote();
    expect(screen.getAllByText(formatMXNExact(2320)).length).toBeGreaterThan(0);
    expect(screen.getByText(formatMXNExact(2691.20))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i })).toHaveAttribute("href", expect.stringContaining("wa.me/528114688882"));
    expect(screen.getByText(/Esta solicitud no agenda automáticamente una cita/i)).toBeInTheDocument();
  });

  it("el usuario puede comparar paquetes avanzados, sin arrastrar servicios de uno a otro", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    openQuote();
    openAdvanced();
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    expect(screen.getAllByText(formatMXNExact(2320)).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("checkbox", { name: "Asistente con IA para WhatsApp" }));
    expect(within(screen.getByRole("list", { name: "Lo que estás eligiendo" })).getByText("Asistente con IA para WhatsApp")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /SUMA Growth/ }));
    expect(within(screen.getByRole("list", { name: "Lo que estás eligiendo" })).queryByText("Asistente con IA para WhatsApp")).not.toBeInTheDocument();
  });

  it("actualizar equipo y sucursales se refleja en la demo al regresar", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    openQuote();
    fireEvent.change(screen.getByLabelText("Personas del equipo"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("Sucursales"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: /Cambiar la solución que probé/i }));
    expect(screen.getByText(/Equipo · 10 personas · 2 sucursales/)).toBeInTheDocument();
  });

  it("tiene una ruta directa de la demo a WhatsApp sin usar la calculadora", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    addCRM();
    openQuote();
    expect(screen.queryByRole("group", { name: "Periodo a evaluar" })).not.toBeInTheDocument();
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    const msg = decodeURIComponent(href!.split("?text=")[1]);
    expect(msg).toContain("Organizar clientes (CRM)");
    expect(msg).not.toContain("Estudio Aurora");
    expect(msg.length).toBeLessThan(450);
  });
});

describe("ShowroomBuilder · analítica sin datos personales", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("suma-consent", JSON.stringify({ v: 1, analytics: "granted" }));
    (window as DL).dataLayer = [];
  });
  afterEach(() => vi.useRealTimers());

  it("registra una sola personalización sin el nombre del negocio", () => {
    render(<ShowroomBuilder />);
    startWizard();
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio (opcional)"), { target: { value: "Casa Luz Pilates" } });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    fireEvent.change(screen.getByLabelText("Estilo de colores"), { target: { value: "salvia" } });
    fireEvent.click(screen.getByRole("button", { name: /Probar mi demo/i }));
    expect(layer().filter(x => x.event === "showroom_personalized")).toEqual([
      { event: "showroom_personalized", industry: "pilates", style: "suma" },
    ]);
    expect(JSON.stringify((window as DL).dataLayer)).not.toContain("Casa Luz");
  });

  it("las demos registran únicamente sus identificadores", () => {
    render(<ShowroomBuilder />);
    completePersonalization();
    (window as DL).dataLayer = [];
    fireEvent.click(screen.getByRole("button", { name: "Atraer más clientes" }));
    fireEvent.click(screen.getByRole("button", { name: /Ver las 9 demos/i }));
    fireEvent.click(screen.getByRole("button", { name: /Chatbot para WhatsApp/i }));
    expect(layer()).toEqual([
      { event: "showroom_demo_viewed", goal: "captar", experience: "ads" },
      { event: "showroom_demo_viewed", goal: "captar", experience: "chatbot" },
    ]);
  });

  it("agrupa cambios del cotizador sin publicar los importes ni las notas", () => {
    vi.useFakeTimers();
    render(<ShowroomBuilder />);
    completePersonalization();
    (window as DL).dataLayer = [];
    addCRM();
    openQuote();
    fireEvent.change(screen.getByLabelText("Periodo"), { target: { value: "6" } });
    fireEvent.change(screen.getByLabelText("Algo más (opcional)"), { target: { value: "Tengo Fitco" } });
    act(() => vi.advanceTimersByTime(1600));
    expect(layer()).toEqual([{ event: "showroom_quote_updated", mode: "services", plan: "none", services_count: 1, months: 6 }]);
    expect(JSON.stringify((window as DL).dataLayer)).not.toContain("Fitco");
  });

  it("sin consentimiento no se registra nada", () => {
    localStorage.setItem("suma-consent", JSON.stringify({ v: 1, analytics: "denied" }));
    render(<ShowroomBuilder />);
    completePersonalization();
    fireEvent.click(screen.getByRole("button", { name: "Atraer más clientes" }));
    expect((window as DL).dataLayer).toEqual([]);
  });
});
