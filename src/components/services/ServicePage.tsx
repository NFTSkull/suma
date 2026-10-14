import Link from "next/link";
import type { ReactNode } from "react";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdJourneyMini, ChatMini, CrmMini, PhoneMini, WebScreensMini } from "@/components/visuals/MiniVisuals";
import { industryBySlug } from "@/content/industries";
import { getService, serviceBySlug } from "@/content/services";
import { cn } from "@/lib/cn";
import { colorStyles } from "@/lib/colors";
import { faqJsonLd, serviceJsonLd } from "@/lib/seo";
import type { ServiceSlug } from "@/types/content";
import { ServiceShowcase } from "./ServiceShowcase";

type HeroTheme = {
  surface: string;
  dark: boolean;
  visual: ReactNode;
  showcaseSurface: string;
  layout: "split" | "stacked";
};

const heroThemes: Record<ServiceSlug, HeroTheme> = {
  chatbots: {
    surface: "bg-suma-cream",
    dark: false,
    layout: "split",
    showcaseSurface: "bg-suma-navy",
    visual: (
      <div className="relative mx-auto w-fit">
        <OrganicShape shape="a" color="orange" animate="drift" className="absolute -left-20 -top-16 size-[22rem]" />
        <OrganicShape shape="d" color="pink" blend animate="drift-reverse" className="absolute -bottom-10 -right-10 size-40" />
        <ChatMini className="relative scale-110" />
      </div>
    ),
  },
  crm: {
    surface: "bg-suma-purple",
    dark: true,
    layout: "split",
    showcaseSurface: "bg-suma-navy",
    visual: (
      <div className="relative mx-auto w-fit">
        <OrganicShape shape="c" color="navy" className="absolute -right-16 -top-16 size-80 opacity-60" />
        <CrmMini className="relative scale-110" />
      </div>
    ),
  },
  "aplicaciones-moviles": {
    surface: "bg-suma-cream",
    dark: false,
    layout: "stacked",
    showcaseSurface: "bg-suma-navy",
    visual: (
      <div className="relative mx-auto flex w-fit items-end gap-6">
        <OrganicShape shape="b" color="pink" animate="breathe" className="absolute -left-24 -top-10 size-[24rem]" />
        <PhoneMini className="relative -rotate-6" />
        <PhoneMini className="relative hidden translate-y-6 rotate-3 sm:block" />
      </div>
    ),
  },
  "paginas-web": {
    surface: "bg-suma-navy",
    dark: true,
    layout: "split",
    showcaseSurface: "bg-suma-navy-soft",
    visual: (
      <div className="relative">
        <OrganicShape shape="a" color="purple" className="absolute -right-10 -top-14 size-80" />
        <WebScreensMini className="relative" />
      </div>
    ),
  },
  "publicidad-digital": {
    surface: "bg-gradient-to-br from-suma-orange/25 via-suma-cream to-suma-pink/25",
    dark: false,
    layout: "stacked",
    showcaseSurface: "bg-suma-navy",
    visual: <AdJourneyMini className="relative mx-auto max-w-3xl" />,
  },
};

export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const s = getService(slug);
  const theme = heroThemes[slug];
  const c = colorStyles[s.color];
  const tone = theme.dark ? "light" : "dark";

  return (
    <>
      <section
        aria-labelledby="servicio-title"
        className={cn("relative isolate overflow-hidden", theme.surface, theme.dark ? "on-dark text-suma-cream" : "text-suma-navy")}
      >
        <div
          className={cn(
            "container-suma grid gap-14 pb-24 pt-8 md:pb-32 md:pt-12",
            theme.layout === "split" ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : "",
          )}
        >
          <div className={cn(theme.layout === "stacked" && "max-w-4xl")}>
            <Breadcrumbs tone={tone} items={[{ name: "Servicios", path: "/servicios" }, { name: s.shortName, path: s.href }]} />
            <p
              className={cn(
                "text-eyebrow mt-10 inline-flex items-center gap-3",
                theme.dark ? (s.color === "purple" ? "text-suma-cream" : "text-suma-orange") : c.ink,
                "motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_both]",
              )}
            >
              <span aria-hidden="true" className={cn("blob size-3.5", theme.dark ? "bg-suma-orange" : c.dot)} />
              {s.hero.eyebrow}
            </p>
            <h1
              id="servicio-title"
              className="text-display-lg mt-6 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_80ms_both]"
            >
              {s.hero.title}
            </h1>
            <p
              className={cn(
                "text-lead mt-8 max-w-2xl motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_160ms_both]",
                theme.dark ? "text-suma-cream/80" : "text-suma-navy/75",
              )}
            >
              {s.hero.lead}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_240ms_both]">
              <ButtonLink href="/contacto" size="lg" variant={theme.dark ? "accent" : "primary"} arrow>
                Hablemos de tu proyecto
              </ButtonLink>
              <ButtonLink href="#experiencia" variant={theme.dark ? "link-light" : "link"}>
                Ver la demostración
              </ButtonLink>
            </div>
          </div>
          <div className={cn("relative", theme.layout === "stacked" && "mt-4")}>{theme.visual}</div>
        </div>
      </section>

      {/* Problema */}
      <section aria-labelledby="problema-title" className="section-y bg-suma-cream-soft">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading id="problema-title" eyebrow="El problema" title={s.problem.title} size="md" />
          <ul className="grid gap-3">
            {s.problem.points.map((p, i) => (
              <Reveal as="li" key={p} delay={i * 80} className="flex gap-5 rounded-[1.5rem] border border-suma-line bg-suma-cream p-5 md:p-6">
                <span className={cn("font-display text-2xl font-extrabold", c.ink)}>0{i + 1}</span>
                <span className="text-lg leading-snug text-suma-navy/85">{p}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Capacidades */}
      <section aria-labelledby="capacidades-servicio-title" className="section-y bg-suma-cream">
        <div className="container-suma">
          <SectionHeading id="capacidades-servicio-title" eyebrow="Qué incluye" title="Soluciones y capacidades" size="md" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.capabilities.map((cap, i) => (
              <Reveal
                as="li"
                key={cap.title}
                delay={(i % 3) * 80}
                className={cn("rounded-[1.75rem] p-7", i === 0 ? cn(c.bg, c.onBg) : "border border-suma-line bg-suma-cream-soft")}
              >
                <span aria-hidden="true" className={cn("blob block size-7", i === 0 ? "bg-suma-cream/80" : c.dot)} />
                <h3 className="mt-6 font-display text-2xl font-bold">{cap.title}</h3>
                <p className={cn("mt-2", i === 0 ? "opacity-90" : "text-suma-navy/75")}>{cap.text}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 grid gap-6 rounded-[2rem] border-2 border-dashed border-suma-navy/20 p-7 md:grid-cols-[16rem_1fr] md:p-9">
            <h3 className="font-display text-2xl font-bold">{s.scopeNote.title}</h3>
            <p className="text-lg leading-relaxed text-suma-navy/80">{s.scopeNote.text}</p>
          </Reveal>
        </div>
      </section>

      {/* Experiencia interactiva */}
      <section id="experiencia" aria-labelledby="experiencia-title" className={cn("on-dark section-y relative scroll-mt-16 overflow-hidden text-suma-cream", theme.showcaseSurface)}>
        <OrganicShape shape="b" color={s.color === "navy" ? "purple" : s.color} className="absolute -right-40 -top-40 size-[30rem] opacity-25" />
        <div className="container-suma relative">
          <SectionHeading id="experiencia-title" tone="light" eyebrow="Experiencia interactiva" title={s.showcase.title} lead={s.showcase.lead} size="md" />
          <div className="mt-12">
            <ServiceShowcase slug={slug} />
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section aria-labelledby="beneficios-title" className="section-y bg-suma-cream">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="beneficios-title" eyebrow="Para tu negocio" title="Lo que cambia en tu día a día" size="md" />
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {s.benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 80} className="border-t-2 border-suma-navy pt-5">
                <dt className="font-display text-2xl font-bold">{b.title}</dt>
                <dd className="mt-2 text-suma-navy/75">{b.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Ejemplos por industria */}
      <section aria-labelledby="industrias-servicio-title" className="section-y bg-suma-cream-deep/60">
        <div className="container-suma">
          <SectionHeading id="industrias-servicio-title" eyebrow="Ejemplos por industria" title="Cómo se vería en tu tipo de negocio" size="md" />
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {s.industryExamples.map((ex, i) => {
              const ind = industryBySlug[ex.industry];
              return (
                <Reveal as="li" key={ex.industry} delay={(i % 2) * 90}>
                  <Link href={ind.href} className="group flex h-full flex-col justify-between gap-6 rounded-[1.75rem] bg-suma-cream-soft p-7 transition-shadow hover:shadow-lift">
                    <div>
                      <p className="text-eyebrow text-suma-navy/60">{ind.navTagline}</p>
                      <h3 className="mt-2 font-display text-2xl font-bold">{ind.name}</h3>
                      <p className="mt-3 text-suma-navy/80">{ex.text}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-bold underline decoration-suma-orange decoration-2 underline-offset-4 group-hover:decoration-suma-pink">
                      Ver industria <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Relación con otros servicios */}
      <section aria-labelledby="relacion-title" className="section-y bg-suma-cream">
        <div className="container-suma">
          <SectionHeading id="relacion-title" eyebrow="Todo puede trabajar en conjunto" title="Se conecta con" size="md" />
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {s.related.map((r) => {
              const rel = serviceBySlug[r.slug];
              const rc = colorStyles[rel.color];
              return (
                <li key={r.slug}>
                  <Link href={rel.href} className={cn("group relative flex h-full items-center gap-6 overflow-hidden rounded-[1.75rem] p-7", rc.bg, rc.onBg)}>
                    <span className="flex-1">
                      <span className="block font-display text-3xl font-bold">{rel.shortName}</span>
                      <span className="mt-2 block opacity-90">{r.why}</span>
                    </span>
                    <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-suma-cream text-suma-navy transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="section-y bg-suma-cream-soft">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="Preguntas frecuentes" title="Lo que suelen preguntarnos" size="md" />
          <Accordion items={s.faqs} />
        </div>
      </section>

      <ClosingCta title={s.cta.title} text={s.cta.text} secondary={{ label: "Ver todos los servicios", href: "/servicios" }} />

      <JsonLd data={serviceJsonLd({ name: s.name, description: s.seo.description, path: s.href })} />
      <JsonLd data={faqJsonLd(s.faqs)} />
    </>
  );
}
