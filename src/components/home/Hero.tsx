import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { HeroVisual } from "./HeroVisual";

const enter = (delay: number) => ({ animationDelay: `${delay}ms` });
const enterClass = "motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_both]";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-suma-cream">
      <div className="container-suma grid items-center gap-12 pb-28 pt-10 md:pb-36 md:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-44">
        <div className="relative z-10">
          <p className={`text-eyebrow inline-flex items-center gap-3 text-suma-orange-ink ${enterClass}`} style={enter(40)}>
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-current" />
            Estudio creativo + tecnología para wellness
          </p>

          <h1 id="hero-title" className="mt-7">
            <span className={`text-display-xl block text-suma-navy ${enterClass}`} style={enter(110)}>
              Más tiempo para crear{" "}
              <span className="relative inline-block whitespace-nowrap">
                bienestar.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 24"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-[0.22em] w-full text-suma-orange"
                >
                  <path d="M3 16 C 60 4, 120 22, 180 10 S 270 6, 297 14" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </span>
            <span
              className={`mt-5 block font-display text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-suma-purple ${enterClass}`}
              style={enter(240)}
            >
              Nosotros nos encargamos de hacer que todo fluya.
            </span>
          </h1>

          <p className={`text-lead mt-8 max-w-xl text-suma-navy/75 ${enterClass}`} style={enter(340)}>
            Chatbots, CRM, aplicaciones, páginas web y publicidad digital diseñados para estudios, spas y marcas que
            quieren crecer sin perder su esencia.
          </p>

          <div className={`mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 ${enterClass}`} style={enter(420)}>
            <ButtonLink href="/#selector" size="lg" arrow>
              Quiero mejorar mi negocio
            </ButtonLink>
            <ButtonLink href="/soluciones" variant="link">
              Explorar soluciones
            </ButtonLink>
          </div>

          <p className={`mt-12 flex items-center gap-2 text-sm font-semibold text-suma-navy/65 ${enterClass}`} style={enter(500)}>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-suma-orange-ink" fill="currentColor">
              <path d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.3 4.5 8.5 4.5 8.5s4.5-5.2 4.5-8.5A4.5 4.5 0 0 0 8 1.5Zm0 6.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" />
            </svg>
            {site.location.label}
          </p>
        </div>

        <div className="relative">
          <HeroVisual />
          <p className="mt-2 text-center text-xs font-semibold text-suma-navy/55">Ejemplos ilustrativos</p>
        </div>
      </div>

      {/* Transición orgánica hacia el manifiesto */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-20 w-full text-suma-cream-soft md:h-32"
      >
        <path
          fill="currentColor"
          d="M0 96 C 180 40, 360 150, 620 110 C 860 72, 980 10, 1180 46 C 1300 68, 1380 104, 1440 92 L 1440 160 L 0 160 Z"
        />
      </svg>
    </section>
  );
}
