import type { Booking, DemoState, Membership, Session } from "./types";

export type MembershipStatus = "activa" | "por_vencer" | "agotada" | "pausada" | "vencida" | "cancelada";

/** Lugares ocupados: reservas vigentes y asistencias registradas (la lista de espera no ocupa lugar). */
export const occupies = (b: Booking) => b.status === "reservada" || b.status === "asistio" || b.status === "falta";
export const isLive = (b: Booking) => occupies(b) || b.status === "espera";

export const sessionBookings = (state: DemoState, sessionId: string) => state.bookings.filter((b) => b.sessionId === sessionId);
export const sessionTaken = (state: DemoState, sessionId: string) => sessionBookings(state, sessionId).filter(occupies).length;
export const sessionWaitlist = (state: DemoState, sessionId: string) =>
  sessionBookings(state, sessionId).filter((b) => b.status === "espera").sort((a, b) => a.createdAt.localeCompare(b.createdAt));
export const sessionEnd = (s: Session) => new Date(new Date(s.start).getTime() + s.minutes * 60_000);

export const creditsLeft = (m: Membership): number | null => (m.creditsTotal === null ? null : Math.max(0, m.creditsTotal - m.creditsUsed));

export function membershipStatus(m: Membership, at: string, warningDays: number): MembershipStatus {
  if (m.status === "cancelada") return "cancelada";
  if (m.status === "pausada") return "pausada";
  if (new Date(at) > new Date(m.end)) return "vencida";
  const left = creditsLeft(m);
  if (left === 0) return "agotada";
  const days = (new Date(m.end).getTime() - new Date(at).getTime()) / 86_400_000;
  if (days <= warningDays || left === 1) return "por_vencer";
  return "activa";
}

/** ¿Esta membresía puede pagar un lugar en una clase que empieza en `at`? */
export function canPay(m: Membership, at: string): boolean {
  if (m.status !== "activa") return false;
  if (new Date(at) < new Date(m.start) || new Date(at) > new Date(m.end)) return false;
  const left = creditsLeft(m);
  return left === null || left > 0;
}

/** Membresía con la que se cobraría una clase: la que vence primero. */
export function payingMembership(state: DemoState, studentId: string, at: string): Membership | undefined {
  return state.memberships
    .filter((m) => m.studentId === studentId && canPay(m, at))
    .sort((a, b) => a.end.localeCompare(b.end))[0];
}

/** Explica por qué una alumna no puede reservar, en lenguaje de la persona. */
export function whyCannotPay(state: DemoState, studentId: string, at: string): string {
  const name = state.students.find((s) => s.id === studentId)?.name.split(" ")[0] ?? "La alumna";
  const own = state.memberships.filter((m) => m.studentId === studentId && m.status !== "cancelada");
  if (!own.length) return `${name} no tiene un paquete o membresía. Véndele uno desde Membresías.`;
  if (own.some((m) => m.status === "pausada")) return `La membresía de ${name} está pausada. Reactívala para reservar.`;
  const current = own.filter((m) => new Date(at) <= new Date(m.end));
  if (!current.length) return `La membresía de ${name} vence antes de esta clase. Renuévala para reservar.`;
  return `${name} ya usó todos sus créditos. Renueva o vende un paquete para reservar.`;
}
