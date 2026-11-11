"use client";

import { useEffect, useRef, useState } from "react";
import { showroomWhatsAppAttrs, track } from "@/lib/analytics";
import { formatMXN } from "@/lib/pricing";
import { calculateShowroomImpact, impactSample, impactScenarios, type ImpactInputs, type ImpactScenario } from "@/lib/showroom-impact";
import { showroomWhatsAppHref, type ShowroomSelection, type showroomEstimate } from "@/lib/showroom";
import { cn } from "@/lib/cn";

type Props = {
  selection: ShowroomSelection;
  quote: ReturnType<typeof showroomEstimate>;
  /** Periodo compartido con la propuesta: cambiarlo aquí también cambia el cotizador. */
  onMonthsChange?: (months: number) => void;
};

const inputStyle = "mt-2 h-12 w-full min-w-0 rounded-xl border border-suma-line bg-white px-3 text-base font-semibold text-suma-navy outline-offset-2 focus-visible:outline-2 focus-visible:outline-suma-orange";
const pill = "min-h-11 min-w-0 rounded-full border px-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-suma-orange sm:px-3 sm:text-sm";
const formatDecimal = (number: number, max = 1) => new Intl.NumberFormat("es-MX", { maximumFractionDigits: max }).format(number);
const PERIODS = [1, 3, 6, 12] as const;

type Field = { key: keyof ImpactInputs; label: string; hint: string; max: number; suffix?: string };

const formFields: Field[] = [
  { key: "leadsPerMonth", label: "Consultas nuevas al mes", hint: "Mensajes o interesados únicos, no seguidores.", max: 1000000 },
  { key: "unansweredPct", label: "% que queda sin respuesta o seguimiento", hint: "Tu mejor estimación.", max: 100, suffix: "%" },
  { key: "revenuePerClient", label: "Ingreso por cliente nuevo (MXN)", hint: "Solo la primera compra, sin contar pagos futuros.", max: 100000000 },
  { key: "contributionMarginPct", label: "Margen que te queda (%)", hint: "Lo que queda tras costos variables (instructor, insumos).", max: 100, suffix: "%" },
];

const advancedFields: Field[] = [
  { key: "recoveryPct", label: "Consultas sin respuesta que recuperarías (%)", hint: "Hipótesis propia, no un promedio de mercado.", max: 100, suffix: "%" },
  { key: "conversionPct", label: "De las recuperadas, cuántas compran (%)", hint: "Usa tu tasa real si la conoces.", max: 100, suffix: "%" },
  { key: "capacity", label: "Lugares libres para clientes nuevos al mes", hint: "Limita la estimación a lo que puedes atender.", max: 1000000 },
  { key: "manualTasksPerMonth", label: "Tareas repetitivas al mes", hint: "Respuestas, recordatorios o seguimientos.", max: 1000000 },
  { key: "minutesSavedPerTask", label: "Minutos que ahorrarías por tarea", hint: "Se valida midiendo antes y después.", max: 1440 },
  { key: "hourlyCost", label: "Valor de una hora de tu equipo (MXN)", hint: "Sirve para valorar el tiempo; no es ahorro de nómina.", max: 1000000 },
];

function OriginTag({ edited }: { edited: boolean }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide",
        edited ? "bg-emerald-100 text-emerald-800" : "bg-suma-cream-deep text-suma-navy/70",
      )}
    >
      {edited ? "Tu dato" : "Ejemplo"}
    </span>
  );
}

export function ShowroomImpacto({ selection, quote, onMonthsChange }: Props) {
  const [inputs, setInputs] = useState<ImpactInputs>(impactSample);
  const [edited, setEdited] = useState<ReadonlySet<keyof ImpactInputs>>(new Set());
  const [scenario, setScenario] = useState<ImpactScenario>("base");
  const outcome = calculateShowroomImpact(inputs, quote, scenario);
  const comparable = !quote.isEmpty;
  const followupServices = ["crm-gestionado", "crm-medida", "chatbot-guiado", "chatbot-ia", "automatizacion"];
  const hasFollowupScope =
    (selection.mode === "package" && (selection.planId === "flow" || selection.planId === "growth")) ||
    selection.serviceIds.some((service) => followupServices.includes(service));
  // Solo los módulos que atienden o dan seguimiento recuperan consultas; el resto no se compara contra este beneficio.
  const attributable = comparable && hasFollowupScope;
  const recurringCovered = attributable && outcome.marginContribution >= outcome.costMonthly;
  const feeLabel = quote.hasAds ? "Mensualidad SUMA + pauta" : "Mensualidad SUMA";
  const recoveryRate = Math.min(100, inputs.recoveryPct * impactScenarios[scenario].factor);
  const editedBasics = formFields.filter((field) => edited.has(field.key)).length;

  const signed = (value: number) => (value >= 0 ? "+" : "") + formatMXN(value);
  const periodLabel = outcome.months === 1 ? "1 mes" : outcome.months + " meses";
  const shareSummary = "Escenario " + impactScenarios[scenario].label.toLowerCase() + " (supuestos por validar): " +
    formatDecimal(outcome.additionalClients) + " clientes nuevos/mes estimados, " + formatMXN(outcome.addedRevenue) + " de ingresos, " +
    formatMXN(outcome.marginContribution) + " de margen" + (attributable
      ? "; " + feeLabel + " " + formatMXN(outcome.costMonthly) + "; diferencia de " + signed(outcome.monthlyNet) +
        "/mes; balance en " + periodLabel + " tras implementación: " + signed(outcome.netOverPeriod) + "."
      : " si se atienden las consultas sin respuesta; mi selección actual no incluye seguimiento.");
  const shareHref = showroomWhatsAppHref({ ...selection, impactSummary: shareSummary }, "impact");

  // GA4: un solo evento por visita, con el estado ya asentado tras la primera interacción.
  const latest = useRef({ scenario, months: outcome.months, own: edited.size });
  useEffect(() => {
    latest.current = { scenario, months: outcome.months, own: edited.size };
  }, [scenario, outcome.months, edited.size]);
  const impactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (impactTimer.current) clearTimeout(impactTimer.current);
  }, []);
  const impactSent = useRef(false);
  const markUsed = () => {
    if (impactSent.current) return;
    impactSent.current = true;
    impactTimer.current = setTimeout(() => {
      const { scenario: s, months: m, own } = latest.current;
      track({ event: "showroom_impact_used", scenario: s, months: m, own_data_count: own });
    }, 1500);
  };

  const update = (key: keyof ImpactInputs, value: number) => {
    markUsed();
    setEdited((prev) => new Set(prev).add(key));
    setInputs((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : 0 }));
  };
  const restore = () => {
    setInputs(impactSample);
    setEdited(new Set());
    setScenario("base");
  };

  const fields = (items: Field[]) => items.map((item) => (
    <div key={item.key}>
      <div className="flex items-start justify-between gap-2">
        <label htmlFor={"impact-" + item.key} className="text-sm font-bold text-suma-navy">{item.label}</label>
        <OriginTag edited={edited.has(item.key)} />
      </div>
      <input
        id={"impact-" + item.key}
        type="number"
        inputMode="decimal"
        min={0}
        max={item.max}
        value={inputs[item.key]}
        onChange={(event) => update(item.key, Number(event.target.value))}
        className={inputStyle}
      />
      <p className="mt-1.5 text-xs leading-relaxed text-suma-navy/60">{item.hint}</p>
    </div>
  ));

  const paybackText = outcome.setup === 0
    ? "Esta selección no tiene costo de implementación."
    : outcome.paybackMonths === null
      ? "Con estos supuestos, la implementación no se recuperaría."
      : "La implementación se recuperaría en ~" + outcome.paybackMonths + (outcome.paybackMonths === 1 ? " mes" : " meses") + " si el resultado estimado se mantuviera.";

  return (
    <section id="showroom-impacto" aria-labelledby="showroom-impact-title" className="overflow-clip rounded-[2rem] border border-suma-line bg-suma-cream-soft shadow-soft">
      <div className="relative overflow-hidden bg-suma-navy px-5 py-8 text-suma-cream md:px-9 md:py-10">
        <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-36 size-80 rounded-full bg-suma-orange/15 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-eyebrow text-suma-orange">03 · Calcula con tus números</p>
            <h2 id="showroom-impact-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">¿Qué tendría que pasar para que esta inversión te convenga?</h2>
            <p className="mt-3 text-sm leading-relaxed text-suma-cream/75 md:text-base">Cambia los datos por los de tu negocio y mira el cálculo paso a paso. Es una simulación, no una promesa de resultados.</p>
          </div>
          <ul aria-label="Cómo leer esta simulación" className="flex flex-wrap gap-2 text-[0.7rem] font-bold uppercase tracking-wide md:max-w-[15rem] md:justify-end">
            <li className="rounded-full bg-suma-cream-deep px-2.5 py-1 text-suma-navy/80">Ejemplo</li>
            <li className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">Tu dato</li>
            <li className="rounded-full bg-suma-purple/30 px-2.5 py-1 text-suma-cream">Supuesto</li>
            <li className="rounded-full border border-white/30 px-2.5 py-1 text-suma-cream">Resultado no garantizado</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-suma-line p-5 md:p-8 xl:border-b-0 xl:border-r">
          {/* En escritorio los datos acompañan al resultado mientras se hace scroll. */}
          <div className="xl:sticky xl:top-24">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-extrabold text-suma-navy">1. Tus números</h3>
              <p className="mt-1 text-sm text-suma-navy/65" aria-live="polite">
                {editedBasics === 0 ? "Partimos de un estudio de ejemplo. Cambia lo que sepas." : "Usando " + editedBasics + " de 4 datos tuyos."}
              </p>
            </div>
            {edited.size > 0 && (
              <button type="button" onClick={restore}
                className="min-h-10 rounded-full border border-suma-line bg-white px-3 text-xs font-bold text-suma-navy hover:border-suma-orange">
                Volver al ejemplo
              </button>
            )}
          </div>
          <div className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2">{fields(formFields)}</div>
          <details className="group mt-7 rounded-2xl border border-suma-line bg-white p-4 md:p-5">
            <summary className="cursor-pointer list-item text-sm font-bold text-suma-navy">
              Supuestos avanzados y ahorro de tiempo
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">Opcional. Si no los cambias, se usan los del ejemplo.</p>
            <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2">{fields(advancedFields)}</div>
          </details>
          <p className="mt-5 text-xs leading-relaxed text-suma-navy/65">
            Privacidad: se calcula en tu navegador y no se guarda. Solo si pulsas el botón de WhatsApp se prepara un mensaje editable.
          </p>
          </div>
        </div>

        <div className="p-5 md:p-8">
          <h3 className="font-display text-xl font-extrabold text-suma-navy">2. El resultado</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold text-suma-navy/70">
                Escenario <span className="rounded-full bg-suma-purple/10 px-2 py-0.5 text-[0.68rem] uppercase tracking-wide text-suma-purple">Supuesto</span>
              </p>
              <div role="group" aria-label="Escenario de impacto" className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-suma-cream-deep p-1">
                {(Object.keys(impactScenarios) as ImpactScenario[]).map((id) => (
                  <button key={id} type="button" aria-pressed={scenario === id} onClick={() => { markUsed(); setScenario(id); }}
                    className={pill + (scenario === id ? " border-suma-navy bg-suma-navy text-white" : " border-transparent text-suma-navy hover:bg-white")}>
                    {impactScenarios[id].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-suma-navy/70">Periodo a evaluar</p>
              <div role="group" aria-label="Periodo a evaluar" className="mt-2 grid grid-cols-4 gap-1 rounded-full bg-suma-cream-deep p-1">
                {PERIODS.map((m) => (
                  <button key={m} type="button" aria-pressed={outcome.months === m} onClick={() => { markUsed(); onMonthsChange?.(m); }}
                    className={pill + (outcome.months === m ? " border-suma-navy bg-suma-navy text-white" : " border-transparent text-suma-navy hover:bg-white")}>
                    {m === 12 ? "12 m" : m + " m"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div aria-live="polite" className="mt-5 rounded-[1.5rem] bg-suma-navy p-5 text-suma-cream md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-suma-orange">
                {attributable ? "Cálculo mensual estimado, paso a paso" : "Oportunidad si alguien atiende esas consultas"}
              </p>
              <span className="rounded-full border border-white/30 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide">No garantizado</span>
            </div>
            <dl className="mt-4 divide-y divide-white/15 text-sm">
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt>
                  <span className="block font-bold">Clientes nuevos estimados</span>
                  <span className="block text-xs text-suma-cream/60">
                    {formatDecimal(outcome.missed)} sin respuesta × {formatDecimal(recoveryRate)}% recuperadas × {formatDecimal(inputs.conversionPct)}% compran
                    {outcome.capacityBound ? " · limitado por tus lugares libres" : ""}
                  </span>
                </dt>
                <dd className="font-display text-xl font-extrabold tabular-nums">{formatDecimal(outcome.additionalClients)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt>
                  <span className="block font-bold">Ingresos adicionales estimados</span>
                  <span className="block text-xs text-suma-cream/60">× {formatMXN(inputs.revenuePerClient)} por cliente</span>
                </dt>
                <dd className="font-display text-xl font-extrabold tabular-nums">{formatMXN(outcome.addedRevenue)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt>
                  <span className="block font-bold">Margen estimado</span>
                  <span className="block text-xs text-suma-cream/60">{formatDecimal(inputs.contributionMarginPct)}% de margen tras costos variables</span>
                </dt>
                <dd className="font-display text-xl font-extrabold tabular-nums">{formatMXN(outcome.marginContribution)}</dd>
              </div>
              {attributable && (
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt><span className="block font-bold">− {feeLabel}</span></dt>
                  <dd className="font-display text-xl font-extrabold tabular-nums">−{formatMXN(outcome.costMonthly)}</dd>
                </div>
              )}
            </dl>
            {attributable ? (
              <div className="mt-2 flex items-baseline justify-between gap-4 border-t-2 border-white/40 pt-4">
                <p className="font-bold">= Diferencia estimada al mes</p>
                <p className={cn("font-display text-[clamp(2rem,5vw,2.8rem)] font-extrabold leading-none tabular-nums", recurringCovered ? "text-emerald-300" : "text-suma-orange")}>
                  {outcome.monthlyNet >= 0 ? "+" : ""}{formatMXN(outcome.monthlyNet)}
                </p>
              </div>
            ) : !comparable ? (
              <p className="mt-3 rounded-xl border border-white/20 p-3 text-sm">Elige al menos un módulo en el paso 4 para restar la inversión de SUMA.</p>
            ) : null}
          </div>

          {attributable && (
            <div className={cn("mt-4 rounded-2xl border p-5", recurringCovered ? "border-emerald-200 bg-emerald-50" : "border-suma-orange/35 bg-suma-orange/10")}>
              <p className="text-sm font-extrabold text-suma-navy">
                {recurringCovered
                  ? "Si estos supuestos se cumplen, el margen estimado cubriría la mensualidad."
                  : "Con estos supuestos, el margen estimado no alcanzaría a cubrir la mensualidad."}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-suma-navy/80">
                <li>
                  <strong>Punto de equilibrio:</strong>{" "}
                  {outcome.clientsToCoverMonthly === null
                    ? "no se puede calcular con un margen de 0%."
                    : "harían falta " + outcome.clientsToCoverMonthly + " clientes nuevos al mes para cubrir la mensualidad"
                      + (outcome.setup > 0 && outcome.clientsToCoverFirstMonth !== null ? " (" + outcome.clientsToCoverFirstMonth + " el primer mes, si también se cubre la implementación)." : ".")}
                </li>
                <li><strong>Implementación ({formatMXN(outcome.setup)}):</strong> {paybackText}</li>
                <li>
                  <strong>Balance estimado en {outcome.months} {outcome.months === 1 ? "mes" : "meses"}:</strong>{" "}
                  <span className={cn("font-bold tabular-nums", outcome.netOverPeriod >= 0 ? "text-emerald-700" : "text-suma-orange-ink")}>
                    {outcome.netOverPeriod >= 0 ? "+" : ""}{formatMXN(outcome.netOverPeriod)}
                  </span>{" "}
                  ya restando la implementación{outcome.months === 1 && outcome.setup > 0 ? "; prueba 6 o 12 meses para ver la recuperación." : "."}
                </li>
              </ul>
            </div>
          )}

          {!hasFollowupScope && (
            <div className="mt-4 rounded-xl border border-suma-orange/40 bg-suma-orange/10 p-4 text-sm leading-relaxed text-suma-navy">
              <strong>Importante:</strong> esta oportunidad solo existe si alguien responde y da seguimiento a esas consultas.
              Publicidad, SEO, web, reservador o app no lo hacen por sí solos, así que no la comparamos contra tu mensualidad ni estimamos horas liberadas.
              Para que aplique, añade CRM, chatbot o automatización en el paso 4.
            </div>
          )}

          {hasFollowupScope && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-suma-line bg-white p-4">
              <span aria-hidden="true" className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-suma-purple/10 text-base">⏱</span>
              <p className="text-sm leading-relaxed text-suma-navy/80">
                <strong className="text-suma-navy">~{formatDecimal(outcome.hoursReleased)} horas al mes</strong> de trabajo repetitivo podrían liberarse
                ({formatDecimal(inputs.manualTasksPerMonth, 0)} tareas × {formatDecimal(inputs.minutesSavedPerTask)} min). Equivaldrían a ~{formatMXN(outcome.timeValue)} de tiempo del equipo, pero no se suman como ahorro en efectivo.
              </p>
            </div>
          )}

          <details className="mt-4 rounded-2xl border border-suma-line bg-white p-4">
            <summary className="cursor-pointer text-sm font-bold text-suma-navy">Cómo se calcula y qué no incluye</summary>
            <div className="mt-4 space-y-2 text-xs leading-relaxed text-suma-navy/75">
              <p><strong>Clientes nuevos:</strong> consultas × % sin respuesta × % que recuperarías × % que compra, con tope en tus lugares libres.</p>
              <p><strong>Margen:</strong> ingresos × margen. Después se resta la mensualidad SUMA{quote.hasAds ? " y la pauta" : ""}, solo si elegiste módulos que atienden o dan seguimiento.</p>
              <p><strong>Supone el mismo resultado cada mes desde el primero;</strong> en la práctica la implementación y el ajuste toman tiempo. No suma consultas nuevas que pudieran traer publicidad, SEO o web.</p>
              <p><strong>Escenarios (supuesto de SUMA):</strong> conservador aplica 50%, base 100% y optimista 125% a la recuperación y al tiempo ahorrado. No son estadísticas.</p>
              <p><strong>Crecimiento:</strong> {outcome.growthPct === null ? "no calculable con estos datos" : "+" + formatDecimal(outcome.growthPct) + "% frente a los clientes que hoy obtienes de las consultas que sí atiendes"} (estimado, no histórico).</p>
              <p><strong>Precios:</strong> catálogo oficial SUMA, sin descuentos y antes de IVA: implementación {formatMXN(outcome.setup)} y mensualidad {formatMXN(quote.monthlySuma)}{quote.hasAds ? "; pauta " + formatMXN(quote.monthlyAds) + "/mes" : ""}.</p>
              <p><strong>No incluye:</strong> IVA, licencias de software, WhatsApp API, consumo de IA, hosting ni pagos futuros de tus clientes.</p>
            </div>
          </details>

          <a href={shareHref} target="_blank" rel="noopener noreferrer" {...showroomWhatsAppAttrs("impact")}
            className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-suma-orange px-5 text-center text-sm font-extrabold text-suma-navy transition-colors hover:bg-suma-navy hover:text-white">
            Quiero que SUMA revise mis números →
          </a>
          <p className="mt-3 text-center text-xs text-suma-navy/60">Abre WhatsApp con un mensaje editable · No contratas ni reservas nada.</p>
        </div>
      </div>

      <div className="border-t border-suma-line bg-white px-5 py-4 md:px-8">
        <p className="text-xs leading-relaxed text-suma-navy/70">
          <strong className="text-suma-purple">Contexto:</strong> estudios como{" "}
          <a href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads" target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-suma-orange underline-offset-4">HBR 2011 (respuesta a prospectos) ↗</a>{" "}
          y{" "}
          <a href="https://www.mindbodyonline.com/business/education/research-reports/2025-state-industry-report" target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-suma-orange underline-offset-4">Mindbody 2025 (retención wellness) ↗</a>{" "}
          explican por qué importa responder rápido, pero sus cifras no son resultados prometidos por SUMA.
        </p>
      </div>
    </section>
  );
}
