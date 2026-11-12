"use client";

import { useId, useState, type DragEvent } from "react";
import { stageOrder } from "@/lib/studio-os/catalog";
import { addLead, moveLead, toggleTask } from "@/lib/studio-os/engine";
import { daysBetween, fmtDate } from "@/lib/studio-os/time";
import type { Lead, LeadStage } from "@/lib/studio-os/types";
import { useStudio } from "../context";
import { Icon } from "../icons";
import { Badge, Button, Card, CardTitle, cx, Field, focusRing, inputClass, PageHeader } from "../ui";

const sources: Lead["source"][] = ["Instagram", "WhatsApp", "Recomendación", "Sitio web"];

export function Ventas() {
  const { state, apply } = useStudio();
  const id = useId();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<{ name: string; interest: string; source: Lead["source"] }>({ name: "", interest: state.classTypes[0]?.name ?? "", source: "Instagram" });
  const [open, setOpen] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<LeadStage | null>(null);
  const labels = state.settings.stageLabels;
  const total = state.leads.length;
  const converted = state.leads.filter((l) => l.stage === "cliente" || l.stage === "seguimiento").length;

  const drop = (stage: LeadStage) => (e: DragEvent) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain") || dragging;
    setOver(null);
    setDragging(null);
    if (leadId) apply(moveLead(state, leadId, stage));
  };

  return (
    <>
      <PageHeader
        title="Ventas y seguimiento"
        description={`${total} interesados · ${converted} se volvieron clientes. Mueve cada contacto de etapa; nada se envía.`}
        action={<Button variant="primary" icon={adding ? "x" : "plus"} onClick={() => setAdding((v) => !v)}>{adding ? "Cerrar" : "Nuevo interesado"}</Button>}
      />
      {adding && (
        <Card className="os-fade mb-5 p-4">
          <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-end">
            <Field label="Nombre" htmlFor={`${id}-n`} hint="Usa un nombre ficticio.">
              <input id={`${id}-n`} className={inputClass} maxLength={40} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="off" />
            </Field>
            <Field label="Le interesa" htmlFor={`${id}-i`}>
              <select id={`${id}-i`} className={inputClass} value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
                {state.classTypes.map((c) => <option key={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Llegó por" htmlFor={`${id}-s`}>
              <select id={`${id}-s`} className={inputClass} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as Lead["source"] })}>
                {sources.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Button variant="primary" disabled={!form.name.trim()} onClick={() => { if (apply(addLead(state, form.name, form.interest, form.source))) { setForm({ ...form, name: "" }); setAdding(false); } }}>Agregar</Button>
          </div>
        </Card>
      )}

      <div className="os-scroll-x -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 xl:grid xl:grid-cols-5 xl:overflow-visible">
        {stageOrder.map((stage) => {
          const leads = state.leads.filter((l) => l.stage === stage);
          return (
            <section key={stage} aria-label={labels[stage]}
              onDragOver={(e) => { e.preventDefault(); setOver(stage); }} onDragLeave={() => setOver((s) => (s === stage ? null : s))} onDrop={drop(stage)}
              className={cx("flex w-[78vw] max-w-[19rem] shrink-0 snap-start flex-col rounded-2xl border p-2.5 transition-colors duration-150 sm:w-72 xl:w-auto xl:max-w-none",
                over === stage ? "border-(--os-accent) bg-(--os-soft)/60" : "border-(--os-line) bg-[#F6F2ED]")}>
              <h3 className="flex items-center justify-between px-1.5 pb-2 pt-1 text-[13px] font-semibold">
                {labels[stage]} <span className="rounded-full bg-white px-2 py-0.5 text-[12px] tabular-nums text-(--os-muted)">{leads.length}</span>
              </h3>
              <ul className="space-y-2">
                {leads.map((l) => {
                  const days = Math.max(0, Math.round(daysBetween(l.createdAt, state.now)));
                  const expanded = open === l.id;
                  return (
                    <li key={l.id} draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", l.id); setDragging(l.id); }} onDragEnd={() => { setDragging(null); setOver(null); }}
                      className={cx("rounded-xl border border-(--os-line) bg-white p-3 shadow-[0_1px_1px_rgba(31,28,26,0.04)] transition-opacity duration-150", dragging === l.id && "opacity-50")}>
                      <button type="button" onClick={() => setOpen(expanded ? null : l.id)} aria-expanded={expanded} className={cx("w-full rounded-md text-left", focusRing)}>
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold">{l.name}</span>
                          <Icon name="chevronRight" className={cx("mt-0.5 size-4 shrink-0 text-(--os-muted) transition-transform duration-150", expanded && "rotate-90")} />
                        </span>
                        <span className="mt-0.5 block text-[12.5px] text-(--os-muted)">{l.interest} · {days === 0 ? "hoy" : `hace ${days} d`}</span>
                      </button>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge>{l.source}</Badge>
                        {l.studentId && <Badge tone="success">Alumna</Badge>}
                      </div>
                      {expanded && (
                        <ol className="os-fade mt-3 space-y-1.5 border-t border-(--os-line) pt-2 text-[12.5px]">
                          {l.history.map((h, i) => <li key={i}><span className="text-(--os-muted)">{fmtDate(h.at)} · </span>{h.text}</li>)}
                        </ol>
                      )}
                      <label className="mt-2.5 block">
                        <span className="sr-only">Mover a {l.name} a otra etapa</span>
                        <select value="" onChange={(e) => e.target.value && apply(moveLead(state, l.id, e.target.value as LeadStage))}
                          className={cx(inputClass, "h-9 text-[13px] sm:text-[13px]")}>
                          <option value="">Mover a…</option>
                          {stageOrder.filter((s) => s !== stage).map((s) => <option key={s} value={s}>{labels[s]}</option>)}
                        </select>
                      </label>
                    </li>
                  );
                })}
                {!leads.length && <li className="rounded-xl border border-dashed border-(--os-line) px-3 py-5 text-center text-[12.5px] text-(--os-muted)">Arrastra aquí o usa “Mover a…”.</li>}
              </ul>
            </section>
          );
        })}
      </div>

      <Card className="mt-6 p-4 sm:p-5">
        <CardTitle hint="Se crean solas al mover a un interesado; no se envía ningún mensaje.">Tareas de seguimiento</CardTitle>
        <ul className="mt-2 grid gap-x-6 sm:grid-cols-2">
          {state.tasks.slice(0, 10).map((t) => (
            <li key={t.id}>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm">
                <input type="checkbox" checked={t.done} onChange={() => apply(toggleTask(state, t.id))} className="mt-0.5 size-[18px] accent-(--os-accent)" />
                <span className={cx("min-w-0 flex-1", t.done && "text-(--os-muted) line-through")}>{t.text}<span className="block text-[12px] text-(--os-muted)">Para el {fmtDate(t.due)}</span></span>
              </label>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
