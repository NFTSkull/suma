import type { AutomationId, LeadStage, ModuleId, PlanKind, RoleId, StudioConfig, StudioType, ThemeId, ViewId } from "./types";

/**
 * Tokens de color por tema. `accent` lleva texto blanco encima y `ink` se usa
 * como texto sobre `soft`; ambos cumplen contraste AA (ver catalog.test.ts).
 */
export const themes: Record<ThemeId, { name: string; accent: string; hover: string; soft: string; ink: string; canvas: string }> = {
  arcilla: { name: "Arcilla", accent: "#A4502F", hover: "#8A4227", soft: "#F6E6DD", ink: "#7A3A22", canvas: "#FBF8F5" },
  salvia: { name: "Salvia", accent: "#4F6E55", hover: "#425D48", soft: "#E3ECE2", ink: "#3B5440", canvas: "#F7F9F6" },
  lavanda: { name: "Lavanda", accent: "#6A5A9C", hover: "#594B85", soft: "#ECE8F6", ink: "#4F427A", canvas: "#F9F8FC" },
  oceano: { name: "Océano", accent: "#2E6A80", hover: "#25596C", soft: "#DFEDF2", ink: "#235466", canvas: "#F6FAFB" },
  rosa: { name: "Rosa", accent: "#A44A66", hover: "#8B3E56", soft: "#F5E3E9", ink: "#7E3850", canvas: "#FCF8F9" },
  grafito: { name: "Grafito", accent: "#34343A", hover: "#232327", soft: "#E9E9EC", ink: "#2A2A2F", canvas: "#F8F8F7" },
};
export const themeIds = Object.keys(themes) as ThemeId[];

export const studioTypes: Record<StudioType, {
  name: string;
  classes: { name: string; minutes: number }[];
  instructors: number;
  rooms: number;
  capacity: number;
  plans: PlanKind[];
}> = {
  yoga: {
    name: "Yoga",
    classes: [{ name: "Vinyasa", minutes: 60 }, { name: "Hatha", minutes: 60 }, { name: "Yin", minutes: 75 }, { name: "Yoga prenatal", minutes: 60 }],
    instructors: 3, rooms: 1, capacity: 18,
    plans: ["individual", "prueba", "pack10", "mensual", "ilimitado"],
  },
  pilates: {
    name: "Pilates",
    classes: [{ name: "Mat Pilates", minutes: 50 }, { name: "Pilates principiantes", minutes: 50 }, { name: "Pilates intermedio", minutes: 50 }, { name: "Stretching", minutes: 45 }],
    instructors: 3, rooms: 1, capacity: 12,
    plans: ["individual", "prueba", "pack5", "pack10", "mensual"],
  },
  reformer: {
    name: "Reformer",
    classes: [{ name: "Reformer básico", minutes: 50 }, { name: "Reformer intermedio", minutes: 50 }, { name: "Reformer power", minutes: 45 }, { name: "Reformer + barre", minutes: 50 }],
    instructors: 4, rooms: 2, capacity: 8,
    plans: ["individual", "prueba", "pack5", "pack10", "pack20"],
  },
  mixto: {
    name: "Mixto",
    classes: [{ name: "Reformer básico", minutes: 50 }, { name: "Mat Pilates", minutes: 50 }, { name: "Vinyasa", minutes: 60 }, { name: "Yin", minutes: 75 }],
    instructors: 4, rooms: 2, capacity: 10,
    plans: ["individual", "prueba", "pack5", "pack10", "pack20", "mensual", "ilimitado"],
  },
};

/** Precios de ejemplo del estudio para sus alumnas (editables). No son precios de SUMA. */
export const planCatalog: Record<PlanKind, { name: string; price: number; credits: number | null; validityDays: number; hint: string }> = {
  individual: { name: "Clase individual", price: 250, credits: 1, validityDays: 30, hint: "Una clase suelta." },
  prueba: { name: "Clase de prueba", price: 150, credits: 1, validityDays: 15, hint: "Primera visita a precio especial." },
  pack5: { name: "Paquete 5 clases", price: 1100, credits: 5, validityDays: 45, hint: "Cinco clases en 45 días." },
  pack10: { name: "Paquete 10 clases", price: 2000, credits: 10, validityDays: 60, hint: "Diez clases en 60 días." },
  pack20: { name: "Paquete 20 clases", price: 3600, credits: 20, validityDays: 90, hint: "Veinte clases en 90 días." },
  mensual: { name: "Membresía mensual", price: 2200, credits: 12, validityDays: 30, hint: "Hasta 12 clases al mes." },
  ilimitado: { name: "Plan ilimitado", price: 2900, credits: null, validityDays: 30, hint: "Clases sin límite durante 30 días." },
};
export const planKinds = Object.keys(planCatalog) as PlanKind[];

export const modules: Record<ModuleId, { name: string; purpose: string; example: string; views: ViewId[] }> = {
  alumnas: {
    name: "Alumnas y seguimiento",
    purpose: "Ten a cada alumna en una ficha: paquete, asistencia, notas y pendientes.",
    example: "Ves que Daniela no viene desde hace dos semanas y le dejas un recordatorio para escribirle.",
    views: ["alumnas"],
  },
  clases: {
    name: "Clases y reservas",
    purpose: "Agenda por día y semana con cupos, lista de espera y asistencia.",
    example: "Una alumna cancela a tiempo: recupera su crédito y la primera de la lista de espera toma el lugar.",
    views: ["agenda", "portal"],
  },
  membresias: {
    name: "Membresías y paquetes",
    purpose: "Paquetes, créditos, vencimientos, pausas y renovaciones.",
    example: "Pausas la membresía de una alumna que viaja y su vencimiento se recorre al volver.",
    views: ["membresias"],
  },
  pagos: {
    name: "Cobros y pagos",
    purpose: "Qué se cobró, qué está pendiente y cuánto vendes por periodo.",
    example: "Ves de un vistazo los tres pagos pendientes de esta semana y los marcas al cobrarlos.",
    views: ["pagos"],
  },
  equipo: {
    name: "Profesores y equipo",
    purpose: "Disponibilidad, clases asignadas, sustituciones y honorarios estimados.",
    example: "Una instructora se enferma: eliges quién la sustituye y la agenda se actualiza.",
    views: ["profesores"],
  },
  marketing: {
    name: "Marketing y automatizaciones",
    purpose: "Interesados por etapa y reglas que te avisan qué hacer.",
    example: "Alguien preguntó por Instagram y no reservó: el sistema te deja una tarea para darle seguimiento.",
    views: ["ventas", "automatizaciones"],
  },
};
export const moduleIds = Object.keys(modules) as ModuleId[];

export const roles: Record<RoleId, { name: string; description: string; views: ViewId[] }> = {
  duena: {
    name: "Dueña",
    description: "Ve y administra todo, incluidos pagos, reportes y configuración.",
    views: ["inicio", "alumnas", "agenda", "membresias", "ventas", "pagos", "profesores", "reportes", "automatizaciones", "portal", "personalizar", "resumen"],
  },
  recepcion: {
    name: "Recepción",
    description: "Reservas, alumnas, membresías, ventas y cobros. Sin reportes, honorarios ni configuración.",
    views: ["inicio", "alumnas", "agenda", "membresias", "ventas", "pagos", "portal"],
  },
  instructor: {
    name: "Instructor",
    description: "Solo sus clases: agenda propia, lista de alumnas y asistencia. Sin datos de pagos ni notas internas.",
    views: ["inicio", "agenda", "alumnas"],
  },
};

export const automationCatalog: Record<AutomationId, { name: string; when: string; then: string; outcome: string }> = {
  vencimiento: { name: "Recordatorio de renovación", when: "Una membresía está por vencer", then: "Preparar un recordatorio de renovación", outcome: "recordatorio de renovación" },
  bienvenida: { name: "Bienvenida a alumnas nuevas", when: "Se registra una alumna nueva", then: "Preparar un mensaje de bienvenida", outcome: "mensaje de bienvenida" },
  sin_reserva: { name: "Seguimiento de interesados", when: "Alguien preguntó y no ha reservado", then: "Crear una tarea de seguimiento", outcome: "tarea de seguimiento" },
  inactiva: { name: "Recuperar alumnas inactivas", when: "Una alumna activa no viene en 14 días", then: "Preparar un mensaje para invitarla de vuelta", outcome: "mensaje de regreso" },
  clase_cancelada: { name: "Aviso de clase cancelada", when: "Se cancela una clase", then: "Avisar a las alumnas inscritas", outcome: "aviso de cancelación" },
};
export const automationIds = Object.keys(automationCatalog) as AutomationId[];

export const stageOrder: LeadStage[] = ["nuevo", "contactado", "prueba", "cliente", "seguimiento"];
export const defaultStageLabels: Record<LeadStage, string> = {
  nuevo: "Nuevo interesado",
  contactado: "Contactado",
  prueba: "Clase de prueba",
  cliente: "Cliente",
  seguimiento: "Seguimiento",
};

export const integrationOptions = [
  "Cobros en línea",
  "WhatsApp Business",
  "Calendario de Google",
  "Facturación",
  "Mi reservador actual",
  "Instagram",
] as const;

/** Nombres ficticios. No corresponden a personas reales. */
export const firstNames = [
  "Ana Lucía", "Daniela", "Mariana", "Sofía", "Valeria", "Regina", "Fernanda", "Camila", "Paulina", "Ximena",
  "Andrea", "Lucía", "Renata", "Isabela", "Natalia", "Carolina", "Jimena", "Paola", "Alejandra", "Montserrat",
  "Victoria", "Gabriela", "Elena", "Bárbara", "Itzel", "Constanza", "Emilia", "Julieta", "Marisol", "Inés",
];
export const lastNames = [
  "Garza", "Treviño", "Cantú", "Elizondo", "Salinas", "Villarreal", "Montemayor", "Zambrano", "Leal", "Benavides",
  "Sada", "Martínez", "Tamez", "Guajardo", "Rangel", "Lozano", "Cavazos", "Ochoa", "Ríos", "Peña",
  "Fuentes", "Quiroga", "Navarro", "Mier", "Gámez", "Barrera", "Arredondo", "Esquivel", "Medina", "Salazar",
];
export const fictionalName = (i: number) =>
  `${firstNames[i % firstNames.length]} ${lastNames[(i + Math.floor(i / firstNames.length) * 3) % lastNames.length]}`;
export const leadNames = [
  "Laura Herrera", "Claudia Vela", "Mónica Robles", "Patricia Sáenz", "Diana Montalvo",
  "Karla Elías", "Teresa Ibarra", "Rocío Domene", "Silvia Margáin",
];
export const instructorNames = [
  "Mariel Treviño", "Sofía Lozano", "Diego Cantú", "Regina Salinas", "Paola Villarreal", "Andrés Garza", "Lorena Peña", "Iván Leal",
];

export function defaultConfig(type: StudioType = "pilates"): StudioConfig {
  const t = studioTypes[type];
  return {
    name: "",
    type,
    theme: "arcilla",
    classes: t.classes.map((c) => ({ ...c })),
    instructors: t.instructors,
    rooms: t.rooms,
    capacity: t.capacity,
    plans: [...t.plans],
    modules: [...moduleIds],
    integrations: [],
    needs: "",
  };
}

/** Aplica las sugerencias de un tipo de estudio sin tocar nombre, colores ni módulos. */
export function withTypeSuggestions(config: StudioConfig, type: StudioType): StudioConfig {
  const t = studioTypes[type];
  return {
    ...config,
    type,
    classes: t.classes.map((c) => ({ ...c })),
    instructors: t.instructors,
    rooms: t.rooms,
    capacity: t.capacity,
    plans: [...t.plans],
  };
}

export const studioDisplayName = (config: StudioConfig) => config.name.trim() || "Tu estudio";
