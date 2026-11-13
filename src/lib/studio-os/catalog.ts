import type { AutomationId, LeadStage, ModuleId, RoleId, StudioConfig, ThemeId, VerticalId, ViewId } from "./types";
import { cap, termsOf, verticals, withVertical, type Terms } from "./verticals";

export { planCatalog } from "./verticals";

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

/** Módulo → vistas que habilita. Nombres y descripciones por giro: `moduleCopy`. */
export const modules: Record<ModuleId, { views: ViewId[] }> = {
  alumnas: { views: ["alumnas"] },
  clases: { views: ["agenda", "servicios", "portal"] },
  membresias: { views: ["membresias"] },
  pagos: { views: ["pagos"] },
  equipo: { views: ["profesores"] },
  marketing: { views: ["ventas", "automatizaciones"] },
};
export const moduleIds = Object.keys(modules) as ModuleId[];

export const roles: Record<RoleId, { views: ViewId[] }> = {
  duena: { views: ["inicio", "alumnas", "agenda", "servicios", "membresias", "ventas", "pagos", "profesores", "reportes", "automatizaciones", "portal", "personalizar", "resumen"] },
  recepcion: { views: ["inicio", "alumnas", "agenda", "servicios", "membresias", "ventas", "pagos", "portal"] },
  instructor: { views: ["inicio", "agenda", "alumnas"] },
};
export function roleCopy(r: RoleId, c: Pick<StudioConfig, "vertical">): { name: string; description: string } {
  const t = termsOf(c);
  return {
    duena: { name: "Dirección", description: "Ve y administra todo, incluidos pagos, reportes y configuración." },
    recepcion: { name: "Recepción", description: `${cap(t.booking.many)}, ${t.client.many}, ${t.plans.toLowerCase()}, ventas y cobros. Sin reportes, honorarios ni configuración.` },
    instructor: { name: cap(t.staff.one), description: `Solo su agenda, sus ${t.client.many} y la asistencia. Sin pagos ni notas internas.` },
  }[r];
}

/**
 * Automatizaciones: CUANDO sucede algo → EL SISTEMA prepara una acción.
 * Se redactan con la terminología del giro. Ninguna envía mensajes.
 */
export function automationCopy(id: AutomationId, t: Terms): { name: string; when: string; then: string; outcome: string } {
  const c1 = t.client.one;
  const copy: Record<AutomationId, { name: string; when: string; then: string; outcome: string }> = {
    vencimiento: { name: "Membresía por vencer", when: "Una membresía está por vencer o le queda un crédito", then: "Preparar un recordatorio de renovación", outcome: "recordatorio de renovación" },
    bienvenida: { name: "Nueva inscripción", when: `Se registra ${t.client.g === "a" ? "una" : "un"} ${c1} nuev${t.client.g}`, then: "Preparar un mensaje de bienvenida", outcome: "mensaje de bienvenida" },
    lugar_liberado: { name: "Lugar liberado", when: "Se libera un lugar en una clase llena", then: "Avisar a quien sigue en la lista de espera", outcome: "aviso de lugar liberado" },
    inactiva: { name: `${cap(c1)} inactiva`, when: `Una ${c1} con paquete no viene en 14 días`, then: "Preparar un mensaje para invitarla de vuelta", outcome: "mensaje de regreso" },
    clase_cancelada: { name: "Clase cancelada", when: "Se cancela una clase", then: `Avisar a las ${t.client.many} inscritas`, outcome: "aviso de cancelación" },
    sin_reserva: { name: "Seguimiento de interesados", when: `Alguien preguntó y no ha agendado`, then: "Crear una tarea de seguimiento", outcome: "tarea de seguimiento" },
    confirmacion: { name: `Confirmación de ${t.booking.one}`, when: `${t.client.g === "a" ? "Una" : "Un"} ${c1} agenda ${t.booking.g === "a" ? "una" : "un"} ${t.booking.one}`, then: "Preparar la confirmación con fecha, hora y lugar", outcome: "confirmación" },
    recordatorio: { name: "Recordatorio un día antes", when: `Se acerca ${t.booking.g === "a" ? "la" : "el"} ${t.booking.one} (mañana)`, then: "Preparar un recordatorio amable", outcome: "recordatorio" },
    seguimiento_visita: { name: "Seguimiento después de la visita", when: `Termina ${t.offering.g === "a" ? "una" : "un"} ${t.offering.one}`, then: "Preparar un mensaje para saber cómo se sintió", outcome: "mensaje de seguimiento" },
    reactivacion: { name: "Reactivación", when: `${t.client.g === "a" ? "Una" : "Un"} ${c1} no regresa en 30 días`, then: "Crear una tarea para invitar a volver", outcome: "tarea de reactivación" },
    renovacion_paquete: { name: "Fin de paquete", when: `Se terminan las ${t.credit.many} de un paquete`, then: "Preparar una propuesta de renovación", outcome: "propuesta de renovación" },
  };
  return copy[id];
}

export const stageOrder: LeadStage[] = ["nuevo", "contactado", "prueba", "cliente", "seguimiento"];

/** Integraciones que SUMA podría desarrollar. En la demo ninguna está conectada. */
export const integrationOptions = [
  "Cobros en línea",
  "WhatsApp Business",
  "Calendario de Google",
  "Facturación",
  "Mi sistema de reservas actual",
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

export function defaultConfig(vertical: VerticalId = "pilates"): StudioConfig {
  return withVertical({
    name: "", vertical, theme: "arcilla", offerings: [], instructors: 1, rooms: 1, capacity: 1, plans: [], modules: [], integrations: [], needs: "",
  }, vertical);
}

export const studioDisplayName = (config: StudioConfig) => config.name.trim() || `Tu ${termsOf(config).business}`;
export { verticals };
