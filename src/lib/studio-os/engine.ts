import { automationCopy, roleCopy } from "./catalog";
import { creditsLeft, isLive, occupies, payingMembership, sessionEnd, sessionTaken, sessionWaitlist, whyCannotPay } from "./rules";
import { previewAutomation } from "./selectors";
import { addDays, atTime, fmtDate, fmtDay, fmtMoney, fmtTime, hoursBetween, sameDay } from "./time";
import { agree, cap, termsOf } from "./verticals";
import type {
  ActivityKind, AutomationId, Booking, Branch, ClassType, DemoState, Instructor, LeadStage, Plan, PlanKind,
  Result, RoleId, Room, Session, Settings, Student, StudioConfig, Transaction,
} from "./types";

/**
 * Motor de la demostración: funciones puras `estado → { estado, ok, mensaje }`.
 * Cada acción trabaja sobre una copia; si una regla lo impide, devuelve el
 * estado original sin cambios y un mensaje que explica por qué.
 */

class Rejection extends Error {}
const reject = (message: string): never => {
  throw new Rejection(message);
};

function run(state: DemoState, fn: (d: DemoState) => string): Result {
  const draft = structuredClone(state);
  try {
    return { state: draft, ok: true, message: fn(draft) };
  } catch (error) {
    if (error instanceof Rejection) return { state, ok: false, message: error.message };
    throw error;
  }
}

export function nextId(d: DemoState, prefix: string): string {
  d.seq += 1;
  return prefix + d.seq;
}
export function log(d: DemoState, kind: ActivityKind, text: string) {
  d.activity.unshift({ id: nextId(d, "a"), at: d.now, text, kind });
  if (d.activity.length > 80) d.activity.length = 80;
}

const firstName = (name: string) => name.split(" ")[0];
const studentOf = (d: DemoState, id: string) => d.students.find((s) => s.id === id) ?? reject(`No encontramos ${termsOf(d.config).client.g === "a" ? "a esa" : "a ese"} ${termsOf(d.config).client.one}.`);
const sessionOf = (d: DemoState, id: string) => d.sessions.find((s) => s.id === id) ?? reject("No encontramos ese horario.");
const className = (d: DemoState, s: Session) => d.classTypes.find((c) => c.id === s.classTypeId)?.name ?? "Clase";
const instructorOf = (d: DemoState, id: string) => d.instructors.find((i) => i.id === id) ?? reject("No encontramos a ese instructor.");
const roomOf = (d: DemoState, id: string) => d.rooms.find((r) => r.id === id) ?? reject("No encontramos ese espacio.");
const sessionLabel = (d: DemoState, s: Session) => `${className(d, s)} · ${fmtDay(s.start)} ${fmtTime(s.start)}`;
const overlaps = (a: Session, startMs: number, endMs: number) =>
  a.status === "programada" && new Date(a.start).getTime() < endMs && sessionEnd(a).getTime() > startMs;

/* ───────────── Reservas ───────────── */

export function applyBook(d: DemoState, sessionId: string, studentId: string): string {
  const s = sessionOf(d, sessionId);
  const student = studentOf(d, studentId);
  const name = firstName(student.name);
  if (s.kind === "cita") reject("Este horario es una cita individual; agenda una nueva cita para otra persona.");
  if (s.status === "cancelada") reject("Esta clase está cancelada.");
  if (new Date(s.start) <= new Date(d.now)) reject("Esta clase ya empezó; ya no admite reservas.");
  const existing = d.bookings.find((b) => b.sessionId === s.id && b.studentId === studentId && isLive(b));
  if (existing) reject(existing.status === "espera" ? `${name} ya está en la lista de espera.` : `${name} ya está inscrita en esta clase.`);
  const startMs = new Date(s.start).getTime();
  const clash = d.bookings.find((b) => b.studentId === studentId && b.sessionId !== s.id && isLive(b) && overlaps(sessionOf(d, b.sessionId), startMs, sessionEnd(s).getTime()));
  if (clash) reject(`${name} ya tiene ${className(d, sessionOf(d, clash.sessionId))} a esa hora.`);

  const membership = payingMembership(d, studentId, s.start);
  if (!membership) reject(whyCannotPay(d, studentId, s.start));
  const m = membership!;

  const taken = sessionTaken(d, s.id);
  if (taken >= s.capacity) {
    if (!d.settings.waitlist) reject("La clase está llena y la lista de espera está desactivada.");
    d.bookings.push({ id: nextId(d, "r"), sessionId: s.id, studentId, status: "espera", membershipId: null, creditCharged: false, createdAt: d.now });
    const position = sessionWaitlist(d, s.id).length;
    log(d, "reserva", `${student.name} entró a la lista de espera de ${sessionLabel(d, s)}.`);
    return `Clase llena: ${name} quedó en lista de espera (lugar ${position}). No se descontó crédito.`;
  }

  const charged = m.creditsTotal !== null;
  if (charged) m.creditsUsed += 1;
  d.bookings.push({ id: nextId(d, "r"), sessionId: s.id, studentId, status: "reservada", membershipId: m.id, creditCharged: charged, createdAt: d.now });
  log(d, "reserva", `${student.name} reservó ${sessionLabel(d, s)}.`);
  const left = creditsLeft(m);
  const free = s.capacity - taken - 1;
  return `Reservado: ${name} en ${sessionLabel(d, s)}. ${charged ? `Le quedan ${left} crédito${left === 1 ? "" : "s"}.` : "Plan ilimitado: no descuenta créditos."} Quedan ${free} lugar${free === 1 ? "" : "es"}.`;
}

/** Pasa la lista de espera a lugares libres, en orden de llegada. */
function promoteWaitlist(d: DemoState, s: Session): string[] {
  const promoted: string[] = [];
  for (const b of sessionWaitlist(d, s.id)) {
    if (sessionTaken(d, s.id) >= s.capacity) break;
    const student = studentOf(d, b.studentId);
    const m = payingMembership(d, b.studentId, s.start);
    if (!m) {
      b.status = "cancelada";
      log(d, "reserva", `${student.name} salió de la lista de espera: ya no tenía créditos vigentes.`);
      continue;
    }
    const charged = m.creditsTotal !== null;
    if (charged) m.creditsUsed += 1;
    Object.assign(b, { status: "reservada", membershipId: m.id, creditCharged: charged });
    promoted.push(firstName(student.name));
    log(d, "reserva", `${student.name} pasó de la lista de espera a reservada en ${sessionLabel(d, s)}.`);
    if (d.settings.notifications.espera || d.automations.some((a) => a.id === "lugar_liberado" && a.enabled)) log(d, "automatizacion", `Aviso simulado (no se envía): "Se liberó tu lugar en ${className(d, s)}" para ${student.name}.`);
  }
  return promoted;
}

export function applyCancelBooking(d: DemoState, bookingId: string): string {
  const b = d.bookings.find((x) => x.id === bookingId) ?? reject("No encontramos esa reserva.");
  const s = sessionOf(d, b.sessionId);
  const student = studentOf(d, b.studentId);
  const name = firstName(student.name);
  if (b.status === "espera") {
    b.status = "cancelada";
    log(d, "cancelacion", `${student.name} salió de la lista de espera de ${sessionLabel(d, s)}.`);
    return `${name} salió de la lista de espera.`;
  }
  if (b.status !== "reservada") reject("Esta reserva ya no está activa.");
  const hours = hoursBetween(d.now, s.start);
  if (hours <= 0) reject(s.kind === "cita" ? "La cita ya empezó: registra si llegó o no asistió." : "La clase ya empezó: registra asistencia o falta en lugar de cancelar.");
  if (s.kind === "cita") return cancelAppointment(d, b, s, hours);

  const onTime = hours >= d.settings.cancellationHours;
  const refund = b.creditCharged && (onTime || d.settings.lateCancel === "devuelve");
  if (refund) {
    const m = d.memberships.find((x) => x.id === b.membershipId);
    if (m) m.creditsUsed = Math.max(0, m.creditsUsed - 1);
    b.creditCharged = false;
  }
  b.status = onTime ? "cancelada" : "cancelada_tarde";
  log(d, "cancelacion", `${student.name} canceló ${sessionLabel(d, s)}${onTime ? "" : " (cancelación tardía)"}.`);
  const promoted = promoteWaitlist(d, s);

  const credit = !b.membershipId || d.memberships.find((m) => m.id === b.membershipId)?.creditsTotal === null
    ? "Plan ilimitado: no había crédito que devolver."
    : refund
      ? "Se le devolvió el crédito."
      : `Canceló con menos de ${d.settings.cancellationHours} h: según tu regla, pierde el crédito.`;
  return `Reserva cancelada. ${credit}${promoted.length ? ` ${promoted.join(", ")} pasó de la lista de espera.` : ""}`;
}

/** Cancelar una cita libera el horario del especialista y de la cabina. No hay lista de espera. */
function cancelAppointment(d: DemoState, b: Booking, s: Session, hours: number): string {
  const student = studentOf(d, b.studentId);
  const t = termsOf(d.config);
  const onTime = hours >= d.settings.cancellationHours;
  const refund = b.creditCharged && (onTime || d.settings.lateCancel === "devuelve");
  if (refund) {
    const m = d.memberships.find((x) => x.id === b.membershipId);
    if (m) m.creditsUsed = Math.max(0, m.creditsUsed - 1);
    b.creditCharged = false;
  }
  b.status = onTime ? "cancelada" : "cancelada_tarde";
  s.status = "cancelada";
  const pending = d.transactions.find((x) => x.bookingId === b.id && x.status === "pendiente");
  if (pending) d.transactions = d.transactions.filter((x) => x.id !== pending.id);
  log(d, "cancelacion", `${student.name} canceló su ${t.booking.one}: ${sessionLabel(d, s)}${onTime ? "" : " (cancelación tardía)"}.`);
  const credit = b.membershipId
    ? refund ? `Se le devolvió la ${t.credit.one} a su paquete.` : `Canceló con menos de ${d.settings.cancellationHours} h: según tu regla, la ${t.credit.one} no se devuelve.`
    : pending ? "Se quitó el cobro pendiente." : "Si ya había pagado, puedes reembolsar desde Pagos.";
  return `${cap(t.booking.one)} cancelada y horario liberado. ${credit}`;
}

export function applyAttendance(d: DemoState, bookingId: string, attended: boolean): string {
  const b = d.bookings.find((x) => x.id === bookingId) ?? reject("No encontramos esa reserva.");
  const s = sessionOf(d, b.sessionId);
  if (!occupies(b)) reject("Solo se registra asistencia de reservas activas.");
  if (!sameDay(s.start, d.now) && new Date(s.start) > new Date(d.now)) reject("Podrás registrar asistencia el día de la clase.");
  b.status = attended ? "asistio" : "falta";
  const student = studentOf(d, b.studentId);
  let charge = "";
  if (s.kind === "cita" && !b.membershipId) {
    // Sin paquete, la cita se cobra al llegar; si no asistió, no se cobra.
    const existing = d.transactions.find((x) => x.bookingId === b.id);
    const type = d.classTypes.find((c) => c.id === s.classTypeId);
    if (attended && !existing && type) {
      d.transactions.unshift({ id: nextId(d, "t"), studentId: student.id, concept: type.name, listPrice: type.price, discountPct: 0, amount: type.price, kind: "venta", status: "pendiente", method: "Tarjeta", at: d.now, bookingId: b.id });
      charge = ` Cobro de ${fmtMoney(type.price)} pendiente en Pagos (simulado).`;
    }
    if (!attended && existing?.status === "pendiente") d.transactions = d.transactions.filter((x) => x.id !== existing.id);
  }
  log(d, "asistencia", `${student.name}: ${attended ? "asistió a" : "faltó a"} ${sessionLabel(d, s)}.`);
  if (s.kind === "cita") return `${firstName(student.name)}: ${attended ? "llegó a su cita" : "no asistió"}.${b.membershipId ? ` La ${termsOf(d.config).credit.one} se descontó al agendar.` : charge}`;
  return `${firstName(student.name)}: ${attended ? "asistencia registrada" : "falta registrada"}. El crédito ya se había descontado al reservar.`;
}

export const bookSession = (state: DemoState, sessionId: string, studentId: string) => run(state, (d) => applyBook(d, sessionId, studentId));
export const cancelBooking = (state: DemoState, bookingId: string) => run(state, (d) => applyCancelBooking(d, bookingId));
export const markAttendance = (state: DemoState, bookingId: string, attended: boolean) => run(state, (d) => applyAttendance(d, bookingId, attended));

/* ───────────── Clases ───────────── */

export type NewSession = { classTypeId: string; instructorId: string; roomId: string; day: string; time: string; capacity: number };

export function applyCreateSession(d: DemoState, input: NewSession): string {
  const type = d.classTypes.find((c) => c.id === input.classTypeId) ?? reject("Elige una clase.");
  const instructor = instructorOf(d, input.instructorId);
  const room = roomOf(d, input.roomId);
  if (type.kind === "individual") reject(`${type.name} es individual: agéndalo como cita.`);
  if (room.kind === "individual") reject(`${room.name} es para sesiones individuales; elige un espacio grupal.`);
  const start = atTime(new Date(input.day), input.time);
  if (start <= new Date(d.now)) reject("Elige un horario a futuro.");
  if (!Number.isInteger(input.capacity) || input.capacity < 1) reject("El cupo debe ser de al menos 1 lugar.");
  if (input.capacity > room.capacity) reject(`${room.name} tiene capacidad para ${room.capacity}.`);
  if (!instructor.days.includes(start.getDay())) reject(`${instructor.name} no está disponible ese día. Cámbialo en Profesores.`);
  const startMs = start.getTime();
  const endMs = startMs + type.minutes * 60_000;
  const clash = d.sessions.find((s) => overlaps(s, startMs, endMs) && (s.roomId === room.id || s.instructorId === instructor.id));
  if (clash) reject(clash.roomId === room.id ? `${room.name} ya está ocupada a esa hora (${className(d, clash)}).` : `${instructor.name} ya da ${className(d, clash)} a esa hora.`);
  const s: Session = {
    id: nextId(d, "s"), kind: "grupal", classTypeId: type.id, instructorId: instructor.id, roomId: room.id,
    start: start.toISOString(), minutes: type.minutes, capacity: input.capacity, status: "programada",
  };
  d.sessions.push(s);
  log(d, "clase", `Nueva clase: ${sessionLabel(d, s)} con ${instructor.name}.`);
  return `Clase creada: ${sessionLabel(d, s)} en ${room.name}, ${input.capacity} lugares.`;
}
export const createSession = (state: DemoState, input: NewSession) => run(state, (d) => applyCreateSession(d, input));

/* ───────────── Citas individuales ───────────── */

export type NewAppointment = { studentId: string; classTypeId: string; start: string; instructorId?: string; roomId?: string };
export const OPEN_HOUR = 8;
export const CLOSE_HOUR = 21;

const busy = (d: DemoState, startMs: number, endMs: number, pred: (s: Session) => boolean) => d.sessions.find((s) => pred(s) && overlaps(s, startMs, endMs));

/** ¿Quién y dónde puede atender este horario? Devuelve el primer par libre, o el motivo. */
export function findSlot(d: DemoState, classTypeId: string, startIso: string, instructorId?: string, roomId?: string): { instructorId: string; roomId: string } | string {
  const type = d.classTypes.find((c) => c.id === classTypeId);
  if (!type) return "Elige un servicio.";
  const t = termsOf(d.config);
  const start = new Date(startIso);
  const startMs = start.getTime();
  const endMs = startMs + type.minutes * 60_000;
  const end = new Date(endMs);
  if (start.getHours() < OPEN_HOUR || end.getHours() + end.getMinutes() / 60 > CLOSE_HOUR) return `El horario de atención es de ${OPEN_HOUR}:00 a ${CLOSE_HOUR}:00.`;
  const staff = d.instructors.filter((i) => (!instructorId || i.id === instructorId) && i.days.includes(start.getDay()));
  if (!staff.length) return instructorId ? `${instructorOf(d, instructorId).name} no trabaja ese día.` : `Nadie del equipo trabaja ese día.`;
  const freeStaff = staff.filter((i) => !busy(d, startMs, endMs, (s) => s.instructorId === i.id));
  if (!freeStaff.length) {
    const clash = busy(d, startMs, endMs, (s) => s.instructorId === staff[0].id)!;
    return instructorId ? `${staff[0].name} ya atiende ${className(d, clash)} a esa hora.` : `Todo el equipo está ocupado a esa hora.`;
  }
  const rooms = d.rooms.filter((r) => r.kind === "individual" && (!roomId || r.id === roomId));
  if (!rooms.length) return `No hay ${t.space.many} para sesiones individuales.`;
  const freeRoom = rooms.find((r) => !busy(d, startMs, endMs, (s) => s.roomId === r.id));
  if (!freeRoom) return roomId ? `${rooms[0].name} ya está ocupada a esa hora.` : `Todas las ${t.space.many} están ocupadas a esa hora.`;
  return { instructorId: freeStaff[0].id, roomId: freeRoom.id };
}

export function applyBookAppointment(d: DemoState, input: NewAppointment): string {
  const t = termsOf(d.config);
  const type = d.classTypes.find((c) => c.id === input.classTypeId) ?? reject("Elige un servicio.");
  if (type.kind !== "individual") reject(`${type.name} es grupal: reserva un lugar en la agenda.`);
  const student = studentOf(d, input.studentId);
  const start = new Date(input.start);
  if (Number.isNaN(start.getTime()) || start <= new Date(d.now)) reject("Elige un horario a futuro.");
  const startMs = start.getTime();
  const endMs = startMs + type.minutes * 60_000;
  const own = d.bookings.find((b) => b.studentId === student.id && isLive(b) && overlaps(sessionOf(d, b.sessionId), startMs, endMs));
  if (own) reject(`${firstName(student.name)} ya tiene ${className(d, sessionOf(d, own.sessionId))} a esa hora.`);
  const slot = findSlot(d, type.id, input.start, input.instructorId, input.roomId);
  if (typeof slot === "string") reject(slot);
  const { instructorId, roomId } = slot as { instructorId: string; roomId: string };

  const s: Session = { id: nextId(d, "s"), kind: "cita", classTypeId: type.id, instructorId, roomId, start: start.toISOString(), minutes: type.minutes, capacity: 1, status: "programada" };
  d.sessions.push(s);
  const m = payingMembership(d, student.id, s.start);
  const charged = !!m && m.creditsTotal !== null;
  if (m && charged) m.creditsUsed += 1;
  const booking: Booking = { id: nextId(d, "r"), sessionId: s.id, studentId: student.id, status: "reservada", membershipId: m?.id ?? null, creditCharged: charged, createdAt: d.now };
  d.bookings.push(booking);
  log(d, "reserva", `${student.name} agendó ${sessionLabel(d, s)} con ${instructorOf(d, instructorId).name}.`);
  if (d.automations.some((a) => a.id === "confirmacion" && a.enabled)) log(d, "automatizacion", `Simulación: confirmación preparada para ${student.name} (no se envía).`);
  const pay = m
    ? charged ? `Se usó 1 ${t.credit.one} de su paquete (le quedan ${creditsLeft(m)}).` : "Su membresía la incluye."
    : `Se cobraría en la visita: ${fmtMoney(type.price)} (simulado).`;
  return `${cap(t.booking.one)} ${agree(t.booking, "agendad")}: ${firstName(student.name)} · ${sessionLabel(d, s)} con ${instructorOf(d, instructorId).name} en ${roomOf(d, roomId).name}. ${pay}`;
}
export const bookAppointment = (state: DemoState, input: NewAppointment) => run(state, (d) => applyBookAppointment(d, input));

export const updateCapacity = (state: DemoState, sessionId: string, capacity: number) =>
  run(state, (d) => {
    const s = sessionOf(d, sessionId);
    const room = roomOf(d, s.roomId);
    const taken = sessionTaken(d, s.id);
    if (!Number.isInteger(capacity) || capacity < 1) reject("El cupo debe ser de al menos 1 lugar.");
    if (capacity < taken) reject(`Ya hay ${taken} inscritas: el cupo no puede ser menor.`);
    if (capacity > room.capacity) reject(`${room.name} tiene capacidad para ${room.capacity}.`);
    s.capacity = capacity;
    const promoted = new Date(s.start) > new Date(d.now) ? promoteWaitlist(d, s) : [];
    log(d, "clase", `Cupo de ${sessionLabel(d, s)}: ${capacity} lugares.`);
    return `Cupo actualizado a ${capacity}.${promoted.length ? ` ${promoted.join(", ")} pasó de la lista de espera.` : ""}`;
  });

export const cancelSession = (state: DemoState, sessionId: string) =>
  run(state, (d) => {
    const s = sessionOf(d, sessionId);
    if (s.kind === "cita") reject("Para una cita, cancela la cita desde su detalle.");
    if (s.status === "cancelada") reject("Esta clase ya estaba cancelada.");
    if (new Date(s.start) <= new Date(d.now)) reject("No se puede cancelar una clase que ya empezó.");
    let affected = 0;
    for (const b of d.bookings.filter((x) => x.sessionId === s.id && isLive(x))) {
      if (b.creditCharged) {
        const m = d.memberships.find((x) => x.id === b.membershipId);
        if (m) m.creditsUsed = Math.max(0, m.creditsUsed - 1);
        b.creditCharged = false;
      }
      if (b.status === "reservada") affected += 1;
      b.status = "cancelada";
    }
    s.status = "cancelada";
    log(d, "clase", `Clase cancelada: ${sessionLabel(d, s)}. ${affected} reservas con crédito devuelto.`);
    const automation = d.automations.find((a) => a.id === "clase_cancelada");
    if (automation?.enabled && affected) log(d, "automatizacion", `Simulación: se prepararía el aviso de cancelación para ${affected} alumna${affected === 1 ? "" : "s"} (no se envía).`);
    return `Clase cancelada. ${affected ? `Se devolvió el crédito a ${affected} alumna${affected === 1 ? "" : "s"}.` : "No había reservas."}`;
  });

export const substituteInstructor = (state: DemoState, sessionId: string, instructorId: string) =>
  run(state, (d) => {
    const s = sessionOf(d, sessionId);
    const next = instructorOf(d, instructorId);
    if (s.instructorId === next.id) reject(`${next.name} ya da esta clase.`);
    if (!next.days.includes(new Date(s.start).getDay())) reject(`${next.name} no está disponible ese día.`);
    const startMs = new Date(s.start).getTime();
    const clash = d.sessions.find((x) => x.id !== s.id && x.instructorId === next.id && overlaps(x, startMs, sessionEnd(s).getTime()));
    if (clash) reject(`${next.name} ya da ${className(d, clash)} a esa hora.`);
    const previous = instructorOf(d, s.instructorId);
    s.substituteFor = s.substituteFor ?? previous.id;
    s.instructorId = next.id;
    if (s.substituteFor === next.id) delete s.substituteFor;
    log(d, "clase", `${next.name} sustituye a ${previous.name} en ${sessionLabel(d, s)}.`);
    return `${next.name} dará ${sessionLabel(d, s)}.`;
  });

/* ───────────── Membresías y pagos ───────────── */

export type Sale = { discountPct: number; status: "pagado" | "pendiente"; method: Transaction["method"] };

export function applySell(d: DemoState, studentId: string, planId: PlanKind, sale: Sale): string {
  const student = studentOf(d, studentId);
  const plan = d.plans.find((p) => p.id === planId) ?? reject("Elige un paquete.");
  if (!plan.enabled) reject(`${plan.name} no está activo. Actívalo en Personalizar.`);
  if (sale.discountPct < 0 || sale.discountPct > 50) reject("El descuento debe estar entre 0% y 50%.");
  const renewal = d.memberships.some((m) => m.studentId === studentId);
  const start = new Date(d.now);
  const membership = {
    id: nextId(d, "m"), studentId, planId, start: start.toISOString(),
    end: addDays(start, plan.validityDays).toISOString(), creditsTotal: plan.credits, creditsUsed: 0, status: "activa" as const,
  };
  d.memberships.push(membership);
  const amount = Math.round(plan.price * (1 - sale.discountPct / 100));
  d.transactions.unshift({
    id: nextId(d, "t"), studentId, concept: plan.name, planId, listPrice: plan.price, discountPct: sale.discountPct,
    amount, kind: renewal ? "renovacion" : "venta", status: sale.status, method: sale.method, at: d.now, membershipId: membership.id,
  });
  log(d, "venta", `${renewal ? "Renovación" : "Venta"}: ${plan.name} para ${student.name}${sale.status === "pendiente" ? " (pago pendiente)" : ""}.`);
  return `${plan.name} asignado a ${firstName(student.name)}. Vence el ${fmtDate(membership.end)}.${sale.status === "pendiente" ? " Quedó como pago pendiente." : ""}`;
}
export const sellPlan = (state: DemoState, studentId: string, planId: PlanKind, sale: Sale) => run(state, (d) => applySell(d, studentId, planId, sale));

export const renewMembership = (state: DemoState, membershipId: string) =>
  run(state, (d) => {
    const m = d.memberships.find((x) => x.id === membershipId) ?? reject("No encontramos esa membresía.");
    return applySell(d, m.studentId, m.planId, { discountPct: 0, status: "pagado", method: "Tarjeta" });
  });

export const pauseMembership = (state: DemoState, membershipId: string, days = 14) =>
  run(state, (d) => {
    const m = d.memberships.find((x) => x.id === membershipId) ?? reject("No encontramos esa membresía.");
    if (m.status !== "activa") reject("Solo se pueden pausar membresías activas.");
    if (new Date(m.end) < new Date(d.now)) reject("Esta membresía ya venció; renuévala en su lugar.");
    m.status = "pausada";
    m.pausedDays = days;
    m.end = addDays(new Date(m.end), days).toISOString();
    const student = studentOf(d, m.studentId);
    log(d, "membresia", `Membresía de ${student.name} pausada ${days} días.`);
    return `Pausada ${days} días: ahora vence el ${fmtDate(m.end)}. Mientras esté pausada no puede reservar.`;
  });

export const resumeMembership = (state: DemoState, membershipId: string) =>
  run(state, (d) => {
    const m = d.memberships.find((x) => x.id === membershipId) ?? reject("No encontramos esa membresía.");
    if (m.status !== "pausada") reject("Esta membresía no está pausada.");
    m.end = addDays(new Date(m.end), -(m.pausedDays ?? 0)).toISOString();
    delete m.pausedDays;
    m.status = "activa";
    const student = studentOf(d, m.studentId);
    log(d, "membresia", `Membresía de ${student.name} reactivada.`);
    return `Reactivada: vence el ${fmtDate(m.end)} y ya puede reservar.`;
  });

export const markPaid = (state: DemoState, transactionId: string) =>
  run(state, (d) => {
    const t = d.transactions.find((x) => x.id === transactionId) ?? reject("No encontramos ese movimiento.");
    if (t.status === "pagado") reject("Este movimiento ya estaba pagado.");
    t.status = "pagado";
    const student = studentOf(d, t.studentId);
    log(d, "pago", `Pago registrado (simulado): ${t.concept} de ${student.name}.`);
    return `Pago marcado como recibido. Datos ficticios: no se procesó ningún cobro.`;
  });

export const refundTransaction = (state: DemoState, transactionId: string) =>
  run(state, (d) => {
    const t = d.transactions.find((x) => x.id === transactionId) ?? reject("No encontramos ese movimiento.");
    if (t.kind === "reembolso") reject("No se puede reembolsar un reembolso.");
    if (t.status !== "pagado") reject("Solo se reembolsan pagos recibidos.");
    if (t.refunded) reject("Este pago ya se reembolsó.");
    t.refunded = true;
    d.transactions.unshift({
      id: nextId(d, "t"), studentId: t.studentId, concept: `Reembolso · ${t.concept}`, planId: t.planId, listPrice: t.amount,
      discountPct: 0, amount: -t.amount, kind: "reembolso", status: "pagado", method: t.method, at: d.now, membershipId: t.membershipId,
    });
    const m = d.memberships.find((x) => x.id === t.membershipId);
    let cancelled = 0;
    if (m) {
      m.status = "cancelada";
      for (const b of d.bookings.filter((x) => x.membershipId === m.id && x.status === "reservada" && new Date(sessionOf(d, x.sessionId).start) > new Date(d.now))) {
        b.status = "cancelada";
        b.creditCharged = false;
        cancelled += 1;
      }
    }
    const student = studentOf(d, t.studentId);
    log(d, "pago", `Reembolso de ejemplo: ${t.concept} de ${student.name}.`);
    return `Reembolso registrado (simulado). La membresía quedó cancelada${cancelled ? ` y se liberaron ${cancelled} reservas` : ""}.`;
  });

/* ───────────── Alumnas, ventas y tareas ───────────── */

export const updateStudent = (state: DemoState, id: string, patch: Partial<Pick<Student, "name" | "tags" | "notes" | "followUp">>) =>
  run(state, (d) => {
    const s = studentOf(d, id);
    if (patch.name !== undefined && !patch.name.trim()) reject("El nombre no puede quedar vacío.");
    Object.assign(s, { ...patch, name: patch.name?.trim() ?? s.name });
    if (patch.followUp) {
      d.tasks.unshift({ id: nextId(d, "k"), text: `${s.name}: ${patch.followUp}`, due: addDays(new Date(d.now), 1).toISOString(), done: false });
      log(d, "ajuste", `Seguimiento para ${s.name}: ${patch.followUp}.`);
      return "Seguimiento guardado y agregado a tus tareas.";
    }
    return "Ficha actualizada.";
  });

export function applyAddStudent(d: DemoState, name: string, tags: string[] = ["Nueva"]): Student {
  const clean = name.trim().slice(0, 40);
  if (!clean) reject("Escribe un nombre ficticio.");
  const student: Student = {
    id: nextId(d, "p"), name: clean, hue: (d.seq * 47) % 360, tags, notes: "", followUp: null,
    joinedAt: d.now, pastVisits: 0, lastVisitBefore: null,
  };
  d.students.unshift(student);
  log(d, "ajuste", `Nuev${termsOf(d.config).client.g} ${termsOf(d.config).client.one}: ${clean}.`);
  const welcome = d.automations.find((a) => a.id === "bienvenida");
  if (welcome?.enabled) log(d, "automatizacion", `Simulación: se prepararía un mensaje de bienvenida para ${clean} (no se envía).`);
  return student;
}
export const addStudent = (state: DemoState, name: string) =>
  run(state, (d) => `${applyAddStudent(d, name).name} se agregó.${termsOf(d.config).client.one === "alumna" ? " Véndele un paquete para que pueda reservar." : ""}`);

export const addLead = (state: DemoState, name: string, interest: string, source: DemoState["leads"][number]["source"]) =>
  run(state, (d) => {
    const clean = name.trim().slice(0, 40);
    if (!clean) reject("Escribe un nombre ficticio.");
    d.leads.unshift({ id: nextId(d, "l"), name: clean, interest, source, stage: "nuevo", createdAt: d.now, history: [{ at: d.now, text: `Llegó por ${source}. Le interesa ${interest}.` }] });
    log(d, "venta", `Nuevo interesado: ${clean} (${source}).`);
    return `${clean} está en "${d.settings.stageLabels.nuevo}".`;
  });

const stageTask = (d: DemoState): Record<LeadStage, (name: string) => string | null> => {
  const t = termsOf(d.config);
  return {
    nuevo: () => null,
    contactado: (n) => `Dar seguimiento a ${n} si no responde en 2 días`,
    prueba: (n) => `Confirmar ${t.trialStage.toLowerCase()} de ${n} un día antes`,
    cliente: (n) => `Dar la bienvenida a ${n} y explicarle cómo agendar`,
    seguimiento: (n) => `Preguntarle a ${n} cómo le fue en sus primeras ${t.booking.many}`,
  };
};

export const moveLead = (state: DemoState, leadId: string, stage: LeadStage) =>
  run(state, (d) => {
    const lead = d.leads.find((l) => l.id === leadId) ?? reject("No encontramos a ese interesado.");
    if (lead.stage === stage) reject(`${lead.name} ya está en "${d.settings.stageLabels[stage]}".`);
    const from = d.settings.stageLabels[lead.stage];
    lead.stage = stage;
    lead.history.push({ at: d.now, text: `Pasó de "${from}" a "${d.settings.stageLabels[stage]}".` });
    const task = stageTask(d)[stage](firstName(lead.name));
    if (task) d.tasks.unshift({ id: nextId(d, "k"), text: task, due: addDays(new Date(d.now), 1).toISOString(), done: false });
    let extra = "";
    if (stage === "cliente" && !lead.studentId) {
      lead.studentId = applyAddStudent(d, lead.name, ["Nueva", lead.source]).id;
      lead.history.push({ at: d.now, text: `Se creó su ficha de ${termsOf(d.config).client.one}.` });
      extra = ` Ya aparece en ${cap(termsOf(d.config).client.many)}.`;
    }
    log(d, "venta", `${lead.name}: ${from} → ${d.settings.stageLabels[stage]}.`);
    return `${firstName(lead.name)} pasó a "${d.settings.stageLabels[stage]}".${task ? " Tarea creada." : ""}${extra}`;
  });

export const toggleTask = (state: DemoState, taskId: string) =>
  run(state, (d) => {
    const t = d.tasks.find((x) => x.id === taskId) ?? reject("No encontramos esa tarea.");
    t.done = !t.done;
    return t.done ? "Tarea completada." : "Tarea pendiente de nuevo.";
  });

/* ───────────── Automatizaciones ───────────── */

export const toggleAutomation = (state: DemoState, id: AutomationId) =>
  run(state, (d) => {
    const a = d.automations.find((x) => x.id === id) ?? reject("No encontramos esa regla.");
    a.enabled = !a.enabled;
    return `Regla ${a.enabled ? "activada" : "desactivada"}: ${automationCopy(id, termsOf(d.config)).name.toLowerCase()}.`;
  });

export const runAutomation = (state: DemoState, id: AutomationId) =>
  run(state, (d) => {
    const a = d.automations.find((x) => x.id === id) ?? reject("No encontramos esa regla.");
    if (!a.enabled) reject("Activa la regla para simularla.");
    const targets = previewAutomation(d, id);
    a.lastRun = d.now;
    if (!targets.length) return "Simulación lista: hoy nadie cumple esta condición.";
    const outcome = automationCopy(id, termsOf(d.config)).outcome;
    const createsTasks = id === "sin_reserva" || id === "reactivacion";
    for (const t of targets) {
      if (createsTasks) d.tasks.unshift({ id: nextId(d, "k"), text: `Seguimiento: ${t.name} (${t.detail})`, due: addDays(new Date(d.now), 1).toISOString(), done: false });
      log(d, "automatizacion", `Simulación: ${outcome} para ${t.name} (no se envía).`);
    }
    return `Simulación: ${targets.length} × ${outcome} ${createsTasks ? "(creadas como tareas)" : "(preparados)"}. Nada se envió.`;
  });

/* ───────────── Configuración ───────────── */

export const updateSettings = (state: DemoState, patch: Partial<Settings>) =>
  run(state, (d) => {
    if (patch.cancellationHours !== undefined && (patch.cancellationHours < 0 || patch.cancellationHours > 72)) reject("Usa entre 0 y 72 horas.");
    if (patch.expiryWarningDays !== undefined && (patch.expiryWarningDays < 1 || patch.expiryWarningDays > 30)) reject("Usa entre 1 y 30 días.");
    d.settings = { ...d.settings, ...patch };
    return "Configuración actualizada.";
  });

export const updateConfig = (state: DemoState, patch: Partial<StudioConfig>) =>
  run(state, (d) => {
    d.config = { ...d.config, ...patch, name: (patch.name ?? d.config.name).slice(0, 40) };
    return "Cambios aplicados.";
  });

export const updatePlan = (state: DemoState, planId: PlanKind, patch: Partial<Omit<Plan, "id">>) =>
  run(state, (d) => {
    const p = d.plans.find((x) => x.id === planId) ?? reject("No encontramos ese paquete.");
    if (patch.price !== undefined && (!Number.isFinite(patch.price) || patch.price < 0 || patch.price > 100_000)) reject("Usa un precio entre $0 y $100,000.");
    if (patch.credits !== undefined && patch.credits !== null && (!Number.isInteger(patch.credits) || patch.credits < 1 || patch.credits > 200)) reject(`Usa entre 1 y 200 ${termsOf(d.config).credit.many}.`);
    if (patch.validityDays !== undefined && (!Number.isInteger(patch.validityDays) || patch.validityDays < 1 || patch.validityDays > 365)) reject("Usa entre 1 y 365 días.");
    if (patch.enabled === false && d.plans.filter((x) => x.enabled).length === 1) reject("Deja al menos un paquete activo.");
    Object.assign(p, patch);
    return `${p.name} actualizado. Aplica a ventas nuevas; las membresías vendidas conservan sus condiciones.`;
  });

export const addClassType = (state: DemoState, name: string, minutes: number, kind: ClassType["kind"] = "grupal", price = 0) =>
  run(state, (d) => {
    const clean = name.trim().slice(0, 32);
    if (!clean) reject("Escribe el nombre.");
    if (d.classTypes.some((c) => c.name.toLowerCase() === clean.toLowerCase())) reject("Ya existe uno con ese nombre.");
    if (!Number.isInteger(minutes) || minutes < 15 || minutes > 180) reject("Usa una duración entre 15 y 180 minutos.");
    if (!Number.isFinite(price) || price < 0 || price > 100_000) reject("Usa un precio entre $0 y $100,000.");
    const c: ClassType = { id: nextId(d, "c"), name: clean, minutes, kind, price };
    d.classTypes.push(c);
    return `${clean} agregado. Ya puedes ${kind === "individual" ? "agendarlo como cita" : "programarlo en la agenda"}.`;
  });

export const updateClassType = (state: DemoState, id: string, patch: Partial<Omit<ClassType, "id">>) =>
  run(state, (d) => {
    const c = d.classTypes.find((x) => x.id === id) ?? reject("No encontramos esa clase.");
    if (patch.name !== undefined && !patch.name.trim()) reject("El nombre no puede quedar vacío.");
    if (patch.price !== undefined && (!Number.isFinite(patch.price) || patch.price < 0 || patch.price > 100_000)) reject("Usa un precio entre $0 y $100,000.");
    Object.assign(c, patch);
    return "Actualizado. Aplica a lo que se agende desde ahora.";
  });

export const removeClassType = (state: DemoState, id: string) =>
  run(state, (d) => {
    const used = d.sessions.some((s) => s.classTypeId === id && s.status === "programada" && new Date(s.start) > new Date(d.now));
    if (used) reject("Hay horarios futuros de este tipo. Cancélalos primero en la agenda.");
    if (d.classTypes.length === 1) reject("Deja al menos uno.");
    d.classTypes = d.classTypes.filter((c) => c.id !== id);
    return "Clase eliminada.";
  });

export const addInstructor = (state: DemoState, name: string) =>
  run(state, (d) => {
    const clean = name.trim().slice(0, 40);
    if (!clean) reject("Escribe un nombre ficticio.");
    const i: Instructor = { id: nextId(d, "i"), name: clean, days: [1, 2, 3, 4, 5], ratePerClass: 350 };
    d.instructors.push(i);
    return `${clean} se agregó al equipo.`;
  });

export const updateInstructor = (state: DemoState, id: string, patch: Partial<Omit<Instructor, "id">>) =>
  run(state, (d) => {
    const i = instructorOf(d, id);
    if (patch.name !== undefined && !patch.name.trim()) reject("El nombre no puede quedar vacío.");
    if (patch.ratePerClass !== undefined && (!Number.isFinite(patch.ratePerClass) || patch.ratePerClass < 0 || patch.ratePerClass > 10_000)) reject("Usa un honorario entre $0 y $10,000.");
    Object.assign(i, patch);
    return "Equipo actualizado.";
  });

export const addRoom = (state: DemoState, name: string, branchId: string, capacity: number, kind: Room["kind"] = "grupal") =>
  run(state, (d) => {
    const clean = name.trim().slice(0, 32);
    if (!clean) reject("Escribe el nombre del espacio.");
    if (!d.branches.some((b) => b.id === branchId)) reject("Elige una sucursal.");
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 60) reject("Usa una capacidad entre 1 y 60.");
    const r: Room = { id: nextId(d, "o"), name: clean, branchId, capacity: kind === "individual" ? 1 : capacity, kind };
    d.rooms.push(r);
    return `${clean} agregada.`;
  });

export const updateRoom = (state: DemoState, id: string, patch: Partial<Omit<Room, "id">>) =>
  run(state, (d) => {
    const r = roomOf(d, id);
    if (patch.capacity !== undefined) {
      if (!Number.isInteger(patch.capacity) || patch.capacity < 1 || patch.capacity > 60) reject("Usa una capacidad entre 1 y 60.");
      for (const s of d.sessions.filter((x) => x.roomId === r.id && x.status === "programada" && new Date(x.start) > new Date(d.now))) {
        s.capacity = Math.max(sessionTaken(d, s.id), Math.min(s.capacity, patch.capacity));
      }
    }
    if (patch.name !== undefined && !patch.name.trim()) reject("El nombre no puede quedar vacío.");
    Object.assign(r, patch);
    return "Espacio actualizado. Lo futuro respeta la nueva capacidad sin quitar lugares ya reservados.";
  });

export const addBranch = (state: DemoState, name: string) =>
  run(state, (d) => {
    const clean = name.trim().slice(0, 32);
    if (!clean) reject("Escribe el nombre de la sucursal.");
    const b: Branch = { id: nextId(d, "b"), name: clean };
    d.branches.push(b);
    const kind = d.rooms.some((r) => r.kind === "grupal") ? "grupal" : "individual";
    d.rooms.push({ id: nextId(d, "o"), name: `${cap(termsOf(d.config).space.one)} ${clean}`, branchId: b.id, capacity: kind === "grupal" ? d.config.capacity : 1, kind });
    return `${clean} agregada con ${termsOf(d.config).space.g === "a" ? "una" : "un"} ${termsOf(d.config).space.one}.`;
  });

export const renameBranch = (state: DemoState, id: string, name: string) =>
  run(state, (d) => {
    const b = d.branches.find((x) => x.id === id) ?? reject("No encontramos esa sucursal.");
    if (!name.trim()) reject("El nombre no puede quedar vacío.");
    b.name = name.trim().slice(0, 32);
    return "Sucursal actualizada.";
  });

export const setRole = (state: DemoState, role: RoleId) =>
  run(state, (d) => {
    d.role = role;
    return `Estás viendo el sistema como ${roleCopy(role, d.config).name.toLowerCase()}.`;
  });
export const setViewAsInstructor = (state: DemoState, id: string) =>
  run(state, (d) => {
    d.viewAsInstructorId = instructorOf(d, id).id;
    return `Viendo la agenda de ${instructorOf(d, id).name}.`;
  });
export const setPortalStudent = (state: DemoState, id: string) =>
  run(state, (d) => {
    d.portalStudentId = studentOf(d, id).id;
    return `Portal de ${studentOf(d, id).name}.`;
  });

/** Reservas futuras de una alumna con créditos todavía válidos (para el portal). */
export const upcomingFor = (state: DemoState, studentId: string) =>
  state.bookings
    .filter((b) => b.studentId === studentId && (b.status === "reservada" || b.status === "espera"))
    .map((b) => ({ booking: b, session: state.sessions.find((s) => s.id === b.sessionId)! }))
    .filter((x) => x.session && new Date(x.session.start) > new Date(state.now))
    .sort((a, b) => a.session.start.localeCompare(b.session.start));
