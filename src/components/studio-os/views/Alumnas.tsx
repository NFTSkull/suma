"use client";

import { useId, useState } from "react";
import { addStudent, cancelBooking, pauseMembership, renewMembership, resumeMembership, updateStudent } from "@/lib/studio-os/engine";
import { className, planName, scopedSessions, statusLabel, studentInfo } from "@/lib/studio-os/selectors";
import { fmtDate, fmtDay, fmtPct, fmtTime } from "@/lib/studio-os/time";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Avatar, Badge, Button, Card, cx, DetailPanel, Empty, Field, focusRing, inputClass, Meter, PageHeader, Segmented } from "../ui";
import { SellForm, statusTone } from "./shared";

type Filter = "todas" | "activa" | "por_vencer" | "agotada" | "pausada" | "vencida" | "sin";
const filters: { value: Filter; label: string }[] = [
  { value: "todas", label: "Todas" }, { value: "activa", label: "Activas" }, { value: "por_vencer", label: "Por vencer" },
  { value: "agotada", label: "Sin créditos" }, { value: "pausada", label: "Pausadas" }, { value: "vencida", label: "Vencidas" }, { value: "sin", label: "Sin membresía" },
];

export function Alumnas() {
  const { state, apply, target } = useStudio();
  const id = useId();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todas");
  const [selected, setSelected] = useState<string | null>(target && state.students.some((s) => s.id === target) ? target : null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const isInstructor = state.role === "instructor";

  const mine = isInstructor
    ? new Set(state.bookings.filter((b) => scopedSessions(state).some((s) => s.id === b.sessionId)).map((b) => b.studentId))
    : null;
  const infos = state.students.filter((s) => !mine || mine.has(s.id)).map((s) => studentInfo(state, s.id));
  const count = (f: Filter) => (f === "todas" ? infos.length : infos.filter((i) => (f === "sin" ? i.status === "sin" || i.status === "cancelada" : i.status === f)).length);
  const normalized = query.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const list = infos
    .filter((i) => filter === "todas" || (filter === "sin" ? i.status === "sin" || i.status === "cancelada" : i.status === filter))
    .filter((i) => !normalized || `${i.student.name} ${i.student.tags.join(" ")}`.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(normalized))
    .sort((a, b) => a.student.name.localeCompare(b.student.name));

  const create = () => {
    const before = new Set(state.students.map((s) => s.id));
    const result = addStudent(state, newName);
    if (apply(result)) {
      setNewName("");
      setAdding(false);
      setSelected(result.state.students.find((s) => !before.has(s.id))?.id ?? null);
    }
  };

  return (
    <>
      <PageHeader
        title="Alumnas"
        description={isInstructor ? "Alumnas inscritas en tus clases de esta semana." : `${infos.length} fichas. Busca, filtra y abre una para ver todo.`}
        action={!isInstructor && <Button variant="primary" icon={adding ? "x" : "plus"} onClick={() => setAdding((v) => !v)}>{adding ? "Cerrar" : "Nueva alumna"}</Button>}
      />
      {adding && (
        <Card className="os-fade mb-4 p-4">
          <Field label="Nombre" htmlFor={`${id}-new`} hint="Usa un nombre ficticio: esta demo no guarda datos reales.">
            <div className="flex gap-2">
              <input id={`${id}-new`} className={inputClass} value={newName} maxLength={40} placeholder="Ej. Alumna de prueba" autoComplete="off"
                onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") create(); }} />
              <Button variant="primary" onClick={create} disabled={!newName.trim()}>Agregar</Button>
            </div>
          </Field>
        </Card>
      )}

      <div className={cx("grid gap-4", selected && "lg:grid-cols-[minmax(0,1fr)_440px]")}>
        <div className="min-w-0">
          <div className="mb-3 flex flex-col gap-3">
            <div className="relative">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-(--os-muted)" />
              <label htmlFor={`${id}-q`} className="sr-only">Buscar alumna</label>
              <input id={`${id}-q`} type="search" className={cx(inputClass, "pl-10")} placeholder="Buscar por nombre o etiqueta" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {!isInstructor && <Segmented label="Filtrar por estado" value={filter} onChange={setFilter} options={filters.map((f) => ({ ...f, count: count(f.value) }))} />}
          </div>
          {list.length ? (
            <Card as="div" className="overflow-hidden">
              <ul className="divide-y divide-(--os-line)">
                {list.map((i) => (
                  <li key={i.student.id}>
                    <button type="button" onClick={() => setSelected(i.student.id)} aria-current={selected === i.student.id ? "true" : undefined}
                      className={cx("flex w-full items-center gap-3 px-3 py-3 text-left transition-colors duration-150 sm:px-4", focusRing, selected === i.student.id ? "bg-(--os-soft)/60" : "hover:bg-(--os-subtle)")}>
                      <Avatar name={i.student.name} hue={i.student.hue} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{i.student.name}</span>
                        <span className="block truncate text-[12.5px] text-(--os-muted)">
                          {i.membership ? planName(state, i.membership.planId) : "Sin paquete"}
                          {!isInstructor && i.canBook && ` · ${i.credits === null ? "ilimitado" : `${i.credits} crédito${i.credits === 1 ? "" : "s"}`}`}
                        </span>
                      </span>
                      <span className="hidden text-right text-[12.5px] text-(--os-muted) md:block">{i.lastVisit ? `Vino el ${fmtDate(i.lastVisit)}` : "Sin visitas"}</span>
                      {!isInstructor && <Badge tone={statusTone[i.status]}>{statusLabel[i.status]}</Badge>}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <Empty icon="users" title="Sin resultados" text="Prueba con otro nombre o quita el filtro." action={<Button size="sm" onClick={() => { setQuery(""); setFilter("todas"); }}>Limpiar búsqueda</Button>} />
          )}
        </div>
        {selected && state.students.some((s) => s.id === selected) && <StudentDetail key={selected} id={selected} onClose={() => setSelected(null)} />}
      </div>
    </>
  );
}

function StudentDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { state, apply } = useStudio();
  const fid = useId();
  const info = studentInfo(state, id);
  const { student, membership } = info;
  const isInstructor = state.role === "instructor";
  const canManage = !isInstructor && state.config.modules.includes("membresias");
  const [notes, setNotes] = useState(student.notes);
  const [tag, setTag] = useState("");
  const [follow, setFollow] = useState("");
  const [selling, setSelling] = useState(false);

  return (
    <DetailPanel title={student.name} onClose={onClose} closeLabel="Alumnas">
      <div className="flex items-center gap-3">
        <Avatar name={student.name} hue={student.hue} size="lg" />
        <div className="min-w-0">
          <p className="os-display truncate text-[1.4rem] leading-tight">{student.name}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {!isInstructor && <Badge tone={statusTone[info.status]}>{statusLabel[info.status]}</Badge>}
            {student.tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        {[
          ["Créditos", !info.canBook ? "0" : info.credits === null ? "Ilimitado" : String(info.credits)],
          ["Clases reservadas", String(info.upcoming.length)],
          ["Asistencia", info.attendanceRate === null ? "—" : `${fmtPct(info.attendanceRate)} · ${info.visits} visitas`],
          ["Última visita", info.lastVisit ? fmtDate(info.lastVisit) : "Aún no viene"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-(--os-subtle) p-3">
            <dt className="text-[12px] text-(--os-muted)">{k}</dt>
            <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      {!isInstructor && (
        <section aria-label="Membresía" className="mt-4 rounded-xl border border-(--os-line) p-3">
          {membership ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{planName(state, membership.planId)}</p>
                  <p className="text-[12.5px] text-(--os-muted)">{info.status === "vencida" ? "Venció" : "Vence"} el {fmtDate(membership.end)}{membership.status === "pausada" ? " · pausada" : ""}</p>
                </div>
                {membership.creditsTotal !== null && <span className="text-[12.5px] tabular-nums text-(--os-muted)">{membership.creditsUsed}/{membership.creditsTotal} usadas</span>}
              </div>
              {membership.creditsTotal !== null && <div className="mt-2"><Meter value={membership.creditsUsed} max={membership.creditsTotal} label="Créditos usados" /></div>}
            </>
          ) : (
            <p className="text-sm text-(--os-muted)">Sin paquete. Véndele uno para que pueda reservar.</p>
          )}
          {canManage && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant={membership && info.canBook ? "secondary" : "primary"} icon="plus" onClick={() => setSelling((v) => !v)}>Vender paquete</Button>
              {membership && membership.status !== "cancelada" && <Button size="sm" icon="restore" onClick={() => apply(renewMembership(state, membership.id))}>Renovar</Button>}
              {membership?.status === "activa" && info.status !== "vencida" && <Button size="sm" icon="pause" onClick={() => apply(pauseMembership(state, membership.id, 14))}>Pausar 14 días</Button>}
              {membership?.status === "pausada" && <Button size="sm" icon="play" onClick={() => apply(resumeMembership(state, membership.id))}>Reactivar</Button>}
            </div>
          )}
          {selling && <div className="mt-3"><SellForm studentId={student.id} onDone={() => setSelling(false)} /></div>}
        </section>
      )}

      <h4 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--os-muted)">Próximas clases</h4>
      {info.upcoming.length ? (
        <ul className="mt-2 space-y-1.5">
          {info.upcoming.map(({ booking, session }) => (
            <li key={booking.id} className="flex items-center gap-3 rounded-xl bg-(--os-subtle) px-3 py-2 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{className(state, session)}</span>
                <span className="block text-[12px] text-(--os-muted)">{fmtDay(session.start)} · {fmtTime(session.start)}{booking.status === "espera" ? " · lista de espera" : ""}</span>
              </span>
              {!isInstructor && <Button size="sm" variant="ghost" onClick={() => apply(cancelBooking(state, booking.id))}>Cancelar</Button>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-(--os-muted)">Sin clases reservadas.</p>
      )}

      {!isInstructor && (
        <>
          <h4 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--os-muted)">Etiquetas</h4>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {student.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-(--os-subtle) py-1 pl-3 pr-1 text-[13px]">
                {t}
                <button type="button" aria-label={`Quitar etiqueta ${t}`} onClick={() => apply(updateStudent(state, id, { tags: student.tags.filter((x) => x !== t) }))}
                  className={cx("grid size-6 place-items-center rounded-full hover:bg-white", focusRing)}><Icon name="x" className="size-3.5" /></button>
              </span>
            ))}
            <form className="flex gap-1.5" onSubmit={(e) => { e.preventDefault(); const v = tag.trim().slice(0, 24); if (v && !student.tags.includes(v)) { apply(updateStudent(state, id, { tags: [...student.tags, v] })); setTag(""); } }}>
              <label htmlFor={`${fid}-tag`} className="sr-only">Nueva etiqueta</label>
              <input id={`${fid}-tag`} className={cx(inputClass, "h-9 w-36")} placeholder="Nueva etiqueta" value={tag} onChange={(e) => setTag(e.target.value)} />
              <Button size="sm" type="submit" disabled={!tag.trim()}>Añadir</Button>
            </form>
          </div>

          <Field label="Notas internas" htmlFor={`${fid}-notes`} hint="Solo las ve tu equipo; los instructores no." className="mt-5">
            <textarea id={`${fid}-notes`} rows={3} maxLength={300} className={cx(inputClass, "h-auto py-2.5")} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej. Prefiere el reformer junto a la ventana." />
          </Field>
          <div className="mt-2 flex justify-end"><Button size="sm" disabled={notes === student.notes} onClick={() => apply(updateStudent(state, id, { notes }))}>Guardar notas</Button></div>

          <Field label="Seguimiento pendiente" htmlFor={`${fid}-follow`} hint={student.followUp ? `Actual: ${student.followUp}` : "Se agrega a tus tareas de Inicio."} className="mt-3">
            <div className="flex gap-2">
              <input id={`${fid}-follow`} className={inputClass} maxLength={80} value={follow} onChange={(e) => setFollow(e.target.value)} placeholder="Ej. Ofrecerle el paquete de 20" />
              <Button size="md" disabled={!follow.trim()} onClick={() => { if (apply(updateStudent(state, id, { followUp: follow.trim() }))) setFollow(""); }}>Guardar</Button>
            </div>
          </Field>
        </>
      )}

      <h4 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--os-muted)">Historial de esta semana</h4>
      {info.history.length ? (
        <ul className="mt-2 space-y-1 text-[13px]">
          {info.history.slice(0, 8).map(({ booking, session }) => (
            <li key={booking.id} className="flex justify-between gap-3 py-1">
              <span className="min-w-0 truncate">{fmtDay(session.start)} · {className(state, session)}</span>
              <span className="shrink-0 text-(--os-muted)">{{ reservada: "Reservada", espera: "En espera", asistio: "Asistió", falta: "Faltó", cancelada: "Canceló", cancelada_tarde: "Canceló tarde" }[booking.status]}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-(--os-muted)">Sin movimientos esta semana. Antes vino {student.pastVisits} veces.</p>
      )}
    </DetailPanel>
  );
}
