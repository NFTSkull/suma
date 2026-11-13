"use client";

import { useId, useState } from "react";
import { sellPlan } from "@/lib/studio-os/engine";
import type { MembershipStatus } from "@/lib/studio-os/rules";
import { fmtMoney } from "@/lib/studio-os/time";
import { statusLabel } from "@/lib/studio-os/selectors";
import type { PlanKind, Transaction } from "@/lib/studio-os/types";
import { cap, type Terms } from "@/lib/studio-os/verticals";
import { useStudio } from "../context";
import { Button, Field, inputClass } from "../ui";

export const statusTone: Record<MembershipStatus | "sin", "success" | "warn" | "danger" | "neutral"> = {
  activa: "success", por_vencer: "warn", agotada: "warn", pausada: "neutral", vencida: "danger", cancelada: "neutral", sin: "neutral",
};

/** Estados de un paquete con la palabra del giro ("Sin sesiones" en un spa). */
export const statusText = (t: Terms) => ({ ...statusLabel, agotada: `Sin ${t.credit.many}`, sin: "Sin paquete" });

/** Registrar una venta simulada: crea la membresía y la transacción. No procesa cobros. */
export function SellForm({ studentId: fixed, onDone }: { studentId?: string; onDone?: () => void }) {
  const { state, apply, t } = useStudio();
  const id = useId();
  const plans = state.plans.filter((p) => p.enabled);
  const [studentId, setStudentId] = useState(fixed ?? "");
  const [planId, setPlanId] = useState<PlanKind>(plans[0]?.id ?? "individual");
  const [discountPct, setDiscount] = useState(0);
  const [method, setMethod] = useState<Transaction["method"]>("Tarjeta");
  const [status, setStatus] = useState<"pagado" | "pendiente">("pagado");
  const plan = state.plans.find((p) => p.id === planId);
  const total = plan ? Math.round(plan.price * (1 - discountPct / 100)) : 0;
  const submit = () => {
    if (apply(sellPlan(state, studentId, planId, { discountPct, method, status }))) onDone?.();
  };
  return (
    <div className="os-fade rounded-xl border border-(--os-line) bg-white p-3 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {!fixed && (
          <Field label={cap(t.client.one)} htmlFor={`${id}-s`} className="sm:col-span-2">
            <select id={`${id}-s`} className={inputClass} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              <option value="">Elige…</option>
              {[...state.students].sort((a, b) => a.name.localeCompare(b.name)).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="Paquete" htmlFor={`${id}-p`}>
          <select id={`${id}-p`} className={inputClass} value={planId} onChange={(e) => setPlanId(e.target.value as PlanKind)}>
            {plans.map((p) => <option key={p.id} value={p.id}>{p.name} · {fmtMoney(p.price)}</option>)}
          </select>
        </Field>
        <Field label="Descuento" htmlFor={`${id}-d`}>
          <select id={`${id}-d`} className={inputClass} value={discountPct} onChange={(e) => setDiscount(Number(e.target.value))}>
            {[0, 10, 15, 20].map((d) => <option key={d} value={d}>{d ? `${d}%` : "Sin descuento"}</option>)}
          </select>
        </Field>
        <Field label="Método" htmlFor={`${id}-m`}>
          <select id={`${id}-m`} className={inputClass} value={method} onChange={(e) => setMethod(e.target.value as Transaction["method"])}>
            {(["Tarjeta", "Transferencia", "Efectivo"] as const).map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Estado del pago" htmlFor={`${id}-e`}>
          <select id={`${id}-e`} className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as "pagado" | "pendiente")}>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">Total <strong className="tabular-nums">{fmtMoney(total)}</strong>{plan && <span className="text-(--os-muted)"> · {plan.credits === null ? "ilimitado" : `${plan.credits} ${plan.credits === 1 ? t.credit.one : t.credit.many}`} · {plan.validityDays} días</span>}</p>
        <Button variant="primary" icon="check" disabled={!studentId} onClick={submit}>Registrar venta</Button>
      </div>
      <p className="mt-2 text-[12px] text-(--os-muted)">Datos ficticios — no se procesa ningún pago.</p>
    </div>
  );
}
