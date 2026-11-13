import { describe, expect, it } from "vitest";
import { defaultConfig, planCatalog } from "./catalog";
import { bookAppointment, bookSession, cancelBooking, createSession, markAttendance, runAutomation } from "./engine";
import { creditsLeft, isLive, payingMembership, sessionTaken } from "./rules";
import { createDemo } from "./seed";
import { availableSlots, dashboard, previewAutomation, visibleViews } from "./selectors";
import { addDays, atTime, startOfDay } from "./time";
import type { DemoState, Session, VerticalId } from "./types";
import { capabilitiesOf, modeOf, verticalIds, verticals, viewLabel, withVertical } from "./verticals";

/** Miércoles 11 de noviembre de 2026, 10:00 hora local. */
const NOW = new Date(2026, 10, 11, 10, 0).toISOString();
const demo = (v: VerticalId) => createDemo({ ...defaultConfig(v), name: "Casa Aurora" }, NOW);
const end = (s: Session) => new Date(s.start).getTime() + s.minutes * 60_000;
const live = (st: DemoState) => st.sessions.filter((s) => s.status === "programada");
function overlapsBy(st: DemoState, key: "roomId" | "instructorId") {
  const list = live(st);
  return list.some((a) => list.some((b) => a.id !== b.id && a[key] === b[key] && new Date(a.start).getTime() < end(b) && end(a) > new Date(b.start).getTime()));
}
const tomorrowAt = (st: DemoState, hhmm: string) => atTime(addDays(startOfDay(new Date(st.now)), 1), hhmm).toISOString();

describe("registro de giros", () => {
  it("cada giro declara terminología, catálogos, presets y automatizaciones coherentes", () => {
    for (const id of verticalIds) {
      const v = verticals[id];
      expect(v.offerings.some((o) => o.suggested), id).toBe(true);
      for (const o of v.offerings) expect(v.allows, `${id}: ${o.name}`).toContain(o.kind);
      for (const p of v.suggestedPlans) expect(planCatalog[p], `${id}: ${p}`).toBeDefined();
      expect(v.sizes).toHaveLength(3);
      expect(v.staffNames.length).toBeGreaterThanOrEqual(8);
    }
  });

  it("la modalidad sale de lo que se ofrece", () => {
    expect(modeOf(defaultConfig("pilates"))).toBe("grupal");
    expect(modeOf(defaultConfig("spa"))).toBe("citas");
    expect(modeOf(defaultConfig("wellness"))).toBe("hibrido");
    expect(modeOf(defaultConfig("otro"))).toBe("citas");
    const otherWithWorkshop = { ...defaultConfig("otro"), offerings: [...defaultConfig("otro").offerings, { name: "Taller grupal", minutes: 90, kind: "grupal" as const, price: 0 }] };
    expect(modeOf(otherWithWorkshop)).toBe("hibrido");
  });

  it("cambiar de giro reemplaza sugerencias pero conserva nombre y marca", () => {
    const c = { ...defaultConfig("pilates"), name: "Casa Aurora", theme: "salvia" as const };
    const spa = withVertical(c, "spa");
    expect(spa.name).toBe("Casa Aurora");
    expect(spa.theme).toBe("salvia");
    expect(spa.offerings.every((o) => o.kind === "individual")).toBe(true);
    expect(spa.plans.every((p) => p.startsWith("spa_"))).toBe(true);
  });

  it("menú y etiquetas se adaptan: un spa no tiene clases, cupos ni profesores", () => {
    const spa = demo("spa");
    expect(viewLabel("agenda", spa.config)).toBe("Citas");
    expect(viewLabel("alumnas", spa.config)).toBe("Clientes");
    expect(viewLabel("servicios", spa.config)).toBe("Tratamientos");
    expect(viewLabel("profesores", spa.config)).toBe("Terapeutas");
    expect(visibleViews(spa)).toContain("servicios");
    expect(capabilitiesOf(spa.config).waitlist).toBe(false);
    expect(spa.sessions.every((s) => s.kind === "cita" && s.capacity === 1)).toBe(true);
    expect(spa.automations.map((a) => a.id)).not.toContain("lugar_liberado");
    const pilates = demo("pilates");
    expect(visibleViews(pilates)).not.toContain("servicios");
    expect(pilates.sessions.every((s) => s.kind === "grupal")).toBe(true);
  });
});

describe("datos ficticios por giro", () => {
  for (const id of verticalIds) {
    it(`${id}: deterministas y sin violar reglas`, () => {
      const a = demo(id);
      expect(JSON.stringify(a)).toBe(JSON.stringify(demo(id)));
      expect(a.sessions.length).toBeGreaterThan(15);
      expect(overlapsBy(a, "roomId")).toBe(false);
      expect(overlapsBy(a, "instructorId")).toBe(false);
      for (const s of a.sessions) expect(sessionTaken(a, s.id)).toBeLessThanOrEqual(s.capacity);
      const keys = a.bookings.filter(isLive).map((b) => b.sessionId + b.studentId);
      expect(new Set(keys).size).toBe(keys.length);
      for (const m of a.memberships) if (m.creditsTotal !== null) expect(m.creditsUsed).toBeLessThanOrEqual(m.creditsTotal);
      // Nadie tiene dos sesiones al mismo tiempo.
      const byStudent = new Map<string, Session[]>();
      for (const b of a.bookings.filter(isLive)) byStudent.set(b.studentId, [...(byStudent.get(b.studentId) ?? []), a.sessions.find((s) => s.id === b.sessionId)!]);
      for (const list of byStudent.values()) for (const x of list) for (const y of list) if (x.id !== y.id) expect(new Date(x.start).getTime() < end(y) && end(x) > new Date(y.start).getTime()).toBe(false);
    });
  }

  it("el centro wellness combina actividades grupales en su salón y citas en espacios privados", () => {
    const w = demo("wellness");
    const groups = w.sessions.filter((s) => s.kind === "grupal");
    const solos = w.sessions.filter((s) => s.kind === "cita");
    expect(groups.length).toBeGreaterThan(3);
    expect(solos.length).toBeGreaterThan(10);
    for (const s of groups) expect(w.rooms.find((r) => r.id === s.roomId)!.kind).toBe("grupal");
    for (const s of solos) expect(w.rooms.find((r) => r.id === s.roomId)!.kind).toBe("individual");
  });

  it("el dashboard del spa mide citas, ocupación de cabinas e ingreso estimado", () => {
    const d = dashboard(demo("spa"));
    expect(d.appointmentsToday.length).toBeGreaterThan(0);
    expect(d.classesToday).toHaveLength(0);
    expect(d.roomOccupancy).toBeGreaterThan(0);
    expect(d.expectedToday).toBeGreaterThan(0);
  });
});

describe("motor de citas", () => {
  const spa = demo("spa");
  const service = spa.classTypes[0];
  const client = spa.students.find((s) => !payingMembership(spa, s.id, tomorrowAt(spa, "12:00")))!;

  it("agenda una cita y la cobra en la visita si no hay paquete", () => {
    const start = availableSlots(spa, service.id, { limit: 1, from: addDays(new Date(spa.now), 1) })[0].start;
    const r = bookAppointment(spa, { studentId: client.id, classTypeId: service.id, start });
    expect(r.ok, r.message).toBe(true);
    expect(r.message).toMatch(/Se cobraría en la visita/);
    const s = r.state.sessions.at(-1)!;
    expect(s.kind).toBe("cita");
    expect(r.state.transactions.length).toBe(spa.transactions.length);
  });

  it("no permite dos citas empalmadas con el mismo terapeuta ni en la misma cabina", () => {
    const start = availableSlots(spa, service.id, { limit: 1, from: addDays(new Date(spa.now), 1) })[0];
    const first = bookAppointment(spa, { studentId: client.id, classTypeId: service.id, start: start.start, instructorId: start.instructorId, roomId: start.roomId });
    expect(first.ok, first.message).toBe(true);
    const other = spa.students.find((s) => s.id !== client.id && !first.state.bookings.some((b) => b.studentId === s.id && isLive(b) && first.state.sessions.find((x) => x.id === b.sessionId)!.start === start.start))!;
    const sameStaff = bookAppointment(first.state, { studentId: other.id, classTypeId: service.id, start: start.start, instructorId: start.instructorId });
    expect(sameStaff.ok).toBe(false);
    expect(sameStaff.message).toMatch(/ya atiende/);
    const sameRoom = bookAppointment(first.state, { studentId: other.id, classTypeId: service.id, start: start.start, roomId: start.roomId });
    expect(sameRoom.ok).toBe(false);
    expect(sameRoom.message).toMatch(/ocupada/);
    // Media hora después sigue empalmado (el servicio dura más).
    const later = new Date(new Date(start.start).getTime() + 30 * 60_000).toISOString();
    expect(bookAppointment(first.state, { studentId: other.id, classTypeId: service.id, start: later, instructorId: start.instructorId }).ok).toBe(false);
    // La misma persona no puede estar en dos citas a la vez.
    expect(bookAppointment(first.state, { studentId: client.id, classTypeId: service.id, start: start.start }).message).toMatch(/ya tiene/);
  });

  it("con paquete descuenta una sesión una sola vez y la devuelve al cancelar a tiempo", () => {
    const at = tomorrowAt(spa, "12:00");
    const withPack = spa.students.find((s) => { const m = payingMembership(spa, s.id, at); return m && m.creditsTotal !== null && creditsLeft(m)! >= 1; })!;
    const m0 = payingMembership(spa, withPack.id, at)!;
    const slot = availableSlots(spa, service.id, { limit: 20, from: addDays(new Date(spa.now), 2) }).find(Boolean)!;
    const r = bookAppointment(spa, { studentId: withPack.id, classTypeId: service.id, start: slot.start });
    expect(r.ok, r.message).toBe(true);
    const m1 = r.state.memberships.find((m) => m.id === m0.id)!;
    expect(m1.creditsUsed).toBe(m0.creditsUsed + 1);
    const booking = r.state.bookings.at(-1)!;
    const c = cancelBooking(r.state, booking.id);
    expect(c.ok).toBe(true);
    expect(c.state.memberships.find((m) => m.id === m0.id)!.creditsUsed).toBe(m0.creditsUsed);
    expect(c.state.sessions.find((s) => s.id === booking.sessionId)!.status).toBe("cancelada");
    // Cancelar dos veces no devuelve dos veces.
    expect(cancelBooking(c.state, booking.id).ok).toBe(false);
    // El horario quedó libre otra vez.
    expect(bookAppointment(c.state, { studentId: client.id, classTypeId: service.id, start: slot.start, instructorId: slot.instructorId, roomId: slot.roomId }).ok).toBe(true);
  });

  it("al llegar sin paquete se registra el cobro una vez; si no asistió no se cobra", () => {
    const today = spa.bookings.find((b) => b.status === "reservada" && !b.membershipId && new Date(spa.sessions.find((s) => s.id === b.sessionId)!.start) <= new Date(spa.now));
    if (!today) return;
    const arrived = markAttendance(spa, today.id, true);
    expect(arrived.state.transactions.filter((t) => t.bookingId === today.id)).toHaveLength(1);
    const again = markAttendance(arrived.state, today.id, true);
    expect(again.state.transactions.filter((t) => t.bookingId === today.id)).toHaveLength(1);
    const noShow = markAttendance(arrived.state, today.id, false);
    expect(noShow.state.transactions.filter((t) => t.bookingId === today.id)).toHaveLength(0);
  });

  it("las citas no aceptan reservas de clase ni lista de espera, y lo grupal no se agenda como cita", () => {
    const appointment = spa.sessions.find((s) => new Date(s.start) > new Date(spa.now))!;
    expect(bookSession(spa, appointment.id, client.id).message).toMatch(/cita individual/);
    const w = demo("wellness");
    const group = w.classTypes.find((c) => c.kind === "grupal")!;
    const solo = w.classTypes.find((c) => c.kind === "individual")!;
    expect(bookAppointment(w, { studentId: w.students[0].id, classTypeId: group.id, start: tomorrowAt(w, "12:00") }).message).toMatch(/grupal/);
    const privateRoom = w.rooms.find((r) => r.kind === "individual")!;
    expect(createSession(w, { classTypeId: solo.id, instructorId: w.instructors[0].id, roomId: w.rooms[0].id, day: addDays(startOfDay(new Date(w.now)), 2).toISOString(), time: "13:00", capacity: 5 }).message).toMatch(/individual/);
    expect(createSession(w, { classTypeId: group.id, instructorId: w.instructors[0].id, roomId: privateRoom.id, day: addDays(startOfDay(new Date(w.now)), 2).toISOString(), time: "13:00", capacity: 5 }).message).toMatch(/individuales/);
  });

  it("las automatizaciones del spa encuentran casos reales y nunca envían nada", () => {
    for (const id of verticals.spa.automations) {
      const targets = previewAutomation(spa, id);
      expect(Array.isArray(targets)).toBe(true);
    }
    expect(previewAutomation(spa, "recordatorio").length).toBeGreaterThan(0);
    const state = { ...spa, automations: spa.automations.map((a) => ({ ...a, enabled: true })) };
    const r = runAutomation(state, "reactivacion");
    expect(r.ok).toBe(true);
    expect(r.message).toMatch(/Nada se envió|nadie cumple/);
    for (const entry of r.state.activity.filter((x) => x.kind === "automatizacion")) expect(entry.text).toMatch(/no se envía/);
  });
});
