import { describe, expect, it } from "vitest";
import { transformation } from "@/content/transformation";
import { ENTER_AT, EXIT_AT, centerRatio, initialPhase, nextPhase } from "./scroll-transformation";

describe("contenido de la transformación", () => {
  it("usa exactamente los textos aprobados, sin cifras", () => {
    expect(transformation.eyebrow).toBe("Una forma más simple de trabajar");
    expect(transformation.rows.map((r) => [r.number, r.before, r.after])).toEqual([
      ["01", "Mensajes sin responder.", "Atención más ágil."],
      ["02", "Reservas por organizar.", "Reservas en orden."],
      ["03", "Tareas repetitivas.", "Más tiempo para tus clientes."],
    ]);
    const copy = transformation.rows.flatMap((r) => [r.before, r.after]).join(" ");
    expect(copy).not.toMatch(/\d|%/);
  });
});

describe("estado por scroll", () => {
  it("calcula la posición del centro del bloque en la ventana", () => {
    expect(centerRatio({ top: 400, height: 200 }, 1000)).toBe(0.5);
    expect(centerRatio({ top: -300, height: 200 }, 1000)).toBe(-0.2);
  });

  it("al entrar a mitad de página decide sin histéresis", () => {
    expect(initialPhase(1.2)).toBe("before");
    expect(initialPhase(ENTER_AT)).toBe("after");
    expect(initialPhase(-0.5)).toBe("after");
  });

  it("transforma al bajar y regresa al subir", () => {
    expect(nextPhase("before", ENTER_AT - 0.01)).toBe("after");
    expect(nextPhase("after", EXIT_AT + 0.01)).toBe("before");
  });

  it("no parpadea dentro de la banda de histéresis", () => {
    const inBand = (ENTER_AT + EXIT_AT) / 2;
    expect(nextPhase("before", inBand)).toBe("before");
    expect(nextPhase("after", inBand)).toBe("after");
    let phase = nextPhase("before", ENTER_AT - 0.001);
    for (const r of [ENTER_AT + 0.02, ENTER_AT - 0.01, EXIT_AT - 0.01, ENTER_AT + 0.05]) phase = nextPhase(phase, r);
    expect(phase).toBe("after");
  });
});
