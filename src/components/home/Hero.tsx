import type { CSSProperties } from "react";
import { Poppins } from "next/font/google";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { HeroVisual } from "./HeroVisual";

/** Solo el titular del hero usa Poppins; se carga aquí para no añadirla al resto del sitio. */
const poppins = Poppins({ subsets: ["latin"], weight: ["800", "900"], display: "swap" });

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const enterClass = "motion-safe:animate-[enter_600ms_var(--ease-flow)_both]";
const riseClass = "motion-safe:animate-[hero-rise_600ms_var(--ease-flow)_both]";
const blockClass = "motion-safe:animate-[hero-block_520ms_cubic-bezier(0.7,0,0.2,1)_both]";

type Line = { text: string; block?: "orange" | "pink"; at: number; gap?: boolean };

/** Orden de lectura y coreografía: bloque → palabra → complemento. */
const lines: Line[] = [
  { text: "Creatividad", block: "orange", at: 80 },
  { text: "que suma.", at: 420 },
  { text: "Estrategia", block: "pink", at: 540, gap: true },
  { text: "que impulsa.", at: 880 },
];

const blockColor = { orange: "bg-suma-orange", pink: "bg-suma-pink" } as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-suma-cream">
      <div className="container-suma grid items-center gap-14 pb-28 pt-12 md:pb-36 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-44">
        <div className="relative z-10">
          <p
            className={`flex items-center gap-3 text-[0.72rem] font-semibold uppercase leading-none tracking-[0.2em] text-suma-navy/80 sm:text-xs ${enterClass}`}
            style={delay(0)}
          >
            <span aria-hidden="true" className="h-px w-7 bg-suma-navy/40" />
            <span>
              Creatividad <span className="text-suma-orange-ink">+</span> Tecnología
            </span>
          </p>

          <h1
            id="hero-title"
            className={`${poppins.className} mt-7 text-[clamp(2.25rem,12.4vw,3.75rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.035em] text-suma-navy sm:mt-9 sm:text-[clamp(3.75rem,10.8vw,5.5rem)] lg:text-[clamp(3.75rem,6.5vw,6rem)]`}
          >
            {lines.map(({ text, block, at, gap }) =>
              block ? (
                <span key={text} className={`block ${gap ? "mt-[0.42em]" : ""}`}>
                  <span className="relative -ml-[0.16em] inline-block px-[0.16em] pb-[0.04em] pt-[0.1em] font-black text-white">
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 origin-left ${blockColor[block]} ${blockClass}`}
                      style={delay(at)}
                    />
                    <span className={`relative block ${riseClass}`} style={delay(at + 200)}>
                      {text}
                    </span>
                  </span>{" "}
                </span>
              ) : (
                <span key={text} className={`block pt-[0.06em] ${riseClass}`} style={delay(at)}>
                  {text}{" "}
                </span>
              ),
            )}
          </h1>

          <p
            className={`mt-9 max-w-[26rem] text-[clamp(1.0625rem,1.3vw,1.1875rem)] font-medium leading-[1.65] text-suma-navy/80 sm:mt-11 ${enterClass}`}
            style={delay(1000)}
          >
            Diseñamos soluciones digitales que conectan, simplifican y hacen crecer tu negocio.
          </p>

          <div className={`mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-10 ${enterClass}`} style={delay(1080)}>
            <ButtonLink href="/#selector" size="lg" arrow>
              Quiero mejorar mi negocio
            </ButtonLink>
            <ButtonLink href="/soluciones" variant="link">
              Explorar soluciones
            </ButtonLink>
          </div>

          <p
            className={`mt-10 flex items-center gap-2 text-sm font-semibold text-suma-navy/65 md:mt-12 ${enterClass}`}
            style={delay(1140)}
          >
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
