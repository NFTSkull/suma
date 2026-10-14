"use client";

import { useState } from "react";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { useTabs } from "@/components/ui/useTabs";
import { cn } from "@/lib/cn";

type Appointment = {
  id: string;
  time: string;
  client: string;
  service: string;
  therapist: string;
  room: string;
  confirmed: boolean;
  notes: string;
  visits: number;
};

const initialAppointments: Appointment[] = [
  { id: "a1", time: "10:00", client: "Mariana Ruiz", service: "Masaje relajante · 60 min", therapist: "Sofía", room: "Cabina 2", confirmed: true, notes: "Prefiere presión media y aroma de lavanda.", visits: 8 },
  { id: "a2", time: "11:30", client: "Daniel Pérez", service: "Facial hidratante · 50 min", therapist: "Valeria", room: "Cabina 1", confirmed: false, notes: "Primera visita. Piel sensible.", visits: 1 },
  { id: "a3", time: "13:00", client: "Lucía y Andrés", service: "Ritual de pareja · 90 min", therapist: "Sofía y Marco", room: "Suite", confirmed: true, notes: "Celebran aniversario. Preparar té de bienvenida.", visits: 3 },
  { id: "a4", time: "16:00", client: "Fernanda Gil", service: "Piedras calientes · 75 min", therapist: "Marco", room: "Cabina 3", confirmed: false, notes: "Pidió música tranquila.", visits: 5 },
];

const clients = [
  { name: "Mariana Ruiz", last: "Hace 2 semanas", tag: "Frecuente", visits: 8 },
  { name: "Fernanda Gil", last: "Hace 1 mes", tag: "Membresía", visits: 5 },
  { name: "Lucía Herrera", last: "Hace 3 meses", tag: "Reactivar", visits: 4 },
  { name: "Daniel Pérez", last: "Hoy", tag: "Nuevo", visits: 1 },
];

const treatments = [
  { name: "Masaje relajante", time: "60 min", demand: 82 },
  { name: "Facial hidratante", time: "50 min", demand: 64 },
  { name: "Ritual de pareja", time: "90 min", demand: 46 },
  { name: "Piedras calientes", time: "75 min", demand: 38 },
];

const followUps = [
  { who: "Lucía Herrera", what: "Invitar de regreso con su tratamiento favorito", when: "Hoy" },
  { who: "Daniel Pérez", what: "Mensaje de bienvenida después de su primera visita", when: "Mañana" },
  { who: "Fernanda Gil", what: "Recordar renovación de membresía", when: "Viernes" },
];

const tabs = ["hoy", "clientes", "servicios", "pendientes", "seguimientos"] as const;
const tabLabels: Record<(typeof tabs)[number], string> = {
  hoy: "Citas de hoy",
  clientes: "Clientes",
  servicios: "Servicios",
  pendientes: "Confirmaciones",
  seguimientos: "Seguimientos",
};

function AppointmentRow({ a, selected, onSelect }: { a: Appointment; selected: boolean; onSelect: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        aria-controls="crm-detalle"
        className={cn(
          "flex min-h-14 w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border px-4 py-3 text-left transition-colors",
          selected ? "border-suma-purple bg-suma-purple/8" : "border-suma-line hover:border-suma-navy/30",
        )}
      >
        <span className="font-display text-lg font-bold tabular-nums">{a.time}</span>
        <span className="min-w-[9rem] flex-1">
          <span className="block font-bold">{a.client}</span>
          <span className="block text-sm text-suma-navy/65">{a.service}</span>
        </span>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold",
            a.confirmed ? "bg-suma-purple/10 text-suma-purple" : "bg-suma-orange/15 text-suma-orange-ink",
          )}
        >
          {a.confirmed ? "Confirmada" : "Por confirmar"}
        </span>
      </button>
    </li>
  );
}

export function SpaCrmDemo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { active, listProps, tabProps, panelProps } = useTabs(tabs);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = appointments.find((a) => a.id === openId) ?? null;
  const pending = appointments.filter((a) => !a.confirmed);

  const confirm = (id: string) => setAppointments((list) => list.map((a) => (a.id === id ? { ...a, confirmed: true } : a)));

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[1.75rem] border border-suma-line bg-suma-cream-soft text-suma-navy shadow-lift">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-suma-line bg-suma-cream px-5 py-3.5">
          <p className="font-bold">
            Spa Ejemplo <span className="font-medium text-suma-navy/60">· CRM conceptual</span>
          </p>
          <p className="text-sm text-suma-navy/60">Jueves · datos ficticios</p>
        </div>

        <div className="grid lg:grid-cols-[13rem_1fr] [&>*]:min-w-0">
          <div {...listProps} aria-label="Secciones del CRM" className="hide-scrollbar flex gap-1 overflow-x-auto border-b border-suma-line p-2 lg:flex-col lg:border-b-0 lg:border-r lg:p-3">
            {tabs.map((t) => (
              <button
                key={t}
                {...tabProps(t)}
                className={cn(
                  "flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-xl px-3.5 text-sm font-bold transition-colors",
                  active === t ? "bg-suma-purple text-suma-cream" : "text-suma-navy/75 hover:bg-suma-cream-deep",
                )}
              >
                {tabLabels[t]}
                {t === "pendientes" && pending.length > 0 && (
                  <span className={cn("rounded-full px-2 text-xs", active === t ? "bg-suma-cream/20" : "bg-suma-orange/20")}>{pending.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="grid min-h-[24rem] xl:grid-cols-[1fr_17rem] [&>*]:min-w-0">
            <div className="p-4 md:p-6">
              <div {...panelProps("hoy")} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {[
                    [appointments.length, "Citas"],
                    [appointments.filter((a) => a.confirmed).length, "Confirmadas"],
                    [pending.length, "Pendientes"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-2xl bg-suma-cream-deep px-3 py-3">
                      <p className="font-display text-2xl font-extrabold leading-none">{v}</p>
                      <p className="mt-1 text-xs font-semibold text-suma-navy/65">{l}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2">
                  {appointments.map((a) => (
                    <AppointmentRow key={a.id} a={a} selected={openId === a.id} onSelect={() => setOpenId(a.id)} />
                  ))}
                </ul>
              </div>

              <div {...panelProps("clientes")} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
                <ul className="divide-y divide-suma-line">
                  {clients.map((c) => (
                    <li key={c.name} className="flex items-center gap-3 py-3">
                      <span className="grid size-10 place-items-center rounded-full bg-suma-purple/10 font-display font-bold text-suma-purple">
                        {c.name[0]}
                      </span>
                      <span className="flex-1">
                        <span className="block font-bold">{c.name}</span>
                        <span className="text-sm text-suma-navy/65">
                          Última visita: {c.last} · {c.visits} visitas
                        </span>
                      </span>
                      <span className="rounded-full bg-suma-cream-deep px-2.5 py-1 text-xs font-bold">{c.tag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div {...panelProps("servicios")} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
                <p className="mb-4 text-sm text-suma-navy/65">Solicitudes del mes (valores ilustrativos)</p>
                <ul className="space-y-4">
                  {treatments.map((t) => (
                    <li key={t.name}>
                      <p className="flex justify-between text-sm font-bold">
                        {t.name} <span className="font-medium text-suma-navy/60">{t.time}</span>
                      </p>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-suma-cream-deep">
                        <div className="h-full rounded-full bg-suma-purple" style={{ width: `${t.demand}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div {...panelProps("pendientes")} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
                {pending.length === 0 ? (
                  <p className="rounded-2xl bg-suma-purple/8 p-5 font-bold text-suma-purple">Todas las citas de hoy están confirmadas.</p>
                ) : (
                  <ul className="space-y-2">
                    {pending.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-suma-line px-4 py-3">
                        <span className="font-display text-lg font-bold">{a.time}</span>
                        <span className="flex-1 font-bold">{a.client}</span>
                        <button
                          type="button"
                          onClick={() => confirm(a.id)}
                          className="min-h-10 rounded-full bg-suma-navy px-4 text-sm font-bold text-suma-cream hover:bg-suma-purple"
                        >
                          Marcar confirmada
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div {...panelProps("seguimientos")} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
                <ul className="space-y-2">
                  {followUps.map((f) => (
                    <li key={f.who} className="rounded-2xl border border-suma-line px-4 py-3">
                      <p className="flex justify-between gap-3">
                        <span className="font-bold">{f.who}</span>
                        <span className="text-sm font-bold text-suma-orange-ink">{f.when}</span>
                      </p>
                      <p className="text-sm text-suma-navy/70">{f.what}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside
              id="crm-detalle"
              aria-live="polite"
              aria-label="Detalle de la cita"
              className="border-t border-suma-line bg-suma-cream p-5 xl:border-l xl:border-t-0"
            >
              {open ? (
                <div key={open.id} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-suma-navy/60">{open.time} · {open.room}</p>
                      <p className="mt-1 font-display text-xl font-bold">{open.client}</p>
                    </div>
                    <button type="button" onClick={() => setOpenId(null)} className="min-h-10 rounded-full px-3 text-sm font-bold text-suma-purple hover:bg-suma-purple/10">
                      Cerrar
                    </button>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="font-bold text-suma-navy/60">Servicio</dt>
                      <dd>{open.service}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-suma-navy/60">Terapeuta</dt>
                      <dd>{open.therapist}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-suma-navy/60">Historial</dt>
                      <dd>{open.visits} visitas</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-suma-navy/60">Notas</dt>
                      <dd>{open.notes}</dd>
                    </div>
                  </dl>
                  {!open.confirmed ? (
                    <button
                      type="button"
                      onClick={() => confirm(open.id)}
                      className="mt-5 min-h-11 w-full rounded-full bg-suma-navy px-4 text-sm font-bold text-suma-cream hover:bg-suma-purple"
                    >
                      Marcar confirmada
                    </button>
                  ) : (
                    <p className="mt-5 rounded-full bg-suma-purple/10 px-4 py-2.5 text-center text-sm font-bold text-suma-purple">Cita confirmada</p>
                  )}
                </div>
              ) : (
                <div className="flex h-full flex-col justify-center text-sm text-suma-navy/65">
                  <span aria-hidden="true" className="blob mb-3 size-8 bg-suma-purple/20" />
                  Selecciona una cita en “Citas de hoy” para ver sus detalles.
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
      <DemoNotice tone={tone === "dark" ? "light" : "dark"} />
    </div>
  );
}
