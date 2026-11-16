import type { ModuleId, StudioConfig, ViewId } from "@/lib/studio-os/types";
import { viewLabel } from "@/lib/studio-os/verticals";
import type { IconName } from "./icons";

const base: Record<ViewId, { label: string; icon: IconName; hint: string }> = {
  inicio: { label: "Inicio", icon: "home", hint: "Lo que pasa hoy y lo que requiere tu atención." },
  agenda: { label: "Agenda", icon: "calendar", hint: "Horarios, reservas y asistencia." },
  servicios: { label: "Servicios", icon: "layers", hint: "Lo que ofreces: duración, precio y demanda." },
  alumnas: { label: "Clientes", icon: "users", hint: "Fichas, historial, notas y seguimiento." },
  membresias: { label: "Membresías", icon: "card", hint: "Paquetes, vencimientos y renovaciones." },
  ventas: { label: "Ventas", icon: "funnel", hint: "Interesados por etapa y tareas de seguimiento." },
  pagos: { label: "Pagos", icon: "wallet", hint: "Cobros, pendientes e ingresos (simulados)." },
  profesores: { label: "Equipo", icon: "team", hint: "Disponibilidad, agenda y honorarios estimados." },
  reportes: { label: "Reportes", icon: "chart", hint: "Ocupación, asistencia, retención e ingresos." },
  automatizaciones: { label: "Automatizaciones", icon: "bolt", hint: "Reglas que se simulan, nunca se envían." },
  portal: { label: "Portal", icon: "phone", hint: "Así lo verían tus clientes." },
  personalizar: { label: "Personalizar", icon: "sliders", hint: "Servicios, espacios, reglas, roles y marca." },
  resumen: { label: "Así quedaría", icon: "doc", hint: "Resumen de tu sistema para pedir una propuesta." },
};

/** Etiqueta, ícono y ayuda de cada vista con la terminología del giro. */
export function viewInfo(v: ViewId, config: Pick<StudioConfig, "vertical" | "offerings">) {
  return { ...base[v], label: viewLabel(v, config) || base[v].label };
}

export const navGroups: { label: string; views: ViewId[] }[] = [
  { label: "Operación", views: ["inicio", "agenda", "servicios", "alumnas", "membresias"] },
  { label: "Negocio", views: ["ventas", "pagos", "profesores", "reportes", "automatizaciones"] },
  { label: "Tu sistema", views: ["portal", "personalizar", "resumen"] },
];

export const moduleIcon: Record<ModuleId, IconName> = {
  alumnas: "users", clases: "calendar", membresias: "card", pagos: "wallet", equipo: "team", marketing: "funnel",
};
