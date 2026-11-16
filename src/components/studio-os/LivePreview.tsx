"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { studioDisplayName } from "@/lib/studio-os/catalog";
import { sessionTaken } from "@/lib/studio-os/rules";
import { createDemo } from "@/lib/studio-os/seed";
import { className as classLabel, dashboard, finance, instructorName, visibleViews } from "@/lib/studio-os/selectors";
import { fmtDate, fmtLongDay, fmtMoney, fmtPct, fmtTime } from "@/lib/studio-os/time";
import type { DemoState, StudioConfig } from "@/lib/studio-os/types";
import { cap, capabilitiesOf, termsOf, verticalOf } from "@/lib/studio-os/verticals";
import { Monogram } from "./brand";
import { AreaChart } from "./charts";
import { Icon } from "./icons";
import { ease } from "./motion";
import { homeKpis, sessionLines } from "./home";
import { navGroups, viewInfo } from "./nav";
import { cx } from "./ui";

export type PreviewFocus = "brand" | "nav" | "classes" | "capacity" | "plans" | "all";

/** Campos que definen los datos de ejemplo; si cambian, la demo se vuelve a generar. */
export const structuralKey = (c: StudioConfig) => JSON.stringify([c.vertical, c.offerings, c.instructors, c.rooms, c.capacity, c.plans]);

/** Genera el estado de la demo con el motor real; solo se recalcula cuando cambia la estructura. */
export function usePreviewState(config: StudioConfig, now: string): DemoState {
  const key = structuralKey(config);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` resume los campos estructurales de `config`
  const base = useMemo(() => createDemo(config, now), [key, now]);
  return useMemo(() => ({ ...base, config: { ...base.config, name: config.name, theme: config.theme, modules: config.modules } }), [base, config.name, config.theme, config.modules]);
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function Region({ id, focus, children, className, label }: { id: Exclude<PreviewFocus, "all">; focus: PreviewFocus; children: ReactNode; className?: string; label: string }) {
  const on = focus === id;
  const dim = focus !== "all" && !on;
  return (
    <div className={cx("relative transition-[opacity,filter] duration-500", dim && "opacity-40 saturate-[0.6]", className)}>
      {children}
      <AnimatePresence>
        {on && (
          <motion.div key="spot" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }}
            className="pointer-events-none absolute -inset-2.5 rounded-[22px] ring-2 ring-(--os-accent) shadow-[0_0_0_10px_color-mix(in_srgb,var(--os-accent)_10%,transparent)]">
            <span className="absolute -top-3 left-4 rounded-full bg-(--os-accent) px-3 py-1 text-[12px] font-semibold text-white shadow-md">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Vista previa del CRM a tamaño real (lienzo fijo) escalada al contenedor:
 * es el mismo sistema que verá la persona, con los datos que genera el motor.
 */
export function LivePreview({ state, logo, focus = "all", compact = false }: { state: DemoState; logo: string | null; focus?: PreviewFocus; compact?: boolean }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const canvas = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState(0);
  // El alto del lienzo depende de los módulos activos: se mide para no recortar nada.
  useEffect(() => {
    const el = canvas.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setNatural(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const W = compact ? 900 : 1180;
  const H = compact ? 600 : 780;
  const scale = width ? width / W : 0.5;
  const name = studioDisplayName(state.config);
  const t = termsOf(state.config);
  const caps = capabilitiesOf(state.config);
  const vertical = verticalOf(state.config);
  const kpis = homeKpis(state).slice(0, 4);
  const d = dashboard(state);
  const views = visibleViews(state);
  const has = (m: string) => state.config.modules.includes(m as never);
  const f = has("pagos") ? finance(state) : null;
  const plans = state.plans.filter((p) => p.enabled);
  const today = d.today.slice(0, compact ? 3 : 5);
  const next = d.nextSession;

  return (
    <div ref={ref} aria-hidden="true" className="relative w-full overflow-hidden rounded-[18px] bg-(--os-canvas) shadow-[0_0_0_1px_rgba(29,27,25,0.06),0_40px_80px_-40px_rgba(29,27,25,0.45),0_12px_24px_-16px_rgba(29,27,25,0.2)]" style={{ height: (natural || H) * scale }}>
      <div ref={canvas} className="absolute left-0 top-0 flex origin-top-left select-none" style={{ width: W, minHeight: H, transform: `scale(${scale})` }}>
        {/* Barra lateral */}
        <aside className={cx("flex shrink-0 flex-col border-r border-(--os-line) bg-(--os-paper) p-5", compact ? "w-[210px]" : "w-[236px]")}>
          <Region id="brand" focus={focus} className="rounded-2xl" label="Tu marca">
            <div className="flex items-center gap-3 rounded-2xl p-1">
              <Monogram name={name} logo={logo} size={40} />
              <div className="min-w-0">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p key={name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}
                    className="os-display truncate text-[18px] leading-tight">{name}</motion.p>
                </AnimatePresence>
                <p className="truncate text-[11.5px] text-(--os-muted)">{vertical.name}</p>
              </div>
            </div>
          </Region>
          <Region id="nav" focus={focus} className="mt-6 rounded-2xl" label="Tu menú">
            <div className="space-y-4 p-1">
              {navGroups.map((g) => {
                const items = g.views.filter((v) => views.includes(v) && v !== "resumen" && v !== "personalizar");
                if (!items.length) return null;
                return (
                  <div key={g.label}>
                    <p className="os-eyebrow mb-1.5 px-2.5 !text-[10px] text-(--os-faint)">{g.label}</p>
                    <AnimatePresence initial={false}>
                      {items.map((v) => (
                        <motion.div key={v} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 36 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease }}
                          className={cx("flex items-center gap-2.5 overflow-hidden rounded-xl px-2.5 text-[14px] font-medium", v === "inicio" ? "bg-(--os-soft) text-(--os-accent-ink)" : "text-(--os-ink-2)")}>
                          <Icon name={viewInfo(v, state.config).icon} className="size-[17px] shrink-0" />
                          <span className="truncate">{viewInfo(v, state.config).label}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Region>
          <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-(--os-line) p-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-(--os-subtle) text-(--os-ink-2)"><Icon name="user" className="size-4" /></span>
            <span className="text-[12.5px]"><span className="block font-semibold">Dirección</span><span className="text-(--os-muted)">Acceso total</span></span>
          </div>
        </aside>

        {/* Contenido */}
        <div className="min-w-0 flex-1 p-8">
          <div className="flex items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="os-eyebrow text-(--os-accent-ink)">{fmtLongDay(state.now)}</p>
              <p className="os-display mt-2 truncate text-[38px] leading-none">Buenos días, <em className="text-(--os-accent-ink)">{name}</em></p>
            </div>
            <span className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-(--os-accent) px-5 text-[14px] font-semibold text-white shadow-[0_8px_20px_-10px_var(--os-accent)]"><Icon name="plus" className="size-4" /> {caps.appointments ? `Nueva ${t.booking.one}` : "Reservar clase"}</span>
          </div>

          <Region id="capacity" focus={focus} className="mt-7 rounded-[20px]" label={`Tu ${t.business}`}>
            <div className="grid grid-cols-4 divide-x divide-(--os-line) rounded-[20px] border border-(--os-line) bg-(--os-paper)">
              {[...kpis.slice(0, 3), { label: cap(t.staff.many), value: String(state.instructors.length), hint: `${state.rooms.length} ${state.rooms.length === 1 ? t.space.one : t.space.many}` }].map((show) => {
                return (
                  <div key={show.label} className="px-5 py-4">
                    <p className="truncate text-[12.5px] text-(--os-muted)">{show.label}</p>
                    <p className="os-num mt-2 text-[30px] font-medium leading-none">{show.value}</p>
                    <p className="mt-1.5 truncate text-[12px] text-(--os-faint)">{show.hint}</p>
                  </div>
                );
              })}
            </div>
          </Region>

          <div className="mt-6 grid grid-cols-[1.45fr_1fr] gap-5">
            <Region id="classes" focus={focus} className="rounded-[20px]" label={`Tus ${t.offering.many}`}>
              <div className="rounded-[20px] border border-(--os-line) bg-(--os-paper) p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-semibold">Hoy en tu {t.business}</p>
                  <p className="text-[12.5px] text-(--os-muted)">{d.today.length} {caps.appointments && !caps.groups ? t.booking.many : "horarios"}</p>
                </div>
                <ul className="mt-3 space-y-1">
                  <AnimatePresence initial={false} mode="popLayout">
                    {(today.length ? today : state.sessions.slice(0, 4)).map((s) => {
                      const line = sessionLines(state, s);
                      return (
                        <motion.li key={s.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}
                          className="grid grid-cols-[52px_minmax(0,1fr)_96px] items-center gap-3 rounded-xl px-2 py-2.5 odd:bg-(--os-ivory)/60">
                          <span className="os-num text-[14px] font-semibold">{fmtTime(s.start)}</span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5 truncate text-[14px] font-semibold">{line.title}{s.kind === "grupal" && caps.appointments && <span className="rounded-full bg-(--os-soft) px-1.5 text-[10px] text-(--os-accent-ink)">Grupo</span>}</span>
                            <span className="block truncate text-[12px] text-(--os-muted)">{line.detail}</span>
                          </span>
                          {line.right.kind === "cupo" ? (
                            <span>
                              <span className="os-num block text-right text-[12px] text-(--os-muted)">{line.right.label}</span>
                              <span className="mt-1 block h-[5px] overflow-hidden rounded-full bg-(--os-subtle)"><span className="block h-full rounded-full bg-(--os-accent)" style={{ width: `${Math.min(100, (line.right.taken / line.right.capacity) * 100)}%` }} /></span>
                            </span>
                          ) : (
                            <span className="os-num text-right text-[13px] font-semibold">{line.right.label}</span>
                          )}
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </div>
            </Region>

            <div className="space-y-5">
              {caps.appointments && !caps.groups ? (
                <div className="relative overflow-hidden rounded-[20px] bg-(--os-accent) p-5 text-white">
                  <span aria-hidden="true" className="absolute -right-10 -top-10 size-36 rounded-full bg-white/10" />
                  <p className="os-eyebrow text-white/75">{cap(t.space.many)} hoy</p>
                  <p className="os-num os-display mt-2 text-[30px] leading-none">{fmtPct(d.roomOccupancy)}</p>
                  <ul className="mt-3 space-y-1.5">
                    {d.roomUse.slice(0, 3).map((r) => (
                      <li key={r.room.id} className="grid grid-cols-[1fr_70px] items-center gap-3 text-[12px]">
                        <span className="truncate text-white/85">{r.room.name}</span>
                        <span className="h-1.5 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full bg-white" style={{ width: `${Math.round(r.rate * 100)}%` }} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : next && (
                <div className="relative overflow-hidden rounded-[20px] bg-(--os-accent) p-5 text-white">
                  <span aria-hidden="true" className="absolute -right-10 -top-10 size-36 rounded-full bg-white/10" />
                  <p className="os-eyebrow text-white/75">{next.kind === "cita" ? `Próxima ${t.booking.one}` : "Próxima clase"}</p>
                  <p className="os-display mt-2 text-[24px] leading-tight">{classLabel(state, next)}</p>
                  <p className="mt-1 text-[13px] text-white/80">{fmtTime(next.start)} · {instructorName(state, next.instructorId)}</p>
                  {next.kind === "grupal" && <p className="mt-3 text-[13px]"><strong className="os-num">{sessionTaken(state, next.id)}</strong> de {next.capacity} lugares</p>}
                </div>
              )}
              <Region id="plans" focus={focus} className="rounded-[20px]" label={`Tus ${t.plans.toLowerCase()}`}>
                <div className="rounded-[20px] border border-(--os-line) bg-(--os-paper) p-5">
                  <p className="text-[15px] font-semibold">{t.plans}</p>
                  {caps.appointments && <p className="mt-1 text-[12px] text-(--os-muted)">Pago por {t.offering.one} incluido</p>}
                  <ul className="mt-3 space-y-2">
                    <AnimatePresence initial={false} mode="popLayout">
                      {plans.slice(0, compact ? 2 : 3).map((p) => (
                        <motion.li key={p.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }}
                          className="flex items-center justify-between gap-3 rounded-xl border border-(--os-line) px-3 py-2.5">
                          <span className="min-w-0">
                            <span className="block truncate text-[13.5px] font-semibold">{p.name}</span>
                            <span className="text-[12px] text-(--os-muted)">{p.credits === null ? "Ilimitado" : `${p.credits} ${p.credits === 1 ? t.credit.one : t.credit.many}`} · {p.validityDays} días</span>
                          </span>
                          <span className="os-num text-[14px] font-semibold">{fmtMoney(p.price)}</span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                    {plans.length > (compact ? 2 : 3) && <li className="text-[12px] text-(--os-muted)">y {plans.length - (compact ? 2 : 3)} más</li>}
                  </ul>
                </div>
              </Region>
            </div>
          </div>

          {!compact && f && (
            <div className="mt-5 rounded-[20px] border border-(--os-line) bg-(--os-paper) px-5 pb-3 pt-4">
              <div className="flex items-baseline justify-between"><p className="text-[15px] font-semibold">Ingresos · 8 semanas</p><p className="os-num text-[13px] text-(--os-muted)">{fmtMoney(f.collectedMonth)} este mes</p></div>
              <AreaChart height={120} label="Ingresos" format={fmtMoney} points={f.weeks.map((w) => ({ label: fmtDate(w.from), value: w.total }))} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
