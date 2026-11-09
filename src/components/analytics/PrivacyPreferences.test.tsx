import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
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

describe("PrivacyPreferences", () => {
  beforeEach(() => {
    localStorage.clear();
    (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
  });

  it("permite desactivar la medición y guarda la elección", async () => {
    const user = userEvent.setup();
    render(<PrivacyPreferences />);
    await user.click(screen.getByRole("button", { name: "Preferencias de privacidad" }));
    const toggle = screen.getByRole("checkbox", { name: /Medición de visitas/ });
    expect(toggle).toBeChecked();
    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({ v: 1, analytics: "denied" });
    expect(screen.getByRole("status")).toHaveTextContent("Preferencias guardadas.");
  });

  it("al reabrir muestra la elección guardada; cancelar no cambia nada", async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "denied" }));
    const user = userEvent.setup();
    render(<PrivacyPreferences />);
    await user.click(screen.getByRole("button", { name: "Preferencias de privacidad" }));
    const toggle = screen.getByRole("checkbox", { name: /Medición de visitas/ });
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!).analytics).toBe("denied");
    expect((window as Window & { dataLayer?: unknown[] }).dataLayer).toEqual([]);
  });
});
