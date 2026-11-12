"use client";

import { studioDisplayName } from "@/lib/studio-os/catalog";
import { toggleTask } from "@/lib/studio-os/engine";
import { sessionTaken } from "@/lib/studio-os/rules";
import { className, dashboard, instructorName, roomName, visibleViews } from "@/lib/studio-os/selectors";
import { fmtDay, fmtLongDay, fmtRelative, fmtTime } from "@/lib/studio-os/time";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Badge, Button, Card, CardTitle, cx, Empty, focusRing, Meter, PageHeader, Stat } from "../ui";

export function Inicio() {
  const { state, go, apply } = useStudio();
  const d = dashboard(state);
  const has = (m: string) => state.config.modules.includes(m as never);
  const isInstructor = state.role === "instructor";
  const hour = new Date(state.now).getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const started = d.attendance.attended + d.attendance.missed + d.attendance.pending;
  const views = visibleViews(state);
  const attention = d.attention.filter((a) => views.includes(a.view));

  return (
    <>
      <PageHeader
        title={`${greeting}, ${isInstructor ? instructorName(state, state.viewAsInstructorId).split(" ")[0] : studioDisplayName(state.config)}`}
        description={<>Hoy es {fmtLongDay(state.now)}. {isInstructor ? "Estas son tus clases." : "Esto es lo que pasa en tu estudio."}</>}
        action={has("clases") && (
          <Button variant="primary" icon={isInstructor ? "check" : "plus"} onClick={() => go("agenda")}>
            {isInstructor ? "Pasar lista" : "Reservar una clase"}
          </Button>
        )}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {has("clases") && <Stat icon="calendar" label="Clases hoy" value={d.today.length} hint={`${d.bookedToday} de ${d.capacityToday} lugares`} onClick={() => go("agenda")} />}
        {has("clases") && <Stat icon="check" label="Asistencia hoy" value={started ? `${d.attendance.attended}/${started}` : "—"} hint={d.attendance.pending ? `${d.attendance.pending} por registrar` : started ? "Lista al día" : "Aún no empieza ninguna"} onClick={() => go("agenda")} />}
        {has("clases") && <Stat icon="clock" label="Reservas próximas" value={d.upcomingReservations} hint="En clases que no han empezado" onClick={() => go("agenda")} />}
        {!isInstructor && <Stat icon="users" label="Alumnas activas" value={d.activeStudents} hint="Con paquete vigente" onClick={() => go("alumnas")} />}
        {!isInstructor && has("membresias") && <Stat icon="card" label="Por vencer" value={d.expiring.length} hint={`En ${state.settings.expiryWarningDays} días o con 1 crédito`} onClick={() => go("membresias")} />}
        {!isInstructor && has("marketing") && <Stat icon="funnel" label="Consultas pendientes" value={d.pendingLeads.length} hint="Nuevas o contactadas" onClick={() => go("ventas")} />}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          {!isInstructor && (
            <Card className="p-4 sm:p-5">
              <CardTitle hint="Lo que conviene resolver primero.">Requiere atención</CardTitle>
              {attention.length ? (
                <ul className="mt-3 divide-y divide-(--os-line)">
                  {attention.map((a) => (
                    <li key={a.id}>
                      <button type="button" onClick={() => go(a.view)} className={cx("flex min-h-12 w-full items-center gap-3 rounded-lg py-2 text-left text-sm", focusRing)}>
                        <span className={cx("grid size-8 shrink-0 place-items-center rounded-full", a.tone === "warn" ? "bg-[#FBEFD9] text-[#7D5210]" : "bg-(--os-soft) text-(--os-accent-ink)")}>
                          <Icon name={a.tone === "warn" ? "alert" : "info"} className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1 font-medium">{a.text}</span>
                        <Icon name="chevronRight" className="size-4 text-(--os-muted)" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 flex items-center gap-2 text-sm text-[#25603D]"><Icon name="check" className="size-4" /> Todo al día. Buen trabajo.</p>
              )}
            </Card>
          )}

          {has("clases") && (
            <Card className="p-4 sm:p-5">
              <CardTitle hint={d.today.length ? "Toca una clase para ver su lista." : undefined} action={<Button size="sm" variant="ghost" iconRight="chevronRight" onClick={() => go("agenda")}>Agenda</Button>}>Clases de hoy</CardTitle>
              {d.today.length ? (
                <ul className="mt-3 space-y-1">
                  {d.today.map((s) => {
                    const taken = sessionTaken(state, s.id);
                    const past = new Date(s.start) <= new Date(state.now);
                    return (
                      <li key={s.id}>
                        <button type="button" onClick={() => go("agenda", s.id)} className={cx("grid w-full grid-cols-[3.25rem_minmax(0,1fr)_5.5rem] items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors duration-150 hover:bg-(--os-subtle)", focusRing)}>
                          <span className={cx("text-sm font-semibold tabular-nums", past && "text-(--os-muted)")}>{fmtTime(s.start)}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{className(state, s)}</span>
                            <span className="block truncate text-[12.5px] text-(--os-muted)">{instructorName(state, s.instructorId)} · {roomName(state, s.roomId)}</span>
                          </span>
                          <span className="text-right">
                            <span className="block text-[12.5px] tabular-nums text-(--os-muted)">{taken}/{s.capacity}</span>
                            <Meter value={taken} max={s.capacity} label={`Ocupación ${className(state, s)}`} />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <Empty icon="calendar" title="Hoy no hay clases" text="Crea una desde la agenda." action={<Button size="sm" onClick={() => go("agenda")}>Ir a la agenda</Button>} />
              )}
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {has("clases") && d.nextSession && (
            <Card className="overflow-hidden">
              <div className="bg-(--os-soft) px-4 py-4 sm:px-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-(--os-accent-ink)">Próxima clase</p>
                <p className="os-display mt-1 text-[1.35rem] leading-tight">{className(state, d.nextSession)}</p>
                <p className="mt-1 text-[13px] text-(--os-accent-ink)">{fmtDay(d.nextSession.start)} · {fmtTime(d.nextSession.start)} · {instructorName(state, d.nextSession.instructorId)}</p>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <span className="text-sm"><strong className="tabular-nums">{sessionTaken(state, d.nextSession.id)}</strong> de {d.nextSession.capacity} lugares</span>
                <Button size="sm" variant="soft" onClick={() => go("agenda", d.nextSession!.id)}>Ver lista</Button>
              </div>
            </Card>
          )}

          {!isInstructor && (
            <Card className="p-4 sm:p-5">
              <CardTitle hint="Se crean al mover interesados o guardar seguimientos.">Tareas</CardTitle>
              {d.tasks.length ? (
                <ul className="mt-2">
                  {d.tasks.map((t) => (
                    <li key={t.id}>
                      <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg py-2 text-sm">
                        <input type="checkbox" checked={t.done} onChange={() => apply(toggleTask(state, t.id))} className="mt-0.5 size-[18px] accent-(--os-accent)" />
                        <span className="min-w-0 flex-1">{t.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-(--os-muted)">Sin tareas pendientes.</p>
              )}
            </Card>
          )}

          <Card className="p-4 sm:p-5">
            <CardTitle>Actividad reciente</CardTitle>
            <ol className="mt-3 space-y-3">
              {d.activity.map((a) => (
                <li key={a.id} className="flex gap-3 text-[13.5px]">
                  <span aria-hidden="true" className={cx("mt-1.5 size-2 shrink-0 rounded-full", a.kind === "automatizacion" ? "bg-[#C4A15A]" : "bg-(--os-accent)")} />
                  <span className="min-w-0 flex-1">
                    {a.text}
                    <span className="block text-[12px] text-(--os-muted)">{fmtRelative(a.at, state.now)}{a.kind === "automatizacion" && <> · <Badge tone="warn" className="!py-0 !text-[10.5px]">Simulado</Badge></>}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}

