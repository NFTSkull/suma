import type { Metadata } from "next";
import { site } from "@/content/site";

export const absoluteUrl = (path: string) => `${site.url}${path === "/" ? "" : path}`;

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      title,
      description,
      url: path,
      ...(image ? { images: [{ url: image, width: 1800, height: 1200 }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  alternateName: `${site.name} — ${site.institutionalDescriptor}`,
  description: `${site.serviceDescriptor}. Chatbots, CRM, aplicaciones móviles, páginas web y publicidad digital.`,
  url: site.url,
  areaServed: { "@type": "Country", name: "México" },
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: "MX",
  },
  knowsLanguage: "es-MX",
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: "México" },
    audience: { "@type": "BusinessAudience", name: "Negocios de bienestar y wellness" },
  };
}
