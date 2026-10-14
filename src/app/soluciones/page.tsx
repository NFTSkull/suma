import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/ClosingCta";
import { ConnectedJourney } from "@/components/home/ConnectedJourney";
import { SituationsExplorer } from "@/components/home/SituationsExplorer";
import { PageHero } from "@/components/layout/PageHero";
import { NeedsSelector } from "@/components/selector/NeedsSelector";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Soluciones digitales para negocios de bienestar",
  description:
    "Descubre qué solución necesita tu negocio wellness: un selector sencillo, situaciones comunes y cómo se conectan chatbots, CRM, apps, web y publicidad.",
  path: "/soluciones",
  keywords: ["soluciones digitales para negocios de bienestar", "automatización para negocios wellness"],
});

export default function SolucionesPage() {
  return (
    <>
      <PageHero
        eyebrow="Soluciones"
        accent="purple"
        crumbs={[{ name: "Soluciones", path: "/soluciones" }]}
        title="Empieza por lo que hoy te quita más tiempo."
        lead="No vendemos paquetes cerrados. Partimos de lo que pasa en tu negocio y te recomendamos la pieza que más puede ayudarte ahora."
      >
        <ButtonLink href="#selector" size="lg" arrow>
          Encontrar mi solución
        </ButtonLink>
      </PageHero>

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

      <section aria-labelledby="situaciones-title" className="section-y bg-suma-cream">
        <div className="container-suma">
          <SectionHeading id="situaciones-title" eyebrow="Te entendemos" title="Situaciones que escuchamos seguido" size="md" />
          <div className="mt-12">
            <SituationsExplorer />
          </div>
        </div>
      </section>

      <section aria-labelledby="conectado-title" className="section-y bg-suma-cream-soft">
        <div className="container-suma">
          <SectionHeading
            id="conectado-title"
            eyebrow="Experiencia conectada"
            title="Las mejores experiencias suceden cuando todo está conectado."
            lead="No necesitas todas las herramientas desde el primer día. Necesitas las adecuadas para el momento de tu negocio."
            size="md"
          />
          <div className="mt-12">
            <ConnectedJourney />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
