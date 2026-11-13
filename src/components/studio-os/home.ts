import { sessionTaken } from "@/lib/studio-os/rules";
import { appointmentClient, className, dashboard, instructorName, offeringPrice, roomName } from "@/lib/studio-os/selectors";
import { fmtMoney, fmtPct } from "@/lib/studio-os/time";
import type { DemoState, Session, ViewId } from "@/lib/studio-os/types";
import { cap, capabilitiesOf, termsOf } from "@/lib/studio-os/verticals";
import type { IconName } from "./icons";

export type Kpi = { label: string; value: string | number; hint: string; icon: IconName; view: ViewId };

/**
 * Indicadores del inicio según la modalidad. Los usan el dashboard y la vista
 * previa del configurador: lo que se ve al configurar es lo que se obtiene.
 */
export function homeKpis(state: DemoState): Kpi[] {
  const d = dashboard(state);
  const t = termsOf(state.config);
  const caps = capabilitiesOf(state.config);
  const has = (m: string) => state.config.modules.includes(m as never);
  const isStaff = state.role === "instructor";
  const started = d.attendance.attended + d.attendance.missed + d.attendance.pending;
  const out: Kpi[] = [];
  if (has("clases")) {
    if (caps.appointments) {
      out.push({ icon: "calendar", label: `${cap(t.booking.many)} hoy`, value: d.appointmentsToday.length, hint: caps.groups ? `y ${d.classesToday.length} ${d.classesToday.length === 1 ? "actividad grupal" : "actividades grupales"}` : `${fmtMoney(d.expectedToday)} estimados`, view: "agenda" });
      out.push({ icon: "layers", label: `Ocupación de ${t.space.many}`, value: fmtPct(d.roomOccupancy), hint: "Del horario de hoy", view: "agenda" });
    }
    if (caps.groups) {
      out.push({ icon: "calendar", label: caps.appointments ? "Grupos hoy" : "Clases hoy", value: d.classesToday.length, hint: `${d.bookedToday} de ${d.capacityToday} lugares`, view: "agenda" });
      if (!caps.appointments) out.push({ icon: "check", label: "Asistencia hoy", value: started ? `${d.attendance.attended}/${started}` : "—", hint: d.attendance.pending ? `${d.attendance.pending} por registrar` : started ? "Lista al día" : "Aún no empieza ninguna", view: "agenda" });
      out.push({ icon: "clock", label: "Reservas próximas", value: d.upcomingReservations, hint: "En clases que no han empezado", view: "agenda" });
    }
  }
  if (!isStaff) {
    out.push(caps.appointments
      ? { icon: "users", label: `${cap(t.client.many)} recurrentes`, value: fmtPct(d.recurringRate), hint: `${d.recurring} con 2 visitas o más`, view: "alumnas" }
      : { icon: "users", label: `${cap(t.client.many)} activas`, value: d.activeStudents, hint: "Con paquete vigente", view: "alumnas" });
    if (has("membresias")) out.push({ icon: "card", label: "Por vencer", value: d.expiring.length, hint: `En ${state.settings.expiryWarningDays} días o con 1 ${t.credit.one}`, view: "membresias" });
    if (has("marketing")) out.push({ icon: "funnel", label: "Consultas pendientes", value: d.pendingLeads.length, hint: "Nuevas o contactadas", view: "ventas" });
  }
  return out.slice(0, 6);
}

/** Título y detalle de un horario: una clase grupal o la cita de una persona. */
export function sessionLines(state: DemoState, s: Session) {
  const client = appointmentClient(state, s);
  if (s.kind === "cita") {
    return {
      title: className(state, s),
      detail: `${client?.name ?? "—"} · ${instructorName(state, s.instructorId)} · ${roomName(state, s.roomId)}`,
      client,
      right: { kind: "precio" as const, label: fmtMoney(offeringPrice(state, s)) },
    };
  }
  const taken = sessionTaken(state, s.id);
  return {
    title: className(state, s),
    detail: `${instructorName(state, s.instructorId)} · ${roomName(state, s.roomId)}`,
    client: null,
    right: { kind: "cupo" as const, taken, capacity: s.capacity, label: `${taken}/${s.capacity}` },
  };
}
