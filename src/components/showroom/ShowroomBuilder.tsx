"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { showroomWhatsAppAttrs, track } from "@/lib/analytics";
import { individualServices, pricingPlans, pricingSettings, type IndividualServiceId, type PricingPlanId } from "@/content/pricing";
import { processSteps } from "@/content/process";
import {
  showroomExperiences, showroomIndustries, showroomPalettes,
  type ShowroomExperienceId, type ShowroomIndustryId, type ShowroomPaletteId,
} from "@/content/showroom";
import { cn } from "@/lib/cn";
import { availableSetupPayments, formatMXN, formatMXNExact, type SetupPayments } from "@/lib/pricing";
import { showroomEstimate, showroomWhatsAppHref, toggleShowroomService, type ShowroomSelection } from "@/lib/showroom";
import { ShowroomLivePreview } from "./ShowroomLivePreview";
import { ShowroomImpacto } from "./ShowroomImpacto";

/** Tasa general de IVA (SAT). Solo como referencia de desembolso. */
const IVA_RATE = 0.16;
const field = "mt-2 min-h-12 w-full rounded-xl border border-suma-line bg-white px-4 text-base text-suma-navy focus-visible:outline-2 focus-visible:outline-suma-orange";
const categories = ["Captación", "Atención", "Operación", "Presencia", "Desarrollo"] as const;
const guidedGoals = [
  { id: "captar", name: "Atraer más clientes", experience: "ads", recommendations: ["ads", "web", "seo"] },
  { id: "responder", name: "Responder mejor", experience: "crm", recommendations: ["crm", "chatbot", "automatizacion"] },
  { id: "operar", name: "Ordenar mi operación", experience: "reservas", recommendations: ["reservas", "app", "crm-medida"] },
] as const;
type GuidedGoalId = (typeof guidedGoals)[number]["id"];

const priceLine = (service: (typeof individualServices)[number]) =>
  (service.from ? "Desde " : "") + (service.setup
    ? formatMXN(service.setup) + " inicial" + (service.monthly ? " + " + formatMXN(service.monthly) + "/mes" : " · pago único")
    : formatMXN(service.monthly) + "/mes");

export function ShowroomBuilder() {
  const [industry, setIndustry] = useState<ShowroomIndustryId>("pilates");
  const [businessName, setBusinessName] = useState("");
  const [paletteId, setPaletteId] = useState<ShowroomPaletteId>("suma");
  const [experience, setExperience] = useState<ShowroomExperienceId>("crm");
  const [guidedGoal, setGuidedGoal] = useState<GuidedGoalId>("responder");
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [mode, setMode] = useState<"services" | "package">("services");
  const [planId, setPlanId] = useState<PricingPlanId>("flow");
  const [serviceIds, setServiceIds] = useState<IndividualServiceId[]>(["crm-gestionado"]);
  const [locations, setLocations] = useState(1);
  const [teamUsers, setTeamUsers] = useState(5);
  const [months, setMonths] = useState(1);
  const [setupPayments, setSetupPayments] = useState<SetupPayments>(3);
  const [adBudget, setAdBudget] = useState(6000);
  const [platform, setPlatform] = useState("WhatsApp / Instagram");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [availability, setAvailability] = useState("Por definir");

  const selection: ShowroomSelection = {
    businessName, industry, experience, serviceIds, mode, planId, months, setupPayments, adBudget,
    locations, teamUsers, platform, budget, notes, availability,
  };
  const quote = showroomEstimate(selection);
  const paymentOptions = availableSetupPayments(quote.setup);
  const active = showroomExperiences.find((item) => item.id === experience) ?? showroomExperiences[0];
  const activeGoal = guidedGoals.find((goal) => goal.id === guidedGoal) ?? guidedGoals[1];
  const visibleExperiences = showroomExperiences.filter((item) =>
    showAllExperiences || (activeGoal.recommendations as readonly string[]).includes(item.id)
  );
  const recommendedServices = new Set<IndividualServiceId>(
    showroomExperiences
      .filter((item) => (activeGoal.recommendations as readonly string[]).includes(item.id))
      .map((item) => item.serviceId),
  );
  const included: IndividualServiceId[] = mode === "package"
    ? planId === "growth" ? ["meta-ads", "crm-gestionado"]
      : planId === "ads" ? ["meta-ads"] : ["crm-gestionado"]
    : [];
  const selectedCurrent = serviceIds.includes(active.serviceId) || included.includes(active.serviceId);
  const addCurrent = () => {
    if (included.includes(active.serviceId)) return;
    if (!serviceIds.includes(active.serviceId)) setServiceIds((items) => toggleShowroomService(items, active.serviceId));
  };
  const toggle = (id: IndividualServiceId) =>
    setServiceIds((items) => toggleShowroomService(items, id));
  const availableServices = individualServices.filter((s) => !included.includes(s.id));
  const shownServices = showAllServices
    ? availableServices
    : availableServices.filter((s) => recommendedServices.has(s.id) || serviceIds.includes(s.id));
  const hiddenCount = availableServices.length - shownServices.length;

  // GA4: solo identificadores de catálogo; el nombre, las notas y los importes no salen del navegador.
  const personalizedSent = useRef(false);
  const personalized = (next: { industry?: ShowroomIndustryId; style?: ShowroomPaletteId }) => {
    if (personalizedSent.current) return;
    personalizedSent.current = true;
    track({ event: "showroom_personalized", industry: next.industry ?? industry, style: next.style ?? paletteId });
  };
  const showDemo = (goal: GuidedGoalId, id: ShowroomExperienceId) => {
    if (id !== experience) track({ event: "showroom_demo_viewed", goal, experience: id });
    setExperience(id);
  };
  const chargedServices = quote.services.length;
  const quoteKey = [mode, mode === "package" ? planId : "none", chargedServices, months].join("|");
  const lastQuoteKey = useRef(quoteKey);
  useEffect(() => {
    if (quoteKey === lastQuoteKey.current) return;
    const timer = setTimeout(() => {
      lastQuoteKey.current = quoteKey;
      track({ event: "showroom_quote_updated", mode, plan: mode === "package" ? planId : "none", services_count: chargedServices, months });
    }, 1500);
    return () => clearTimeout(timer);
  }, [quoteKey, mode, planId, chargedServices, months]);

  return (
    <div className="space-y-10">
      <section id="showroom-construir" aria-labelledby="showroom-custom-title" className="rounded-[2rem] border border-suma-line bg-suma-cream-soft p-5 shadow-soft md:p-8">
        <p className="text-eyebrow text-suma-orange-ink">01 · Personaliza</p>
        <h2 id="showroom-custom-title" className="mt-2 font-display text-2xl font-extrabold text-suma-navy md:text-3xl">Pon tu marca en la demo.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="showroom-name" className="text-sm font-bold text-suma-navy">Nombre de tu negocio</label>
            <input id="showroom-name" maxLength={45} value={businessName} onChange={(e) => { personalized({}); setBusinessName(e.target.value); }}
              className={field} placeholder="Ej. Estudio Aurora" autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="showroom-industry" className="text-sm font-bold text-suma-navy">Giro</label>
            <select id="showroom-industry" value={industry} onChange={(e) => { personalized({ industry: e.target.value as ShowroomIndustryId }); setIndustry(e.target.value as ShowroomIndustryId); }} className={field}>
              {showroomIndustries.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="showroom-palette" className="text-sm font-bold text-suma-navy">Estilo de la demo</label>
            <select id="showroom-palette" value={paletteId} onChange={(e) => { personalized({ style: e.target.value as ShowroomPaletteId }); setPaletteId(e.target.value as ShowroomPaletteId); }} className={field}>
              {showroomPalettes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
        </div>
        <p className="mt-4 text-xs text-suma-navy/60">Solo cambia la demo en tu navegador. No se guarda ni se envía.</p>
      </section>

      <section id="showroom-explorar" aria-labelledby="showroom-preview-title"
        className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-7">
        <div className="rounded-[2rem] bg-suma-navy p-5 text-suma-cream md:p-7 lg:col-start-1 lg:row-start-1">
          <p className="text-eyebrow text-suma-orange">02 · Pruébalo</p>
          <h2 id="showroom-preview-title" className="mt-3 font-display text-3xl font-extrabold">Mira cómo podría funcionar.</h2>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-suma-orange">¿Qué quieres mejorar primero?</p>
          <div role="group" aria-label="Objetivo principal del negocio" className="mt-3 flex flex-wrap gap-2">
            {guidedGoals.map((goal) => (
              <button key={goal.id} type="button" aria-pressed={guidedGoal === goal.id}
                onClick={() => {
                  setGuidedGoal(goal.id);
                  showDemo(goal.id, goal.experience as ShowroomExperienceId);
                }}
                className={"min-h-11 rounded-full border px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-suma-orange " +
                  (guidedGoal === goal.id ? "border-suma-orange bg-suma-orange text-suma-navy" : "border-white/30 bg-white/5 text-white hover:border-white")}>
                {goal.name}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Experiencias para probar" className="mt-5 grid grid-cols-2 gap-2">
            {visibleExperiences.map((item) => (
              <button key={item.id} type="button" aria-pressed={experience === item.id}
                onClick={() => showDemo(guidedGoal, item.id)}
                className={"min-h-[4.5rem] rounded-2xl border px-3 py-3 text-left transition-colors focus-visible:outline-suma-orange " +
                  (experience === item.id
                    ? "border-suma-orange bg-suma-orange text-suma-navy"
                    : "border-white/20 bg-white/5 text-white hover:border-white/60")}>
                <span className="block text-xs font-semibold opacity-65">{item.category}</span>
                <span className="mt-1 block text-sm font-bold leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setShowAllExperiences((current) => !current)}
            aria-expanded={showAllExperiences}
            className="mt-3 min-h-11 w-full rounded-xl border border-white/25 px-4 text-sm font-bold text-suma-cream transition-colors hover:border-suma-orange">
            {showAllExperiences ? "Ver solo las 3 sugeridas ↑" : "Ver las 9 demos ↓"}
          </button>
        </div>

        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ShowroomLivePreview experience={experience} industry={industry} brandName={businessName} paletteId={paletteId} />
          <p className="mt-3 text-center text-xs leading-relaxed text-suma-navy/60">
            Prototipo con datos ficticios: no envía mensajes, no crea reservas ni se conecta a otras plataformas.
          </p>
        </div>

        <div className="rounded-[2rem] border border-suma-line bg-white p-5 md:p-6 lg:col-start-1 lg:row-start-2">
          <p className="text-xs font-bold uppercase tracking-widest text-suma-purple">Estás viendo</p>
          <p className="mt-2 font-display text-xl font-bold text-suma-navy">{active.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-suma-navy/75">{active.lead}</p>
          <p className="mt-2 text-xs text-suma-navy/55">{active.detail}</p>
          {selectedCurrent ? (
            <p role="status" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-50 px-5 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
              <span aria-hidden="true">✓</span> Ya está en tu propuesta
            </p>
          ) : (
            <button type="button" onClick={addCurrent}
              className="mt-5 min-h-12 w-full rounded-full bg-suma-navy px-5 text-sm font-bold text-suma-cream transition-colors hover:bg-suma-purple">
              Añadir a mi propuesta +
            </button>
          )}
          <Link href={active.href} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-suma-navy underline decoration-suma-orange underline-offset-4">
            Ver detalles de este servicio →
          </Link>
        </div>
      </section>

      <ShowroomImpacto selection={selection} quote={quote} onMonthsChange={setMonths} />

      <section id="showroom-cotizar" aria-labelledby="showroom-price-title" className="rounded-[2rem] bg-suma-cream-deep/60 p-5 md:p-8">
        <div className="mb-7">
          <p className="text-eyebrow text-suma-orange-ink">04 · Tu propuesta</p>
          <h2 id="showroom-price-title" className="mt-3 font-display text-3xl font-extrabold text-suma-navy">Elige qué contratar y ve cuánto pagarías.</h2>
          <p className="mt-3 max-w-3xl text-sm text-suma-navy/70">Precios del catálogo público de SUMA, antes de IVA y sin descuentos ocultos. Lo que eliges aquí también actualiza el cálculo del paso 3.</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-7">
            <fieldset>
              <legend className="text-sm font-bold text-suma-navy">¿Cómo prefieres contratar?</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" aria-pressed={mode === "services"} onClick={() => setMode("services")}
                  className={"min-h-12 rounded-xl border px-4 text-sm font-bold " + (mode === "services" ? "border-suma-navy bg-suma-navy text-white" : "border-suma-line bg-white text-suma-navy")}>
                  Por módulos
                </button>
                <button type="button" aria-pressed={mode === "package"} onClick={() => setMode("package")}
                  className={"min-h-12 rounded-xl border px-4 text-sm font-bold " + (mode === "package" ? "border-suma-navy bg-suma-navy text-white" : "border-suma-line bg-white text-suma-navy")}>
                  Paquete + extras
                </button>
              </div>
            </fieldset>

            {mode === "package" && (
              <fieldset>
                <legend className="text-sm font-bold text-suma-navy">Paquete base</legend>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {pricingPlans.map((plan) => (
                    <button key={plan.id} type="button" aria-pressed={planId === plan.id} onClick={() => setPlanId(plan.id)}
                      className={"min-h-14 rounded-xl border p-2 text-sm font-bold " + (planId === plan.id ? "border-suma-purple bg-suma-purple text-white" : "border-suma-line bg-white text-suma-navy")}>
                      <span className="block">{plan.name}</span>
                      <span className={"block text-[0.7rem] font-semibold " + (planId === plan.id ? "text-white/75" : "text-suma-navy/60")}>{plan.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-suma-navy/60">Lo que ya incluye un paquete no se cobra dos veces.</p>
              </fieldset>
            )}

            <fieldset>
              <legend className="text-sm font-bold text-suma-navy">{mode === "package" ? "Extras opcionales" : "Módulos"}</legend>
              <p className="mt-1 text-xs text-suma-navy/60">
                {showAllServices ? "Catálogo completo." : "Recomendados para «" + activeGoal.name.toLowerCase() + "»."} «Desde» indica que el alcance puede cambiar el importe.
              </p>
              <div className="mt-4 space-y-5">
                {categories.map((category) => {
                  const options = shownServices.filter((s) => s.category === category);
                  if (!options.length) return null;
                  return (
                    <div key={category}>
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-suma-purple">{category}</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {options.map((service) => {
                          const checked = serviceIds.includes(service.id);
                          return (
                            <label key={service.id}
                              className={cn("flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-3 transition-colors hover:border-suma-purple",
                                checked ? "border-suma-purple ring-1 ring-suma-purple/30" : "border-suma-line")}>
                              <input type="checkbox" aria-label={service.name} checked={checked}
                                onChange={() => toggle(service.id)}
                                className="mt-1 size-4 shrink-0 accent-suma-purple" />
                              <span className="min-w-0">
                                <span className="block text-sm font-bold text-suma-navy">{service.name}</span>
                                <span className="mt-1 block text-xs text-suma-navy/60">{priceLine(service)}</span>
                                {checked && <span className="mt-1.5 block text-xs leading-relaxed text-suma-navy/75">{service.detail}</span>}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button type="button" onClick={() => setShowAllServices((v) => !v)} aria-expanded={showAllServices}
                className="mt-4 min-h-11 w-full rounded-xl border border-suma-line bg-white px-4 text-sm font-bold text-suma-navy hover:border-suma-purple">
                {showAllServices ? "Ver solo los recomendados ↑" : "Ver los " + availableServices.length + " módulos (" + hiddenCount + " más) ↓"}
              </button>
            </fieldset>

            <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-3 sm:gap-4">
              <div><label htmlFor="showroom-users" className="text-sm font-bold text-suma-navy">Personas del equipo</label>
                <select id="showroom-users" value={teamUsers} onChange={(e) => setTeamUsers(Number(e.target.value))} className={field}>
                  {[1, 5, 10, 25, 50, 100, 500].map((number) => <option value={number} key={number}>{number === 500 ? "500 o más" : number}</option>)}
                </select></div>
              <div><label htmlFor="showroom-locations" className="text-sm font-bold text-suma-navy">Sedes</label>
                <select id="showroom-locations" value={locations} onChange={(e) => setLocations(Number(e.target.value))} className={field}>
                  {[1, 2, 3, 4, 5, 10].map((number) => <option value={number} key={number}>{number === 10 ? "10 o más" : number}</option>)}
                </select></div>
              <div className="col-span-2 sm:col-span-1"><label htmlFor="showroom-months" className="text-sm font-bold text-suma-navy">Periodo</label>
                <select id="showroom-months" value={months} onChange={(e) => setMonths(Number(e.target.value))} className={field}>
                  {[1, 3, 6, 12].map((number) => <option value={number} key={number}>{number} {number === 1 ? "mes" : "meses"}</option>)}
                </select></div>
            </div>
            {quote.setup > 0 && (
              <fieldset className="rounded-2xl border border-suma-line bg-white p-4 md:p-5">
                <legend className="px-2 text-sm font-bold text-suma-navy">¿Cómo pagarías la implementación?</legend>
                <div role="group" aria-label="Pagar implementación" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {paymentOptions.map((count) => (
                    <button key={count} type="button" aria-pressed={quote.setupPayments === count}
                      onClick={() => setSetupPayments(count)}
                      className={"min-h-12 rounded-xl border px-3 text-sm font-bold " +
                        (quote.setupPayments === count ? "border-suma-navy bg-suma-navy text-white" : "border-suma-line bg-suma-cream-soft text-suma-navy")}>
                      {count === 1 ? "Un pago" : count + " mensualidades"}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-suma-navy/65">
                  {quote.setupPayments === 1
                    ? "Una sola implementación, pagada al iniciar."
                    : "Primer abono " + formatMXNExact(quote.setupInstallment) + "; último " + formatMXNExact(quote.setupFinalInstallment) + ". Total de implementación " + formatMXN(quote.setup) + "."}
                  {" "}Sujeto a acuerdo comercial, sin contratación o cargo automático. La mensualidad del servicio se cobra aparte.
                </p>
              </fieldset>
            )}
            {quote.hasAds && (
              <div><label htmlFor="showroom-ads" className="text-sm font-bold text-suma-navy">Pauta mensual estimada (la pagas a Meta/Google)</label>
                <select id="showroom-ads" value={adBudget} onChange={(e) => setAdBudget(Number(e.target.value))} className={field}>
                  {pricingSettings.adBudgets.map((amount) => <option key={amount} value={amount}>{formatMXN(amount)} al mes</option>)}
                </select></div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="showroom-platform" className="text-sm font-bold text-suma-navy">Qué usas hoy</label>
                <select id="showroom-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className={field}>
                  {["WhatsApp / Instagram", "Fitco / Fitune", "Wellhub / TotalPass / Fitpass", "CRM existente", "Sitio o reservador propio", "Aún no utilizo herramientas", "Otra herramienta"].map((name) =>
                    <option key={name}>{name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="showroom-notes" className="text-sm font-bold text-suma-navy">Algo más (opcional)</label>
                <textarea id="showroom-notes" rows={2} maxLength={180} value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Seguimiento de membresías y reservas en Fitco."
                  className="mt-2 w-full rounded-xl border border-suma-line bg-white p-3 text-base text-suma-navy focus-visible:outline-suma-orange"/>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="rounded-[1.75rem] bg-suma-navy p-5 text-suma-cream shadow-lift md:p-8">
              <p className="text-eyebrow text-suma-orange">Tu propuesta estimada</p>
              {quote.isEmpty ? (
                <p className="mt-5 rounded-xl border border-white/15 p-4 text-sm">Elige al menos un módulo para ver cuánto pagarías.</p>
              ) : (
                <>
                  <ul aria-label="Lo que estás eligiendo" className="mt-4 space-y-2 text-sm">
                    {quote.mode === "package" && (
                      <li className="flex justify-between gap-3">
                        <span className="font-bold">{quote.plan.name} <span className="font-normal text-suma-cream/60">· {quote.plan.label}</span></span>
                        <span className="shrink-0 tabular-nums text-suma-cream/80">{formatMXN(quote.plan.setup)} + {formatMXN(quote.plan.monthly)}/mes</span>
                      </li>
                    )}
                    {quote.services.map((service) => (
                      <li key={service.id} className="flex justify-between gap-3">
                        <span>{service.name}</span>
                        <span className="shrink-0 tabular-nums text-suma-cream/80">
                          {service.from ? "desde " : ""}{service.setup ? formatMXN(service.setup) : ""}{service.setup && service.monthly ? " + " : ""}{service.monthly ? formatMXN(service.monthly) + "/mes" : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {quote.mode === "package" && (
                    <details className="mt-3 text-xs text-suma-cream/75">
                      <summary className="cursor-pointer font-bold text-suma-cream">Qué incluye {quote.plan.name}</summary>
                      <ul className="mt-2 list-disc space-y-1 pl-5">{quote.plan.includes.map((item) => <li key={item}>{item}</li>)}</ul>
                      <p className="mt-2">{quote.plan.boundaries}</p>
                    </details>
                  )}

                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-suma-cream/60">Primer desembolso {quote.isStartingPrice ? "desde" : ""}</p>
                  <p className="mt-2 font-display text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold leading-none tabular-nums">{formatMXNExact(quote.firstPaymentSuma)}</p>
                  <p className="mt-2 text-xs text-suma-cream/60">{quote.setupPayments === 1 ? "Implementación íntegra" : "Primer abono de implementación"} + primera mensualidad, antes de IVA.</p>
                  <dl className="mt-5 divide-y divide-white/15 border-y border-white/15 text-sm">
                    <div className="flex justify-between gap-4 py-3"><dt>Implementación (una vez)</dt><dd className="font-bold tabular-nums">{formatMXN(quote.setup)}</dd></div>
                    {quote.setupPayments > 1 && <div className="flex justify-between gap-4 py-3">
                      <dt>Implementación: abono 1 de {quote.setupPayments}</dt>
                      <dd className="font-bold tabular-nums">{formatMXNExact(quote.setupInstallment)}</dd>
                    </div>}
                    <div className="flex justify-between gap-4 py-3"><dt>Mensualidad SUMA</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlySuma)}</dd></div>
                    {quote.hasAds && <div className="flex justify-between gap-4 py-3"><dt>Pauta mensual (aparte, a Meta/Google)</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlyAds)}</dd></div>}
                    <div className="flex justify-between gap-4 py-3">
                      <dt>
                        Primer pago con IVA ({IVA_RATE * 100}%), si aplica{" "}
                        <a href="https://wwwmatnp.sat.gob.mx/articulo/19848/articulo-1" target="_blank" rel="noopener noreferrer" className="text-xs underline decoration-suma-orange underline-offset-4">SAT ↗</a>
                      </dt>
                      <dd className="font-bold tabular-nums">{formatMXNExact(quote.firstPaymentSuma * (1 + IVA_RATE))}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3"><dt>SUMA: implementación íntegra + {quote.months} {quote.months === 1 ? "mes de servicio" : "meses de servicio"}</dt><dd className="font-bold tabular-nums">{formatMXN(quote.totalSuma)}</dd></div>
                  </dl>
                  {quote.hasAds && <p className="mt-2 text-xs text-suma-cream/70">+ {formatMXN(quote.totalExternalAds)} de pauta en {quote.months} {quote.months === 1 ? "mes" : "meses"}, pagada directo a la plataforma.</p>}
                  {quote.setupPayments > 1 && <p className="mt-3 text-xs leading-relaxed text-suma-cream/70">
                    El costo total incluye el 100% de la implementación, aunque algunos abonos venzan después del periodo elegido. El calendario exacto se confirma antes de contratar.
                  </p>}
                </>
              )}
              <p className="mt-4 text-xs leading-relaxed text-suma-cream/65">
                Sin cargo de SUMA por persona del equipo. Aparte: licencias de software, WhatsApp API, consumo de IA, hosting y publicidad. {locations > 1 ? "Con varias sedes revisamos el precio final." : ""}
              </p>

              <a href={showroomWhatsAppHref(selection, "quote")} target="_blank" rel="noopener noreferrer" {...showroomWhatsAppAttrs("quote")}
                className="mt-6 flex min-h-14 items-center justify-center rounded-full bg-suma-orange px-4 text-center text-sm font-extrabold text-suma-navy transition-colors hover:bg-suma-cream">
                Enviar mi propuesta por WhatsApp →
              </a>
              <p className="mt-2 text-center text-xs text-suma-cream/60">Abre WhatsApp con un mensaje que puedes editar. Nada se envía sin ti.</p>

              <details className="mt-4 rounded-2xl border border-white/20 p-4">
                <summary className="cursor-pointer text-sm font-bold text-suma-cream">¿Tienes un presupuesto definido?</summary>
                <p className="mt-3 text-xs text-suma-cream/70">Dinos un rango. El precio no cambia automáticamente; revisamos qué alcance cabe.</p>
                <label htmlFor="showroom-budget" className="mt-3 block text-xs font-semibold">Presupuesto aproximado</label>
                <input id="showroom-budget" maxLength={40} value={budget} onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ej. $5,000 al mes" className="mt-2 min-h-11 w-full rounded-xl border border-white/30 bg-white px-3 text-base text-suma-navy"/>
                <a href={showroomWhatsAppHref(selection, "budget")} target="_blank" rel="noopener noreferrer" {...showroomWhatsAppAttrs("budget")}
                  className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-white/50 px-4 text-center text-sm font-bold hover:bg-white/10">
                  Solicitar ajuste de alcance →
                </a>
              </details>
              <details className="mt-3 rounded-2xl border border-white/20 p-4">
                <summary className="cursor-pointer text-sm font-bold text-suma-cream">¿Prefieres verlo en una llamada?</summary>
                <p className="mt-3 text-xs text-suma-cream/70">Coordinamos una sesión de diagnóstico por WhatsApp. Esta solicitud no agenda automáticamente una cita.</p>
                <label htmlFor="showroom-availability" className="mt-3 block text-xs font-semibold">Horario preferido</label>
                <select id="showroom-availability" value={availability} onChange={(e) => setAvailability(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl bg-white px-3 text-base text-suma-navy">
                  {["Por definir", "Entre semana, mañanas", "Entre semana, tardes", "Horario flexible"].map((option) => <option key={option}>{option}</option>)}
                </select>
                <a href={showroomWhatsAppHref(selection, "diagnostic")} target="_blank" rel="noopener noreferrer" {...showroomWhatsAppAttrs("diagnostic")}
                  className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-white/50 px-4 text-center text-sm font-bold hover:bg-white/10">
                  Solicitar sesión de diagnóstico →
                </a>
              </details>
              <p className="mt-4 text-xs text-suma-cream/55">Estimación orientativa, no cotización definitiva. Alcance e integraciones se confirman antes de contratar.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-suma-navy/10 pt-8">
          <h3 className="font-display text-2xl font-extrabold text-suma-navy">Así sería la implementación</h3>
          <p className="mt-2 max-w-3xl text-sm text-suma-navy/70">Los tiempos se definen en el diagnóstico según el alcance. No se conecta nada sin revisar permisos y viabilidad contigo.</p>
          <ol className="mt-6 grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {processSteps.map((step) => (
              <li key={step.number} className="rounded-2xl border border-suma-line bg-white p-4 sm:p-5">
                <p className="font-display text-lg font-bold text-suma-navy">
                  <span className="mr-2 text-sm font-extrabold text-suma-orange-ink">{step.number}</span>{step.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-suma-navy/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
