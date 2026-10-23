"use client";

import { Poppins } from "next/font/google";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { transformation } from "@/content/transformation";
import { centerRatio, initialPhase, nextPhase, type Phase } from "./scroll-transformation";

/** Solo el peso 600: el hero carga 800/900 por separado, así no se duplica ningún archivo. */
const poppins = Poppins({ subsets: ["latin"], weight: "600", display: "swap" });

const { eyebrow, labels, rows } = transformation;

/**
 * Composición editorial "Antes → Con SUMA". Cambia de estado con el scroll
 * natural (sin temporizadores ni scroll-jacking): mientras el bloque está cerca
 * de la pantalla se mide su posición en un rAF y React solo se actualiza cuando
 * el estado cambia. Sin JS muestra el estado final; con movimiento reducido
 * también, sin transición. Los lectores de pantalla leen una lista estática con
 * ambos estados en lugar de la capa animada.
 */
export function SumaScrollTransformation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase | null>(null);
  const manualRef = useRef(false);
  const [phase, setPhase] = useState<Phase | null>(null);

  const commit = useCallback((next: Phase) => {
    if (phaseRef.current === next) return;
    phaseRef.current = next;
    setPhase(next);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let listening = false;

    const evaluate = () => {
      frame = 0;
      if (manualRef.current) return;
      const ratio = centerRatio(root.getBoundingClientRect(), window.innerHeight);
      const current = phaseRef.current;
      commit(current ? nextPhase(current, ratio) : initialPhase(ratio));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };

    if (!("IntersectionObserver" in window)) {
      frame = requestAnimationFrame(() => commit("after"));
      return () => cancelAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          listen(false);
          manualRef.current = false;
          commit(reduce || entry.boundingClientRect.top < 0 ? "after" : "before");
          return;
        }
        if (reduce) {
          if (!manualRef.current) commit("after");
          return;
        }
        listen(true);
        evaluate();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
    };
  }, [commit]);

  const choose = (next: Phase) => {
    manualRef.current = true;
    commit(next);
  };

  return (
    <div ref={rootRef} data-state={phase ?? undefined} className="suma-shift">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0.18em] text-suma-navy/70">
          {eyebrow}
        </p>
        <div role="group" aria-label="Comparar cómo cambia tu negocio" className="flex items-center gap-2.5">
          <button
            type="button"
            data-for="before"
            aria-pressed={phase === "before"}
            onClick={() => choose("before")}
            className="suma-shift__label px-1 py-2 text-[0.7rem] font-bold uppercase leading-none tracking-[0.16em] text-suma-navy"
          >
            {labels.before}
          </button>
          <span aria-hidden="true" className="relative h-px w-10 bg-suma-navy/20">
            <span className="suma-shift__dot absolute -top-[3px] left-0 size-[7px] rounded-full bg-suma-orange" />
          </span>
          <button
            type="button"
            data-for="after"
            aria-pressed={phase === "after"}
            onClick={() => choose("after")}
            className="suma-shift__label px-1 py-2 text-[0.7rem] font-bold uppercase leading-none tracking-[0.16em] text-suma-purple"
          >
            {labels.after}
          </button>
        </div>
      </div>

      <ol aria-hidden="true" className="mt-6 border-t border-suma-navy/10">
        {rows.map((row, i) => (
          <li
            key={row.number}
            style={{ "--i": i } as CSSProperties}
            className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-3 border-b border-suma-navy/10 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] md:py-6"
          >
            <span className="text-xs font-semibold tabular-nums tracking-[0.12em] text-suma-navy/60">{row.number}</span>
            <span
              className={`${poppins.className} grid text-[clamp(1.125rem,1.9vw,1.5rem)] font-semibold leading-[1.25] tracking-[-0.01em]`}
            >
              <span data-layer="before" className="suma-shift__layer text-suma-navy/70">
                {row.before}
              </span>
              <span data-layer="after" className="suma-shift__layer text-suma-purple">
                {row.after}
              </span>
            </span>
            <span className="suma-shift__rule absolute inset-x-0 -bottom-px h-px origin-left bg-suma-purple/50" />
          </li>
        ))}
      </ol>

      <ul className="sr-only">
        {rows.map((row) => (
          <li key={row.number}>
            {labels.before}: {row.before} {labels.after}: {row.after}
          </li>
        ))}
      </ul>
    </div>
  );
}
