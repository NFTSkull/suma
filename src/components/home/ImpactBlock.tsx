import Image from "next/image";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/content/photos";

export function ImpactBlock() {
  const photo = photos.yogaEstudio;
  return (
    <section aria-labelledby="impacto-title" className="on-dark relative isolate overflow-hidden bg-suma-navy text-suma-cream">
      <div className="container-suma section-y grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative z-10">
          <Reveal>
            <p className="text-eyebrow text-suma-orange" lang="en">
              Designed for humans. Built for business.
            </p>
          </Reveal>
          <h2 id="impacto-title" className="mt-6 text-display-xl">
            <Reveal as="span" className="block">
              Hecho para
            </Reveal>
            <Reveal as="span" className="block text-suma-pink" delay={100}>
              personas.
            </Reveal>
            <Reveal as="span" className="mt-4 block font-display text-[clamp(1.6rem,3.2vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-suma-cream/90" delay={220}>
              Diseñado para hacer avanzar tu negocio.
            </Reveal>
          </h2>
          <Reveal delay={300}>
            <p className="text-lead mt-8 max-w-lg text-suma-cream/75">
              Unimos dirección creativa, experiencia de usuario y desarrollo para que cada herramienta se sienta tan cuidada
              como tu espacio.
            </p>
            <ButtonLink href="/como-trabajamos" variant="accent" size="lg" className="mt-10" arrow>
              Conoce nuestro enfoque
            </ButtonLink>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <OrganicShape shape="c" color="purple" className="absolute -left-16 -top-12 w-[70%]" />
          <OrganicShape shape="b" color="orange" animate="drift" className="absolute -bottom-14 -right-10 w-[52%] opacity-95" />
          <OrganicShape shape="d" color="pink" animate="drift-reverse" className="absolute -right-6 top-6 w-[26%] mix-blend-screen" />
          <Reveal variant="mask" className="relative">
            <div className="blob relative aspect-[4/4.4] overflow-hidden">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 36rem, 92vw" className="object-cover" />
              <div className="absolute inset-0 bg-suma-purple/20 mix-blend-multiply" />
            </div>
          </Reveal>
          <div
            aria-hidden="true"
            className="absolute -left-2 bottom-10 w-60 rounded-2xl bg-suma-cream-soft p-4 text-suma-navy shadow-lift motion-safe:animate-[float-card_7s_var(--ease-soft)_infinite] sm:-left-10"
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-suma-navy/60">Clase de hoy · ejemplo</p>
            <p className="mt-1 font-display text-lg font-bold">Vinyasa al atardecer</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span>18 de 20 lugares</span>
              <span className="rounded-full bg-suma-orange px-2.5 py-0.5 text-xs font-bold">Casi llena</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
