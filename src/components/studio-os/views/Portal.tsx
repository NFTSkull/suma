"use client";

import { useId, useState } from "react";
import { studioDisplayName } from "@/lib/studio-os/catalog";
import { bookSession, cancelBooking, setPortalStudent, upcomingFor } from "@/lib/studio-os/engine";
import { className, instructorName, openSessions, planName, studentInfo } from "@/lib/studio-os/selectors";
import { fmtDate, fmtDay, fmtTime, sameDay } from "@/lib/studio-os/time";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Badge, Button, cx, Field, focusRing, inputClass, Meter, PageHeader } from "../ui";

type Tab = "clases" | "paquete" | "historial";

export function Portal() {
  const { state, apply, logo } = useStudio();
  const id = useId();
  const [tab, setTab] = useState<Tab>("clases");
  const info = studentInfo(state, state.portalStudentId);
  const upcoming = upcomingFor(state, info.student.id);
  const booked = new Map(upcoming.map((u) => [u.session.id, u.booking]));
  const sessions = openSessions(state, 7);
  const name = studioDisplayName(state.config);

  return (
    <>
      <PageHeader title="Así lo verían tus alumnas" description="Un portal de ejemplo conectado a la misma demo: si reserva aquí, cambia tu agenda, su ficha y tus reportes." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
        <div className="order-2 space-y-3 lg:order-1">
          <Field label="Ver el portal como" htmlFor={`${id}-st`} hint="Alumnas ficticias. No hay cuentas ni contraseñas.">
            <select id={`${id}-st`} className={inputClass} value={state.portalStudentId} onChange={(e) => apply(setPortalStudent(state, e.target.value))}>
              {[...state.students].sort((a, b) => a.name.localeCompare(b.name)).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <ul className="space-y-2 text-[13.5px] text-(--os-muted)">
            {["Reserva y cancela con las mismas reglas de tu estudio.", "Ve sus créditos y cuándo vence su paquete.", "Consulta su historial de clases."].map((t) => (
              <li key={t} className="flex gap-2"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-(--os-accent-ink)" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="order-1 mx-auto w-full max-w-[390px] lg:order-2">
          <div className="overflow-hidden rounded-[2rem] border-[6px] border-[#1F1C1A] bg-(--os-canvas) shadow-[0_24px_48px_-24px_rgba(31,28,26,0.45)]">
            <div className="bg-(--os-accent) px-5 pb-5 pt-6 text-white">
              <div className="flex items-center gap-2">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- imagen local en memoria
                  <img src={logo} alt="" className="size-7 rounded-md bg-white object-contain p-0.5" />
                ) : <span className="grid size-7 place-items-center rounded-md bg-white/20 text-xs font-bold">{name[0]}</span>}
                <span className="text-sm font-semibold">{name}</span>
              </div>
              <p className="os-display mt-4 text-[1.4rem] leading-tight">Hola, {info.student.name.split(" ")[0]}</p>
              <p className="mt-1 text-[13px] text-white/85">
                {info.canBook ? (info.credits === null ? "Clases ilimitadas" : `${info.credits} crédito${info.credits === 1 ? " disponible" : "s disponibles"}`) : "Sin paquete vigente"}
                {info.membership && info.canBook ? ` · vence el ${fmtDate(info.membership.end)}` : ""}
              </p>
            </div>
            <div role="tablist" aria-label="Portal" className="grid grid-cols-3 border-b border-(--os-line) bg-white">
              {([["clases", "Clases"], ["paquete", "Mi paquete"], ["historial", "Historial"]] as [Tab, string][]).map(([t, label]) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                  className={cx("min-h-11 border-b-2 text-[13px] font-semibold transition-colors duration-150", focusRing, tab === t ? "border-(--os-accent) text-(--os-ink)" : "border-transparent text-(--os-muted)")}>
                  {label}
                </button>
              ))}
            </div>
            <div role="tabpanel" className="h-[460px] overflow-y-auto p-3">
              {tab === "clases" && (
                <ul className="space-y-2">
                  {sessions.map(({ session: s, taken }) => {
                    const mine = booked.get(s.id);
                    const full = taken >= s.capacity;
                    return (
                      <li key={s.id} className="rounded-xl border border-(--os-line) bg-white p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-(--os-muted)">{sameDay(s.start, state.now) ? "Hoy" : fmtDay(s.start)} · {fmtTime(s.start)}</p>
                            <p className="truncate text-sm font-semibold">{className(state, s)}</p>
                            <p className="truncate text-[12px] text-(--os-muted)">{instructorName(state, s.instructorId)}</p>
                          </div>
                          {mine ? (
                            <Button size="sm" variant="ghost" onClick={() => apply(cancelBooking(state, mine.id))}>{mine.status === "espera" ? "Salir de espera" : "Cancelar"}</Button>
                          ) : (
                            <Button size="sm" variant={full ? "secondary" : "primary"} disabled={!info.canBook} onClick={() => apply(bookSession(state, s.id, info.student.id))}>
                              {full ? (state.settings.waitlist ? "Lista de espera" : "Llena") : "Reservar"}
                            </Button>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Meter value={taken} max={s.capacity} label="Lugares ocupados" />
                          <span className="shrink-0 text-[11.5px] tabular-nums text-(--os-muted)">{Math.max(0, s.capacity - taken)} libres</span>
                        </div>
                        {mine && <Badge tone="success" className="mt-2">{mine.status === "espera" ? "En lista de espera" : "Reservada"}</Badge>}
                      </li>
                    );
                  })}
                  {!info.canBook && <li className="rounded-xl bg-[#FDF6E9] p-3 text-[13px] text-[#7D5210]">Para reservar necesita un paquete vigente. Desde Membresías puedes venderle uno.</li>}
                </ul>
              )}
              {tab === "paquete" && (
                info.membership ? (
                  <div className="rounded-xl border border-(--os-line) bg-white p-4">
                    <p className="text-sm font-semibold">{planName(state, info.membership.planId)}</p>
                    <p className="text-[12.5px] text-(--os-muted)">Vigente del {fmtDate(info.membership.start)} al {fmtDate(info.membership.end)}</p>
                    {info.membership.creditsTotal !== null && (
                      <>
                        <p className="mt-4 text-[13px]"><strong className="tabular-nums">{info.membership.creditsTotal - info.membership.creditsUsed}</strong> de {info.membership.creditsTotal} clases disponibles</p>
                        <div className="mt-1.5"><Meter value={info.membership.creditsUsed} max={info.membership.creditsTotal} label="Clases usadas" /></div>
                      </>
                    )}
                    <p className="mt-4 text-[12.5px] text-(--os-muted)">Cancela con {state.settings.cancellationHours} h de anticipación para recuperar tu clase.</p>
                  </div>
                ) : <p className="p-3 text-sm text-(--os-muted)">Aún no tiene paquete.</p>
              )}
              {tab === "historial" && (
                info.history.length ? (
                  <ul className="divide-y divide-(--os-line) rounded-xl border border-(--os-line) bg-white">
                    {info.history.map(({ booking, session }) => (
                      <li key={booking.id} className="flex justify-between gap-3 px-3 py-2.5 text-[13px]">
                        <span className="min-w-0"><span className="block truncate font-medium">{className(state, session)}</span><span className="text-[12px] text-(--os-muted)">{fmtDay(session.start)} · {fmtTime(session.start)}</span></span>
                        <span className="shrink-0 text-(--os-muted)">{{ reservada: "Reservada", espera: "En espera", asistio: "Asistió", falta: "Faltó", cancelada: "Cancelada", cancelada_tarde: "Cancelada tarde" }[booking.status]}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="p-3 text-sm text-(--os-muted)">Sin clases esta semana.</p>
              )}
            </div>
          </div>
          <p className="mt-3 text-center text-[12.5px] text-(--os-muted)">Demostración: sin cuentas, contraseñas ni datos reales.</p>
        </div>
      </div>
    </>
  );
}
