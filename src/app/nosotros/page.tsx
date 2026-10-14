import type { Metadata } from "next";
import Image from "next/image";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/content/photos";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "El estudio: creatividad que conecta, tecnología que suma",
  description:
    "SUMA STUDIO es un estudio creativo y tecnológico en Monterrey, Nuevo León, que diseña experiencias digitales para negocios de bienestar en todo México.",
  path: "/nosotros",
});

const beliefs = [
  { title: "El bienestar se siente.", text: "La tecnología también debería. Diseñamos herramientas que se sienten tan cuidadas como la experiencia que ofreces." },
  { title: "Menos operación, más presencia.", text: "Queremos que dediques tu energía a las personas que atiendes, no a perseguir mensajes y hojas de cálculo." },
  { title: "Todo suma.", text: "Una web, un asistente, un CRM o una campaña funcionan mejor cuando están conectados entre sí." },
];

const does = [
  "Diseñamos y desarrollamos chatbots, CRM, aplicaciones móviles y páginas web.",
  "Planeamos y gestionamos publicidad digital.",
  "Conectamos esas piezas para que trabajen en conjunto.",
  "Acompañamos la evolución de lo que construimos.",
];

const doesNot = [
  "No somos un spa, un estudio ni un marketplace.",
  "No vendemos paquetes genéricos sin entender tu negocio.",
  "No prometemos resultados que no podemos medir contigo.",
];

export default function NosotrosPage() {
  const photo = photos.yogaEstudio;
  return (
    <>
      <PageHero
        eyebrow="El estudio"
        crumbs={[{ name: "El estudio", path: "/nosotros" }]}
        title={
          <>
            Creatividad que conecta. <span className="text-suma-purple">Tecnología que suma.</span>
          </>
        }
        lead="SUMA STUDIO es un estudio de creaciones y producciones digitales para negocios de bienestar. Unimos diseño, tecnología y estrategia para que tu negocio fluya."
      />

      <section aria-labelledby="creemos-title" className="section-y bg-suma-cream-soft">
        <div className="container-suma grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal variant="mask" className="relative mx-auto w-full max-w-lg">
            <OrganicShape shape="c" color="orange" className="absolute -left-10 -top-10 size-48" />
            <div className="blob relative aspect-square overflow-hidden">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 64rem) 32rem, 90vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading id="creemos-title" eyebrow="En qué creemos" title="The Art of Flow" size="md" />
            <ul className="mt-10 space-y-8">
              {beliefs.map((b, i) => (
                <Reveal as="li" key={b.title} delay={i * 90}>
                  <h3 className="font-display text-2xl font-bold">{b.title}</h3>
                  <p className="mt-2 text-lg text-suma-navy/75">{b.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="hacemos-title" className="section-y bg-suma-cream">
        <div className="container-suma grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-[2rem] bg-suma-navy p-8 text-suma-cream md:p-10">
            <h2 id="hacemos-title" className="font-display text-3xl font-bold">
              Lo que hacemos
            </h2>
            <ul className="mt-6 space-y-4">
              {does.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden="true" className="blob mt-1.5 size-3 shrink-0 bg-suma-orange" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90} className="rounded-[2rem] border-2 border-suma-navy/15 p-8 md:p-10">
            <h2 className="font-display text-3xl font-bold">Lo que no hacemos</h2>
            <ul className="mt-6 space-y-4">
              {doesNot.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden="true" className="blob mt-1.5 size-3 shrink-0 bg-suma-pink" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="donde-title" className="bg-suma-cream-deep/60 py-20">
        <div className="container-suma flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-eyebrow text-suma-orange-ink">Dónde estamos</p>
            <h2 id="donde-title" className="text-display-md mt-3">
              {site.location.label}
            </h2>
          </div>
          <p className="max-w-md text-lg text-suma-navy/75">Trabajamos de forma remota con negocios de bienestar en cualquier ciudad del país.</p>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
