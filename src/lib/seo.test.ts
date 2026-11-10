import { describe, expect, it } from "vitest";
import { allRoutes, indexableRoutes, noindexRoutes } from "@/content/navigation";
import { getService, services } from "@/content/services";
import { site } from "@/content/site";
import { absoluteUrl, buildMetadata, ids, organizationNode, pageGraph, serviceNode } from "./seo";

type Node = Record<string, unknown>;
const graphOf = (g: ReturnType<typeof pageGraph>) => g["@graph"] as Node[];
const byType = (g: ReturnType<typeof pageGraph>, type: string) => graphOf(g).filter((n) => n["@type"] === type);

describe("metadata", () => {
  it("canonical, og:url e imágenes sociales son absolutas", () => {
    const m = buildMetadata({ title: "CRM", description: "d", path: "/servicios/crm" });
    expect(m.alternates?.canonical).toBe(`${site.url}/servicios/crm`);
    expect(m.openGraph?.url).toBe(`${site.url}/servicios/crm`);
    const og = m.openGraph?.images as { url: string }[];
    const tw = m.twitter?.images as { url: string }[];
    expect(og[0].url).toBe(`${site.url}/opengraph-image`);
    expect(tw[0].url).toBe(`${site.url}/opengraph-image`);
    expect(m.robots).toBeUndefined();
  });

  it("los borradores son noindex y quedan fuera del sitemap", () => {
    expect(buildMetadata({ title: "t", description: "d", path: "/aviso-de-privacidad" }).robots).toEqual({ index: false, follow: true });
    for (const r of noindexRoutes) {
      expect(allRoutes).toContain(r);
      expect(indexableRoutes).not.toContain(r);
    }
    expect(indexableRoutes.length).toBe(allRoutes.length - noindexRoutes.length);
    expect(indexableRoutes).toContain("/guias/chatbot-whatsapp-pilates");
  });
});

describe("JSON-LD", () => {
  it("Organization publica el teléfono confirmado, sin domicilios ni pruebas sociales inventadas", () => {
    const org = organizationNode();
    expect(org["@type"]).toBe("Organization");
    expect(org["@id"]).toBe(`${site.url}/#organization`);
    const json = JSON.stringify(org);
    for (const key of ["streetAddress", "postalCode", "aggregateRating", "review", "priceRange", "founder", "foundingDate", "award"]) {
      expect(json).not.toContain(`"${key}"`);
    }
    const sales = org.contactPoint as Node;
    expect(sales["@type"]).toBe("ContactPoint");
    expect(sales.telephone).toBe("+528114688882");
    expect(sales.email).toBeUndefined();
    expect((org.logo as Node).url).toBe(absoluteUrl("/brand/isotipo-512.png"));
    expect(org.sameAs).toBeUndefined();
  });

  it("cada página tiene Organization, WebSite y WebPage enlazados por @id", () => {
    const g = pageGraph({ path: "/contacto", name: "Contacto", description: "d", type: "ContactPage", crumbs: [{ name: "Contacto", path: "/contacto" }] });
    const page = byType(g, "ContactPage")[0];
    expect(page["@id"]).toBe(`${site.url}/contacto#webpage`);
    expect(page.isPartOf).toEqual({ "@id": ids.website });
    expect(page.breadcrumb).toEqual({ "@id": ids.breadcrumb("/contacto") });
    expect(byType(g, "Organization")).toHaveLength(1);
    expect(byType(g, "WebSite")[0].publisher).toEqual({ "@id": ids.organization });
    const crumbs = byType(g, "BreadcrumbList")[0].itemListElement as Node[];
    expect(crumbs.map((c) => c.item)).toEqual([site.url, `${site.url}/contacto`]);
  });

  it("FAQPage solo aparece cuando hay preguntas", () => {
    expect(byType(pageGraph({ path: "/x", name: "x", description: "d" }), "FAQPage")).toHaveLength(0);
    const g = pageGraph({ path: "/x", name: "x", description: "d", faqs: [{ q: "¿Pregunta?", a: "Respuesta." }] });
    expect(byType(g, "FAQPage")[0].isPartOf).toEqual({ "@id": ids.webpage("/x") });
    expect(byType(g, "WebPage")[0].hasPart).toEqual({ "@id": ids.faq("/x") });
  });

  it("los cinco Service tienen @id estable y apuntan a la organización como proveedor", () => {
    const seen = new Set<string>();
    for (const s of services) {
      const node = serviceNode(s);
      expect(node["@id"]).toBe(`${site.url}${s.href}#service`);
      expect(node.provider).toEqual({ "@id": ids.organization });
      expect(JSON.stringify(node)).not.toMatch(/"(offers|price|aggregateRating)"/);
      seen.add(node["@id"] as string);
    }
    expect(seen.size).toBe(5);
    expect(ids.service(getService("crm"))).toBe(`${site.url}/servicios/crm#service`);
  });

  it("la home usa el @id con barra (/#webpage)", () => {
    expect(ids.webpage("/")).toBe(`${site.url}/#webpage`);
  });
});
