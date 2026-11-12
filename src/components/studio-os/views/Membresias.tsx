"use client";

import { useState } from "react";
import { pauseMembership, renewMembership, resumeMembership } from "@/lib/studio-os/engine";
import { membershipStatus, type MembershipStatus } from "@/lib/studio-os/rules";
import { currentMembership, planName, statusLabel } from "@/lib/studio-os/selectors";
import { fmtDate, fmtMoney } from "@/lib/studio-os/time";
import { useStudio } from "../context";
import { Avatar, Badge, Button, Card, cx, Empty, focusRing, Meter, PageHeader, Segmented } from "../ui";
import { SellForm, statusTone } from "./shared";

type Filter = "por_vencer" | "activa" | "pausada" | "vencida" | "todas";

export function Membresias() {
  const { state, apply, go } = useStudio();
  const [filter, setFilter] = useState<Filter>("por_vencer");
  const [selling, setSelling] = useState(false);
  const rows = state.students
    .map((s) => ({ s, m: currentMembership(state, s.id) }))
    .filter((x): x is { s: typeof x.s; m: NonNullable<typeof x.m> } => !!x.m)
    .map((x) => ({ ...x, status: membershipStatus(x.m, state.now, state.settings.expiryWarningDays) }));
  const matches = (f: Filter, st: MembershipStatus) =>
    f === "todas" || (f === "activa" ? st === "activa" : f === "por_vencer" ? st === "por_vencer" || st === "agotada" : st === f);
  const list = rows.filter((r) => matches(filter, r.status)).sort((a, b) => a.m.end.localeCompare(b.m.end));
  const activeCount = (planId: string) => rows.filter((r) => r.m.planId === planId && (r.status === "activa" || r.status === "por_vencer")).length;

  return (
    <>
      <PageHeader
        title="Membresías"
        description="Paquetes, créditos y vencimientos. Lo que cambies aquí se refleja en fichas, reservas y reportes."
        action={<Button variant="primary" icon={selling ? "x" : "plus"} onClick={() => setSelling((v) => !v)}>{selling ? "Cerrar" : "Vender paquete"}</Button>}
      />
      {selling && <div className="mb-5"><SellForm onDone={() => setSelling(false)} /></div>}

      <div className="os-scroll-x -mx-4 mb-6 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {state.plans.filter((p) => p.enabled).map((p) => (
          <Card key={p.id} className="min-w-[13.5rem] shrink-0 p-4">
            <p className="text-sm font-semibold">{p.name}</p>
            <p className="mt-1 text-[1.35rem] font-semibold tabular-nums">{fmtMoney(p.price)}</p>
            <p className="text-[12.5px] text-(--os-muted)">{p.credits === null ? "Clases ilimitadas" : `${p.credits} clase${p.credits === 1 ? "" : "s"}`} · {p.validityDays} días</p>
            <p className="mt-2 text-[12.5px]"><span className="font-semibold tabular-nums">{activeCount(p.id)}</span> activas</p>
          </Card>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Segmented label="Filtrar membresías" value={filter} onChange={setFilter} options={[
          { value: "por_vencer", label: "Por vencer", count: rows.filter((r) => matches("por_vencer", r.status)).length },
          { value: "activa", label: "Activas", count: rows.filter((r) => r.status === "activa").length },
          { value: "pausada", label: "Pausadas", count: rows.filter((r) => r.status === "pausada").length },
          { value: "vencida", label: "Vencidas", count: rows.filter((r) => r.status === "vencida").length },
          { value: "todas", label: "Todas", count: rows.length },
        ]} />
        <p className="text-[12.5px] text-(--os-muted)">Precios de ejemplo de tu estudio. Se editan en Personalizar.</p>
      </div>

      {list.length ? (
        <Card as="div" className="overflow-hidden">
          <ul className="divide-y divide-(--os-line)">
            {list.map(({ s, m, status }) => (
              <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-3 py-3 sm:px-4">
                <button type="button" onClick={() => go("alumnas", s.id)} className={cx("flex min-w-0 flex-1 basis-56 items-center gap-3 rounded-lg text-left", focusRing)}>
                  <Avatar name={s.name} hue={s.hue} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{s.name}</span>
                    <span className="block truncate text-[12.5px] text-(--os-muted)">{planName(state, m.planId)} · {status === "vencida" ? "venció" : "vence"} el {fmtDate(m.end)}</span>
                  </span>
                </button>
                <div className="w-28 shrink-0">
                  {m.creditsTotal === null ? <p className="text-[12.5px] text-(--os-muted)">Ilimitado</p> : (
                    <>
                      <p className="text-[12.5px] tabular-nums text-(--os-muted)">{m.creditsTotal - m.creditsUsed} de {m.creditsTotal} libres</p>
                      <Meter value={m.creditsUsed} max={m.creditsTotal} label="Créditos usados" />
                    </>
                  )}
                </div>
                <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
                <div className="flex gap-1.5">
                  {status !== "pausada" && <Button size="sm" onClick={() => apply(renewMembership(state, m.id))}>Renovar</Button>}
                  {m.status === "activa" && status !== "vencida" && <Button size="sm" variant="ghost" onClick={() => apply(pauseMembership(state, m.id, 14))}>Pausar</Button>}
                  {m.status === "pausada" && <Button size="sm" variant="soft" onClick={() => apply(resumeMembership(state, m.id))}>Reactivar</Button>}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Empty icon="card" title="Nada en esta lista" text={filter === "por_vencer" ? "Ninguna membresía vence pronto." : "Prueba otro filtro."} />
      )}
    </>
  );
}
