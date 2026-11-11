import type { Metadata } from "next";
import { ShowroomBuilder } from "@/components/showroom/ShowroomBuilder";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { ClosingCta } from "@/components/home/ClosingCta";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "SUMA Vision Studio: prueba una solución para tu negocio",
  description: "Empieza con tres preguntas, prueba una demo a tu ritmo y conoce cuánto costaría la solución que elijas. Sin registro ni compromiso.",
  path: "/showroom",
  keywords: [
    "demo CRM pilates Monterrey", "showroom chatbot WhatsApp wellness",
    "cotizador CRM automatizaciones", "demo marketing estudios de pilates",
  ],
};
const crumbs = [{ name: "Showroom", path: "/showroom" }];
export const metadata: Metadata = buildMetadata(seo);

const steps = [
  { number: "01", title: "Tu negocio", text: "Tres preguntas fáciles" },
  { number: "02", title: "Prueba", text: "Explora una solución" },
  { number: "03", title: "Calcula", text: "Solo si quieres" },
  { number: "04", title: "Tu propuesta", text: "Precio y contacto" },
];

export default function ShowroomPage() {
  return (
    <>
      <PageHero
        eyebrow="SUMA VISION STUDIO · Interactivo"
        accent="purple"
        dark
        crumbs={crumbs}
        title={<>Prueba cómo SUMA podría <span className="text-suma-orange">ayudar a tu negocio.</span></>}
        lead="Empieza con tres preguntas sencillas, prueba las herramientas con tu negocio y conoce un precio de referencia. Tú avanzas paso a paso; el cálculo es opcional y no tienes que registrarte."
      >
        <ol aria-label="Cómo funciona" className="grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number}>
              <div className="flex h-full flex-col rounded-2xl border border-white/20 bg-white/5 p-3 md:p-4">
                <span className="font-display text-sm font-extrabold text-suma-orange">{step.number}</span>
                <span className="mt-1 font-display text-base font-bold text-suma-cream">{step.title}</span>
                <span className="mt-1 text-xs leading-snug text-suma-cream/65">{step.text}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href="#showroom-wizard" variant="light" size="lg" arrow>Comenzar experiencia</ButtonLink>
          <ButtonLink href="/precios" variant="link-light">Ver precios base</ButtonLink>
        </div>
      </PageHero>

      <section aria-label="Showroom personalizado" className="bg-suma-cream py-12 md:py-16">
        <div className="container-suma">
          <ShowroomBuilder />
        </div>
      </section>

      <ClosingCta
        title="¿Tu proyecto necesita algo más especial?"
        text="Envíanos tu configuración por WhatsApp o pide una sesión de diagnóstico. Te diremos qué es factible y cuál sería la propuesta real."
        secondary={{ label: "Consultar precios y paquetes", href: "/precios" }}
      />
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description, crumbs })} />
    </>
  );
}
