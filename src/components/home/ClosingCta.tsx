import { AnimatedSumaSymbol } from "@/components/brand/AnimatedSumaSymbol";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/content/navigation";

type Props = {
  title?: string;
  text?: string;
  secondary?: { label: string; href: string };
  headingId?: string;
};

export function ClosingCta({
  title = "Tu siguiente gran idea merece hacerse realidad.",
  text = "Cuéntanos qué estás construyendo, qué te está frenando o qué te gustaría mejorar. En SUMA STUDIO podemos ayudarte a encontrar una solución digital que tenga sentido para tu negocio.",
  secondary = { label: "Conocer todos los servicios", href: "/servicios" },
  headingId = "cierre-title",
}: Props) {
  return (
    <section aria-labelledby={headingId} className="relative isolate overflow-hidden bg-suma-cream">
      <div className="container-suma section-y relative lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
        <AnimatedSumaSymbol
          variant="subtle"
          trigger="in-view"
          className="absolute right-[clamp(1.25rem,4vw,3rem)] top-4 w-12 lg:hidden"
        />

        <div className="max-w-3xl">
          <Reveal>
            <h2 id={headingId} className="text-display-lg text-suma-navy">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-lead mt-8 max-w-2xl text-suma-navy/75">{text}</p>
          </Reveal>
          <Reveal delay={220} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href={primaryCta.href} size="lg" arrow>
              {primaryCta.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="link">
                {secondary.label}
              </ButtonLink>
            )}
          </Reveal>
        </div>

        <AnimatedSumaSymbol
          variant="cta"
          trigger="in-view"
          className="hidden w-[clamp(12rem,20vw,19rem)] lg:mr-[4%] lg:block"
        />
      </div>
    </section>
  );
}
