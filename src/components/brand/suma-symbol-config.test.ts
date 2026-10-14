import { describe, expect, it } from "vitest";
import {
  FORMED_POSE,
  SYMBOL_BOUNDS,
  SYMBOL_VIEWBOX,
  spreadPose,
  symbolImageFrame,
  symbolMotion,
  symbolPieces,
  travelScale,
  type PieceKey,
  type SymbolVariant,
} from "./suma-symbol-config";

const keys: PieceKey[] = ["naranja", "rosa", "morado"];
const distance = (v: SymbolVariant, k: PieceKey) => Math.hypot(symbolMotion[v].spread[k].x, symbolMotion[v].spread[k].y);

describe("configuración del isotipo animado", () => {
  it("usa las tres piezas oficiales con la intersección morada encima", () => {
    expect(symbolPieces.map((p) => p.key)).toEqual(keys);
    expect(symbolPieces.map((p) => p.src)).toEqual(["/brand/naranja.svg", "/brand/rosa.svg", "/brand/morado.svg"]);
  });

  it("recorta el viewBox sin salirse de él", () => {
    expect(SYMBOL_BOUNDS.x).toBeGreaterThanOrEqual(0);
    expect(SYMBOL_BOUNDS.y).toBeGreaterThanOrEqual(0);
    expect(SYMBOL_BOUNDS.x + SYMBOL_BOUNDS.width).toBeLessThanOrEqual(SYMBOL_VIEWBOX.width);
    expect(SYMBOL_BOUNDS.y + SYMBOL_BOUNDS.height).toBeLessThanOrEqual(SYMBOL_VIEWBOX.height);
    expect(parseFloat(symbolImageFrame.width)).toBeCloseTo((720 / 650) * 100, 2);
    expect(parseFloat(symbolImageFrame.left)).toBeCloseTo((-30 / 650) * 100, 2);
  });

  it("cada variante recorre menos que la anterior: hero > cta > subtle", () => {
    for (const k of keys) {
      expect(distance("hero", k)).toBeGreaterThan(distance("cta", k));
      expect(distance("cta", k)).toBeGreaterThan(distance("subtle", k));
    }
    expect(symbolMotion.hero.float.amplitude).toBeGreaterThan(symbolMotion.subtle.float.amplitude);
  });

  it("reduce el recorrido en tablet y móvil", () => {
    expect(travelScale(1440)).toBe(1);
    expect(travelScale(800)).toBeLessThan(1);
    expect(travelScale(375)).toBeLessThan(travelScale(800));
  });

  it("sin recorrido la pose separada coincide con el símbolo formado", () => {
    for (const k of keys) {
      const p = spreadPose("hero", k, 0);
      expect(p.x).toBeCloseTo(FORMED_POSE.x);
      expect(p.y).toBeCloseTo(FORMED_POSE.y);
      expect(p.rotate).toBeCloseTo(FORMED_POSE.rotate);
      expect(p.scale).toBe(FORMED_POSE.scale);
    }
    expect(spreadPose("hero", "rosa", 0.5).x).toBeCloseTo(symbolMotion.hero.spread.rosa.x / 2);
  });
});
