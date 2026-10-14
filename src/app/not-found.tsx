import { OrganicShape } from "@/components/brand/OrganicShape";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="relative isolate overflow-hidden bg-suma-cream">
      <OrganicShape shape="a" color="pink" animate="drift" className="absolute -right-24 -top-24 -z-10 size-96 opacity-80" />
      <div className="container-suma py-32 md:py-44">
        <p className="text-eyebrow text-suma-orange-ink">Error 404</p>
        <h1 id="nf-title" className="text-display-lg mt-6 max-w-3xl">
          Esta página perdió el flujo.
        </h1>
        <p className="text-lead mt-6 max-w-xl text-suma-navy/75">La dirección no existe o cambió. Te llevamos de regreso.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/" size="lg" arrow>
            Ir al inicio
          </ButtonLink>
          <ButtonLink href="/servicios" variant="secondary" size="lg">
            Ver servicios
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
