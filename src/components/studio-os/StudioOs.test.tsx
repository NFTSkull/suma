import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultConfig } from "@/lib/studio-os/catalog";
import { payingMembership, sessionTaken } from "@/lib/studio-os/rules";
import { createDemo } from "@/lib/studio-os/seed";
import { className, instructorName } from "@/lib/studio-os/selectors";
import { STORAGE_KEY, saveSession } from "@/lib/studio-os/storage";
import { fmtTime } from "@/lib/studio-os/time";
import StudioOs from "./StudioOs";

vi.mock("next/font/google", () => ({ Geist: () => ({ variable: "font-os-sans" }), Fraunces: () => ({ variable: "font-os-display" }) }));
MotionGlobalConfig.skipAnimations = true;

/** Miércoles 11 de noviembre de 2026, 10:00. */
const NOW = new Date(2026, 10, 11, 10, 0);
const config = { ...defaultConfig("pilates"), name: "Casa Aurora" };

const nav = (name: string) => screen.getAllByRole("button", { name: new RegExp(`^${name}$`) })[0];
const statValue = (label: string) => {
  const button = screen.getAllByRole("button").find((b) => b.textContent?.includes(label))!;
  return Number(button.textContent!.replace(label, "").match(/\d+/)![0]);
};
function openApp(c = config) {
  const state = createDemo(c, NOW.toISOString());
  saveSession({ phase: "app", step: 8, config: c, state, baseline: { config: c, now: NOW.toISOString() } });
  const view = render(<StudioOs />);
  return Object.assign(state, { unmount: view.unmount });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  sessionStorage.clear();
});
afterEach(() => {
  vi.useRealTimers();
  document.body.style.overflow = "";
});

/** Deja que terminen las transiciones de salida (instantáneas en pruebas). */
const settle = () => act(() => new Promise((r) => setTimeout(r, 30)));
const click = async (el: HTMLElement) => { fireEvent.click(el); await settle(); };
const next = () => click(screen.getAllByRole("button", { name: /^Continuar( sin nombre)?$/ }).at(-1)!);
const start = () => click(screen.getByRole("button", { name: /Diseñar mi sistema/ }));

describe("configurador", () => {
  it("bienvenida, una pregunta por pantalla, respuestas que se conservan y menú según módulos", async () => {
    render(<StudioOs />);
    expect(screen.getByText(/Tu negocio\. Tu esencia\./)).toBeInTheDocument();
    await start();

    expect(screen.getByRole("radio", { name: /Pilates \/ Reformer/ })).toBeChecked();
    await next();
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Casa Aurora" } });
    await next(); // color
    await next(); // logo
    await next(); // clases
    expect(screen.getByRole("heading", { name: /clases impartes/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reformer power/ })).toHaveAttribute("aria-pressed", "true");
    await next(); // operación
    fireEvent.click(screen.getByText("Afinar cantidades"));
    expect(screen.getByRole("group", { name: "Salas" })).toHaveTextContent("2");
    fireEvent.click(screen.getByRole("button", { name: "Más instructores" }));
    await click(screen.getByRole("button", { name: /Atrás/ }));
    await next();
    fireEvent.click(screen.getByText("Afinar cantidades"));
    expect(screen.getByRole("group", { name: "Instructores" })).toHaveTextContent("5");
    await click(screen.getByRole("button", { name: "Paso 2: Identidad" }));
    expect(screen.getByLabelText("Nombre de tu negocio")).toHaveValue("Casa Aurora");
    for (let i = 0; i < 6; i++) await next();

    expect(screen.getAllByRole("switch")).toHaveLength(6);
    for (const sw of screen.getAllByRole("switch")) fireEvent.click(sw);
    expect(screen.getByRole("button", { name: /Crear mi sistema/ })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Elige al menos una opción");
    fireEvent.click(screen.getAllByRole("switch")[1]);
    await click(screen.getByRole("button", { name: /Crear mi sistema/ }));

    expect(screen.getByRole("heading", { name: "Casa Aurora" })).toBeInTheDocument();
    expect(screen.getByText("Pilates / Reformer")).toBeInTheDocument();
    await click(screen.getByRole("button", { name: /Entrar a mi sistema/ }));
    expect(screen.getByRole("heading", { level: 2, name: /Casa Aurora/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Pagos$/ })).not.toBeInTheDocument();
    expect(nav("Agenda")).toBeInTheDocument();
  });

  it("elegir Spa transforma preguntas, vista previa y sistema: citas, tratamientos, cabinas y terapeutas", async () => {
    render(<StudioOs />);
    await start();
    fireEvent.click(screen.getByRole("radio", { name: /^Spa/ }));
    const preview = () => screen.getByRole("complementary", { name: "Vista previa en vivo" });
    expect(within(preview()).getAllByText("Tratamientos").length).toBeGreaterThan(0);
    expect(within(preview()).queryByText("Alumnas")).not.toBeInTheDocument();
    await next();
    expect(screen.getByRole("heading", { name: /se llama tu spa/ })).toBeInTheDocument();
    await next(); await next(); await next();
    expect(screen.getByRole("heading", { name: /tratamientos ofreces/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Masaje relajante/ })).toHaveAttribute("aria-pressed", "true");
    await next();
    expect(screen.getByRole("heading", { name: /Cómo es tu spa/ })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Afinar cantidades"));
    expect(screen.queryByRole("group", { name: "Cupo por grupo" })).not.toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Cabinas" })).toBeInTheDocument();
    await next();
    expect(screen.getByText("Pago por tratamiento")).toBeInTheDocument();
    await next();
    await click(screen.getByRole("button", { name: /Crear mi sistema/ }));
    await click(screen.getByRole("button", { name: /Entrar a mi sistema/ }));
    for (const label of ["Citas", "Tratamientos", "Clientes", "Paquetes", "Terapeutas"]) expect(nav(label)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Alumnas$/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/lista de espera/i)).not.toBeInTheDocument();
  });

  it("los colores cambian al instante en la vista previa y en el sistema", async () => {
    render(<StudioOs />);
    const root = document.querySelector<HTMLElement>(".os-root")!;
    expect(root.style.getPropertyValue("--os-accent")).toBe("#A4502F");
    await start();
    await next(); await next();
    fireEvent.click(screen.getByRole("radio", { name: /Salvia/ }));
    expect(root.style.getPropertyValue("--os-accent")).toBe("#4F6E55");
  });

  it("no pide datos reales ni guarda el logotipo", async () => {
    render(<StudioOs />);
    await start();
    await next();
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Casa Aurora" } });
    await next(); await next();
    expect(screen.getByText(/no se sube a ningún servidor/)).toBeInTheDocument();
    const saved = sessionStorage.getItem(STORAGE_KEY)!;
    expect(saved).toContain("Casa Aurora");
    expect(saved).not.toMatch(/data:image/);
  });

  it("una sesión guardada con el modelo anterior se descarta sin errores", () => {
    sessionStorage.setItem("suma-studio-os:v3", JSON.stringify({ phase: "app", step: 3, config: { type: "reformer", classes: [] }, state: { version: 1 } }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ phase: "app", step: 3, config: { type: "reformer" }, state: null }));
    render(<StudioOs />);
    expect(screen.getByRole("button", { name: /Diseñar mi sistema/ })).toBeInTheDocument();
    expect(sessionStorage.getItem("suma-studio-os:v3")).toBeNull();
  });
});

describe("spa y wellness", () => {
  it("en el spa se agenda una cita en un horario libre y aparece en la agenda y en el inicio", async () => {
    openApp({ ...defaultConfig("spa"), name: "Bruma Spa" });
    const before = statValue("Citas hoy");
    await click(nav("Citas"));
    await click(screen.getByRole("button", { name: /^Nueva cita$/ }));
    const select = screen.getByLabelText<HTMLSelectElement>("Cliente");
    fireEvent.change(select, { target: { value: select.options[2].value } });
    const slot = screen.getAllByRole("button").find((b) => /^\d\d:\d\d/.test(b.textContent ?? ""))!;
    await click(slot);
    expect(screen.getByRole("status")).toHaveTextContent(/Cita agendada/);
    await click(nav("Inicio"));
    expect(statValue("Citas hoy")).toBe(before + 1);
  });

  it("el wellness center muestra sesiones, experiencias y especialistas", async () => {
    openApp({ ...defaultConfig("wellness"), name: "Centro Alba" });
    for (const label of ["Agenda", "Experiencias", "Clientes", "Programas y paquetes", "Especialistas"]) expect(nav(label)).toBeInTheDocument();
    await click(nav("Experiencias"));
    expect(screen.getAllByText("Individual").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Grupal").length).toBeGreaterThan(0);
  });
});

describe("sistema", () => {
  it("una reserva actualiza cupo, crédito y panel, sin llamadas de red; restaurar lo deshace", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const state = openApp();
    const before = statValue("Reservas próximas");

    const target = state.sessions.find((s) => new Date(s.start).getDate() === 12 && sessionTaken(state, s.id) < s.capacity)!;
    const student = state.students.find((st) => {
      const m = payingMembership(state, st.id, target.start);
      return m && m.creditsTotal !== null && !state.bookings.some((b) => b.sessionId === target.id && b.studentId === st.id);
    })!;

    await click(nav("Agenda"));
    await click(screen.getByRole("button", { name: /^Jue12/ }));
    const card = screen.getAllByRole("button").find((b) => b.textContent?.startsWith(fmtTime(target.start)) && b.textContent.includes(className(state, target)) && b.textContent.includes(instructorName(state, target.instructorId)))!;
    fireEvent.click(card);
    const panel = screen.getByRole("region", { name: className(state, target) });
    expect(within(panel).getByText(new RegExp(`de ${target.capacity} lugares`))).toHaveTextContent(`${sessionTaken(state, target.id)} de`);

    fireEvent.change(within(panel).getByLabelText("Inscribir alumna"), { target: { value: student.id } });
    fireEvent.click(within(panel).getByRole("button", { name: "Inscribir" }));
    expect(screen.getByRole("status")).toHaveTextContent(/^Reservado:/);
    expect(within(panel).getByText(new RegExp(`de ${target.capacity} lugares`))).toHaveTextContent(`${sessionTaken(state, target.id) + 1} de`);
    expect(within(panel).getByText(student.name)).toBeInTheDocument();

    // Duplicado: el motor lo rechaza y lo explica.
    expect(within(panel).queryByRole("option", { name: new RegExp(student.name) })).not.toBeInTheDocument();

    await click(nav("Inicio"));
    expect(statValue("Reservas próximas")).toBe(before + 1);

    fireEvent.click(screen.getAllByRole("button", { name: /Restaurar demostración/ })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /Sí, restaurar/ })[0]);
    expect(statValue("Reservas próximas")).toBe(before);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("mientras el sistema está abierto, el sitio de fondo no recibe foco", async () => {
    const main = document.createElement("main");
    main.id = "contenido";
    document.body.appendChild(main);
    const { unmount } = openApp();
    expect(main).toHaveAttribute("inert");
    expect(screen.getByRole("dialog")).toHaveFocus();
    await click(screen.getAllByRole("button", { name: /Salir al configurador/ })[0]);
    // El configurador también ocupa la pantalla: el fondo sigue inerte hasta cerrar la demo.
    expect(main).toHaveAttribute("inert");
    unmount();
    expect(main).not.toHaveAttribute("inert");
    main.remove();
  });

  it("los roles muestran vistas coherentes", async () => {
    openApp();
    expect(nav("Pagos")).toBeInTheDocument();
    fireEvent.change(screen.getAllByLabelText("Ver como")[0], { target: { value: "instructor" } });
    expect(screen.queryByRole("button", { name: /^Pagos$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Reportes$/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pasar lista/ })).toBeInTheDocument();
    await click(nav("Alumnas"));
    expect(screen.queryByText("Notas internas")).not.toBeInTheDocument();
    fireEvent.change(screen.getAllByLabelText("Ver como")[0], { target: { value: "recepcion" } });
    expect(nav("Pagos")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Reportes$/ })).not.toBeInTheDocument();
  });

  it("pagos siempre avisa que son datos ficticios; el resumen no muestra precios y abre WhatsApp solo al pulsar", async () => {
    openApp();
    await click(nav("Pagos"));
    expect(screen.getByText("Datos ficticios — No se procesan pagos.")).toBeInTheDocument();
    await click(nav("Así quedaría"));
    await click(screen.getByRole("button", { name: /Quiero una propuesta para mi negocio/ }));
    const cta = screen.getByRole("link", { name: /Enviar a SUMA por WhatsApp/ });
    expect(cta.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    const text = decodeURIComponent(cta.getAttribute("href")!.split("?text=")[1]);
    expect(text).toContain("Casa Aurora");
    expect(text).not.toMatch(/\$\s?\d/);
    expect(screen.getByRole("button", { name: /Copiar resumen/ })).toBeInTheDocument();
  });

  it("el portal comparte el estado: reservar ahí descuenta un crédito", async () => {
    const state = openApp();
    await click(nav("Portal de alumnas"));
    const student = state.students.find((s) => s.id === state.portalStudentId)!;
    const credits = () => screen.getByText(/^Hola,/).nextElementSibling!.textContent;
    const before = credits();
    const reserve = screen.getAllByRole("button", { name: "Reservar" })[0];
    fireEvent.click(reserve);
    expect(screen.getByRole("status")).toHaveTextContent(new RegExp(`Reservado: ${student.name.split(" ")[0]}`));
    expect(credits()).not.toBe(before);
  });
});
