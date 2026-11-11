"use client";

import { useState, useSyncExternalStore } from "react";
import {
  individualServices,
  pricingPlans,
  pricingSettings,
  type IndividualServiceId,
  type PricingPlanId,
} from "@/content/pricing";
import { track } from "@/lib/analytics";
import { PricingWhatIs } from "@/components/pricing/PricingWhatIs";
import { planExplanations, pricingConcepts, serviceExplanations } from "@/content/pricing-explanations";
import { availableSetupPayments, estimatePricing, formatMXN, formatMXNExact, pricingWhatsAppHref, type PricingSelection, type SetupPayments } from "@/lib/pricing";

const subscribeToLocation = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
};
const currentSearch = () => window.location.search;
const serverSearch = () => "";

const periods = [1, 3, 6, 12];
const categories = ["Captación", "Atención", "Operación", "Presencia", "Desarrollo"];
const selectStyle = "mt-2 min-h-12 w-full rounded-xl border border-suma-cream/30 bg-suma-navy px-3 text-base text-suma-cream focus-visible:outline-suma-orange";
const optionButton = "min-h-12 rounded-xl border px-4 py-3 text-sm font-bold transition-colors";

export function PricingEstimator() {
  const search = useSyncExternalStore(subscribeToLocation, currentSearch, serverSearch);
  const params = new URLSearchParams(search);
  const requestedPlan = params.get("plan");
  const requestedService = params.get("servicio");
  const routePlan = pricingPlans.find((p) => p.id === requestedPlan)?.id ?? "flow";
  const routeService = individualServices.find((s) => s.id === requestedService)?.id;

  const [manualMode, setManualMode] = useState<"package" | "services" | null>(null);
  const [manualPlanId, setManualPlanId] = useState<PricingPlanId | null>(null);
  const [manualServiceIds, setManualServiceIds] = useState<IndividualServiceId[] | null>(null);
  const [showExtras, setShowExtras] = useState(false);
  const mode = manualMode ?? (routeService ? "services" : "package");
  const planId = manualPlanId ?? routePlan;
  const serviceIds = manualServiceIds ?? (routeService ? [routeService] : []);
  const [months, setMonths] = useState<number>(pricingSettings.defaultMonths);
  const [setupPayments, setSetupPayments] = useState<SetupPayments>(pricingSettings.defaultSetupPayments);
  const [adBudget, setAdBudget] = useState<number>(pricingSettings.defaultAdBudget);
  const [locations, setLocations] = useState(1);
  const [teamUsers, setTeamUsers] = useState(5);
  const [businessType, setBusinessType] = useState("Pilates / yoga");
  const [goal, setGoal] = useState("Organizar consultas");
  const [platform, setPlatform] = useState("WhatsApp");
  const [notes, setNotes] = useState("");

  const selection: PricingSelection = {
    mode, planId, serviceIds, months, setupPayments, adBudget, locations, teamUsers,
    businessType, goal, platform, notes,
  };
  const quote = estimatePricing(selection);
  const paymentOptions = availableSetupPayments(quote.setup);
  const chosenPlanExplanation = planExplanations[planId];
  const included = mode === "package"
    ? planId === "growth" ? ["meta-ads", "crm-gestionado"]
      : planId === "ads" ? ["meta-ads"] : ["crm-gestionado"]
    : [];
  const toggleService = (id: IndividualServiceId, checked: boolean) =>
    setManualServiceIds((previous) => {
      const current = previous ?? (routeService ? [routeService] : []);
      return checked ? (current.includes(id) ? current : [...current, id])
        : current.filter((entry) => entry !== id);
    });

  return (
    <div className="grid min-w-0 gap-8 rounded-[2rem] bg-suma-navy p-5 text-suma-cream shadow-lift md:p-9 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:gap-10 xl:p-10">
      <div className="min-w-0">
        <p className="text-eyebrow text-suma-orange">Tu solución, a tu medida</p>
        <h3 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">Elige lo que necesitas y entiende el precio.</h3>
        <p className="mt-3 text-sm leading-relaxed text-suma-cream/75">
          Puedes empezar con un plan o elegir un solo servicio. Verás cuánto pagarías al comenzar, cuánto al mes y qué se paga aparte.
        </p>

        <fieldset className="mt-8">
          <legend className="mb-3 text-sm font-bold">1. ¿Qué te gustaría elegir?</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={mode === "package"} onClick={() => { if (mode !== "package") setManualServiceIds([]); setManualMode("package"); }}
              className={optionButton + (mode === "package" ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
              Un plan completo
            </button>
            <button type="button" aria-pressed={mode === "services"} onClick={() => { if (mode !== "services") setManualServiceIds([]); setManualMode("services"); }}
              className={optionButton + (mode === "services" ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
              Elegir servicios
            </button>
          </div>
        </fieldset>

        {mode === "package" && (
          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-bold">2. ¿Qué necesitas mejorar?</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {pricingPlans.map((plan) => (
                <button key={plan.id} type="button" aria-pressed={planId === plan.id}
                  onClick={() => {
                    if (plan.id !== planId) setManualServiceIds([]);
                    setManualPlanId(plan.id);
                    setShowExtras(false);
                    track({ event: "pricing_plan_selected", plan: plan.id });
                  }}
                  className={optionButton + (planId === plan.id ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
                  {plan.name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-suma-cream/75">
              {chosenPlanExplanation.what}
            </p>
            <PricingWhatIs explanation={chosenPlanExplanation} dark subject={"SUMA " + planId.charAt(0).toUpperCase() + planId.slice(1)} />
          </fieldset>
        )}

        <fieldset className="mt-7">
          <legend className="mb-1 text-sm font-bold">{mode === "package" ? "3. ¿Quieres agregar algo más?" : "2. ¿Qué quieres que hagamos?"}</legend>
          <p className="mb-3 text-xs text-suma-cream/70">{mode === "package"
            ? "Tu plan ya incluye lo esencial. Solo marcas extras si los necesitas."
            : "Marca las funciones que te interesan. Cada una se explica con «¿Qué es?»."}</p>
          {mode === "package" && (
            <button type="button" aria-expanded={showExtras} onClick={() => setShowExtras((previous) => !previous)}
              className="mb-4 flex min-h-11 w-full items-center justify-between rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-left text-sm font-bold hover:border-suma-orange">
              <span>{quote.services.length ? quote.services.length + " funciones adicionales marcadas" : "Ver funciones opcionales"}</span>
              <span aria-hidden="true">{showExtras ? "−" : "+"}</span>
            </button>
          )}
          {(mode === "services" || showExtras) && categories.map((category) => {
            const services = individualServices.filter((s) => s.category === category && !included.includes(s.id));
            if (!services.length) return null;
            return (
              <div key={category} className="mb-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-suma-orange">{category}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {services.map((s) => (
                    <div key={s.id} className="min-w-0 rounded-xl border border-suma-cream/20 bg-suma-cream/5 p-3">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input type="checkbox" className="mt-1 size-4 shrink-0 accent-suma-orange" checked={serviceIds.includes(s.id)}
                          onChange={(e) => toggleService(s.id, e.target.checked)} aria-label={s.name}/>
                        <span className="min-w-0 text-sm">
                          <strong className="block leading-snug">{s.name}</strong>
                          <span className="mt-1 block text-xs text-suma-cream/75">
                            {s.setup > 0 ? formatMXN(s.setup) + " para comenzar" : ""}
                            {s.setup > 0 && s.monthly > 0 ? " + " : ""}
                            {s.monthly > 0 ? "desde " + formatMXN(s.monthly) + "/mes" : s.setup > 0 ? " · un solo pago" : ""}
                          </span>
                          <span className="mt-2 block text-xs leading-relaxed text-suma-cream/70">{s.detail}</span>
                        </span>
                      </label>
                      <PricingWhatIs explanation={serviceExplanations[s.id]} dark compact />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </fieldset>

        {quote.setup > 0 && (
          <fieldset className="mt-7 rounded-2xl border border-white/20 bg-white/5 p-4">
            <legend className="px-2 text-sm font-bold">¿Cómo te gustaría pagar la configuración?</legend>
            <div role="group" aria-label="Pago de implementación" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {paymentOptions.map((count) => (
                <button key={count} type="button" aria-pressed={quote.setupPayments === count}
                  onClick={() => setSetupPayments(count)}
                  className={optionButton + (quote.setupPayments === count
                    ? " border-suma-orange bg-suma-orange text-suma-navy"
                    : " border-suma-cream/30 bg-suma-navy hover:border-suma-orange")}>
                  {count === 1 ? "Un pago" : count + " mensualidades"}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-suma-cream/70">
              {quote.setupPayments === 1
                ? "Todo el pago inicial al comenzar, sujeto a la propuesta."
                : "Primer pago desde, antes de IVA " + formatMXNExact(quote.setupInstallment) + ". Último abono " + formatMXNExact(quote.setupFinalInstallment) + ". Dividir el pago no cambia el costo mínimo."}
              {" "}Dividir el pago requiere un acuerdo por escrito. No activa cobros ni aprueba un crédito.
            </p>
            <PricingWhatIs explanation={pricingConcepts.payments} dark compact />
          </fieldset>
        )}

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pricing-months" className="text-sm font-bold">¿Qué periodo quieres revisar?</label>
            <select id="pricing-months" className={selectStyle} value={months} onChange={(e) => setMonths(Number(e.target.value))}>
              {periods.map((n) => <option key={n} value={n}>{n} {n === 1 ? "mes" : "meses"}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pricing-users" className="text-sm font-bold">¿Cuántas personas trabajan contigo?</label>
            <select id="pricing-users" className={selectStyle} value={teamUsers} onChange={(e) => setTeamUsers(Number(e.target.value))}>
              {[1, 5, 10, 25, 50, 100, 500].map((n) => <option key={n} value={n}>{n === 500 ? "500 o más" : n}</option>)}
            </select>
            <p className="mt-1 text-xs text-suma-cream/60">SUMA no cobra extra por integrante. El proveedor del programa podría cobrar licencias.</p>
          </div>
          <div>
            <label htmlFor="pricing-locations" className="text-sm font-bold">¿Cuántas sucursales tienes?</label>
            <select id="pricing-locations" className={selectStyle} value={locations} onChange={(e) => setLocations(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 10].map((n) => <option key={n} value={n}>{n === 10 ? "10 o más" : n}</option>)}
            </select>
            {locations > 1 && <p className="mt-1 text-xs font-semibold text-suma-orange">Este precio es para 1 sucursal. Las demás necesitan una cotización.</p>}
          </div>
          <div>
            <label htmlFor="pricing-business" className="text-sm font-bold">¿Qué tipo de negocio tienes?</label>
            <select id="pricing-business" className={selectStyle} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
              {["Pilates / yoga", "Spa / estética", "Fitness boutique", "Profesional wellness", "Otro negocio"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pricing-goal" className="text-sm font-bold">¿Qué quieres mejorar?</label>
            <select id="pricing-goal" className={selectStyle} value={goal} onChange={(e) => setGoal(e.target.value)}>
              {["Atraer más clientes", "Responder consultas", "Organizar clientes / CRM", "Evitar oportunidades sin seguimiento", "Publicidad + atención + seguimiento", "Desarrollo a medida"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pricing-platform" className="text-sm font-bold">¿Dónde recibes consultas o reservas?</label>
            <select id="pricing-platform" className={selectStyle} value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {["WhatsApp", "Wellhub / TotalPass / Fitpass", "Fitco / Fitune", "Reservador propio", "Instagram / Facebook", "Sin plataforma todavía", "Otro"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {quote.hasAds && (
          <div className="mt-6">
            <label htmlFor="pricing-ads" className="text-sm font-bold">¿Cuánto invertirías en anuncios cada mes?</label>
            <select id="pricing-ads" className={selectStyle} value={adBudget} onChange={(e) => setAdBudget(Number(e.target.value))}>
              {pricingSettings.adBudgets.map((n) => <option key={n} value={n}>{formatMXN(n)} al mes</option>)}
            </select>
            <p className="mt-1 text-xs text-suma-cream/60">Este dinero lo pagas a Facebook, Instagram o Google; no es parte de la mensualidad de SUMA.</p>
            <PricingWhatIs explanation={pricingConcepts.external} dark compact />
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="pricing-notes" className="text-sm font-bold">¿Qué más te gustaría resolver? (opcional)</label>
          <textarea id="pricing-notes" rows={2} maxLength={180} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Por ejemplo: quiero más primeras visitas sin cambiar mi reservador."
            className="mt-2 w-full rounded-xl border border-suma-cream/30 bg-suma-navy p-3 text-base text-suma-cream placeholder:text-suma-cream/40 focus-visible:outline-suma-orange"/>
        </div>
      </div>

      <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-[1.5rem] bg-suma-cream p-6 text-suma-navy md:p-8">
          <div aria-live="polite" aria-atomic="true">
            <p className="text-eyebrow text-suma-purple">{mode === "package" ? quote.plan.name : "Mi selección"}</p>
            <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">
              {mode === "services" ? "Funciones elegidas" : "Plan base"} · {quote.locations} {quote.locations === 1 ? "sucursal" : "sucursales"}
            </p>
            {mode === "package" && <PricingWhatIs explanation={planExplanations[quote.plan.id]} subject={quote.plan.name} compact />}
            {mode === "package" && manualPlanId === null && !requestedPlan && (
              <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">Mostramos Flow como ejemplo. Puedes elegir Ads o Growth sin compromiso.</p>
            )}
            <p className="sr-only">El desglose se actualiza cuando eliges un plan o una función.</p>
            {quote.isEmpty ? (
              <p className="mt-7 rounded-xl bg-suma-navy/10 p-4 text-sm">Marca una función para ver qué incluye y cuánto costaría.</p>
            ) : (
              <>
                <p className="mt-6 text-sm font-semibold text-suma-navy/65">Lo que pagarías al empezar · desde</p>
                <p className="mt-2 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-none tracking-tight tabular-nums">{formatMXNExact(quote.firstPaymentSuma)}</p>
                <p className="mt-2 text-xs text-suma-navy/60">
                  {quote.setupPayments === 1 ? "Configuración completa" : "Primer abono de configuración"} + primer mes de SUMA, antes de IVA.
                </p>
                <p className="mt-2 text-sm font-semibold text-suma-navy/80">
                  Con IVA general del 16%, si aplica: {formatMXNExact(quote.firstPaymentSuma * 1.16)}
                </p>
                <PricingWhatIs explanation={pricingConcepts.vat} compact />
                <dl className="mt-7 divide-y divide-suma-navy/15 border-y border-suma-navy/15">
                  <div className="flex items-start justify-between gap-3 py-3 text-sm">
                    <dt className="min-w-0 flex-1">
                      <strong>Pago de configuración (una vez)</strong>
                      <PricingWhatIs explanation={pricingConcepts.setup} compact />
                    </dt>
                    <dd className="shrink-0 pt-1 font-bold tabular-nums">{formatMXN(quote.setup)}</dd>
                  </div>
                  {quote.setupPayments > 1 && <div className="flex items-start justify-between gap-3 py-3 text-sm">
                    <dt className="min-w-0 flex-1">
                      <strong>Primer abono de {quote.setupPayments}</strong>
                      <PricingWhatIs explanation={pricingConcepts.payments} compact />
                    </dt>
                    <dd className="shrink-0 pt-1 font-bold tabular-nums">{formatMXNExact(quote.setupInstallment)}</dd>
                  </div>}
                  <div className="flex items-start justify-between gap-3 py-3 text-sm">
                    <dt className="min-w-0 flex-1">
                      <strong>Servicio de SUMA al mes</strong>
                      <PricingWhatIs explanation={pricingConcepts.monthly} compact />
                    </dt>
                    <dd className="shrink-0 pt-1 font-bold tabular-nums">{formatMXN(quote.monthlySuma)}</dd>
                  </div>
                  {quote.hasAds && <div className="flex items-start justify-between gap-3 py-3 text-sm">
                    <dt className="min-w-0 flex-1">
                      <strong>Anuncios al mes (gasto aparte)</strong>
                      <PricingWhatIs explanation={pricingConcepts.external} compact />
                    </dt>
                    <dd className="shrink-0 pt-1 font-bold tabular-nums">{formatMXN(quote.monthlyAds)}</dd>
                  </div>}
                </dl>
                <div className="mt-6 rounded-xl bg-suma-navy/7 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-suma-navy/60">Precios de referencia para 1 sucursal</p>
                  <p className="mt-2 text-sm">Configuración: <strong>{formatMXN(quote.setup)}–{formatMXN(quote.setupMax)}</strong></p>
                  {quote.monthlyMax > 0 && <p className="mt-1 text-sm">Servicio mensual: <strong>{formatMXN(quote.monthlySuma)}–{formatMXN(quote.monthlyMax)}</strong></p>}
                  <p className="mt-2 text-xs text-suma-navy/65">«Desde» es el precio de la versión sencilla. Si necesitas más funciones, revisamos el precio contigo.</p>
                  <PricingWhatIs explanation={pricingConcepts.range} compact />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-suma-navy/60">Costo de {quote.months} {quote.months === 1 ? "mes" : "meses"}: configuración completa + servicio</p>
                <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">{formatMXN(quote.totalSuma)} <span className="text-sm font-normal">desde, antes de IVA</span></p>
                <p className="mt-1 text-sm text-suma-navy/65">Precio de referencia del periodo: {formatMXN(quote.totalSuma)}–{formatMXN(quote.totalSumaMax)}. No es cotización definitiva.</p>
                {quote.hasAds && <p className="mt-1 text-xs text-suma-navy/65">+ {formatMXN(quote.totalExternalAds)} para anuncios, pagados aparte, en ese periodo.</p>}
                {quote.setupPayments > 1 && <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">
                  Este total incluye toda la configuración, aunque algún abono se pague después del periodo seleccionado.
                </p>}
                <PricingWhatIs explanation={pricingConcepts.period} compact />
                {quote.services.length > 0 && <div className="mt-6 border-t border-suma-navy/15 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-suma-navy/60">Funciones adicionales elegidas</p>
                  <ul className="mt-2 space-y-2 text-xs text-suma-navy/75">{quote.services.map((s) => (
                    <li key={s.id} className="rounded-lg border border-suma-navy/10 p-2">
                      <span className="font-bold">✓ {s.name}</span>
                      <PricingWhatIs explanation={serviceExplanations[s.id]} compact />
                    </li>
                  ))}</ul>
                </div>}
              </>
            )}
          </div>

          {quote.isEmpty ? (
            <p className="mt-8 rounded-full bg-suma-navy/10 p-4 text-center text-sm font-bold">Elige un servicio para continuar</p>
          ) : (
            <a href={pricingWhatsAppHref(selection)} target="_blank" rel="noopener noreferrer"
              data-pricing-plan={mode === "package" ? planId : "individuales"} data-pricing-source="estimator"
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-suma-navy px-6 text-center font-bold text-suma-cream transition-colors hover:bg-suma-purple">
              Personalizar y consultar por WhatsApp →
            </a>
          )}
          <p className="mt-4 text-xs leading-relaxed text-suma-navy/65">
            Precios base para 1 sucursal, antes de IVA. El costo final se confirma antes de contratar. Anuncios, licencias y herramientas de otras empresas van aparte. Si tienes más sucursales, cotizamos el proyecto completo. Los abonos se acuerdan por escrito.
          </p>
        </div>
      </div>
    </div>
  );
}
