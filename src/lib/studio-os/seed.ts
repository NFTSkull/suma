import { automationCopy, fictionalName, leadNames } from "./catalog";
import { applyAttendance, applyBook, applyBookAppointment, CLOSE_HOUR, nextId } from "./engine";
import { payingMembership } from "./rules";
import { addDays, atTime, hashString, sameDay, seededRandom, startOfWeek } from "./time";
import type { DemoState, Lead, Membership, PlanKind, Room, Session, Student, StudioConfig, Transaction } from "./types";
import { capabilitiesOf, stageLabelsFor, termsOf, verticalOf } from "./verticals";

/**
 * Datos ficticios deterministas por giro. Todo se agenda con el mismo motor
 * de la demo, así que los datos de ejemplo nunca violan sus reglas
 * (sin sobrecupo, sin duplicados, sin citas empalmadas).
 */

/** Horarios grupales base por día (lunes … domingo). */
const SLOTS: string[][] = [
  ["07:00", "09:00", "18:00", "19:30"],
  ["07:00", "09:00", "18:00", "19:30"],
  ["07:00", "09:00", "18:00", "19:30"],
  ["07:00", "09:00", "18:00", "19:30"],
  ["07:00", "09:00", "18:00", "19:30"],
  ["08:30", "10:00"],
  ["10:00"],
];
/** En un centro híbrido las actividades grupales son menos y conviven con citas. */
const HYBRID_SLOTS: string[][] = [["07:30", "19:00"], ["19:00"], ["07:30", "19:00"], ["19:00"], ["07:30", "18:30"], ["09:00"], []];
/** Horario de citas por día (lunes … domingo). */
const APPOINTMENT_HOURS: [number, number][] = [[9, 20], [9, 20], [9, 20], [9, 20], [9, 20], [9, 18], [10, 15]];
const INSTRUCTOR_DAYS = [[1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5], [1, 3, 5, 6], [0, 2, 4, 6], [1, 2, 3, 4, 5]];
const WEEKLY_LIMIT = 3;

export function createDemo(config: StudioConfig, nowIso: string): DemoState {
  const now = new Date(nowIso);
  const v = verticalOf(config);
  const t = termsOf(config);
  const caps = capabilitiesOf(config);
  const rand = seededRandom(hashString([config.vertical, config.offerings.map((c) => c.name + c.kind).join(), config.instructors, config.rooms, config.capacity, config.plans.join()].join("|")));
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];
  const tags = caps.appointments
    ? ["Frecuente", "Mañanas", "Tardes", "Primera vez", "Prefiere aroma suave", "Referida", "Regalo", "Fin de semana"]
    : ["Constante", "Mañanas", "Tardes", "Principiante", "Cuida rodilla", "Prenatal", "Referida", "Avanzada"];
  const notes = caps.appointments
    ? ["Prefiere presión media.", "Le gusta la cabina más silenciosa.", "Le interesa el paquete de 6 sesiones.", "Viene con su pareja los sábados.", "Pidió factura en su último pago.", ""]
    : ["Prefiere el reformer junto a la ventana.", "Recuperándose de una molestia: evitar torsiones intensas.", "Le interesa el paquete de 20 clases.", "Viene con su hermana los sábados.", "Pidió factura en su último pago.", ""];

  const d: DemoState = {
    version: 2,
    now: nowIso,
    seq: 0,
    config: structuredClone(config),
    settings: {
      cancellationHours: caps.appointments && !caps.groups ? 24 : 12,
      lateCancel: "pierde",
      waitlist: caps.waitlist,
      expiryWarningDays: 5,
      notifications: { recordatorio: true, espera: caps.waitlist, vencimiento: true },
      stageLabels: stageLabelsFor(config),
    },
    role: "duena",
    viewAsInstructorId: "",
    portalStudentId: "",
    classTypes: [],
    branches: [{ id: "b0", name: "Sucursal principal" }],
    rooms: [],
    instructors: [],
    plans: v.plans.map((p) => ({ id: p.id, role: p.role, name: p.name, price: p.price, credits: p.credits, validityDays: p.validityDays, enabled: config.plans.includes(p.id) })),
    students: [],
    memberships: [],
    sessions: [],
    bookings: [],
    leads: [],
    tasks: [],
    transactions: [],
    activity: [],
    automations: v.automations.map((id, i) => ({ id, enabled: i === 0 || id === "sin_reserva" || id === "confirmacion" })),
  };
  // Los giros de clases necesitan al menos un plan para reservar; en citas se puede pagar por servicio.
  if (caps.groups && !d.plans.some((p) => p.enabled)) d.plans[0].enabled = true;

  const offerings = config.offerings.length ? config.offerings : v.offerings.filter((o) => o.suggested);
  d.classTypes = offerings.map((c) => ({ id: nextId(d, "c"), name: c.name, minutes: c.minutes, kind: c.kind, price: c.price }));
  const groupTypes = d.classTypes.filter((c) => c.kind === "grupal");
  const soloTypes = d.classTypes.filter((c) => c.kind === "individual");

  /* Espacios: salas grupales, cabinas individuales o ambos. */
  const roomCount = Math.max(caps.mode === "hibrido" ? 2 : 1, Math.min(4, config.rooms));
  const kinds: Room["kind"][] = Array.from({ length: roomCount }, (_, i) => (caps.mode === "grupal" ? "grupal" : caps.mode === "citas" ? "individual" : i === 0 ? "grupal" : "individual"));
  let gi = 0;
  let ii = 0;
  d.rooms = kinds.map((kind) => ({
    id: nextId(d, "o"),
    name: kind === "grupal" ? v.spaceNames.grupal[gi++] ?? `Sala ${gi}` : v.spaceNames.individual[ii++] ?? `Espacio ${ii}`,
    branchId: "b0",
    capacity: kind === "grupal" ? config.capacity : 1,
    kind,
  }));
  const instructorCount = Math.max(1, Math.min(8, config.instructors));
  d.instructors = Array.from({ length: instructorCount }, (_, i) => ({
    id: nextId(d, "i"),
    name: v.staffNames[i],
    days: instructorCount === 1 ? [0, 1, 2, 3, 4, 5, 6] : INSTRUCTOR_DAYS[Math.min(i, INSTRUCTOR_DAYS.length - 1)],
    ratePerClass: caps.appointments ? 300 + (i % 3) * 50 : 350 + (i % 3) * 50,
  }));
  d.viewAsInstructorId = d.instructors[0].id;

  /* Clases grupales de la semana. */
  const weekStart = startOfWeek(now);
  if (caps.groups && groupTypes.length) {
    const slots = caps.mode === "hibrido" ? HYBRID_SLOTS : SLOTS;
    const groupRooms = d.rooms.filter((r) => r.kind === "grupal");
    slots.forEach((daySlots, dayOffset) => {
      const day = addDays(weekStart, dayOffset);
      daySlots.forEach((time, si) => {
        const used = new Set<string>();
        groupRooms.slice(0, 2).forEach((room, r) => {
          const type = groupTypes[(dayOffset + si + r) % groupTypes.length];
          const available = d.instructors.filter((i) => i.days.includes(day.getDay()) && !used.has(i.id));
          if (!available.length) return;
          const instructor = available[(dayOffset * 3 + si + r) % available.length];
          used.add(instructor.id);
          d.sessions.push({
            id: nextId(d, "s"), kind: "grupal", classTypeId: type.id, instructorId: instructor.id, roomId: room.id,
            start: atTime(day, time).toISOString(), minutes: type.minutes, capacity: room.capacity, status: "programada",
          });
        });
      });
    });
  }

  /* Clientes y planes. */
  const seats = d.sessions.reduce((acc, s) => acc + s.capacity, 0);
  const studentCount = caps.mode === "grupal" ? Math.max(24, Math.min(80, Math.round((seats * 0.75) / 2.6))) : caps.mode === "hibrido" ? 64 : 56;
  const enabled = d.plans.filter((p) => p.enabled);
  const regularPlans = enabled.filter((p) => p.role === "paquete" || p.role === "membresia");
  const usual = regularPlans.length ? regularPlans : enabled;
  const creditPlans = usual.filter((p) => p.credits !== null);
  const trial = enabled.find((p) => p.role === "prueba") ?? enabled[0];
  /** En citas no todas compran paquete: muchas pagan por servicio. */
  const packageShare = caps.mode === "grupal" ? 1 : caps.mode === "hibrido" ? 0.6 : 0.45;

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
      tags: isNew ? ["Nueva"] : [pick(tags), ...(rand() > 0.6 ? [pick(tags)] : [])].filter((x, k, all) => all.indexOf(x) === k),
      notes: isNew ? "" : pick(notes),
      followUp: null,
      joinedAt: joined.toISOString(),
      pastVisits: isNew ? 0 : caps.mode === "grupal" ? 3 + Math.floor(rand() * 70) : Math.floor(rand() * 14),
      lastVisitBefore: isNew ? null : addDays(weekStart, -(1 + Math.floor(rand() * (i % 9 === 0 ? 45 : caps.mode === "grupal" ? 10 : 30)))).toISOString(),
    };
    d.students.push(student);
    if (!enabled.length) continue;
    if (isNew) {
      if (trial) addMembership(id, trial.id, joined, 0);
      continue;
    }
    if (caps.mode !== "grupal" && i >= 9 && rand() > packageShare) continue;
    const plan = i === 8 && creditPlans.length ? creditPlans[0] : pick(usual);
    const validity = plan.validityDays;
    if (i >= 2 && i <= 4) {
      // Vencidas o agotadas: sirven para ver renovaciones.
      addMembership(id, plan.id, addDays(now, -(validity + 3 + i)), plan.credits ?? 0);
      continue;
    }
    if (i === 5) {
      addMembership(id, plan.id, addDays(now, -Math.floor(validity * 0.3)), 1, { status: "pausada", pausedDays: 14 });
      continue;
    }
    const start = i === 6 || i === 7 ? addDays(now, -(validity - 3)) : addDays(now, -Math.floor(rand() * validity * 0.6));
    if (rand() > 0.25) addMembership(id, plan.id, addDays(start, -validity), plan.credits ?? 0);
    const used = i === 8 && plan.credits ? plan.credits - 1 : Math.floor(rand() * (plan.credits ?? 0) * 0.4);
    addMembership(id, plan.id, start, used);
  }
  const refunded = usual.length ? addMembership(d.students[10].id, usual[0].id, addDays(now, -12), 0, { status: "cancelada" }) : null;

  /* Transacciones de las ventas de planes. */
  const sorted = [...d.memberships].sort((a, b) => a.start.localeCompare(b.start));
  let pendingLeft = 3;
  [...sorted].reverse().forEach((m, k) => {
    const plan = d.plans.find((p) => p.id === m.planId)!;
    const discountPct = k % 6 === 3 ? 10 : 0;
    const amount = Math.round(plan.price * (1 - discountPct / 100));
    const pending = pendingLeft > 0 && m.status === "activa" && k % 2 === 1;
    if (pending) pendingLeft -= 1;
    const earlier = sorted.some((x) => x.studentId === m.studentId && x.start < m.start);
    const tx: Transaction = {
      id: nextId(d, "t"), studentId: m.studentId, concept: plan.name, planId: m.planId, listPrice: plan.price, discountPct, amount,
      kind: earlier ? "renovacion" : "venta", status: pending ? "pendiente" : "pagado",
      method: (["Tarjeta", "Transferencia", "Efectivo"] as const)[k % 3], at: m.start, membershipId: m.id, refunded: m.id === refunded?.id,
    };
    d.transactions.push(tx);
    if (m.id === refunded?.id) {
      d.transactions.push({ ...tx, id: nextId(d, "t"), concept: `Reembolso · ${plan.name}`, amount: -amount, listPrice: amount, discountPct: 0, kind: "reembolso", status: "pagado", at: addDays(now, -10).toISOString(), refunded: undefined });
    }
  });

  /* Reservas en clases grupales (respeta cupos y créditos). */
  const weekly = new Map<string, number>();
  const order = [...d.students];
  const shuffle = () => {
    for (let k = order.length - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1));
      [order[k], order[j]] = [order[j], order[k]];
    }
  };
  if (d.sessions.length) {
    // Dos clases futuras llenas con lista de espera, para ver la regla en acción.
    const futureSessions = d.sessions.filter((s) => new Date(s.start).getTime() - now.getTime() > 20 * 3_600_000);
    const packed = new Set([futureSessions[1]?.id, futureSessions[4]?.id].filter(Boolean));
    for (const s of [...d.sessions].sort((a, b) => a.start.localeCompare(b.start))) {
      const target = packed.has(s.id) ? s.capacity + 2 : Math.round(s.capacity * (0.5 + rand() * 0.5));
      const allowWaitlist = new Date(s.start) > now && packed.has(s.id);
      d.now = addDays(new Date(s.start), -2).toISOString();
      let booked = 0;
      shuffle();
      for (const student of order) {
        if (booked >= Math.min(target, s.capacity + (allowWaitlist ? 2 : 0))) break;
        if ((weekly.get(student.id) ?? 0) >= WEEKLY_LIMIT || !payingMembership(d, student.id, s.start)) continue;
        if (booked >= s.capacity && !allowWaitlist) break;
        try {
          applyBook(d, s.id, student.id);
          weekly.set(student.id, (weekly.get(student.id) ?? 0) + 1);
          booked += 1;
        } catch {
          /* La regla del motor lo impidió: se omite. */
        }
      }
    }
  }

  /* Citas individuales: se agendan con el motor real (sin empalmes de especialista, espacio ni cliente). */
  if (caps.appointments && soloTypes.length) {
    const appointmentRooms = d.rooms.filter((r) => r.kind === "individual");
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const day = addDays(weekStart, dayOffset);
      const [open, close] = APPOINTMENT_HOURS[dayOffset];
      d.instructors.forEach((ins, k) => {
        if (!ins.days.includes(day.getDay())) return;
        let minute = open * 60 + (k % 2) * 30;
        while (minute + 45 <= Math.min(close, CLOSE_HOUR) * 60) {
          if (rand() < (caps.mode === "hibrido" ? 0.45 : 0.3)) { minute += 30; continue; }
          const type = soloTypes[Math.floor(rand() * soloTypes.length)];
          if (minute + type.minutes > close * 60) break;
          const start = atTime(day, `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
          d.now = addDays(start, -2).toISOString();
          shuffle();
          let placed = false;
          for (const student of order.slice(0, 12)) {
            if ((weekly.get(student.id) ?? 0) >= 2) continue;
            try {
              applyBookAppointment(d, { studentId: student.id, classTypeId: type.id, start: start.toISOString(), instructorId: ins.id });
              weekly.set(student.id, (weekly.get(student.id) ?? 0) + 1);
              placed = true;
              break;
            } catch {
              /* Empalme con otra cita de la persona o sin espacio libre: se intenta con otra. */
            }
          }
          minute += placed ? type.minutes + 15 : 30;
          if (!placed && !appointmentRooms.length) break;
        }
      });
    }
  }
  d.now = nowIso;

  /* Asistencia del pasado. La última clase que ya empezó hoy queda sin pasar lista. */
  const startedToday = d.sessions.filter((s) => s.kind === "grupal" && new Date(s.start) <= now && sameDay(s.start, now)).sort((a, b) => b.start.localeCompare(a.start));
  const unrecorded = new Set(startedToday.length ? d.sessions.filter((s) => s.kind === "grupal" && s.start === startedToday[0].start).map((s) => s.id) : []);
  // En citas, las dos últimas de hoy quedan por registrar llegada.
  const todayAppointments = d.sessions.filter((s) => s.kind === "cita" && new Date(s.start) <= now && sameDay(s.start, now)).sort((a, b) => b.start.localeCompare(a.start));
  todayAppointments.slice(0, 2).forEach((s) => unrecorded.add(s.id));
  let pendingCharges = 2;
  for (const b of [...d.bookings]) {
    const s = d.sessions.find((x) => x.id === b.sessionId) as Session;
    if (b.status !== "reservada" || new Date(s.start) > now || unrecorded.has(s.id)) continue;
    d.now = new Date(new Date(s.start).getTime() + s.minutes * 60_000).toISOString();
    applyAttendance(d, b.id, rand() < 0.9);
    // Las visitas pagadas por servicio quedan cobradas, salvo un par recientes por cobrar.
    const tx = d.transactions.find((x) => x.bookingId === b.id);
    if (tx) {
      const keepPending = sameDay(s.start, now) && pendingCharges > 0;
      if (keepPending) pendingCharges -= 1;
      Object.assign(tx, { status: keepPending ? "pendiente" : "pagado", at: s.start, method: (["Tarjeta", "Efectivo", "Transferencia"] as const)[tx.id.length % 3] });
    }
  }
  d.now = nowIso;
  d.transactions.sort((a, b) => b.at.localeCompare(a.at));

  /* Interesados y tareas. */
  const stages: Lead["stage"][] = ["nuevo", "nuevo", "nuevo", "contactado", "contactado", "prueba", "prueba", "cliente", "seguimiento"];
  const labels = stageLabelsFor(config);
  d.leads = leadNames.map((name, i) => {
    const createdAt = addDays(now, -(1 + ((i * 5) % 12))).toISOString();
    const source = (["Instagram", "WhatsApp", "Recomendación", "Sitio web"] as const)[i % 4];
    const interest = d.classTypes[i % d.classTypes.length].name;
    const history = [{ at: createdAt, text: `Llegó por ${source}. Le interesa ${interest}.` }];
    if (stages[i] !== "nuevo") history.push({ at: addDays(new Date(createdAt), 1).toISOString(), text: `Pasó a "${labels[stages[i]]}".` });
    return { id: nextId(d, "l"), name, interest, source, stage: stages[i], createdAt, history };
  });
  d.tasks = [
    { id: nextId(d, "k"), text: `Confirmar ${t.trialStage.toLowerCase()} de ${d.leads[5].name.split(" ")[0]}`, due: addDays(now, 1).toISOString(), done: false },
    { id: nextId(d, "k"), text: "Revisar los pagos pendientes de la semana", due: now.toISOString(), done: false },
    { id: nextId(d, "k"), text: caps.appointments ? `Reacomodar la agenda del sábado de ${d.instructors[0].name.split(" ")[0]}` : "Definir sustituto para el sábado", due: addDays(now, 2).toISOString(), done: false },
  ];
  const tomorrow = addDays(now, 1).toISOString();
  d.portalStudentId = (caps.groups ? d.students.find((s) => payingMembership(d, s.id, tomorrow)) : d.students.find((s) => payingMembership(d, s.id, tomorrow)) ?? d.students[11])?.id ?? d.students[0].id;

  /* Actividad reciente legible. */
  d.activity = [];
  const at = (hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString();
  const lastPaid = d.transactions.find((x) => x.status === "pagado" && x.kind !== "reembolso");
  const push = (hours: number, kind: DemoState["activity"][number]["kind"], text: string) => d.activity.push({ id: nextId(d, "a"), at: at(hours), kind, text });
  push(0.5, "reserva", caps.appointments && !caps.groups
    ? `${d.students[3].name} agendó ${d.classTypes[0].name}.`
    : `${d.students[3].name} reservó una clase de ${(groupTypes[0] ?? d.classTypes[0]).name}.`);
  push(2, "venta", `Nuevo interesado: ${d.leads[0].name} (${d.leads[0].source}).`);
  if (lastPaid) push(5, "pago", `Pago registrado: ${lastPaid.concept} de ${d.students.find((s) => s.id === lastPaid.studentId)?.name}.`);
  const firstAuto = d.automations.find((a) => a.enabled);
  if (firstAuto) push(20, "automatizacion", `Simulación: ${automationCopy(firstAuto.id, t).outcome} preparado (no se envía).`);
  if (d.memberships.some((m) => m.status === "pausada")) push(26, "membresia", `Paquete de ${d.students[5].name} pausado 14 días.`);
  return d;
}
