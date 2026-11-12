"use client";

import { automationCatalog } from "@/lib/studio-os/catalog";
import { runAutomation, toggleAutomation } from "@/lib/studio-os/engine";
import { previewAutomation } from "@/lib/studio-os/selectors";
import { fmtRelative } from "@/lib/studio-os/time";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Button, Card, cx, PageHeader, Switch } from "../ui";

export function Automatizaciones() {
  const { state, apply } = useStudio();
  return (
    <>
      <PageHeader title="Automatizaciones" description="Reglas de ejemplo: “Cuando pase X → hacer Y”. Actívalas y simula qué harían con tus datos de hoy." />
      <p role="note" className="mb-5 flex items-start gap-2 rounded-xl border border-[#F0DDB8] bg-[#FDF6E9] px-3.5 py-2.5 text-[13.5px] text-[#7D5210]">
        <Icon name="info" className="mt-0.5 size-4 shrink-0" />
        <span><strong>Simulación.</strong> No hay WhatsApp, correo ni otro servicio conectado: nada se envía. Solo verás qué se prepararía y las tareas que se crearían.</span>
      </p>
      <ul className="grid gap-3 lg:grid-cols-2">
        {state.automations.map((a) => {
          const info = automationCatalog[a.id];
          const targets = previewAutomation(state, a.id);
          return (
            <li key={a.id}>
              <Card as="article" className={cx("p-4 transition-colors duration-200 sm:p-5", !a.enabled && "bg-[#FBFAF8]")}>
                <Switch checked={a.enabled} onChange={() => apply(toggleAutomation(state, a.id))} label={info.name} description={a.enabled ? "Activa" : "Desactivada"} />
                <div className="mt-4 flex items-stretch gap-2 text-[13px]">
                  <span className="flex-1 rounded-xl bg-(--os-subtle) px-3 py-2.5"><span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-(--os-muted)">Cuando</span>{info.when}</span>
                  <span aria-hidden="true" className="grid place-items-center text-(--os-muted)"><Icon name="arrowRight" className="size-4" /></span>
                  <span className="flex-1 rounded-xl bg-(--os-soft) px-3 py-2.5 text-(--os-accent-ink)"><span className="block text-[11px] font-semibold uppercase tracking-[0.06em]">Hacer</span>{info.then}</span>
                </div>
                <p className="mt-3 text-[13px] text-(--os-muted)">
                  Hoy aplicaría a <strong className="text-(--os-ink)">{targets.length}</strong>{targets.length ? `: ${targets.slice(0, 3).map((t) => t.name.split(" ")[0]).join(", ")}${targets.length > 3 ? ` y ${targets.length - 3} más` : ""}` : "."}
                  {a.lastRun && <> · Última simulación {fmtRelative(a.lastRun, state.now)}</>}
                </p>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" variant={a.enabled ? "primary" : "secondary"} icon="play" disabled={!a.enabled} onClick={() => apply(runAutomation(state, a.id))}>Simular ahora</Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
