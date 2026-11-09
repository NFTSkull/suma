import type { Metadata } from "next";
import { noindexRoutes } from "@/content/navigation";
import { services } from "@/content/services";
import { site } from "@/content/site";
import type { Faq, Service } from "@/types/content";

export const absoluteUrl = (path: string) => `${site.url}${path === "/" ? "" : path}`;

export const HOME_SEO = {
  title: "SUMA STUDIO · Tecnología para negocios de bienestar en Monterrey",
  description:
    "Chatbots, CRM, apps, páginas web y publicidad digital para estudios de yoga y pilates, spas y marcas wellness. Desde Monterrey para todo México.",
  path: "/",
} as const;

/** Imagen social por defecto (generada por `app/opengraph-image.tsx`). */
export const OG_IMAGE = {
  path: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.serviceDescriptor}`,
} as const;

/** Isotipo oficial en PNG para datos estructurados (Google no admite SVG como logo de Organization). */
export const LOGO = { path: "/brand/isotipo-512.png", width: 512, height: 512 } as const;

export function buildMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const image = { url: absoluteUrl(OG_IMAGE.path), width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE.alt };
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    ...(noindexRoutes.includes(path) ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      title,
      description,
      url,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/* ───────────────────────── Datos estructurados (JSON-LD) ─────────────────────────
   Un solo @graph por página. Organization y WebSite tienen @id estables y el resto
   de nodos se enlaza a ellos. Nada de direcciones, teléfonos, reseñas o precios. */

type Node = Record<string, unknown>;
export type Crumb = { name: string; path: string };

const nodeId = (path: string, fragment: string) => (path === "/" ? `${site.url}/#${fragment}` : `${absoluteUrl(path)}#${fragment}`);

export const ids = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  logo: `${site.url}/#logo`,
  webpage: (path: string) => nodeId(path, "webpage"),
  breadcrumb: (path: string) => nodeId(path, "breadcrumb"),
  faq: (path: string) => nodeId(path, "faq"),
  list: (path: string) => nodeId(path, "list"),
  service: (service: Pick<Service, "href">) => nodeId(service.href, "service"),
};

export function organizationNode(): Node {
  const sameAs = site.social.map((s) => s.href);
  const { email, whatsapp } = site.contact;
  return {
    "@type": "Organization",
    "@id": ids.organization,
    name: site.name,
    alternateName: `${site.name} — ${site.institutionalDescriptor}`,
    url: absoluteUrl("/"),
    description: `${site.serviceDescriptor}. Chatbots, CRM, aplicaciones móviles, páginas web y publicidad digital para negocios wellness.`,
    slogan: site.tagline,
    logo: {
      "@type": "ImageObject",
      "@id": ids.logo,
      url: absoluteUrl(LOGO.path),
      contentUrl: absoluteUrl(LOGO.path),
      width: LOGO.width,
      height: LOGO.height,
      caption: site.name,
    },
    image: { "@id": ids.logo },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: "MX",
    },
    areaServed: { "@type": "Country", name: "México" },
    knowsLanguage: "es-MX",
    knowsAbout: services.map((s) => s.name),
    ...(sameAs.length ? { sameAs } : {}),
    ...(email || whatsapp
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            areaServed: "MX",
            availableLanguage: "es",
            ...(email ? { email } : {}),
          },
        }
      : {}),
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: absoluteUrl("/"),
    name: site.name,
    description: site.serviceDescriptor,
    inLanguage: "es-MX",
    publisher: { "@id": ids.organization },
  };
}

export function breadcrumbNode(path: string, crumbs: Crumb[]): Node {
  const all = [{ name: "Inicio", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": ids.breadcrumb(path),
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function serviceNode(service: Service): Node {
  return {
    "@type": "Service",
    "@id": ids.service(service),
    name: service.name,
    serviceType: service.name,
    description: service.seo.description,
    url: absoluteUrl(service.href),
    provider: { "@id": ids.organization },
    areaServed: { "@type": "Country", name: "México" },
    audience: { "@type": "BusinessAudience", name: "Negocios de bienestar y wellness" },
  };
}

/** Lista de páginas hijas visibles en una página índice. */
export function itemListNode(path: string, items: { name: string; path: string }[]): Node {
  return {
    "@type": "ItemList",
    "@id": nodeId(path, "list"),
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** Solo para preguntas visibles en la página (acordeón). */
export function faqNode(path: string, faqs: Faq[]): Node {
  return {
    "@type": "FAQPage",
    "@id": ids.faq(path),
    isPartOf: { "@id": ids.webpage(path) },
    inLanguage: "es-MX",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export type PageGraphInput = {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
  crumbs?: Crumb[];
  mainEntity?: string;
  about?: string[];
  faqs?: Faq[];
  extra?: Node[];
};

/** Grafo completo de una página: Organization, WebSite, WebPage y nodos propios. */
export function pageGraph({ path, name, description, type = "WebPage", crumbs, mainEntity, about, faqs, extra = [] }: PageGraphInput) {
  const hasFaq = Boolean(faqs?.length);
  const webpage: Node = {
    "@type": type,
    "@id": ids.webpage(path),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "es-MX",
    isPartOf: { "@id": ids.website },
    publisher: { "@id": ids.organization },
    primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(OG_IMAGE.path), width: OG_IMAGE.width, height: OG_IMAGE.height },
    ...(crumbs ? { breadcrumb: { "@id": ids.breadcrumb(path) } } : {}),
    ...(mainEntity ? { mainEntity: { "@id": mainEntity } } : {}),
    ...(about?.length ? { about: about.map((id) => ({ "@id": id })) } : {}),
    ...(hasFaq ? { hasPart: { "@id": ids.faq(path) } } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      websiteNode(),
      webpage,
      ...(crumbs ? [breadcrumbNode(path, crumbs)] : []),
      ...(hasFaq && faqs ? [faqNode(path, faqs)] : []),
      ...extra,
    ],
  };
}
