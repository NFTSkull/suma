import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/ClosingCta";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { PageHero } from "@/components/layout/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cómo trabajamos: de una idea a una experiencia que funciona",
  description:
    "Nuestro proceso para negocios de bienestar: descubrimos, diseñamos, construimos y evolucionamos contigo. Desde Monterrey para todo México.",
  path: "/como-trabajamos",
});

const principles = [
  { title: "Primero entendemos", text: "Antes de proponer herramientas, conocemos cómo funciona tu negocio hoy y qué te quita más tiempo." },
  { title: "Empezamos por lo que más ayuda", text: "Priorizamos la pieza con más impacto en este momento. Lo demás puede esperar." },
  { title: "Diseño con intención", text: "Cada pantalla y cada mensaje deben sentirse como tu marca: cálidos, claros y cuidados." },
  { title: "Te mostramos avances", text: "Revisas el trabajo en etapas, no solo al final. Así ajustamos a tiempo." },
  { title: "Explicamos sin tecnicismos", text: "Sabrás qué estamos haciendo y por qué, en un lenguaje claro." },
  { title: "Pensado para crecer", text: "Lo que construimos hoy puede conectarse con lo que necesites mañana." },
];

const faqs = [
  { q: "¿Cuánto tiempo toma un proyecto?", a: "Depende del alcance. Después del diagnóstico te compartimos un plan con etapas y tiempos estimados para tu caso." },
  { q: "¿Tengo que contratar todos los servicios?", a: "No. Puedes empezar con una sola solución y sumar otras cuando tu negocio lo necesite." },
  { q: "¿Trabajan solo en Monterrey?", a: "Estamos en Monterrey, Nuevo León, y trabajamos con negocios de todo México de forma remota." },
  { q: "¿Qué necesito para empezar?", a: "Solo contarnos cómo funciona tu negocio hoy. En la primera conversación identificamos juntos por dónde empezar." },
];

export default function ComoTrabajamosPage() {
  return (
    <>
      <PageHero
        eyebrow="Cómo trabajamos"
        accent="pink"
        crumbs={[{ name: "Cómo trabajamos", path: "/como-trabajamos" }]}
        title="De una idea a una experiencia que funciona."
        lead="Un proceso claro, en cuatro etapas, para que sepas siempre en qué punto estamos y qué sigue."
      />

      <section aria-labelledby="etapas-title" className="section-y bg-suma-cream-soft">
        <div className="container-suma">
          <SectionHeading id="etapas-title" eyebrow="El proceso" title="Cuatro etapas, un mismo ritmo" size="md" />
          <div className="mt-14">
            <ProcessSteps detailed />
          </div>
        </div>
      </section>

      <section aria-labelledby="principios-title" className="on-dark section-y bg-suma-navy text-suma-cream">
        <div className="container-suma">
          <SectionHeading id="principios-title" tone="light" eyebrow="Nuestro enfoque" title="Hecho para personas. Diseñado para hacer avanzar tu negocio." size="md" />
          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 3) * 80} className="border-t-2 border-suma-cream/25 pt-6">
                <h3 className="font-display text-2xl font-bold">{p.title}</h3>
                <p className="mt-3 text-suma-cream/80">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-proceso-title" className="section-y bg-suma-cream">
        <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-proceso-title" eyebrow="Preguntas frecuentes" title="Sobre el proceso" size="md" />
          <Accordion items={faqs} />
        </div>
      </section>

      <ClosingCta title="¿Empezamos con un diagnóstico?" text="Cuéntanos cómo funciona tu negocio hoy y te proponemos el primer paso." />
    </>
  );
}
