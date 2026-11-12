import type { ModuleId, ViewId } from "@/lib/studio-os/types";
import type { IconName } from "./icons";

export const viewMeta: Record<ViewId, { label: string; icon: IconName; hint: string }> = {
  inicio: { label: "Inicio", icon: "home", hint: "Lo que pasa hoy y lo que requiere tu atención." },
  agenda: { label: "Agenda", icon: "calendar", hint: "Clases, cupos, reservas y asistencia." },
  alumnas: { label: "Alumnas", icon: "users", hint: "Fichas, paquetes, notas y seguimiento." },
  membresias: { label: "Membresías", icon: "card", hint: "Paquetes, vencimientos, pausas y renovaciones." },
  ventas: { label: "Ventas", icon: "funnel", hint: "Interesados por etapa y tareas de seguimiento." },
  pagos: { label: "Pagos", icon: "wallet", hint: "Cobros, pendientes e ingresos (simulados)." },
  profesores: { label: "Profesores", icon: "team", hint: "Disponibilidad, clases, sustituciones y honorarios." },
  reportes: { label: "Reportes", icon: "chart", hint: "Ocupación, asistencia, retención e ingresos." },
  automatizaciones: { label: "Automatizaciones", icon: "bolt", hint: "Reglas de ejemplo que se simulan, nunca se envían." },
  portal: { label: "Portal de alumnas", icon: "phone", hint: "Así lo verían tus alumnas." },
  personalizar: { label: "Personalizar", icon: "sliders", hint: "Clases, salas, reglas, roles y marca." },
  resumen: { label: "Así quedaría", icon: "doc", hint: "Resumen de tu sistema para pedir una propuesta." },
};

export const navGroups: { label: string; views: ViewId[] }[] = [
  { label: "Operación", views: ["inicio", "agenda", "alumnas", "membresias"] },
  { label: "Negocio", views: ["ventas", "pagos", "profesores", "reportes", "automatizaciones"] },
  { label: "Tu sistema", views: ["portal", "personalizar", "resumen"] },
];

export const moduleIcon: Record<ModuleId, IconName> = {
  alumnas: "users", clases: "calendar", membresias: "card", pagos: "wallet", equipo: "team", marketing: "funnel",
};
