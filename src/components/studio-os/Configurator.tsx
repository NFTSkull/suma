"use client";

import { useId, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { moduleIds, modules, planCatalog, planKinds, studioDisplayName, studioTypes, themeIds, themes, withTypeSuggestions } from "@/lib/studio-os/catalog";
import { fmtMoney } from "@/lib/studio-os/time";
import type { ModuleId, PlanKind, StudioConfig, StudioType } from "@/lib/studio-os/types";
import { Icon } from "./icons";
import { Badge, Button, cx, Field, focusRing, inputClass, Switch, themeStyle } from "./ui";

type Props = {
  config: StudioConfig;
  setConfig: Dispatch<SetStateAction<StudioConfig>>;
  step: number;
  setStep: (step: number) => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  onEnter: () => void;
  hasStudio: boolean;
};

const STEPS = [
  "¿Cómo se llama tu estudio?",
  "¿Qué tipo de estudio tienes?",
  "¿Qué estilo te representa?",
  "¿Quieres agregar tu logotipo?",
  "¿Qué clases impartes?",
  "¿Cuántos instructores trabajan contigo?",
  "¿Cuántas salas tiene tu estudio?",
  "¿Cuántas personas caben por clase?",
  "¿Qué paquetes o membresías ofreces?",
  "¿Qué quieres administrar?",
];
const allClasses = Object.values(studioTypes).flatMap((t) => t.classes).filter((c, i, list) => list.findIndex((x) => x.name === c.name) === i);
const typeHints: Record<StudioType, string> = {
  yoga: "Clases grupales en mat, cupos amplios.",
  pilates: "Mat y grupos pequeños.",
  reformer: "Máquinas: cupos exactos por sala.",
  mixto: "Reformer, mat y yoga en un mismo lugar.",
};

export function Configurator({ config, setConfig, step, setStep, logo, setLogo, onEnter, hasStudio }: Props) {
  const [note, setNote] = useState<string | null>(null);
  const update = (patch: Partial<StudioConfig>) => setConfig((c) => ({ ...c, ...patch }));
  const problem =
    step === 1 && !config.name.trim() ? "Escribe un nombre para tu estudio. Puede ser ficticio." :
    step === 5 && !config.classes.length ? "Elige al menos una clase." :
    step === 9 && !config.plans.length ? "Elige al menos un paquete o membresía." :
    step === 10 && !config.modules.length ? "Activa al menos un módulo." : null;

  return (
    <div className="os-root" style={themeStyle(config.theme)}>
      <div className="mb-7" aria-label="Progreso de configuración">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[13px] font-semibold text-(--os-ink)">Tu estudio, a tu manera</p>
          <span className="text-[12px] tabular-nums text-(--os-muted)">Pregunta {step} de {STEPS.length}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#E6E0D9]" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label="Progreso">
          <div className="h-full rounded-full bg-(--os-accent) transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0 rounded-[1.5rem] border border-(--os-line) bg-white shadow-[0_1px_2px_rgba(31,28,26,0.04)]">
          <div className="p-5 sm:p-7">
            <p className="text-[13px] font-semibold text-(--os-accent-ink)">Paso {step} de {STEPS.length}</p>
            <h2 className="os-display mt-2 text-[1.85rem] leading-tight sm:text-[2.25rem]">{STEPS[step - 1]}</h2>
            <p className="mt-2 text-[13px] text-(--os-muted)">Solo una pregunta a la vez. Puedes cambiarlo todo más adelante.</p>
            {(step === 3 || step === 10) && <div className="mt-4 lg:hidden"><MiniPreview config={config} logo={logo} compact /></div>}
            <div key={step} className="os-fade mt-6">
              {step <= 4 && <StepStudio activeStep={step} config={config} update={update} logo={logo} setLogo={setLogo} onTypeChange={(type) => {
                setConfig((c) => withTypeSuggestions(c, type));
                setNote(`Actualizamos las sugerencias del paso 2 para ${studioTypes[type].name}. Puedes cambiarlas.`);
              }} note={note} />}
              {step >= 5 && step <= 9 && <StepWork activeStep={step} config={config} update={update} />}
              {step === 10 && <StepModules config={config} update={update} />}
            </div>
          </div>
          <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-b-[1.5rem] border-t border-(--os-line) bg-white/95 px-5 py-3 backdrop-blur sm:px-7">
            {step > 1 ? <Button variant="ghost" icon="chevronLeft" onClick={() => setStep(step - 1)}>Atrás</Button> : <span className="text-[13px] text-(--os-muted)">Todo es editable después.</span>}
            <div className="flex items-center gap-3">
              {problem && <p role="alert" className="text-[13px] font-medium text-[#962B2B] max-sm:hidden">{problem}</p>}
              {step < STEPS.length ? (
                <Button variant="primary" iconRight="arrowRight" disabled={!!problem} onClick={() => setStep(step + 1)}>{step === 4 ? "Continuar sin logotipo" : "Continuar"}</Button>
              ) : (
                <Button variant="primary" size="lg" iconRight="arrowRight" disabled={!!problem} onClick={onEnter}>{hasStudio ? "Volver a mi estudio" : "Entrar a mi estudio"}</Button>
              )}
            </div>
          </div>
          {problem && <p role="alert" className="px-5 pb-3 text-[13px] font-medium text-[#962B2B] sm:hidden">{problem}</p>}
        </div>
        <aside aria-label="Vista previa" className="sticky top-24 max-lg:hidden">
          <MiniPreview config={config} logo={logo} />
          <p className="mt-3 text-center text-[12.5px] text-(--os-muted)">Vista previa en vivo · datos ficticios</p>
        </aside>
      </div>
    </div>
  );
}

function StepStudio({ activeStep, config, update, logo, setLogo, onTypeChange, note }: {
  activeStep: number; config: StudioConfig; update: (p: Partial<StudioConfig>) => void; logo: string | null; setLogo: (l: string | null) => void;
  onTypeChange: (t: StudioType) => void; note: string | null;
}) {
  const id = useId();
  const [logoError, setLogoError] = useState<string | null>(null);
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) return setLogoError("Usa una imagen PNG, JPG, WebP o SVG.");
    if (file.size > 1_500_000) return setLogoError("Usa una imagen de menos de 1.5 MB.");
    setLogoError(null);
    const reader = new FileReader();
    reader.onload = () => setLogo(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-7">
      <div hidden={activeStep !== 1}>
      <Field label="Nombre de tu estudio" htmlFor={`${id}-name`} hint="Puedes usar un nombre ficticio; así aparecerá en tu CRM.">
        <input id={`${id}-name`} className={inputClass} maxLength={40} value={config.name} placeholder="Ej. Casa Aurora" autoComplete="off"
          autoFocus={activeStep === 1} onChange={(e) => update({ name: e.target.value })} />
      </Field>
      </div>

      <fieldset hidden={activeStep !== 2}>
        <legend className="mb-2 text-[13px] font-semibold">Tipo de estudio</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(studioTypes) as StudioType[]).map((t) => (
            <label key={t} className={cx("relative flex cursor-pointer flex-col rounded-xl border p-3 transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--os-accent)",
              config.type === t ? "border-(--os-accent) bg-(--os-soft)" : "border-(--os-line) hover:border-[#D6CEC4]")}>
              <input type="radio" name={`${id}-type`} value={t} checked={config.type === t} onChange={() => onTypeChange(t)} className="sr-only" />
              <span className="text-[15px] font-semibold">{studioTypes[t].name}</span>
              <span className="mt-1 text-[12.5px] leading-snug text-(--os-muted)">{typeHints[t]}</span>
            </label>
          ))}
        </div>
        {note && <p role="status" className="os-fade mt-2 text-[13px] text-(--os-accent-ink)">{note}</p>}
      </fieldset>

      <fieldset hidden={activeStep !== 3}>
        <legend className="mb-2 text-[13px] font-semibold">Colores de tu sistema</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {themeIds.map((t) => {
            const th = themes[t];
            return (
              <label key={t} className={cx("cursor-pointer rounded-xl border p-2.5 transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--os-accent)",
                config.theme === t ? "border-(--os-accent) ring-1 ring-(--os-accent)" : "border-(--os-line) hover:border-[#D6CEC4]")}>
                <input type="radio" name={`${id}-theme`} value={t} checked={config.theme === t} onChange={() => update({ theme: t })} className="sr-only" />
                <span aria-hidden="true" className="flex h-12 overflow-hidden rounded-lg border border-black/5" style={{ background: th.canvas }}>
                  <span className="w-1/3" style={{ background: th.accent }} />
                  <span className="flex flex-1 flex-col justify-center gap-1 px-2">
                    <span className="h-1.5 w-3/4 rounded-full" style={{ background: th.soft }} />
                    <span className="h-1.5 w-1/2 rounded-full" style={{ background: th.accent, opacity: 0.55 }} />
                  </span>
                </span>
                <span className="mt-2 flex items-center justify-between text-[13px] font-semibold">
                  {th.name}
                  {config.theme === t && <Icon name="check" className="size-4 text-(--os-accent-ink)" />}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div hidden={activeStep !== 4}>
        <p className="mb-2 text-[13px] font-semibold">Logotipo (opcional)</p>
        <div className="flex flex-wrap items-center gap-3">
          {logo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- imagen local en memoria, sin optimización de servidor */}
              <img src={logo} alt="Tu logotipo" className="size-14 rounded-xl border border-(--os-line) bg-white object-contain p-1" />
              <Button size="sm" variant="ghost" icon="x" onClick={() => setLogo(null)}>Quitar</Button>
            </>
          ) : (
            <label className={cx("inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#CFC6BC] px-4 text-sm font-semibold hover:bg-(--os-subtle) has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-(--os-accent)")}>
              <Icon name="upload" className="size-[18px]" /> Subir imagen
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={onFile} className="sr-only" />
            </label>
          )}
          <p className="text-[12.5px] text-(--os-muted)">Se queda solo en este navegador; no se sube a ningún servidor.</p>
        </div>
        {logoError && <p role="alert" className="mt-2 text-[13px] text-[#962B2B]">{logoError}</p>}
      </div>
    </div>
  );
}

function Stepper({ label, value, min, max, onChange, hint }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void; hint?: string }) {
  return (
    <div role="group" aria-label={label} className="rounded-xl border border-(--os-line) p-3">
      <p className="text-[13px] font-semibold">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <Button size="sm" variant="secondary" aria-label={`Menos ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="w-10 px-0">−</Button>
        <output aria-live="polite" className="text-xl font-semibold tabular-nums">{value}</output>
        <Button size="sm" variant="secondary" aria-label={`Más ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="w-10 px-0">+</Button>
      </div>
      {hint && <p className="mt-1.5 text-[12px] text-(--os-muted)">{hint}</p>}
    </div>
  );
}

function StepWork({ activeStep, config, update }: { activeStep: number; config: StudioConfig; update: (p: Partial<StudioConfig>) => void }) {
  const id = useId();
  const [custom, setCustom] = useState("");
  const [minutes, setMinutes] = useState(50);
  const suggested = new Set(studioTypes[config.type].classes.map((c) => c.name));
  const selected = new Set(config.classes.map((c) => c.name));
  const options = [...allClasses, ...config.classes.filter((c) => !allClasses.some((x) => x.name === c.name))];
  const toggle = (c: { name: string; minutes: number }) =>
    update({ classes: selected.has(c.name) ? config.classes.filter((x) => x.name !== c.name) : [...config.classes, c] });
  const addCustom = () => {
    const name = custom.trim().slice(0, 32);
    if (!name || selected.has(name)) return;
    update({ classes: [...config.classes, { name, minutes }] });
    setCustom("");
  };
  const togglePlan = (p: PlanKind) => update({ plans: config.plans.includes(p) ? config.plans.filter((x) => x !== p) : planKinds.filter((k) => k === p || config.plans.includes(k)) });

  return (
    <div className="space-y-7">
      {activeStep === 5 && <p className="flex items-start gap-2 rounded-xl bg-(--os-soft) p-3 text-[13px] leading-snug text-(--os-accent-ink)">
        <Icon name="sparkle" className="mt-0.5 size-4 shrink-0" />
        Preseleccionamos sugerencias para un estudio de {studioTypes[config.type].name.toLowerCase()}. Son editables; los horarios los ajustas después en la agenda.
      </p>}
      <fieldset hidden={activeStep !== 5}>
        <legend className="mb-2 text-[13px] font-semibold">Clases que impartes</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((c) => (
            <button key={c.name} type="button" aria-pressed={selected.has(c.name)} onClick={() => toggle(c)}
              className={cx("inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-150", focusRing,
                selected.has(c.name) ? "border-(--os-accent) bg-(--os-soft) text-(--os-accent-ink)" : "border-(--os-line) text-(--os-muted) hover:text-(--os-ink)")}>
              {selected.has(c.name) && <Icon name="check" className="size-3.5" />}
              {c.name} <span className="font-normal opacity-75">{c.minutes} min</span>
              {suggested.has(c.name) && !selected.has(c.name) && <span className="sr-only">(sugerida)</span>}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <label htmlFor={`${id}-custom`} className="sr-only">Otra clase</label>
          <input id={`${id}-custom`} className={cx(inputClass, "max-w-56")} placeholder="Otra clase…" value={custom} maxLength={32}
            onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} />
          <label htmlFor={`${id}-min`} className="sr-only">Duración</label>
          <select id={`${id}-min`} className={cx(inputClass, "w-28")} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
            {[45, 50, 60, 75, 90].map((m) => <option key={m} value={m}>{m} min</option>)}
          </select>
          <Button size="md" icon="plus" onClick={addCustom} disabled={!custom.trim()}>Agregar</Button>
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-2">
        {activeStep === 6 && <Stepper label="Instructores" value={config.instructors} min={1} max={8} onChange={(n) => update({ instructors: n })} />}
        {activeStep === 7 && <Stepper label="Salas" value={config.rooms} min={1} max={4} onChange={(n) => update({ rooms: n })} />}
        {activeStep === 8 && <Stepper label="Cupo por clase" value={config.capacity} min={1} max={40} onChange={(n) => update({ capacity: n })} hint="Promedio; lo ajustas por clase." />}
      </div>

      <fieldset hidden={activeStep !== 9}>
        <legend className="mb-2 text-[13px] font-semibold">Paquetes y membresías que vendes</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {planKinds.map((p) => {
            const plan = planCatalog[p];
            const on = config.plans.includes(p);
            return (
              <label key={p} className={cx("flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-(--os-accent)",
                on ? "border-(--os-accent) bg-(--os-soft)/50" : "border-(--os-line) hover:border-[#D6CEC4]")}>
                <input type="checkbox" checked={on} onChange={() => togglePlan(p)} className="mt-0.5 size-[18px] accent-(--os-accent)" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{plan.name}</span>
                  <span className="block text-[12.5px] text-(--os-muted)">{plan.hint} Ejemplo: {fmtMoney(plan.price)}</span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-2 text-[12.5px] text-(--os-muted)">Precios de ejemplo para tus alumnas; los cambias en Personalizar.</p>
      </fieldset>
    </div>
  );
}

function StepModules({ config, update }: { config: StudioConfig; update: (p: Partial<StudioConfig>) => void }) {
  const toggle = (m: ModuleId) => update({ modules: config.modules.includes(m) ? config.modules.filter((x) => x !== m) : moduleIds.filter((x) => x === m || config.modules.includes(x)) });
  return (
    <div className="space-y-3">
      <p className="text-[14px] text-(--os-muted)">Activa lo que quieres administrar. Lo que apagues no aparecerá en tu sistema; puedes cambiarlo cuando quieras.</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {moduleIds.map((m) => (
          <li key={m} className={cx("rounded-xl border p-4 transition-colors duration-150", config.modules.includes(m) ? "border-(--os-accent) bg-(--os-soft)/40" : "border-(--os-line)")}>
            <Switch checked={config.modules.includes(m)} onChange={() => toggle(m)} label={modules[m].name} description={modules[m].purpose} />
            <p className="mt-3 border-t border-(--os-line) pt-3 text-[12.5px] leading-snug text-(--os-muted)">
              <span className="font-semibold text-(--os-ink)">¿Para qué sirve? </span>{modules[m].example}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Vista previa del sistema que cambia al instante con nombre, colores, logotipo y módulos. */
export function MiniPreview({ config, logo, compact = false }: { config: StudioConfig; logo: string | null; compact?: boolean }) {
  const name = studioDisplayName(config);
  const navs = ["Inicio", ...config.modules.slice(0, compact ? 2 : 5).map((m) => modules[m].name.split(" ")[0])];
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-(--os-line) bg-(--os-canvas) shadow-[0_8px_24px_-12px_rgba(31,28,26,0.18)]" style={themeStyle(config.theme)}>
      <div className="flex">
        <div className={cx("flex shrink-0 flex-col gap-1.5 border-r border-(--os-line) bg-white p-3", compact ? "w-28" : "w-36")}>
          <div className="mb-2 flex items-center gap-2">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- imagen local en memoria
              <img src={logo} alt="" className="size-6 rounded-md object-contain" />
            ) : (
              <span className="grid size-6 place-items-center rounded-md bg-(--os-accent) text-[10px] font-bold text-white">{name[0]}</span>
            )}
            <span className="truncate text-[11px] font-semibold">{name}</span>
          </div>
          {navs.map((n, i) => (
            <span key={n + i} className={cx("truncate rounded-md px-2 py-1 text-[10.5px] font-medium", i === 0 ? "bg-(--os-soft) text-(--os-accent-ink)" : "text-(--os-muted)")}>{n}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1 p-3">
          <p className="os-display truncate text-[13px]">Hoy en {name}</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {["Clases hoy", "Reservas"].map((label, i) => (
              <div key={label} className="rounded-lg border border-(--os-line) bg-white p-2">
                <p className="text-[9.5px] text-(--os-muted)">{label}</p>
                <p className="text-[15px] font-semibold tabular-nums">{i ? config.capacity * 3 : 4}</p>
              </div>
            ))}
          </div>
          {!compact && (
            <div className="mt-2 space-y-1.5 rounded-lg border border-(--os-line) bg-white p-2">
              {config.classes.slice(0, 3).map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-[9.5px] tabular-nums text-(--os-muted)">{["07:00", "09:00", "18:00"][i]}</span>
                  <span className="min-w-0 flex-1 truncate text-[10.5px] font-medium">{c.name}</span>
                  <span className="h-1 w-10 overflow-hidden rounded-full bg-[#ECE7E1]"><span className="block h-full bg-(--os-accent)" style={{ width: `${[80, 55, 100][i]}%` }} /></span>
                </div>
              ))}
            </div>
          )}
          <span className="mt-2 inline-flex rounded-md bg-(--os-accent) px-2 py-1 text-[10px] font-semibold text-white">Reservar clase</span>
          {!compact && <Badge tone="accent" className="ml-1.5 !text-[9.5px]">Datos ficticios</Badge>}
        </div>
      </div>
    </div>
  );
}
