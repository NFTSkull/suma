"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type ChangeEvent, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { moduleIds, modules, planCatalog, planKinds, studioDisplayName, studioTypes, themeIds, themes, withTypeSuggestions } from "@/lib/studio-os/catalog";
import { fmtMoney } from "@/lib/studio-os/time";
import type { DemoState, ModuleId, PlanKind, StudioConfig, StudioType, ThemeId } from "@/lib/studio-os/types";
import { Monogram, OsWordmark } from "./brand";
import { Icon } from "./icons";
import { LivePreview, type PreviewFocus } from "./LivePreview";
import { ease, questionVariants, spring } from "./motion";
import { moduleIcon } from "./nav";
import { Button, cx, focusRing } from "./ui";

type Props = {
  config: StudioConfig;
  setConfig: Dispatch<SetStateAction<StudioConfig>>;
  step: number;
  setStep: (step: number) => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  onEnter: () => void;
  onHome: () => void;
  hasStudio: boolean;
  preview: DemoState;
};

type StepDef = { id: string; chapter: string; focus: PreviewFocus; eyebrow: string; title: ReactNode; help: ReactNode };

export const STEPS: StepDef[] = [
  { id: "nombre", chapter: "Identidad", focus: "brand", eyebrow: "Empecemos por lo esencial", title: <>¿Cómo se llama tu <em>estudio</em>?</>, help: "Así lo verán tu equipo y tus alumnas. Puedes cambiarlo cuando quieras." },
  { id: "disciplina", chapter: "Identidad", focus: "classes", eyebrow: "Tu práctica", title: <>¿Qué se practica en tu <em>espacio</em>?</>, help: "Ajustamos clases, cupos y paquetes sugeridos a tu disciplina." },
  { id: "color", chapter: "Identidad", focus: "all", eyebrow: "Identidad visual", title: <>Elige el <em>carácter</em> de tu marca</>, help: "El color guía botones, estados y detalles. Mira cómo responde tu sistema." },
  { id: "logo", chapter: "Identidad", focus: "brand", eyebrow: "Identidad visual", title: <>¿Tienes un <em>logotipo</em>?</>, help: "Es opcional. Si no lo tienes a la mano, usamos un monograma con tu inicial." },
  { id: "clases", chapter: "Operación", focus: "classes", eyebrow: "Tu agenda", title: <>¿Qué clases <em>impartes</em>?</>, help: "Preseleccionamos las más comunes. Toca para quitar o añadir; los horarios se ajustan después." },
  { id: "tamano", chapter: "Operación", focus: "capacity", eyebrow: "Tu espacio", title: <>¿Qué <em>tamaño</em> tiene tu estudio?</>, help: "Elige el que más se parezca. Puedes afinar profesores, salas y lugares." },
  { id: "membresias", chapter: "Negocio", focus: "plans", eyebrow: "Tus ventas", title: <>¿Cómo pagan tus <em>alumnas</em>?</>, help: "Elige los paquetes y membresías que ofreces. Los precios son de ejemplo y se editan después." },
  { id: "modulos", chapter: "Negocio", focus: "nav", eyebrow: "Último paso", title: <>¿Qué quieres <em>controlar</em>?</>, help: "Activa lo que necesitas. El menú de tu sistema se adapta al instante." },
];

export function Configurator({ config, setConfig, step, setStep, logo, setLogo, onEnter, onHome, hasStudio, preview }: Props) {
  const index = Math.min(Math.max(step, 1), STEPS.length) - 1;
  const def = STEPS[index];
  const [dir, setDir] = useState(1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const update = (patch: Partial<StudioConfig>) => setConfig((c) => ({ ...c, ...patch }));
  const last = index === STEPS.length - 1;
  const problem =
    def.id === "clases" && !config.classes.length ? "Elige al menos una clase." :
    def.id === "membresias" && !config.plans.length ? "Elige al menos un paquete o membresía." :
    def.id === "modulos" && !config.modules.length ? "Activa al menos un módulo." : null;

  const goTo = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };
  const next = () => { if (problem) return; if (last) onEnter(); else goTo(index + 2); };

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    headingRef.current?.focus({ preventScroll: true });
  }, [index]);

  return (
    <div className="flex h-dvh flex-col bg-(--os-ivory) lg:flex-row">
      {/* Columna de la pregunta */}
      <section aria-label="Configurador" className="relative flex min-h-0 flex-1 flex-col lg:max-w-[min(46%,640px)] lg:border-r lg:border-(--os-line) lg:bg-(--os-paper)">
        <header className="flex shrink-0 items-center justify-between gap-4 px-5 pt-5 sm:px-8 lg:px-12 lg:pt-8">
          <button type="button" onClick={onHome} className={cx("rounded-md", focusRing)} aria-label="Volver a la bienvenida"><OsWordmark /></button>
          <p className="text-[12px] font-medium text-(--os-muted)"><span className="os-num text-(--os-ink)">{String(index + 1).padStart(2, "0")}</span> / {String(STEPS.length).padStart(2, "0")} · {def.chapter}</p>
        </header>
        <Progress index={index} onPick={(n) => goTo(n + 1)} />

        <div className="os-scroll-y relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {/* Vista previa compacta en móvil y tableta */}
          <div className="px-5 pt-5 sm:px-8 lg:hidden">
            <LivePreview state={preview} logo={logo} focus={def.focus} compact />
          </div>
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={def.id} custom={dir} variants={questionVariants} initial="enter" animate="center" exit="exit"
              className="px-5 pb-10 pt-7 sm:px-8 lg:px-12 lg:pt-[min(9vh,88px)]">
              <p className="os-eyebrow text-(--os-accent-ink)">{def.eyebrow}</p>
              <h2 ref={headingRef} tabIndex={-1} className="os-display mt-3 text-[2.3rem] leading-[1.02] text-(--os-ink) outline-none sm:text-[2.9rem] lg:text-[3.35rem]">{def.title}</h2>
              <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-(--os-muted)">{def.help}</p>
              <div className="mt-8 lg:mt-10">
                {def.id === "nombre" && <StepName config={config} update={update} onSubmit={next} />}
                {def.id === "disciplina" && <StepDiscipline config={config} onPick={(t) => setConfig((c) => withTypeSuggestions(c, t))} />}
                {def.id === "color" && <StepColor value={config.theme} onPick={(theme) => update({ theme })} />}
                {def.id === "logo" && <StepLogo name={studioDisplayName(config)} logo={logo} setLogo={setLogo} />}
                {def.id === "clases" && <StepClasses config={config} update={update} />}
                {def.id === "tamano" && <StepSize config={config} update={update} />}
                {def.id === "membresias" && <StepPlans config={config} update={update} />}
                {def.id === "modulos" && <StepModules config={config} update={update} />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="shrink-0 border-t border-(--os-line) bg-(--os-paper)/90 px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-8 lg:px-12 lg:py-5">
          {problem && <p role="alert" className="mb-2.5 text-[13px] font-medium text-(--os-danger)">{problem}</p>}
          <div className="flex items-center justify-between gap-3">
            {index > 0 ? (
              <Button variant="ghost" icon="arrowLeft" onClick={() => goTo(index)}>Atrás</Button>
            ) : (
              <span className="text-[12.5px] text-(--os-muted)">Datos ficticios · sin registro</span>
            )}
            <div className="flex items-center gap-2">
              {def.id === "logo" && !logo && <Button variant="ghost" onClick={next} className="max-sm:hidden">Omitir</Button>}
              <Button variant={last ? "dark" : "primary"} size="lg" iconRight="arrowRight" disabled={!!problem} onClick={next}>
                {last ? (hasStudio ? "Volver a mi estudio" : "Crear mi estudio") : def.id === "nombre" && !config.name.trim() ? "Continuar sin nombre" : "Continuar"}
              </Button>
            </div>
          </div>
        </footer>
      </section>

      {/* Vista previa en escritorio */}
      <aside aria-label="Vista previa en vivo" className="relative hidden min-w-0 flex-1 flex-col overflow-hidden lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,color-mix(in_srgb,var(--os-accent)_9%,transparent),transparent_60%),radial-gradient(ellipse_at_10%_100%,color-mix(in_srgb,var(--os-sage)_12%,transparent),transparent_55%)]" />
        <div className="relative flex items-center justify-between px-10 pt-8">
          <p className="inline-flex items-center gap-2 text-[12.5px] font-medium text-(--os-muted)">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-(--os-accent) opacity-40 motion-reduce:hidden" /><span className="relative inline-flex size-2 rounded-full bg-(--os-accent)" /></span>
            Vista previa en vivo
          </p>
          <p className="text-[12.5px] text-(--os-muted)">Datos ficticios</p>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center px-10 pb-10 pt-6 xl:px-14">
          <motion.div className="w-full" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>
            <LivePreview state={preview} logo={logo} focus={def.focus} />
          </motion.div>
        </div>
      </aside>
    </div>
  );
}

function Progress({ index, onPick }: { index: number; onPick: (n: number) => void }) {
  return (
    <ol aria-label="Progreso" className="mt-4 flex shrink-0 gap-1.5 px-5 sm:px-8 lg:px-12">
      {STEPS.map((s, i) => (
        <li key={s.id} className="flex-1">
          <button type="button" disabled={i > index} onClick={() => onPick(i)} aria-current={i === index ? "step" : undefined}
            aria-label={`Paso ${i + 1}: ${s.chapter}`} className={cx("block w-full py-2 disabled:cursor-default", focusRing)}>
            <span className="block h-[3px] overflow-hidden rounded-full bg-(--os-line)">
              <motion.span className="block h-full rounded-full bg-(--os-accent)" initial={false} animate={{ width: i <= index ? "100%" : "0%", opacity: i === index ? 1 : 0.55 }} transition={{ duration: 0.5, ease }} />
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────────── Preguntas ───────────────────────────── */

const nameIdeas = ["Casa Aurora", "Estudio Prana", "Núcleo Reformer", "Alma Pilates"];

function StepName({ config, update, onSubmit }: { config: StudioConfig; update: (p: Partial<StudioConfig>) => void; onSubmit: () => void }) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (window.matchMedia?.("(min-width: 1024px)").matches) ref.current?.focus({ preventScroll: true }); }, []);
  return (
    <div>
      <label htmlFor={id} className="sr-only">Nombre de tu estudio</label>
      <input ref={ref} id={id} value={config.name} maxLength={40} autoComplete="off" spellCheck={false} placeholder="Casa Aurora"
        onChange={(e) => update({ name: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onSubmit(); } }}
        className="os-hero-input w-full border-0 border-b-2 border-(--os-line-strong) bg-transparent pb-3 text-[2.1rem] text-(--os-ink) outline-none transition-colors duration-300 focus:border-(--os-accent) sm:text-[2.6rem]" />
      <div className="mt-6">
        <p className="text-[12.5px] text-(--os-muted)">¿Aún sin nombre? Prueba con uno:</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {nameIdeas.map((n) => (
            <button key={n} type="button" onClick={() => update({ name: n })} aria-pressed={config.name === n}
              className={cx("min-h-10 rounded-full border px-4 text-[13.5px] font-medium transition-colors duration-200", focusRing,
                config.name === n ? "border-(--os-accent) bg-(--os-soft) text-(--os-accent-ink)" : "border-(--os-line) bg-(--os-paper) text-(--os-ink-2) hover:border-(--os-line-strong)")}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const disciplineArt: Record<StudioType, ReactNode> = {
  yoga: <><circle cx="32" cy="22" r="7" /><path d="M14 46c6-8 12-11 18-11s12 3 18 11" /><path d="M8 52h48" /></>,
  pilates: <><circle cx="32" cy="32" r="18" /><circle cx="32" cy="32" r="9" /></>,
  reformer: <><path d="M8 40h48" /><rect x="18" y="32" width="16" height="8" rx="2" /><path d="M12 40v8M52 40v8M48 24v16" /><path d="M34 36h14" /></>,
  mixto: <><circle cx="24" cy="30" r="12" /><circle cx="40" cy="30" r="12" /><path d="M20 50h24" /></>,
};
const disciplineCopy: Record<StudioType, { title: string; text: string }> = {
  yoga: { title: "Yoga", text: "Grupos amplios en mat" },
  pilates: { title: "Pilates", text: "Mat en grupos pequeños" },
  reformer: { title: "Reformer", text: "Cupos exactos por máquina" },
  mixto: { title: "Wellness mixto", text: "Reformer, mat y yoga" },
};

function StepDiscipline({ config, onPick }: { config: StudioConfig; onPick: (t: StudioType) => void }) {
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">Disciplina</legend>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(studioTypes) as StudioType[]).map((t) => {
          const on = config.type === t;
          return (
            <label key={t} className={cx("group relative flex min-h-[9.5rem] cursor-pointer flex-col justify-between overflow-hidden rounded-[20px] border p-4 transition-[border-color,background-color,box-shadow] duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--os-accent) sm:p-5",
              on ? "border-(--os-accent) bg-(--os-soft)/60 shadow-[0_14px_30px_-20px_var(--os-accent)]" : "border-(--os-line) bg-(--os-paper) hover:border-(--os-line-strong)")}>
              <input type="radio" name={name} value={t} checked={on} onChange={() => onPick(t)} className="sr-only" />
              <svg viewBox="0 0 64 64" className={cx("size-11 transition-colors duration-300", on ? "text-(--os-accent)" : "text-(--os-faint) group-hover:text-(--os-muted)")} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">{disciplineArt[t]}</svg>
              <span>
                <span className="os-display block text-[1.35rem] leading-tight">{disciplineCopy[t].title}</span>
                <span className="mt-0.5 block text-[12.5px] text-(--os-muted)">{disciplineCopy[t].text}</span>
              </span>
              <AnimatePresence>
                {on && (
                  <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={spring.snappy}
                    className="absolute right-3.5 top-3.5 grid size-6 place-items-center rounded-full bg-(--os-accent) text-white"><Icon name="check" className="size-3.5" /></motion.span>
                )}
              </AnimatePresence>
            </label>
          );
        })}
      </div>
      <p role="status" className="mt-4 text-[13px] text-(--os-muted)">
        Clases sugeridas: <span className="text-(--os-ink)">{studioTypes[config.type].classes.map((c) => c.name).join(" · ")}</span>
      </p>
    </fieldset>
  );
}

const mood: Record<ThemeId, string> = {
  arcilla: "Cálido y terroso", salvia: "Sereno y natural", lavanda: "Suave e introspectivo",
  oceano: "Fresco y profundo", rosa: "Delicado y cercano", grafito: "Sobrio y contemporáneo",
};

function StepColor({ value, onPick }: { value: ThemeId; onPick: (t: ThemeId) => void }) {
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">Color de tu sistema</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {themeIds.map((t) => {
          const th = themes[t];
          const on = value === t;
          return (
            <label key={t} className={cx("relative cursor-pointer rounded-[18px] border p-2 transition-[border-color,box-shadow] duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--os-accent)",
              on ? "border-transparent shadow-[0_0_0_2px_var(--os-accent),0_16px_30px_-22px_var(--os-accent)]" : "border-(--os-line) bg-(--os-paper) hover:border-(--os-line-strong)")}>
              <input type="radio" name={name} value={t} checked={on} onChange={() => onPick(t)} className="sr-only" />
              <span aria-hidden="true" className="relative block h-20 overflow-hidden rounded-[12px]" style={{ background: th.canvas }}>
                <span className="absolute inset-y-0 left-0 w-[42%]" style={{ background: th.accent }} />
                <span className="absolute left-[50%] top-4 h-2 w-[38%] rounded-full" style={{ background: th.soft }} />
                <span className="absolute left-[50%] top-8 h-2 w-[26%] rounded-full" style={{ background: th.accent, opacity: 0.5 }} />
                <span className="absolute bottom-3 left-[50%] h-4 w-[30%] rounded-full" style={{ background: th.accent }} />
              </span>
              <span className="mt-2.5 flex items-center justify-between px-1">
                <span>
                  <span className="block text-[14px] font-semibold">{th.name}</span>
                  <span className="block text-[11.5px] text-(--os-muted)">{mood[t]}</span>
                </span>
                {on && <motion.span layoutId="theme-check" transition={spring.snappy} className="grid size-6 place-items-center rounded-full bg-(--os-accent) text-white"><Icon name="check" className="size-3.5" /></motion.span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function StepLogo({ name, logo, setLogo }: { name: string; logo: string | null; setLogo: (l: string | null) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const read = (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) return setError("Usa una imagen PNG, JPG, WebP o SVG.");
    if (file.size > 1_500_000) return setError("Usa una imagen de menos de 1.5 MB.");
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setLogo(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };
  const onFile = (e: ChangeEvent<HTMLInputElement>) => { read(e.target.files?.[0]); e.target.value = ""; };
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files?.[0]); }}
          className={cx("flex min-h-44 flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed p-6 text-center transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--os-accent)",
            drag ? "border-(--os-accent) bg-(--os-soft)/60" : "border-(--os-line-strong) bg-(--os-paper) hover:border-(--os-accent)")}>
          <span className="grid size-12 place-items-center rounded-full bg-(--os-soft) text-(--os-accent-ink)"><Icon name="upload" /></span>
          <span className="text-[15px] font-semibold">{logo ? "Cambiar imagen" : "Subir logotipo"}</span>
          <span className="text-[12.5px] text-(--os-muted)">Arrastra o elige un archivo · PNG, JPG, WebP o SVG</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={onFile} className="sr-only" aria-label="Subir logotipo" />
        </label>
        <div className="flex items-center gap-4 rounded-[20px] border border-(--os-line) bg-(--os-paper) p-5 sm:w-52 sm:flex-col sm:justify-center sm:text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={logo ?? "mono"} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={spring.soft}>
              <Monogram name={name} logo={logo} size={72} />
            </motion.span>
          </AnimatePresence>
          <div>
            <p className="text-[13px] font-semibold">{logo ? "Tu logotipo" : "Monograma"}</p>
            {logo ? <button type="button" onClick={() => setLogo(null)} className={cx("mt-1 text-[12.5px] font-semibold text-(--os-accent-ink) underline underline-offset-4", focusRing)}>Quitar</button>
              : <p className="mt-0.5 text-[12px] text-(--os-muted)">Con tu color e inicial</p>}
          </div>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-[13px] text-(--os-danger)">{error}</p>}
      <p className="mt-4 flex items-center gap-2 text-[12.5px] text-(--os-muted)"><Icon name="lock" className="size-4" /> Se queda solo en este navegador; no se sube a ningún servidor.</p>
    </div>
  );
}

const allClasses = Object.values(studioTypes).flatMap((t) => t.classes).filter((c, i, list) => list.findIndex((x) => x.name === c.name) === i);

function StepClasses({ config, update }: { config: StudioConfig; update: (p: Partial<StudioConfig>) => void }) {
  const id = useId();
  const [custom, setCustom] = useState("");
  const selected = new Set(config.classes.map((c) => c.name));
  const suggested = new Set(studioTypes[config.type].classes.map((c) => c.name));
  const options = [...studioTypes[config.type].classes, ...allClasses.filter((c) => !suggested.has(c.name)), ...config.classes.filter((c) => !allClasses.some((x) => x.name === c.name))];
  const toggle = (c: { name: string; minutes: number }) =>
    update({ classes: selected.has(c.name) ? config.classes.filter((x) => x.name !== c.name) : [...config.classes, c] });
  const addCustom = () => {
    const name = custom.trim().slice(0, 32);
    if (!name || selected.has(name)) return;
    update({ classes: [...config.classes, { name, minutes: 50 }] });
    setCustom("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((c) => {
          const on = selected.has(c.name);
          return (
            <motion.button layout key={c.name} type="button" aria-pressed={on} onClick={() => toggle(c)} transition={spring.snappy}
              className={cx("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-colors duration-200", focusRing,
                on ? "border-(--os-accent) bg-(--os-accent) text-white" : "border-(--os-line) bg-(--os-paper) text-(--os-ink-2) hover:border-(--os-line-strong)")}>
              <Icon name={on ? "check" : "plus"} className="size-3.5" />
              {c.name} <span className={cx("text-[12px]", on ? "text-white/75" : "text-(--os-faint)")}>{c.minutes} min</span>
            </motion.button>
          );
        })}
      </div>
      <form className="mt-5 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); addCustom(); }}>
        <label htmlFor={id} className="sr-only">Otra clase</label>
        <input id={id} value={custom} maxLength={32} placeholder="Añade otra clase, ej. Barre" onChange={(e) => setCustom(e.target.value)}
          className="h-11 min-w-0 flex-1 rounded-full border border-(--os-line) bg-(--os-paper) px-4 text-[15px] outline-none transition-colors focus:border-(--os-accent)" />
        <Button type="submit" icon="plus" disabled={!custom.trim()}>Añadir</Button>
      </form>
      <p className="mt-4 text-[13px] text-(--os-muted)"><span className="os-num font-semibold text-(--os-ink)">{config.classes.length}</span> clase{config.classes.length === 1 ? "" : "s"} en tu agenda</p>
    </div>
  );
}

type Size = { id: string; title: string; text: string; instructors: number; rooms: number; capacity: number };
function sizesFor(type: StudioType): Size[] {
  const t = studioTypes[type];
  return [
    { id: "boutique", title: "Boutique", text: "Íntimo, atención muy personal", instructors: Math.max(1, t.instructors - 1), rooms: 1, capacity: Math.max(4, Math.round(t.capacity * 0.7)) },
    { id: "estudio", title: "Estudio", text: "Lo más común en tu disciplina", instructors: t.instructors, rooms: t.rooms, capacity: t.capacity },
    { id: "centro", title: "Centro", text: "Varias salas y horarios llenos", instructors: Math.min(8, t.instructors + 2), rooms: Math.min(4, t.rooms + 1), capacity: Math.min(40, Math.round(t.capacity * 1.4)) },
  ];
}

function Counter({ label, value, min, max, onChange, suffix }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void; suffix: string }) {
  return (
    <div role="group" aria-label={label} className="flex items-center justify-between gap-3 py-3">
      <div>
        <p className="text-[14px] font-semibold">{label}</p>
        <p className="text-[12px] text-(--os-muted)">{suffix}</p>
      </div>
      <div className="flex items-center gap-1">
        <button type="button" aria-label={`Menos ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}
          className={cx("grid size-10 place-items-center rounded-full border border-(--os-line) bg-(--os-paper) transition-colors hover:border-(--os-line-strong) disabled:opacity-35", focusRing)}><Icon name="minus" className="size-4" /></button>
        <output aria-live="polite" className="os-num w-10 text-center text-[1.35rem] font-medium">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={value} className="inline-block" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.2 }}>{value}</motion.span>
          </AnimatePresence>
        </output>
        <button type="button" aria-label={`Más ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}
          className={cx("grid size-10 place-items-center rounded-full border border-(--os-line) bg-(--os-paper) transition-colors hover:border-(--os-line-strong) disabled:opacity-35", focusRing)}><Icon name="plus" className="size-4" /></button>
      </div>
    </div>
  );
}

function StepSize({ config, update }: { config: StudioConfig; update: (p: Partial<StudioConfig>) => void }) {
  const sizes = sizesFor(config.type);
  const name = useId();
  const current = sizes.find((s) => s.instructors === config.instructors && s.rooms === config.rooms && s.capacity === config.capacity)?.id ?? null;
  return (
    <div>
      <fieldset>
        <legend className="sr-only">Tamaño del estudio</legend>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {sizes.map((s) => {
            const on = current === s.id;
            return (
              <label key={s.id} className={cx("relative cursor-pointer rounded-[18px] border p-4 transition-[border-color,background-color] duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--os-accent)",
                on ? "border-(--os-accent) bg-(--os-soft)/60" : "border-(--os-line) bg-(--os-paper) hover:border-(--os-line-strong)")}>
                <input type="radio" name={name} checked={on} onChange={() => update({ instructors: s.instructors, rooms: s.rooms, capacity: s.capacity })} className="sr-only" />
                <span className="os-display block text-[1.25rem]">{s.title}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-(--os-muted)">{s.text}</span>
                <span className="os-num mt-3 block text-[12px] text-(--os-ink-2)">{s.rooms} sala{s.rooms === 1 ? "" : "s"} · {s.capacity} lugares</span>
                {s.id === "estudio" && <span className="absolute right-3 top-3 rounded-full bg-(--os-ink) px-2 py-0.5 text-[10px] font-semibold text-white">Sugerido</span>}
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-5 divide-y divide-(--os-line) rounded-[18px] border border-(--os-line) bg-(--os-paper) px-4">
        <Counter label="Instructores" suffix="Quienes dan clases" value={config.instructors} min={1} max={8} onChange={(n) => update({ instructors: n })} />
        <Counter label="Salas" suffix="Espacios donde hay clases" value={config.rooms} min={1} max={4} onChange={(n) => update({ rooms: n })} />
        <Counter label="Cupo por clase" suffix="Promedio; se ajusta por clase" value={config.capacity} min={1} max={40} onChange={(n) => update({ capacity: n })} />
      </div>
    </div>
  );
}

function StepPlans({ config, update }: { config: StudioConfig; update: (p: Partial<StudioConfig>) => void }) {
  const toggle = (p: PlanKind) => update({ plans: config.plans.includes(p) ? config.plans.filter((x) => x !== p) : planKinds.filter((k) => k === p || config.plans.includes(k)) });
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {planKinds.map((p) => {
        const plan = planCatalog[p];
        const on = config.plans.includes(p);
        const per = plan.credits ? Math.round(plan.price / plan.credits) : null;
        return (
          <li key={p}>
            <button type="button" role="checkbox" aria-checked={on} onClick={() => toggle(p)}
              className={cx("flex h-full w-full items-start gap-3 rounded-[18px] border p-4 text-left transition-[border-color,background-color] duration-300", focusRing,
                on ? "border-(--os-accent) bg-(--os-soft)/55" : "border-(--os-line) bg-(--os-paper) hover:border-(--os-line-strong)")}>
              <span aria-hidden="true" className={cx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors duration-200", on ? "border-(--os-accent) bg-(--os-accent) text-white" : "border-(--os-line-strong)")}>
                {on && <Icon name="check" className="size-3.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[14px] font-semibold">{plan.name}</span>
                  <span className="os-num text-[14px] font-semibold">{fmtMoney(plan.price)}</span>
                </span>
                <span className="mt-0.5 block text-[12.5px] text-(--os-muted)">{plan.hint}{per && plan.credits! > 1 ? ` · ${fmtMoney(per)} por clase` : ""}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function StepModules({ config, update }: { config: StudioConfig; update: (p: Partial<StudioConfig>) => void }) {
  const toggle = (m: ModuleId) => update({ modules: config.modules.includes(m) ? config.modules.filter((x) => x !== m) : moduleIds.filter((x) => x === m || config.modules.includes(x)) });
  return (
    <ul className="grid gap-2.5 xl:grid-cols-2">
      {moduleIds.map((m) => {
        const on = config.modules.includes(m);
        return (
          <li key={m}>
            <button type="button" role="switch" aria-checked={on} onClick={() => toggle(m)} aria-label={modules[m].name}
              className={cx("flex h-full w-full items-center gap-4 rounded-[18px] border p-4 text-left transition-[border-color,background-color] duration-300 xl:flex-wrap xl:items-start xl:gap-3", focusRing,
                on ? "border-(--os-accent) bg-(--os-soft)/50" : "border-(--os-line) bg-(--os-paper) hover:border-(--os-line-strong)")}>
              <span className={cx("grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300", on ? "bg-(--os-accent) text-white" : "bg-(--os-subtle) text-(--os-muted)")}><Icon name={moduleIcon[m]} className="size-[19px]" /></span>
              <span className="min-w-0 flex-1 xl:order-last xl:basis-full">
                <span className="block text-[14.5px] font-semibold">{modules[m].name}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-(--os-muted)">{modules[m].purpose}</span>
              </span>
              <span aria-hidden="true" className={cx("relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300 xl:ml-auto", on ? "bg-(--os-accent)" : "bg-(--os-line-strong)")}>
                <span className={cx("absolute top-0.5 size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", on ? "translate-x-[18px]" : "translate-x-0.5")} />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
