/** Utilidades de fecha y formato en hora local (es-MX). Sin dependencias. */

const DAY = 86_400_000;

export const toDate = (iso: string) => new Date(iso);
export const iso = (d: Date) => d.toISOString();

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const addMinutes = (d: Date, n: number) => new Date(d.getTime() + n * 60_000);
/** Lunes de la semana de `d`. */
export function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const offset = (x.getDay() + 6) % 7;
  return addDays(x, -offset);
}
export const sameDay = (a: Date | string, b: Date | string) => startOfDay(new Date(a)).getTime() === startOfDay(new Date(b)).getTime();
export const hoursBetween = (from: Date | string, to: Date | string) => (new Date(to).getTime() - new Date(from).getTime()) / 3_600_000;
export const daysBetween = (from: Date | string, to: Date | string) => (new Date(to).getTime() - new Date(from).getTime()) / DAY;
export function atTime(day: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const x = startOfDay(day);
  x.setHours(h, m, 0, 0);
  return x;
}

const timeFmt = new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
const dayFmt = new Intl.DateTimeFormat("es-MX", { weekday: "short", day: "numeric", month: "short" });
const longDayFmt = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long" });
const dateFmt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });
const moneyFmt = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export const fmtTime = (v: string | Date) => timeFmt.format(new Date(v));
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const fmtDay = (v: string | Date) => cap(dayFmt.format(new Date(v)).replace(/\./g, ""));
export const fmtLongDay = (v: string | Date) => longDayFmt.format(new Date(v));
export const fmtDate = (v: string | Date) => dateFmt.format(new Date(v)).replace(/\./g, "");
export const fmtMoney = (n: number) => moneyFmt.format(n);
export const fmtPct = (n: number) => `${Math.round(n * 100)}%`;

export function fmtRelative(v: string, now: string): string {
  const mins = Math.round((new Date(now).getTime() - new Date(v).getTime()) / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "ayer" : `hace ${days} días`;
}

/** Generador determinista (mulberry32): mismos datos para la misma semilla. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
