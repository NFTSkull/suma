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
import { SituationsExplorer } from "@/components/home/SituationsExplorer";
import { SumaEnAccion } from "@/components/home/SumaEnAccion";
import { NeedsSelector } from "@/components/selector/NeedsSelector";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />

      {/* Te entendemos */}
      <section aria-labelledby="entendemos-title" className="section-y bg-suma-cream-deep/60">
        <div className="container-suma">
          <SectionHeading
            id="entendemos-title"
            eyebrow="Te entendemos"
            title="Sabemos todo lo que pasa detrás de una gran experiencia."
            lead="Elige la situación que más se parece a tu día. Te mostramos por dónde podríamos empezar."
          />
          <div className="mt-14">
            <SituationsExplorer />
          </div>
        </div>
      </section>

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

      <ImpactBlock />
      <ClosingCta />
    </>
  );
}
