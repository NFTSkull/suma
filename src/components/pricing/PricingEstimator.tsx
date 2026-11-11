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
import { describeSelectedServices, planStories } from "@/content/sales-clarity";
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
  const [months, setMonths] = useState(3);
  const [setupPayments, setSetupPayments] = useState<SetupPayments>(3);
  const [adBudget, setAdBudget] = useState<number>(pricingSettings.defaultAdBudget);
  const [locations, setLocations] = useState(1);
  const [teamUsers, setTeamUsers] = useState(5);
  const [businessType, setBusinessType] = useState("Pilates / yoga");
  const [goal, setGoal] = useState(planStories.flow.goal);
  const [platform, setPlatform] = useState("WhatsApp");
  const [notes, setNotes] = useState("");

  const selection: PricingSelection = {
    mode, planId, serviceIds, months, setupPayments, adBudget, locations, teamUsers,
    businessType, goal, platform, notes,
  };
  const quote = estimatePricing(selection);
  const paymentOptions = availableSetupPayments(quote.setup);
  const story = planStories[planId];
  const chosenDetails = describeSelectedServices(quote.services.map((service) => service.id));
  const selectedExtras = quote.services.length;
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
        <h3 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">Elige lo que necesitas. Conoce la inversión.</h3>
        <p className="mt-3 text-sm leading-relaxed text-suma-cream/75">
          Primero elige qué quieres resolver. Al cambiar tu plan o agregar una función, verás cómo cambia la propuesta y cuánto pagarías. Sin contratar todavía.
        </p>

        <fieldset className="mt-8">
          <legend className="mb-3 text-sm font-bold">1. ¿Prefieres una solución lista o elegir cada función?</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={mode === "package"} onClick={() => setManualMode("package")}
              className={optionButton + (mode === "package" ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
              Un plan recomendado
            </button>
            <button type="button" aria-pressed={mode === "services"} onClick={() => setManualMode("services")}
              className={optionButton + (mode === "services" ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
              Elegir funciones
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
                    setManualPlanId(plan.id);
                    setGoal(planStories[plan.id].goal);
                    track({ event: "pricing_plan_selected", plan: plan.id });
                  }}
                  className={optionButton + (planId === plan.id ? " border-suma-orange bg-suma-orange text-suma-navy" : " border-suma-cream/30 hover:border-suma-orange")}>
                  <span className="block">{plan.name}</span>
                  <span className="mt-1 block text-xs font-normal leading-snug opacity-80">{planStories[plan.id].goal}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="mt-7">
          <legend className="mb-1 text-sm font-bold">{mode === "package" ? "3. ¿Necesitas alguna función adicional?" : "2. ¿Qué quieres que hagamos por tu negocio?"}</legend>
          <p className="mb-3 text-xs text-suma-cream/65">
            {mode === "package"
              ? "Tu paquete ya incluye lo esencial. Agrega algo solo si realmente lo necesitas; nunca cobramos dos veces lo incluido."
              : "Selecciona una o varias opciones. La propuesta a la derecha cambia al momento."}
          </p>
          {mode === "package" && (
            <button type="button" aria-expanded={showExtras} onClick={() => setShowExtras((value) => !value)}
              className="mb-4 flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border border-white/35 bg-white/10 px-4 text-left text-sm font-bold transition-colors hover:border-suma-orange">
              <span>{selectedExtras > 0 ? selectedExtras + (selectedExtras === 1 ? " extra seleccionado" : " extras seleccionados") : "Ver funciones opcionales"}</span>
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
                    <label key={s.id} className="flex cursor-pointer gap-3 rounded-xl border border-suma-cream/20 bg-suma-cream/5 p-3 hover:border-suma-cream/60">
                      <input type="checkbox" className="mt-1 size-4 shrink-0 accent-suma-orange" checked={serviceIds.includes(s.id)}
                        onChange={(e) => toggleService(s.id, e.target.checked)} aria-label={s.name}/>
                      <span className="text-sm">
                        <strong className="block leading-snug">{s.name}</strong>
                        <span className="mt-1 block text-xs text-suma-cream/75">
                          {s.detail}
                        </span>
                        <span className="mt-2 block text-xs font-bold text-suma-orange">
                          {s.from ? "Desde " : ""}{formatMXN(s.setup || s.monthly)}{s.setup === 0 ? "/mes" : s.monthly ? " una vez + " + formatMXN(s.monthly) + "/mes" : " · una vez"}
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
            <legend className="px-2 text-sm font-bold">Paga la implementación a tu ritmo</legend>
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
                ? "Una sola implementación, pagada al iniciar."
                : "Primer abono de implementación " + formatMXNExact(quote.setupInstallment) + ". Último abono " + formatMXNExact(quote.setupFinalInstallment) + ". No cambia el precio total de implementación."}
              {" "}Las parcialidades están sujetas a un acuerdo comercial por escrito; no son una financiación aprobada ni cobros automáticos.
            </p>
          </fieldset>
        )}

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pricing-months" className="text-sm font-bold">Periodo de referencia</label>
            <select id="pricing-months" className={selectStyle} value={months} onChange={(e) => setMonths(Number(e.target.value))}>
              {periods.map((n) => <option key={n} value={n}>{n} {n === 1 ? "mes" : "meses"}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pricing-users" className="text-sm font-bold">Personas de tu equipo</label>
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
            <label htmlFor="pricing-goal" className="text-sm font-bold">¿Cuál es tu prioridad?</label>
            <select id="pricing-goal" className={selectStyle} value={goal} onChange={(e) => setGoal(e.target.value)}>
              {["Quiero que más personas me conozcan", "Quiero ordenar los mensajes y no olvidar seguimientos", "Quiero atraer interesados y organizar su atención", "Atraer más clientes", "Responder consultas", "Organizar clientes / CRM", "Evitar oportunidades sin seguimiento", "Publicidad + atención + seguimiento", "Desarrollo a medida"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pricing-platform" className="text-sm font-bold">Canal o reservador actual</label>
            <select id="pricing-platform" className={selectStyle} value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {["WhatsApp", "Wellhub / TotalPass / Fitpass", "Fitco / Fitune", "Reservador propio", "Instagram / Facebook", "Sin plataforma todavía", "Otro"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {quote.hasAds && (
          <div className="mt-6">
            <label htmlFor="pricing-ads" className="text-sm font-bold">Pauta mensual estimada (se paga a la plataforma)</label>
            <select id="pricing-ads" className={selectStyle} value={adBudget} onChange={(e) => setAdBudget(Number(e.target.value))}>
              {pricingSettings.adBudgets.map((n) => <option key={n} value={n}>{formatMXN(n)} al mes</option>)}
            </select>
            <p className="mt-1 text-xs text-suma-cream/60">Presupuesto hipotético, no cobro de SUMA ni promesa de resultados.</p>
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
              {mode === "services" ? "Servicios independientes" : "Paquete base"} · {quote.locations} {quote.locations === 1 ? "sede" : "sedes"} · {quote.teamUsers} integrantes
            </p>
            {quote.isEmpty ? (
              <p className="mt-7 rounded-xl bg-suma-navy/10 p-4 text-sm">Elige al menos una función y aquí verás qué incluye y cuánto pagarías.</p>
            ) : (
              <>
                <div className="mt-5 rounded-2xl border border-suma-navy/10 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-suma-purple">Así funcionaría lo que elegiste</p>
                  {mode === "package" ? (
                    <>
                      <h4 className="mt-2 font-display text-base font-extrabold text-suma-navy">{story.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-suma-navy/70">{story.intro}</p>
                      <ol className="mt-3 space-y-2">
                        {story.steps.map((step, index) => (
                          <li key={step} className="flex gap-2 text-xs leading-relaxed text-suma-navy/85">
                            <span className="font-bold text-suma-purple">{index + 1}.</span>{step}
                          </li>
                        ))}
                      </ol>
                      {chosenDetails.length > 0 && (
                        <p className="mt-3 border-t border-suma-line pt-3 text-xs text-suma-navy/75">
                          <strong>También elegiste:</strong> {chosenDetails.join(" ")}
                        </p>
                      )}
                      <p className="mt-3 text-xs leading-relaxed text-suma-navy/60">{story.boundary}</p>
                    </>
                  ) : (
                    <>
                      <h4 className="mt-2 font-display text-base font-extrabold text-suma-navy">Tu solución, sin complicaciones</h4>
                      <ul className="mt-2 space-y-2">
                        {chosenDetails.map((detail) => (
                          <li key={detail} className="text-xs leading-relaxed text-suma-navy/80">✓ {detail}</li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs leading-relaxed text-suma-navy/60">Las conexiones reales dependen de permisos, herramientas y el alcance confirmado.</p>
                    </>
                  )}
                </div>
                <p className="mt-6 text-sm font-semibold text-suma-navy/65">{quote.isStartingPrice ? "Primer desembolso estimado desde" : "Primer desembolso estimado a SUMA"}</p>
                <p className="mt-2 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-none tracking-tight tabular-nums">{formatMXNExact(quote.firstPaymentSuma)}</p>
                <p className="mt-2 text-xs text-suma-navy/60">
                  {quote.setupPayments === 1 ? "Implementación completa" : "Primera parcialidad de implementación"} + primer mes de servicio, antes de IVA.
                </p>
                <p className="mt-2 text-sm font-semibold text-suma-navy/80">
                  Primer desembolso con IVA general del 16%, si aplica: {formatMXNExact(quote.firstPaymentSuma * 1.16)}
                </p>
                <dl className="mt-7 divide-y divide-suma-navy/15 border-y border-suma-navy/15">
                  <div className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>Implementación única</dt><dd className="font-bold tabular-nums">{formatMXN(quote.setup)}</dd>
                  </div>
                  {quote.setupPayments > 1 && <div className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>Implementación: {quote.setupPayments} abonos (primero)</dt><dd className="font-bold tabular-nums">{formatMXNExact(quote.setupInstallment)}</dd>
                  </div>}
                  <div className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>Mensualidad SUMA</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlySuma)}</dd>
                  </div>
                  {quote.hasAds && <div className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>Pauta mensual externa</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlyAds)}</dd>
                  </div>}
                </dl>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-suma-navy/60">Costo total SUMA: implementación íntegra + {quote.months} {quote.months === 1 ? "mes de servicio" : "meses de servicio"}</p>
                <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">{formatMXN(quote.totalSuma)}</p>
                <p className="mt-2 text-xs text-suma-navy/70">Total de servicios SUMA incluyendo IVA general del 16%, si aplica: {formatMXNExact(quote.totalSuma * 1.16)}.</p>
                {quote.hasAds && <p className="mt-1 text-xs text-suma-navy/65">+ {formatMXN(quote.totalExternalAds)} de pauta externa estimada en ese periodo.</p>}
                {quote.setupPayments > 1 && <p className="mt-2 text-xs leading-relaxed text-suma-navy/65">
                  El costo total incluye todas las parcialidades de implementación, aunque alguna venza después de los {quote.months} {quote.months === 1 ? "mes" : "meses"} elegidos.
                </p>}
                {quote.services.length > 0 && <div className="mt-6 border-t border-suma-navy/15 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-suma-navy/60">Servicios elegidos</p>
                  <ul className="mt-2 space-y-1 text-xs text-suma-navy/75">{quote.services.map((s) => <li key={s.id}>✓ {s.name}{s.from ? " (desde)" : ""}</li>)}</ul>
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
            Los importes con IVA son orientativos y no constituyen cálculo fiscal personalizado. Modalidad en abonos sujeta a acuerdo escrito; no se financia ni cobra automáticamente. Referencia no vinculante, antes de IVA. No incluye licencias, pautas, costos WhatsApp API ni consumos de IA. En CRM de terceros puede haber licencias por usuario; SUMA no agrega tarifas por asiento. Multi-sede e integraciones personalizadas se cotizan tras diagnóstico.
          </p>
        </div>
      </div>
    </div>
  );
}
