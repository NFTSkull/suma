import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingWhatIs } from "./PricingWhatIs";

describe("PricingWhatIs", () => {
  it("permite abrir una explicación sin salir del desglose", () => {
    render(<PricingWhatIs explanation={{
      what: "Preparamos una campaña inicial para tu negocio y la revisamos.",
      example: "Un anuncio de una clase de prueba lleva a WhatsApp.",
      excluded: "El presupuesto de anuncios va aparte.",
    }} />);
    const summary = screen.getByText("¿Qué es?");
    const disclosure = summary.closest("details");
    expect(disclosure).not.toBeNull();
    expect(disclosure!.open).toBe(false);
    fireEvent.click(summary);
    expect(disclosure!.open).toBe(true);
    expect(screen.getByText(/Preparamos una campaña inicial/)).toBeInTheDocument();
    expect(screen.getByText(/Un anuncio de una clase de prueba/)).toBeInTheDocument();
    expect(screen.getByText(/presupuesto de anuncios va aparte/)).toBeInTheDocument();
    fireEvent.click(summary);
    expect(disclosure!.open).toBe(false);
  });
});
