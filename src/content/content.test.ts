import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { industries, industryBySlug } from "./industries";
import { allRoutes, footerNav, legalLinks, mainNav } from "./navigation";
import { photos } from "./photos";
import { processSteps } from "./process";
import { capabilityAnchorId, serviceShortcuts } from "./service-shortcuts";
import { serviceBySlug, services } from "./services";
import { situations } from "./situations";

const appDir = path.resolve(__dirname, "../app");
const routeExists = (route: string) =>
  existsSync(path.join(appDir, route === "/" ? "" : route, "page.tsx"));

describe("contenido", () => {
  it("define exactamente cinco servicios con slugs únicos", () => {
    expect(services).toHaveLength(5);
    expect(new Set(services.map((s) => s.slug)).size).toBe(5);
  });

  it("define seis industrias con slugs únicos", () => {
    expect(industries).toHaveLength(6);
    expect(new Set(industries.map((i) => i.slug)).size).toBe(6);
  });

  it("cada servicio tiene FAQs, SEO y relaciones válidas", () => {
    for (const s of services) {
      expect(s.faqs.length).toBeGreaterThanOrEqual(3);
      expect(s.seo.title.length).toBeGreaterThan(10);
      expect(s.seo.description.length).toBeLessThanOrEqual(200);
      for (const r of s.related) {
        expect(serviceBySlug[r.slug]).toBeDefined();
        expect(r.slug).not.toBe(s.slug);
      }
      for (const e of s.industryExamples) expect(industryBySlug[e.industry]).toBeDefined();
    }
  });

  it("cada industria referencia servicios existentes, con al menos uno principal", () => {
    for (const i of industries) {
      expect(i.services.some((s) => s.role === "principal")).toBe(true);
      for (const s of i.services) expect(serviceBySlug[s.slug]).toBeDefined();
      expect(photos[i.photo]).toBeDefined();
      expect(photos[i.secondaryPhoto]).toBeDefined();
    }
  });

  it("las situaciones apuntan a servicios existentes", () => {
    expect(situations).toHaveLength(6);
    for (const s of situations) expect(serviceBySlug[s.solution.service]).toBeDefined();
  });

  it("el selector de necesidades cubre los cinco servicios, uno por opción y en su orden", () => {
    expect(serviceShortcuts.map((s) => s.service)).toEqual(services.map((s) => s.slug));
    expect(new Set(serviceShortcuts.map((s) => capabilityAnchorId(s.service))).size).toBe(5);
  });

  it("el proceso tiene cuatro etapas", () => {
    expect(processSteps.map((p) => p.title)).toEqual(["Descubrimos", "Diseñamos", "Construimos", "Evolucionamos"]);
  });

  it("todas las fotos existen en /public", () => {
    for (const p of Object.values(photos)) {
      expect(existsSync(path.resolve(__dirname, "../../public", `.${p.src}`)), p.src).toBe(true);
      expect(p.alt.length).toBeGreaterThan(10);
    }
  });

  it("cada ruta pública tiene una página", () => {
    for (const route of allRoutes) expect(routeExists(route), route).toBe(true);
  });

  it("la navegación solo enlaza rutas existentes", () => {
    const hrefs = [
      ...mainNav.flatMap((item) =>
        item.kind === "menu" ? [item.href, item.footer.href, ...item.links.map((l) => l.href)] : [item.href],
      ),
      ...footerNav.flatMap((g) => g.links.map((l) => l.href)),
      ...legalLinks.map((l) => l.href),
    ];
    for (const href of hrefs) expect(allRoutes, href).toContain(href);
  });
});
