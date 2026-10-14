import { describe, expect, it } from "vitest";
import { businessOptions, challengeOptions, type SelectorRule } from "@/content/selector-rules";
import { serviceBySlug } from "@/content/services";
import { findRule, recommend } from "./recommend";

describe("recommend", () => {
  it("toda combinación negocio × reto devuelve 1–3 recomendaciones válidas sin duplicados", () => {
    for (const b of businessOptions) {
      for (const c of challengeOptions) {
        const result = recommend(b.id, c.id);
        expect(result, `${b.id} + ${c.id}`).not.toBeNull();
        const recs = result!.recommendations;
        expect(recs.length).toBeGreaterThanOrEqual(1);
        expect(recs.length).toBeLessThanOrEqual(3);
        expect(new Set(recs.map((r) => r.service)).size).toBe(recs.length);
        for (const r of recs) {
          expect(serviceBySlug[r.service]).toBeDefined();
          expect(r.why.length).toBeGreaterThan(10);
          expect(r.problem.length).toBeGreaterThan(5);
        }
      }
    }
  });

  it("usa el texto específico para pilates + consultas", () => {
    const result = recommend("yoga-pilates", "consultas");
    expect(result?.summary).toMatch(/asistente digital que responda preguntas frecuentes/);
    expect(result?.recommendations[0].service).toBe("chatbots");
  });

  it("prefiere la regla específica sobre la genérica", () => {
    expect(findRule("spa", "orden")?.business).toContain("spa");
    expect(findRule("otro", "orden")?.business).toBeUndefined();
  });

  it("recorta a tres y elimina duplicados", () => {
    const rules: SelectorRule[] = [
      {
        challenge: "web",
        summary: "x",
        recommendations: [
          { service: "crm", why: "aaaaaaaaaaaa", problem: "bbbbbb" },
          { service: "crm", why: "aaaaaaaaaaaa", problem: "bbbbbb" },
          { service: "chatbots", why: "aaaaaaaaaaaa", problem: "bbbbbb" },
          { service: "paginas-web", why: "aaaaaaaaaaaa", problem: "bbbbbb" },
          { service: "publicidad-digital", why: "aaaaaaaaaaaa", problem: "bbbbbb" },
        ],
      },
    ];
    const result = recommend("otro", "web", rules);
    expect(result?.recommendations.map((r) => r.service)).toEqual(["crm", "chatbots", "paginas-web"]);
  });

  it("devuelve null si no hay regla", () => {
    expect(recommend("otro", "web", [])).toBeNull();
  });
});
