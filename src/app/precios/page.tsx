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
import { estimatePricing, formatMXN, formatMXNExact, pricingWhatsAppHref } from "@/lib/pricing";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "Precios CRM sin cobro por usuario, automatización y publicidad",
  description:
    "Configura SUMA Ads, Flow o Growth con cuotas más accesibles y parcialidades de implementación. Cotiza CRM, publicidad, automatizaciones y web en MXN antes de IVA.",
  path: "/precios",
  keywords: [
    "precios CRM para estudios de pilates",
    "paquetes automatización spa",
    "precio campañas Meta Ads estudio de pilates",
    "CRM para negocios con equipos sin cobro por usuario",
    "cotizador personalizado marketing y CRM",
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
        eyebrow="CRM · Publicidad · Automatización · MXN"
        accent="orange"
        dark
        crumbs={crumbs}
        title={<>Elige lo que tu negocio necesita. <span className="text-suma-orange">Sin complicarte.</span></>}
        lead="¿Quieres atraer clientes, organizar los mensajes o ambas cosas? Te mostramos qué haríamos, cuánto pagarías al principio y qué va por mes."
      >
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="#planes" variant="light" size="lg" arrow>Explorar paquetes</ButtonLink>
          <ButtonLink href="#simulador" variant="link-light">Personalizar mi propuesta</ButtonLink>
          <ButtonLink href="/showroom" variant="link-light">Probar una demo interactiva</ButtonLink>
        </div>
      </PageHero>

      <section id="planes" aria-labelledby="planes-title" className="scroll-mt-24 bg-suma-cream py-20 md:py-28">
        <div className="container-suma">
          <SectionHeading
            id="planes-title"
            eyebrow="Tres planes de servicio · Para una sede"
            title={<>Entiende qué incluye. <span className="text-suma-purple">Después elige.</span></>}
            lead="Elige un plan para una sede y conoce qué resolvería en tu negocio. Puedes solicitar la configuración en uno, tres o seis pagos según el importe; el servicio mensual va aparte."
          />
          <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => {
              const dark = plan.featured;
              const fullQuote = estimatePricing({ planId: plan.id, months: 1, setupPayments: 1 });
              const flexibleQuote = estimatePricing({ planId: plan.id, months: 1, setupPayments: 3 });
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
                    <p className={`mt-4 rounded-xl px-3 py-3 text-sm font-bold ${dark ? "bg-suma-cream/10" : "bg-suma-navy/6"}`}>
                      Primer desembolso con 3 abonos: {formatMXNExact(flexibleQuote.firstPaymentSuma)}
                      <span className="mt-1 block text-xs font-normal opacity-80">O {formatMXN(fullQuote.firstPaymentSuma)} con implementación en un solo pago.</span>
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
                    href={pricingWhatsAppHref({ planId: plan.id, months: 1, setupPayments: 3 })}
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
                  <a href={"/precios?plan=" + plan.id + "#simulador"} className={"mt-4 min-h-10 text-center text-sm font-bold underline decoration-2 underline-offset-4 " + (dark ? "text-suma-cream" : "text-suma-purple")}>
                    Personalizar con otros servicios
                  </a>
                </article>
              );
            })}
          </div>
          <p className="mt-7 max-w-5xl text-sm leading-relaxed text-suma-navy/70">
            Precios base en pesos mexicanos, antes de IVA y para una sede. Las parcialidades son una propuesta sujeta a aprobación comercial por escrito, no un crédito aprobado ni cobro automático. Implementación y servicio mensual se cobran por separado. La inversión en anuncios, licencias, hosting adicional y consumo de WhatsApp API o IA se pagan aparte. No exigimos una web nueva. Las reservas e integraciones dependen de permisos y viabilidad comprobada.
          </p>
        </div>
      </section>

      <section aria-labelledby="usuarios-title" className="bg-suma-cream-soft py-16 md:py-20">
        <div className="container-suma">
          <div className="grid items-start gap-8 rounded-[2rem] border border-suma-line bg-suma-cream p-7 shadow-soft md:grid-cols-[1.05fr_0.95fr] md:p-11">
            <div>
              <p className="text-eyebrow text-suma-purple">Sin tarifa SUMA por asiento</p>
              <h2 id="usuarios-title" className="mt-4 font-display text-3xl font-extrabold leading-tight text-suma-navy md:text-4xl">
                Tu equipo puede crecer sin que SUMA te cobre por cada integrante.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-suma-navy/75">
                En Flow y Growth cobramos un servicio por negocio y alcance, no una tarifa adicional de SUMA por cada persona del equipo. Si necesitas un CRM desarrollado especialmente para tu operación, cotizamos el software sin costo por asiento interno.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-suma-navy/65">
                Importante: las plataformas CRM de terceros pueden cobrar licencias por usuario; las pagas aparte. «Sin tarifa por asiento» no significa servidores, mensajes, contactos o automatizaciones ilimitados. Se acuerdan capacidad, permisos, sedes y volumen.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-suma-navy p-7 text-suma-cream">
              <p className="text-eyebrow text-suma-orange">CRM propio a medida</p>
              <p className="mt-4 text-sm text-suma-cream/80">Desarrollo desde</p>
              <p className="mt-1 font-display text-4xl font-extrabold">$49,900</p>
              <p className="mt-2 text-sm text-suma-cream/80">Implementación personalizable; solicita 6 parcialidades o pagos por entregable. Soporte opcional desde $2,990/mes.</p>
              <ul className="mt-5 space-y-2 text-sm text-suma-cream/85">
                <li>✓ Módulos según tu operación real</li>
                <li>✓ Sin cobro de SUMA por usuario interno</li>
                <li>✓ Permisos, sedes e integraciones por alcance</li>
              </ul>
              <a href="#simulador" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-suma-orange px-5 text-center text-sm font-bold text-suma-navy hover:bg-suma-cream">
                Personalizar un CRM →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="simulador" aria-labelledby="simulador-title" className="scroll-mt-24 bg-suma-cream-deep/50 py-20 md:py-28">
        <div className="container-suma">
          <div className="mb-10">
            <SectionHeading
              id="simulador-title"
              eyebrow="Personaliza y cotiza"
              title="Un paquete o solo lo que te hace falta."
              lead="Elige módulos y modalidad de pago. Verás el primer desembolso, el costo total de implementación, la cuota mensual y los terceros por separado."
            />
          </div>
          <PricingEstimator />
        </div>
      </section>

      <section aria-labelledby="independientes-title" className="bg-suma-cream py-20 md:py-28">
        <div className="container-suma">
          <SectionHeading
            id="independientes-title"
            eyebrow="Elige solo lo que necesitas"
            title="¿Solo necesitas una cosa? También puedes elegirla."
            lead="Puedes contratar únicamente anuncios, organización de clientes, respuestas automáticas, una página o cualquier otro servicio. Selecciona lo necesario en el cotizador."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {individualServices.map((service) => (
              <div key={service.id} className="flex min-h-48 flex-col justify-between rounded-[1.6rem] border border-suma-line bg-suma-cream-soft p-6">
                <h3 className="font-display text-xl font-bold">{service.name}</h3>
                <div className="mt-6">
                  <p className="font-display text-xl font-extrabold text-suma-purple">
                    {service.from ? "Desde " : ""}{formatMXN(service.setup || service.monthly)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-suma-navy">
                    {service.setup === 0 ? "/mes · sin implementación base" : service.monthly ? "+ " + formatMXN(service.monthly) + "/mes" : "Pago único"}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-suma-navy/65">{service.detail}</p>
                  <a href={"/precios?servicio=" + service.id + "#simulador"} className="mt-4 inline-flex min-h-10 items-center text-sm font-bold text-suma-purple underline decoration-2 underline-offset-4">
                    Incluir en mi propuesta →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 max-w-4xl text-sm text-suma-navy/65">
            Los servicios de pago único también pueden solicitarse en 3 mensualidades; los proyectos con implementación de al menos $10,000 pueden solicitar 6. El calendario definitivo requiere aprobación. Estas son tarifas iniciales de referencia, no cotizaciones automáticas. Los desarrollos a medida, integraciones y costos de terceros se definen mediante alcance técnico.
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
            title="Resolvemos tus dudas antes de contratar."
            lead="Cuánto se paga al inicio, qué se cobra aparte y cuándo conviene una solución personalizada."
          />
          <Accordion items={faqs} />
        </div>
      </section>

      <ClosingCta
        title="Tu negocio merece una solución que sí le quede."
        text="Personaliza tus servicios y sedes; te enviamos una propuesta clara para aprovechar lo que ya utilizas sin pagar por herramientas que no necesitas."
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
