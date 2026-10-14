import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { industries } from "@/content/industries";
import { photos } from "@/content/photos";
import { cn } from "@/lib/cn";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industrias: yoga, pilates, spas, fitness, marcas wellness y retiros",
  description:
    "Soluciones digitales para estudios de yoga y pilates, spas, fitness boutique, marcas wellness, retiros y profesionales del bienestar en México.",
  path: "/industrias",
  keywords: ["tecnología para negocios de bienestar", "soluciones digitales para spas", "CRM para estudios de yoga"],
});

const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-6", "md:col-span-6"];

export default function IndustriasPage() {
  return (
    <>
      <PageHero
        eyebrow="Industrias"
        accent="pink"
        crumbs={[{ name: "Industrias", path: "/industrias" }]}
        title="Tu mundo es único. Tus herramientas también deberían serlo."
        lead="Cada tipo de negocio de bienestar tiene su ritmo, sus momentos críticos y su manera de cuidar a las personas. Empezamos por entender el tuyo."
      />
      <section aria-label="Lista de industrias" className="bg-suma-cream pb-24">
        <ul className="container-suma grid gap-5 md:grid-cols-12">
          {industries.map((ind, i) => {
            const photo = photos[ind.photo];
            return (
              <Reveal as="li" key={ind.slug} delay={(i % 2) * 90} className={spans[i]}>
                <Link href={ind.href} className="group relative block h-full min-h-[26rem] overflow-hidden rounded-[2rem] bg-suma-navy text-suma-cream">
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 48rem) 58vw, 92vw"
                    className="object-cover opacity-80 transition-transform duration-[900ms] ease-[var(--ease-flow)] group-hover:scale-[1.04]"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-suma-navy via-suma-navy/50 to-transparent" />
                  <span className="relative flex h-full flex-col justify-end p-7 md:p-9">
                    <span className="text-eyebrow text-suma-cream/80">{ind.navTagline}</span>
                    <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{ind.name}</h2>
                    <span className="mt-3 max-w-md text-suma-cream/85">{ind.benefit}</span>
                    <span className={cn("mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-suma-cream px-5 py-2.5 text-sm font-bold text-suma-navy")}>
                      Ver cómo podemos ayudarte <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>
      <ClosingCta
        title="¿Tu negocio no aparece aquí?"
        text="Trabajamos con todo tipo de proyectos de bienestar. Cuéntanos el tuyo."
        secondary={{ label: "Explorar soluciones", href: "/soluciones" }}
      />
    </>
  );
}
