"use client";

import { useState } from "react";
import { markPaid, refundTransaction } from "@/lib/studio-os/engine";
import { finance, studentName } from "@/lib/studio-os/selectors";
import { cap } from "@/lib/studio-os/verticals";
import { fmtDate, fmtMoney } from "@/lib/studio-os/time";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Badge, Bars, Button, Card, CardTitle, ConfirmButton, Empty, PageHeader, Segmented, Stat } from "../ui";
import { SellForm } from "./shared";

type Filter = "todos" | "pendiente" | "pagado" | "reembolso";

export function Pagos() {
  const { state, apply, t, caps } = useStudio();
  const [filter, setFilter] = useState<Filter>("todos");
  const [selling, setSelling] = useState(false);
  const f = finance(state);
  const delta = f.collectedPrev ? (f.collectedMonth - f.collectedPrev) / f.collectedPrev : null;
  const list = state.transactions.filter((t) =>
    filter === "todos" ? true : filter === "reembolso" ? t.kind === "reembolso" : t.status === filter && t.kind !== "reembolso");

  return (
    <>
      <PageHeader
        title="Pagos"
        description="Todo se calcula a partir de las ventas registradas en la demo."
        action={<Button variant="primary" icon={selling ? "x" : "plus"} onClick={() => setSelling((v) => !v)}>{selling ? "Cerrar" : "Registrar venta"}</Button>}
      />
      <p role="note" className="mb-5 flex items-center gap-2 rounded-xl border border-[#F0DDB8] bg-[#FDF6E9] px-3.5 py-2.5 text-[13.5px] font-semibold text-[#7D5210]">
        <Icon name="info" className="size-4 shrink-0" /> Datos ficticios — No se procesan pagos.
      </p>
      {selling && <div className="mb-5"><SellForm onDone={() => setSelling(false)} /></div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Cobrado este mes" value={fmtMoney(f.collectedMonth)} hint={delta === null ? "Sin datos del mes anterior" : `${delta >= 0 ? "+" : ""}${Math.round(delta * 100)}% vs. mismos días del mes anterior`} />
        <Stat label="Pendiente de cobro" value={fmtMoney(f.pendingTotal)} hint={`${f.pendingCount} pago${f.pendingCount === 1 ? "" : "s"}`} onClick={() => setFilter("pendiente")} />
        <Stat label="Renovaciones del mes" value={f.renewalsMonth} hint={`${cap(t.client.many)} que volvieron a comprar`} />
        <Stat label="Descuentos y reembolsos" value={fmtMoney(f.discountsMonth + f.refundsMonth)} hint={`${fmtMoney(f.discountsMonth)} desc. · ${fmtMoney(f.refundsMonth)} reemb.`} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <CardTitle hint="Pagos recibidos por semana, menos reembolsos.">Ingresos por periodo</CardTitle>
          <div className="mt-4 flex h-40 items-end gap-2" role="img" aria-label={`Ingresos de las últimas 8 semanas: ${f.weeks.map((w) => fmtMoney(w.total)).join(", ")}`}>
            {f.weeks.map((w, i) => {
              const top = Math.max(1, ...f.weeks.map((x) => x.total));
              return (
                <div key={w.from} className="flex h-full flex-1 flex-col justify-end gap-1.5">
                  <div className={i === f.weeks.length - 1 ? "rounded-t-md bg-(--os-accent)" : "rounded-t-md bg-(--os-accent)/35"} style={{ height: `${Math.max(3, (Math.max(0, w.total) / top) * 100)}%` }} />
                  <span className="text-center text-[10.5px] text-(--os-muted)">{fmtDate(w.from).split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[12px] text-(--os-muted)">Semana que inicia el día indicado. La última barra es esta semana.</p>
        </Card>
        <Card className="p-4 sm:p-5">
          <CardTitle hint={caps.appointments ? `${cap(t.offering.many)} cobrados y paquetes vendidos este mes.` : "Ventas y renovaciones pagadas este mes."}>{caps.appointments ? "Ventas por concepto" : "Ventas por membresía"}</CardTitle>
          <div className="mt-4">
            {[...f.byService, ...f.byPlan].length ? <Bars label="Ventas por concepto" items={[...f.byService, ...f.byPlan].sort((a, b) => b.total - a.total).slice(0, 6).map((p) => ({ label: p.name, value: p.total }))} format={fmtMoney} /> : <p className="text-sm text-(--os-muted)">Sin ventas este mes.</p>}
          </div>
        </Card>
      </div>

      <div className="mb-3 mt-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold">Movimientos</h3>
        <Segmented label="Filtrar movimientos" value={filter} onChange={setFilter} options={[
          { value: "todos", label: "Todos" }, { value: "pendiente", label: "Pendientes", count: f.pendingCount },
          { value: "pagado", label: "Pagados" }, { value: "reembolso", label: "Reembolsos" },
        ]} />
      </div>
      {list.length ? (
        <Card as="div" className="overflow-hidden">
          <ul className="divide-y divide-(--os-line)">
            {list.slice(0, 40).map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-3 sm:px-4">
                <div className="min-w-0 flex-1 basis-52">
                  <p className="truncate text-sm font-semibold">{studentName(state, t.studentId)}</p>
                  <p className="truncate text-[12.5px] text-(--os-muted)">{t.concept} · {fmtDate(t.at)} · {t.method}{t.discountPct ? ` · ${t.discountPct}% desc.` : ""}</p>
                </div>
                <p className={t.amount < 0 ? "w-24 text-right text-sm font-semibold tabular-nums text-[#962B2B]" : "w-24 text-right text-sm font-semibold tabular-nums"}>{fmtMoney(t.amount)}</p>
                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  {t.kind === "reembolso" ? <Badge tone="danger">Reembolso</Badge> : t.status === "pendiente" ? <Badge tone="warn">Pendiente</Badge> : t.refunded ? <Badge>Reembolsado</Badge> : <Badge tone="success">{t.kind === "renovacion" ? "Renovación" : "Pagado"}</Badge>}
                  {t.status === "pendiente" && <Button size="sm" variant="soft" onClick={() => apply(markPaid(state, t.id))}>Marcar pagado</Button>}
                  {t.status === "pagado" && t.kind !== "reembolso" && !t.refunded && (
                    <ConfirmButton label="Reembolsar" confirmLabel="Sí, reembolsar" variant="ghost" onConfirm={() => apply(refundTransaction(state, t.id))} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Empty icon="wallet" title="Sin movimientos" text="Registra una venta para verla aquí." />
      )}
    </>
  );
}
