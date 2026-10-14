"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { serviceBySlug, serviceInlineName } from "@/content/services";
import { situations, type Situation } from "@/content/situations";
import { cn } from "@/lib/cn";
import { colorStyles } from "@/lib/colors";

/** Distribución asimétrica tipo bento en escritorio. */
const tileLayout = [
  "md:col-span-3 md:row-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
];

function Detail({ s, id }: { s: Situation; id: string }) {
  const service = serviceBySlug[s.solution.service];
  const c = colorStyles[service.color];
  return (
    <div id={id} key={s.id} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
      <p className="text-eyebrow text-suma-navy/60">Situación {s.number}</p>
      <p className="mt-4 text-lg leading-relaxed text-suma-navy/80">{s.explanation}</p>
      <div className="mt-8 rounded-[1.5rem] bg-suma-navy p-6 text-suma-cream on-dark">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-suma-cream/70">
          <span aria-hidden="true" className={cn("blob size-3", c.dot)} />
          Solución relacionada
        </p>
        <p className="mt-3 font-display text-2xl font-bold">{s.solution.label}</p>
        <p className="mt-2 text-suma-cream/80">{s.solution.text}</p>
        <ButtonLink href={service.href} variant="link-light" className="mt-4">
          Explorar {serviceInlineName[service.slug]}
        </ButtonLink>
      </div>
    </div>
  );
}

export function SituationsExplorer() {
  const [selected, setSelected] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const current = situations[selected];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) {
      e.preventDefault();
      const next = (i + keys[e.key] + situations.length) % situations.length;
      setSelected(next);
      buttonsRef.current[next]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const next = e.key === "Home" ? 0 : situations.length - 1;
      setSelected(next);
      buttonsRef.current[next]?.focus();
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
      <div role="group" aria-label="Situaciones frecuentes" className="grid auto-rows-[minmax(9rem,auto)] gap-3 md:grid-cols-6 md:gap-4">
        {situations.map((s, i) => {
          const active = i === selected;
          const service = serviceBySlug[s.solution.service];
          return (
            <div key={s.id} className={cn("flex flex-col", tileLayout[i])}>
              <button
                ref={(el) => {
                  buttonsRef.current[i] = el;
                }}
                type="button"
                aria-pressed={active}
                aria-controls="situacion-detalle situacion-detalle-movil"
                onClick={() => setSelected(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "group relative flex h-full min-h-36 flex-col justify-between overflow-hidden rounded-[1.5rem] border p-5 text-left transition-[background-color,border-color,transform,box-shadow] duration-[var(--dur-panel)] ease-[var(--ease-flow)] md:p-6",
                  active
                    ? "border-transparent bg-suma-navy text-suma-cream shadow-lift"
                    : "border-suma-line bg-suma-cream-soft text-suma-navy hover:-translate-y-0.5 hover:border-suma-navy/25 hover:shadow-soft",
                )}
              >
                <span className="flex items-center justify-between">
                  <span className={cn("font-display text-sm font-bold", active ? "text-suma-orange" : "text-suma-navy/50")}>{s.number}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "blob size-5 transition-transform duration-[var(--dur-panel)]",
                      colorStyles[service.color].dot,
                      active ? "scale-125" : "scale-75 opacity-70 group-hover:scale-100",
                    )}
                  />
                </span>
                <span className={cn("mt-6 font-display font-bold leading-[1.12]", i === 0 ? "text-2xl md:text-[1.9rem]" : "text-lg md:text-xl")}>
                  {s.title}
                </span>
              </button>
              {active && (
                <div className="mt-3 rounded-[1.5rem] bg-suma-cream-soft p-5 lg:hidden" aria-live="polite">
                  <Detail s={s} id="situacion-detalle-movil" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)] rounded-[2rem] bg-suma-cream-soft p-8" aria-live="polite">
          <p className="font-display text-3xl font-bold leading-tight text-suma-navy">{current.title}</p>
          <div className="mt-6">
            <Detail s={current} id="situacion-detalle" />
          </div>
        </div>
      </div>
    </div>
  );
}
