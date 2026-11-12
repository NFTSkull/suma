"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { roles, studioDisplayName } from "@/lib/studio-os/catalog";
import { setRole } from "@/lib/studio-os/engine";
import { visibleViews } from "@/lib/studio-os/selectors";
import { cap, fmtLongDay } from "@/lib/studio-os/time";
import type { DemoState, Result, RoleId, ViewId } from "@/lib/studio-os/types";
import { Monogram } from "./brand";
import { StudioProvider } from "./context";
import { Icon } from "./icons";
import { ease, spring } from "./motion";
import { navGroups, viewMeta } from "./nav";
import { Badge, Button, ConfirmButton, cx, focusRing } from "./ui";
import { Agenda } from "./views/Agenda";
import { Alumnas } from "./views/Alumnas";
import { Automatizaciones } from "./views/Automatizaciones";
import { Inicio } from "./views/Inicio";
import { Membresias } from "./views/Membresias";
import { Pagos } from "./views/Pagos";
import { Personalizar } from "./views/Personalizar";
import { Portal } from "./views/Portal";
import { Profesores } from "./views/Profesores";
import { Reportes } from "./views/Reportes";
import { Resumen } from "./views/Resumen";
import { Ventas } from "./views/Ventas";

export { viewMeta };
const PRIMARY_MOBILE: ViewId[] = ["inicio", "agenda", "alumnas", "membresias", "ventas", "pagos"];

type Props = {
  state: DemoState;
  apply: (r: Result, options?: { quiet?: boolean }) => boolean;
  logo: string | null;
  onRestore: () => void;
  onExit: () => void;
  toasts: { id: number; ok: boolean; text: string }[];
  dismissToast: (id: number) => void;
};

function Brand({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Monogram name={name} logo={logo} size={38} />
      <span className="min-w-0">
        <span className="os-display block truncate text-[17px] leading-tight">{name}</span>
        <span className="block text-[11.5px] leading-tight text-(--os-muted)">Studio OS</span>
      </span>
    </div>
  );
}

function NavLink({ v, current, onGo, compact = false }: { v: ViewId; current: ViewId; onGo: (v: ViewId) => void; compact?: boolean }) {
  const active = current === v;
  return (
    <button type="button" onClick={() => onGo(v)} aria-current={active ? "page" : undefined}
      className={cx("relative flex w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] font-medium transition-colors duration-200", focusRing, compact ? "min-h-12" : "min-h-10",
        active ? "text-(--os-ink)" : "text-(--os-muted) hover:text-(--os-ink)")}>
      {active && !compact && <motion.span layoutId="os-nav-active" transition={spring.snappy} className="absolute inset-0 rounded-xl bg-(--os-paper) shadow-[0_1px_2px_rgba(29,27,25,0.06),0_0_0_1px_rgba(29,27,25,0.05)]" />}
      {active && compact && <span className="absolute inset-0 rounded-xl bg-(--os-soft)" />}
      <Icon name={viewMeta[v].icon} className={cx("relative size-[18px] shrink-0", active && "text-(--os-accent)")} />
      <span className="relative">{viewMeta[v].label}</span>
    </button>
  );
}

function RoleSelect({ id, state, apply }: { id: string; state: DemoState; apply: Props["apply"] }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-2 text-[12.5px] text-(--os-muted)">
      <span className="whitespace-nowrap">Ver como</span>
      <select id={id} value={state.role} onChange={(e) => apply(setRole(state, e.target.value as RoleId))}
        className={cx("h-9 min-w-0 rounded-full border border-(--os-line) bg-(--os-paper) pl-3 pr-2 text-[13px] font-semibold text-(--os-ink)", focusRing)}>
        {(Object.keys(roles) as RoleId[]).map((r) => <option key={r} value={r}>{roles[r].name}</option>)}
      </select>
    </label>
  );
}

export function AppShell({ state, apply, logo, onRestore, onExit, toasts, dismissToast }: Props) {
  const views = visibleViews(state);
  const [view, setView] = useState<ViewId>("inicio");
  const [target, setTarget] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const current: ViewId = views.includes(view) ? view : "inicio";
  const name = studioDisplayName(state.config);

  useEffect(() => { rootRef.current?.focus({ preventScroll: true }); }, []);

  const go = (next: ViewId, nextTarget?: string) => {
    setView(next);
    setTarget(nextTarget ?? null);
    setMoreOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  };
  const mobilePrimary = PRIMARY_MOBILE.filter((v) => views.includes(v)).slice(0, 4);
  const mobileMore = views.filter((v) => !mobilePrimary.includes(v));

  let content: ReactNode = null;
  switch (current) {
    case "inicio": content = <Inicio />; break;
    case "agenda": content = <Agenda />; break;
    case "alumnas": content = <Alumnas />; break;
    case "membresias": content = <Membresias />; break;
    case "ventas": content = <Ventas />; break;
    case "pagos": content = <Pagos />; break;
    case "profesores": content = <Profesores />; break;
    case "reportes": content = <Reportes />; break;
    case "automatizaciones": content = <Automatizaciones />; break;
    case "portal": content = <Portal />; break;
    case "personalizar": content = <Personalizar />; break;
    case "resumen": content = <Resumen />; break;
  }

  return (
    <StudioProvider value={{ state, apply, go, target, logo }}>
      <div ref={rootRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${name} · SUMA Studio OS`} className="flex h-full bg-(--os-canvas) outline-none">
        <aside className="hidden w-[264px] shrink-0 flex-col border-r border-(--os-line) bg-(--os-ivory) lg:flex">
          <div className="px-5 pb-4 pt-6"><Brand name={name} logo={logo} /></div>
          <nav aria-label="Secciones" className="os-scroll-y flex-1 space-y-6 overflow-y-auto px-3 pb-4 pt-2">
            {navGroups.map((g) => {
              const items = g.views.filter((v) => views.includes(v));
              if (!items.length) return null;
              return (
                <div key={g.label}>
                  <p className="os-eyebrow px-3 pb-2 !text-[10px] text-(--os-faint)">{g.label}</p>
                  <div className="space-y-0.5">{items.map((v) => <NavLink key={v} v={v} current={current} onGo={go} />)}</div>
                </div>
              );
            })}
          </nav>
          <div className="space-y-2 border-t border-(--os-line) p-4">
            <RoleSelect id="os-role-desktop" state={state} apply={apply} />
            <div className="flex flex-wrap items-center gap-1">
              <ConfirmButton label="Restaurar demostración" confirmLabel="Sí, restaurar" icon="restore" variant="ghost" className="!px-2.5" onConfirm={onRestore} />
            </div>
            <Button variant="ghost" size="sm" icon="exit" onClick={onExit} className="w-full justify-start !px-2.5">Salir al configurador</Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-(--os-line) bg-(--os-canvas)/85 px-4 backdrop-blur-md lg:h-16 lg:px-10">
            <div className="min-w-0 flex-1 lg:hidden"><Brand name={name} logo={logo} /></div>
            <nav aria-label="Ruta" className="hidden min-w-0 flex-1 items-center gap-2 text-[13px] lg:flex">
              <span className="text-(--os-muted)">{name}</span>
              <Icon name="chevronRight" className="size-3.5 text-(--os-faint)" />
              <span className="font-semibold text-(--os-ink)">{viewMeta[current].label}</span>
              <span className="ml-3 hidden truncate text-(--os-faint) xl:inline">{viewMeta[current].hint}</span>
            </nav>
            <span className="hidden text-[12.5px] text-(--os-muted) md:inline">{cap(fmtLongDay(state.now))}</span>
            <Badge tone="warn" className="max-sm:hidden">Datos ficticios</Badge>
            {views.includes("resumen") && current !== "resumen" && (
              <Button variant="dark" size="sm" iconRight="arrowUpRight" onClick={() => go("resumen")} className="max-lg:hidden">Así quedaría</Button>
            )}
            <Button variant="secondary" size="sm" icon="more" onClick={() => setMoreOpen(true)} className="lg:hidden" aria-label="Restaurar demostración y más opciones">Más</Button>
          </header>

          <main ref={mainRef} id="os-main" className="os-scroll-y min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1320px] px-4 pb-32 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.32, ease }}>
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Barra inferior flotante en móvil */}
        <nav aria-label="Secciones principales" className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[85] rounded-[22px] border border-(--os-line) bg-(--os-paper)/90 p-1 shadow-[0_20px_40px_-20px_rgba(29,27,25,0.35)] backdrop-blur-xl lg:hidden">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${mobilePrimary.length + 1}, minmax(0, 1fr))` }}>
            {[...mobilePrimary, "more" as const].map((v) => {
              const isMore = v === "more";
              const active = isMore ? mobileMore.includes(current) : current === v;
              return (
                <button key={v} type="button" onClick={() => (isMore ? setMoreOpen(true) : go(v))} aria-current={!isMore && active ? "page" : undefined}
                  {...(isMore ? { "aria-expanded": moreOpen, "aria-controls": "os-more" } : {})}
                  className={cx("relative flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-[18px] text-[10.5px] font-semibold transition-colors", focusRing, active ? "text-(--os-accent-ink)" : "text-(--os-muted)")}>
                  {active && <motion.span layoutId="os-tab-active" transition={spring.snappy} className="absolute inset-0 rounded-[18px] bg-(--os-soft)" />}
                  <Icon name={isMore ? "more" : viewMeta[v].icon} className="relative size-[19px]" />
                  <span className="relative">{isMore ? "Más" : viewMeta[v].label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <AnimatePresence>
          {moreOpen && (
            <div className="fixed inset-0 z-[90] lg:hidden">
              <motion.button type="button" aria-label="Cerrar menú" className="absolute inset-0 bg-(--os-night)/35 backdrop-blur-[2px]" onClick={() => setMoreOpen(false)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <motion.div id="os-more" role="menu" aria-label="Más secciones" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={spring.soft}
                className="os-scroll-y absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[28px] bg-(--os-paper) p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-(--os-line-strong)" aria-hidden="true" />
                <div className="mb-3 flex items-center justify-between gap-3"><Brand name={name} logo={logo} /><Button variant="ghost" size="sm" onClick={() => setMoreOpen(false)} aria-label="Cerrar"><Icon name="x" className="size-[18px]" /></Button></div>
                <div className="space-y-0.5">{mobileMore.map((v) => <NavLink key={v} v={v} current={current} onGo={go} compact />)}</div>
                <div className="mt-4 rounded-2xl bg-(--os-subtle) p-3"><RoleSelect id="os-role-mobile" state={state} apply={apply} /></div>
                <div className="mt-3 grid gap-2">
                  <ConfirmButton label="Restaurar demostración" confirmLabel="Sí, restaurar todo" icon="restore" variant="secondary" size="md" onConfirm={() => { setMoreOpen(false); onRestore(); }} />
                  <Button variant="ghost" icon="exit" onClick={onExit}>Salir al configurador</Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 lg:bottom-6">
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <motion.div key={t.id} layout role={t.ok ? "status" : "alert"} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={spring.soft}
                className={cx("pointer-events-auto flex max-w-md items-start gap-2.5 rounded-2xl px-4 py-3 text-[13.5px] leading-snug shadow-[0_20px_40px_-16px_rgba(29,27,25,0.5)]",
                  t.ok ? "bg-(--os-night) text-(--os-ivory)" : "bg-(--os-danger) text-white")}>
                <span className={cx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", t.ok ? "bg-(--os-accent)" : "bg-white/20")}><Icon name={t.ok ? "check" : "alert"} className="size-3" /></span>
                <span className="min-w-0 flex-1">{t.text}</span>
                <button type="button" onClick={() => dismissToast(t.id)} aria-label="Cerrar aviso" className="-m-1 rounded-md p-1 opacity-60 hover:opacity-100"><Icon name="x" className="size-4" /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </StudioProvider>
  );
}
