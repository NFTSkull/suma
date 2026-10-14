"use client";

import { useEffect, useState } from "react";
import { AnimatedSumaSymbol } from "@/components/brand/AnimatedSumaSymbol";
import { cn } from "@/lib/cn";

type Snippet = { kind: string; title: string; detail: string; tone: "orange" | "pink" | "purple" };

const snippets: Snippet[] = [
  { kind: "Reserva confirmada", title: "Reformer intermedio", detail: "Jueves · 18:30 · Lugar 4", tone: "orange" },
  { kind: "Conversación atendida", title: "“¿Tienen clase muestra?”", detail: "Respondida al instante · Seguimiento listo", tone: "pink" },
  { kind: "Clientes", title: "3 seguimientos para hoy", detail: "2 membresías por renovar", tone: "purple" },
  { kind: "Clase agendada", title: "Yoga restaurativo", detail: "Sábado · 9:00 · 12 lugares", tone: "orange" },
];

const toneDot = { orange: "bg-suma-orange", pink: "bg-suma-pink", purple: "bg-suma-purple" } as const;

function SnippetCard({ s, className }: { s: Snippet; className?: string }) {
  return (
    <div
      className={cn(
        "w-[min(17rem,70vw)] rounded-2xl border border-suma-navy/10 bg-suma-cream-soft/95 p-4 shadow-lift backdrop-blur-sm",
        "motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_both]",
        className,
      )}
    >
      <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-suma-navy/65">
        <span className={cn("size-2 rounded-full", toneDot[s.tone])} aria-hidden="true" />
        {s.kind}
      </p>
      <p className="mt-2 font-display text-lg font-bold leading-tight text-suma-navy">{s.title}</p>
      <p className="mt-1 text-sm text-suma-navy/70">{s.detail}</p>
    </div>
  );
}

export function HeroVisual() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    let timer: number | undefined;
    const start = () => {
      timer = window.setInterval(() => setIndex((i) => (i + 1) % snippets.length), 4200);
    };
    const onVisibility = () => {
      window.clearInterval(timer);
      if (document.visibilityState === "visible") start();
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const primary = snippets[index];
  const secondary = snippets[(index + 1) % snippets.length];

  return (
    <div className="relative mx-auto aspect-[3/4] w-full sm:aspect-[5/6] max-w-[36rem]" aria-hidden="true">
      <div className="pointer-events-none absolute inset-0 motion-safe:animate-[enter-scale_1.1s_var(--ease-flow)_0.15s_both]">
        <svg viewBox="0 0 400 400" className="absolute inset-0 size-full" fill="none">
          <path
            d="M40 300 C 120 220, 180 360, 260 250 S 380 160, 360 60"
            stroke="var(--color-suma-navy)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* En móvil el visual queda bajo el pliegue: se une cuando el usuario llega a él. */}
      <AnimatedSumaSymbol
        variant="hero"
        trigger="in-view"
        preload
        className="absolute left-1/2 top-[52%] w-[50%] -translate-x-1/2 sm:w-[58%] -translate-y-1/2"
      />

      <SnippetCard key={`p-${index}`} s={primary} className="absolute right-0 top-0 sm:-right-2" />
      <SnippetCard
        key={`s-${index}`}
        s={secondary}
        className="absolute bottom-0 left-0 [animation-delay:160ms] sm:-left-4"
      />
    </div>
  );
}
