import type { Metadata } from "next";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { Capabilities } from "@/components/home/Capabilities";
import { ClosingCta } from "@/components/home/ClosingCta";
import { ConnectedJourney } from "@/components/home/ConnectedJourney";
import { Hero } from "@/components/home/Hero";
import { ImpactBlock } from "@/components/home/ImpactBlock";
import { IndustriesCarousel } from "@/components/home/IndustriesCarousel";
import { Manifesto } from "@/components/home/Manifesto";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { SumaEnAccion } from "@/components/home/SumaEnAccion";
import { NeedsSelector } from "@/components/selector/NeedsSelector";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/services";
import { buildMetadata, HOME_SEO, ids, pageGraph, serviceNode } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata(HOME_SEO),
  title: { absolute: HOME_SEO.title },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Capabilities />

      {/* SUMA en acción */}
      <section aria-labelledby="accion-title" className="on-dark section-y relative overflow-hidden bg-suma-navy text-suma-cream">
        <OrganicShape shape="c" color="purple" className="absolute -left-40 -top-40 size-[34rem] opacity-70" />
        <div className="container-suma relative">
          <SectionHeading
            id="accion-title"
            tone="light"
            eyebrow="SUMA en acción"
            title={
              <>
                No tienes que imaginarlo. <span className="text-suma-orange">Mira cómo podría funcionar.</span>
              </>
            }
            lead="Explora cuatro escenarios conceptuales. Toca, elige y navega: cada interfaz responde como lo haría una solución real."
          />
          <div className="mt-14">
            <SumaEnAccion />
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section aria-labelledby="industrias-title" className="section-y overflow-hidden bg-suma-cream">
        <div className="container-suma">
          <SectionHeading
            id="industrias-title"
            eyebrow="Industrias"
            title={
              <>
                Tu mundo es único. <span className="text-suma-purple">Tus herramientas también deberían serlo.</span>
              </>
            }
            lead="Cada negocio tiene su propio ritmo. Diseñamos a partir del tuyo."
          />
        </div>
        <div className="-mt-4">
          <IndustriesCarousel />
        </div>
      </section>

      {/* Selector */}
      <section id="selector" aria-labelledby="selector-title" className="section-y scroll-mt-20 bg-suma-cream-deep/60">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <SectionHeading
              id="selector-title"
              eyebrow="Selector de soluciones"
              title="¿Por dónde te gustaría empezar?"
              lead="Dos preguntas, sin datos personales. Te sugerimos de una a tres soluciones y por qué podrían encajar."
            />
          </div>
          <NeedsSelector />
        </div>
      </section>

      {/* Experiencia conectada */}
      <section aria-labelledby="conectado-title" className="section-y bg-suma-cream">
        <div className="container-suma">
          <SectionHeading
            id="conectado-title"
            eyebrow="Experiencia conectada"
            title="Las mejores experiencias suceden cuando todo está conectado."
            lead="Así podría ser el recorrido de una persona que descubre un estudio de yoga."
          />
          <div className="mt-14">
            <ConnectedJourney />
          </div>
          <Reveal className="mt-16 rounded-[2rem] bg-suma-navy p-8 text-suma-cream md:p-12">
            <p className="max-w-4xl font-display text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-[1.1]">
              No necesitas todas las herramientas desde el primer día.{" "}
              <span className="text-suma-orange">Necesitas las adecuadas para el momento de tu negocio.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Proceso */}
      <section aria-labelledby="proceso-title" className="section-y bg-suma-cream-soft">
        <div className="container-suma">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading id="proceso-title" eyebrow="Creamos contigo" title="De una idea a una experiencia que funciona." />
            <Reveal>
              <ButtonLink href="/como-trabajamos" variant="link">
                Cómo trabajamos
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-14">
            <ProcessSteps />
          </div>
        </div>
      </section>

      {/* Recurso práctico: conecta la home con una búsqueda comercial específica. */}
      <section aria-labelledby="guia-pilates-title" className="bg-suma-cream-soft py-16 md:py-24">
        <div className="container-suma grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-eyebrow text-suma-orange-ink">Guía para estudios de bienestar</p>
            <h2 id="guia-pilates-title" className="text-display-md mt-4 max-w-3xl">
              ¿Qué software necesita realmente un estudio de pilates?
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-suma-navy/75">
              Agenda, reformers, paquetes y alumnos: descubre cuándo te conviene una plataforma de reservas,
              conectar herramientas existentes o crear un CRM a medida.
            </p>
            <div className="mt-8">
              <ButtonLink href="/guias/software-para-estudios-de-pilates" variant="secondary" arrow>
                Leer la guía de software para pilates
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-[2rem] bg-suma-cream p-8 shadow-soft md:p-10">
            <p className="text-eyebrow text-suma-purple">Lo que vas a encontrar</p>
            <ul className="mt-6 space-y-4 text-lg text-suma-navy/85">
              <li>✓ Seis funciones clave para evaluar.</li>
              <li>✓ Cuándo usar reservas, integraciones o CRM.</li>
              <li>✓ Un ejemplo de cancelación y lista de espera.</li>
              <li>✓ Qué costos y condiciones revisar.</li>
            </ul>
          </div>
        </div>
      </section>

      <ImpactBlock />
      <ClosingCta />
      <JsonLd
        data={pageGraph({
          path: HOME_SEO.path,
          name: HOME_SEO.title,
          description: HOME_SEO.description,
          about: services.map((s) => ids.service(s)),
          extra: services.map(serviceNode),
        })}
      />
    </>
  );
}
