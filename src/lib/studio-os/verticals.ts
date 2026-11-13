import type { AutomationId, LeadStage, ModuleId, OfferingInput, OfferingKind, OperationMode, PlanRole, StudioConfig, VerticalId, ViewId } from "./types";

/**
 * Registro de giros de SUMA Wellness OS. Todo lo que cambia entre un estudio,
 * un spa o un wellness center se declara aquí: terminología, catálogos,
 * presets, módulos sugeridos, automatizaciones y datos ficticios.
 *
 * Las pantallas no preguntan "¿es spa?": consultan `terms`, `capabilities`
 * y los catálogos. Agregar un giro nuevo = agregar una entrada a `verticals`.
 */

export type Word = { one: string; many: string; /** Concordancia: "a" (alumna, cabina) u "o" (instructor, tratamiento). */ g: "a" | "o" };
export type Terms = {
  business: string;
  client: Word;
  staff: Word;
  space: Word;
  offering: Word;
  booking: Word;
  credit: Word;
  plans: string;
  agenda: string;
  trialStage: string;
};

export type PlanDef = { id: string; role: PlanRole; name: string; price: number; credits: number | null; validityDays: number; hint: string };
export type SizePreset = { id: string; title: string; text: string; instructors: number; rooms: number; capacity: number };

export type VerticalDef = {
  id: VerticalId;
  name: string;
  tagline: string;
  /** Modalidades que admite el giro; la efectiva sale de los servicios elegidos. */
  allows: OfferingKind[];
  terms: Terms;
  offerings: (OfferingInput & { suggested: boolean })[];
  plans: PlanDef[];
  suggestedPlans: string[];
  sizes: SizePreset[];
  suggestedModules: ModuleId[];
  automations: AutomationId[];
  staffNames: string[];
  spaceNames: { grupal: string[]; individual: string[] };
  /** Mensaje de bienvenida del dashboard según la hora no cambia; esto sí: */
  questions: { offerings: string; offeringsHelp: string; operation: string; operationHelp: string; plans: string; plansHelp: string };
};

const w = (one: string, many: string, g: "a" | "o"): Word => ({ one, many, g });

/* ───────────── Catálogo de planes (ids únicos entre giros) ───────────── */

const classPlans: PlanDef[] = [
  { id: "individual", role: "suelta", name: "Clase individual", price: 250, credits: 1, validityDays: 30, hint: "Una clase suelta." },
  { id: "prueba", role: "prueba", name: "Clase de prueba", price: 150, credits: 1, validityDays: 15, hint: "Primera visita a precio especial." },
  { id: "pack5", role: "paquete", name: "Paquete 5 clases", price: 1100, credits: 5, validityDays: 45, hint: "Cinco clases en 45 días." },
  { id: "pack10", role: "paquete", name: "Paquete 10 clases", price: 2000, credits: 10, validityDays: 60, hint: "Diez clases en 60 días." },
  { id: "pack20", role: "paquete", name: "Paquete 20 clases", price: 3600, credits: 20, validityDays: 90, hint: "Veinte clases en 90 días." },
  { id: "mensual", role: "membresia", name: "Membresía mensual", price: 2200, credits: 12, validityDays: 30, hint: "Hasta 12 clases al mes." },
  { id: "ilimitado", role: "membresia", name: "Plan ilimitado", price: 2900, credits: null, validityDays: 30, hint: "Clases sin límite durante 30 días." },
];
const spaPlans: PlanDef[] = [
  { id: "spa_primera", role: "prueba", name: "Primera visita", price: 900, credits: 1, validityDays: 30, hint: "Un tratamiento de bienvenida." },
  { id: "spa_pack3", role: "paquete", name: "Paquete 3 sesiones", price: 3000, credits: 3, validityDays: 90, hint: "Tres sesiones de cualquier tratamiento." },
  { id: "spa_pack6", role: "paquete", name: "Paquete 6 sesiones", price: 5600, credits: 6, validityDays: 180, hint: "Seis sesiones para usar en seis meses." },
  { id: "spa_mensual", role: "membresia", name: "Membresía spa mensual", price: 1900, credits: 2, validityDays: 30, hint: "Dos tratamientos al mes." },
];
const wellnessPlans: PlanDef[] = [
  { id: "well_bienvenida", role: "prueba", name: "Sesión de bienvenida", price: 600, credits: 1, validityDays: 30, hint: "Para conocer el centro." },
  { id: "well_pack5", role: "paquete", name: "Paquete 5 sesiones", price: 4000, credits: 5, validityDays: 90, hint: "Cinco sesiones o actividades." },
  { id: "well_programa", role: "paquete", name: "Programa de 8 sesiones", price: 6200, credits: 8, validityDays: 60, hint: "Un programa guiado de ocho semanas." },
  { id: "well_mensual", role: "membresia", name: "Membresía bienestar", price: 2600, credits: 10, validityDays: 30, hint: "Hasta 10 sesiones o actividades al mes." },
];
const otherPlans: PlanDef[] = [
  { id: "otro_primera", role: "prueba", name: "Primera sesión", price: 500, credits: 1, validityDays: 30, hint: "Para empezar." },
  { id: "otro_pack4", role: "paquete", name: "Paquete 4 sesiones", price: 2800, credits: 4, validityDays: 60, hint: "Cuatro sesiones en dos meses." },
  { id: "otro_pack8", role: "paquete", name: "Paquete 8 sesiones", price: 5200, credits: 8, validityDays: 90, hint: "Ocho sesiones en tres meses." },
  { id: "otro_mensual", role: "membresia", name: "Membresía mensual", price: 2400, credits: 6, validityDays: 30, hint: "Hasta seis sesiones al mes." },
];

export const planCatalog: Record<string, PlanDef> = Object.fromEntries([...classPlans, ...spaPlans, ...wellnessPlans, ...otherPlans].map((p) => [p.id, p]));

const studioTerms = (business: string): Terms => ({
  business,
  client: w("alumna", "alumnas", "a"),
  staff: w("instructor", "instructores", "o"),
  space: w("sala", "salas", "a"),
  offering: w("clase", "clases", "a"),
  booking: w("reserva", "reservas", "a"),
  credit: w("crédito", "créditos", "o"),
  plans: "Membresías",
  agenda: "Agenda",
  trialStage: "Clase de prueba",
});

const classAutomations: AutomationId[] = ["vencimiento", "bienvenida", "lugar_liberado", "inactiva", "clase_cancelada", "sin_reserva"];

export const verticals: Record<VerticalId, VerticalDef> = {
  pilates: {
    id: "pilates",
    name: "Pilates / Reformer",
    tagline: "Clases en grupos pequeños con cupos exactos.",
    allows: ["grupal"],
    terms: studioTerms("estudio"),
    offerings: [
      { name: "Reformer básico", minutes: 50, kind: "grupal", price: 0, suggested: true },
      { name: "Reformer intermedio", minutes: 50, kind: "grupal", price: 0, suggested: true },
      { name: "Reformer power", minutes: 45, kind: "grupal", price: 0, suggested: true },
      { name: "Mat Pilates", minutes: 50, kind: "grupal", price: 0, suggested: true },
      { name: "Reformer + barre", minutes: 50, kind: "grupal", price: 0, suggested: false },
      { name: "Stretching", minutes: 45, kind: "grupal", price: 0, suggested: false },
    ],
    plans: classPlans,
    suggestedPlans: ["individual", "prueba", "pack5", "pack10", "pack20"],
    sizes: [
      { id: "boutique", title: "Boutique", text: "Una sala, atención muy cercana", instructors: 2, rooms: 1, capacity: 6 },
      { id: "estudio", title: "Estudio", text: "Lo más común en Reformer", instructors: 4, rooms: 2, capacity: 8 },
      { id: "centro", title: "Centro", text: "Varias salas y horarios llenos", instructors: 6, rooms: 3, capacity: 12 },
    ],
    suggestedModules: ["alumnas", "clases", "membresias", "pagos", "equipo", "marketing"],
    automations: classAutomations,
    staffNames: ["Mariel Treviño", "Sofía Lozano", "Diego Cantú", "Regina Salinas", "Paola Villarreal", "Andrés Garza", "Lorena Peña", "Iván Leal"],
    spaceNames: { grupal: ["Sala Reformer", "Sala Mat", "Sala 3", "Sala 4"], individual: [] },
    questions: {
      offerings: "¿Qué clases impartes?", offeringsHelp: "Preseleccionamos las más comunes en un estudio de Reformer. Toca para quitar o añadir.",
      operation: "¿Cómo es tu estudio?", operationHelp: "Elige el tamaño que más se parezca. Puedes afinar instructores, salas y cupo.",
      plans: "¿Cómo pagan tus alumnas?", plansHelp: "Clases sueltas, paquetes y membresías. Los precios son de ejemplo y se editan después.",
    },
  },
  yoga: {
    id: "yoga",
    name: "Yoga / Barre",
    tagline: "Grupos amplios en mat, barre y meditación.",
    allows: ["grupal"],
    terms: studioTerms("estudio"),
    offerings: [
      { name: "Vinyasa", minutes: 60, kind: "grupal", price: 0, suggested: true },
      { name: "Hatha", minutes: 60, kind: "grupal", price: 0, suggested: true },
      { name: "Yin", minutes: 75, kind: "grupal", price: 0, suggested: true },
      { name: "Barre", minutes: 50, kind: "grupal", price: 0, suggested: true },
      { name: "Yoga prenatal", minutes: 60, kind: "grupal", price: 0, suggested: false },
      { name: "Meditación guiada", minutes: 30, kind: "grupal", price: 0, suggested: false },
    ],
    plans: classPlans,
    suggestedPlans: ["individual", "prueba", "pack10", "mensual", "ilimitado"],
    sizes: [
      { id: "boutique", title: "Boutique", text: "Una sala y grupos medianos", instructors: 2, rooms: 1, capacity: 12 },
      { id: "estudio", title: "Estudio", text: "Lo más común en yoga", instructors: 3, rooms: 1, capacity: 18 },
      { id: "centro", title: "Centro", text: "Dos salas y más horarios", instructors: 5, rooms: 2, capacity: 25 },
    ],
    suggestedModules: ["alumnas", "clases", "membresias", "pagos", "equipo", "marketing"],
    automations: classAutomations,
    staffNames: ["Valeria Ochoa", "Natalia Rangel", "Emilio Fuentes", "Jimena Salazar", "Andrea Leal", "Tomás Mier", "Inés Barrera", "Carla Ríos"],
    spaceNames: { grupal: ["Sala principal", "Sala 2", "Sala 3", "Sala 4"], individual: [] },
    questions: {
      offerings: "¿Qué clases impartes?", offeringsHelp: "Preseleccionamos las más comunes en un estudio de yoga y barre. Toca para quitar o añadir.",
      operation: "¿Cómo es tu estudio?", operationHelp: "Elige el tamaño que más se parezca. Puedes afinar instructores, salas y cupo.",
      plans: "¿Cómo pagan tus alumnas?", plansHelp: "Clases sueltas, paquetes y membresías. Los precios son de ejemplo y se editan después.",
    },
  },
  spa: {
    id: "spa",
    name: "Spa",
    tagline: "Tratamientos y citas individuales por cabina.",
    allows: ["individual"],
    terms: {
      business: "spa",
      client: w("cliente", "clientes", "o"),
      staff: w("terapeuta", "terapeutas", "a"),
      space: w("cabina", "cabinas", "a"),
      offering: w("tratamiento", "tratamientos", "o"),
      booking: w("cita", "citas", "a"),
      credit: w("sesión", "sesiones", "a"),
      plans: "Paquetes",
      agenda: "Citas",
      trialStage: "Primera visita",
    },
    offerings: [
      { name: "Masaje relajante", minutes: 60, kind: "individual", price: 1100, suggested: true },
      { name: "Masaje profundo", minutes: 90, kind: "individual", price: 1500, suggested: true },
      { name: "Facial hidratante", minutes: 60, kind: "individual", price: 1200, suggested: true },
      { name: "Ritual de bienestar", minutes: 90, kind: "individual", price: 1800, suggested: true },
      { name: "Exfoliación corporal", minutes: 45, kind: "individual", price: 850, suggested: false },
      { name: "Piedras calientes", minutes: 75, kind: "individual", price: 1400, suggested: false },
    ],
    plans: spaPlans,
    suggestedPlans: ["spa_primera", "spa_pack3", "spa_pack6", "spa_mensual"],
    sizes: [
      { id: "boutique", title: "Boutique", text: "Dos cabinas, trato muy personal", instructors: 2, rooms: 2, capacity: 1 },
      { id: "estudio", title: "Spa", text: "Lo más común en un day spa", instructors: 4, rooms: 3, capacity: 1 },
      { id: "centro", title: "Gran spa", text: "Muchas cabinas y agenda llena", instructors: 6, rooms: 4, capacity: 1 },
    ],
    suggestedModules: ["alumnas", "clases", "membresias", "pagos", "equipo", "marketing"],
    automations: ["confirmacion", "recordatorio", "seguimiento_visita", "reactivacion", "renovacion_paquete", "sin_reserva"],
    staffNames: ["Lucía Arredondo", "Mónica Esquivel", "Daniela Quiroga", "Ana Sofía Medina", "Rebeca Gámez", "Julia Navarro", "Pilar Tamez", "Marta Cavazos"],
    spaceNames: { grupal: [], individual: ["Cabina Jade", "Cabina Arena", "Cabina Bruma", "Cabina Sal"] },
    questions: {
      offerings: "¿Qué tratamientos ofreces?", offeringsHelp: "Preseleccionamos los más pedidos en un spa. Cada uno tiene su duración y precio de ejemplo.",
      operation: "¿Cómo es tu spa?", operationHelp: "Elige el tamaño que más se parezca. Puedes afinar terapeutas y cabinas.",
      plans: "¿Cómo pagan tus clientes?", plansHelp: "Pago por tratamiento siempre incluido. Suma paquetes de sesiones y membresías si los ofreces.",
    },
  },
  wellness: {
    id: "wellness",
    name: "Wellness Center",
    tagline: "Sesiones individuales, actividades grupales y programas.",
    allows: ["individual", "grupal"],
    terms: {
      business: "centro",
      client: w("cliente", "clientes", "o"),
      staff: w("especialista", "especialistas", "a"),
      space: w("espacio", "espacios", "o"),
      offering: w("experiencia", "experiencias", "a"),
      booking: w("sesión", "sesiones", "a"),
      credit: w("sesión", "sesiones", "a"),
      plans: "Programas y paquetes",
      agenda: "Agenda",
      trialStage: "Sesión de bienvenida",
    },
    offerings: [
      { name: "Sesión de recuperación", minutes: 60, kind: "individual", price: 950, suggested: true },
      { name: "Acompañamiento de bienestar", minutes: 50, kind: "individual", price: 900, suggested: true },
      { name: "Masaje de recuperación", minutes: 60, kind: "individual", price: 1100, suggested: false },
      { name: "Meditación grupal", minutes: 45, kind: "grupal", price: 0, suggested: true },
      { name: "Respiración y movimiento", minutes: 60, kind: "grupal", price: 0, suggested: true },
      { name: "Baño de sonido", minutes: 60, kind: "grupal", price: 0, suggested: false },
    ],
    plans: wellnessPlans,
    suggestedPlans: ["well_bienvenida", "well_pack5", "well_programa", "well_mensual"],
    sizes: [
      { id: "boutique", title: "Íntimo", text: "Un salón y un espacio privado", instructors: 3, rooms: 2, capacity: 10 },
      { id: "estudio", title: "Centro", text: "Lo más común en wellness", instructors: 5, rooms: 3, capacity: 14 },
      { id: "centro", title: "Gran centro", text: "Varios espacios privados", instructors: 7, rooms: 4, capacity: 20 },
    ],
    suggestedModules: ["alumnas", "clases", "membresias", "pagos", "equipo", "marketing"],
    automations: ["bienvenida", "confirmacion", "recordatorio", "seguimiento_visita", "renovacion_paquete", "reactivacion", "sin_reserva"],
    staffNames: ["Camila Peña", "Bruno Salinas", "Elena Garza", "Mateo Cantú", "Victoria Lozano", "Renata Ibarra", "Samuel Rangel", "Clara Fuentes"],
    spaceNames: { grupal: ["Salón de movimiento"], individual: ["Estudio privado 1", "Estudio privado 2", "Estudio privado 3"] },
    questions: {
      offerings: "¿Qué experiencias ofreces?", offeringsHelp: "Combina sesiones individuales y actividades grupales. Preseleccionamos una base equilibrada.",
      operation: "¿Cómo es tu centro?", operationHelp: "Elige el tamaño que más se parezca. Puedes afinar especialistas, espacios y cupo de grupos.",
      plans: "¿Cómo vendes tus experiencias?", plansHelp: "Sesiones sueltas siempre incluidas. Suma programas, paquetes y membresías.",
    },
  },
  otro: {
    id: "otro",
    name: "Otro negocio wellness",
    tagline: "Una base flexible: servicios, agenda, equipo y pagos.",
    allows: ["individual", "grupal"],
    terms: {
      business: "negocio",
      client: w("cliente", "clientes", "o"),
      staff: w("profesional", "profesionales", "o"),
      space: w("espacio", "espacios", "o"),
      offering: w("servicio", "servicios", "o"),
      booking: w("cita", "citas", "a"),
      credit: w("sesión", "sesiones", "a"),
      plans: "Paquetes",
      agenda: "Agenda",
      trialStage: "Primera sesión",
    },
    offerings: [
      { name: "Sesión individual", minutes: 60, kind: "individual", price: 800, suggested: true },
      { name: "Primera sesión", minutes: 45, kind: "individual", price: 600, suggested: true },
      { name: "Sesión de seguimiento", minutes: 45, kind: "individual", price: 700, suggested: true },
      { name: "Taller grupal", minutes: 90, kind: "grupal", price: 0, suggested: false },
    ],
    plans: otherPlans,
    suggestedPlans: ["otro_primera", "otro_pack4", "otro_mensual"],
    sizes: [
      { id: "boutique", title: "Independiente", text: "Una o dos personas", instructors: 1, rooms: 1, capacity: 8 },
      { id: "estudio", title: "Equipo pequeño", text: "Lo más común", instructors: 3, rooms: 2, capacity: 10 },
      { id: "centro", title: "Equipo grande", text: "Varios espacios y agendas", instructors: 5, rooms: 3, capacity: 15 },
    ],
    suggestedModules: ["alumnas", "clases", "membresias", "pagos", "equipo"],
    automations: ["confirmacion", "recordatorio", "seguimiento_visita", "reactivacion", "sin_reserva"],
    staffNames: ["Alejandra Mier", "Rodrigo Leal", "Fernanda Ochoa", "Pablo Treviño", "Gabriela Cantú", "Luis Esquivel", "Sara Benavides", "Óscar Zambrano"],
    spaceNames: { grupal: ["Salón"], individual: ["Espacio 1", "Espacio 2", "Espacio 3", "Espacio 4"] },
    questions: {
      offerings: "¿Qué servicios ofreces?", offeringsHelp: "Empezamos con una base neutral. Renombra o añade los tuyos: así de simple.",
      operation: "¿Cómo es tu equipo?", operationHelp: "Elige el tamaño que más se parezca. Puedes afinar profesionales y espacios.",
      plans: "¿Cómo te pagan tus clientes?", plansHelp: "Pago por sesión siempre incluido. Suma paquetes o membresías si los ofreces.",
    },
  },
};
export const verticalIds = Object.keys(verticals) as VerticalId[];
export const verticalOf = (c: Pick<StudioConfig, "vertical">) => verticals[c.vertical] ?? verticals.pilates;
export const termsOf = (c: Pick<StudioConfig, "vertical">) => verticalOf(c).terms;

/** Modalidad efectiva: depende de los servicios elegidos dentro de lo que admite el giro. */
export function modeOf(c: Pick<StudioConfig, "vertical" | "offerings">): OperationMode {
  const kinds = new Set(c.offerings.map((o) => o.kind).filter((k) => verticalOf(c).allows.includes(k)));
  if (kinds.has("grupal") && kinds.has("individual")) return "hibrido";
  if (kinds.has("individual")) return "citas";
  if (kinds.has("grupal")) return "grupal";
  return verticalOf(c).allows.includes("grupal") ? "grupal" : "citas";
}

/** Qué partes del sistema existen. Las vistas consultan esto, no el giro. */
export function capabilitiesOf(c: Pick<StudioConfig, "vertical" | "offerings">) {
  const mode = modeOf(c);
  return {
    mode,
    groups: mode !== "citas",
    appointments: mode !== "grupal",
    waitlist: mode !== "citas",
    serviceCatalog: mode !== "grupal",
  };
}

/* ───────────── Texto con concordancia ───────────── */

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const plural = (n: number, word: Word) => `${n} ${n === 1 ? word.one : word.many}`;
/** "inscrita" / "inscrito" según el sustantivo. */
export const agree = (word: Word, stem: string) => `${stem}${word.g}`;

/* ───────────── Módulos, vistas y etapas por giro ───────────── */

export function moduleCopy(m: ModuleId, c: Pick<StudioConfig, "vertical" | "offerings">): { name: string; purpose: string } {
  const t = termsOf(c);
  const caps = capabilitiesOf(c);
  const copy: Record<ModuleId, { name: string; purpose: string }> = {
    alumnas: { name: `${cap(t.client.many)} y seguimiento`, purpose: `Cada ${t.client.one} en una ficha: historial, ${t.plans.toLowerCase()}, notas y pendientes.` },
    clases: caps.appointments && !caps.groups
      ? { name: `${cap(t.booking.many)} y agenda`, purpose: `Agenda por ${t.staff.one} y ${t.space.one}, sin empalmes, con confirmaciones simuladas.` }
      : caps.appointments
        ? { name: "Agenda y reservas", purpose: "Sesiones individuales sin empalmes y actividades grupales con cupo." }
        : { name: "Clases y reservas", purpose: "Horarios con cupos, lista de espera y asistencia." },
    membresias: { name: t.plans, purpose: caps.groups && !caps.appointments ? "Paquetes, créditos, vencimientos, pausas y renovaciones." : `${cap(t.credit.many)} prepagadas, vencimientos y renovaciones.` },
    pagos: { name: "Cobros y pagos", purpose: `Qué se cobró, qué está pendiente y cuánto vendes por periodo.` },
    equipo: { name: `${cap(t.staff.many)} y ${t.space.many}`, purpose: caps.appointments ? `Disponibilidad, ${t.booking.many} asignadas y comisiones estimadas.` : "Disponibilidad, clases asignadas, sustituciones y honorarios." },
    marketing: { name: "Ventas y automatizaciones", purpose: "Interesados por etapa y reglas que preparan seguimientos por ti." },
  };
  return copy[m];
}

export function viewLabel(v: ViewId, c: Pick<StudioConfig, "vertical" | "offerings">): string {
  const t = termsOf(c);
  const labels: Partial<Record<ViewId, string>> = {
    alumnas: cap(t.client.many),
    agenda: t.agenda,
    servicios: cap(t.offering.many),
    membresias: t.plans,
    profesores: cap(t.staff.many),
    portal: `Portal de ${t.client.many}`,
  };
  return labels[v] ?? "";
}

export function stageLabelsFor(c: Pick<StudioConfig, "vertical">): Record<LeadStage, string> {
  return { nuevo: "Nuevo interesado", contactado: "Contactado", prueba: termsOf(c).trialStage, cliente: "Cliente", seguimiento: "Seguimiento" };
}

export const toInput = (o: OfferingInput): OfferingInput => ({ name: o.name, minutes: o.minutes, kind: o.kind, price: o.price });

/** Aplica las sugerencias de un giro sin tocar nombre, colores ni logotipo. */
export function withVertical(config: StudioConfig, vertical: VerticalId): StudioConfig {
  const v = verticals[vertical];
  const size = v.sizes[1];
  return {
    ...config,
    vertical,
    offerings: v.offerings.filter((o) => o.suggested).map(toInput),
    instructors: size.instructors,
    rooms: size.rooms,
    capacity: size.capacity,
    plans: [...v.suggestedPlans],
    modules: [...v.suggestedModules],
  };
}
