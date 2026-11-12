"use client";

import { motion } from "motion/react";
import { studioDisplayName } from "@/lib/studio-os/catalog";
import { toggleTask } from "@/lib/studio-os/engine";
import { sessionTaken } from "@/lib/studio-os/rules";
import { className, dashboard, finance, instructorName, reports, roomName, visibleViews } from "@/lib/studio-os/selectors";
import { cap, fmtDate, fmtDay, fmtLongDay, fmtMoney, fmtPct, fmtRelative, fmtTime } from "@/lib/studio-os/time";
import { AreaChart, Ring } from "../charts";
import { useStudio } from "../context";
import { Icon, type IconName } from "../icons";
import { ease } from "../motion";
import { Badge, Button, Card, CardTitle, cx, Empty, focusRing, Meter } from "../ui";

const section = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease, delay: 0.05 + i * 0.07 } });

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
  const who = isInstructor ? instructorName(state, state.viewAsInstructorId).split(" ")[0] : studioDisplayName(state.config);
  const showMoney = !isInstructor && has("pagos") && views.includes("pagos");
  const f = showMoney ? finance(state) : null;
  const r = reports(state);
  const now = new Date(state.now);

  const kpis: { label: string; value: string | number; hint: string; icon: IconName; view: Parameters<typeof go>[0] }[] = [];
  if (has("clases")) {
    kpis.push({ icon: "calendar", label: "Clases hoy", value: d.today.length, hint: `${d.bookedToday} de ${d.capacityToday} lugares`, view: "agenda" });
    kpis.push({ icon: "check", label: "Asistencia hoy", value: started ? `${d.attendance.attended}/${started}` : "—", hint: d.attendance.pending ? `${d.attendance.pending} por registrar` : started ? "Lista al día" : "Aún no empieza ninguna", view: "agenda" });
    kpis.push({ icon: "clock", label: "Reservas próximas", value: d.upcomingReservations, hint: "En clases que no han empezado", view: "agenda" });
  }
  if (!isInstructor) kpis.push({ icon: "users", label: "Alumnas activas", value: d.activeStudents, hint: "Con paquete vigente", view: "alumnas" });
  if (!isInstructor && has("membresias")) kpis.push({ icon: "card", label: "Por vencer", value: d.expiring.length, hint: `En ${state.settings.expiryWarningDays} días o con 1 crédito`, view: "membresias" });
  if (!isInstructor && has("marketing")) kpis.push({ icon: "funnel", label: "Consultas pendientes", value: d.pendingLeads.length, hint: "Nuevas o contactadas", view: "ventas" });

  return (
    <>
      <motion.div {...section(0)} className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
        <div className="min-w-0">
          <p className="os-eyebrow text-(--os-accent-ink)">{cap(fmtLongDay(state.now))}</p>
          <h2 className="os-display mt-3 text-[2.25rem] leading-[1.02] sm:text-[2.8rem] lg:text-[3.4rem]">
            {greeting}, <em className="text-(--os-accent-ink)">{who}</em>
          </h2>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-(--os-muted)">
            {isInstructor ? "Estas son tus clases de hoy y quién viene a cada una." :
              attention.length ? `Tienes ${attention.length} cosa${attention.length === 1 ? "" : "s"} por resolver y ${d.today.length} clase${d.today.length === 1 ? "" : "s"} en agenda.` : "Todo está en orden. Así va tu estudio hoy."}
          </p>
        </div>
        {has("clases") && (
          <Button variant="primary" size="lg" icon={isInstructor ? "check" : "plus"} onClick={() => go("agenda")}>
            {isInstructor ? "Pasar lista" : "Reservar una clase"}
          </Button>
        )}
      </motion.div>

      {/* Indicadores: una sola banda editorial, cada cifra lleva a su sección */}
      {kpis.length > 0 && (
        <motion.div {...section(1)} className="overflow-hidden rounded-[22px] border border-(--os-line) bg-(--os-paper)">
          <div className={cx("grid grid-cols-2 [&>*]:border-(--os-line)", kpis.length >= 6 ? "lg:grid-cols-6" : kpis.length === 5 ? "lg:grid-cols-5" : kpis.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
            {kpis.map((k, i) => (
              <button key={k.label} type="button" onClick={() => go(k.view)}
                className={cx("group relative p-4 text-left transition-colors duration-200 hover:bg-(--os-ivory)/70 sm:p-5", focusRing,
                  i % 2 === 0 && "border-r", i < kpis.length - 2 && "border-b", "lg:border-b-0 lg:border-r lg:last:border-r-0")}>
                <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-(--os-muted)"><Icon name={k.icon} className="size-[14px] text-(--os-accent)" />{k.label}</span>
                <span className="os-num mt-3 block text-[2.1rem] font-medium leading-none text-(--os-ink) lg:text-[2.35rem]">{k.value}</span>
                <span className="mt-2 block text-[12px] leading-snug text-(--os-muted)">{k.hint}</span>
                <Icon name="arrowUpRight" className="absolute right-4 top-4 size-4 text-(--os-faint) opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          {has("clases") && (
            <motion.div {...section(2)}>
              <Card className="p-5 sm:p-6">
                <CardTitle hint={d.today.length ? "Toca una clase para ver su lista." : undefined} action={<Button size="sm" variant="ghost" iconRight="chevronRight" onClick={() => go("agenda")}>Agenda</Button>}>Hoy en el estudio</CardTitle>
                {d.today.length ? (
                  <ol className="relative mt-4">
                    {d.today.map((s, i) => {
                      const taken = sessionTaken(state, s.id);
                      const past = new Date(s.start) <= now;
                      const nowLine = !past && (i === 0 || new Date(d.today[i - 1].start) <= now);
                      return (
                        <li key={s.id}>
                          {nowLine && i > 0 && (
                            <div aria-hidden="true" className="flex items-center gap-2 py-1.5 pl-[3.6rem]">
                              <span className="size-2 rounded-full bg-(--os-accent)" /><span className="h-px flex-1 bg-(--os-accent)/40" /><span className="text-[11px] font-semibold text-(--os-accent-ink)">Ahora · {fmtTime(state.now)}</span>
                            </div>
                          )}
                          <button type="button" onClick={() => go("agenda", s.id)} className={cx("grid w-full grid-cols-[3.25rem_minmax(0,1fr)_6rem] items-center gap-3 rounded-2xl px-2 py-3 text-left transition-colors duration-200 hover:bg-(--os-ivory) sm:grid-cols-[3.25rem_minmax(0,1fr)_8rem]", focusRing)}>
                            <span className={cx("os-num text-[15px] font-semibold", past && "text-(--os-faint)")}>{fmtTime(s.start)}</span>
                            <span className="min-w-0">
                              <span className={cx("block truncate text-[15px] font-semibold", past && "text-(--os-muted)")}>{className(state, s)}</span>
                              <span className="block truncate text-[12.5px] text-(--os-muted)">{instructorName(state, s.instructorId)} · {roomName(state, s.roomId)} · {s.minutes} min</span>
                            </span>
                            <span className="text-right">
                              <span className="os-num block text-[12.5px] text-(--os-muted)"><span className="font-semibold text-(--os-ink)">{taken}</span>/{s.capacity}{taken >= s.capacity && <span className="ml-1.5 text-(--os-accent-ink)">Llena</span>}</span>
                              <span className="mt-1.5 block"><Meter value={taken} max={s.capacity} label={`Ocupación ${className(state, s)}`} /></span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="mt-4"><Empty icon="calendar" title="Hoy no hay clases" text="Crea una desde la agenda." action={<Button size="sm" onClick={() => go("agenda")}>Ir a la agenda</Button>} /></div>
                )}
              </Card>
            </motion.div>
          )}

          {f && (
            <motion.div {...section(3)}>
              <Card className="p-5 sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <CardTitle hint="Pagos recibidos por semana (ficticios).">Ingresos</CardTitle>
                    <p className="os-num mt-3 text-[2.2rem] font-medium leading-none">{fmtMoney(f.collectedMonth)}</p>
                    <p className="mt-1.5 text-[12.5px] text-(--os-muted)">
                      este mes · {f.collectedPrev ? <span className={f.collectedMonth >= f.collectedPrev ? "text-(--os-success)" : "text-(--os-danger)"}>{f.collectedMonth >= f.collectedPrev ? "▲" : "▼"} {fmtPct(Math.abs(f.collectedMonth - f.collectedPrev) / f.collectedPrev)}</span> : "—"} vs. mismos días del mes anterior
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" iconRight="chevronRight" onClick={() => go("pagos")}>Pagos</Button>
                </div>
                <div className="mt-4"><AreaChart label="Ingresos por semana" format={fmtMoney} points={f.weeks.map((w) => ({ label: fmtDate(w.from), value: w.total }))} /></div>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="min-w-0 space-y-5">
          {has("clases") && d.nextSession && (
            <motion.div {...section(2)}>
              <div className="relative overflow-hidden rounded-[22px] bg-(--os-accent) p-5 text-white sm:p-6">
                <span aria-hidden="true" className="absolute -right-12 -top-12 size-44 rounded-full bg-white/10" />
                <span aria-hidden="true" className="absolute -bottom-16 right-10 size-32 rounded-full bg-white/[0.06]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="os-eyebrow text-white/75">Próxima clase</p>
                    <p className="os-display mt-2 text-[1.75rem] leading-tight">{className(state, d.nextSession)}</p>
                    <p className="mt-1 text-[13px] text-white/80">{fmtDay(d.nextSession.start)} · {fmtTime(d.nextSession.start)} · {instructorName(state, d.nextSession.instructorId)}</p>
                  </div>
                  <Ring value={sessionTaken(state, d.nextSession.id)} max={d.nextSession.capacity} size={68} stroke={5} track="rgba(255,255,255,0.2)" color="#fff">
                    <span className="os-num text-[15px] font-semibold">{sessionTaken(state, d.nextSession.id)}<span className="text-white/60">/{d.nextSession.capacity}</span></span>
                  </Ring>
                </div>
                <div className="relative mt-5 flex items-center justify-between gap-3">
                  <span className="text-[13px] text-white/85">{d.nextSession.capacity - sessionTaken(state, d.nextSession.id) > 0 ? `${d.nextSession.capacity - sessionTaken(state, d.nextSession.id)} lugares libres` : "Llena"}</span>
                  <button type="button" onClick={() => go("agenda", d.nextSession!.id)} className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-(--os-accent-ink) transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Ver lista</button>
                </div>
              </div>
            </motion.div>
          )}

          {!isInstructor && (
            <motion.div {...section(3)}>
              <Card className="p-5 sm:p-6">
                <CardTitle hint="Lo que conviene resolver primero.">Requiere atención</CardTitle>
                {attention.length ? (
                  <ul className="mt-3 space-y-1">
                    {attention.map((a) => (
                      <li key={a.id}>
                        <button type="button" onClick={() => go(a.view)} className={cx("group flex min-h-12 w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-[14px] transition-colors hover:bg-(--os-ivory)", focusRing)}>
                          <span className={cx("grid size-8 shrink-0 place-items-center rounded-full", a.tone === "warn" ? "bg-(--os-warn-soft) text-(--os-warn)" : "bg-(--os-soft) text-(--os-accent-ink)")}>
                            <Icon name={a.tone === "warn" ? "alert" : "info"} className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1 font-medium">{a.text}</span>
                          <Icon name="chevronRight" className="size-4 text-(--os-faint) transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 flex items-center gap-2 text-sm text-(--os-success)"><Icon name="check" className="size-4" /> Todo al día. Buen trabajo.</p>
                )}
              </Card>
            </motion.div>
          )}

          {!isInstructor && has("clases") && (
            <motion.div {...section(4)}>
              <Card className="flex items-center gap-5 p-5 sm:p-6">
                <Ring value={Math.round((r.attendanceRate ?? 0) * 100)} max={100} size={76} stroke={6} color="var(--os-sage)" label="Asistencia">
                  <span className="os-num text-[15px] font-semibold">{r.attendanceRate === null ? "—" : fmtPct(r.attendanceRate)}</span>
                </Ring>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold">Asistencia de la semana</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-(--os-muted)">De las reservas ya registradas. La clase más pedida es <span className="text-(--os-ink)">{r.popular[0]?.name ?? "—"}</span>.</p>
                </div>
              </Card>
            </motion.div>
          )}

          {!isInstructor && (
            <motion.div {...section(5)}>
              <Card className="p-5 sm:p-6">
                <CardTitle hint="Se crean al mover interesados o guardar seguimientos.">Tareas</CardTitle>
                {d.tasks.length ? (
                  <ul className="mt-2">
                    {d.tasks.map((t) => (
                      <li key={t.id}>
                        <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg py-2 text-[14px]">
                          <input type="checkbox" checked={t.done} onChange={() => apply(toggleTask(state, t.id))} className="mt-0.5 size-[18px] rounded accent-(--os-accent)" />
                          <span className="min-w-0 flex-1">{t.text}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-(--os-muted)">Sin tareas pendientes.</p>
                )}
              </Card>
            </motion.div>
          )}

          <motion.div {...section(6)}>
            <Card className="p-5 sm:p-6">
              <CardTitle>Actividad reciente</CardTitle>
              <ol className="relative mt-4 space-y-4 before:absolute before:bottom-1 before:left-[3px] before:top-1 before:w-px before:bg-(--os-line)">
                {d.activity.map((a) => (
                  <li key={a.id} className="relative flex gap-3 pl-0 text-[13.5px]">
                    <span aria-hidden="true" className={cx("relative mt-1.5 size-[7px] shrink-0 rounded-full ring-4 ring-(--os-paper)", a.kind === "automatizacion" ? "bg-[#C4A15A]" : "bg-(--os-accent)")} />
                    <span className="min-w-0 flex-1">
                      {a.text}
                      <span className="mt-0.5 block text-[12px] text-(--os-muted)">{fmtRelative(a.at, state.now)}{a.kind === "automatizacion" && <> · <Badge tone="warn" className="!py-0 !text-[10.5px]">Simulado</Badge></>}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
