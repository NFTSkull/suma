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
  const mode = manualMode ?? (routeService ? "services" : "package");
  const planId = manualPlanId ?? routePlan;
  const serviceIds = manualServiceIds ?? (routeService ? [routeService] : []);
  const [months, setMonths] = useState<number>(pricingSettings.defaultMonths);
  const [setupPayments, setSetupPayments] = useState<SetupPayments>(pricingSettings.defaultSetupPayments);
  const [adBudget, setAdBudget] = useState<number>(pricingSettings.defaultAdBudget);
  const [locations, setLocations] = useState(1);
  const [teamUsers, setTeamUsers] = useState(5);
  const [businessType, setBusinessType] = useState("Pilates / yoga");
  const [goal, setGoal] = useState("Atraer más clientes");
  const [platform, setPlatform] = useState("WhatsApp");
  const [notes, setNotes] = useState("");

  const selection: PricingSelection = {
    mode, planId, serviceIds, months, setupPayments, adBudget, locations, teamUsers,
    businessType, goal, platform, notes,
  };
  const quote = estimatePricing(selection);
  const paymentOptions = availableSetupPayments(quote.setup);
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
    <div className="grid gap-8 rounded-[2rem] bg-suma-navy p-5 text-suma-cream shadow-lift md:p-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:p-12">
      <div>
        <p className="text-eyebrow text-suma-orange">Tu solución, a tu medida</p>
        <h3 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">Elige lo que necesitas. Conoce la inversión.</h3>
        <p className="mt-3 text-sm leading-relaxed text-suma-cream/75">
          Elige un plan o servicio. Verás cuánto cuesta la opción básica y un rango según lo que necesites.
        </p>

        <fieldset className="mt-8">
          <legend className="mb-3 text-sm font-bold">1. ¿Cómo prefieres contratar?</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={mode === "package"} onClick={() => { if (mode !== "package") setManualServiceIds([]); setManualMode("package"); }}
              className={optionButton + (mode === "package" ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
              Elegir un paquete
            </button>
            <button type="button" aria-pressed={mode === "services"} onClick={() => { if (mode !== "services") setManualServiceIds([]); setManualMode("services"); }}
              className={optionButton + (mode === "services" ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
              Solo servicios
            </button>
          </div>
        </fieldset>

        {mode === "package" && (
          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-bold">2. Punto de partida</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {pricingPlans.map((plan) => (
                <button key={plan.id} type="button" aria-pressed={planId === plan.id}
                  onClick={() => {
                    if (plan.id !== planId) setManualServiceIds([]);
                    setManualPlanId(plan.id);
                    track({ event: "pricing_plan_selected", plan: plan.id });
                  }}
                  className={optionButton + (planId === plan.id ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
                  {plan.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="mt-7">
          <legend className="mb-1 text-sm font-bold">{mode === "package" ? "3. Complementa tu paquete (opcional)" : "2. Elige uno o varios servicios"}</legend>
          <p className="mb-4 text-xs text-suma-cream/65">No cobramos dos veces lo que ya trae un plan. Los importes mostrados corresponden a una opción básica.</p>
          {categories.map((category) => {
            const services = individualServices.filter((s) => s.category === category && !included.includes(s.id));
            if (!services.length) return null;
            return (
              <div key={category} className="mb-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-suma-orange">{category}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {services.map((s) => (
                    <label key={s.id} className="flex cursor-pointer gap-3 rounded-xl border border-suma-cream/20 bg-suma-cream/5 p-3 hover:border-suma-cream/60">
                      <input type="checkbox" className="mt-1 size-4 shrink-0 accent-suma-orange" checked={serviceIds.includes(s.id)}
                        onChange={(e) => toggleService(s.id, e.target.checked)} aria-label={s.name}/>
                      <span className="text-sm">
                        <strong className="block leading-snug">{s.name}</strong>
                        <span className="mt-1 block text-xs text-suma-cream/70">
                          {formatMXN(s.setup || s.monthly)}{s.setup === 0 ? "/mes" : s.monthly ? " inicial · " + formatMXN(s.monthly) + "–" + formatMXN(s.monthlyMax) + "/mes" : " · pago único"}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </fieldset>

        {quote.setup > 0 && (
          <fieldset className="mt-7 rounded-2xl border border-white/20 bg-white/5 p-4">
            <legend className="px-2 text-sm font-bold">¿Quieres dividir el pago inicial?</legend>
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
                : "Primer pago mínimo orientativo " + formatMXNExact(quote.setupInstallment) + ". Último abono " + formatMXNExact(quote.setupFinalInstallment) + ". Dividir el pago no cambia el costo mínimo."}
              {" "}Las parcialidades están sujetas a un acuerdo comercial por escrito; no son una financiación aprobada ni cobros automáticos.
            </p>
          </fieldset>
        )}

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pricing-months" className="text-sm font-bold">¿Cuántos meses quieres comparar?</label>
            <select id="pricing-months" className={selectStyle} value={months} onChange={(e) => setMonths(Number(e.target.value))}>
              {periods.map((n) => <option key={n} value={n}>{n} {n === 1 ? "mes" : "meses"}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pricing-users" className="text-sm font-bold">¿Cuántas personas trabajan contigo?</label>
            <select id="pricing-users" className={selectStyle} value={teamUsers} onChange={(e) => setTeamUsers(Number(e.target.value))}>
              {[1, 5, 10, 25, 50, 100, 500].map((n) => <option key={n} value={n}>{n === 500 ? "500 o más" : n}</option>)}
            </select>
            <p className="mt-1 text-xs text-suma-cream/60">Sin recargo de SUMA por asiento; licencias de terceros aparte.</p>
          </div>
          <div>
            <label htmlFor="pricing-locations" className="text-sm font-bold">Número de sedes</label>
            <select id="pricing-locations" className={selectStyle} value={locations} onChange={(e) => setLocations(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 10].map((n) => <option key={n} value={n}>{n === 10 ? "10 o más" : n}</option>)}
            </select>
            {locations > 1 && <p className="mt-1 text-xs font-semibold text-suma-orange">Importe base para una sede. Cotizaremos las demás.</p>}
          </div>
          <div>
            <label htmlFor="pricing-business" className="text-sm font-bold">Tu negocio</label>
            <select id="pricing-business" className={selectStyle} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
              {["Pilates / yoga", "Spa / estética", "Fitness boutique", "Profesional wellness", "Otro negocio"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pricing-goal" className="text-sm font-bold">Tu prioridad</label>
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
            <label htmlFor="pricing-ads" className="text-sm font-bold">¿Cuánto te gustaría gastar en anuncios cada mes? (aparte)</label>
            <select id="pricing-ads" className={selectStyle} value={adBudget} onChange={(e) => setAdBudget(Number(e.target.value))}>
              {pricingSettings.adBudgets.map((n) => <option key={n} value={n}>{formatMXN(n)} al mes</option>)}
            </select>
            <p className="mt-1 text-xs text-suma-cream/60">Este dinero lo pagas a Meta o Google, no a SUMA. No garantiza ventas.</p>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="pricing-notes" className="text-sm font-bold">¿Qué más te gustaría resolver? (opcional)</label>
          <textarea id="pricing-notes" rows={2} maxLength={180} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Por ejemplo: quiero más primeras visitas sin cambiar mi reservador."
            className="mt-2 w-full rounded-xl border border-suma-cream/30 bg-suma-navy p-3 text-base text-suma-cream placeholder:text-suma-cream/40 focus-visible:outline-suma-orange"/>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[1.5rem] bg-suma-cream p-6 text-suma-navy md:p-8">
          <div aria-live="polite" aria-atomic="true">
            <p className="text-eyebrow text-suma-purple">{mode === "package" ? quote.plan.name : "Mi selección"}</p>
            <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">
              {mode === "services" ? "Servicios independientes" : "Paquete base"} · {quote.locations} {quote.locations === 1 ? "sede" : "sedes"} · {quote.teamUsers} integrantes
            </p>
            {quote.isEmpty ? (
              <p className="mt-7 rounded-xl bg-suma-navy/10 p-4 text-sm">Selecciona al menos un servicio para ver la inversión.</p>
            ) : (
              <>
                <p className="mt-6 text-sm font-semibold text-suma-navy/65">Opción básica · primer pago estimado</p>
                <p className="mt-2 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-none tracking-tight tabular-nums">{formatMXNExact(quote.firstPaymentSuma)}</p>
                <p className="mt-2 text-xs text-suma-navy/60">
                  {quote.setupPayments === 1 ? "Implementación completa" : "Primera parcialidad de implementación"} + primer mes de servicio, antes de IVA.
                </p>
                <p className="mt-2 text-sm font-semibold text-suma-navy/80">
                  Ejemplo con IVA del 16%, si aplica: {formatMXNExact(quote.firstPaymentSuma * 1.16)}
                </p>
                <dl className="mt-7 divide-y divide-suma-navy/15 border-y border-suma-navy/15">
                  <div className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>Pago inicial (una vez)</dt><dd className="font-bold tabular-nums">{formatMXN(quote.setup)}</dd>
                  </div>
                  {quote.setupPayments > 1 && <div className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>Implementación: {quote.setupPayments} abonos (primero)</dt><dd className="font-bold tabular-nums">{formatMXNExact(quote.setupInstallment)}</dd>
                  </div>}
                  <div className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>Servicio mensual</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlySuma)}</dd>
                  </div>
                  {quote.hasAds && <div className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>Pauta mensual externa</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlyAds)}</dd>
                  </div>}
                </dl>
                <div className="mt-6 rounded-xl bg-suma-navy/7 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-suma-navy/60">Rango estimado para tu selección · una sede</p>
                  <p className="mt-2 text-sm">Pago inicial (una vez): <strong>{formatMXN(quote.setup)}–{formatMXN(quote.setupMax)}</strong></p>
                  {quote.monthlyMax > 0 && <p className="mt-1 text-sm">Servicio por mes: <strong>{formatMXN(quote.monthlySuma)}–{formatMXN(quote.monthlyMax)}</strong></p>}
                  <p className="mt-2 text-xs text-suma-navy/65">La opción básica comienza en el primer importe. Los precios finales dependen de las funciones y pueden superar el rango.</p>
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-suma-navy/60">Ejemplo de {quote.months} {quote.months === 1 ? "mes" : "meses"}: pago inicial completo + servicio mensual</p>
                <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">{formatMXN(quote.totalSuma)} <span className="text-sm font-normal">mínimo orientativo</span></p>
                <p className="mt-1 text-sm text-suma-navy/65">Rango estimado del periodo: {formatMXN(quote.totalSuma)}–{formatMXN(quote.totalSumaMax)}. No es cotización definitiva.</p>
                {quote.hasAds && <p className="mt-1 text-xs text-suma-navy/65">+ {formatMXN(quote.totalExternalAds)} de pauta externa estimada en ese periodo.</p>}
                {quote.setupPayments > 1 && <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">
                  Este ejemplo incluye todo el pago inicial, aunque alguna parcialidad venza después de los {quote.months} {quote.months === 1 ? "mes" : "meses"} elegidos.
                </p>}
                {quote.services.length > 0 && <div className="mt-6 border-t border-suma-navy/15 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-suma-navy/60">Servicios elegidos</p>
                  <ul className="mt-2 space-y-1 text-xs text-suma-navy/75">{quote.services.map((s) => <li key={s.id}>✓ {s.name}</li>)}</ul>
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
            Precios de referencia para una sede, antes de IVA. El precio final depende de lo que necesites; lo confirmamos antes de empezar. Anuncios, licencias, dominio, mensajes y uso de IA van aparte. Si eliges varias sedes, preparamos un presupuesto especial. Las parcialidades requieren acuerdo por escrito.
          </p>
        </div>
      </div>
    </div>
  );
}
