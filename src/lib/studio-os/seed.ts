import { automationIds, defaultStageLabels, fictionalName, instructorNames, leadNames, planCatalog, planKinds } from "./catalog";
import { applyAttendance, applyBook, nextId } from "./engine";
import { payingMembership } from "./rules";
import { addDays, atTime, hashString, sameDay, seededRandom, startOfWeek } from "./time";
import type { DemoState, Lead, Membership, PlanKind, Session, Student, StudioConfig, Transaction } from "./types";

/** Horarios base por día (lunes … domingo). */
const SLOTS: string[][] = [
  ["07:00", "09:00", "18:00", "19:30"],
  ["07:00", "09:00", "18:00", "19:30"],
  ["07:00", "09:00", "18:00", "19:30"],
  ["07:00", "09:00", "18:00", "19:30"],
  ["07:00", "09:00", "18:00", "19:30"],
  ["08:30", "10:00"],
  ["10:00"],
];
const INSTRUCTOR_DAYS = [[1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5], [1, 3, 5, 6], [0, 2, 4, 6], [1, 2, 3, 4, 5]];
const TAGS = ["Constante", "Mañanas", "Tardes", "Principiante", "Cuida rodilla", "Prenatal", "Referida", "Avanzada"];
const NOTES = [
  "Prefiere el reformer junto a la ventana.",
  "Recuperándose de una molestia lumbar: evitar torsiones intensas.",
  "Le interesa el paquete de 20 clases.",
  "Viene con su hermana los sábados.",
  "Pidió factura en su último pago.",
  "",
];
const WEEKLY_LIMIT = 3;

export function createDemo(config: StudioConfig, nowIso: string): DemoState {
  const now = new Date(nowIso);
  const rand = seededRandom(hashString([config.type, config.classes.map((c) => c.name).join(), config.instructors, config.rooms, config.capacity, config.plans.join()].join("|")));
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];

  const d: DemoState = {
    version: 1,
    now: nowIso,
    seq: 0,
    config: structuredClone(config),
    settings: {
      cancellationHours: 12,
      lateCancel: "pierde",
      waitlist: true,
      expiryWarningDays: 5,
      notifications: { recordatorio: true, espera: true, vencimiento: true },
      stageLabels: { ...defaultStageLabels },
    },
    role: "duena",
    viewAsInstructorId: "",
    portalStudentId: "",
    classTypes: [],
    branches: [{ id: "b0", name: "Sucursal principal" }],
    rooms: [],
    instructors: [],
    plans: planKinds.map((id) => ({ id, ...pick0(planCatalog[id]), enabled: config.plans.includes(id) })),
    students: [],
    memberships: [],
    sessions: [],
    bookings: [],
    leads: [],
    tasks: [],
    transactions: [],
    activity: [],
    automations: automationIds.map((id) => ({ id, enabled: id === "vencimiento" || id === "sin_reserva" })),
  };
  if (!d.plans.some((p) => p.enabled)) d.plans[0].enabled = true;

  d.classTypes = (config.classes.length ? config.classes : [{ name: "Clase grupal", minutes: 50 }]).map((c) => ({ id: nextId(d, "c"), name: c.name, minutes: c.minutes }));
  const roomNames = config.type === "reformer" || config.type === "mixto" ? ["Sala Reformer", "Sala Mat", "Sala 3", "Sala 4"] : ["Sala principal", "Sala 2", "Sala 3", "Sala 4"];
  d.rooms = Array.from({ length: Math.max(1, Math.min(4, config.rooms)) }, (_, i) => ({ id: nextId(d, "o"), name: roomNames[i], branchId: "b0", capacity: config.capacity }));
  const instructorCount = Math.max(1, Math.min(8, config.instructors));
  d.instructors = Array.from({ length: instructorCount }, (_, i) => ({
    id: nextId(d, "i"),
    name: instructorNames[i],
    days: instructorCount === 1 ? [0, 1, 2, 3, 4, 5, 6] : INSTRUCTOR_DAYS[Math.min(i, INSTRUCTOR_DAYS.length - 1)],
    ratePerClass: 350 + (i % 3) * 50,
  }));
  d.viewAsInstructorId = d.instructors[0].id;

  /* Horario de la semana actual. */
  const weekStart = startOfWeek(now);
  SLOTS.forEach((slots, dayOffset) => {
    const day = addDays(weekStart, dayOffset);
    slots.forEach((time, si) => {
      const used = new Set<string>();
      d.rooms.slice(0, 2).forEach((room, r) => {
        const type = d.classTypes[(dayOffset + si + r) % d.classTypes.length];
        const available = d.instructors.filter((i) => i.days.includes(day.getDay()) && !used.has(i.id));
        if (!available.length) return;
        const instructor = available[(dayOffset * 3 + si + r) % available.length];
        used.add(instructor.id);
        d.sessions.push({
          id: nextId(d, "s"), classTypeId: type.id, instructorId: instructor.id, roomId: room.id,
          start: atTime(day, time).toISOString(), minutes: type.minutes, capacity: room.capacity, status: "programada",
        });
      });
    });
  });

  /* Alumnas y membresías. */
  const seats = d.sessions.reduce((acc, s) => acc + s.capacity, 0);
  const studentCount = Math.max(24, Math.min(80, Math.round((seats * 0.75) / 2.6)));
  const enabled = d.plans.filter((p) => p.enabled);
  const regularPlans = enabled.filter((p) => p.id !== "prueba" && p.id !== "individual");
  const usual = regularPlans.length ? regularPlans : enabled;
  const creditPlans = usual.filter((p) => p.credits !== null);
  const trial = enabled.find((p) => p.id === "prueba") ?? enabled[0];

  const addMembership = (studentId: string, planId: PlanKind, start: Date, used: number, extra: Partial<Membership> = {}) => {
    const plan = d.plans.find((p) => p.id === planId)!;
    const m: Membership = {
      id: nextId(d, "m"), studentId, planId, start: start.toISOString(), end: addDays(start, plan.validityDays).toISOString(),
      creditsTotal: plan.credits, creditsUsed: plan.credits === null ? 0 : Math.min(plan.credits, used), status: "activa", ...extra,
    };
    d.memberships.push(m);
    return m;
  };

  for (let i = 0; i < studentCount; i++) {
    const id = nextId(d, "p");
    const isNew = i < 2;
    const joined = isNew ? addDays(now, -(3 + i)) : addDays(now, -(40 + Math.floor(rand() * 400)));
    const student: Student = {
      id, name: fictionalName(i), hue: Math.floor(rand() * 360),
      tags: isNew ? ["Nueva"] : [pick(TAGS), ...(rand() > 0.6 ? [pick(TAGS)] : [])].filter((t, k, all) => all.indexOf(t) === k),
      notes: isNew ? "" : pick(NOTES),
      followUp: null,
      joinedAt: joined.toISOString(),
      pastVisits: isNew ? 0 : 3 + Math.floor(rand() * 70),
      lastVisitBefore: isNew ? null : addDays(weekStart, -(1 + Math.floor(rand() * (i % 9 === 0 ? 40 : 10)))).toISOString(),
    };
    d.students.push(student);

    if (isNew) {
      addMembership(id, trial.id, joined, 0);
      continue;
    }
    const plan = i === 8 && creditPlans.length ? creditPlans[0] : pick(usual);
    const validity = plan.validityDays;
    if (i >= 2 && i <= 4) {
      // Vencidas: sirven para ver renovaciones y el aviso de vencimiento.
      addMembership(id, plan.id, addDays(now, -(validity + 3 + i)), Math.floor((plan.credits ?? 0) * 0.8));
      continue;
    }
    if (i === 5) {
      addMembership(id, plan.id, addDays(now, -Math.floor(validity * 0.3)), 2, { status: "pausada", pausedDays: 14 });
      continue;
    }
    const start = i === 6 || i === 7 ? addDays(now, -(validity - 3)) : addDays(now, -Math.floor(rand() * validity * 0.6));
    // La mayoría renovó: el periodo anterior termina justo cuando empieza el actual.
    if (rand() > 0.25) addMembership(id, plan.id, addDays(start, -validity), plan.credits ?? 0);
    const used = i === 8 && plan.credits ? plan.credits - 1 : Math.floor(rand() * (plan.credits ?? 0) * 0.4);
    addMembership(id, plan.id, start, used);
  }
  // Una membresía reembolsada, como ejemplo.
  const refunded = addMembership(d.students[10].id, usual[0].id, addDays(now, -12), 0, { status: "cancelada" });

  /* Transacciones derivadas de las membresías. */
  const sorted = [...d.memberships].sort((a, b) => a.start.localeCompare(b.start));
  const seen = new Set<string>();
  let pendingLeft = 3;
  [...sorted].reverse().forEach((m, k) => {
    const plan = d.plans.find((p) => p.id === m.planId)!;
    const discountPct = k % 6 === 3 ? 10 : 0;
    const amount = Math.round(plan.price * (1 - discountPct / 100));
    const pending = pendingLeft > 0 && m.status === "activa" && k % 2 === 1;
    if (pending) pendingLeft -= 1;
    const earlier = sorted.some((x) => x.studentId === m.studentId && x.start < m.start);
    const t: Transaction = {
      id: nextId(d, "t"), studentId: m.studentId, concept: plan.name, planId: m.planId, listPrice: plan.price, discountPct, amount,
      kind: earlier ? "renovacion" : "venta", status: pending ? "pendiente" : "pagado",
      method: (["Tarjeta", "Transferencia", "Efectivo"] as const)[k % 3], at: m.start, membershipId: m.id, refunded: m.id === refunded.id,
    };
    seen.add(m.studentId);
    d.transactions.push(t);
    if (m.id === refunded.id) {
      d.transactions.push({ ...t, id: nextId(d, "t"), concept: `Reembolso · ${plan.name}`, amount: -amount, listPrice: amount, discountPct: 0, kind: "reembolso", status: "pagado", at: addDays(now, -10).toISOString(), refunded: undefined });
    }
  });
  d.transactions.sort((a, b) => b.at.localeCompare(a.at));

  /* Reservas con el mismo motor de la demo (respeta cupos y créditos). */
  const weekly = new Map<string, number>();
  const futureWithWaitlist = new Set<string>();
  const order = [...d.students];
  // Dos clases futuras llenas con lista de espera, para ver la regla en acción.
  const futureSessions = d.sessions.filter((s) => new Date(s.start).getTime() - now.getTime() > 20 * 3_600_000);
  const packed = new Set([futureSessions[1]?.id, futureSessions[4]?.id].filter(Boolean));
  for (const s of [...d.sessions].sort((a, b) => a.start.localeCompare(b.start))) {
    const target = packed.has(s.id) ? s.capacity + 2 : Math.round(s.capacity * (0.5 + rand() * 0.5));
    const isFuture = new Date(s.start) > now;
    const allowWaitlist = isFuture && packed.has(s.id);
    d.now = addDays(new Date(s.start), -2).toISOString();
    let booked = 0;
    for (let k = order.length - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1));
      [order[k], order[j]] = [order[j], order[k]];
    }
    for (const student of order) {
      if (booked >= Math.min(target, s.capacity + (allowWaitlist ? 2 : 0))) break;
      if ((weekly.get(student.id) ?? 0) >= WEEKLY_LIMIT || !payingMembership(d, student.id, s.start)) continue;
      if (booked >= s.capacity && !allowWaitlist) break;
      try {
        applyBook(d, s.id, student.id);
        weekly.set(student.id, (weekly.get(student.id) ?? 0) + 1);
        booked += 1;
        if (booked > s.capacity) futureWithWaitlist.add(s.id);
      } catch {
        /* La regla del motor lo impidió (p. ej. duplicado): se omite. */
      }
    }
  }
  d.now = nowIso;
  // La última clase que ya empezó hoy queda sin pasar lista: es una tarea real del día.
  const startedToday = d.sessions.filter((s) => new Date(s.start) <= now && sameDay(s.start, now)).sort((a, b) => b.start.localeCompare(a.start));
  const unrecorded = new Set(startedToday.length ? d.sessions.filter((s) => s.start === startedToday[0].start).map((s) => s.id) : []);
  for (const b of d.bookings) {
    const s = d.sessions.find((x) => x.id === b.sessionId) as Session;
    if (b.status === "reservada" && new Date(s.start) <= now && !unrecorded.has(s.id)) applyAttendance(d, b.id, rand() < 0.88);
  }

  /* Interesados y tareas. */
  const stages: Lead["stage"][] = ["nuevo", "nuevo", "nuevo", "contactado", "contactado", "prueba", "prueba", "cliente", "seguimiento"];
  d.leads = leadNames.map((name, i) => {
    const createdAt = addDays(now, -(1 + ((i * 5) % 12))).toISOString();
    const source = (["Instagram", "WhatsApp", "Recomendación", "Sitio web"] as const)[i % 4];
    const interest = d.classTypes[i % d.classTypes.length].name;
    const history = [{ at: createdAt, text: `Llegó por ${source}. Le interesa ${interest}.` }];
    if (stages[i] !== "nuevo") history.push({ at: addDays(new Date(createdAt), 1).toISOString(), text: `Pasó a "${defaultStageLabels[stages[i]]}".` });
    return { id: nextId(d, "l"), name, interest, source, stage: stages[i], createdAt, history };
  });
  d.tasks = [
    { id: nextId(d, "k"), text: `Confirmar la clase de prueba de ${d.leads[5].name.split(" ")[0]}`, due: addDays(now, 1).toISOString(), done: false },
    { id: nextId(d, "k"), text: "Revisar los pagos pendientes de la semana", due: now.toISOString(), done: false },
    { id: nextId(d, "k"), text: "Definir sustituto para el sábado", due: addDays(now, 2).toISOString(), done: false },
  ];
  d.portalStudentId = d.students.find((s) => payingMembership(d, s.id, addDays(now, 1).toISOString()))?.id ?? d.students[0].id;

  /* Actividad reciente legible. */
  d.activity = [];
  const at = (hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString();
  const lastPaid = d.transactions.find((t) => t.status === "pagado" && t.kind !== "reembolso");
  const push = (hours: number, kind: DemoState["activity"][number]["kind"], text: string) => d.activity.push({ id: nextId(d, "a"), at: at(hours), kind, text });
  push(0.5, "reserva", `${d.students[3].name} reservó una clase de ${d.classTypes[0].name}.`);
  push(2, "venta", `Nuevo interesado: ${d.leads[0].name} (${d.leads[0].source}).`);
  if (lastPaid) push(5, "pago", `Pago registrado: ${lastPaid.concept} de ${d.students.find((s) => s.id === lastPaid.studentId)?.name}.`);
  push(26, "membresia", `Membresía de ${d.students[5].name} pausada 14 días.`);
  return d;
}

function pick0<T extends { name: string; price: number; credits: number | null; validityDays: number }>(p: T) {
  return { name: p.name, price: p.price, credits: p.credits, validityDays: p.validityDays };
}
