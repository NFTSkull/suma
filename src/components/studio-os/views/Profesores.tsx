"use client";

import { useId, useState } from "react";
import { addInstructor, substituteInstructor, updateInstructor } from "@/lib/studio-os/engine";
import { appointmentClient, className, instructorStats, roomName } from "@/lib/studio-os/selectors";
import { cap } from "@/lib/studio-os/verticals";
import { fmtDay, fmtMoney, fmtTime } from "@/lib/studio-os/time";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Avatar, Badge, Button, Card, cx, Field, focusRing, inputClass, PageHeader } from "../ui";

const WEEK = [1, 2, 3, 4, 5, 6, 0];
const DAY = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function Profesores() {
  const { state, apply, t, caps } = useStudio();
  const id = useId();
  const unit = caps.appointments && !caps.groups ? "sesión" : caps.appointments ? "sesión o clase" : "clase";
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const totalWeek = state.instructors.reduce((acc, i) => acc + instructorStats(state, i.id).feesWeek, 0);

  return (
    <>
      <PageHeader
        title={cap(t.staff.many)}
        description={`Honorarios estimados de la semana: ${fmtMoney(totalWeek)}. Ajusta el honorario por ${unit} y la disponibilidad.`}
        action={<Button variant="primary" icon={adding ? "x" : "plus"} onClick={() => setAdding((v) => !v)}>{adding ? "Cerrar" : `Agregar ${t.staff.one}`}</Button>}
      />
      {adding && (
        <Card className="os-fade mb-4 p-4">
          <Field label="Nombre" htmlFor={`${id}-n`} hint="Usa un nombre ficticio.">
            <div className="flex gap-2">
              <input id={`${id}-n`} className={inputClass} value={name} maxLength={40} onChange={(e) => setName(e.target.value)} autoComplete="off" />
              <Button variant="primary" disabled={!name.trim()} onClick={() => { if (apply(addInstructor(state, name))) { setName(""); setAdding(false); } }}>Agregar</Button>
            </div>
          </Field>
        </Card>
      )}
      <ul className="grid gap-3 lg:grid-cols-2">
        {state.instructors.map((ins) => {
          const st = instructorStats(state, ins.id);
          const expanded = open === ins.id;
          const upcoming = st.sessions.filter((s) => new Date(s.start) > new Date(state.now));
          return (
            <li key={ins.id}>
              <Card as="article" className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={ins.name} hue={(ins.name.length * 37) % 360} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{ins.name}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1" role="group" aria-label={`Disponibilidad de ${ins.name}`}>
                      {WEEK.map((d) => {
                        const on = ins.days.includes(d);
                        return (
                          <button key={d} type="button" aria-pressed={on} onClick={() => apply(updateInstructor(state, ins.id, { days: on ? ins.days.filter((x) => x !== d) : [...ins.days, d] }))}
                            className={cx("min-h-8 rounded-lg px-2 text-[12px] font-semibold transition-colors duration-150", focusRing, on ? "bg-(--os-soft) text-(--os-accent-ink)" : "bg-[#F1EDE8] text-[#8A837C] line-through")}>
                            {DAY[d]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[[caps.appointments ? "Agenda" : "Clases", st.sessions.length], [caps.appointments ? "Atendidas" : "Impartidas", st.taught], caps.groups ? ["Sustituciones", st.substitutions] : ["Por atender", st.upcoming]].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-(--os-subtle) px-2 py-2.5"><dt className="text-[11.5px] text-(--os-muted)">{k}</dt><dd className="text-lg font-semibold tabular-nums">{v}</dd></div>
                  ))}
                </dl>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                  <Field label={`Honorario por ${unit} (MXN)`} htmlFor={`${id}-${ins.id}-rate`} className="w-40">
                    <input id={`${id}-${ins.id}-rate`} type="number" min={0} step={50} className={inputClass} value={ins.ratePerClass}
                      onChange={(e) => apply(updateInstructor(state, ins.id, { ratePerClass: Number(e.target.value) }))} />
                  </Field>
                  <p className="text-right text-[13px] text-(--os-muted)">Estimado semana<br /><strong className="text-base tabular-nums text-(--os-ink)">{fmtMoney(st.feesWeek)}</strong> <span className="text-[12px]">({fmtMoney(st.feesTaught)} ya atendido)</span></p>
                </div>
                <Button size="sm" variant="ghost" iconRight="chevronRight" className="mt-3 -ml-2" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : ins.id)}>
                  {expanded ? "Ocultar agenda" : `Ver agenda próxima (${upcoming.length})`}
                </Button>
                {expanded && <Upcoming instructorId={ins.id} />}
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Upcoming({ instructorId }: { instructorId: string }) {
  const { state, apply } = useStudio();
  const sessions = instructorStats(state, instructorId).sessions.filter((s) => new Date(s.start) > new Date(state.now));
  if (!sessions.length) return <p className="mt-2 text-sm text-(--os-muted)">Sin nada próximo esta semana.</p>;
  return (
    <ul className="os-fade mt-2 divide-y divide-(--os-line)">
      {sessions.map((s) => {
        const options = s.kind === "cita" ? [] : state.instructors.filter((i) => i.id !== instructorId && i.days.includes(new Date(s.start).getDay()));
        return (
          <li key={s.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 text-sm">
            <span className="min-w-0 flex-1 basis-40">
              <span className="block font-medium">{className(state, s)}{s.kind === "cita" && ` · ${appointmentClient(state, s)?.name ?? ""}`}{s.substituteFor && <Badge className="ml-1.5">Sustitución</Badge>}</span>
              <span className="block text-[12.5px] text-(--os-muted)">{fmtDay(s.start)} · {fmtTime(s.start)} · {roomName(state, s.roomId)}</span>
            </span>
            {s.kind === "grupal" && <label className="flex items-center gap-2">
              <span className="sr-only">Sustituir en {className(state, s)}</span>
              <Icon name="restore" className="size-4 text-(--os-muted)" />
              <select value="" disabled={!options.length} onChange={(e) => e.target.value && apply(substituteInstructor(state, s.id, e.target.value))} className={cx(inputClass, "h-9 w-44 text-[13px] sm:text-[13px]")}>
                <option value="">{options.length ? "Sustituir con…" : "Sin sustitutos"}</option>
                {options.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </label>}
          </li>
        );
      })}
    </ul>
  );
}
