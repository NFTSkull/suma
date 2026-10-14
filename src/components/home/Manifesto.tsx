import { OrganicShape } from "@/components/brand/OrganicShape";
import { Reveal } from "@/components/ui/Reveal";

export function Manifesto() {
  return (
    <section aria-labelledby="manifiesto-title" className="relative overflow-hidden bg-suma-cream-soft">
      <div className="container-suma section-y relative">
        <OrganicShape shape="c" color="pink" className="absolute -left-24 top-10 size-56 opacity-15 md:size-80" />

        <div className="relative mx-auto max-w-5xl">
          <h2 id="manifiesto-title" className="sr-only">
            Manifiesto SUMA
          </h2>
          <p className="font-display text-[clamp(2rem,5.2vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-suma-navy">
            <Reveal as="span" className="block">
              La tecnología no debería
            </Reveal>
            <Reveal as="span" className="block" delay={90}>
              complicar tu negocio.
            </Reveal>
            <Reveal as="span" className="mt-3 block text-suma-purple" delay={200}>
              Debería darte <span className="italic text-suma-pink-ink">libertad</span>
            </Reveal>
            <Reveal as="span" className="block text-suma-purple" delay={290}>
              para disfrutarlo.
            </Reveal>
          </p>

          <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-end">
            <Reveal delay={150}>
              <p className="text-eyebrow flex items-center gap-3 text-suma-navy/70">
                <span aria-hidden="true" className="blob inline-block size-4 bg-suma-orange" />
                SUMA STUDIO / Diseñado para fluir
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-lead text-suma-navy/75">
                Creemos que las mejores herramientas son las que se adaptan a las personas. Por eso diseñamos soluciones
                para que tu operación sea más clara, tu atención más sencilla y tu experiencia digital más cercana.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
