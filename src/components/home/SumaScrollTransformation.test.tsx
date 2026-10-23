import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SumaScrollTransformation } from "./SumaScrollTransformation";

vi.mock("next/font/google", () => ({ Poppins: () => ({ className: "font-poppins" }) }));

type Entry = { isIntersecting: boolean; boundingClientRect: { top: number } };
let ioCallback: ((entries: Entry[]) => void) | null = null;
let rafQueue: FrameRequestCallback[] = [];
let blockTop = 900;
const BLOCK_HEIGHT = 300;
const originalIO = window.IntersectionObserver;
const originalMatchMedia = window.matchMedia;

class MockIO {
  constructor(cb: (entries: Entry[]) => void) {
    ioCallback = cb;
  }
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

const root = () => document.querySelector<HTMLElement>(".suma-shift")!;
const intersect = (isIntersecting: boolean) =>
  act(() => ioCallback?.([{ isIntersecting, boundingClientRect: { top: blockTop } }]));
const scrollTo = (top: number) => {
  blockTop = top;
  act(() => {
    window.dispatchEvent(new Event("scroll"));
    const queue = rafQueue;
    rafQueue = [];
    queue.forEach((cb) => cb(0));
  });
};
/** Top del bloque para que su centro quede en `ratio` de la ventana. */
const topFor = (ratio: number) => ratio * window.innerHeight - BLOCK_HEIGHT / 2;

function renderBlock() {
  render(<SumaScrollTransformation />);
  vi.spyOn(root(), "getBoundingClientRect").mockImplementation(
    () => ({ top: blockTop, height: BLOCK_HEIGHT, bottom: blockTop + BLOCK_HEIGHT }) as DOMRect,
  );
}

describe("SumaScrollTransformation", () => {
  beforeEach(() => {
    ioCallback = null;
    rafQueue = [];
    blockTop = 900;
    window.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => rafQueue.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => {});
  });
  afterEach(() => {
    window.IntersectionObserver = originalIO;
    window.matchMedia = originalMatchMedia;
    vi.unstubAllGlobals();
  });

  it("expone el contraste completo a lectores de pantalla y oculta la capa animada", () => {
    renderBlock();
    expect(screen.getByText("Una forma más simple de trabajar")).toBeInTheDocument();
    expect(screen.getByText("Antes: Mensajes sin responder. Con SUMA: Atención más ágil.")).toBeInTheDocument();
    expect(screen.getByText("Antes: Tareas repetitivas. Con SUMA: Más tiempo para tus clientes.")).toBeInTheDocument();
    expect(root().querySelector("ol")).toHaveAttribute("aria-hidden", "true");
    expect(root().querySelector("[aria-live]")).toBeNull();
  });

  it("empieza en ANTES y se transforma al bajar; regresa al subir", () => {
    renderBlock();
    expect(root()).not.toHaveAttribute("data-state");
    intersect(true);
    expect(root()).toHaveAttribute("data-state", "before");
    scrollTo(topFor(0.55));
    expect(root()).toHaveAttribute("data-state", "after");
    expect(screen.getByRole("button", { name: "Con SUMA" })).toHaveAttribute("aria-pressed", "true");
    scrollTo(topFor(0.8));
    expect(root()).toHaveAttribute("data-state", "before");
  });

  it("no parpadea cerca del umbral (histéresis)", () => {
    renderBlock();
    intersect(true);
    scrollTo(topFor(0.55));
    scrollTo(topFor(0.66));
    scrollTo(topFor(0.62));
    expect(root()).toHaveAttribute("data-state", "after");
  });

  it("al entrar directo a mitad de página muestra el estado que corresponde", () => {
    blockTop = topFor(0.3);
    renderBlock();
    intersect(true);
    expect(root()).toHaveAttribute("data-state", "after");
  });

  it("fuera de pantalla queda en ANTES abajo y en CON SUMA arriba", () => {
    renderBlock();
    intersect(false);
    expect(root()).toHaveAttribute("data-state", "before");
    blockTop = -800;
    intersect(false);
    expect(root()).toHaveAttribute("data-state", "after");
  });

  it("respeta la elección manual hasta que el bloque sale de pantalla", () => {
    renderBlock();
    intersect(true);
    scrollTo(topFor(0.5));
    fireEvent.click(screen.getByRole("button", { name: "Antes" }));
    expect(root()).toHaveAttribute("data-state", "before");
    expect(screen.getByRole("button", { name: "Antes" })).toHaveAttribute("aria-pressed", "true");
    scrollTo(topFor(0.45));
    expect(root()).toHaveAttribute("data-state", "before");
    blockTop = 2000;
    intersect(false);
    intersect(true);
    scrollTo(topFor(0.5));
    expect(root()).toHaveAttribute("data-state", "after");
  });

  it("con movimiento reducido muestra directamente CON SUMA", () => {
    window.matchMedia = ((query: string) => ({ matches: query.includes("reduce"), media: query })) as typeof window.matchMedia;
    renderBlock();
    intersect(true);
    expect(root()).toHaveAttribute("data-state", "after");
    scrollTo(topFor(0.9));
    expect(root()).toHaveAttribute("data-state", "after");
  });
});
