"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const stages = [
  { id: "anuncio", label: "Descubre", tool: "Publicidad digital", text: "Una persona encuentra un estudio de yoga en un anuncio cerca de su casa.", color: "bg-suma-orange" },
  { id: "web", label: "Explora", tool: "Página web", text: "Entra a su página, ve horarios, instructores y cómo es la primera clase.", color: "bg-suma-pink" },
  { id: "chat", label: "Pregunta", tool: "Asistente inteligente", text: "Pregunta por una clase y recibe información al momento.", color: "bg-suma-orange" },
  { id: "crm", label: "Reserva", tool: "CRM", text: "Reserva, y el estudio organiza el contacto y su seguimiento en su CRM.", color: "bg-suma-purple" },
  { id: "app", label: "Regresa", tool: "Aplicación móvil", text: "Con el tiempo, gestiona sus clases y su membresía desde una app.", color: "bg-suma-pink" },
] as const;

export function ConnectedJourney() {
  const [active, setActive] = useState(0);
  const [userPicked, setUserPicked] = useState(false);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (userPicked || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => Number((e.target as HTMLElement).dataset.index));
        if (visible.length) setActive((a) => Math.max(a, ...visible));
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [userPicked]);

  const progress = (active / (stages.length - 1)) * 100;

  return (
    <div>
      <ol className="relative grid gap-4 md:grid-cols-5 md:gap-3">
        <span aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-0.5 bg-suma-navy/12 md:bottom-auto md:left-[10%] md:right-[10%] md:top-[1.4rem] md:h-0.5 md:w-auto" />
        <span
          aria-hidden="true"
          className="absolute left-[1.4rem] top-6 w-0.5 bg-gradient-to-b from-suma-orange via-suma-pink to-suma-purple transition-[height,width] duration-[var(--dur-reveal)] ease-[var(--ease-flow)] md:hidden"
          style={{ height: `calc((100% - 3rem) * ${progress / 100})` }}
        />
        <span
          aria-hidden="true"
          className="absolute left-[10%] top-[1.4rem] hidden h-0.5 bg-gradient-to-r from-suma-orange via-suma-pink to-suma-purple transition-[width] duration-[var(--dur-reveal)] ease-[var(--ease-flow)] md:block"
          style={{ width: `${progress * 0.8}%` }}
        />

        {stages.map((s, i) => {
          const reached = i <= active;
          return (
            <li
              key={s.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-index={i}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setUserPicked(true);
                  setActive(i);
                }}
                aria-pressed={i === active}
                className={cn(
                  "flex w-full gap-4 rounded-[1.5rem] p-3 text-left transition-[background-color,box-shadow] duration-[var(--dur-panel)] md:flex-col md:items-center md:p-4 md:text-center",
                  i === active ? "bg-suma-cream-soft shadow-soft" : "hover:bg-suma-cream-soft/60",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 grid size-11 shrink-0 place-items-center rounded-full font-display font-bold transition-[background-color,transform,color] duration-[var(--dur-panel)]",
                    reached ? cn(s.color, s.color === "bg-suma-purple" ? "text-suma-cream" : "text-suma-navy", "scale-105") : "bg-suma-cream-deep text-suma-navy/60",
                  )}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block font-display text-xl font-bold text-suma-navy">{s.label}</span>
                  <span className="text-eyebrow mt-1 block text-[0.65rem] text-suma-navy/60">{s.tool}</span>
                  <span className={cn("mt-2 block text-sm text-suma-navy/75 transition-opacity duration-[var(--dur-panel)] md:min-h-20", reached ? "opacity-100" : "md:opacity-80")}>
                    {s.text}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-xs font-semibold text-suma-navy/60">Ejemplo ilustrativo de una posible solución integrada.</p>
    </div>
  );
}
