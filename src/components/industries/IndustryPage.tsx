import Image from "next/image";
import Link from "next/link";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getIndustry, industries } from "@/content/industries";
import { photos } from "@/content/photos";
import { serviceBySlug } from "@/content/services";
import { cn } from "@/lib/cn";
import { colorStyles } from "@/lib/colors";
import { faqJsonLd } from "@/lib/seo";
import type { IndustrySlug, SumaColor } from "@/types/content";
import { IndustryDemo } from "./IndustryDemo";

const accents: Record<IndustrySlug, { color: SumaColor; mask: "blob" | "arch" | "round" }> = {
  "yoga-pilates": { color: "orange", mask: "arch" },
  spas: { color: "purple", mask: "blob" },
  "fitness-boutique": { color: "pink", mask: "round" },
  "marcas-wellness": { color: "pink", mask: "blob" },
  "experiencias-retiros": { color: "orange", mask: "round" },
  "profesionales-bienestar": { color: "purple", mask: "arch" },
};

const maskClass = {
  blob: "blob",
  arch: "rounded-t-[999px] rounded-b-[2.5rem]",
  round: "rounded-[3rem]",
};

const demoTitles: Record<string, string> = {
  chatbot: "Así podría responder tu asistente",
  crm: "Así podría verse tu día organizado",
  app: "Así podría sentirse tu app",
  funnel: "Así podría avanzar una campaña",
};

export function IndustryPage({ slug }: { slug: IndustrySlug }) {
  const ind = getIndustry(slug);
  const accent = accents[slug];
  const c = colorStyles[accent.color];
  const photo = photos[ind.photo];
  const secondary = photos[ind.secondaryPhoto];
  const others = industries.filter((i) => i.slug !== slug).slice(0, 3);

  return (
    <>
      <section aria-labelledby="industria-title" className="relative isolate overflow-hidden bg-suma-cream">
        <div className="container-suma grid gap-12 pb-20 pt-8 md:pb-28 md:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Breadcrumbs items={[{ name: "Industrias", path: "/industrias" }, { name: ind.name, path: ind.href }]} />
            <p className={cn("text-eyebrow mt-10 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_both]", c.ink)}>{ind.hero.eyebrow}</p>
            <h1 id="industria-title" className="text-display-lg mt-6 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_80ms_both]">
              {ind.hero.title}
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-suma-navy/75 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_160ms_both]">
              {ind.hero.lead}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_240ms_both]">
              <ButtonLink href="/contacto" size="lg" arrow>
                Hablemos de tu negocio
              </ButtonLink>
              <ButtonLink href="#prioridades" variant="link">
                Qué podemos resolver
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <OrganicShape shape="a" color={accent.color} animate="drift" className="absolute -right-10 -top-10 size-56 md:size-72" />
            <OrganicShape shape="d" color="navy" className="absolute -bottom-8 -left-8 size-28 opacity-90" />
            <div className={cn("relative aspect-[4/5] overflow-hidden motion-safe:animate-[enter-scale_900ms_var(--ease-flow)_both]", maskClass[accent.mask])}>
              <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 64rem) 36rem, 92vw" className="object-cover" quality={80} />
            </div>
            <p className="relative mt-4 max-w-sm rounded-2xl bg-suma-cream-soft p-4 text-sm font-semibold shadow-soft">{ind.benefit}</p>
          </div>
        </div>
      </section>

      {/* Prioridades */}
      <section id="prioridades" aria-labelledby="prioridades-title" className="section-y scroll-mt-16 bg-suma-cream-soft">
        <div className="container-suma">
          <SectionHeading id="prioridades-title" eyebrow="Lo que más importa" title="Las prioridades de tu negocio" lead={ind.need} size="md" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ind.priorities.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 3) * 80} className="rounded-[1.75rem] border border-suma-line bg-suma-cream p-7">
                <span aria-hidden="true" className={cn("blob block size-6", i % 2 ? "bg-suma-navy" : c.dot)} />
                <h3 className="mt-5 font-display text-2xl font-bold">{p.title}</h3>
                <p className="mt-2 text-suma-navy/75">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Un día */}
      <section aria-labelledby="dia-title" className="section-y bg-suma-cream">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <SectionHeading id="dia-title" eyebrow="Un día cualquiera" title="Lo que pasa detrás, y cómo podría fluir" size="md" />
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2rem] lg:block">
              <Image src={secondary.src} alt={secondary.alt} fill sizes="30rem" className="object-cover" />
            </div>
          </div>
          <ol className="relative space-y-4 before:absolute before:bottom-6 before:left-[2.1rem] before:top-6 before:w-0.5 before:bg-suma-line">
            {ind.dayInLife.map((d, i) => (
              <Reveal as="li" key={d.moment} delay={i * 80} className="relative grid grid-cols-[4.25rem_1fr] gap-4">
                <span className={cn("relative z-10 grid size-[4.25rem] place-items-center rounded-full font-display text-lg font-bold", i % 2 ? "bg-suma-navy text-suma-cream" : cn(c.bg, c.onBg))}>
                  {d.moment}
                </span>
                <div className="rounded-[1.5rem] bg-suma-cream-soft p-6">
                  <p className="text-lg text-suma-navy/85">{d.situation}</p>
                  <p className="mt-3 flex gap-2 font-semibold">
                    <span aria-hidden="true" className={c.ink}>
                      ↳
                    </span>
                    <span>{d.solution}</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Servicios recomendados */}
      <section aria-labelledby="servicios-industria-title" className="section-y bg-suma-cream-deep/60">
        <div className="container-suma">
          <SectionHeading id="servicios-industria-title" eyebrow="Por dónde empezar" title="Soluciones que suelen tener más impacto" size="md" />
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {ind.services.map((sv) => {
              const s = serviceBySlug[sv.slug];
              const sc = colorStyles[s.color];
              const principal = sv.role === "principal";
              return (
                <li key={sv.slug}>
                  <Link
                    href={s.href}
                    className={cn(
                      "group flex h-full flex-col justify-between gap-6 rounded-[1.75rem] p-7 transition-shadow hover:shadow-lift",
                      principal ? cn(sc.bg, sc.onBg) : "bg-suma-cream-soft",
                    )}
                  >
                    <div>
                      <span className={cn("text-eyebrow", principal ? "opacity-80" : "text-suma-navy/60")}>{principal ? "Principal" : "Complemento"}</span>
                      <h3 className="mt-2 font-display text-3xl font-bold">{s.shortName}</h3>
                      <p className={cn("mt-2", principal ? "opacity-90" : "text-suma-navy/75")}>{sv.why}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-bold">
                      Conocer el servicio <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Demo */}
      <section aria-labelledby="demo-industria-title" className="on-dark section-y relative overflow-hidden bg-suma-navy text-suma-cream">
        <OrganicShape shape="c" color={accent.color} className="absolute -left-40 -top-40 size-[30rem] opacity-30" />
        <div className="container-suma relative">
          <SectionHeading id="demo-industria-title" tone="light" eyebrow="Demostración conceptual" title={demoTitles[ind.demo]} size="md" />
          <div className="mt-12">
            <IndustryDemo demo={ind.demo} slug={slug} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-industria-title" className="section-y bg-suma-cream-soft">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-industria-title" eyebrow="Preguntas frecuentes" title="Antes de empezar" size="md" />
          <Accordion items={ind.faqs} />
        </div>
      </section>

      {/* Otras industrias */}
      <section aria-labelledby="otras-title" className="bg-suma-cream py-16">
        <div className="container-suma">
          <h2 id="otras-title" className="text-eyebrow text-suma-navy/60">
            Otras industrias
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={o.href} className="inline-flex min-h-12 items-center rounded-full border-2 border-suma-navy/15 px-5 font-semibold hover:border-suma-navy">
                  {o.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/industrias" className="inline-flex min-h-12 items-center rounded-full bg-suma-navy px-5 font-semibold text-suma-cream hover:bg-suma-purple">
                Ver todas
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <ClosingCta
        title="Cuéntanos cómo funciona tu negocio hoy."
        text="Te ayudamos a identificar qué pieza tendría más impacto primero."
        secondary={{ label: "Explorar soluciones", href: "/soluciones" }}
      />

      <JsonLd data={faqJsonLd(ind.faqs)} />
    </>
  );
}
