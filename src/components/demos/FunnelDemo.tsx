"use client";

import Image from "next/image";
import { useState } from "react";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { photos } from "@/content/photos";
import { cn } from "@/lib/cn";

type StageId = "anuncio" | "pagina" | "consulta" | "seguimiento";

type Scenario = {
  id: string;
  label: string;
  brand: string;
  photo: keyof typeof photos;
  ad: { headline: string; copy: string; cta: string };
  page: { title: string; bullets: string[]; cta: string };
  inquiry: { question: string; answer: string };
  followUp: { stage: string; next: string; note: string };
};

const scenarios: Scenario[] = [
  {
    id: "producto",
    label: "Producto",
    brand: "Marca Ejemplo",
    photo: "marcaSerum",
    ad: { headline: "Tu ritual de noche, en una gota.", copy: "Sérum facial con ingredientes botánicos.", cta: "Conocer el sérum" },
    page: { title: "Sérum Nocturno", bullets: ["Ingredientes explicados", "Cómo usarlo en tu rutina", "Envíos a todo México"], cta: "Tengo una pregunta" },
    inquiry: { question: "¿Lo puedo usar si tengo piel sensible?", answer: "Te comparto la guía de uso y la lista de ingredientes. Si tienes dudas específicas, te contacta nuestro equipo." },
    followUp: { stage: "Interesada · Producto", next: "Enviar guía de uso y muestra", note: "Recordar recompra en 45 días" },
  },
  {
    id: "clase",
    label: "Clase de prueba",
    brand: "Estudio Ejemplo",
    photo: "pilatesEstudio",
    ad: { headline: "Tu primera clase de reformer te espera.", copy: "Clase muestra para nuevos alumnos cerca de ti.", cta: "Reservar clase muestra" },
    page: { title: "Clase muestra de reformer", bullets: ["Horarios de esta semana", "Qué llevar a tu primera clase", "Ubicación y estacionamiento"], cta: "Quiero reservar" },
    inquiry: { question: "Nunca he hecho pilates, ¿puedo ir?", answer: "¡Claro! La clase muestra está pensada para principiantes. ¿Te muestro horarios?" },
    followUp: { stage: "Prospecto · Clase muestra", next: "Confirmar asistencia un día antes", note: "Ofrecer paquete de bienvenida después de la clase" },
  },
  {
    id: "membresia",
    label: "Membresía",
    brand: "Spa Ejemplo",
    photo: "spaAlberca",
    ad: { headline: "Un momento para ti, cada mes.", copy: "Membresía con tratamientos y beneficios exclusivos.", cta: "Ver beneficios" },
    page: { title: "Membresía Calma", bullets: ["Un tratamiento al mes", "Beneficios para invitados", "Sin plazos forzosos (ejemplo)"], cta: "Me interesa" },
    inquiry: { question: "¿Puedo compartir la membresía con mi pareja?", answer: "Hay una opción para invitados. Te explico cómo funciona y te contacta nuestro equipo para personalizarla." },
    followUp: { stage: "Interesado · Membresía", next: "Llamada de bienvenida", note: "Agendar primera visita" },
  },
];

const stages: { id: StageId; label: string; caption: string }[] = [
  { id: "anuncio", label: "Anuncio", caption: "La persona descubre tu marca" },
  { id: "pagina", label: "Página", caption: "Encuentra la información que necesita" },
  { id: "consulta", label: "Consulta", caption: "Pregunta y recibe respuesta" },
  { id: "seguimiento", label: "Seguimiento", caption: "Tu equipo continúa la relación" },
];

export function FunnelDemo({ withObjectives = false, initial = "producto" }: { withObjectives?: boolean; initial?: string }) {
  const [scenarioId, setScenarioId] = useState(initial);
  const [stage, setStage] = useState<StageId>("anuncio");
  const s = scenarios.find((x) => x.id === scenarioId) ?? scenarios[0];
  const stageIndex = stages.findIndex((x) => x.id === stage);
  const photo = photos[s.photo];

  return (
    <div className="space-y-6">
      {withObjectives && (
        <fieldset>
          <legend className="text-eyebrow mb-3 text-current opacity-75">Objetivo de campaña</legend>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((x) => (
              <label
                key={x.id}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 px-5 text-sm font-bold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-suma-orange",
                  scenarioId === x.id ? "border-suma-orange bg-suma-orange text-suma-navy" : "border-current/25 hover:border-current",
                )}
              >
                <input
                  type="radio"
                  name="objetivo"
                  value={x.id}
                  checked={scenarioId === x.id}
                  onChange={() => {
                    setScenarioId(x.id);
                    setStage("anuncio");
                  }}
                  className="sr-only"
                />
                {x.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <ol className="relative grid grid-cols-4 gap-2" aria-label="Etapas del recorrido">
        <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 bg-current opacity-20" />
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] top-5 h-0.5 bg-suma-orange transition-[width] duration-[var(--dur-reveal)] ease-[var(--ease-flow)]"
          style={{ width: `${(stageIndex / (stages.length - 1)) * 75}%` }}
        />
        {stages.map((st, i) => (
          <li key={st.id} className="relative flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => setStage(st.id)}
              aria-current={stage === st.id ? "step" : undefined}
              className="group flex min-h-11 flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "relative z-10 grid size-10 place-items-center rounded-full border-2 font-display text-sm font-bold transition-[background-color,border-color,transform] duration-[var(--dur-panel)]",
                  i <= stageIndex ? "scale-105 border-suma-orange bg-suma-orange text-suma-navy" : "border-current/30 bg-suma-navy text-current group-hover:border-current",
                )}
              >
                {i + 1}
              </span>
              <span className="text-sm font-bold">{st.label}</span>
              <span className="hidden text-xs opacity-70 sm:block">{st.caption}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div key={`${s.id}-${stage}`} className="motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]" aria-live="polite">
          {stage === "anuncio" && (
            <article className="mx-auto max-w-sm overflow-hidden rounded-[1.5rem] bg-suma-cream-soft text-suma-navy shadow-lift">
              <header className="flex items-center gap-2 px-4 py-3">
                <span className="grid size-8 place-items-center rounded-full bg-suma-pink font-display text-sm font-extrabold">{s.brand[0]}</span>
                <span className="text-sm font-bold">
                  {s.brand} <span className="block text-xs font-medium text-suma-navy/60">Publicidad · ejemplo</span>
                </span>
              </header>
              <div className="relative aspect-[4/3]">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 24rem, 90vw" className="object-cover" />
              </div>
              <div className="space-y-2 p-4">
                <p className="font-display text-xl font-bold leading-tight">{s.ad.headline}</p>
                <p className="text-sm text-suma-navy/70">{s.ad.copy}</p>
                <button type="button" onClick={() => setStage("pagina")} className="mt-2 min-h-11 w-full rounded-xl bg-suma-navy text-sm font-bold text-suma-cream hover:bg-suma-purple">
                  {s.ad.cta}
                </button>
              </div>
            </article>
          )}

          {stage === "pagina" && (
            <article className="overflow-hidden rounded-[1.5rem] bg-suma-cream-soft text-suma-navy shadow-lift">
              <div className="flex gap-1.5 border-b border-suma-line px-4 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-2 rounded-full bg-suma-navy/20" />
                ))}
                <span className="ml-3 truncate text-xs text-suma-navy/50">tu-marca.ejemplo / {s.id}</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-[1fr_0.9fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-suma-pink-ink">{s.brand}</p>
                  <p className="mt-1 font-display text-2xl font-extrabold leading-tight">{s.page.title}</p>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {s.page.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-suma-orange" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => setStage("consulta")} className="mt-4 min-h-11 rounded-full bg-suma-navy px-5 text-sm font-bold text-suma-cream hover:bg-suma-purple">
                    {s.page.cta}
                  </button>
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={photo.src} alt="" fill sizes="14rem" className="object-cover" />
                </div>
              </div>
            </article>
          )}

          {stage === "consulta" && (
            <div className="mx-auto max-w-md space-y-3 rounded-[1.5rem] bg-suma-cream-soft p-5 text-suma-navy shadow-lift">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-suma-navy/60">Chat · {s.brand}</p>
              <p className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-lg bg-suma-navy px-4 py-2.5 text-sm text-suma-cream">{s.inquiry.question}</p>
              <p className="w-fit max-w-[90%] rounded-3xl rounded-bl-lg bg-suma-pink/15 px-4 py-2.5 text-sm">{s.inquiry.answer}</p>
              <button type="button" onClick={() => setStage("seguimiento")} className="min-h-11 w-full rounded-full border-2 border-suma-navy/20 text-sm font-bold hover:border-suma-navy">
                Ver cómo continúa →
              </button>
            </div>
          )}

          {stage === "seguimiento" && (
            <div className="rounded-[1.5rem] bg-suma-cream-soft p-5 text-suma-navy shadow-lift">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-suma-purple">CRM · nuevo contacto</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-suma-purple/10 font-display font-bold text-suma-purple">C</span>
                <div>
                  <p className="font-bold">Contacto de ejemplo</p>
                  <p className="text-sm text-suma-navy/65">Origen: anuncio “{s.label.toLowerCase()}”</p>
                </div>
              </div>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                {[
                  ["Etapa", s.followUp.stage],
                  ["Siguiente paso", s.followUp.next],
                  ["Recordatorio", s.followUp.note],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-suma-cream-deep p-3">
                    <dt className="text-xs font-bold text-suma-navy/60">{k}</dt>
                    <dd className="mt-0.5 font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" onClick={() => setStage("anuncio")} className="mt-4 min-h-11 rounded-full px-4 text-sm font-bold text-suma-purple hover:bg-suma-purple/10">
                Ver el recorrido desde el inicio
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="font-display text-2xl font-bold leading-tight">
            {stages[stageIndex].caption}.
          </p>
          <p className="opacity-80">
            {
              {
                anuncio: "La publicidad lleva a las personas adecuadas hacia tu marca, con un mensaje que se ve como tú.",
                pagina: "Tu página convierte el interés en una acción clara: preguntar, reservar o comprar.",
                consulta: "El asistente responde al momento y registra la conversación.",
                seguimiento: "El contacto queda organizado en tu CRM para que nadie se quede sin respuesta.",
              }[stage]
            }
          </p>
          <p className="text-sm font-semibold opacity-70">Marketing, web y CRM trabajando como una sola experiencia.</p>
          <DemoNotice tone="light" />
        </div>
      </div>
    </div>
  );
}
