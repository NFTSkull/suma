"use client";

import { useId, useState } from "react";
import { addClassType, removeClassType, updateClassType } from "@/lib/studio-os/engine";
import { occupies } from "@/lib/studio-os/rules";
import { fmtMoney } from "@/lib/studio-os/time";
import type { OfferingKind } from "@/lib/studio-os/types";
import { cap, verticalOf } from "@/lib/studio-os/verticals";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Badge, Button, Card, ConfirmButton, cx, Field, inputClass, Meter, PageHeader } from "../ui";

/** Catálogo de lo que ofrece el negocio: duración, precio y demanda de la semana. */
export function Servicios() {
  const { state, apply, t, caps, go } = useStudio();
  const id = useId();
  const both = verticalOf(state.config).allows.length > 1;
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<{ name: string; minutes: number; price: number; kind: OfferingKind }>({ name: "", minutes: 60, price: 900, kind: caps.appointments ? "individual" : "grupal" });
  const quiet = { quiet: true };

  const rows = state.classTypes.map((c) => {
    const sessions = state.sessions.filter((s) => s.classTypeId === c.id && s.status === "programada");
    const visits = state.bookings.filter((b) => occupies(b) && sessions.some((s) => s.id === b.sessionId)).length;
    return { c, sessions: sessions.length, visits, value: c.kind === "individual" ? visits * c.price : 0 };
  });
  const top = Math.max(1, ...rows.map((r) => r.visits));

  return (
    <>
      <PageHeader
        title={cap(t.offering.many)}
        description={`Lo que ofrece tu ${t.business}. Duración y precio se usan al agendar; la demanda sale de la agenda de esta semana.`}
        action={state.role !== "instructor" && <Button variant="primary" icon={adding ? "x" : "plus"} onClick={() => setAdding((v) => !v)}>{adding ? "Cerrar" : `Agregar ${t.offering.one}`}</Button>}
      />
      {adding && (
        <Card className="os-fade mb-5 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr_1fr_auto] sm:items-end">
            <Field label="Nombre" htmlFor={`${id}-n`}>
              <input id={`${id}-n`} className={inputClass} maxLength={32} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="off" />
            </Field>
            <Field label="Duración" htmlFor={`${id}-m`}>
              <select id={`${id}-m`} className={inputClass} value={form.minutes} onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })}>
                {[30, 45, 50, 60, 75, 90, 120].map((m) => <option key={m} value={m}>{m} min</option>)}
              </select>
            </Field>
            {both ? (
              <Field label="Tipo" htmlFor={`${id}-k`}>
                <select id={`${id}-k`} className={inputClass} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as OfferingKind })}>
                  <option value="individual">Individual</option>
                  <option value="grupal">Grupal</option>
                </select>
              </Field>
            ) : (
              <Field label="Precio (MXN)" htmlFor={`${id}-p`}>
                <input id={`${id}-p`} type="number" min={0} step={50} className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </Field>
            )}
            <Button variant="primary" disabled={!form.name.trim()} onClick={() => { if (apply(addClassType(state, form.name, form.minutes, form.kind, form.kind === "individual" ? form.price : 0))) { setForm({ ...form, name: "" }); setAdding(false); } }}>Agregar</Button>
          </div>
          <p className="mt-2 text-[12.5px] text-(--os-muted)">Precio de ejemplo para tus clientes; no es un precio de SUMA.</p>
        </Card>
      )}

      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ c, sessions, visits, value }) => (
          <li key={c.id}>
            <Card as="article" className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="os-display truncate text-[1.3rem] leading-tight">{c.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge tone={c.kind === "individual" ? "accent" : "success"}>{c.kind === "individual" ? "Individual" : "Grupal"}</Badge>
                    <Badge dot={false}><Icon name="clock" className="size-3" />{c.minutes} min</Badge>
                  </div>
                </div>
                {c.kind === "individual" && <p className="os-num shrink-0 text-[1.35rem] font-medium">{fmtMoney(c.price)}</p>}
              </div>
              <div className="mt-5">
                <p className="flex items-baseline justify-between text-[12.5px]"><span className="text-(--os-muted)">{c.kind === "individual" ? `${cap(t.booking.many)} esta semana` : "Reservas esta semana"}</span><span className="os-num font-semibold">{visits}</span></p>
                <div className="mt-1.5"><Meter value={visits} max={top} label={`Demanda de ${c.name}`} /></div>
                <p className="mt-2 text-[12px] text-(--os-muted)">{c.kind === "individual" ? `Valor de la agenda: ${fmtMoney(value)}` : `${sessions} horarios programados`}</p>
              </div>
              {state.role !== "instructor" && (
                <details className="group mt-4 border-t border-(--os-line) pt-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-semibold text-(--os-ink-2) [&::-webkit-details-marker]:hidden">
                    Editar <Icon name="chevronRight" className="size-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Field label="Duración" htmlFor={`${id}-dm-${c.id}`}>
                      <select id={`${id}-dm-${c.id}`} className={inputClass} value={c.minutes} onChange={(e) => apply(updateClassType(state, c.id, { minutes: Number(e.target.value) }), quiet)}>
                        {[30, 45, 50, 60, 75, 90, 120].map((m) => <option key={m} value={m}>{m} min</option>)}
                      </select>
                    </Field>
                    {c.kind === "individual" && (
                      <Field label="Precio" htmlFor={`${id}-dp-${c.id}`}>
                        <input id={`${id}-dp-${c.id}`} type="number" min={0} step={50} className={inputClass} value={c.price} onChange={(e) => apply(updateClassType(state, c.id, { price: Number(e.target.value) }), quiet)} />
                      </Field>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end"><ConfirmButton label="Quitar" confirmLabel="Sí, quitar" onConfirm={() => apply(removeClassType(state, c.id))} /></div>
                </details>
              )}
            </Card>
          </li>
        ))}
      </ul>
      <p className={cx("mt-5 text-[13px] text-(--os-muted)")}>
        ¿Quieres verlo en acción? <button type="button" onClick={() => go("agenda")} className="font-semibold text-(--os-accent-ink) underline underline-offset-4">Abre {t.agenda.toLowerCase()}</button> y agenda {t.booking.g === "a" ? "una" : "un"} {t.booking.one}.
      </p>
    </>
  );
}
