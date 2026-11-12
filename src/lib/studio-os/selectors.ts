import { modules, roles } from "./catalog";
import { creditsLeft, membershipStatus, occupies, type MembershipStatus, sessionTaken, sessionWaitlist } from "./rules";
import { addDays, daysBetween, fmtDate, sameDay, startOfWeek } from "./time";
import type { AutomationId, DemoState, Membership, PlanKind, Session, ViewId } from "./types";

/** Todos los indicadores se calculan aquí a partir del estado: no hay números fijos. */

export function visibleViews(state: DemoState): ViewId[] {
  const moduleViews = new Map<ViewId, boolean>();
  for (const [id, m] of Object.entries(modules)) for (const v of m.views) moduleViews.set(v, moduleViews.get(v) || state.config.modules.includes(id as never));
  return roles[state.role].views.filter((v) => !moduleViews.has(v) || moduleViews.get(v));
}

const live = (s: Session) => s.status === "programada";
/** Con el rol Instructor solo se ven sus clases. */
export const scopedSessions = (state: DemoState) =>
  state.role === "instructor" ? state.sessions.filter((s) => s.instructorId === state.viewAsInstructorId) : state.sessions;

export const className = (state: DemoState, s: Session) => state.classTypes.find((c) => c.id === s.classTypeId)?.name ?? "Clase";
export const instructorName = (state: DemoState, id: string) => state.instructors.find((i) => i.id === id)?.name ?? "Sin asignar";
export const roomName = (state: DemoState, id: string) => state.rooms.find((r) => r.id === id)?.name ?? "Sala";
export const studentName = (state: DemoState, id: string) => state.students.find((s) => s.id === id)?.name ?? "Alumna";
export const planName = (state: DemoState, id: PlanKind) => state.plans.find((p) => p.id === id)?.name ?? id;

export const statusLabel: Record<MembershipStatus | "sin", string> = {
  activa: "Activa", por_vencer: "Por vencer", agotada: "Sin créditos", pausada: "Pausada", vencida: "Vencida", cancelada: "Cancelada", sin: "Sin membresía",
};

/** Membresía que representa a la alumna hoy: la vigente que vence primero o, si no hay, la más reciente. */
export function currentMembership(state: DemoState, studentId: string): Membership | undefined {
  const own = state.memberships.filter((m) => m.studentId === studentId && m.status !== "cancelada");
  const usable = own.filter((m) => ["activa", "por_vencer"].includes(membershipStatus(m, state.now, state.settings.expiryWarningDays)));
  if (usable.length) return usable.sort((a, b) => a.end.localeCompare(b.end))[0];
  return own.sort((a, b) => b.end.localeCompare(a.end))[0];
}

export function studentInfo(state: DemoState, studentId: string) {
  const student = state.students.find((s) => s.id === studentId)!;
  const membership = currentMembership(state, studentId);
  const status: MembershipStatus | "sin" = membership ? membershipStatus(membership, state.now, state.settings.expiryWarningDays) : "sin";
  const own = state.bookings.filter((b) => b.studentId === studentId);
  const withSession = own.map((b) => ({ booking: b, session: state.sessions.find((s) => s.id === b.sessionId)! })).filter((x) => x.session);
  const attended = withSession.filter((x) => x.booking.status === "asistio");
  const missed = withSession.filter((x) => x.booking.status === "falta").length;
  const upcoming = withSession
    .filter((x) => (x.booking.status === "reservada" || x.booking.status === "espera") && new Date(x.session.start) > new Date(state.now))
    .sort((a, b) => a.session.start.localeCompare(b.session.start));
  const lastAttended = attended.map((x) => x.session.start).sort().at(-1);
  const lastVisit = [lastAttended, student.lastVisitBefore].filter(Boolean).sort().at(-1) ?? null;
  const visits = student.pastVisits + attended.length;
  const rateBase = visits + missed;
  const credits = membership && status !== "vencida" && status !== "pausada" ? creditsLeft(membership) : 0;
  return {
    student, membership, status, credits, upcoming, visits, missed, lastVisit,
    attendanceRate: rateBase ? visits / rateBase : null,
    history: withSession.sort((a, b) => b.session.start.localeCompare(a.session.start)),
    canBook: status === "activa" || status === "por_vencer",
  };
}

export function dashboard(state: DemoState) {
  const now = new Date(state.now);
  const sessions = scopedSessions(state).filter(live);
  const today = sessions.filter((s) => sameDay(s.start, now)).sort((a, b) => a.start.localeCompare(b.start));
  const todayIds = new Set(today.map((s) => s.id));
  const todayBookings = state.bookings.filter((b) => todayIds.has(b.sessionId) && occupies(b));
  const started = new Set(today.filter((s) => new Date(s.start) <= now).map((s) => s.id));
  const futureIds = new Set(sessions.filter((s) => new Date(s.start) > now).map((s) => s.id));
  const memberships = state.memberships.map((m) => ({ m, status: membershipStatus(m, state.now, state.settings.expiryWarningDays) }));
  const activeStudents = new Set(memberships.filter((x) => x.status === "activa" || x.status === "por_vencer").map((x) => x.m.studentId));
  const expiring = memberships.filter((x) => x.status === "por_vencer");
  const pendingLeads = state.leads.filter((l) => l.stage === "nuevo" || l.stage === "contactado");
  const attendance = {
    attended: todayBookings.filter((b) => started.has(b.sessionId) && b.status === "asistio").length,
    missed: todayBookings.filter((b) => started.has(b.sessionId) && b.status === "falta").length,
    pending: todayBookings.filter((b) => started.has(b.sessionId) && b.status === "reservada").length,
  };
  const pendingPayments = state.transactions.filter((t) => t.status === "pendiente");
  const fullWithWaitlist = sessions.filter((s) => futureIds.has(s.id) && sessionWaitlist(state, s.id).length > 0);
  const nextSession = sessions.filter((s) => new Date(s.start) > now).sort((a, b) => a.start.localeCompare(b.start))[0];

  const attention: { id: string; text: string; view: ViewId; tone: "warn" | "info" }[] = [];
  if (attendance.pending) attention.push({ id: "asistencia", text: `${attendance.pending} asistencia${attendance.pending === 1 ? "" : "s"} por registrar en clases de hoy`, view: "agenda", tone: "warn" });
  if (pendingPayments.length) attention.push({ id: "pagos", text: `${pendingPayments.length} pago${pendingPayments.length === 1 ? "" : "s"} pendiente${pendingPayments.length === 1 ? "" : "s"} de cobro`, view: "pagos", tone: "warn" });
  if (expiring.length) attention.push({ id: "vencen", text: `${expiring.length} membresía${expiring.length === 1 ? "" : "s"} por vencer o con un crédito`, view: "membresias", tone: "info" });
  if (fullWithWaitlist.length) attention.push({ id: "espera", text: `${fullWithWaitlist.length} clase${fullWithWaitlist.length === 1 ? "" : "s"} llena${fullWithWaitlist.length === 1 ? "" : "s"} con lista de espera`, view: "agenda", tone: "info" });
  const fresh = state.leads.filter((l) => l.stage === "nuevo").length;
  if (fresh) attention.push({ id: "leads", text: `${fresh} interesado${fresh === 1 ? "" : "s"} sin contactar`, view: "ventas", tone: "warn" });

  return {
    today,
    capacityToday: today.reduce((sum, s) => sum + s.capacity, 0),
    bookedToday: todayBookings.length,
    upcomingReservations: state.bookings.filter((b) => futureIds.has(b.sessionId) && b.status === "reservada").length,
    activeStudents: activeStudents.size,
    expiring,
    pendingLeads,
    attendance,
    nextSession,
    pendingPayments,
    attention,
    tasks: state.tasks.filter((t) => !t.done).slice(0, 5),
    activity: state.activity.slice(0, 6),
  };
}

export type AutomationTarget = { name: string; detail: string };
export function previewAutomation(state: DemoState, id: AutomationId): AutomationTarget[] {
  const now = state.now;
  switch (id) {
    case "vencimiento":
      return state.memberships
        .filter((m) => membershipStatus(m, now, state.settings.expiryWarningDays) === "por_vencer")
        .map((m) => ({ name: studentName(state, m.studentId), detail: creditsLeft(m) === 1 ? "le queda 1 crédito" : `vence el ${fmtDate(m.end)}` }));
    case "bienvenida":
      return state.students.filter((s) => daysBetween(s.joinedAt, now) <= 7).map((s) => ({ name: s.name, detail: `se registró el ${fmtDate(s.joinedAt)}` }));
    case "sin_reserva":
      return state.leads
        .filter((l) => l.stage === "nuevo" || l.stage === "contactado")
        .map((l) => ({ name: l.name, detail: `preguntó por ${l.interest} el ${fmtDate(l.createdAt)}` }));
    case "inactiva":
      return state.students
        .map((s) => studentInfo(state, s.id))
        .filter((i) => i.canBook && (!i.lastVisit || daysBetween(i.lastVisit, now) > 14))
        .map((i) => ({ name: i.student.name, detail: i.lastVisit ? `última visita el ${fmtDate(i.lastVisit)}` : "aún no ha venido" }));
    case "clase_cancelada": {
      const cancelled = new Set(state.sessions.filter((s) => s.status === "cancelada" && new Date(s.start) > new Date(now)).map((s) => s.id));
      return state.bookings
        .filter((b) => cancelled.has(b.sessionId) && b.status === "cancelada")
        .map((b) => {
          const s = state.sessions.find((x) => x.id === b.sessionId)!;
          return { name: studentName(state, b.studentId), detail: `${className(state, s)} del ${fmtDate(s.start)}` };
        });
    }
  }
}

export function instructorStats(state: DemoState, id: string) {
  const now = new Date(state.now);
  const rate = state.instructors.find((i) => i.id === id)?.ratePerClass ?? 0;
  const own = state.sessions.filter((s) => s.instructorId === id && live(s)).sort((a, b) => a.start.localeCompare(b.start));
  const taught = own.filter((s) => new Date(s.start) <= now).length;
  const substitutions = own.filter((s) => s.substituteFor).length;
  return { sessions: own, taught, upcoming: own.length - taught, substitutions, feesTaught: taught * rate, feesWeek: own.length * rate };
}

export function finance(state: DemoState) {
  const now = new Date(state.now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const inRange = (at: string, from: Date, to: Date) => new Date(at) >= from && new Date(at) < to;
  const paid = state.transactions.filter((t) => t.status === "pagado");
  const month = paid.filter((t) => inRange(t.at, monthStart, addDays(now, 1)));
  // Mismo número de días del mes anterior, para comparar periodos equivalentes.
  const prevSameDay = new Date(prevStart.getTime() + (now.getTime() - monthStart.getTime()));
  const prev = paid.filter((t) => inRange(t.at, prevStart, prevSameDay < monthStart ? prevSameDay : monthStart));
  const sum = (list: typeof paid) => list.reduce((acc, t) => acc + t.amount, 0);
  const pending = state.transactions.filter((t) => t.status === "pendiente");
  const byPlan = new Map<string, number>();
  for (const t of month) if (t.kind !== "reembolso" && t.planId) byPlan.set(planName(state, t.planId), (byPlan.get(planName(state, t.planId)) ?? 0) + t.amount);
  const weekStart = startOfWeek(now);
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const from = addDays(weekStart, -7 * (7 - i));
    const to = addDays(from, 7);
    return { from: from.toISOString(), total: sum(paid.filter((t) => inRange(t.at, from, to))) };
  });
  return {
    collectedMonth: sum(month),
    collectedPrev: sum(prev),
    pendingTotal: pending.reduce((acc, t) => acc + t.amount, 0),
    pendingCount: pending.length,
    refundsMonth: -sum(month.filter((t) => t.kind === "reembolso")),
    renewalsMonth: month.filter((t) => t.kind === "renovacion").length,
    discountsMonth: month.filter((t) => t.kind !== "reembolso").reduce((acc, t) => acc + (t.listPrice - t.amount), 0),
    byPlan: [...byPlan.entries()].map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total),
    weeks,
  };
}

export function reports(state: DemoState) {
  const now = new Date(state.now);
  const week = state.sessions.filter(live);
  const occupancy = state.classTypes
    .map((c) => {
      const list = week.filter((s) => s.classTypeId === c.id);
      const capacity = list.reduce((acc, s) => acc + s.capacity, 0);
      const booked = list.reduce((acc, s) => acc + sessionTaken(state, s.id), 0);
      return { name: c.name, sessions: list.length, booked, capacity, rate: capacity ? booked / capacity : 0 };
    })
    .filter((x) => x.sessions);
  const marked = state.bookings.filter((b) => b.status === "asistio" || b.status === "falta");
  const attendanceRate = marked.length ? marked.filter((b) => b.status === "asistio").length / marked.length : null;
  const monthAgo = addDays(now, -30).toISOString();
  const wasActive = new Set(state.memberships.filter((m) => m.status !== "cancelada" && m.start <= monthAgo && m.end >= monthAgo).map((m) => m.studentId));
  const activeNow = new Set(state.memberships.filter((m) => ["activa", "por_vencer"].includes(membershipStatus(m, state.now, state.settings.expiryWarningDays))).map((m) => m.studentId));
  const retained = [...wasActive].filter((id) => activeNow.has(id)).length;
  const activeByPlan = state.plans
    .map((p) => ({ name: p.name, count: state.memberships.filter((m) => m.planId === p.id && ["activa", "por_vencer"].includes(membershipStatus(m, state.now, state.settings.expiryWarningDays))).length }))
    .filter((x) => x.count)
    .sort((a, b) => b.count - a.count);
  const totalLeads = state.leads.length;
  const converted = state.leads.filter((l) => l.stage === "cliente" || l.stage === "seguimiento").length;
  return {
    occupancy,
    popular: [...occupancy].sort((a, b) => b.booked - a.booked),
    attendanceRate,
    retention: { base: wasActive.size, retained, rate: wasActive.size ? retained / wasActive.size : null },
    activeByPlan,
    leadsByStage: state.leads.reduce<Record<string, number>>((acc, l) => ({ ...acc, [l.stage]: (acc[l.stage] ?? 0) + 1 }), {}),
    pendingInquiries: state.leads.filter((l) => l.stage === "nuevo" || l.stage === "contactado").length,
    conversion: { total: totalLeads, converted, rate: totalLeads ? converted / totalLeads : null },
  };
}

/** Clases de los próximos días con lugares, para el portal de alumnas. */
export function openSessions(state: DemoState, days = 7) {
  const now = new Date(state.now);
  const until = addDays(now, days);
  return state.sessions
    .filter((s) => live(s) && new Date(s.start) > now && new Date(s.start) < until)
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((s) => ({ session: s, taken: sessionTaken(state, s.id), waitlist: sessionWaitlist(state, s.id).length }));
}
