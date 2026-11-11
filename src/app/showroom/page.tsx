import type { Metadata } from "next";
import { ShowroomBuilder } from "@/components/showroom/ShowroomBuilder";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { ClosingCta } from "@/components/home/ClosingCta";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "SUMA Vision Studio: demo, impacto y precio",
  description: "Experimenta CRM, chatbots y reservas con tu marca. Simula ingresos potenciales, tiempo recuperable, inversión y punto de equilibrio con supuestos transparentes.",
  path: "/showroom",
  keywords: [
    "demo CRM pilates Monterrey", "showroom chatbot WhatsApp wellness",
    "cotizador CRM automatizaciones", "demo marketing estudios de pilates",
  ],
};
const crumbs = [{ name: "Showroom", path: "/showroom" }];
export const metadata: Metadata = buildMetadata(seo);

const steps = [
  { href: "#showroom-construir", number: "01", title: "Personaliza", text: "Tu nombre y estilo en la demo" },
  { href: "#showroom-explorar", number: "02", title: "Pruébalo", text: "Demo interactiva de cada servicio" },
  { href: "#showroom-impacto", number: "03", title: "Calcula", text: "Qué tendría que pasar, con tus números" },
  { href: "#showroom-cotizar", number: "04", title: "Tu propuesta", text: "Precio, qué incluye y WhatsApp" },
];

export default function ShowroomPage() {
  return (
    <>
      <PageHero
        eyebrow="SUMA VISION STUDIO · Interactivo"
        accent="purple"
        dark
        crumbs={crumbs}
        title={<>Tu idea, <span className="text-suma-orange">a la vista.</span></>}
        lead="En cuatro pasos ves cómo funcionaría SUMA en tu negocio, estimas qué tendría que pasar para que la inversión te convenga y armas tu propuesta con precios «desde» y rangos orientativos. Sin registro ni compromiso."
      >
        <ol aria-label="Cómo funciona" className="grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((step) => (
            <li key={step.href}>
              <a href={step.href}
                className="flex h-full flex-col rounded-2xl border border-white/20 bg-white/5 p-3 transition-colors hover:border-suma-orange focus-visible:outline-2 focus-visible:outline-suma-orange md:p-4">
                <span className="font-display text-sm font-extrabold text-suma-orange">{step.number}</span>
                <span className="mt-1 font-display text-base font-bold text-suma-cream">{step.title}</span>
                <span className="mt-1 text-xs leading-snug text-suma-cream/65">{step.text}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href="#showroom-construir" variant="light" size="lg" arrow>Empezar</ButtonLink>
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
