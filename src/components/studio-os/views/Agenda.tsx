"use client";

import { useId, useState } from "react";
import { bookSession, cancelBooking, cancelSession, createSession, markAttendance, substituteInstructor, updateCapacity } from "@/lib/studio-os/engine";
import { occupies, sessionBookings, sessionTaken, sessionWaitlist } from "@/lib/studio-os/rules";
import { className, instructorName, roomName, scopedSessions, studentInfo } from "@/lib/studio-os/selectors";
import { addDays, cap, fmtDay, fmtLongDay, fmtTime, sameDay, startOfDay, startOfWeek } from "@/lib/studio-os/time";
import type { Session } from "@/lib/studio-os/types";
import { useStudio } from "../context";
import { Avatar, Badge, Button, Card, ConfirmButton, cx, DetailPanel, Empty, Field, focusRing, inputClass, Meter, PageHeader, Segmented } from "../ui";

export function Agenda() {
  const { state, target } = useStudio();
  const targetSession = state.sessions.find((s) => s.id === target);
  const [mode, setMode] = useState<"dia" | "semana">(() => (!targetSession && typeof window !== "undefined" && window.matchMedia?.("(min-width: 1024px)").matches ? "semana" : "dia"));
  const [day, setDay] = useState(() => startOfDay(new Date(targetSession?.start ?? state.now)).toISOString());
  const [selected, setSelected] = useState<string | null>(targetSession?.id ?? null);
  const [creating, setCreating] = useState(false);
  const [branch, setBranch] = useState("todas");
  const readOnly = state.role === "instructor";

  const weekStart = startOfWeek(new Date(state.now));
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const roomsInBranch = new Set(state.rooms.filter((r) => branch === "todas" || r.branchId === branch).map((r) => r.id));
  const sessions = scopedSessions(state).filter((s) => roomsInBranch.has(s.roomId)).sort((a, b) => a.start.localeCompare(b.start));
  const ofDay = (d: Date | string) => sessions.filter((s) => sameDay(s.start, d));
  const current = state.sessions.find((s) => s.id === selected);

  return (
    <>
      <PageHeader
        title="Agenda"
        description={readOnly ? `Clases de ${instructorName(state, state.viewAsInstructorId)}. Toca una para pasar lista.` : "Toca una clase para inscribir, cancelar o pasar lista."}
        action={!readOnly && <Button variant="primary" icon={creating ? "x" : "plus"} onClick={() => setCreating((v) => !v)}>{creating ? "Cerrar" : "Crear clase"}</Button>}
      />
      {creating && <CreateSession onDone={(s) => { setCreating(false); setDay(startOfDay(new Date(s.start)).toISOString()); setMode("dia"); setSelected(s.id); }} />}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented label="Vista" value={mode} onChange={setMode} options={[{ value: "dia", label: "Día" }, { value: "semana", label: "Semana" }]} />
        {state.branches.length > 1 && (
          <select aria-label="Sucursal" value={branch} onChange={(e) => setBranch(e.target.value)} className={cx(inputClass, "h-10 w-auto")}>
            <option value="todas">Todas las sucursales</option>
            {state.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <p className="text-[13px] text-(--os-muted)">Cancelar con {state.settings.cancellationHours} h o más devuelve el crédito.</p>
      </div>

      {mode === "dia" && (
        <div role="group" aria-label="Día" className="os-scroll-x -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {days.map((d) => {
            const active = sameDay(d, day);
            const today = sameDay(d, state.now);
            return (
              <button key={d.toISOString()} type="button" aria-pressed={active} onClick={() => { setDay(d.toISOString()); setSelected(null); }}
                className={cx("flex min-h-[3.75rem] min-w-[4.25rem] shrink-0 flex-col items-center justify-center rounded-xl border px-2 transition-colors duration-150", focusRing,
                  active ? "border-(--os-accent) bg-(--os-accent) text-white" : "border-(--os-line) bg-white hover:bg-(--os-subtle)")}>
                <span className={cx("text-[11.5px] font-semibold uppercase", !active && "text-(--os-muted)")}>{today ? "Hoy" : fmtDay(d).split(" ")[0]}</span>
                <span className="text-base font-semibold tabular-nums">{d.getDate()}</span>
                <span className={cx("text-[10.5px]", active ? "text-white/85" : "text-(--os-muted)")}>{ofDay(d).filter((s) => s.status === "programada").length} clases</span>
              </button>
            );
          })}
        </div>
      )}

      <div className={cx("grid gap-4", current && mode === "dia" && "lg:grid-cols-[minmax(0,1fr)_420px]")}>
        <div className="min-w-0">
          {mode === "dia" ? (
            <>
              <h3 className="mb-2 text-sm font-semibold text-(--os-muted)">{cap(fmtLongDay(day))}</h3>
              {ofDay(day).length ? (
                <ul className="space-y-2">{ofDay(day).map((s) => <li key={s.id}><SessionCard s={s} active={selected === s.id} onOpen={() => setSelected(s.id)} /></li>)}</ul>
              ) : (
                <Empty icon="calendar" title="Sin clases este día" text={readOnly ? "No tienes clases asignadas." : "Crea una clase para empezar a recibir reservas."} />
              )}
            </>
          ) : (
            <>
              <WeekGrid days={days} sessions={sessions} selected={selected} onOpen={setSelected} />
              <div className={cx("grid gap-3 lg:hidden", current && "xl:grid-cols-2")}>
                {days.map((d) => (
                  <section key={d.toISOString()} aria-label={fmtLongDay(d)} className="min-w-0">
                    <h3 className={cx("mb-2 text-[13px] font-semibold ", sameDay(d, state.now) ? "text-(--os-accent-ink)" : "text-(--os-muted)")}>
                      {sameDay(d, state.now) ? "Hoy · " : ""}{fmtDay(d)}
                    </h3>
                    <ul className="space-y-2">
                      {ofDay(d).map((s) => <li key={s.id}><SessionCard s={s} compact active={selected === s.id} onOpen={() => setSelected(s.id)} /></li>)}
                      {!ofDay(d).length && <li className="rounded-xl border border-dashed border-(--os-line) px-3 py-4 text-center text-[12.5px] text-(--os-muted)">Sin clases</li>}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
        {current && (mode === "dia" ? <SessionDetail key={current.id} s={current} onClose={() => setSelected(null)} /> : (
          // En semana, el detalle se abre como panel sobre la cuadrícula para no comprimirla.
          <div className="lg:fixed lg:inset-y-4 lg:right-4 lg:z-[95] lg:w-[440px] lg:[&>section]:max-h-full lg:[&>section]:shadow-[0_30px_80px_-30px_rgba(29,27,25,0.45)]">
            <SessionDetail key={current.id} s={current} onClose={() => setSelected(null)} />
          </div>
        ))}
      </div>
    </>
  );
}

function SessionCard({ s, active, onOpen, compact = false }: { s: Session; active: boolean; onOpen: () => void; compact?: boolean }) {
  const { state } = useStudio();
  const taken = sessionTaken(state, s.id);
  const waiting = sessionWaitlist(state, s.id).length;
  const started = new Date(s.start) <= new Date(state.now);
  const unmarked = started && sessionBookings(state, s.id).some((b) => b.status === "reservada");
  const cancelled = s.status === "cancelada";
  return (
    <button type="button" onClick={onOpen} aria-current={active ? "true" : undefined}
      className={cx("w-full rounded-2xl border bg-white text-left transition-colors duration-150", focusRing, compact ? "p-3" : "p-3.5 sm:p-4",
        active ? "border-(--os-accent) ring-1 ring-(--os-accent)" : "border-(--os-line) hover:border-[#D6CEC4]", cancelled && "opacity-60")}>
      <div className={cx("flex gap-3", compact ? "flex-col" : "items-center")}>
        <div className={cx("shrink-0", !compact && "w-14")}>
          <p className={cx("font-semibold tabular-nums", compact ? "text-[13px]" : "text-[15px]")}>{fmtTime(s.start)}</p>
          {!compact && <p className="text-[12px] text-(--os-muted)">{s.minutes} min</p>}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cx("truncate font-semibold", compact ? "text-[13px]" : "text-[15px]", cancelled && "line-through")}>{className(state, s)}</p>
          <p className="truncate text-[12.5px] text-(--os-muted)">{instructorName(state, s.instructorId)}{compact ? "" : ` · ${roomName(state, s.roomId)}`}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {cancelled && <Badge tone="danger">Cancelada</Badge>}
            {!cancelled && taken >= s.capacity && <Badge tone="warn">Llena</Badge>}
            {!cancelled && waiting > 0 && <Badge tone="accent">Espera {waiting}</Badge>}
            {s.substituteFor && <Badge>Sustitución</Badge>}
            {!cancelled && unmarked && <Badge tone="warn">Pasar lista</Badge>}
          </div>
        </div>
        {!cancelled && (
          <div className={cx("shrink-0", compact ? "w-full" : "w-24 text-right")}>
            <p className="text-[12.5px] tabular-nums text-(--os-muted)"><span className="font-semibold text-(--os-ink)">{taken}</span>/{s.capacity}</p>
            <Meter value={taken} max={s.capacity} label="Ocupación" />
          </div>
        )}
      </div>
    </button>
  );
}

function SessionDetail({ s, onClose }: { s: Session; onClose: () => void }) {
  const { state, apply } = useStudio();
  const id = useId();
  const [studentId, setStudentId] = useState("");
  const [substitute, setSubstitute] = useState("");
  const taken = sessionTaken(state, s.id);
  const roster = sessionBookings(state, s.id).filter(occupies);
  const waitlist = sessionWaitlist(state, s.id);
  const lateOrCancelled = sessionBookings(state, s.id).filter((b) => b.status === "cancelada" || b.status === "cancelada_tarde");
  const started = new Date(s.start) <= new Date(state.now);
  const canMark = started || sameDay(s.start, state.now);
  const readOnly = state.role === "instructor";
  const live = s.status === "programada";
  const enrolled = new Set(sessionBookings(state, s.id).filter((b) => b.status !== "cancelada" && b.status !== "cancelada_tarde").map((b) => b.studentId));
  const candidates = state.students.filter((st) => !enrolled.has(st.id)).map((st) => ({ st, info: studentInfo(state, st.id) }))
    .sort((a, b) => Number(b.info.canBook) - Number(a.info.canBook) || a.st.name.localeCompare(b.st.name));
  const weekday = new Date(s.start).getDay();
  const subs = state.instructors.filter((i) => i.id !== s.instructorId && i.days.includes(weekday));

  return (
    <DetailPanel title={className(state, s)} onClose={onClose} closeLabel="Agenda">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="os-display text-[1.45rem] leading-tight">{className(state, s)}</p>
          <p className="mt-1 text-[13.5px] text-(--os-muted)">{cap(fmtLongDay(s.start))} · {fmtTime(s.start)} · {s.minutes} min</p>
          <p className="text-[13.5px] text-(--os-muted)">{instructorName(state, s.instructorId)}{s.substituteFor ? ` (sustituye a ${instructorName(state, s.substituteFor)})` : ""} · {roomName(state, s.roomId)}</p>
        </div>
        {!live && <Badge tone="danger">Cancelada</Badge>}
      </div>

      {live && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-(--os-subtle) p-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold"><span className="tabular-nums">{taken}</span> de {s.capacity} lugares</p>
            <p className="text-[12.5px] text-(--os-muted)">{taken >= s.capacity ? (state.settings.waitlist ? "Llena: nuevas reservas van a lista de espera." : "Llena.") : `${s.capacity - taken} disponibles`}</p>
          </div>
          {!readOnly && !started && (
            <div role="group" aria-label="Cupo" className="flex items-center gap-1.5">
              <Button size="sm" aria-label="Quitar un lugar" disabled={s.capacity <= Math.max(1, taken)} onClick={() => apply(updateCapacity(state, s.id, s.capacity - 1))} className="w-10 px-0">−</Button>
              <Button size="sm" aria-label="Agregar un lugar" onClick={() => apply(updateCapacity(state, s.id, s.capacity + 1))} className="w-10 px-0">+</Button>
            </div>
          )}
        </div>
      )}

      <h4 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--os-muted)">Inscritas ({roster.length})</h4>
      {roster.length ? (
        <ul className="mt-2 divide-y divide-(--os-line)">
          {roster.map((b) => {
            const st = state.students.find((x) => x.id === b.studentId)!;
            return (
              <li key={b.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5">
                <Avatar name={st.name} hue={st.hue} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{st.name}</span>
                  <span className="block text-[12px] text-(--os-muted)">{b.status === "asistio" ? "Asistió" : b.status === "falta" ? "Faltó" : b.creditCharged ? "Reservada · 1 crédito" : "Reservada · ilimitado"}</span>
                </span>
                {live && canMark && (
                  <span role="group" aria-label={`Asistencia de ${st.name}`} className="flex gap-1.5">
                    <Button size="sm" variant={b.status === "asistio" ? "primary" : "secondary"} aria-pressed={b.status === "asistio"} onClick={() => apply(markAttendance(state, b.id, true))}>Asistió</Button>
                    <Button size="sm" variant={b.status === "falta" ? "danger" : "secondary"} aria-pressed={b.status === "falta"} onClick={() => apply(markAttendance(state, b.id, false))}>Faltó</Button>
                  </span>
                )}
                {live && !started && !readOnly && b.status === "reservada" && (
                  <Button size="sm" variant="ghost" onClick={() => apply(cancelBooking(state, b.id))}>Cancelar reserva</Button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-(--os-muted)">Todavía nadie se inscribe.</p>
      )}

      {waitlist.length > 0 && (
        <>
          <h4 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--os-muted)">Lista de espera ({waitlist.length})</h4>
          <ol className="mt-2 space-y-1.5">
            {waitlist.map((b, i) => {
              const st = state.students.find((x) => x.id === b.studentId)!;
              return (
                <li key={b.id} className="flex items-center gap-3 rounded-xl bg-(--os-subtle) px-3 py-2 text-sm">
                  <span className="w-5 font-semibold tabular-nums text-(--os-muted)">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{st.name}</span>
                  {!readOnly && <Button size="sm" variant="ghost" onClick={() => apply(cancelBooking(state, b.id))}>Quitar</Button>}
                </li>
              );
            })}
          </ol>
          <p className="mt-1.5 text-[12.5px] text-(--os-muted)">Si alguien cancela, la primera toma el lugar y se le descuenta el crédito.</p>
        </>
      )}

      {lateOrCancelled.length > 0 && (
        <p className="mt-4 text-[12.5px] text-(--os-muted)">{lateOrCancelled.length} cancelación{lateOrCancelled.length === 1 ? "" : "es"} en esta clase.</p>
      )}

      {live && !started && !readOnly && (
        <div className="mt-5 rounded-xl border border-(--os-line) p-3">
          <Field label="Inscribir alumna" htmlFor={`${id}-st`} hint="Se descuenta un crédito de su paquete vigente.">
            <div className="flex gap-2">
              <select id={`${id}-st`} value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputClass}>
                <option value="">Elige una alumna…</option>
                {candidates.map(({ st, info }) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — {info.canBook ? (info.credits === null ? "ilimitado" : `${info.credits} crédito${info.credits === 1 ? "" : "s"}`) : "sin paquete vigente"}
                  </option>
                ))}
              </select>
              <Button variant="primary" disabled={!studentId} onClick={() => { if (apply(bookSession(state, s.id, studentId))) setStudentId(""); }}>Inscribir</Button>
            </div>
          </Field>
        </div>
      )}

      {live && !started && !readOnly && (
        <div className="mt-3 grid gap-3 rounded-xl border border-(--os-line) p-3">
          <Field label="Sustituir instructor" htmlFor={`${id}-sub`} hint={subs.length ? "Solo aparecen quienes están disponibles ese día." : "Nadie más está disponible ese día."}>
            <div className="flex gap-2">
              <select id={`${id}-sub`} value={substitute} onChange={(e) => setSubstitute(e.target.value)} className={inputClass} disabled={!subs.length}>
                <option value="">Elige a quién…</option>
                {subs.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <Button disabled={!substitute} onClick={() => { if (apply(substituteInstructor(state, s.id, substitute))) setSubstitute(""); }}>Asignar</Button>
            </div>
          </Field>
          <div className="flex items-center justify-between gap-3 border-t border-(--os-line) pt-3">
            <p className="text-[12.5px] text-(--os-muted)">Cancelar la clase devuelve el crédito a todas.</p>
            <ConfirmButton label="Cancelar clase" confirmLabel="Sí, cancelar clase" onConfirm={() => apply(cancelSession(state, s.id))} />
          </div>
        </div>
      )}
    </DetailPanel>
  );
}

function CreateSession({ onDone }: { onDone: (s: Session) => void }) {
  const { state, apply } = useStudio();
  const id = useId();
  const today = startOfDay(new Date(state.now));
  const options = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const [form, setForm] = useState(() => ({
    classTypeId: state.classTypes[0]?.id ?? "",
    instructorId: state.instructors[0]?.id ?? "",
    roomId: state.rooms[0]?.id ?? "",
    day: addDays(today, 1).toISOString(),
    time: "12:00",
    capacity: state.rooms[0]?.capacity ?? state.config.capacity,
  }));
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    const before = new Set(state.sessions.map((s) => s.id));
    const result = createSession(state, form);
    if (apply(result)) onDone(result.state.sessions.find((s) => !before.has(s.id))!);
  };
  return (
    <Card className="os-fade mb-5 p-4 sm:p-5">
      <p className="text-sm font-semibold">Nueva clase</p>
      <p className="text-[13px] text-(--os-muted)">Revisamos que la sala y el instructor estén libres y disponibles.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Clase" htmlFor={`${id}-c`}>
          <select id={`${id}-c`} className={inputClass} value={form.classTypeId} onChange={(e) => set({ classTypeId: e.target.value })}>
            {state.classTypes.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.minutes} min</option>)}
          </select>
        </Field>
        <Field label="Instructor" htmlFor={`${id}-i`}>
          <select id={`${id}-i`} className={inputClass} value={form.instructorId} onChange={(e) => set({ instructorId: e.target.value })}>
            {state.instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </Field>
        <Field label="Sala" htmlFor={`${id}-r`}>
          <select id={`${id}-r`} className={inputClass} value={form.roomId} onChange={(e) => { const room = state.rooms.find((r) => r.id === e.target.value)!; set({ roomId: room.id, capacity: Math.min(form.capacity, room.capacity) }); }}>
            {state.rooms.map((r) => <option key={r.id} value={r.id}>{r.name} · hasta {r.capacity}</option>)}
          </select>
        </Field>
        <Field label="Día" htmlFor={`${id}-d`}>
          <select id={`${id}-d`} className={inputClass} value={form.day} onChange={(e) => set({ day: e.target.value })}>
            {options.map((d) => <option key={d.toISOString()} value={d.toISOString()}>{sameDay(d, state.now) ? "Hoy" : fmtDay(d)}</option>)}
          </select>
        </Field>
        <Field label="Hora" htmlFor={`${id}-h`}>
          <input id={`${id}-h`} type="time" step={900} className={inputClass} value={form.time} onChange={(e) => set({ time: e.target.value })} />
        </Field>
        <Field label="Cupo" htmlFor={`${id}-q`}>
          <input id={`${id}-q`} type="number" min={1} max={60} className={inputClass} value={form.capacity} onChange={(e) => set({ capacity: Math.floor(Number(e.target.value)) })} />
        </Field>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" icon="check" onClick={submit}>Crear clase</Button>
      </div>
    </Card>
  );
}


/** Semana en cuadrícula horaria: cada clase ocupa su hora real y su color refleja la ocupación. */
function WeekGrid({ days, sessions, selected, onOpen }: { days: Date[]; sessions: Session[]; selected: string | null; onOpen: (id: string) => void }) {
  const { state } = useStudio();
  const PX = 76; // px por hora
  const live = sessions;
  const startH = Math.max(5, Math.min(7, ...live.map((s) => new Date(s.start).getHours())));
  const endH = Math.min(23, Math.max(20, ...live.map((s) => Math.ceil((new Date(s.start).getHours() * 60 + new Date(s.start).getMinutes() + s.minutes) / 60))));
  const hours = Array.from({ length: endH - startH }, (_, i) => startH + i);
  const now = new Date(state.now);
  const nowTop = ((now.getHours() - startH) * 60 + now.getMinutes()) * (PX / 60);
  return (
    <div className="hidden overflow-hidden rounded-[22px] border border-(--os-line) bg-(--os-paper) lg:block">
      <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-b border-(--os-line)">
        <span />
        {days.map((d) => {
          const today = sameDay(d, state.now);
          return (
            <div key={d.toISOString()} className={cx("border-l border-(--os-line) px-3 py-3", today && "bg-(--os-soft)/50")}>
              <p className={cx("text-[11.5px] font-semibold uppercase tracking-[0.08em]", today ? "text-(--os-accent-ink)" : "text-(--os-muted)")}>{today ? "Hoy" : fmtDay(d).split(" ")[0]}</p>
              <p className={cx("os-num mt-0.5 text-[20px] font-medium leading-none", today && "text-(--os-accent-ink)")}>{d.getDate()}</p>
            </div>
          );
        })}
      </div>
      <div className="os-scroll-y relative max-h-[calc(100dvh-20rem)] min-h-[420px] overflow-y-auto">
        <div className="relative grid grid-cols-[56px_repeat(7,minmax(0,1fr))]" style={{ height: hours.length * PX }}>
          <div className="relative">
            {hours.map((h, i) => <span key={h} className="os-num absolute right-2 text-[11px] text-(--os-faint)" style={{ top: i * PX + (i ? -7 : 4) }}>{`${String(h).padStart(2, "0")}:00`}</span>)}
          </div>
          {days.map((d) => {
            const list = live.filter((s) => sameDay(s.start, d));
            // Carriles: clases simultáneas (varias salas) se reparten el ancho.
            const lanes: Session[][] = [];
            const laneOf = new Map<string, number>();
            for (const s of list) {
              const st = new Date(s.start).getTime();
              let lane = lanes.findIndex((l) => { const last = l[l.length - 1]; return new Date(last.start).getTime() + last.minutes * 60000 <= st; });
              if (lane === -1) { lanes.push([]); lane = lanes.length - 1; }
              lanes[lane].push(s);
              laneOf.set(s.id, lane);
            }
            const today = sameDay(d, state.now);
            return (
              <div key={d.toISOString()} className={cx("relative border-l border-(--os-line)", today && "bg-(--os-soft)/25")}>
                {hours.map((h, i) => <span key={h} aria-hidden="true" className="absolute inset-x-0 border-t border-(--os-line)/70" style={{ top: i * PX }} />)}
                {list.map((s) => {
                  const start = new Date(s.start);
                  const top = ((start.getHours() - startH) * 60 + start.getMinutes()) * (PX / 60);
                  const taken = sessionTaken(state, s.id);
                  const pct = Math.min(1, taken / s.capacity);
                  const cancelled = s.status === "cancelada";
                  const lane = laneOf.get(s.id) ?? 0;
                  const n = Math.max(1, lanes.length);
                  const active = selected === s.id;
                  return (
                    <button key={s.id} type="button" onClick={() => onOpen(s.id)} aria-current={active ? "true" : undefined}
                      aria-label={`${fmtTime(s.start)} ${className(state, s)} con ${instructorName(state, s.instructorId)}, ${taken} de ${s.capacity}`}
                      className={cx("absolute flex flex-col gap-0.5 overflow-hidden rounded-xl border-l-[3px] px-2 py-1.5 text-left transition-[box-shadow,transform] duration-200 hover:z-10 hover:-translate-y-px hover:shadow-[0_10px_20px_-12px_rgba(29,27,25,0.45)]", focusRing,
                        cancelled ? "border-(--os-faint) bg-(--os-subtle) opacity-60" : "border-(--os-accent)", active && "z-10 ring-2 ring-(--os-accent)")}
                      style={{ top: top + 2, height: Math.max(30, s.minutes * (PX / 60) - 4), left: `calc(${(lane / n) * 100}% + 3px)`, width: `calc(${100 / n}% - 6px)`,
                        background: cancelled ? undefined : `color-mix(in srgb, var(--os-accent) ${10 + Math.round(pct * 22)}%, var(--os-paper))` }}>
                      <span className="os-num flex justify-between gap-1 text-[10.5px] font-semibold text-(--os-accent-ink)"><span>{fmtTime(s.start)}</span><span className={taken >= s.capacity ? "" : "font-medium text-(--os-muted)"}>{taken}/{s.capacity}</span></span>
                      <span className={cx("line-clamp-2 block text-[11.5px] font-semibold leading-[1.2]", cancelled && "line-through")}>{className(state, s)}</span>
                    </button>
                  );
                })}
                {today && nowTop > 0 && nowTop < hours.length * PX && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-20 flex items-center" style={{ top: nowTop }}>
                    <span className="-ml-1 size-2 rounded-full bg-(--os-accent)" /><span className="h-[1.5px] flex-1 bg-(--os-accent)" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
