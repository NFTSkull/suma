/**
 * SUMA Wellness OS — modelo de dominio de la demostración.
 *
 * Un núcleo común (clientes, agenda, equipo, espacios, planes, pagos, ventas)
 * sirve a todos los giros. Lo que cambia por giro vive en `verticals.ts`.
 * Por compatibilidad con la primera versión algunos nombres internos conservan
 * el vocabulario de estudio: `students` = clientes, `instructors` = equipo,
 * `rooms` = espacios (salas o cabinas), `classTypes` = servicios ofrecidos.
 * Todo es ficticio y vive en el navegador: no hay base de datos, cobros,
 * reservas reales ni mensajes. Las fechas son ISO 8601 en hora local.
 */

export type VerticalId = "pilates" | "yoga" | "spa" | "wellness" | "otro";
/** Cómo se presta un servicio: en grupo con cupo, o como cita individual. */
export type OfferingKind = "grupal" | "individual";
/** Modalidad derivada de lo que ofrece el negocio. */
export type OperationMode = "grupal" | "citas" | "hibrido";
export type ThemeId = "arcilla" | "salvia" | "lavanda" | "oceano" | "rosa" | "grafito";
export type ModuleId = "alumnas" | "clases" | "membresias" | "pagos" | "equipo" | "marketing";
/** Identificador de un plan del catálogo del giro (ver `planCatalog`). */
export type PlanKind = string;
/** Papel comercial de un plan: suelto, de prueba, paquete de sesiones o membresía. */
export type PlanRole = "suelta" | "prueba" | "paquete" | "membresia";
export type RoleId = "duena" | "recepcion" | "instructor";
export type LeadStage = "nuevo" | "contactado" | "prueba" | "cliente" | "seguimiento";
export type AutomationId =
  | "vencimiento" | "bienvenida" | "sin_reserva" | "inactiva" | "clase_cancelada" | "lugar_liberado"
  | "confirmacion" | "recordatorio" | "seguimiento_visita" | "reactivacion" | "renovacion_paquete";

export type ViewId =
  | "inicio" | "alumnas" | "agenda" | "servicios" | "membresias" | "ventas" | "pagos" | "profesores"
  | "reportes" | "automatizaciones" | "portal" | "personalizar" | "resumen";

/** Respuestas del configurador guiado. */
export type OfferingInput = { name: string; minutes: number; kind: OfferingKind; price: number };
export type StudioConfig = {
  name: string;
  vertical: VerticalId;
  theme: ThemeId;
  /** Servicios que ofrece: clases grupales, tratamientos o sesiones individuales. */
  offerings: OfferingInput[];
  /** Personas del equipo (instructores, terapeutas, especialistas). */
  instructors: number;
  /** Espacios (salas o cabinas). */
  rooms: number;
  /** Cupo por clase grupal; no aplica a citas individuales. */
  capacity: number;
  plans: PlanKind[];
  modules: ModuleId[];
  integrations: string[];
  needs: string;
};

export type Settings = {
  /** Horas mínimas de anticipación para cancelar y recuperar el crédito. */
  cancellationHours: number;
  /** Qué pasa con el crédito si se cancela tarde. */
  lateCancel: "pierde" | "devuelve";
  waitlist: boolean;
  /** Días antes del vencimiento en que una membresía se marca "por vencer". */
  expiryWarningDays: number;
  notifications: { recordatorio: boolean; espera: boolean; vencimiento: boolean };
  stageLabels: Record<LeadStage, string>;
};

export type ClassType = { id: string; name: string; minutes: number; kind: OfferingKind; price: number };
export type Branch = { id: string; name: string };
export type Room = { id: string; name: string; branchId: string; capacity: number; kind: OfferingKind };
export type Instructor = {
  id: string;
  name: string;
  /** Días disponibles: 0 domingo … 6 sábado. */
  days: number[];
  /** Honorario estimado por clase (MXN), configurable. */
  ratePerClass: number;
};
export type Plan = {
  id: PlanKind;
  role: PlanRole;
  name: string;
  price: number;
  /** `null` = ilimitado dentro de la vigencia. */
  credits: number | null;
  validityDays: number;
  enabled: boolean;
};

export type Session = {
  id: string;
  /** "grupal": clase con cupo y lista de espera. "cita": servicio individual (cupo 1, sin lista de espera). */
  kind: "grupal" | "cita";
  classTypeId: string;
  instructorId: string;
  roomId: string;
  start: string;
  minutes: number;
  capacity: number;
  status: "programada" | "cancelada";
  /** Instructor original cuando hubo sustitución. */
  substituteFor?: string;
};

export type BookingStatus = "reservada" | "espera" | "asistio" | "falta" | "cancelada" | "cancelada_tarde";
export type Booking = {
  id: string;
  sessionId: string;
  studentId: string;
  status: BookingStatus;
  /** Membresía que pagó el lugar; `null` en lista de espera o si se devolvió. */
  membershipId: string | null;
  /** `true` mientras el crédito esté descontado. Garantiza no descontar ni devolver dos veces. */
  creditCharged: boolean;
  createdAt: string;
};

export type Membership = {
  id: string;
  studentId: string;
  planId: PlanKind;
  start: string;
  end: string;
  creditsTotal: number | null;
  creditsUsed: number;
  status: "activa" | "pausada" | "cancelada";
  /** Días que se recorrió el vencimiento al pausar; se descuentan al reactivar. */
  pausedDays?: number;
};

export type Student = {
  id: string;
  name: string;
  hue: number;
  tags: string[];
  notes: string;
  followUp: string | null;
  joinedAt: string;
  /** Historial anterior a la semana simulada. */
  pastVisits: number;
  lastVisitBefore: string | null;
};

export type Lead = {
  id: string;
  name: string;
  interest: string;
  source: "Instagram" | "WhatsApp" | "Recomendación" | "Sitio web";
  stage: LeadStage;
  createdAt: string;
  history: { at: string; text: string }[];
  studentId?: string;
};

export type Task = { id: string; text: string; due: string; done: boolean };

export type Transaction = {
  id: string;
  studentId: string;
  concept: string;
  planId?: PlanKind;
  listPrice: number;
  discountPct: number;
  /** Importe final; negativo en reembolsos. */
  amount: number;
  kind: "venta" | "renovacion" | "reembolso";
  status: "pagado" | "pendiente";
  method: "Tarjeta" | "Efectivo" | "Transferencia";
  at: string;
  membershipId?: string;
  /** Cita cobrada por servicio (sin paquete). */
  bookingId?: string;
  refunded?: boolean;
};

export type ActivityKind = "reserva" | "cancelacion" | "asistencia" | "membresia" | "pago" | "venta" | "automatizacion" | "clase" | "ajuste";
export type Activity = { id: string; at: string; text: string; kind: ActivityKind };

export type Automation = { id: AutomationId; enabled: boolean; lastRun?: string };

export type DemoState = {
  version: 2;
  /** Reloj de la simulación: se fija al entrar al estudio. */
  now: string;
  seq: number;
  config: StudioConfig;
  settings: Settings;
  role: RoleId;
  /** Instructor que se usa al ver el sistema con el rol "Instructor". */
  viewAsInstructorId: string;
  portalStudentId: string;
  classTypes: ClassType[];
  branches: Branch[];
  rooms: Room[];
  instructors: Instructor[];
  plans: Plan[];
  students: Student[];
  memberships: Membership[];
  sessions: Session[];
  bookings: Booking[];
  leads: Lead[];
  tasks: Task[];
  transactions: Transaction[];
  activity: Activity[];
  automations: Automation[];
};

/** Resultado de toda acción del motor: nuevo estado y un mensaje para la persona. */
export type Result = { state: DemoState; ok: boolean; message: string };
