import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { PricingEstimator } from "@/components/pricing/PricingEstimator";
import { PricingWhatIs } from "@/components/pricing/PricingWhatIs";
import { planExplanations, pricingConcepts, serviceExplanations } from "@/content/pricing-explanations";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { individualServiceDeliveryTimes, individualServices, pricingFaqs, pricingPlans } from "@/content/pricing";
import { formatMXN, pricingWhatsAppHref } from "@/lib/pricing";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "Precios CRM sin cobro por usuario, automatización y publicidad",
  description:
    "Servicios SUMA desde precios accesibles: anuncios, seguimiento de clientes, chatbots y páginas web. Rangos orientativos, pagos claros y propuestas personalizadas.",
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
        eyebrow="Publicidad · Clientes · Páginas web"
        accent="orange"
        dark
        crumbs={crumbs}
        title={<>Entiende qué compras. <span className="text-suma-orange">Y cuánto pagarías.</span></>}
        lead="Elige entre conseguir más consultas, organizar los mensajes de tus clientes o combinar ambas cosas. Te explicamos qué incluye cada plan, el pago inicial y lo que cuesta al mes."
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
            eyebrow="3 planes · Precio base para 1 sucursal"
            title={<>Tres formas de empezar. <span className="text-suma-purple">Sin términos complicados.</span></>}
            lead="Primero mira qué hace cada plan. Después conoce cuánto pagarías por dejarlo listo y cuánto cuesta seguir usándolo."
          />
          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {[
              { title: "1. Pago para comenzar", text: "Se cobra una vez para dejar listo lo contratado.", explanation: pricingConcepts.setup },
              { title: "2. Pago de cada mes", text: "Cubre el trabajo mensual incluido en tu plan.", explanation: pricingConcepts.monthly },
              { title: "3. Gastos que van aparte", text: "Anuncios, licencias o herramientas de otras empresas.", explanation: pricingConcepts.external },
            ].map((item) => (
              <div key={item.title} className="min-w-0 rounded-2xl border border-suma-line bg-suma-cream-soft p-5">
                <h3 className="text-sm font-bold text-suma-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-suma-navy/75">{item.text}</p>
                <PricingWhatIs explanation={item.explanation} compact />
              </div>
            ))}
          </div>
          <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => {
              const dark = plan.featured;
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

                  <div className={`mt-6 rounded-[1.4rem] border p-5 ${dark ? "border-suma-cream/20 bg-suma-cream/5" : "border-suma-navy/10 bg-white/70"}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-suma-orange" : "text-suma-purple"}`}>
                      Precio para empezar · desde
                    </p>
                    <p className="mt-2 font-display text-[clamp(2rem,3.1vw,3rem)] font-extrabold leading-none tracking-tight tabular-nums">
                      {formatMXN(plan.setup)}
                    </p>
                    <p className={`mt-1 text-xs ${dark ? "text-suma-cream/75" : "text-suma-navy/65"}`}>
                      Pago de configuración · una sola vez
                    </p>
                    <div className={`mt-5 border-t pt-4 ${dark ? "border-suma-cream/20" : "border-suma-navy/10"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? "text-suma-cream/65" : "text-suma-navy/60"}`}>
                        Trabajo de SUMA cada mes
                      </p>
                      <p className="mt-1 font-display text-xl font-extrabold leading-snug tabular-nums">
                        Desde {formatMXN(plan.monthly)} <span className="text-sm font-medium">/mes</span>
                      </p>
                    </div>
                    <p className={`mt-3 text-xs leading-relaxed ${dark ? "text-suma-cream/70" : "text-suma-navy/65"}`}>
                      Si necesitas más funciones, el precio se revisa contigo antes de contratar.
                    </p>
                  </div>

                  <div className="mt-7 flex-1">
                    <h3 className="font-display text-lg font-bold">¿Qué incluye este plan básico?</h3>
                    <p className={`mt-3 text-xs font-bold uppercase tracking-widest ${dark ? "text-suma-orange" : "text-suma-purple"}`}>Lo que hacemos al inicio</p>
                    <ul className={`mt-2 space-y-2 text-sm leading-relaxed ${dark ? "text-suma-cream/85" : "text-suma-navy/80"}`}>
                      {plan.setupIncludes.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span aria-hidden="true" className={dark ? "text-suma-orange" : "text-suma-purple"}>✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className={`mt-5 text-xs font-bold uppercase tracking-widest ${dark ? "text-suma-orange" : "text-suma-purple"}`}>Lo que hacemos cada mes</p>
                    <ul className={`mt-2 space-y-2 text-sm leading-relaxed ${dark ? "text-suma-cream/85" : "text-suma-navy/80"}`}>
                      {plan.monthlyIncludes.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span aria-hidden="true" className={dark ? "text-suma-orange" : "text-suma-purple"}>✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className={`mt-5 rounded-xl px-3 py-3 text-sm ${dark ? "bg-suma-cream/10" : "bg-suma-navy/6"}`}>
                      <strong>Tiempo estimado: {plan.launchWindow}.</strong>
                      <span className="mt-1 block text-xs opacity-80">A partir de que nos compartes los accesos y materiales; algunos permisos pueden tardar más.</span>
                    </p>
                  </div>
                  <PricingWhatIs explanation={planExplanations[plan.id]} subject={"SUMA " + plan.id.charAt(0).toUpperCase() + plan.id.slice(1)} dark={dark} />
                  <p className={`mt-5 text-xs leading-relaxed ${dark ? "text-suma-cream/65" : "text-suma-navy/65"}`}>{plan.boundaries}</p>
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
            Precios base para 1 sucursal, antes de IVA. «Desde» no es un precio final: confirma el alcance antes de contratar. Si tienes más sucursales o necesitas más funciones, hacemos una propuesta personalizada. Anuncios, licencias y herramientas externas van aparte.
          </p>
        </div>
      </section>

      <section aria-labelledby="usuarios-title" className="bg-suma-cream-soft py-16 md:py-20">
        <div className="container-suma">
          <div className="grid items-start gap-8 rounded-[2rem] border border-suma-line bg-suma-cream p-7 shadow-soft md:grid-cols-[1.05fr_0.95fr] md:p-11">
            <div>
              <p className="text-eyebrow text-suma-purple">Sin cobro adicional de SUMA por integrante</p>
              <h2 id="usuarios-title" className="mt-4 font-display text-3xl font-extrabold leading-tight text-suma-navy md:text-4xl">
                Tu equipo puede crecer sin que SUMA te cobre por cada integrante.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-suma-navy/75">
                En Flow y Growth no cobramos extra de SUMA por cada integrante de tu equipo, dentro de lo acordado. Si necesitas un programa propio para tu negocio, te lo cotizamos por separado.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-suma-navy/65">
                Importante: el programa de clientes de otra empresa sí podría cobrar por usuario. Revisamos contigo las licencias y límites antes de contratar.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-suma-navy p-7 text-suma-cream">
              <p className="text-eyebrow text-suma-orange">CRM propio a medida</p>
              <p className="mt-4 text-sm text-suma-cream/80">Proyecto básico · desde</p>
              <p className="mt-1 font-display text-4xl font-extrabold">$29,900</p>
              <p className="mt-2 text-sm text-suma-cream/80">Incluye un módulo sencillo a medida. Proyectos acotados: $29,900–$129,000 como referencia. Mantenimiento opcional: $1,490–$6,900/mes. Confirmamos funciones y precio antes de empezar.</p>
              <ul className="mt-5 space-y-2 text-sm text-suma-cream/85">
                <li>✓ Módulos según tu operación real</li>
                <li>✓ Sin cobro de SUMA por usuario interno</li>
                <li>✓ Accesos y conexiones definidos según tu proyecto</li>
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
              title="Arma tu presupuesto sin complicarte."
              lead="Elige un plan o las funciones que necesitas. A la derecha verás el pago para comenzar, la mensualidad y los gastos aparte. Puedes abrir «¿Qué es?» para entender cada concepto."
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
            title="¿Solo necesitas un servicio?"
            lead="Puedes contratar únicamente anuncios, una página, una agenda o ayuda para organizar clientes. Aquí te explicamos cada opción."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {individualServices.map((service) => (
              <div key={service.id} className="flex min-h-48 flex-col justify-between rounded-[1.6rem] border border-suma-line bg-suma-cream-soft p-6">
                <h3 className="font-display text-xl font-bold">{service.name}</h3>
                <div className="mt-6">
                  <p className="text-[0.7rem] font-bold uppercase tracking-wider text-suma-purple">Precio base · desde</p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-suma-purple">
                    {formatMXN(service.setup || service.monthly)}{service.setup === 0 ? <span className="text-base">/mes</span> : null}
                  </p>
                  <p className="mt-1 text-xs font-medium text-suma-navy/70">
                    {service.setup === 0 ? "Servicio que pagas cada mes" : "Pago para dejarlo listo · una vez"}
                  </p>
                  {service.monthly > 0 && service.setup > 0 ? (
                    <p className="mt-3 text-sm font-bold text-suma-navy">
                      Pago a SUMA al mes: {formatMXN(service.monthly)}–{formatMXN(service.monthlyMax)}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs leading-relaxed text-suma-navy/75">
                    <strong>En pocas palabras:</strong> {service.detail}
                  </p>
                  <p className="mt-2 text-xs text-suma-navy/65">
                    {service.setup > 0
                      ? <>Pago de configuración de referencia: {formatMXN(service.setup)}–{formatMXN(service.setupMax)}.</>
                      : <>Pago mensual de referencia: {formatMXN(service.monthly)}–{formatMXN(service.monthlyMax)}.</>}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-suma-navy/80">Tiempo estimado: {individualServiceDeliveryTimes[service.id]}.</p>
                  <PricingWhatIs explanation={serviceExplanations[service.id]} />
                  <a href={"/precios?servicio=" + service.id + "#simulador"} className="mt-4 inline-flex min-h-10 items-center text-sm font-bold text-suma-purple underline decoration-2 underline-offset-4">
                    Incluir en mi propuesta →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 max-w-4xl text-sm text-suma-navy/65">
            El precio «desde» es para la versión sencilla de cada servicio, antes de IVA. Si necesitas más funciones, lo revisamos contigo. Dominio, alojamiento web, anuncios y licencias se pagan aparte. Si quieres dividir el pago inicial, lo acordamos por escrito.
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
        title="Tu negocio merece una solución que sí le quede."
        text="Cuéntanos qué necesita tu negocio. Te ayudamos a elegir solo los servicios que realmente usarías."
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
