import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AnimatedSumaSymbol } from "./AnimatedSumaSymbol";
import { SPLASH_LEAVE_EVENT } from "./splash-signal";

type Callback = (entries: Array<{ isIntersecting: boolean }>) => void;
let observers: Array<{ callback: Callback; options?: IntersectionObserverInit }> = [];
const originalIO = window.IntersectionObserver;

class MockIO {
  constructor(callback: Callback, options?: IntersectionObserverInit) {
    observers.push({ callback, options });
  }
  observe(el?: Element) {
    void el;
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

const symbol = () => document.querySelector<HTMLElement>(".suma-symbol")!;

describe("AnimatedSumaSymbol", () => {
  beforeEach(() => {
    observers = [];
    window.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
  });
  afterEach(() => {
    window.IntersectionObserver = originalIO;
    document.querySelectorAll(".suma-splash").forEach((el) => el.remove());
  });

  it("renderiza las tres piezas oficiales como capas decorativas", () => {
    render(<AnimatedSumaSymbol variant="cta" theme="navy" reducedMotion />);
    expect(symbol()).toHaveAttribute("aria-hidden", "true");
    expect(symbol()).toHaveAttribute("data-variant", "cta");
    expect(symbol()).toHaveAttribute("data-theme", "navy");
    const pieces = [...symbol().querySelectorAll("[data-piece]")].map((el) => el.getAttribute("data-piece"));
    expect(pieces).toEqual(["naranja", "rosa", "morado"]);
    const srcs = [...symbol().querySelectorAll("img")].map((img) => img.getAttribute("src"));
    expect(srcs).toEqual(["/brand/naranja.svg", "/brand/rosa.svg", "/brand/morado.svg"]);
  });

  it("con movimiento reducido muestra el símbolo ya formado", () => {
    render(<AnimatedSumaSymbol reducedMotion />);
    expect(symbol()).toHaveAttribute("data-state", "formed");
  });

  it("con trigger in-view espera a entrar al viewport", () => {
    render(<AnimatedSumaSymbol trigger="in-view" variant="cta" reducedMotion={false} />);
    expect(symbol()).not.toHaveAttribute("data-state");

    const entrance = observers.find((o) => o.options?.threshold === 0.35)!;
    act(() => entrance.callback([{ isIntersecting: false }]));
    expect(symbol()).not.toHaveAttribute("data-state");

    act(() => entrance.callback([{ isIntersecting: true }]));
    expect(symbol()).toHaveAttribute("data-state", "floating");
  });

  it("con trigger load espera a que se retire la pantalla de carga", () => {
    const splash = document.createElement("div");
    splash.className = "suma-splash";
    splash.dataset.state = "playing";
    document.body.appendChild(splash);

    render(<AnimatedSumaSymbol trigger="load" reducedMotion={false} />);
    expect(symbol()).not.toHaveAttribute("data-state");

    act(() => {
      window.dispatchEvent(new Event(SPLASH_LEAVE_EVENT));
    });
    expect(symbol()).toHaveAttribute("data-state", "floating");
  });

  it("con trigger in-view tampoco arranca detrás de la pantalla de carga", () => {
    const splash = document.createElement("div");
    splash.className = "suma-splash";
    splash.dataset.state = "playing";
    document.body.appendChild(splash);
    const observed: Element[] = [];
    window.IntersectionObserver = class extends MockIO {
      observe(el?: Element) {
        if (el) observed.push(el);
      }
    } as unknown as typeof IntersectionObserver;

    render(<AnimatedSumaSymbol trigger="in-view" reducedMotion={false} />);
    const before = observed.length;
    act(() => {
      window.dispatchEvent(new Event(SPLASH_LEAVE_EVENT));
    });
    expect(observed.length).toBe(before + 1);
  });

  it("arranca de inmediato si no hay pantalla de carga y limpia al desmontar", () => {
    const { unmount } = render(<AnimatedSumaSymbol trigger="load" reducedMotion={false} />);
    const el = symbol();
    expect(el).toHaveAttribute("data-state", "floating");
    unmount();
    expect(el).not.toHaveAttribute("data-state");
  });
});
