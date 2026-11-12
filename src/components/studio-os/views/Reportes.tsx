"use client";

import { stageOrder } from "@/lib/studio-os/catalog";
import { finance, reports } from "@/lib/studio-os/selectors";
import { fmtDate, fmtMoney, fmtPct } from "@/lib/studio-os/time";
import { AreaChart, Ring } from "../charts";
import { useStudio } from "../context";
import { Bars, Card, CardTitle, PageHeader } from "../ui";

function Big({ value, label }: { value: string; label: string }) {
  return (
    <p className="mt-3"><span className="os-num text-[2.2rem] font-medium leading-none">{value}</span><span className="ml-2 text-[13px] text-(--os-muted)">{label}</span></p>
  );
}

export function Reportes() {
  const { state } = useStudio();
  const r = reports(state);
  const f = finance(state);
  const has = (m: string) => state.config.modules.includes(m as never);

  return (
    <>
      <PageHeader title="Reportes" description="Se recalculan con cada reserva, venta o cambio que hagas en la demo." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-4 sm:p-5 md:col-span-2">
          <CardTitle hint="Lugares ocupados ÷ cupo de las clases de esta semana.">Ocupación por clase</CardTitle>
          <div className="mt-4"><Bars label="Ocupación por clase" items={r.occupancy.map((o) => ({ label: o.name, value: Math.round(o.rate * 100), max: 100, note: `${o.booked}/${o.capacity}` }))} format={(n) => `${n}%`} /></div>
        </Card>
        <Card className="p-4 sm:p-5">
          <CardTitle hint="Asistencias ÷ (asistencias + faltas) registradas.">Asistencia</CardTitle>
          <div className="mt-4 flex items-center gap-4">
            <Ring value={Math.round((r.attendanceRate ?? 0) * 100)} max={100} size={84} stroke={7} color="var(--os-sage)"><span className="os-num text-[17px] font-semibold">{r.attendanceRate === null ? "—" : fmtPct(r.attendanceRate)}</span></Ring>
            <p className="text-[13px] text-(--os-muted)">de las reservas registradas terminaron en asistencia.</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-5">
          <CardTitle hint="De quienes tenían paquete hace 30 días, cuántas siguen activas.">Retención</CardTitle>
          <div className="mt-4 flex items-center gap-4">
            <Ring value={r.retention.retained} max={Math.max(1, r.retention.base)} size={84} stroke={7}><span className="os-num text-[17px] font-semibold">{r.retention.rate === null ? "—" : fmtPct(r.retention.rate)}</span></Ring>
            <p className="text-[13px] text-(--os-muted)"><span className="os-num font-semibold text-(--os-ink)">{r.retention.retained} de {r.retention.base}</span> alumnas siguen con paquete vigente.</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-5">
          <CardTitle hint="Reservas de la semana por tipo de clase.">Clases más populares</CardTitle>
          <ol className="mt-3 space-y-2">
            {r.popular.slice(0, 4).map((p, i) => (
              <li key={p.name} className="flex items-center gap-3 text-sm">
                <span className="grid size-6 place-items-center rounded-full bg-(--os-soft) text-[12px] font-semibold text-(--os-accent-ink)">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                <span className="tabular-nums text-(--os-muted)">{p.booked}</span>
              </li>
            ))}
          </ol>
        </Card>
        {has("membresias") && (
          <Card className="p-4 sm:p-5">
            <CardTitle hint="Membresías vigentes por tipo.">Membresías activas</CardTitle>
            <div className="mt-4"><Bars label="Membresías activas" items={r.activeByPlan.map((p) => ({ label: p.name, value: p.count }))} /></div>
          </Card>
        )}
        {has("pagos") && (
          <Card className="p-4 sm:p-5 md:col-span-2">
            <CardTitle hint="Pagos recibidos este mes menos reembolsos (ficticios).">Ingresos simulados</CardTitle>
            <Big value={fmtMoney(f.collectedMonth)} label="este mes" />
            <p className="mt-2 text-[13px] text-(--os-muted)">Mismos días del mes anterior: {fmtMoney(f.collectedPrev)} · Pendiente: {fmtMoney(f.pendingTotal)}</p>
            <div className="mt-4"><AreaChart label="Ingresos por semana" format={fmtMoney} points={f.weeks.map((w) => ({ label: fmtDate(w.from), value: w.total }))} height={170} /></div>
          </Card>
        )}
        {has("marketing") && (
          <Card className="p-4 sm:p-5 md:col-span-2 xl:col-span-1">
            <CardTitle hint={`${r.pendingInquiries} consultas pendientes · ${r.conversion.converted} de ${r.conversion.total} interesados ya son clientes.`}>Conversión de interesados</CardTitle>
            <Big value={r.conversion.rate === null ? "—" : fmtPct(r.conversion.rate)} label="se volvieron clientes" />
            <div className="mt-4"><Bars label="Interesados por etapa" items={stageOrder.map((s) => ({ label: state.settings.stageLabels[s], value: r.leadsByStage[s] ?? 0 }))} /></div>
          </Card>
        )}
      </div>
    </>
  );
}
