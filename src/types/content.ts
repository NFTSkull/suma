export type ServiceSlug =
  | "chatbots"
  | "crm"
  | "aplicaciones-moviles"
  | "paginas-web"
  | "publicidad-digital";

export type IndustrySlug =
  | "yoga-pilates"
  | "spas"
  | "fitness-boutique"
  | "marcas-wellness"
  | "experiencias-retiros"
  | "profesionales-bienestar";

export type SumaColor = "orange" | "pink" | "purple" | "navy";

export type PhotoKey =
  | "pilatesEstudio"
  | "pilatesTorre"
  | "yogaEstudio"
  | "spaAlberca"
  | "spaCabina"
  | "fitnessClase"
  | "marcaSerum"
  | "marcaProductos"
  | "retiroSauna"
  | "retiroMontana"
  | "profesionalMasaje";

export type Faq = { q: string; a: string };

export type Seo = {
  title: string;
  description: string;
  keywords: string[];
};

export type Service = {
  slug: ServiceSlug;
  href: `/servicios/${ServiceSlug}`;
  name: string;
  shortName: string;
  navTagline: string;
  color: SumaColor;
  home: { title: string; text: string };
  hero: { eyebrow: string; title: string; lead: string };
  problem: { title: string; points: string[] };
  capabilities: { title: string; text: string }[];
  showcase: { title: string; lead: string };
  benefits: { title: string; text: string }[];
  industryExamples: { industry: IndustrySlug; text: string }[];
  /** Nota honesta sobre alcance, viabilidad o intervención humana. */
  scopeNote: { title: string; text: string };
  related: { slug: ServiceSlug; why: string }[];
  faqs: Faq[];
  cta: { title: string; text: string };
  seo: Seo;
};

export type Industry = {
  slug: IndustrySlug;
  href: `/industrias/${IndustrySlug}`;
  name: string;
  navTagline: string;
  photo: PhotoKey;
  secondaryPhoto: PhotoKey;
  need: string;
  benefit: string;
  hero: { eyebrow: string; title: string; lead: string };
  priorities: { title: string; text: string }[];
  dayInLife: { moment: string; situation: string; solution: string }[];
  services: { slug: ServiceSlug; role: "principal" | "complemento"; why: string }[];
  demo: "chatbot" | "crm" | "funnel" | "app";
  faqs: Faq[];
  seo: Seo;
};

export type NavLink = { label: string; href: string; description?: string };
