import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_STORAGE_KEY, resetConsentMemoryForTests } from "@/lib/consent";
import { ConsentBanner } from "./ConsentBanner";
import { PrivacyPreferences } from "./PrivacyPreferences";

vi.mock("next/link", () => import("@/test/next-link-mock"));

beforeAll(() => {
  // jsdom no implementa showModal/close de <dialog>.
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
});

const stored = () => JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null");

describe("PrivacyPreferences", () => {
  beforeEach(() => {
    localStorage.clear();
    resetConsentMemoryForTests();
    (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
  });

  it("sin decisión la casilla no está premarcada; activarla y guardar concede la medición", async () => {
    const user = userEvent.setup();
    render(<PrivacyPreferences />);
    await user.click(screen.getByRole("button", { name: "Preferencias de privacidad" }));
    const toggle = screen.getByRole("checkbox", { name: /Medición de visitas/ });
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    expect(stored()).toEqual({ v: 1, analytics: "granted" });
    expect(screen.getByRole("status")).toHaveTextContent("Preferencias guardadas.");
  });

  it("permite retirar después una aceptación", async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "granted" }));
    const user = userEvent.setup();
    render(<PrivacyPreferences />);
    await user.click(screen.getByRole("button", { name: "Preferencias de privacidad" }));
    const toggle = screen.getByRole("checkbox", { name: /Medición de visitas/ });
    expect(toggle).toBeChecked();
    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    expect(stored()).toEqual({ v: 1, analytics: "denied" });
  });

  it("cancelar no cambia nada", async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "denied" }));
    const user = userEvent.setup();
    render(<PrivacyPreferences />);
    await user.click(screen.getByRole("button", { name: "Preferencias de privacidad" }));
    await user.click(screen.getByRole("checkbox", { name: /Medición de visitas/ }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(stored()).toEqual({ v: 1, analytics: "denied" });
    expect((window as Window & { dataLayer?: unknown[] }).dataLayer).toEqual([]);
  });

  it("decidir desde el footer también oculta el banner", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ConsentBanner />
        <PrivacyPreferences />
      </>,
    );
    expect(screen.getByRole("region", { name: "Tu privacidad, tu decisión" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Preferencias de privacidad" }));
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    expect(stored()).toEqual({ v: 1, analytics: "denied" });
    expect(screen.queryByRole("region", { name: "Tu privacidad, tu decisión" })).toBeNull();
  });
});
