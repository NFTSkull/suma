import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_STORAGE_KEY, resetConsentMemoryForTests } from "@/lib/consent";
import { ConsentBanner } from "./ConsentBanner";

vi.mock("next/link", () => import("@/test/next-link-mock"));

type W = Window & { dataLayer?: IArguments[] };
const updates = () => ((window as W).dataLayer ?? []).map((a) => Array.from(a));

describe("ConsentBanner", () => {
  beforeEach(() => {
    localStorage.clear();
    resetConsentMemoryForTests();
    (window as W).dataLayer = [];
  });

  it("no se renderiza en el servidor (no hay decisión conocida hasta hidratar)", () => {
    expect(renderToStaticMarkup(<ConsentBanner />)).toBe("");
  });

  it("aparece sin decisión, con ambas opciones y enlace al aviso de privacidad", () => {
    render(<ConsentBanner />);
    expect(screen.getByRole("region", { name: "Tu privacidad, tu decisión" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rechazar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Aceptar estadísticas" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Aviso de privacidad" })).toHaveAttribute("href", "/aviso-de-privacidad");
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("aceptar guarda la elección, envía consent update y oculta el banner", async () => {
    const user = userEvent.setup();
    render(<ConsentBanner />);
    await user.click(screen.getByRole("button", { name: "Aceptar estadísticas" }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({ v: 1, analytics: "granted" });
    expect(updates()).toEqual([
      ["consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" }],
    ]);
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("rechazar guarda la elección y oculta el banner", async () => {
    const user = userEvent.setup();
    render(<ConsentBanner />);
    await user.click(screen.getByRole("button", { name: "Rechazar" }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({ v: 1, analytics: "denied" });
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("no aparece si ya existe una decisión guardada", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "denied" }));
    render(<ConsentBanner />);
    expect(screen.queryByRole("region")).toBeNull();
  });
});
