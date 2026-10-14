import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SELECTOR_STORAGE_KEY } from "@/lib/recommend";
import { NeedsSelector } from "./NeedsSelector";

vi.mock("next/link", () => import("@/test/next-link-mock"));

describe("NeedsSelector", () => {
  beforeEach(() => sessionStorage.clear());

  it("avanza, regresa y muestra recomendaciones con CTA", async () => {
    const user = userEvent.setup();
    render(<NeedsSelector />);

    const continuar = screen.getByRole("button", { name: "Continuar" });
    expect(continuar).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Yoga, Pilates o Barre" }));
    await user.click(continuar);
    expect(screen.getByRole("heading", { name: "¿Qué te gustaría mejorar primero?" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Regresar" }));
    expect(screen.getByRole("radio", { name: "Yoga, Pilates o Barre" })).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.click(screen.getByRole("radio", { name: /Recibo muchas consultas/ }));
    await user.click(screen.getByRole("button", { name: "Ver recomendación" }));

    expect(screen.getByRole("heading", { name: "Un buen punto de partida" })).toBeInTheDocument();
    const cards = screen.getAllByRole("heading", { level: 4 });
    expect(cards.length).toBeGreaterThanOrEqual(1);
    expect(cards.length).toBeLessThanOrEqual(3);
    expect(screen.getByRole("link", { name: /Conversemos sobre esto/ })).toHaveAttribute("href", "/contacto");
  });

  it("guarda el contexto sin datos personales al ir al formulario", async () => {
    const user = userEvent.setup();
    render(<NeedsSelector />);
    await user.click(screen.getByRole("radio", { name: "Spa o centro de bienestar" }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.click(screen.getByRole("radio", { name: /ordenar mis citas/ }));
    await user.click(screen.getByRole("button", { name: "Ver recomendación" }));
    await user.click(screen.getByRole("link", { name: /Conversemos sobre esto/ }));

    const saved = JSON.parse(sessionStorage.getItem(SELECTOR_STORAGE_KEY) ?? "null");
    expect(saved).toMatchObject({ negocio: "spa", reto: "orden" });
    expect(Object.keys(saved).sort()).toEqual(["negocio", "reto", "servicios"]);
    expect(saved.servicios.length).toBeGreaterThan(0);
  });

  it("no roba el foco al montarse (tampoco en StrictMode) y lo mueve al cambiar de paso", async () => {
    const user = userEvent.setup();
    render(
      <StrictMode>
        <NeedsSelector />
      </StrictMode>,
    );
    expect(document.activeElement).toBe(document.body);

    await user.click(screen.getByRole("radio", { name: "Yoga, Pilates o Barre" }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "¿Qué te gustaría mejorar primero?" }));
  });

  it("reinicia al primer paso", async () => {
    const user = userEvent.setup();
    render(<NeedsSelector />);
    await user.click(screen.getByRole("radio", { name: "Fitness boutique" }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.getByRole("heading", { name: "¿Qué tipo de negocio tienes?" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Fitness boutique" })).not.toBeChecked();
  });
});
