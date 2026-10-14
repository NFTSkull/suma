import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";

vi.mock("next/link", () => import("@/test/next-link-mock"));
vi.mock("next/font/google", () => ({ Poppins: () => ({ className: "font-poppins" }) }));
vi.mock("./HeroVisual", () => ({ HeroVisual: () => null }));

describe("Hero", () => {
  it("expone un único H1 con las dos frases como texto real", () => {
    render(<Hero />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Creatividad que suma. Estrategia que impulsa.",
    );
    expect(headings[0]).toHaveClass("font-poppins");
  });

  it("mantiene los bloques de color como decoración oculta", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    const decor = h1.querySelectorAll('[aria-hidden="true"]');
    expect(decor).toHaveLength(2);
    decor.forEach((el) => expect(el.textContent).toBe(""));
  });

  it("muestra eyebrow, descripción y CTAs sin cambios de destino", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("p")?.textContent?.trim()).toBe("Creatividad + Tecnología");
    expect(
      screen.getByText("Diseñamos soluciones digitales que conectan, simplifican y hacen crecer tu negocio."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Quiero mejorar mi negocio/ })).toHaveAttribute("href", "/#selector");
    expect(screen.getByRole("link", { name: /Explorar soluciones/ })).toHaveAttribute("href", "/soluciones");
  });
});
