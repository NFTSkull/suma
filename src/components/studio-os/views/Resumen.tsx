"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { integrationOptions, studioDisplayName } from "@/lib/studio-os/catalog";
import { updateConfig } from "@/lib/studio-os/engine";
import { configSummary, proposalWhatsAppHref } from "@/lib/studio-os/summary";
import { verticalOf } from "@/lib/studio-os/verticals";
import { Monogram } from "../brand";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { ease } from "../motion";
import { Button, Card, CardTitle, cx, Field, focusRing, inputClass, PageHeader } from "../ui";

export function Resumen() {
  const { state, apply, logo } = useStudio();
  const id = useId();
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState<"ok" | "error" | null>(null);
  const summary = configSummary(state);
  const name = studioDisplayName(state.config);
  const toggleIntegration = (x: string) =>
    apply(updateConfig(state, { integrations: state.config.integrations.includes(x) ? state.config.integrations.filter((y) => y !== x) : [...state.config.integrations, x] }), { quiet: true });
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
      <PageHeader eyebrow="Así quedaría" title={<>Tu sistema, <em>hecho a la medida</em></>}
        description="Un resumen de lo que diseñaste para pedir una propuesta. SUMA define precios y alcance después de revisar tu caso." />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-4 bg-(--os-accent) px-5 py-5 text-white sm:px-6">
              <Monogram name={name} logo={logo} size={52} tone="ivory" />
              <div className="min-w-0">
                <p className="os-display truncate text-[1.6rem] leading-tight">{name}</p>
                <p className="text-[13px] text-white/80">{verticalOf(state.config).name} · SUMA Wellness OS</p>
              </div>
            </div>
            <dl className="divide-y divide-(--os-line)">
              {summary.sections.map((sec) => (
                <div key={sec.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4 sm:px-6">
                  <dt className="text-[13px] font-semibold text-(--os-muted)">{sec.label}</dt>
                  <dd className="text-[14px]">{sec.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-5">
              <CardTitle hint="Lo probaste aquí con datos ficticios.">Funciona en la demo</CardTitle>
              <ul className="mt-3 space-y-2">
                {summary.included.map((x) => <li key={x} className="flex gap-2 text-[13.5px]"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-(--os-success)" />{x}</li>)}
              </ul>
            </Card>
            <Card className="p-5">
              <CardTitle hint="Lo que tu sistema real ganaría.">Beneficios operativos</CardTitle>
              <ul className="mt-3 space-y-2">
                {summary.benefits.map((x) => <li key={x} className="flex gap-2 text-[13.5px]"><Icon name="sparkle" className="mt-0.5 size-4 shrink-0 text-(--os-accent-ink)" />{x}</li>)}
              </ul>
              {summary.additional.length > 0 && (
                <>
                  <p className="mt-4 text-[13px] font-semibold">Módulos que podrías sumar</p>
                  <p className="mt-1 text-[13px] text-(--os-muted)">{summary.additional.join(" · ")}</p>
                </>
              )}
            </Card>
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-0">
          <Card className="p-5">
            <CardTitle hint="Se desarrollarían para tu sistema real. En la demo ninguna está conectada.">Integraciones a cotizar</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {integrationOptions.map((x) => {
                const on = state.config.integrations.includes(x);
                return (
                  <button key={x} type="button" aria-pressed={on} onClick={() => toggleIntegration(x)}
                    className={cx("inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-150", focusRing,
                      on ? "border-(--os-accent) bg-(--os-soft) text-(--os-accent-ink)" : "border-(--os-line) text-(--os-muted) hover:text-(--os-ink)")}>
                    <Icon name={on ? "check" : "plus"} className="size-3.5" />{x}
                  </button>
                );
              })}
            </div>
            <Field label="¿Algo más que necesites?" htmlFor={`${id}-needs`} hint="Sin datos personales de tus clientes." className="mt-4">
              <textarea id={`${id}-needs`} rows={3} maxLength={400} className={cx(inputClass, "h-auto py-2.5")} value={state.config.needs}
                placeholder="Ej. Tengo dos sucursales y quiero cobrar en línea." onChange={(e) => apply(updateConfig(state, { needs: e.target.value }), { quiet: true })} />
            </Field>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-5">
              <p className="os-display text-[1.35rem] leading-tight">¿Te imaginas trabajando así?</p>
              <p className="mt-1 text-[13.5px] text-(--os-muted)">Preparamos un resumen de tu configuración para que SUMA te haga una propuesta.</p>
              <Button variant="dark" size="lg" className="mt-4 w-full" iconRight="arrowRight" aria-expanded={prepared} onClick={() => setPrepared(true)}>Quiero una propuesta para mi negocio</Button>
            </div>
            <AnimatePresence initial={false}>
              {prepared && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden border-t border-(--os-line) bg-(--os-ivory)/70">
                  <div className="p-5">
                    <p className="text-[13px] font-semibold">Tu resumen está listo</p>
                    <pre className="os-scroll-y mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl border border-(--os-line) bg-(--os-paper) p-3 font-sans text-[12.5px] leading-relaxed text-(--os-ink-2)">{summary.text}</pre>
                    <a href={proposalWhatsAppHref(state)} target="_blank" rel="noopener noreferrer"
                      className={cx("mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-(--os-accent) px-5 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-(--os-hover)", focusRing)}>
                      <Icon name="whatsapp" className="size-[18px]" /> Enviar a SUMA por WhatsApp
                    </a>
                    <p className="mt-2 text-center text-[12px] text-(--os-muted)">Se abre WhatsApp con este texto para que lo revises. Nada se envía automáticamente.</p>
                    <Button className="mt-2 w-full" variant="secondary" icon={copied === "ok" ? "check" : "copy"} onClick={copy}>{copied === "ok" ? "Resumen copiado" : "Copiar resumen"}</Button>
                    <p role="status" className="mt-2 min-h-5 text-center text-[12px] text-(--os-muted)">{copied === "error" ? "Tu navegador no permitió copiar; selecciona el texto del resumen." : ""}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </>
  );
}
