import type { NavLink } from "@/types/content";
import { industries } from "./industries";
import { services } from "./services";

export const serviceLinks: NavLink[] = services.map((s) => ({
  label: s.shortName,
  href: s.href,
  description: s.navTagline,
}));

export const industryLinks: NavLink[] = industries.map((i) => ({
  label: i.name,
  href: i.href,
  description: i.navTagline,
}));

export type MainNavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "menu"; label: string; href: string; intro: string; links: NavLink[]; footer: NavLink };

export const mainNav: MainNavItem[] = [
  { kind: "link", label: "Inicio", href: "/" },
  { kind: "link", label: "Soluciones", href: "/soluciones" },
  {
    kind: "menu",
    label: "Servicios",
    href: "/servicios",
    intro: "Cinco maneras de hacer que tu negocio fluya.",
    links: serviceLinks,
    footer: { label: "Cómo trabajamos", href: "/como-trabajamos", description: "De una idea a una experiencia que funciona" },
  },
  {
    kind: "menu",
    label: "Industrias",
    href: "/industrias",
    intro: "Cada negocio tiene su propio ritmo.",
    links: industryLinks,
    footer: { label: "Ver todas las industrias", href: "/industrias" },
  },
  { kind: "link", label: "El estudio", href: "/nosotros" },
  { kind: "link", label: "Contacto", href: "/contacto" },
];

export const primaryCta = { label: "Hablemos de tu proyecto", href: "/contacto" } as const;

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Estudio",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Soluciones", href: "/soluciones" },
      { label: "Cómo trabajamos", href: "/como-trabajamos" },
      { label: "El estudio", href: "/nosotros" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  { title: "Servicios", links: serviceLinks.map(({ label, href }) => ({ label, href })) },
  { title: "Industrias", links: industryLinks.map(({ label, href }) => ({ label, href })) },
];

export const legalLinks: NavLink[] = [{ label: "Aviso de privacidad", href: "/aviso-de-privacidad" }];

/** Todas las rutas públicas del sitio (fuente para sitemap y pruebas de enlaces). */
export const allRoutes: string[] = [
  "/",
  "/soluciones",
  "/servicios",
  ...services.map((s) => s.href),
  "/industrias",
  ...industries.map((i) => i.href),
  "/como-trabajamos",
  "/nosotros",
  "/contacto",
  "/aviso-de-privacidad",
];
