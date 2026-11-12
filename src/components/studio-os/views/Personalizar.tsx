"use client";

import { useId, useState, type ReactNode } from "react";
import { moduleIds, modules, roles, stageOrder, themeIds, themes } from "@/lib/studio-os/catalog";
import {
  addBranch, addClassType, addRoom, removeClassType, renameBranch, setRole, setViewAsInstructor, updateClassType, updateConfig,
  updateInstructor, updatePlan, updateRoom, updateSettings,
} from "@/lib/studio-os/engine";
import type { ModuleId, RoleId } from "@/lib/studio-os/types";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Button, cx, Field, focusRing, inputClass, PageHeader, Segmented, Switch } from "../ui";

function Section({ title, hint, children, defaultOpen = false }: { title: string; hint: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-(--os-line) bg-white">
      <summary className={cx("flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 sm:px-5 [&::-webkit-details-marker]:hidden", focusRing)}>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold">{title}</span>
          <span className="block text-[13px] text-(--os-muted)">{hint}</span>
        </span>
        <Icon name="chevronRight" className="size-5 shrink-0 text-(--os-muted) transition-transform duration-200 group-open:rotate-90" />
      </summary>
      <div className="border-t border-(--os-line) px-4 py-4 sm:px-5">{children}</div>
    </details>
  );
}

export function Personalizar() {
  const { state, apply, go } = useStudio();
  const id = useId();
  const quiet = { quiet: true };
  const [newClass, setNewClass] = useState({ name: "", minutes: 50 });
  const [newRoom, setNewRoom] = useState("");
  const [newBranch, setNewBranch] = useState("");
  const s = state.settings;

  return (
    <>
      <PageHeader title="Personalizar mi sistema" description="Todo lo avanzado está aquí, agrupado. Cada cambio se refleja al instante en las demás secciones." />
      <div className="space-y-3">
        <Section title="Marca y colores" hint="Nombre e identidad de tu sistema." defaultOpen>
          <Field label="Nombre comercial" htmlFor={`${id}-name`}>
            <input id={`${id}-name`} className={inputClass} maxLength={40} value={state.config.name} placeholder="Tu estudio" onChange={(e) => apply(updateConfig(state, { name: e.target.value }), quiet)} />
          </Field>
          <fieldset className="mt-4">
            <legend className="mb-2 text-[13px] font-semibold">Colores</legend>
            <div className="flex flex-wrap gap-2">
              {themeIds.map((t) => (
                <button key={t} type="button" aria-pressed={state.config.theme === t} onClick={() => apply(updateConfig(state, { theme: t }), quiet)}
                  className={cx("flex min-h-11 items-center gap-2 rounded-xl border px-3 text-[13px] font-semibold", focusRing, state.config.theme === t ? "border-(--os-accent) ring-1 ring-(--os-accent)" : "border-(--os-line)")}>
                  <span aria-hidden="true" className="flex overflow-hidden rounded-md border border-black/5"><span className="size-5" style={{ background: themes[t].accent }} /><span className="size-5" style={{ background: themes[t].soft }} /></span>
                  {themes[t].name}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="mt-3 text-[12.5px] text-(--os-muted)">El logotipo se cambia en el configurador (Salir al configurador).</p>
        </Section>

        <Section title="Módulos activos" hint="Lo que apagues desaparece del menú y del inicio.">
          <ul className="grid gap-3 sm:grid-cols-2">
            {moduleIds.map((m) => (
              <li key={m}><Switch checked={state.config.modules.includes(m)} label={modules[m].name} description={modules[m].purpose}
                onChange={() => apply(updateConfig(state, { modules: state.config.modules.includes(m) ? state.config.modules.filter((x) => x !== m) : moduleIds.filter((x: ModuleId) => x === m || state.config.modules.includes(x)) }), quiet)} /></li>
            ))}
          </ul>
        </Section>

        <Section title="Clases" hint="Tipos de clase y duración.">
          <ul className="space-y-2">
            {state.classTypes.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`${id}-c-${c.id}`}>Nombre de la clase</label>
                <input id={`${id}-c-${c.id}`} className={cx(inputClass, "flex-1 basis-40")} defaultValue={c.name} key={c.name} maxLength={32} onBlur={(e) => { if (e.target.value !== c.name && !apply(updateClassType(state, c.id, { name: e.target.value }), quiet)) e.target.value = c.name; }} />
                <label className="sr-only" htmlFor={`${id}-m-${c.id}`}>Duración</label>
                <select id={`${id}-m-${c.id}`} className={cx(inputClass, "w-28")} value={c.minutes} onChange={(e) => apply(updateClassType(state, c.id, { minutes: Number(e.target.value) }), quiet)}>
                  {[30, 45, 50, 55, 60, 75, 90].map((m) => <option key={m} value={m}>{m} min</option>)}
                </select>
                <Button size="sm" variant="ghost" aria-label={`Eliminar ${c.name}`} onClick={() => apply(removeClassType(state, c.id))}><Icon name="x" className="size-4" /></Button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="sr-only" htmlFor={`${id}-nc`}>Nueva clase</label>
            <input id={`${id}-nc`} className={cx(inputClass, "flex-1 basis-40")} placeholder="Nueva clase" value={newClass.name} maxLength={32} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} />
            <Button icon="plus" disabled={!newClass.name.trim()} onClick={() => { if (apply(addClassType(state, newClass.name, newClass.minutes))) setNewClass({ name: "", minutes: 50 }); }}>Agregar</Button>
          </div>
          <p className="mt-2 text-[12.5px] text-(--os-muted)">Los cambios de duración aplican a clases nuevas.</p>
        </Section>

        <Section title="Horarios" hint="Crea, cancela o mueve clases desde la agenda.">
          <p className="text-sm text-(--os-muted)">Tus horarios viven en la agenda: ahí creas clases nuevas, cambias cupos y asignas sustituciones.</p>
          <Button className="mt-3" iconRight="arrowRight" onClick={() => go("agenda")}>Abrir agenda</Button>
        </Section>

        <Section title="Profesores" hint="Nombres y honorarios. La disponibilidad se edita en Profesores.">
          <ul className="space-y-2">
            {state.instructors.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`${id}-i-${i.id}`}>Nombre</label>
                <input id={`${id}-i-${i.id}`} className={cx(inputClass, "flex-1 basis-40")} defaultValue={i.name} key={i.name} maxLength={40} onBlur={(e) => { if (e.target.value !== i.name && !apply(updateInstructor(state, i.id, { name: e.target.value }), quiet)) e.target.value = i.name; }} />
                <label className="sr-only" htmlFor={`${id}-r-${i.id}`}>Honorario por clase</label>
                <input id={`${id}-r-${i.id}`} type="number" min={0} step={50} className={cx(inputClass, "w-28")} value={i.ratePerClass} onChange={(e) => apply(updateInstructor(state, i.id, { ratePerClass: Number(e.target.value) }), quiet)} />
              </li>
            ))}
          </ul>
          {state.config.modules.includes("equipo") && <Button className="mt-3" size="sm" iconRight="arrowRight" onClick={() => go("profesores")}>Disponibilidad y sustituciones</Button>}
        </Section>

        <Section title="Salas, cupos y sucursales" hint="Capacidad máxima por sala y dónde está cada una.">
          <ul className="space-y-2">
            {state.rooms.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`${id}-ro-${r.id}`}>Sala</label>
                <input id={`${id}-ro-${r.id}`} className={cx(inputClass, "flex-1 basis-36")} defaultValue={r.name} key={r.name} maxLength={32} onBlur={(e) => { if (e.target.value !== r.name && !apply(updateRoom(state, r.id, { name: e.target.value }), quiet)) e.target.value = r.name; }} />
                <label className="sr-only" htmlFor={`${id}-rc-${r.id}`}>Capacidad</label>
                <input id={`${id}-rc-${r.id}`} type="number" min={1} max={60} className={cx(inputClass, "w-20")} value={r.capacity} onChange={(e) => apply(updateRoom(state, r.id, { capacity: Math.floor(Number(e.target.value)) }), quiet)} />
                {state.branches.length > 1 && (
                  <select aria-label="Sucursal" className={cx(inputClass, "w-44")} value={r.branchId} onChange={(e) => apply(updateRoom(state, r.id, { branchId: e.target.value }), quiet)}>
                    {state.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="sr-only" htmlFor={`${id}-nr`}>Nueva sala</label>
            <input id={`${id}-nr`} className={cx(inputClass, "flex-1 basis-40")} placeholder="Nueva sala" value={newRoom} maxLength={32} onChange={(e) => setNewRoom(e.target.value)} />
            <Button icon="plus" disabled={!newRoom.trim()} onClick={() => { if (apply(addRoom(state, newRoom, state.branches[0].id, state.config.capacity))) setNewRoom(""); }}>Agregar sala</Button>
          </div>
          <h4 className="mt-5 text-[13px] font-semibold">Sucursales</h4>
          <ul className="mt-2 space-y-2">
            {state.branches.map((b) => (
              <li key={b.id}>
                <label className="sr-only" htmlFor={`${id}-b-${b.id}`}>Sucursal</label>
                <input id={`${id}-b-${b.id}`} className={inputClass} defaultValue={b.name} key={b.name} maxLength={32} onBlur={(e) => { if (e.target.value !== b.name && !apply(renameBranch(state, b.id, e.target.value), quiet)) e.target.value = b.name; }} />
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-2">
            <label className="sr-only" htmlFor={`${id}-nb`}>Nueva sucursal</label>
            <input id={`${id}-nb`} className={cx(inputClass, "flex-1 basis-40")} placeholder="Nueva sucursal" value={newBranch} maxLength={32} onChange={(e) => setNewBranch(e.target.value)} />
            <Button icon="plus" disabled={!newBranch.trim()} onClick={() => { if (apply(addBranch(state, newBranch))) setNewBranch(""); }}>Agregar sucursal</Button>
          </div>
        </Section>

        <Section title="Membresías y precios" hint="Precios de ejemplo para tus alumnas, créditos y vigencia.">
          <div className="space-y-2">
            {state.plans.map((p) => (
              <div key={p.id} className={cx("grid grid-cols-2 items-end gap-2 rounded-xl border p-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr]", p.enabled ? "border-(--os-line)" : "border-dashed border-(--os-line) opacity-70")}>
                <label className="col-span-2 flex items-center gap-2 text-sm font-semibold sm:col-span-1">
                  <input type="checkbox" checked={p.enabled} onChange={() => apply(updatePlan(state, p.id, { enabled: !p.enabled }))} className="size-[18px] accent-(--os-accent)" />
                  {p.name}
                </label>
                <Field label="Precio" htmlFor={`${id}-pp-${p.id}`}><input id={`${id}-pp-${p.id}`} type="number" min={0} step={50} className={inputClass} value={p.price} onChange={(e) => apply(updatePlan(state, p.id, { price: Number(e.target.value) }), quiet)} /></Field>
                <Field label="Clases" htmlFor={`${id}-pc-${p.id}`}>
                  {p.credits === null ? <p id={`${id}-pc-${p.id}`} className="flex h-11 items-center text-sm text-(--os-muted)">Ilimitadas</p> : (
                    <input id={`${id}-pc-${p.id}`} type="number" min={1} max={200} className={inputClass} value={p.credits} onChange={(e) => apply(updatePlan(state, p.id, { credits: Math.floor(Number(e.target.value)) }), quiet)} />
                  )}
                </Field>
                <Field label="Vigencia (días)" htmlFor={`${id}-pv-${p.id}`}><input id={`${id}-pv-${p.id}`} type="number" min={1} max={365} className={inputClass} value={p.validityDays} onChange={(e) => apply(updatePlan(state, p.id, { validityDays: Math.floor(Number(e.target.value)) }), quiet)} /></Field>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] text-(--os-muted)">Aplica a ventas nuevas; las membresías vendidas conservan sus condiciones.</p>
        </Section>

        <Section title="Reglas de cancelación y vencimientos" hint={`Hoy: ${s.cancellationHours} h de anticipación · aviso ${s.expiryWarningDays} días antes.`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Anticipación mínima para cancelar (horas)" htmlFor={`${id}-ch`} hint="Si cancela con al menos este tiempo, recupera su crédito.">
              <input id={`${id}-ch`} type="number" min={0} max={72} className={inputClass} value={s.cancellationHours} onChange={(e) => apply(updateSettings(state, { cancellationHours: Math.floor(Number(e.target.value)) }), quiet)} />
            </Field>
            <Field label="Aviso de vencimiento (días antes)" htmlFor={`${id}-ex`} hint="Marca membresías como “por vencer”.">
              <input id={`${id}-ex`} type="number" min={1} max={30} className={inputClass} value={s.expiryWarningDays} onChange={(e) => apply(updateSettings(state, { expiryWarningDays: Math.floor(Number(e.target.value)) }), quiet)} />
            </Field>
          </div>
          <p className="mb-2 mt-4 text-[13px] font-semibold">Si cancela tarde</p>
          <Segmented label="Si cancela tarde" value={s.lateCancel} onChange={(v) => apply(updateSettings(state, { lateCancel: v }))}
            options={[{ value: "pierde", label: "Pierde el crédito" }, { value: "devuelve", label: "Recupera el crédito" }]} />
          <div className="mt-4"><Switch checked={s.waitlist} onChange={() => apply(updateSettings(state, { waitlist: !s.waitlist }))} label="Lista de espera" description="Si una clase se llena, se forma una lista y la primera toma el lugar libre." /></div>
        </Section>

        <Section title="Roles del personal" hint="Qué ve cada persona de tu equipo.">
          <ul className="space-y-2">
            {(Object.keys(roles) as RoleId[]).map((r) => (
              <li key={r}>
                <label className={cx("flex cursor-pointer items-start gap-3 rounded-xl border p-3", state.role === r ? "border-(--os-accent) bg-(--os-soft)/40" : "border-(--os-line)")}>
                  <input type="radio" name={`${id}-role`} checked={state.role === r} onChange={() => apply(setRole(state, r))} className="mt-1 size-[18px] accent-(--os-accent)" />
                  <span><span className="block text-sm font-semibold">{roles[r].name}</span><span className="block text-[13px] text-(--os-muted)">{roles[r].description}</span></span>
                </label>
              </li>
            ))}
          </ul>
          <Field label="Instructor para la vista de instructor" htmlFor={`${id}-vi`} className="mt-3">
            <select id={`${id}-vi`} className={inputClass} value={state.viewAsInstructorId} onChange={(e) => apply(setViewAsInstructor(state, e.target.value))}>
              {state.instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </Field>
          <p className="mt-2 text-[12.5px] text-(--os-muted)">En la demo cambias de rol para ver la diferencia; no hay cuentas ni contraseñas.</p>
        </Section>

        <Section title="Notificaciones simuladas" hint="Qué avisos prepararía el sistema. Nada se envía.">
          <div className="space-y-4">
            <Switch checked={s.notifications.recordatorio} onChange={() => apply(updateSettings(state, { notifications: { ...s.notifications, recordatorio: !s.notifications.recordatorio } }))} label="Recordatorio de clase" description="Un día antes de cada reserva." />
            <Switch checked={s.notifications.espera} onChange={() => apply(updateSettings(state, { notifications: { ...s.notifications, espera: !s.notifications.espera } }))} label="Lugar liberado" description="Cuando alguien sale de la lista de espera y obtiene lugar." />
            <Switch checked={s.notifications.vencimiento} onChange={() => apply(updateSettings(state, { notifications: { ...s.notifications, vencimiento: !s.notifications.vencimiento } }))} label="Paquete por vencer" description={`${s.expiryWarningDays} días antes del vencimiento.`} />
          </div>
        </Section>

        <Section title="Flujo comercial" hint="Nombre de cada etapa del tablero de ventas.">
          <div className="grid gap-2 sm:grid-cols-2">
            {stageOrder.map((st, i) => (
              <Field key={st} label={`Etapa ${i + 1}`} htmlFor={`${id}-st-${st}`}>
                <input id={`${id}-st-${st}`} className={inputClass} maxLength={28} value={s.stageLabels[st]}
                  onChange={(e) => apply(updateSettings(state, { stageLabels: { ...s.stageLabels, [st]: e.target.value || s.stageLabels[st] } }), quiet)} />
              </Field>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
