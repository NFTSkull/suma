import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultConfig, withTypeSuggestions } from "@/lib/studio-os/catalog";
import { payingMembership, sessionTaken } from "@/lib/studio-os/rules";
import { createDemo } from "@/lib/studio-os/seed";
import { className, instructorName } from "@/lib/studio-os/selectors";
import { STORAGE_KEY, saveSession } from "@/lib/studio-os/storage";
import { fmtTime } from "@/lib/studio-os/time";
import StudioOs from "./StudioOs";

vi.mock("next/font/google", () => ({ Inter: () => ({ variable: "font-os-sans" }), Fraunces: () => ({ variable: "font-os-display" }) }));

/** Miércoles 11 de noviembre de 2026, 10:00. */
const NOW = new Date(2026, 10, 11, 10, 0);
const config = { ...withTypeSuggestions(defaultConfig(), "reformer"), name: "Casa Aurora" };

const nav = (name: string) => screen.getAllByRole("button", { name: new RegExp(`^${name}$`) })[0];
const statValue = (label: string) => {
  const button = screen.getAllByRole("button").find((b) => b.textContent?.includes(label))!;
  return Number(button.textContent!.replace(label, "").match(/\d+/)![0]);
};
function openApp() {
  const state = createDemo(config, NOW.toISOString());
  saveSession({ phase: "app", step: 3, config, state, baseline: { config, now: NOW.toISOString() } });
  render(<StudioOs />);
  return state;
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

describe("configurador", () => {
  it("tres pasos que conservan las respuestas al avanzar y retroceder", () => {
    render(<StudioOs />);
    expect(screen.getByText("Paso 1 de 3")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nombre comercial (opcional)"), { target: { value: "Casa Aurora" } });
    fireEvent.click(screen.getByRole("radio", { name: /^Reformer/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Actualizamos las sugerencias del paso 2 para Reformer");
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/ }));

    expect(screen.getByText("Paso 2 de 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reformer power/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("group", { name: "Salas" })).toHaveTextContent("2");
    fireEvent.click(screen.getByRole("button", { name: "Más instructores" }));
    fireEvent.click(screen.getByRole("button", { name: /Atrás/ }));
    expect(screen.getByLabelText("Nombre comercial (opcional)")).toHaveValue("Casa Aurora");
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/ }));
    expect(screen.getByRole("group", { name: "Instructores" })).toHaveTextContent("5");
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/ }));

    expect(screen.getByText("Paso 3 de 3")).toBeInTheDocument();
    expect(screen.getAllByRole("switch")).toHaveLength(6);
    for (const s of screen.getAllByRole("switch")) fireEvent.click(s);
    expect(screen.getByRole("button", { name: /Entrar a mi estudio/ })).toBeDisabled();
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent("Activa al menos un módulo");
    fireEvent.click(screen.getAllByRole("switch")[1]);
    fireEvent.click(screen.getByRole("button", { name: /Entrar a mi estudio/ }));
    // Con solo "Clases y reservas" activo, el menú no muestra Alumnas ni Pagos.
    expect(screen.getByRole("heading", { level: 2, name: /Casa Aurora/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Pagos$/ })).not.toBeInTheDocument();
    expect(nav("Agenda")).toBeInTheDocument();
  });

  it("los colores cambian al instante en la vista previa y en el sistema", () => {
    const { container } = render(<StudioOs />);
    const root = container.querySelector<HTMLElement>(".os-root")!;
    expect(root.style.getPropertyValue("--os-accent")).toBe("#A4502F");
    fireEvent.click(screen.getByRole("radio", { name: /Salvia/ }));
    expect(root.style.getPropertyValue("--os-accent")).toBe("#4F6E55");
  });

  it("no pide datos reales ni guarda el logotipo", async () => {
    render(<StudioOs />);
    expect(screen.getByText(/no se sube a ningún servidor/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nombre comercial (opcional)"), { target: { value: "Casa Aurora" } });
    const saved = sessionStorage.getItem(STORAGE_KEY)!;
    expect(saved).toContain("Casa Aurora");
    expect(saved).not.toMatch(/data:image/);
  });
});

describe("sistema", () => {
  it("una reserva actualiza cupo, crédito y panel, sin llamadas de red; restaurar lo deshace", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const state = openApp();
    const before = statValue("Reservas próximas");

    const target = state.sessions.find((s) => new Date(s.start).getDate() === 12 && sessionTaken(state, s.id) < s.capacity)!;
    const student = state.students.find((st) => {
      const m = payingMembership(state, st.id, target.start);
      return m && m.creditsTotal !== null && !state.bookings.some((b) => b.sessionId === target.id && b.studentId === st.id);
    })!;

    fireEvent.click(nav("Agenda"));
    fireEvent.click(screen.getByRole("button", { name: /^Jue12/ }));
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

    fireEvent.click(nav("Inicio"));
    expect(statValue("Reservas próximas")).toBe(before + 1);

    fireEvent.click(screen.getAllByRole("button", { name: /Restaurar demostración/ })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /Sí, restaurar/ })[0]);
    expect(statValue("Reservas próximas")).toBe(before);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("mientras el sistema está abierto, el sitio de fondo no recibe foco", () => {
    const main = document.createElement("main");
    main.id = "contenido";
    document.body.appendChild(main);
    openApp();
    expect(main).toHaveAttribute("inert");
    expect(screen.getByRole("dialog")).toHaveFocus();
    fireEvent.click(screen.getAllByRole("button", { name: /Salir al configurador/ })[0]);
    expect(main).not.toHaveAttribute("inert");
    main.remove();
  });

  it("los roles muestran vistas coherentes", () => {
    openApp();
    expect(nav("Pagos")).toBeInTheDocument();
    fireEvent.change(screen.getAllByLabelText("Ver como")[0], { target: { value: "instructor" } });
    expect(screen.queryByRole("button", { name: /^Pagos$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Reportes$/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pasar lista/ })).toBeInTheDocument();
    fireEvent.click(nav("Alumnas"));
    expect(screen.queryByText("Notas internas")).not.toBeInTheDocument();
    fireEvent.change(screen.getAllByLabelText("Ver como")[0], { target: { value: "recepcion" } });
    expect(nav("Pagos")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Reportes$/ })).not.toBeInTheDocument();
  });

  it("pagos siempre avisa que son datos ficticios; el resumen no muestra precios y abre WhatsApp solo al pulsar", () => {
    openApp();
    fireEvent.click(nav("Pagos"));
    expect(screen.getByText("Datos ficticios — No se procesan pagos.")).toBeInTheDocument();
    fireEvent.click(nav("Así quedaría"));
    const cta = screen.getByRole("link", { name: /Solicitar propuesta personalizada/ });
    expect(cta.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    const text = decodeURIComponent(cta.getAttribute("href")!.split("?text=")[1]);
    expect(text).toContain("Casa Aurora");
    expect(text).not.toMatch(/\$\s?\d/);
    expect(screen.getByRole("button", { name: /Copiar resumen/ })).toBeInTheDocument();
  });

  it("el portal comparte el estado: reservar ahí descuenta un crédito", () => {
    const state = openApp();
    fireEvent.click(nav("Portal de alumnas"));
    const student = state.students.find((s) => s.id === state.portalStudentId)!;
    const credits = () => screen.getByText(/^Hola,/).nextElementSibling!.textContent;
    const before = credits();
    const reserve = screen.getAllByRole("button", { name: "Reservar" })[0];
    fireEvent.click(reserve);
    expect(screen.getByRole("status")).toHaveTextContent(new RegExp(`Reservado: ${student.name.split(" ")[0]}`));
    expect(credits()).not.toBe(before);
  });
});
