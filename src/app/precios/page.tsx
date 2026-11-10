import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { PricingEstimator } from "@/components/pricing/PricingEstimator";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { individualServices, pricingFaqs, pricingPlans } from "@/content/pricing";
import { estimatePricing, formatMXN, pricingWhatsAppHref } from "@/lib/pricing";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "Precios de CRM, chatbots y web para wellness",
  description:
    "Conoce los precios de SUMA STUDIO: páginas web, CRM, automatización y publicidad para pilates, yoga y spas. Compara Start, Flow y Growth desde Monterrey.",
  path: "/precios",
  keywords: [
    "precios CRM para estudios de pilates",
    "paquetes automatización spa",
    "precios página web yoga y pilates",
    "servicios digitales wellness Monterrey",
  ],
};
const crumbs = [{ name: "Precios", path: "/precios" }];
const faqs = pricingFaqs.map(({ q, a }) => ({ q, a }));

export const metadata: Metadata = buildMetadata(seo);

export default function PreciosPage() {
  return (
    <>
      <PageHero
        eyebrow="Planes y precios · MXN"
        accent="orange"
        dark
        crumbs={crumbs}
        title={<>El siguiente paso de tu negocio merece <span className="text-suma-orange">un precio claro.</span></>}
        lead="Un sitio para que te encuentren. Un sistema para organizarte. O una estrategia para crecer. Empieza con lo que necesitas, sin pagar por herramientas que todavía no usarás."
      >
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="#planes" variant="light" size="lg" arrow>Explorar paquetes</ButtonLink>
          <ButtonLink href="#simulador" variant="link-light">Simular mi inversión</ButtonLink>
        </div>
      </PageHero>

      <section id="planes" aria-labelledby="planes-title" className="scroll-mt-24 bg-suma-cream py-20 md:py-28">
        <div className="container-suma">
          <SectionHeading
            id="planes-title"
            eyebrow="Tres maneras de empezar"
            title={<>Haz que cada inversión <span className="text-suma-purple">tenga sentido.</span></>}
            lead="Paquetes base para una sede. El diagnóstico nos ayuda a recomendar el adecuado y ajustar el alcance si tu operación lo necesita."
          />
          <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => {
              const dark = plan.featured;
              const firstPayment = estimatePricing({ planId: plan.id, months: 1 }).firstPaymentSuma;
              return (
                <article
                  key={plan.id}
                  id={plan.id}
                  className={`relative flex scroll-mt-28 flex-col overflow-hidden rounded-[2rem] border p-7 md:p-9 ${dark
                    ? "on-dark border-suma-navy bg-suma-navy text-suma-cream shadow-lift"
                    : "border-suma-line bg-suma-cream-soft text-suma-navy shadow-soft"}`}
                >
                  <div className="flex min-h-7 items-center justify-between gap-3">
                    <span className={`text-eyebrow ${dark ? "text-suma-orange" : "text-suma-purple"}`}>{plan.label}</span>
                    {dark && <span className="rounded-full bg-suma-orange px-3 py-1 text-[0.7rem] font-bold text-suma-navy">Recomendado</span>}
                  </div>
                  <h2 className="mt-5 font-display text-3xl font-extrabold">{plan.name}</h2>
                  <p className="mt-2 max-w-sm text-lg font-semibold leading-snug">{plan.tagline}</p>
                  <p className={`mt-3 min-h-18 text-sm leading-relaxed ${dark ? "text-suma-cream/70" : "text-suma-navy/65"}`}>{plan.audience}</p>

                  <div className={`mt-6 border-t pt-6 ${dark ? "border-suma-cream/20" : "border-suma-navy/15"}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-suma-cream/70" : "text-suma-navy/60"}`}>Implementación única</p>
                    <p className="mt-2 font-display text-[clamp(2rem,3.1vw,3rem)] font-extrabold leading-none tracking-tight tabular-nums">{formatMXN(plan.setup)}</p>
                    <p className={`mt-4 text-sm ${dark ? "text-suma-cream/75" : "text-suma-navy/70"}`}>
                      {plan.monthly > 0
                        ? <>+ <strong className={dark ? "text-suma-cream" : "text-suma-navy"}>{formatMXN(plan.monthly)}/mes</strong> de servicio</>
                        : <>Sin mensualidad obligatoria</>}
                    </p>
                    {plan.id === "start" && (
                      <p className={`mt-1 text-xs ${dark ? "text-suma-cream/65" : "text-suma-navy/60"}`}>Mantenimiento opcional: $990/mes</p>
                    )}
                    <p className={`mt-4 rounded-xl px-3 py-3 text-sm font-bold ${dark ? "bg-suma-cream/10" : "bg-suma-navy/6"}`}>
                      Primer pago base: {formatMXN(firstPayment)}
                    </p>
                  </div>

                  <h3 className="mt-7 font-display text-lg font-bold">Lo que incluye</h3>
                  <ul className={`mt-4 flex-1 space-y-3 text-sm leading-relaxed ${dark ? "text-suma-cream/85" : "text-suma-navy/80"}`}>
                    {plan.includes.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span aria-hidden="true" className={`mt-0.5 font-bold ${dark ? "text-suma-orange" : "text-suma-purple"}`}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={`mt-7 border-t pt-5 text-xs leading-relaxed ${dark ? "border-suma-cream/20 text-suma-cream/65" : "border-suma-navy/15 text-suma-navy/65"}`}>{plan.boundaries}</p>
                  <ButtonLink
                    href={pricingWhatsAppHref({ planId: plan.id, months: 1 })}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant={dark ? "accent" : "primary"}
                    arrow
                    className="mt-7 w-full"
                    data-pricing-plan={plan.id}
                    data-pricing-source="card"
                  >
                    {plan.action}
                  </ButtonLink>
                </article>
              );
            })}
          </div>
          <p className="mt-7 max-w-5xl text-sm leading-relaxed text-suma-navy/70">
            Precios base en pesos mexicanos, antes de IVA y para una sede. Implementación y servicio mensual se cobran por separado. Las licencias, dominio, hosting adicional, WhatsApp API, IA y pauta publicitaria no están incluidos. La propuesta final depende del alcance e integraciones validados.
          </p>
        </div>
      </section>

      <section id="simulador" aria-labelledby="simulador-title" className="scroll-mt-24 bg-suma-cream-deep/50 py-20 md:py-28">
        <div className="container-suma">
          <div className="mb-10">
            <SectionHeading
              id="simulador-title"
              eyebrow="Cotizador orientativo"
              title="Ajusta tu escenario, no tus expectativas."
              lead="Elige un paquete, un periodo y los extras previstos. Conoce cuánto pagarías a SUMA y qué inversión externa debes contemplar antes de conversar."
            />
          </div>
          <PricingEstimator />
        </div>
      </section>

      <section aria-labelledby="independientes-title" className="bg-suma-cream py-20 md:py-28">
        <div className="container-suma">
          <SectionHeading
            id="independientes-title"
            eyebrow="Servicios por separado"
            title="¿Necesitas solo una pieza?"
            lead="No necesitas un paquete mensual si tu problema se resuelve con una herramienta puntual. También diseñamos proyectos a medida."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {individualServices.map((service) => (
              <div key={service.name} className="flex min-h-48 flex-col justify-between rounded-[1.6rem] border border-suma-line bg-suma-cream-soft p-6">
                <h3 className="font-display text-xl font-bold">{service.name}</h3>
                <div className="mt-6">
                  <p className="font-display text-xl font-extrabold text-suma-purple">{service.price}</p>
                  <p className="mt-1 text-xs text-suma-navy/65">{service.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 max-w-4xl text-sm text-suma-navy/65">
            Estas son tarifas iniciales de referencia, no cotizaciones automáticas. Los desarrollos a medida, integraciones y costos de terceros se definen mediante alcance técnico.
          </p>
          <Link href="/servicios" className="mt-7 inline-flex min-h-11 items-center font-bold text-suma-purple underline decoration-2 underline-offset-[5px] hover:text-suma-navy">
            Explorar todos los servicios →
          </Link>
        </div>
      </section>

      <section aria-labelledby="faq-precios-title" className="bg-suma-cream-soft py-20 md:py-28">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            id="faq-precios-title"
            eyebrow="Sin letra pequeña"
            title="Lo que necesitas saber antes de empezar."
            lead="Cuánto se paga al inicio, qué se cobra aparte y cuándo conviene una solución personalizada."
          />
          <Accordion items={faqs} />
        </div>
      </section>

      <ClosingCta
        title="No se trata de contratar más. Se trata de elegir mejor."
        text="Cuéntanos qué herramientas usas, cuántas personas atiendes y qué te gustaría resolver. Te recomendaremos un alcance concreto sin obligarte a contratarlo todo."
        secondary={{ label: "Ver cómo trabajamos", href: "/como-trabajamos" }}
      />
      <JsonLd data={pageGraph({
        path: seo.path,
        name: seo.title,
        description: seo.description,
        crumbs,
        faqs,
      })} />
    </>
  );
}
