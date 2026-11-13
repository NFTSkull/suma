import { describe, expect, it } from "vitest";
import { defaultConfig } from "./catalog";
import {
  bookSession, cancelBooking, cancelSession, createSession, markAttendance, markPaid, moveLead, pauseMembership,
  refundTransaction, resumeMembership, runAutomation, sellPlan, toggleAutomation, updateCapacity, updateSettings,
} from "./engine";
import { creditsLeft, isLive, payingMembership, sessionTaken, sessionWaitlist } from "./rules";
import { createDemo } from "./seed";
import { dashboard, finance, studentInfo } from "./selectors";
import type { DemoState, Session } from "./types";

/** Miércoles 11 de noviembre de 2026, 10:00 hora local. */
const NOW = new Date(2026, 10, 11, 10, 0).toISOString();
const fresh = (type: Parameters<typeof defaultConfig>[0] = "pilates") => createDemo(defaultConfig(type), NOW);

const hoursAhead = (state: DemoState, s: Session) => (new Date(s.start).getTime() - new Date(state.now).getTime()) / 3_600_000;
const future = (state: DemoState, minHours: number, maxHours = Infinity) =>
  state.sessions.filter((s) => s.status === "programada" && hoursAhead(state, s) >= minHours && hoursAhead(state, s) < maxHours);
const withRoom = (state: DemoState, list: Session[]) => list.find((s) => sessionTaken(state, s.id) < s.capacity)!;
/** Alumna con paquete de créditos que aún no está en la clase. */
function creditStudent(state: DemoState, s: Session) {
  return state.students.find((st) => {
    const m = payingMembership(state, st.id, s.start);
    return m && m.creditsTotal !== null && creditsLeft(m)! >= 2 && !state.bookings.some((b) => b.sessionId === s.id && b.studentId === st.id && isLive(b));
  })!;
}
const membershipOf = (state: DemoState, id: string) => state.memberships.find((m) => m.id === id)!;

describe("datos ficticios", () => {
  it("son deterministas y respetan las reglas del motor", () => {
    const a = fresh();
    expect(JSON.stringify(a)).toBe(JSON.stringify(fresh()));
    expect(a.sessions.length).toBeGreaterThan(20);
    expect(a.students.length).toBeGreaterThanOrEqual(24);
    for (const s of a.sessions) expect(sessionTaken(a, s.id)).toBeLessThanOrEqual(s.capacity);
    const keys = a.bookings.filter(isLive).map((b) => b.sessionId + b.studentId);
    expect(new Set(keys).size).toBe(keys.length);
    for (const m of a.memberships) if (m.creditsTotal !== null) expect(m.creditsUsed).toBeLessThanOrEqual(m.creditsTotal);
    // Días anteriores con asistencia registrada; hoy queda la última clase por pasar lista.
    const before = new Set(a.sessions.filter((s) => new Date(s.start) < new Date(2026, 10, 11)).map((s) => s.id));
    expect(a.bookings.some((b) => before.has(b.sessionId) && b.status === "reservada")).toBe(false);
    expect(dashboard(a).attendance.pending).toBeGreaterThan(0);
    expect(a.sessions.filter((s) => sessionWaitlist(a, s.id).length > 0)).toHaveLength(2);
    expect(dashboard(a).pendingPayments.length).toBeLessThanOrEqual(3);
  });

  it("los importes salen de transacciones, no de números fijos", () => {
    const a = fresh();
    const monthStart = new Date(2026, 10, 1);
    const expected = a.transactions.filter((t) => t.status === "pagado" && new Date(t.at) >= monthStart).reduce((acc, t) => acc + t.amount, 0);
    expect(finance(a).collectedMonth).toBe(expected);
    const pending = a.transactions.find((t) => t.status === "pendiente");
    if (pending) {
      const after = markPaid(a, pending.id).state;
      expect(finance(after).collectedMonth - finance(a).collectedMonth).toBe(new Date(pending.at) >= monthStart ? pending.amount : 0);
      expect(finance(after).pendingCount).toBe(finance(a).pendingCount - 1);
    }
  });
});

describe("reservas", () => {
  it("reservar descuenta un crédito, ocupa un lugar y actualiza ficha y panel", () => {
    const a = fresh();
    const s = withRoom(a, future(a, 24));
    const st = creditStudent(a, s);
    const m = payingMembership(a, st.id, s.start)!;
    const r = bookSession(a, s.id, st.id);
    expect(r.ok).toBe(true);
    expect(sessionTaken(r.state, s.id)).toBe(sessionTaken(a, s.id) + 1);
    expect(membershipOf(r.state, m.id).creditsUsed).toBe(m.creditsUsed + 1);
    expect(studentInfo(r.state, st.id).upcoming.length).toBe(studentInfo(a, st.id).upcoming.length + 1);
    expect(dashboard(r.state).upcomingReservations).toBe(dashboard(a).upcomingReservations + 1);
    // El estado original no se modificó.
    expect(membershipOf(a, m.id).creditsUsed).toBe(m.creditsUsed);
  });

  it("no duplica reservas ni descuenta dos veces", () => {
    const a = fresh();
    const s = withRoom(a, future(a, 24));
    const st = creditStudent(a, s);
    const once = bookSession(a, s.id, st.id).state;
    const twice = bookSession(once, s.id, st.id);
    expect(twice.ok).toBe(false);
    expect(twice.message).toMatch(/ya está inscrita/);
    expect(twice.state).toBe(once);
  });

  it("sin lugar va a lista de espera sin cobrar; sin lista de espera se rechaza", () => {
    let a = fresh();
    const s = withRoom(a, future(a, 24));
    a = updateCapacity(a, s.id, Math.max(1, sessionTaken(a, s.id))).state;
    if (sessionTaken(a, s.id) < a.sessions.find((x) => x.id === s.id)!.capacity) a = bookSession(a, s.id, creditStudent(a, s).id).state;
    const st = creditStudent(a, s);
    const m = payingMembership(a, st.id, s.start)!;
    const r = bookSession(a, s.id, st.id);
    expect(r.ok).toBe(true);
    expect(r.message).toMatch(/lista de espera/);
    expect(membershipOf(r.state, m.id).creditsUsed).toBe(m.creditsUsed);
    expect(sessionTaken(r.state, s.id)).toBe(sessionTaken(a, s.id));

    const closed = updateSettings(a, { waitlist: false }).state;
    const no = bookSession(closed, s.id, st.id);
    expect(no.ok).toBe(false);
    expect(no.message).toMatch(/llena/);
  });

  it("cancelar a tiempo devuelve el crédito una sola vez y pasa a la primera de la lista de espera", () => {
    let a = fresh();
    const s = withRoom(a, future(a, 24));
    const first = creditStudent(a, s);
    a = bookSession(a, s.id, first.id).state;
    a = updateCapacity(a, s.id, sessionTaken(a, s.id)).state;
    const waiting = creditStudent(a, s);
    const waitingMembership = payingMembership(a, waiting.id, s.start)!;
    a = bookSession(a, s.id, waiting.id).state;
    expect(sessionWaitlist(a, s.id)).toHaveLength(1);

    const booking = a.bookings.find((b) => b.sessionId === s.id && b.studentId === first.id)!;
    const used = membershipOf(a, booking.membershipId!).creditsUsed;
    const r = cancelBooking(a, booking.id);
    expect(r.ok).toBe(true);
    expect(r.message).toMatch(/devolvió el crédito/);
    expect(membershipOf(r.state, booking.membershipId!).creditsUsed).toBe(used - 1);
    // La lista de espera ocupa el lugar y ahora sí se le descuenta.
    expect(sessionWaitlist(r.state, s.id)).toHaveLength(0);
    expect(membershipOf(r.state, waitingMembership.id).creditsUsed).toBe(waitingMembership.creditsUsed + 1);
    expect(sessionTaken(r.state, s.id)).toBe(sessionTaken(a, s.id));

    const again = cancelBooking(r.state, booking.id);
    expect(again.ok).toBe(false);
    expect(membershipOf(again.state, booking.membershipId!).creditsUsed).toBe(used - 1);
  });

  it("cancelar tarde pierde el crédito según la regla, o lo devuelve si se configura", () => {
    let a = fresh();
    const s = withRoom(a, future(a, 1, 12));
    const st = creditStudent(a, s);
    a = bookSession(a, s.id, st.id).state;
    const booking = a.bookings.find((b) => b.sessionId === s.id && b.studentId === st.id)!;
    const used = membershipOf(a, booking.membershipId!).creditsUsed;

    const lose = cancelBooking(a, booking.id);
    expect(lose.message).toMatch(/pierde el crédito/);
    expect(membershipOf(lose.state, booking.membershipId!).creditsUsed).toBe(used);
    expect(lose.state.bookings.find((b) => b.id === booking.id)!.status).toBe("cancelada_tarde");

    const keep = cancelBooking(updateSettings(a, { lateCancel: "devuelve" }).state, booking.id);
    expect(membershipOf(keep.state, booking.membershipId!).creditsUsed).toBe(used - 1);
  });

  it("una membresía pausada o sin créditos no puede reservar; reactivar la deja como estaba", () => {
    const a = fresh();
    const s = withRoom(a, future(a, 24));
    const st = creditStudent(a, s);
    const m = payingMembership(a, st.id, s.start)!;
    const paused = pauseMembership(a, m.id, 14);
    expect(paused.ok).toBe(true);
    const blocked = bookSession(paused.state, s.id, st.id);
    // Si tenía otra membresía vigente podría reservar con ella; con una sola debe rechazarse.
    if (!payingMembership(paused.state, st.id, s.start)) expect(blocked.message).toMatch(/pausada/);
    const resumed = resumeMembership(paused.state, m.id);
    expect(membershipOf(resumed.state, m.id).end).toBe(m.end);

    const empty = structuredClone(a);
    for (const x of empty.memberships.filter((x) => x.studentId === st.id && x.creditsTotal !== null)) x.creditsUsed = x.creditsTotal!;
    for (const x of empty.memberships.filter((x) => x.studentId === st.id && x.creditsTotal === null)) x.status = "cancelada";
    const none = bookSession(empty, s.id, st.id);
    expect(none.ok).toBe(false);
    expect(none.message).toMatch(/créditos/);
  });

  it("el plan ilimitado reserva sin descontar créditos", () => {
    const a = fresh("yoga");
    const s = withRoom(a, future(a, 24));
    const st = a.students.find((x) => !a.bookings.some((b) => b.sessionId === s.id && b.studentId === x.id && isLive(b)))!;
    const sold = sellPlan(a, st.id, "ilimitado", { discountPct: 0, status: "pagado", method: "Tarjeta" }).state;
    const r = bookSession(sold, s.id, st.id);
    expect(r.ok).toBe(true);
    expect(r.message).toMatch(/ilimitado/);
    expect(r.state.bookings.at(-1)!.creditCharged).toBe(false);
  });

  it("no permite reservar ni tomar asistencia fuera de tiempo", () => {
    const a = fresh();
    const past = a.sessions.find((s) => hoursAhead(a, s) < 0)!;
    expect(bookSession(a, past.id, a.students[0].id).message).toMatch(/ya empezó/);
    const later = future(a, 30).find((s) => a.bookings.some((b) => b.sessionId === s.id && b.status === "reservada"))!;
    const b = a.bookings.find((x) => x.sessionId === later.id && x.status === "reservada")!;
    expect(markAttendance(a, b.id, true).ok).toBe(false);
  });
});

describe("clases", () => {
  it("cancelar una clase devuelve todos los créditos y la cierra", () => {
    const a = fresh();
    const s = future(a, 24).find((x) => a.bookings.some((b) => b.sessionId === x.id && b.creditCharged))!;
    const charged = a.bookings.filter((b) => b.sessionId === s.id && b.creditCharged);
    const r = cancelSession(a, s.id);
    expect(r.ok).toBe(true);
    for (const b of charged) {
      expect(membershipOf(r.state, b.membershipId!).creditsUsed).toBe(membershipOf(a, b.membershipId!).creditsUsed - charged.filter((x) => x.membershipId === b.membershipId).length);
    }
    expect(sessionTaken(r.state, s.id)).toBe(0);
    expect(bookSession(r.state, s.id, a.students[0].id).message).toMatch(/cancelada/);
  });

  it("el cupo no baja de las inscritas ni supera la sala; crear clase evita choques", () => {
    const a = fresh();
    const s = future(a, 24).find((x) => sessionTaken(a, x.id) > 1)!;
    expect(updateCapacity(a, s.id, sessionTaken(a, s.id) - 1).ok).toBe(false);
    expect(updateCapacity(a, s.id, 999).ok).toBe(false);
    const clash = createSession(a, {
      classTypeId: a.classTypes[0].id, instructorId: s.instructorId, roomId: s.roomId,
      day: s.start, time: new Date(s.start).toTimeString().slice(0, 5), capacity: 4,
    });
    expect(clash.ok).toBe(false);
    expect(clash.message).toMatch(/ocupada|ya da/);
  });
});

describe("membresías, pagos y ventas", () => {
  it("vender, reembolsar una vez y liberar las reservas de esa membresía", () => {
    let a = fresh();
    const st = a.students[0];
    a = sellPlan(a, st.id, a.plans.find((p) => p.enabled && p.credits && p.credits > 1)!.id, { discountPct: 10, status: "pagado", method: "Tarjeta" }).state;
    const tx = a.transactions[0];
    expect(tx.amount).toBe(Math.round(tx.listPrice * 0.9));
    const s = withRoom(a, future(a, 24).filter((x) => !a.bookings.some((b) => b.sessionId === x.id && b.studentId === st.id && isLive(b))));
    a = bookSession(a, s.id, st.id).state;
    const refund = refundTransaction(a, tx.id);
    expect(refund.ok).toBe(true);
    expect(refund.state.transactions[0].amount).toBe(-tx.amount);
    expect(membershipOf(refund.state, tx.membershipId!).status).toBe("cancelada");
    expect(refundTransaction(refund.state, tx.id).ok).toBe(false);
  });

  it("mover un interesado crea historial, tarea y, al ser cliente, su ficha", () => {
    const a = fresh();
    const lead = a.leads.find((l) => l.stage === "prueba")!;
    const r = moveLead(a, lead.id, "cliente");
    const moved = r.state.leads.find((l) => l.id === lead.id)!;
    expect(moved.history.length).toBeGreaterThan(lead.history.length);
    expect(r.state.tasks.length).toBe(a.tasks.length + 1);
    expect(r.state.students.some((s) => s.name === lead.name)).toBe(true);
    expect(dashboard(r.state).pendingLeads.length).toBe(dashboard(a).pendingLeads.length);
    expect(moveLead(r.state, lead.id, "cliente").ok).toBe(false);
  });

  it("las automatizaciones solo simulan y lo dicen", () => {
    const a = fresh();
    expect(a.automations.find((x) => x.id === "bienvenida")!.enabled).toBe(false);
    expect(runAutomation(a, "bienvenida").message).toMatch(/Activa la regla/);
    expect(runAutomation(toggleAutomation(a, "bienvenida").state, "bienvenida").ok).toBe(true);
    const r = runAutomation(a, "vencimiento");
    expect(r.ok).toBe(true);
    expect(r.message).toMatch(/Nada se envió|nadie cumple/);
    for (const entry of r.state.activity.filter((x) => x.kind === "automatizacion")) expect(entry.text).toMatch(/no se envía/);
  });
});
