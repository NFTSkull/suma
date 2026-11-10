import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, ids, itemListNode, pageGraph } from "@/lib/seo";

const path = "/guias";
const seo = {
  path,
  title: "Guías de CRM y automatización para negocios wellness",
  description:
    "Recursos prácticos para decidir sobre software, reservas, CRM, chatbots y automatización en estudios de pilates, yoga, spas y centros de bienestar.",
  keywords: ["guías de software wellness", "automatización de negocios de bienestar", "CRM pilates y spas"],
};
const crumbs = [{ name: "Guías", path }];
export const metadata: Metadata = buildMetadata(seo);

const resources = [
  {
    eyebrow: "Pilates · Reformer · Barre",
    title: "Software para estudios de pilates: qué elegir antes de contratar",
    text: "Cuándo conviene una plataforma de reservas, cómo evaluar paquetes y reformers y en qué casos integrar herramientas o desarrollar un CRM propio.",
    href: "/guias/software-para-estudios-de-pilates",
    questions: ["Reservas y listas de espera", "Paquetes y membresías", "CRM o herramienta existente"],
  },
  {
    eyebrow: "Spas · Masajes · Bienestar",
    title: "Cómo automatizar las reservas de un spa sin perder el trato humano",
    text: "Un recorrido práctico desde la consulta por WhatsApp hasta la confirmación, cancelación y seguimiento, con controles para evitar errores de agenda.",
    href: "/guias/automatizar-reservas-spa",
    questions: ["Agenda y disponibilidad", "WhatsApp y confirmaciones", "Privacidad y seguimiento"],
  },
];

export default function GuiasPage() {
  return (
    <>
      <PageHero
        eyebrow="Recursos para negocios wellness"
        accent="purple"
        crumbs={crumbs}
        title="Menos dudas tecnológicas. Mejores decisiones para tu negocio."
        lead="Guías prácticas para elegir software, conectar herramientas y ordenar tu operación sin comprar más de lo necesario. Escritas para propietarios de estudios y centros de bienestar."
      />
      <section aria-labelledby="recursos-title" className="bg-suma-cream py-16 md:py-24">
        <div className="container-suma">
          <p className="text-eyebrow text-suma-orange-ink">Empieza por tu operación</p>
          <h2 id="recursos-title" className="text-display-md mt-4">Explora nuestras guías.</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {resources.map((resource, i) => (
              <article key={resource.href} className="flex h-full flex-col rounded-[2rem] border border-suma-line bg-suma-cream-soft p-8 shadow-soft md:p-10">
                <p className="text-eyebrow text-suma-purple">{resource.eyebrow}</p>
                <h3 className="mt-4 font-display text-3xl font-bold">{resource.title}</h3>
                <p className="mt-5 text-lg leading-relaxed text-suma-navy/80">{resource.text}</p>
                <ul className="mt-7 space-y-3 text-sm font-semibold text-suma-navy/75">
                  {resource.questions.map((question) => <li key={question}>✓ {question}</li>)}
                </ul>
                <Link href={resource.href} className="mt-9 inline-flex min-h-12 items-center self-start rounded-full bg-suma-navy px-7 font-bold text-suma-cream transition-colors hover:bg-suma-purple">
                  Leer guía 0{i + 1} →
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-9 max-w-4xl text-sm leading-relaxed text-suma-navy/70">
            Estas guías utilizan ejemplos hipotéticos para explicar decisiones de operación. No son estudios de clientes
            ni garantizan resultados. Una recomendación final debe considerar el tamaño, presupuesto y herramientas de cada negocio.
          </p>
        </div>
      </section>
      <section aria-labelledby="siguiente-title" className="bg-suma-cream-deep/60 py-16 md:py-24">
        <div className="container-suma">
          <p className="text-eyebrow text-suma-orange-ink">Cuando sabes qué necesitas</p>
          <h2 id="siguiente-title" className="text-display-md mt-4 max-w-4xl">Elige una herramienta. O conecta las que ya tienes.</h2>
          <p className="mt-5 max-w-3xl text-lg text-suma-navy/75">
            En SUMA diseñamos soluciones tecnológicas para negocios wellness. Puedes explorar nuestros
            {" "}<Link href="/servicios/crm" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">CRM personalizados</Link>,
            {" "}<Link href="/servicios/chatbots" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">asistentes inteligentes</Link>
            {" "}y <Link href="/industrias" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">soluciones por industria</Link>.
          </p>
        </div>
      </section>
      <ClosingCta
        title="Tu siguiente paso debe hacerte la vida más sencilla."
        text="Cuéntanos qué negocio tienes y qué procesos te están quitando tiempo. Te ayudamos a evaluar opciones sin imponerte un sistema."
        secondary={{ label: "Explorar servicios", href: "/servicios" }}
      />
      <JsonLd
        data={pageGraph({
          path,
          name: seo.title,
          description: seo.description,
          type: "CollectionPage",
          crumbs,
          mainEntity: ids.list(path),
          extra: [itemListNode(path, resources.map((resource) => ({ name: resource.title, path: resource.href })))],
        })}
      />
    </>
  );
}
