"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { roles, studioDisplayName } from "@/lib/studio-os/catalog";
import { setRole } from "@/lib/studio-os/engine";
import { visibleViews } from "@/lib/studio-os/selectors";
import type { DemoState, Result, RoleId, ViewId } from "@/lib/studio-os/types";
import { StudioProvider } from "./context";
import { osFontClasses } from "./fonts";
import { Icon, type IconName } from "./icons";
import { Button, ConfirmButton, cx, focusRing, themeStyle } from "./ui";
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

export const viewMeta: Record<ViewId, { label: string; icon: IconName; hint: string }> = {
  inicio: { label: "Inicio", icon: "home", hint: "Lo que pasa hoy y lo que requiere tu atención." },
  agenda: { label: "Agenda", icon: "calendar", hint: "Clases, cupos, reservas y asistencia." },
  alumnas: { label: "Alumnas", icon: "users", hint: "Fichas, paquetes, notas y seguimiento." },
  membresias: { label: "Membresías", icon: "card", hint: "Paquetes, vencimientos, pausas y renovaciones." },
  ventas: { label: "Ventas", icon: "funnel", hint: "Interesados por etapa y tareas de seguimiento." },
  pagos: { label: "Pagos", icon: "wallet", hint: "Cobros, pendientes e ingresos (simulados)." },
  profesores: { label: "Profesores", icon: "team", hint: "Disponibilidad, clases, sustituciones y honorarios." },
  reportes: { label: "Reportes", icon: "chart", hint: "Ocupación, asistencia, retención e ingresos." },
  automatizaciones: { label: "Automatizaciones", icon: "bolt", hint: "Reglas de ejemplo que se simulan, nunca se envían." },
  portal: { label: "Portal de alumnas", icon: "phone", hint: "Así lo verían tus alumnas." },
  personalizar: { label: "Personalizar", icon: "sliders", hint: "Clases, salas, reglas, roles y marca." },
  resumen: { label: "Así quedaría", icon: "doc", hint: "Resumen de tu sistema para pedir una propuesta." },
};
const groups: { label: string; views: ViewId[] }[] = [
  { label: "Operación", views: ["inicio", "agenda", "alumnas", "membresias"] },
  { label: "Negocio", views: ["ventas", "pagos", "profesores", "reportes", "automatizaciones"] },
  { label: "Tu sistema", views: ["portal", "personalizar", "resumen"] },
];
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
    <div className="flex min-w-0 items-center gap-2.5">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagen local en memoria
        <img src={logo} alt="" className="size-8 shrink-0 rounded-lg object-contain" />
      ) : (
        <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--os-accent) text-sm font-bold text-white">{name[0]}</span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold leading-tight">{name}</span>
        <span className="block text-[11.5px] leading-tight text-(--os-muted)">Studio OS · demo</span>
      </span>
    </div>
  );
}

function NavLink({ v, current, onGo, compact = false }: { v: ViewId; current: ViewId; onGo: (v: ViewId) => void; compact?: boolean }) {
  return (
    <button type="button" onClick={() => onGo(v)} aria-current={current === v ? "page" : undefined}
      className={cx("flex w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] font-medium transition-colors duration-150", focusRing, compact ? "min-h-12" : "min-h-10",
        current === v ? "bg-(--os-soft) text-(--os-accent-ink)" : "text-(--os-muted) hover:bg-(--os-subtle) hover:text-(--os-ink)")}>
      <Icon name={viewMeta[v].icon} className="size-[18px] shrink-0" />
      {viewMeta[v].label}
    </button>
  );
}

function RoleSelect({ id, state, apply }: { id: string; state: DemoState; apply: Props["apply"] }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-[13px] text-(--os-muted)">
      <span className="whitespace-nowrap">Ver como</span>
      <select id={id} value={state.role} onChange={(e) => apply(setRole(state, e.target.value as RoleId))}
        className={cx("h-9 rounded-lg border border-(--os-line) bg-white px-2 text-[13px] font-semibold text-(--os-ink)", focusRing)}>
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
  const current: ViewId = views.includes(view) ? view : "inicio";
  const name = studioDisplayName(state.config);

  const rootRef = useRef<HTMLDivElement>(null);
  // Mientras el sistema está abierto, el sitio de fondo no recibe foco ni clics.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [...document.querySelectorAll<HTMLElement>("body > header, #contenido, body > footer")];
    background.forEach((el) => el.setAttribute("inert", ""));
    rootRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      background.forEach((el) => el.removeAttribute("inert"));
    };
  }, []);

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
    createPortal(<StudioProvider value={{ state, apply, go, target, logo }}>
      <div ref={rootRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${name} · SUMA Studio OS`} className={cx(osFontClasses, "os-root fixed inset-0 z-[80] flex bg-(--os-canvas) outline-none")} style={themeStyle(state.config.theme)}>
        <aside className="hidden w-64 shrink-0 flex-col border-r border-(--os-line) bg-white lg:flex">
          <div className="px-4 pb-3 pt-5"><Brand name={name} logo={logo} /></div>
          <nav aria-label="Secciones" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
            {groups.map((g) => {
              const items = g.views.filter((v) => views.includes(v));
              if (!items.length) return null;
              return (
                <div key={g.label}>
                  <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-(--os-muted)">{g.label}</p>
                  <div className="space-y-0.5">{items.map((v) => <NavLink key={v} v={v} current={current} onGo={go} />)}</div>
                </div>
              );
            })}
          </nav>
          <div className="space-y-1 border-t border-(--os-line) p-3">
            <ConfirmButton label="Restaurar demostración" confirmLabel="Sí, restaurar" icon="restore" variant="ghost" onConfirm={onRestore} />
            <Button variant="ghost" size="sm" icon="exit" onClick={onExit} className="w-full justify-start">Salir al configurador</Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-(--os-line) bg-white/90 px-4 backdrop-blur lg:h-16 lg:px-8">
            <div className="min-w-0 flex-1 lg:hidden"><Brand name={name} logo={logo} /></div>
            <div className="hidden min-w-0 flex-1 lg:block">
              <p className="text-[12px] font-medium text-(--os-muted)">{name} <span aria-hidden="true">/</span> <span className="text-(--os-ink)">{viewMeta[current].label}</span></p>
              <p className="truncate text-[13px] text-(--os-muted)">{viewMeta[current].hint}</p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-[#FBEFD9] px-2.5 py-1 text-[11.5px] font-semibold text-[#7D5210] sm:inline-flex">
              <Icon name="info" className="size-3.5" /> Datos ficticios
            </span>
            <div className="hidden lg:block"><RoleSelect id="os-role-desktop" state={state} apply={apply} /></div>
            <Button variant="secondary" size="sm" icon="restore" onClick={() => setMoreOpen(true)} className="lg:hidden" aria-label="Restaurar demostración y más opciones">Restaurar</Button>
          </header>

          <main ref={mainRef} id="os-main" className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1240px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
              <p className="mb-1 text-[12px] font-semibold text-(--os-accent-ink) lg:hidden">{viewMeta[current].label}</p>
              <div key={current} className="os-fade">{content}</div>
            </div>
          </main>
        </div>

        <nav aria-label="Secciones principales" className="fixed inset-x-0 bottom-0 z-[85] border-t border-(--os-line) bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${mobilePrimary.length + 1}, minmax(0, 1fr))` }}>
            {mobilePrimary.map((v) => (
              <button key={v} type="button" onClick={() => go(v)} aria-current={current === v ? "page" : undefined}
                className={cx("flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold", focusRing, current === v ? "text-(--os-accent-ink)" : "text-(--os-muted)")}>
                <span className={cx("grid h-7 w-12 place-items-center rounded-full transition-colors duration-150", current === v && "bg-(--os-soft)")}><Icon name={viewMeta[v].icon} className="size-[19px]" /></span>
                {viewMeta[v].label}
              </button>
            ))}
            <button type="button" onClick={() => setMoreOpen(true)} aria-expanded={moreOpen} aria-controls="os-more"
              className={cx("flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold", focusRing, mobileMore.includes(current) ? "text-(--os-accent-ink)" : "text-(--os-muted)")}>
              <span className={cx("grid h-7 w-12 place-items-center rounded-full", mobileMore.includes(current) && "bg-(--os-soft)")}><Icon name="more" className="size-[19px]" /></span>
              Más
            </button>
          </div>
        </nav>

        {moreOpen && (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <button type="button" aria-label="Cerrar menú" className="absolute inset-0 bg-[#1F1C1A]/30" onClick={() => setMoreOpen(false)} />
            <div id="os-more" role="menu" aria-label="Más secciones" className="os-slide absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#DDD5CC]" aria-hidden="true" />
              <div className="mb-3 flex items-center justify-between gap-3"><Brand name={name} logo={logo} /><Button variant="ghost" size="sm" onClick={() => setMoreOpen(false)} aria-label="Cerrar"><Icon name="x" className="size-[18px]" /></Button></div>
              <div className="space-y-0.5">{mobileMore.map((v) => <NavLink key={v} v={v} current={current} onGo={go} compact />)}</div>
              <div className="mt-4 rounded-2xl bg-(--os-subtle) p-3"><RoleSelect id="os-role-mobile" state={state} apply={apply} /></div>
              <div className="mt-3 grid gap-2">
                <ConfirmButton label="Restaurar demostración" confirmLabel="Sí, restaurar todo" icon="restore" variant="secondary" size="md" onConfirm={() => { setMoreOpen(false); onRestore(); }} />
                <Button variant="ghost" icon="exit" onClick={onExit}>Salir al configurador</Button>
              </div>
            </div>
          </div>
        )}

        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 lg:bottom-6">
          {toasts.map((t) => (
            <div key={t.id} role={t.ok ? "status" : "alert"}
              className={cx("os-slide pointer-events-auto flex max-w-md items-start gap-2.5 rounded-2xl px-4 py-3 text-[13.5px] leading-snug shadow-[0_10px_30px_-10px_rgba(31,28,26,0.35)]",
                t.ok ? "bg-[#1F1C1A] text-white" : "bg-[#962B2B] text-white")}>
              <Icon name={t.ok ? "check" : "alert"} className="mt-0.5 size-4 shrink-0" />
              <span className="min-w-0 flex-1">{t.text}</span>
              <button type="button" onClick={() => dismissToast(t.id)} aria-label="Cerrar aviso" className="-m-1 rounded-md p-1 opacity-70 hover:opacity-100"><Icon name="x" className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </StudioProvider>, document.body)
  );
}
