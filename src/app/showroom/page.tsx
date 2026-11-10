import type { Metadata } from "next";
import { ShowroomBuilder } from "@/components/showroom/ShowroomBuilder";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { ClosingCta } from "@/components/home/ClosingCta";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "Showroom interactivo: visualiza y configura tu solución | SUMA STUDIO",
  description: "Prueba demos personalizadas de CRM, chatbots, publicidad, reservas, webs y apps. Añade funciones, ve precios orientativos en MXN y pide una propuesta por WhatsApp.",
  path: "/showroom",
  keywords: [
    "demo CRM pilates Monterrey", "showroom chatbot WhatsApp wellness",
    "cotizador CRM automatizaciones", "demo marketing estudios de pilates",
  ],
};
const crumbs = [{ name: "Showroom", path: "/showroom" }];
export const metadata: Metadata = buildMetadata(seo);

export default function ShowroomPage() {
  return (
    <>
      <PageHero
        eyebrow="SUMA SHOWROOM · Interactivo"
        accent="orange"
        dark
        crumbs={crumbs}
        title={<>Tu idea, <span className="text-suma-orange">a la vista.</span></>}
        lead="Imagina cómo podría funcionar tu próximo CRM, chatbot, anuncio, sitio o aplicación. Personaliza una simulación, elige funciones y ve un presupuesto inicial, sin tener que agendar una reunión para empezar."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#showroom-construir" variant="light" size="lg" arrow>Diseñar mi experiencia</ButtonLink>
          <ButtonLink href="/precios" variant="link-light">Ver precios base</ButtonLink>
        </div>
      </PageHero>

      <section id="showroom-construir" aria-label="Showroom personalizado" className="scroll-mt-24 bg-suma-cream py-14 md:py-20">
        <div className="container-suma">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
            <p className="max-w-xl text-sm text-suma-navy/70">
              No necesitas conocimientos técnicos. Cambia el nombre de tu negocio, explora las pantallas, combina lo que sí te sirve y envíanos tu idea preparada.
            </p>
            <span className="rounded-full border border-suma-line px-4 py-2 text-xs font-bold text-suma-purple">
              1 · Personaliza &nbsp; 2 · Prueba &nbsp; 3 · Cotiza
            </span>
          </div>
          <ShowroomBuilder />
        </div>
      </section>

      <section aria-labelledby="showroom-limites-title" className="bg-suma-cream-soft py-16 md:py-20">
        <div className="container-suma grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-eyebrow text-suma-orange-ink">Sin compromiso</p>
            <h2 id="showroom-limites-title" className="mt-3 font-display text-2xl font-extrabold">Explora primero. Decide después.</h2>
          </div>
          <div className="rounded-2xl border border-suma-line bg-white p-6">
            <h3 className="font-display text-xl font-bold">Nada se conecta por sorpresa</h3>
            <p className="mt-3 text-sm leading-relaxed text-suma-navy/70">
              Las demos usan información ficticia. Para integrar WhatsApp, reservas o sistemas de terceros revisamos permisos y viabilidad primero.
            </p>
          </div>
          <div className="rounded-2xl border border-suma-line bg-white p-6">
            <h3 className="font-display text-xl font-bold">Un precio que se puede conversar</h3>
            <p className="mt-3 text-sm leading-relaxed text-suma-navy/70">
              Los importes provienen del catálogo de SUMA y son orientativos. Puedes pedir un ajuste de alcance a tu presupuesto o solicitar un diagnóstico.
            </p>
          </div>
        </div>
      </section>

      <ClosingCta
        title="¿Tu proyecto necesita algo más especial?"
        text="Puedes enviarnos tu configuración por WhatsApp y solicitar una sesión de diagnóstico. Te diremos qué módulos son factibles y cuál sería la propuesta real."
        secondary={{ label: "Consultar precios y paquetes", href: "/precios" }}
      />
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description, crumbs })} />
    </>
  );
}
