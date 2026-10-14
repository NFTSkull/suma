import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SplashScreen } from "./SplashScreen";

let completeReveal: () => void = () => {};

vi.mock("./SumaStudioLogoReveal", () => ({
  SumaStudioLogoReveal: ({ onComplete }: { onComplete?: () => void }) => {
    completeReveal = () => onComplete?.();
    return <div data-testid="logo-reveal" />;
  },
}));

const splash = () => document.querySelector<HTMLElement>(".suma-splash");

describe("SplashScreen", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("muestra la animación y se retira al terminar", () => {
    render(<SplashScreen />);
    expect(screen.getByTestId("logo-reveal")).toBeInTheDocument();
    expect(splash()).toHaveAttribute("data-state", "playing");
    expect(splash()).toHaveAttribute("aria-hidden", "true");

    act(() => completeReveal());
    act(() => vi.advanceTimersByTime(450));
    expect(splash()).toHaveAttribute("data-state", "leaving");

    fireEvent.transitionEnd(splash()!, { propertyName: "opacity" });
    expect(splash()).toBeNull();
  });

  it("se retira aunque no llegue el evento de transición", () => {
    render(<SplashScreen />);
    act(() => completeReveal());
    act(() => vi.advanceTimersByTime(450 + 650 + 150));
    expect(splash()).toBeNull();
  });

  it("abre la página arriba salvo que la URL apunte a una sección", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<SplashScreen />);
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockClear();

    window.history.replaceState(null, "", "#selector");
    render(<SplashScreen />);
    expect(scrollTo).not.toHaveBeenCalled();
    window.history.replaceState(null, "", "/");
    scrollTo.mockRestore();
  });

  it("vuelve a mostrarse en cada carga de la página", () => {
    const first = render(<SplashScreen />);
    act(() => completeReveal());
    act(() => vi.advanceTimersByTime(450 + 650 + 150));
    first.unmount();

    render(<SplashScreen />);
    expect(splash()).toHaveAttribute("data-state", "playing");
  });
});
