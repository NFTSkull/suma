"use client";

import { useEffect, useId, useRef, useState } from "react";
import { capabilityAnchorId, serviceShortcuts } from "@/content/service-shortcuts";
import type { ServiceSlug } from "@/types/content";
import { cn } from "@/lib/cn";

/** Tiempo que la tarjeta destino conserva el énfasis una vez que llega a pantalla. */
export const EMPHASIS_MS = 1600;
/** Respaldo para navegadores sin `scrollend` (o si no hubo desplazamiento). */
export const SCROLL_SETTLE_FALLBACK_MS = 900;

/**
 * Enciende el énfasis de la tarjeta cuando termina el desplazamiento y lo
 * retira después de `EMPHASIS_MS`. Escribe `data-emphasis` directo en el DOM
 * (la tarjeta es un Server Component). Devuelve la limpieza.
 */
function emphasize(target: HTMLElement, immediate: boolean) {
  let fallback: number | undefined;
  let release: number | undefined;
  const start = () => {
    window.removeEventListener("scrollend", start);
    window.clearTimeout(fallback);
    target.setAttribute("data-emphasis", "true");
    release = window.setTimeout(() => target.removeAttribute("data-emphasis"), EMPHASIS_MS);
  };
  if (immediate) {
    start();
  } else {
    window.addEventListener("scrollend", start, { once: true });
    fallback = window.setTimeout(start, SCROLL_SETTLE_FALLBACK_MS);
  }
  return () => {
    window.removeEventListener("scrollend", start);
    window.clearTimeout(fallback);
    window.clearTimeout(release);
    target.removeAttribute("data-emphasis");
  };
}

/** Selector compacto de necesidades: cada opción lleva a la tarjeta existente de su servicio. */
export function ServiceShortcuts() {
  const labelId = useId();
  const [selected, setSelected] = useState<ServiceSlug | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  const goTo = (slug: ServiceSlug, fromKeyboard: boolean) => {
    setSelected(slug);
    const target = document.getElementById(capabilityAnchorId(slug));
    if (!target) return;
    cleanupRef.current?.();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    // Con teclado el foco acompaña al destino (como un salto de enlace); con puntero se queda en el selector.
    if (fromKeyboard) target.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    cleanupRef.current = emphasize(target, reduced);
  };

  return (
    <div className="mt-10 md:mt-12">
      <p id={labelId} className="text-lg font-semibold text-suma-navy md:text-xl">
        ¿Qué te gustaría mejorar hoy?
      </p>
      {/* Móvil: una fila deslizable a sangre completa; desde sm las opciones se acomodan en filas. */}
      <div
        role="group"
        aria-labelledby={labelId}
        className="hide-scrollbar -mx-[clamp(1.25rem,4vw,3rem)] mt-4 flex gap-2 overflow-x-auto px-[clamp(1.25rem,4vw,3rem)] py-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 md:gap-2.5"
      >
        {serviceShortcuts.map((s) => {
          const active = s.service === selected;
          return (
            <button
              key={s.service}
              type="button"
              aria-pressed={active}
              aria-controls={capabilityAnchorId(s.service)}
              onClick={(e) => goTo(s.service, e.detail === 0)}
              className={cn(
                "relative inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 pb-2.5 pt-2 text-[0.9375rem] font-semibold transition-[color,background-color,border-color] duration-300 ease-[var(--ease-soft)]",
                active
                  ? "border-suma-navy/70 bg-suma-cream-soft text-suma-navy"
                  : "border-suma-navy/15 text-suma-navy/75 hover:border-suma-navy/40 hover:text-suma-navy",
              )}
            >
              {s.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-4 bottom-1.5 h-0.5 origin-left rounded-full bg-suma-orange transition-transform duration-300 ease-[var(--ease-flow)]",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
