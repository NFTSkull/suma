"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { automationCopy } from "@/lib/studio-os/catalog";
import { runAutomation, toggleAutomation } from "@/lib/studio-os/engine";
import { previewAutomation } from "@/lib/studio-os/selectors";
import { fmtRelative } from "@/lib/studio-os/time";
import type { AutomationId } from "@/lib/studio-os/types";
import { useStudio } from "../context";
import { Icon, type IconName } from "../icons";
import { ease } from "../motion";
import { Badge, Button, Card, cx, focusRing, PageHeader } from "../ui";

const triggerIcon: Record<AutomationId, IconName> = {
  vencimiento: "card", bienvenida: "user", lugar_liberado: "users", inactiva: "clock", clase_cancelada: "x", sin_reserva: "funnel",
  confirmacion: "check", recordatorio: "calendar", seguimiento_visita: "leaf", reactivacion: "restore", renovacion_paquete: "card",
};

/**
 * CUANDO sucede algo → EL SISTEMA prepara una acción.
 * Cada regla se puede activar y simular con los datos de hoy. Nada se envía.
 */
export function Automatizaciones() {
  const { state, apply, t } = useStudio();
  const [open, setOpen] = useState<AutomationId | null>(null);
  const log = state.activity.filter((a) => a.kind === "automatizacion").slice(0, 5);
  const active = state.automations.filter((a) => a.enabled).length;

  return (
    <>
      <PageHeader eyebrow={`${active} de ${state.automations.length} activas`} title="Automatizaciones"
        description={`Reglas pensadas para tu ${t.business}: cuando pasa algo, el sistema prepara la acción por ti. Actívalas y simula qué harían hoy.`} />
      <p role="note" className="mb-6 flex items-start gap-2.5 rounded-2xl border border-[#F0DDB8] bg-(--os-warn-soft) px-4 py-3 text-[13.5px] text-(--os-warn)">
        <Icon name="info" className="mt-0.5 size-4 shrink-0" />
        <span><strong>Simulación.</strong> No hay WhatsApp, correo ni otro servicio conectado: nada se envía. Verás qué se prepararía y las tareas que se crearían. Conectar un canal real sería una integración a cotizar.</span>
      </p>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ul className="grid gap-3">
          {state.automations.map((a) => {
            const info = automationCopy(a.id, t);
            const targets = previewAutomation(state, a.id);
            const expanded = open === a.id;
            return (
              <li key={a.id}>
                <Card as="article" className={cx("overflow-hidden transition-colors duration-300", !a.enabled && "bg-(--os-ivory)/70")}>
                  <div className="flex items-center gap-3 px-5 pt-5">
                    <p className="min-w-0 flex-1 text-[15.5px] font-semibold">{info.name}</p>
                    <button type="button" role="switch" aria-checked={a.enabled} aria-label={`${info.name}: ${a.enabled ? "activa" : "desactivada"}`} onClick={() => apply(toggleAutomation(state, a.id))}
                      className={cx("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300", focusRing, a.enabled ? "bg-(--os-accent)" : "bg-(--os-line-strong)")}>
                      <span className={cx("absolute top-1 size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", a.enabled ? "translate-x-6" : "translate-x-1")} />
                    </button>
                  </div>
                  <div className="grid items-stretch gap-2 px-5 pt-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                    <div className="flex items-start gap-3 rounded-2xl bg-(--os-subtle) p-3.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-(--os-paper) text-(--os-ink-2) shadow-[0_1px_2px_rgba(29,27,25,0.06)]"><Icon name={triggerIcon[a.id]} className="size-[18px]" /></span>
                      <span><span className="os-eyebrow block !text-[10px] text-(--os-muted)">Cuando</span><span className="text-[13.5px] leading-snug">{info.when}</span></span>
                    </div>
                    <span aria-hidden="true" className="grid place-items-center text-(--os-faint) max-sm:rotate-90"><Icon name="arrowRight" className="size-5" /></span>
                    <div className={cx("flex items-start gap-3 rounded-2xl p-3.5 transition-colors duration-300", a.enabled ? "bg-(--os-soft) text-(--os-accent-ink)" : "bg-(--os-subtle) text-(--os-muted)")}>
                      <span className={cx("grid size-9 shrink-0 place-items-center rounded-xl", a.enabled ? "bg-(--os-accent) text-white" : "bg-(--os-paper)")}><Icon name="bolt" className="size-[18px]" /></span>
                      <span><span className="os-eyebrow block !text-[10px]">El sistema prepara</span><span className="text-[13.5px] leading-snug">{info.then}</span></span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 px-5 pb-5 pt-4">
                    <button type="button" onClick={() => setOpen(expanded ? null : a.id)} aria-expanded={expanded} disabled={!targets.length}
                      className={cx("min-w-0 flex-1 rounded-lg text-left text-[13px] text-(--os-muted) disabled:cursor-default", focusRing)}>
                      Hoy aplicaría a <strong className="os-num text-(--os-ink)">{targets.length}</strong>
                      {targets.length > 0 && <span className="ml-1 font-semibold text-(--os-accent-ink) underline-offset-4 hover:underline">{expanded ? "Ocultar" : "Ver a quién"}</span>}
                      {a.lastRun && <span className="block text-[12px]">Última simulación {fmtRelative(a.lastRun, state.now)}</span>}
                    </button>
                    <Button size="sm" variant={a.enabled ? "primary" : "secondary"} icon="play" disabled={!a.enabled} onClick={() => apply(runAutomation(state, a.id))}>Simular ahora</Button>
                  </div>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}
                        className="overflow-hidden border-t border-(--os-line) bg-(--os-ivory)/60">
                        {targets.slice(0, 6).map((x, i) => (
                          <li key={x.name + i} className="flex items-center justify-between gap-3 px-5 py-2.5 text-[13px]">
                            <span className="font-medium">{x.name}</span><span className="truncate text-(--os-muted)">{x.detail}</span>
                          </li>
                        ))}
                        {targets.length > 6 && <li className="px-5 pb-3 text-[12.5px] text-(--os-muted)">y {targets.length - 6} más</li>}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </Card>
              </li>
            );
          })}
        </ul>

        <aside className="xl:sticky xl:top-0 xl:self-start">
          <Card className="p-5">
            <p className="text-[15px] font-semibold">Lo que se preparó</p>
            <p className="mt-0.5 text-[13px] text-(--os-muted)">Resultado de tus simulaciones. Nada sale del sistema.</p>
            {log.length ? (
              <ol className="mt-4 space-y-3">
                {log.map((l) => (
                  <li key={l.id} className="text-[13px]">
                    <span className="block">{l.text}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-(--os-muted)">{fmtRelative(l.at, state.now)} <Badge tone="warn" className="!py-0 !text-[10.5px]">Simulado</Badge></span>
                  </li>
                ))}
              </ol>
            ) : <p className="mt-4 text-[13px] text-(--os-muted)">Activa una regla y pulsa “Simular ahora”.</p>}
          </Card>
        </aside>
      </div>
    </>
  );
}
