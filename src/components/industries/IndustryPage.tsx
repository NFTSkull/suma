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
import { individualServices, pricingPlans } from "@/content/pricing";
import { formatMXN } from "@/lib/pricing";
import { serviceBySlug, serviceInlineName } from "@/content/services";
import { cn } from "@/lib/cn";
import { colorStyles } from "@/lib/colors";
import { ids, pageGraph } from "@/lib/seo";
import { whatsappUrlFor } from "@/lib/whatsapp";
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

const spaAgenda = individualServices.find((service) => service.id === "reservas")!;
const spaLanding = individualServices.find((service) => service.id === "landing")!;
const spaFlow = pricingPlans.find((plan) => plan.id === "flow")!;

const spaOffers = [
  {
    title: "Configura tu agenda de citas",
    price: formatMXN(spaAgenda.setup),
    detail: "Revisamos y configuramos los horarios y recursos que permita tu agenda actual.",
    terms: "Pago único de SUMA",
    href: "/precios?servicio=reservas#simulador",
  },
  {
    title: "Página web y agenda para tu spa",
    price: formatMXN(spaLanding.setup + spaAgenda.setup),
    detail: "Una página móvil para presentar un tratamiento o paquete y facilitar la consulta, junto con la configuración de tu agenda.",
    terms: "Pago único de SUMA",
    href: "/precios#simulador",
  },
  {
    title: "Seguimiento de consultas con Flow",
    price: formatMXN(spaFlow.setup),
    detail: "Organizamos quién pregunta, quién responde y qué sigue en un CRM existente, con hasta dos tareas automáticas sencillas.",
    terms: "Configuración + desde " + formatMXN(spaFlow.monthly) + "/mes",
    href: "/precios#flow",
  },
];

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
  const crumbs = [
    { name: "Industrias", path: "/industrias" },
    { name: ind.name, path: ind.href },
  ];

  return (
    <>
      <section aria-labelledby="industria-title" className="relative isolate overflow-hidden bg-suma-cream">
        <div className="container-suma grid gap-12 pb-20 pt-8 md:pb-28 md:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Breadcrumbs items={crumbs} />
            {/* El sector forma parte del H1; visualmente sigue siendo el eyebrow. */}
            <h1 id="industria-title" className="mt-10">
              <span className={cn("text-eyebrow block motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_both]", c.ink)}>{ind.hero.eyebrow}</span>{" "}
              <span className="text-display-lg mt-6 block motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_80ms_both]">
                {ind.hero.title}
              </span>
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-suma-navy/75 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_160ms_both]">
              {ind.hero.lead}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_240ms_both]">
              <ButtonLink href={whatsappUrlFor({ industry: ind.name })} size="lg" arrow target="_blank" rel="noopener noreferrer">
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
              <Image src={photo.src} alt={photo.alt} fill preload sizes="(min-width: 64rem) 36rem, 92vw" className="object-cover" quality={80} />
            </div>
            <p className="relative mt-4 max-w-sm rounded-2xl bg-suma-cream-soft p-4 text-sm font-semibold shadow-soft">{ind.benefit}</p>
          </div>
        </div>
      </section>

      {slug === "spas" && (
        <section aria-labelledby="spa-opciones-title" className="section-y bg-suma-cream">
          <div className="container-suma">
            <SectionHeading
              id="spa-opciones-title"
              eyebrow="Precios en pesos mexicanos · Una sucursal"
              title="Empieza por lo que tu spa necesita hoy."
              lead="No hace falta contratar un software completo si solo quieres mejorar citas o consultas. Estas opciones son servicios de configuración y acompañamiento, no un reservador propio listo para instalar."
              size="md"
            />
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {spaOffers.map((offer) => (
                <li key={offer.title} className="flex flex-col rounded-[1.75rem] border border-suma-line bg-suma-cream-soft p-6 md:p-7">
                  <h3 className="font-display text-2xl font-bold">{offer.title}</h3>
                  <p className="mt-4 text-sm font-semibold text-suma-navy/65">Desde</p>
                  <p className="mt-1 font-display text-4xl font-extrabold text-suma-navy">{offer.price}</p>
                  <p className="mt-2 text-sm font-semibold">{offer.terms}</p>
                  <p className="mt-4 flex-1 text-suma-navy/75">{offer.detail}</p>
                  <ButtonLink href={offer.href} variant="secondary" className="mt-6 w-full" arrow>Consultar alcance y precio</ButtonLink>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-4xl text-sm text-suma-navy/70">
              Referencias antes de IVA para una sucursal. Licencias, dominio, alojamiento y consumos externos se pagan aparte.
              Validamos las funciones, permisos y condiciones de tu agenda antes de contratar. No se garantiza sincronización automática con otras plataformas.
            </p>
          </div>
        </section>
      )}

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
                      Conocer {serviceInlineName[s.slug]} <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
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

      {/* Puente de conversión: enlaza desde una demo conceptual hacia un diagnóstico real. */}
      {(slug === "spas" || slug === "yoga-pilates") && (
        <section aria-labelledby="diagnostico-industria-title" className="bg-suma-cream py-12 md:py-16">
          <div className="container-suma">
            <div className="flex flex-col gap-7 rounded-[2rem] border border-suma-line bg-suma-cream-soft p-7 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-2xl">
                <p className="text-eyebrow text-suma-orange-ink">De la idea a tu operación</p>
                <h2 id="diagnostico-industria-title" className="mt-3 font-display text-2xl font-bold md:text-3xl">
                  {slug === "spas"
                    ? "¿Tu spa necesita ordenar citas, cabinas y seguimiento?"
                    : "¿Tu estudio necesita unir reservas, paquetes y seguimiento?"}
                </h2>
                <p className="mt-3 text-suma-navy/75">
                  Revisamos cómo trabajas hoy y te ayudamos a decidir si conviene integrar tus herramientas actuales
                  o desarrollar una solución personalizada. Te contamos qué es viable y cuál sería el siguiente paso.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <ButtonLink href="/contacto" size="lg" arrow>Contarnos tu caso</ButtonLink>
                <ButtonLink href="/servicios/crm" variant="link">Conocer CRM y seguimiento</ButtonLink>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section aria-labelledby="faq-industria-title" className="section-y bg-suma-cream-soft">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-industria-title" eyebrow="Preguntas frecuentes" title="Antes de empezar" size="md" />
          <Accordion items={ind.faqs} />
        </div>
      </section>

      {slug === "yoga-pilates" && (
        <section aria-labelledby="guia-industria-title" className="bg-suma-cream py-14 md:py-20">
          <div className="container-suma grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-eyebrow text-suma-orange-ink">Guía de decisión</p>
              <h2 id="guia-industria-title" className="mt-3 font-display text-3xl font-bold">
                Software para estudios de pilates: reservas, CRM y membresías.
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-suma-navy/80">
                Una comparación práctica para elegir entre plataformas existentes,
                automatizaciones y un sistema a medida.
              </p>
            </div>
            <Link
              href="/guias/software-para-estudios-de-pilates"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-suma-navy px-7 font-bold text-suma-cream transition-colors hover:bg-suma-purple"
            >
              Leer guía para estudios de pilates →
            </Link>
          </div>
        </section>
      )}

      {slug === "spas" && (
        <section aria-labelledby="guia-spa-title" className="bg-suma-cream py-14 md:py-20">
          <div className="container-suma grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-eyebrow text-suma-orange-ink">Guía para spas</p>
              <h2 id="guia-spa-title" className="mt-3 font-display text-3xl font-bold">
                Cómo automatizar reservas, confirmaciones y seguimiento.
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-suma-navy/80">
                Aprende a conectar WhatsApp, agenda, cabinas y recepción sin perder la atención humana
                ni confirmar citas que todavía no tienen horario.
              </p>
            </div>
            <Link
              href="/guias/automatizar-reservas-spa"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-suma-navy px-7 font-bold text-suma-cream transition-colors hover:bg-suma-purple"
            >
              Leer guía de reservas para spas →
            </Link>
          </div>
        </section>
      )}

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
        primaryHref={whatsappUrlFor({ industry: ind.name })}
      />

      <JsonLd
        data={pageGraph({
          path: ind.href,
          name: ind.seo.title,
          description: ind.seo.description,
          crumbs,
          about: ind.services.map((sv) => ids.service(serviceBySlug[sv.slug])),
          faqs: ind.faqs,
        })}
      />
    </>
  );
}
