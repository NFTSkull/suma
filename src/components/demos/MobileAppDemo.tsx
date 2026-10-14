"use client";

import { useState } from "react";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { useTabs } from "@/components/ui/useTabs";
import { cn } from "@/lib/cn";

type ClassItem = { id: string; name: string; day: string; time: string; coach: string; spots: number };

const classes: ClassItem[] = [
  { id: "c1", name: "Barre sculpt", day: "Mar", time: "7:00", coach: "Ana", spots: 4 },
  { id: "c2", name: "Reformer flow", day: "Mar", time: "18:30", coach: "Luis", spots: 2 },
  { id: "c3", name: "Yoga restaurativo", day: "Mié", time: "8:00", coach: "Paula", spots: 8 },
  { id: "c4", name: "HIIT funcional", day: "Jue", time: "19:00", coach: "Diego", spots: 6 },
];

const screens = ["inicio", "clases", "reservas", "membresia"] as const;
type Screen = (typeof screens)[number];
const screenLabels: Record<Screen, string> = { inicio: "Inicio", clases: "Clases", reservas: "Reservas", membresia: "Membresía" };
const screenNotes: Record<Screen, string> = {
  inicio: "Tu marca da la bienvenida con la próxima clase y novedades relevantes.",
  clases: "El calendario muestra disponibilidad y permite reservar en un toque.",
  reservas: "Cada persona gestiona sus reservas sin escribirte un mensaje.",
  membresia: "Vigencia, clases restantes y beneficios siempre a la mano.",
};

function Icon({ name }: { name: Screen }) {
  const paths: Record<Screen, string> = {
    inicio: "M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1Z",
    clases: "M4 5h12v11H4zM4 8.5h12M7.5 3v3M12.5 3v3",
    reservas: "M5 10.5l3 3 7-7",
    membresia: "M3 6h14v8H3zM3 9h14",
  };
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

export function MobileAppDemo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { active, setActive, listProps, tabProps, panelProps } = useTabs(screens);
  const [booked, setBooked] = useState<string[]>(["c1"]);
  const remaining = 8 - booked.length;
  const light = tone === "dark";

  const toggle = (id: string) => setBooked((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));
  const next = classes.find((c) => booked.includes(c.id));

  return (
    <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
      <div className="mx-auto w-[18.5rem] rounded-[2.75rem] bg-suma-navy-deep p-2.5 shadow-device ring-1 ring-suma-cream/10">
        <div className="relative flex h-[36rem] flex-col overflow-hidden rounded-[2.25rem] bg-suma-cream-soft text-suma-navy">
          <div aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-suma-navy-deep" />
          <div className="flex-1 overflow-y-auto">
            <section {...panelProps("inicio")} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
              <div className="bg-suma-pink px-5 pb-6 pt-12">
                <p className="text-xs font-bold uppercase tracking-[0.16em]">Hola, Ana</p>
                <p className="mt-1 font-display text-2xl font-extrabold leading-tight">Tu próxima clase</p>
                {next ? (
                  <div className="mt-4 rounded-2xl bg-suma-cream-soft/95 p-3">
                    <p className="font-bold">{next.name}</p>
                    <p className="text-sm text-suma-navy/70">
                      {next.day} · {next.time} · con {next.coach}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 rounded-2xl bg-suma-cream-soft/95 p-3 text-sm">No tienes clases reservadas.</p>
                )}
              </div>
              <div className="space-y-3 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-suma-navy/60">Novedades</p>
                <div className="rounded-2xl bg-suma-orange/15 p-3">
                  <p className="font-bold">Nuevo horario de barre</p>
                  <p className="text-sm text-suma-navy/70">Jueves 7:00 a partir de la próxima semana.</p>
                </div>
                <button type="button" onClick={() => setActive("clases")} className="min-h-11 w-full rounded-full bg-suma-navy text-sm font-bold text-suma-cream">
                  Reservar una clase
                </button>
              </div>
            </section>

            <section {...panelProps("clases")} className="px-4 pb-4 pt-12 motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
              <p className="px-1 font-display text-2xl font-extrabold">Clases</p>
              <ul className="mt-3 space-y-2">
                {classes.map((c) => {
                  const isBooked = booked.includes(c.id);
                  const disabled = !isBooked && remaining <= 0;
                  return (
                    <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-suma-line bg-suma-cream p-3">
                      <span className="w-11 text-center">
                        <span className="block text-[0.65rem] font-bold uppercase text-suma-navy/60">{c.day}</span>
                        <span className="font-display font-bold">{c.time}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">{c.name}</span>
                        <span className="text-xs text-suma-navy/60">
                          {c.coach} · {c.spots - (isBooked ? 1 : 0)} lugares
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(c.id)}
                        disabled={disabled}
                        aria-pressed={isBooked}
                        aria-label={`${isBooked ? "Cancelar" : "Reservar"} ${c.name} ${c.day} ${c.time}`}
                        className={cn(
                          "min-h-9 rounded-full px-3 text-xs font-bold transition-colors disabled:opacity-40",
                          isBooked ? "bg-suma-pink text-suma-navy" : "bg-suma-navy text-suma-cream",
                        )}
                      >
                        {isBooked ? "Reservada" : "Reservar"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section {...panelProps("reservas")} className="px-4 pb-4 pt-12 motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
              <p className="px-1 font-display text-2xl font-extrabold">Mis reservas</p>
              {booked.length === 0 ? (
                <p className="mt-4 rounded-2xl bg-suma-cream-deep p-4 text-sm">Aún no tienes reservas.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {classes
                    .filter((c) => booked.includes(c.id))
                    .map((c) => (
                      <li key={c.id} className="rounded-2xl bg-suma-cream p-3 shadow-soft">
                        <p className="font-bold">{c.name}</p>
                        <p className="text-sm text-suma-navy/65">
                          {c.day} · {c.time} · {c.coach}
                        </p>
                        <button type="button" onClick={() => toggle(c.id)} className="mt-2 min-h-9 rounded-full border border-suma-navy/20 px-3 text-xs font-bold">
                          Cancelar reserva
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </section>

            <section {...panelProps("membresia")} className="px-4 pb-4 pt-12 motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
              <p className="px-1 font-display text-2xl font-extrabold">Membresía</p>
              <div className="relative mt-3 overflow-hidden rounded-[1.5rem] bg-suma-purple p-5 text-suma-cream">
                <span aria-hidden="true" className="blob absolute -right-8 -top-8 size-28 bg-suma-pink/70" />
                <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-suma-cream/80">Plan mensual · ejemplo</p>
                <p className="relative mt-2 font-display text-4xl font-extrabold">{remaining}</p>
                <p className="relative text-sm text-suma-cream/85">clases disponibles de 8</p>
                <div className="relative mt-4 h-2 rounded-full bg-suma-cream/20">
                  <div className="h-full rounded-full bg-suma-orange transition-[width] duration-[var(--dur-panel)]" style={{ width: `${(remaining / 8) * 100}%` }} />
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="rounded-2xl bg-suma-cream-deep p-3">Vigencia: hasta fin de mes</li>
                <li className="rounded-2xl bg-suma-cream-deep p-3">Beneficio: 1 invitado al mes</li>
              </ul>
            </section>
          </div>

          <div {...listProps} aria-label="Pantallas de la app" className="grid grid-cols-4 border-t border-suma-line bg-suma-cream px-2 pb-4 pt-1.5">
            {screens.map((sc) => (
              <button
                key={sc}
                {...tabProps(sc)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[0.65rem] font-bold transition-colors",
                  active === sc ? "text-suma-pink-ink" : "text-suma-navy/55 hover:text-suma-navy",
                )}
              >
                <Icon name={sc} />
                {screenLabels[sc]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("space-y-4", light ? "text-suma-cream" : "text-suma-navy")}>
        <p className={cn("text-eyebrow", light ? "text-suma-orange" : "text-suma-pink-ink")}>Pantalla: {screenLabels[active]}</p>
        <p className="font-display text-3xl font-bold leading-tight" aria-live="polite">
          {screenNotes[active]}
        </p>
        <p className={cn(light ? "text-suma-cream/75" : "text-suma-navy/70")}>
          Reserva una clase en “Clases” y observa cómo cambian tus reservas y tu membresía.
        </p>
        <DemoNotice tone={light ? "light" : "dark"} />
      </div>
    </div>
  );
}
