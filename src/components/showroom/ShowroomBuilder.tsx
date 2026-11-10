"use client";

import { useState } from "react";
import Link from "next/link";
import { individualServices, pricingPlans, pricingSettings, type IndividualServiceId, type PricingPlanId } from "@/content/pricing";
import {
  showroomExperiences, showroomIndustries, showroomPalettes,
  type ShowroomExperienceId, type ShowroomIndustryId, type ShowroomPaletteId,
} from "@/content/showroom";
import { formatMXN } from "@/lib/pricing";
import { showroomEstimate, showroomWhatsAppHref, toggleShowroomService, type ShowroomSelection } from "@/lib/showroom";
import { ShowroomLivePreview } from "./ShowroomLivePreview";
import { ShowroomImpacto } from "./ShowroomImpacto";

const field = "mt-2 min-h-12 w-full rounded-xl border border-suma-line bg-white px-4 text-base text-suma-navy focus-visible:outline-2 focus-visible:outline-suma-orange";
const categories = ["Captación", "Atención", "Operación", "Presencia", "Desarrollo"] as const;

export function ShowroomBuilder() {
  const [industry, setIndustry] = useState<ShowroomIndustryId>("pilates");
  const [businessName, setBusinessName] = useState("");
  const [paletteId, setPaletteId] = useState<ShowroomPaletteId>("suma");
  const [experience, setExperience] = useState<ShowroomExperienceId>("crm");
  const [mode, setMode] = useState<"services" | "package">("services");
  const [planId, setPlanId] = useState<PricingPlanId>("flow");
  const [serviceIds, setServiceIds] = useState<IndividualServiceId[]>(["crm-gestionado"]);
  const [locations, setLocations] = useState(1);
  const [teamUsers, setTeamUsers] = useState(5);
  const [months, setMonths] = useState(1);
  const [adBudget, setAdBudget] = useState(6000);
  const [platform, setPlatform] = useState("WhatsApp / Instagram");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [availability, setAvailability] = useState("Por definir");

  const selection: ShowroomSelection = {
    businessName, industry, experience, serviceIds, mode, planId, months, adBudget,
    locations, teamUsers, platform, budget, notes, availability,
  };
  const quote = showroomEstimate(selection);
  const active = showroomExperiences.find((item) => item.id === experience) ?? showroomExperiences[0];
  const included = mode === "package"
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

  return (
    <div className="space-y-10">
      <section aria-label="Configura la apariencia de tu experiencia" className="rounded-[2rem] border border-suma-line bg-suma-cream-soft p-5 shadow-soft md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-eyebrow text-suma-orange-ink">01 · Personaliza</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-suma-navy md:text-3xl">Haz que la demo se parezca a tu negocio.</h2></div>
          <span className="rounded-full bg-suma-orange/15 px-4 py-2 text-xs font-bold text-suma-navy">Sin registro · Sin pagos</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label htmlFor="showroom-name" className="text-sm font-bold text-suma-navy">Nombre de tu negocio</label>
            <input id="showroom-name" maxLength={45} value={businessName} onChange={(e) => setBusinessName(e.target.value)}
              className={field} placeholder="Ej. Tu Estudio" autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="showroom-industry" className="text-sm font-bold text-suma-navy">Giro</label>
            <select id="showroom-industry" value={industry} onChange={(e) => setIndustry(e.target.value as ShowroomIndustryId)} className={field}>
              {showroomIndustries.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="showroom-palette" className="text-sm font-bold text-suma-navy">Estilo de la demo</label>
            <select id="showroom-palette" value={paletteId} onChange={(e) => setPaletteId(e.target.value as ShowroomPaletteId)} className={field}>
              {showroomPalettes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="showroom-platform" className="text-sm font-bold text-suma-navy">Qué utilizas actualmente</label>
            <select id="showroom-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className={field}>
              {["WhatsApp / Instagram", "Fitco / Fitune", "Wellhub / TotalPass / Fitpass", "CRM existente", "Sitio o reservador propio", "Aún no utilizo herramientas", "Otra herramienta"].map((name) =>
                <option key={name}>{name}</option>)}
            </select>
          </div>
        </div>
        <p className="mt-4 text-xs text-suma-navy/60">Todo lo que escribas aquí modifica únicamente la simulación de este navegador. No se guarda ni se envía automáticamente.</p>
      </section>

      <section id="showroom-explorar" aria-labelledby="showroom-preview-title" className="scroll-mt-24 grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="rounded-[2rem] bg-suma-navy p-5 text-suma-cream md:p-7">
          <p className="text-eyebrow text-suma-orange">02 · Explora</p>
          <h2 id="showroom-preview-title" className="mt-3 font-display text-3xl font-extrabold">Mira cómo podría funcionar.</h2>
          <p className="mt-3 text-sm leading-relaxed text-suma-cream/75">
            Elige una experiencia. Cada pantalla es un concepto interactivo que puedes probar; no un software real ni una integración activa.
          </p>
          <div role="group" aria-label="Experiencias para probar" className="mt-6 grid grid-cols-2 gap-2">
            {showroomExperiences.map((item) => (
              <button key={item.id} type="button" aria-pressed={experience === item.id}
                onClick={() => setExperience(item.id)}
                className={"min-h-[4.5rem] rounded-2xl border px-3 py-3 text-left transition-colors focus-visible:outline-suma-orange " +
                  (experience === item.id
                    ? "border-suma-orange bg-suma-orange text-suma-navy"
                    : "border-white/20 bg-white/5 text-white hover:border-white/60")}>
                <span className="block text-xs font-semibold opacity-65">{item.category}</span>
                <span className="mt-1 block text-sm font-bold leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
          <div className="mt-7 border-t border-white/15 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-suma-orange">Qué estás viendo</p>
            <p className="mt-2 font-display text-xl font-bold">{active.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-suma-cream/75">{active.lead}</p>
            <p className="mt-3 text-xs text-suma-cream/55">{active.detail}</p>
            <button type="button" onClick={addCurrent} disabled={selectedCurrent}
              className="mt-5 min-h-12 w-full rounded-full bg-suma-cream px-5 text-sm font-bold text-suma-navy transition-colors hover:bg-suma-orange disabled:cursor-default disabled:opacity-70">
              {selectedCurrent ? "✓ Incluido en tu propuesta" : "Añadir esta experiencia a mi propuesta +"}
            </button>
            <Link href={active.href} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-suma-cream underline decoration-suma-orange underline-offset-4">
              Explorar detalles de este servicio →
            </Link>
          </div>
        </div>
        <div className="min-w-0">
          <ShowroomLivePreview experience={experience} industry={industry} brandName={businessName} paletteId={paletteId} />
          <p className="mt-3 text-center text-xs leading-relaxed text-suma-navy/60">
            Prototipo demostrativo sin datos de clientes, reservas reales, mensajes enviados ni conexión con plataformas de terceros.
          </p>
        </div>
      </section>

      <ShowroomImpacto selection={selection} quote={quote} />

      <section id="showroom-cotizar" aria-labelledby="showroom-price-title" className="scroll-mt-24 rounded-[2rem] bg-suma-cream-deep/60 p-5 md:p-8">
        <div className="mb-7">
          <p className="text-eyebrow text-suma-orange-ink">04 · Diseña tu propuesta</p>
          <h2 id="showroom-price-title" className="mt-3 font-display text-3xl font-extrabold text-suma-navy">Elige funciones. Ve un estimado al instante.</h2>
          <p className="mt-3 max-w-3xl text-sm text-suma-navy/70">Puedes combinar módulos, usar un paquete o pedir que revisemos tu presupuesto. Los importes salen del catálogo público de SUMA, sin descuentos automáticos.</p>
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
                      {plan.name}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-suma-navy/60">Lo que ya incluye un paquete no se cobra dos veces.</p>
              </fieldset>
            )}

            <fieldset>
              <legend className="text-sm font-bold text-suma-navy">{mode === "package" ? "Funciones complementarias" : "Módulos que necesitas"}</legend>
              <p className="mt-1 text-xs text-suma-navy/60">«Desde» indica que el alcance puede cambiar el importe final.</p>
              <div className="mt-4 space-y-5">
                {categories.map((category) => {
                  const options = individualServices.filter((s) => s.category === category && !included.includes(s.id));
                  if (!options.length) return null;
                  return (
                    <div key={category}>
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-suma-purple">{category}</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {options.map((service) => (
                          <label key={service.id}
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-suma-line bg-white p-3 transition-colors hover:border-suma-purple">
                            <input type="checkbox" aria-label={service.name} checked={serviceIds.includes(service.id)}
                              onChange={() => toggle(service.id)}
                              className="mt-1 size-4 shrink-0 accent-suma-purple" />
                            <span className="min-w-0">
                              <span className="block text-sm font-bold text-suma-navy">{service.name}</span>
                              <span className="mt-1 block text-xs text-suma-navy/60">
                                {service.from ? "Desde " : ""}{formatMXN(service.setup || service.monthly)}
                                {service.setup === 0 ? "/mes" : service.monthly ? " inicial + " + formatMXN(service.monthly) + "/mes" : " · único"}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label htmlFor="showroom-users" className="text-sm font-bold text-suma-navy">Personas del equipo</label>
                <select id="showroom-users" value={teamUsers} onChange={(e) => setTeamUsers(Number(e.target.value))} className={field}>
                  {[1, 5, 10, 25, 50, 100, 500].map((number) => <option value={number} key={number}>{number === 500 ? "500 o más" : number}</option>)}
                </select></div>
              <div><label htmlFor="showroom-locations" className="text-sm font-bold text-suma-navy">Sedes</label>
                <select id="showroom-locations" value={locations} onChange={(e) => setLocations(Number(e.target.value))} className={field}>
                  {[1, 2, 3, 4, 5, 10].map((number) => <option value={number} key={number}>{number === 10 ? "10 o más" : number}</option>)}
                </select></div>
              <div><label htmlFor="showroom-months" className="text-sm font-bold text-suma-navy">Periodo</label>
                <select id="showroom-months" value={months} onChange={(e) => setMonths(Number(e.target.value))} className={field}>
                  {[1, 3, 6, 12].map((number) => <option value={number} key={number}>{number} {number === 1 ? "mes" : "meses"}</option>)}
                </select></div>
            </div>
            {quote.hasAds && (
              <div><label htmlFor="showroom-ads" className="text-sm font-bold text-suma-navy">Pauta mensual estimada (gasto externo)</label>
                <select id="showroom-ads" value={adBudget} onChange={(e) => setAdBudget(Number(e.target.value))} className={field}>
                  {pricingSettings.adBudgets.map((amount) => <option key={amount} value={amount}>{formatMXN(amount)} al mes</option>)}
                </select></div>
            )}
            <div>
              <label htmlFor="showroom-notes" className="text-sm font-bold text-suma-navy">Funciones adicionales o contexto (opcional)</label>
              <textarea id="showroom-notes" rows={3} maxLength={180} value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Dos administradores, seguimiento de membresías y reservas en Fitco."
                className="mt-2 w-full rounded-xl border border-suma-line bg-white p-4 text-base text-suma-navy focus-visible:outline-suma-orange"/>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="rounded-[1.75rem] bg-suma-navy p-5 text-suma-cream shadow-lift md:p-8">
              <p className="text-eyebrow text-suma-orange">Tu propuesta estimada</p>
              <p className="mt-3 text-sm text-suma-cream/70">{mode === "package" ? quote.plan.name : "Módulos individuales"} · {quote.locations} {quote.locations === 1 ? "sede" : "sedes"}</p>
              {quote.isEmpty ? (
                <p className="mt-5 rounded-xl border border-white/15 p-4 text-sm">Agrega al menos un módulo para obtener una estimación.</p>
              ) : (
                <>
                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-suma-cream/60">Primer pago orientativo {quote.isStartingPrice ? "desde" : ""}</p>
                  <p className="mt-2 font-display text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold leading-none tabular-nums">{formatMXN(quote.firstPaymentSuma)}</p>
                  <p className="mt-2 text-xs text-suma-cream/60">Implementación + primera mensualidad, antes de IVA</p>
                  <dl className="mt-6 divide-y divide-white/15 border-y border-white/15 text-sm">
                    <div className="flex justify-between gap-4 py-3"><dt>Implementación</dt><dd className="font-bold tabular-nums">{formatMXN(quote.setup)}</dd></div>
                    <div className="flex justify-between gap-4 py-3"><dt>Mensualidad SUMA</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlySuma)}</dd></div>
                    {quote.hasAds && <div className="flex justify-between gap-4 py-3"><dt>Pauta mensual aparte</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlyAds)}</dd></div>}
                  </dl>
                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-suma-cream/60">Total SUMA en {quote.months} {quote.months === 1 ? "mes" : "meses"}</p>
                  <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">{formatMXN(quote.totalSuma)}</p>
                  {quote.hasAds && <p className="mt-1 text-xs text-suma-cream/70">+ {formatMXN(quote.totalExternalAds)} de pauta externa estimada.</p>}
                </>
              )}
              <p className="mt-5 text-xs leading-relaxed text-suma-cream/65">
                SUMA no añade un cargo propio por integrante. Licencias externas, WhatsApp API, consumo IA, hosting y publicidad van aparte. {locations > 1 ? "Con varias sedes hay que revisar el precio final." : ""}
              </p>

              <a href={showroomWhatsAppHref(selection, "quote")} target="_blank" rel="noopener noreferrer"
                className="mt-6 flex min-h-14 items-center justify-center rounded-full bg-suma-orange px-4 text-center text-sm font-extrabold text-suma-navy transition-colors hover:bg-suma-cream">
                Enviar mi configuración por WhatsApp →
              </a>

              <details className="mt-4 rounded-2xl border border-white/20 p-4">
                <summary className="cursor-pointer text-sm font-bold text-suma-cream">¿Quieres ajustar el presupuesto?</summary>
                <p className="mt-3 text-xs text-suma-cream/70">Cuéntanos un rango. No cambia automáticamente el precio; revisaremos qué alcance se puede adaptar.</p>
                <label htmlFor="showroom-budget" className="mt-3 block text-xs font-semibold">Presupuesto aproximado</label>
                <input id="showroom-budget" maxLength={40} value={budget} onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ej. $5,000 al mes" className="mt-2 min-h-11 w-full rounded-xl border border-white/30 bg-white px-3 text-base text-suma-navy"/>
                <a href={showroomWhatsAppHref(selection, "budget")} target="_blank" rel="noopener noreferrer"
                  className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-white/50 px-4 text-center text-sm font-bold hover:bg-white/10">
                  Solicitar ajuste de alcance →
                </a>
              </details>
              <details className="mt-3 rounded-2xl border border-white/20 p-4">
                <summary className="cursor-pointer text-sm font-bold text-suma-cream">¿Necesitas una demo más completa?</summary>
                <p className="mt-3 text-xs text-suma-cream/70">Podemos coordinar una sesión para revisar procesos e integraciones. Esta solicitud no agenda automáticamente una cita.</p>
                <label htmlFor="showroom-availability" className="mt-3 block text-xs font-semibold">Horario preferido</label>
                <select id="showroom-availability" value={availability} onChange={(e) => setAvailability(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl bg-white px-3 text-base text-suma-navy">
                  {["Por definir", "Entre semana, mañanas", "Entre semana, tardes", "Horario flexible"].map((option) => <option key={option}>{option}</option>)}
                </select>
                <a href={showroomWhatsAppHref(selection, "diagnostic")} target="_blank" rel="noopener noreferrer"
                  className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-white/50 px-4 text-center text-sm font-bold hover:bg-white/10">
                  Solicitar sesión de diagnóstico →
                </a>
              </details>
              <p className="mt-5 text-xs text-suma-cream/55">Solo se prepara un mensaje de WhatsApp editable. Nada se envía sin tu acción. La estimación no es una cotización definitiva.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
