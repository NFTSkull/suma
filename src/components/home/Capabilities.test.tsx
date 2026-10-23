import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { capabilityAnchorId, serviceShortcuts } from "@/content/service-shortcuts";
import { serviceBySlug } from "@/content/services";
import type { ServiceSlug } from "@/types/content";
import { Capabilities } from "./Capabilities";
import { EMPHASIS_MS, SCROLL_SETTLE_FALLBACK_MS } from "./ServiceShortcuts";

vi.mock("next/link", () => import("@/test/next-link-mock"));

const option = (label: string) => screen.getByRole("button", { name: label });
const card = (slug: ServiceSlug) => document.getElementById(capabilityAnchorId(slug))!;
const pointerClick = (el: HTMLElement) => fireEvent.click(el, { detail: 1 });

let scrollIntoView: ReturnType<typeof vi.fn>;
const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  scrollIntoView = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoView as unknown as Element["scrollIntoView"];
});

afterEach(() => {
  vi.useRealTimers();
  window.matchMedia = originalMatchMedia;
});

describe("Capabilities · selector de necesidades", () => {
  it("muestra la pregunta y las cinco opciones en el orden de las tarjetas, sin el texto secundario anterior", () => {
    render(<Capabilities />);
    expect(screen.getByRole("heading", { level: 2, name: /Cinco maneras de hacer que tu negocio fluya/ })).toBeInTheDocument();
    const group = screen.getByRole("group", { name: "¿Qué te gustaría mejorar hoy?" });
    const buttons = within(group).getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "Responder mensajes",
      "Organizar clientes y citas",
      "Crear una experiencia móvil",
      "Mejorar mi página web",
      "Atraer más clientes",
    ]);
    expect(screen.queryByText(/No se trata de agregar más herramientas/)).not.toBeInTheDocument();

    const cardIds = Array.from(document.querySelectorAll(".capability-card")).map((el) => el.id);
    expect(buttons.map((b) => b.getAttribute("aria-controls"))).toEqual(cardIds);
    for (const b of buttons) expect(b).toHaveAttribute("aria-pressed", "false");
  });

  it("cada tarjeta conserva su enlace al servicio", () => {
    render(<Capabilities />);
    for (const s of serviceShortcuts) {
      const link = within(card(s.service)).getByRole("link");
      expect(link).toHaveAttribute("href", serviceBySlug[s.service].href);
    }
  });

  it("no desplaza la página al montarse", () => {
    render(<Capabilities />);
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(document.querySelector("[data-emphasis]")).toBeNull();
  });

  it.each(serviceShortcuts.map((s) => [s.label, s.service] as const))(
    "«%s» lleva suavemente a la tarjeta de %s",
    (label, slug) => {
      render(<Capabilities />);
      pointerClick(option(label));
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView.mock.contexts[0]).toBe(card(slug));
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
      expect(option(label)).toHaveAttribute("aria-pressed", "true");
      expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
    },
  );

  it("enfatiza la tarjeta al terminar el desplazamiento y lo retira después", () => {
    vi.useFakeTimers();
    render(<Capabilities />);
    pointerClick(option("Organizar clientes y citas"));
    expect(card("crm")).not.toHaveAttribute("data-emphasis");
    fireEvent(window, new Event("scrollend"));
    expect(card("crm")).toHaveAttribute("data-emphasis", "true");
    vi.advanceTimersByTime(EMPHASIS_MS);
    expect(card("crm")).not.toHaveAttribute("data-emphasis");
  });

  it("usa un respaldo si el navegador no emite scrollend", () => {
    vi.useFakeTimers();
    render(<Capabilities />);
    pointerClick(option("Atraer más clientes"));
    vi.advanceTimersByTime(SCROLL_SETTLE_FALLBACK_MS);
    expect(card("publicidad-digital")).toHaveAttribute("data-emphasis", "true");
  });

  it("solo una tarjeta queda enfatizada al cambiar de opción", () => {
    render(<Capabilities />);
    pointerClick(option("Organizar clientes y citas"));
    fireEvent(window, new Event("scrollend"));
    pointerClick(option("Responder mensajes"));
    fireEvent(window, new Event("scrollend"));
    expect(card("crm")).not.toHaveAttribute("data-emphasis");
    expect(card("chatbots")).toHaveAttribute("data-emphasis", "true");
  });

  it("con movimiento reducido salta sin animación y enfatiza de inmediato", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    render(<Capabilities />);
    pointerClick(option("Mejorar mi página web"));
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
    expect(card("paginas-web")).toHaveAttribute("data-emphasis", "true");
  });

  it("con puntero el foco se queda en el selector", async () => {
    const user = userEvent.setup();
    render(<Capabilities />);
    await user.click(option("Crear una experiencia móvil"));
    expect(option("Crear una experiencia móvil")).toHaveFocus();
  });

  it("con teclado el foco acompaña a la tarjeta destino", async () => {
    const user = userEvent.setup();
    render(<Capabilities />);
    option("Organizar clientes y citas").focus();
    await user.keyboard("{Enter}");
    expect(within(card("crm")).getByRole("link")).toHaveFocus();

    option("Responder mensajes").focus();
    await user.keyboard(" ");
    expect(within(card("chatbots")).getByRole("link")).toHaveFocus();
  });
});
