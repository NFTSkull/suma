"use client";

import { useState } from "react";
import { formatMXN } from "@/lib/pricing";
import { calculateShowroomImpact, impactSample, impactScenarios, type ImpactInputs, type ImpactScenario } from "@/lib/showroom-impact";
import { showroomWhatsAppHref, type ShowroomSelection, type showroomEstimate } from "@/lib/showroom";

type Props = {
  selection: ShowroomSelection;
  quote: ReturnType<typeof showroomEstimate>;
};

const inputStyle = "mt-2 h-12 w-full min-w-0 rounded-xl border border-suma-line bg-white px-3 text-base font-semibold text-suma-navy outline-offset-2 focus-visible:outline-2 focus-visible:outline-suma-orange";
const smallButton = "min-h-12 rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-suma-orange";
const formatDecimal = (number: number, max = 1) => new Intl.NumberFormat("es-MX", { maximumFractionDigits: max }).format(number);

const formFields: Array<{
  key: keyof ImpactInputs;
  label: string;
  hint: string;
  max: number;
  step?: number;
}> = [
  { key: "leadsPerMonth", label: "Consultas nuevas al mes", hint: "Mensajes o prospectos únicos, no seguidores.", max: 1000000 },
  { key: "unansweredPct", label: "¿Qué % queda sin atender?", hint: "Aproximación de consultas que no reciben seguimiento.", max: 100 },
  { key: "revenuePerClient", label: "Ingreso por cliente nuevo", hint: "Solo la primera compra, sin asumir pagos futuros.", max: 100000000 },
  { key: "contributionMarginPct", label: "Margen de contribución (%)", hint: "Después de los costos variables del servicio.", max: 100 },
];

const advancedFields: typeof formFields = [
  { key: "recoveryPct", label: "Consultas sin atender que recuperarías (%)", hint: "Hipótesis propia. No es un promedio de mercado.", max: 100 },
  { key: "conversionPct", label: "De las recuperadas, ¿cuántas comprarían (%)?", hint: "Usa tu tasa real si la conoces.", max: 100 },
  { key: "capacity", label: "Cupos adicionales disponibles al mes", hint: "Limita ventas estimadas a tu capacidad operativa.", max: 1000000 },
  { key: "manualTasksPerMonth", label: "Tareas repetitivas al mes", hint: "Ejemplo: respuestas, recordatorios o seguimiento.", max: 1000000 },
  { key: "minutesSavedPerTask", label: "Minutos recuperables por tarea", hint: "Se valida con medición antes y después.", max: 1440 },
  { key: "hourlyCost", label: "Costo estimado por hora (MXN)", hint: "Para valorar tiempo; no equivale a ahorro de nómina.", max: 1000000 },
];

export function ShowroomImpacto({ selection, quote }: Props) {
  const [inputs, setInputs] = useState<ImpactInputs>(impactSample);
  const [userData, setUserData] = useState(false);
  const [scenario, setScenario] = useState<ImpactScenario>("base");
  const outcome = calculateShowroomImpact(inputs, quote, scenario);
  const comparable = !quote.isEmpty;
  const followupServices = ["crm-gestionado", "crm-medida", "chatbot-guiado", "chatbot-ia", "automatizacion"];
  const hasFollowupScope =
    (selection.mode === "package" && (selection.planId === "flow" || selection.planId === "growth")) ||
    selection.serviceIds.some((service) => followupServices.includes(service));
  const estimatedFirstInvoiceWithVat = quote.firstPaymentSuma * 1.16;
  const good = outcome.monthlyNet >= 0;
  const recurringCovered = comparable && outcome.marginContribution >= outcome.costMonthly;
  const feeLabel = quote.hasAds ? "SUMA + pauta" : "SUMA";
  const shareSummary = "Escenario " + impactScenarios[scenario].label.toLowerCase() +
    ": " + formatDecimal(outcome.additionalClients) + " clientes nuevos/mes; " +
    formatMXN(outcome.addedRevenue) + " ingresos brutos/mes; " +
    formatMXN(outcome.marginContribution) + " contribución/mes; " +
    formatMXN(outcome.costMonthly) + " gasto mensual SUMA/pauta. Deseo validar supuestos.";
  const shareHref = showroomWhatsAppHref({
    ...selection,
    notes: shareSummary,
  }, "diagnostic");

  const update = (key: keyof ImpactInputs, value: number) => {
    setUserData(true);
    setInputs((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : 0 }));
  };

  const fields = (items: typeof formFields) => items.map((item) => (
    <div key={item.key}>
      <label htmlFor={"impact-" + item.key} className="block text-sm font-bold text-suma-navy">{item.label}</label>
      <input
        id={"impact-" + item.key}
        type="number"
        inputMode="decimal"
        min={0}
        max={item.max}
        step={item.step ?? 1}
        value={inputs[item.key]}
        onChange={(event) => update(item.key, Number(event.target.value))}
        className={inputStyle}
      />
      <p className="mt-1.5 text-xs leading-relaxed text-suma-navy/60">{item.hint}</p>
    </div>
  ));

  return (
    <section id="showroom-impacto" aria-labelledby="showroom-impact-title" className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-suma-line bg-suma-cream-soft shadow-soft">
      <div className="relative overflow-hidden bg-suma-navy px-5 py-8 text-suma-cream md:px-9 md:py-10">
        <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-36 size-80 rounded-full bg-suma-orange/15 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-eyebrow text-suma-orange">03 · Tu crecimiento, con números</p>
            <h2 id="showroom-impact-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">¿Qué tendría que pasar para que esta inversión te convenga?</h2>
            <p className="mt-3 text-sm leading-relaxed text-suma-cream/75 md:text-base">Simula ingresos, horas recuperables y punto de equilibrio. Los números cambian contigo, sin promesas de resultados.</p>
          </div>
          <span className="w-fit shrink-0 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold">
            {userData ? "Datos editados · revisa supuestos" : "Ejemplo ilustrativo · editable"}
          </span>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="border-b border-suma-line p-5 md:p-8 xl:border-b-0 xl:border-r">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-extrabold text-suma-navy">Hablemos de tu negocio</h3>
              <p className="mt-2 text-sm text-suma-navy/65">Si no conoces algún dato, conserva el ejemplo y úsalo solo para explorar.</p>
            </div>
            <button type="button" onClick={() => { setInputs(impactSample); setUserData(false); setScenario("base"); }}
              className="min-h-10 rounded-full border border-suma-line bg-white px-3 text-xs font-bold text-suma-navy hover:border-suma-orange">
              Restaurar ejemplo
            </button>
          </div>
          <div className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2">{fields(formFields)}</div>
          <details className="group mt-7 rounded-2xl border border-suma-line bg-white p-4 md:p-5">
            <summary className="cursor-pointer list-item text-sm font-bold text-suma-navy">
              Afinar el cálculo y el ahorro de tiempo
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">Solo si quieres más precisión. Personaliza tasas de recuperación, capacidad y tiempo dedicado a tareas.</p>
            <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2">{fields(advancedFields)}</div>
          </details>
          <p className="mt-5 text-xs leading-relaxed text-suma-navy/65">
            Privacidad: esta simulación se calcula en tu navegador, no se guarda ni conecta con tus herramientas. Si compartes tu evaluación por WhatsApp, abrirás un mensaje editable.
          </p>
        </div>

        <div className="p-5 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-extrabold text-suma-navy">Tu escenario</h3>
              <p className="mt-1 text-xs text-suma-navy/60">Sensibilidad ilustrativa, no probabilidades validadas.</p>
            </div>
          </div>
          <div role="group" aria-label="Escenario de impacto" className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-suma-cream-deep p-1.5">
            {(Object.keys(impactScenarios) as ImpactScenario[]).map((id) => (
              <button key={id} type="button" aria-pressed={scenario === id} onClick={() => setScenario(id)}
                className={smallButton + (scenario === id ? " border-suma-navy bg-suma-navy text-white" : " border-transparent bg-transparent text-suma-navy hover:bg-white")}>
                {impactScenarios[id].label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-suma-navy/60">
            Recuperación de interesados: {formatDecimal(Math.min(100, inputs.recoveryPct * impactScenarios[scenario].factor))}% del grupo no atendido.
          </p>

          <div aria-live="polite" className="mt-5 rounded-[1.5rem] bg-suma-navy p-5 text-suma-cream md:p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-suma-orange">Ingresos brutos potenciales · por mes</p>
            <p className="mt-2 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-none tabular-nums">{formatMXN(outcome.addedRevenue)}</p>
            <p className="mt-3 text-sm text-suma-cream/70">
              {formatDecimal(outcome.additionalClients)} clientes nuevos adicionales en este escenario
              {outcome.growthPct !== null ? " · +" + formatDecimal(outcome.growthPct) + "% sobre clientes actuales estimados" : ""}.
            </p>
            <div className="mt-6 grid gap-3 border-t border-white/20 pt-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-suma-cream/60">Contribución tras costos variables</p>
                <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">{formatMXN(outcome.marginContribution)}</p>
              </div>
              <div>
                <p className="text-xs text-suma-cream/60">Inversión mensual {feeLabel}</p>
                <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">{formatMXN(outcome.costMonthly)}</p>
              </div>
            </div>
          </div>

          {!hasFollowupScope && (
            <div className="mt-4 rounded-xl border border-suma-orange/40 bg-suma-orange/10 p-4 text-sm leading-relaxed text-suma-navy">
              <strong>Importante:</strong> esta simulación calcula una oportunidad de recuperar consultas, no una mejora automática por contratar publicidad, SEO o una web. Para trabajar ese escenario hace falta diseñar atención y seguimiento.
            </div>
          )}

          <p className="mt-3 text-xs leading-relaxed text-suma-navy/65">
            Referencia de inversión: {quote.mode === "package" ? quote.plan.name : (quote.services.map((service) => service.name).join(", ") || "sin módulos seleccionados")}.
            {" "}<a href="#showroom-cotizar" className="font-bold underline decoration-suma-orange underline-offset-4">Modificar módulos y periodo ↓</a>
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-suma-line bg-white p-4">
              <p className="text-xs font-semibold text-suma-navy/60">Diferencia mensual estimada</p>
              <p className={"mt-1 font-display text-2xl font-extrabold tabular-nums " + (good ? "text-emerald-700" : "text-suma-orange-ink")}>{formatMXN(outcome.monthlyNet)}</p>
              <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">Después de SUMA y pauta; antes de inversión inicial, IVA y costos externos no estimados.</p>
            </div>
            <div className="rounded-2xl border border-suma-line bg-white p-4">
              <p className="text-xs font-semibold text-suma-navy/60">Horas de trabajo recuperables/mes</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-suma-navy tabular-nums">{formatDecimal(outcome.hoursReleased)} h</p>
              <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">Valor del tiempo: {formatMXN(outcome.timeValue)}. No se suma como ahorro en efectivo.</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-suma-line bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-suma-purple">La inversión, sin sorpresas</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-suma-navy/60">Primera factura SUMA con IVA general del 16%, si aplica</p>
                <p className="mt-1 font-display text-xl font-extrabold tabular-nums text-suma-navy">{formatMXN(estimatedFirstInvoiceWithVat)}</p>
              </div>
              <div>
                <p className="text-xs text-suma-navy/60">Balance estimado en {outcome.months} {outcome.months === 1 ? "mes" : "meses"}, antes de IVA</p>
                <p className={"mt-1 font-display text-xl font-extrabold tabular-nums " + (outcome.netOverPeriod >= 0 ? "text-emerald-700" : "text-suma-orange-ink")}>{formatMXN(outcome.netOverPeriod)}</p>
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-suma-navy/60">El balance resta implementación, mensualidad y pauta, pero excluye IVA, consumos y licencias externos, así como otros costos no informados. El IVA mostrado es una referencia de desembolso, no necesariamente un costo económico definitivo ni un cálculo fiscal personalizado.</p>
          </div>

          {comparable ? (
            <div className={"mt-4 rounded-2xl border p-5 " + (recurringCovered ? "border-emerald-200 bg-emerald-50" : "border-suma-orange/35 bg-suma-orange/10")}>
              <p className="text-sm font-extrabold text-suma-navy">{recurringCovered ? "Este escenario cubre el costo mensual estimado" : "Con estos supuestos, todavía no se cubre el costo mensual"}</p>
              <p className="mt-2 text-sm leading-relaxed text-suma-navy/80">
                {outcome.clientsToCoverMonthly === null
                  ? "No es posible calcular el equilibrio con el margen y ticket indicados."
                  : "Para cubrir el gasto mensual se necesitarían " + outcome.clientsToCoverMonthly + " clientes adicionales, considerando el margen que indicaste."}
                {" "}{outcome.paybackMonths === null
                  ? "La implementación no se recuperaría con el excedente mensual de este escenario."
                  : outcome.paybackMonths === 0
                    ? "No hay costo de implementación en esta selección."
                    : "La implementación se recuperaría aproximadamente en " + outcome.paybackMonths + " meses si ese excedente se mantiene."}
              </p>
              <p className="mt-2 text-xs text-suma-navy/65">El primer mes requeriría {outcome.clientsToCoverFirstMonth === null ? "un cálculo individual por falta de margen positivo" : outcome.clientsToCoverFirstMonth + " clientes nuevos para cubrir también la implementación"}.</p>
              <p className="mt-2 text-xs text-suma-navy/65">Resultado orientativo; no considera licencias ni consumos externos. {quote.isStartingPrice ? "El presupuesto de SUMA parte de un mínimo sujeto a alcance." : ""}</p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-suma-line bg-white p-4 text-sm text-suma-navy/75">
              Elige al menos un servicio más abajo para comparar la oportunidad con la inversión de SUMA.
            </div>
          )}

          <details className="mt-4 rounded-2xl border border-suma-line bg-white p-4">
            <summary className="cursor-pointer text-sm font-bold text-suma-navy">¿De dónde salen estos números?</summary>
            <div className="mt-4 space-y-2 text-xs leading-relaxed text-suma-navy/75">
              <p><strong>Consultas no atendidas:</strong> consultas al mes × porcentaje sin atención.</p>
              <p><strong>Clientes adicionales:</strong> consultas no atendidas × recuperación hipotética × conversión, limitado por cupos disponibles.</p>
              <p><strong>Ingresos:</strong> clientes adicionales × ingreso de la primera compra.</p>
              <p><strong>Contribución:</strong> ingresos × margen. Se resta mensualidad SUMA y pauta, pero no se descuentan impuestos, licencias, WhatsApp, IA ni infraestructura externa.</p>
              <p><strong>Horas:</strong> tareas × minutos ahorrables ÷ 60. El valor del tiempo se presenta aparte y no se trata como ahorro monetario automático.</p>
              <p><strong>Crecimiento porcentual:</strong> compara nuevos clientes del escenario con los clientes actuales modelados a partir de consultas que sí se atienden y la misma tasa de conversión; no es una cifra histórica comprobada.</p>
              <p><strong>Escenarios:</strong> conservador aplica 50%, base 100% y optimista 125% sobre la recuperación que tú indicas. Estos factores son ejemplos de sensibilidad, no datos estadísticos.</p>
              <p><strong>Precios:</strong> catálogo oficial SUMA, sin descuentos y antes de IVA. Implementación {formatMXN(outcome.setup)}; mensualidad {formatMXN(quote.monthlySuma)}; pauta {formatMXN(quote.monthlyAds)}.</p>
              {outcome.capacityBound && <p><strong>Capacidad:</strong> tu límite de cupos restringió la estimación de nuevos clientes.</p>}
            </div>
          </details>

          <a href={shareHref} target="_blank" rel="noopener noreferrer"
            className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-suma-orange px-5 text-center text-sm font-extrabold text-suma-navy transition-colors hover:bg-suma-navy hover:text-white">
            Quiero que SUMA revise mis números →
          </a>
          <p className="mt-3 text-center text-xs text-suma-navy/60">
            Solicitud por WhatsApp · No contratas ni reservas automáticamente.
          </p>
        </div>
      </div>

      <div className="border-t border-suma-line bg-white px-5 py-5 md:px-8">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-suma-purple">Contexto de investigación</p>
            <p className="mt-1 text-sm text-suma-navy/75">Los estudios orientan qué procesos vale la pena mejorar, pero sus cifras <strong>no</strong> son porcentajes de resultados prometidos por SUMA.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold">
            <a href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads" target="_blank" rel="noopener noreferrer" className="underline decoration-suma-orange underline-offset-4">Respuesta a prospectos · HBR 2011 ↗</a>
            <a href="https://wwwmatnp.sat.gob.mx/articulo/19848/articulo-1" target="_blank" rel="noopener noreferrer" className="underline decoration-suma-orange underline-offset-4">Tasa general IVA · SAT ↗</a>
            <a href="https://www.mindbodyonline.com/business/education/research-reports/2025-state-industry-report" target="_blank" rel="noopener noreferrer" className="underline decoration-suma-orange underline-offset-4">Retención wellness · Mindbody 2025 ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
