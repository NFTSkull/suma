"use client";

import { useId, useState } from "react";
import { integrationOptions, studioDisplayName } from "@/lib/studio-os/catalog";
import { updateConfig } from "@/lib/studio-os/engine";
import { configSummary, proposalWhatsAppHref } from "@/lib/studio-os/summary";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Button, Card, CardTitle, cx, Field, focusRing, inputClass, PageHeader } from "../ui";

export function Resumen() {
  const { state, apply, logo } = useStudio();
  const id = useId();
  const [copied, setCopied] = useState<"ok" | "error" | null>(null);
  const summary = configSummary(state);
  const toggleIntegration = (name: string) =>
    apply(updateConfig(state, { integrations: state.config.integrations.includes(name) ? state.config.integrations.filter((x) => x !== name) : [...state.config.integrations, name] }), { quiet: true });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary.text);
      setCopied("ok");
    } catch {
      setCopied("error");
    }
  };

  return (
    <>
      <PageHeader title="Así quedaría tu sistema" description="Un resumen de lo que configuraste para pedir una propuesta. No incluye precios: SUMA los define después de revisar tu caso." />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 bg-(--os-soft) px-5 py-4">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- imagen local en memoria
              <img src={logo} alt="" className="size-10 rounded-lg bg-white object-contain p-1" />
            ) : <span aria-hidden="true" className="grid size-10 place-items-center rounded-lg bg-(--os-accent) font-bold text-white">{studioDisplayName(state.config)[0]}</span>}
            <div>
              <p className="os-display text-[1.35rem] leading-tight">{studioDisplayName(state.config)}</p>
              <p className="text-[13px] text-(--os-accent-ink)">SUMA Studio OS · configuración de la demo</p>
            </div>
          </div>
          <dl className="divide-y divide-(--os-line)">
            {summary.sections.map((sec) => (
              <div key={sec.label} className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
                <dt className="text-[13px] font-semibold text-(--os-muted)">{sec.label}</dt>
                <dd className="text-sm">{sec.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="space-y-4">
          <Card className="p-4 sm:p-5">
            <CardTitle hint="Marca las que te gustaría conectar en tu sistema real. En la demo no se conecta nada.">Integraciones que necesitarías</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {integrationOptions.map((name) => {
                const on = state.config.integrations.includes(name);
                return (
                  <button key={name} type="button" aria-pressed={on} onClick={() => toggleIntegration(name)}
                    className={cx("inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-150", focusRing,
                      on ? "border-(--os-accent) bg-(--os-soft) text-(--os-accent-ink)" : "border-(--os-line) text-(--os-muted) hover:text-(--os-ink)")}>
                    {on && <Icon name="check" className="size-3.5" />}{name}
                  </button>
                );
              })}
            </div>
            <Field label="Necesidades adicionales" htmlFor={`${id}-needs`} hint="Sin datos personales de alumnas." className="mt-4">
              <textarea id={`${id}-needs`} rows={3} maxLength={400} className={cx(inputClass, "h-auto py-2.5")} value={state.config.needs}
                placeholder="Ej. Tengo dos sucursales y quiero cobrar en línea." onChange={(e) => apply(updateConfig(state, { needs: e.target.value }), { quiet: true })} />
            </Field>
          </Card>

          <Card className="p-4 sm:p-5">
            <a href={proposalWhatsAppHref(state)} target="_blank" rel="noopener noreferrer"
              className={cx("flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--os-accent) px-5 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-(--os-hover)", focusRing)}>
              Solicitar propuesta personalizada <Icon name="arrowRight" className="size-[18px]" />
            </a>
            <p className="mt-2 text-center text-[12.5px] text-(--os-muted)">Abre WhatsApp con este resumen para que lo revises. No se envía nada automáticamente.</p>
            <Button className="mt-3 w-full" icon={copied === "ok" ? "check" : "copy"} onClick={copy}>{copied === "ok" ? "Resumen copiado" : "Copiar resumen"}</Button>
            <p role="status" className="mt-2 min-h-5 text-center text-[12.5px] text-(--os-muted)">
              {copied === "error" ? "Tu navegador no permitió copiar; selecciona el texto del resumen." : ""}
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
