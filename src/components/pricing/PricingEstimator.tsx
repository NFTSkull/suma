"use client";

import { useState } from "react";
import { pricingPlans, pricingSettings, type PricingPlanId } from "@/content/pricing";
import { track } from "@/lib/analytics";
import { estimatePricing, formatMXN, pricingWhatsAppHref } from "@/lib/pricing";

const periods = [1, 3, 6, 12];

export function PricingEstimator() {
  const [planId, setPlanId] = useState<PricingPlanId>("flow");
  const [months, setMonths] = useState(3);
  const [startMaintenance, setStartMaintenance] = useState(false);
  const [growthAdBudget, setGrowthAdBudget] = useState<number>(pricingSettings.defaultGrowthAdBudget);
  const selection = { planId, months, startMaintenance, growthAdBudget };
  const quote = estimatePricing(selection);

  return (
    <div className="grid gap-10 rounded-[2rem] bg-suma-navy p-6 text-suma-cream shadow-lift md:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:p-12">
      <div>
        <p className="text-eyebrow text-suma-orange">Explora tu inversión</p>
        <h3 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
          Ajusta el plan. Ve los números con claridad.
        </h3>
        <p className="mt-4 max-w-xl text-suma-cream/75">
          Este simulador calcula una referencia sin compromiso. El alcance y las herramientas se confirman contigo antes de cotizar.
        </p>

        <fieldset className="mt-8">
          <legend className="mb-3 text-sm font-bold">¿Por dónde te gustaría empezar?</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {pricingPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                aria-pressed={planId === plan.id}
                onClick={() => {
                  setPlanId(plan.id);
                  track({ event: "pricing_plan_selected", plan: plan.id });
                }}
                className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-colors sm:text-center ${planId === plan.id
                  ? "border-suma-orange bg-suma-orange text-suma-navy"
                  : "border-suma-cream/30 text-suma-cream hover:border-suma-cream/80"}`}
              >
                {plan.name}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-7">
          <label htmlFor="pricing-months" className="block text-sm font-bold">Periodo de referencia</label>
          <select
            id="pricing-months"
            value={months}
            onChange={(event) => setMonths(Number(event.target.value))}
            className="mt-3 min-h-12 w-full rounded-2xl border border-suma-cream/30 bg-suma-navy px-4 text-base text-suma-cream focus-visible:outline-suma-orange"
          >
            {periods.map((period) => (
              <option key={period} value={period}>{period} {period === 1 ? "mes" : "meses"}</option>
            ))}
          </select>
        </div>

        {planId === "start" && (
          <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border border-suma-cream/20 p-4 text-sm">
            <input
              type="checkbox"
              checked={startMaintenance}
              onChange={(event) => setStartMaintenance(event.target.checked)}
              className="mt-1 size-5 accent-suma-orange"
            />
            <span><strong>Agregar mantenimiento opcional</strong><br />{formatMXN(pricingSettings.startMaintenanceMonthly)} MXN al mes. Sin obligación de contratarlo.</span>
          </label>
        )}

        {planId === "growth" && (
          <div className="mt-7">
            <label htmlFor="pricing-ads" className="block text-sm font-bold">Presupuesto mensual de publicidad (pagado a Meta)</label>
            <select
              id="pricing-ads"
              value={growthAdBudget}
              onChange={(event) => setGrowthAdBudget(Number(event.target.value))}
              className="mt-3 min-h-12 w-full rounded-2xl border border-suma-cream/30 bg-suma-navy px-4 text-base text-suma-cream focus-visible:outline-suma-orange"
            >
              {pricingSettings.growthAdBudgets.map((budget) => (
                <option key={budget} value={budget}>{formatMXN(budget)} MXN al mes</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-suma-cream/65">Es una hipótesis de inversión, no un gasto que SUMA cobre ni una promesa de resultados.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between rounded-[1.5rem] bg-suma-cream p-6 text-suma-navy md:p-8">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-eyebrow text-suma-purple">{quote.plan.name}</p>
          <p className="mt-3 text-sm font-semibold text-suma-navy/60">Primer pago a SUMA</p>
          <p className="mt-1 font-display text-[clamp(2.5rem,5vw,3.6rem)] font-extrabold leading-none tracking-tight tabular-nums">
            {formatMXN(quote.firstPaymentSuma)}
          </p>
          <p className="mt-2 text-xs text-suma-navy/65">Implementación + primera mensualidad, cuando aplique</p>
          <dl className="mt-8 divide-y divide-suma-navy/15 border-y border-suma-navy/15">
            <div className="flex items-start justify-between gap-3 py-3 text-sm">
              <dt>Implementación única</dt><dd className="shrink-0 font-bold tabular-nums">{formatMXN(quote.setup)}</dd>
            </div>
            <div className="flex items-start justify-between gap-3 py-3 text-sm">
              <dt>Servicio mensual SUMA</dt><dd className="shrink-0 font-bold tabular-nums">{formatMXN(quote.monthlySuma)}</dd>
            </div>
            {quote.plan.id === "growth" && (
              <div className="flex items-start justify-between gap-3 py-3 text-sm">
                <dt>Publicidad mensual externa</dt><dd className="shrink-0 font-bold tabular-nums">{formatMXN(quote.monthlyAds)}</dd>
              </div>
            )}
          </dl>
          <p className="mt-7 text-xs font-bold uppercase tracking-widest text-suma-navy/60">Total a SUMA en {quote.months} {quote.months === 1 ? "mes" : "meses"}</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">{formatMXN(quote.totalSuma)}</p>
          {quote.plan.id === "growth" && (
            <p className="mt-2 text-sm text-suma-navy/70">
              + {formatMXN(quote.totalExternalAds)} de publicidad estimada pagada a Meta en ese periodo.
            </p>
          )}
        </div>
        <div className="mt-8">
          <a
            href={pricingWhatsAppHref(selection)}
            target="_blank"
            rel="noopener noreferrer"
            data-pricing-plan={planId}
            data-pricing-source="estimator"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-suma-navy px-6 text-center font-bold text-suma-cream transition-colors hover:bg-suma-purple"
          >
            Revisar mi propuesta por WhatsApp →
          </a>
          <p className="mt-4 text-center text-xs leading-relaxed text-suma-navy/65">
            Estimación en MXN antes de IVA. No incluye licencias, hosting, WhatsApp API, herramientas externas ni otros desarrollos.
          </p>
        </div>
      </div>
    </div>
  );
}
