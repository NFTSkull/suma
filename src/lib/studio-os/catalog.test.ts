import { describe, expect, it } from "vitest";
import { defaultConfig, fictionalName, themes } from "./catalog";
import { createDemo } from "./seed";
import { configSummary } from "./summary";

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

describe("sistema visual", () => {
  it("cada tema cumple contraste AA en botones, etiquetas y texto secundario", () => {
    for (const [id, t] of Object.entries(themes)) {
      expect(contrast("#FFFFFF", t.accent), `${id}: blanco sobre acento`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.ink, t.soft), `${id}: texto sobre suave`).toBeGreaterThanOrEqual(4.5);
      expect(contrast("#6B645D", t.canvas), `${id}: texto secundario`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("datos ficticios y resumen", () => {
  it("los nombres generados no se repiten", () => {
    const names = Array.from({ length: 80 }, (_, i) => fictionalName(i));
    expect(new Set(names).size).toBe(80);
  });

  it("el resumen describe la configuración sin precios", () => {
    const state = createDemo({ ...defaultConfig("yoga"), name: "Casa Aurora", integrations: ["Cobros en línea"], needs: "Dos sucursales" }, new Date(2026, 10, 11, 10).toISOString());
    const { text } = configSummary(state);
    expect(text).toContain("Casa Aurora · Yoga");
    expect(text).toContain("Cobros en línea");
    expect(text).toContain("Dos sucursales");
    expect(text).not.toMatch(/\$\s?\d/);
  });
});
