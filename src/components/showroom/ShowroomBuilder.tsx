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
  { id: "captar", name: "Quiero que más personas me conozcan", experience: "ads", recommendations: ["ads", "web", "seo"] },
  { id: "responder", name: "Quiero organizar los mensajes", experience: "crm", recommendations: ["crm", "chatbot", "automatizacion"] },
  { id: "operar", name: "Quiero facilitar las reservas", experience: "reservas", recommendations: ["reservas", "app", "crm-medida"] },
] as const;

const paletteDescriptions: Record<ShowroomPaletteId, string> = {
  suma: "Azul oscuro, crema y naranja. Moderno y con contraste.",
  almendra: "Café, beige y arena. Cálido y natural.",
  salvia: "Verde, blanco suave y salvia. Tranquilo y fresco.",
};
const friendlyDemoTitles: Record<ShowroomExperienceId, string> = {
  crm: "Ordenar mensajes de clientes",
  chatbot: "Responder dudas por WhatsApp",
  ads: "Crear anuncios para mi negocio",
  reservas: "Mostrar horarios y reservas",
  web: "Cómo se vería mi página",
  automatizacion: "Avisos y recordatorios",
  app: "Aplicación para alumnos",
  seo: "Aparecer en búsquedas de Google",
  "crm-medida": "Un programa propio para mi negocio",
};
const simpleDemoExplanations: Record<ShowroomExperienceId, string> = {
  crm: "Mira cómo tu equipo sabría quién preguntó por una clase y quién falta por atender.",
  chatbot: "Prueba qué respuestas podría recibir alguien que pregunta por WhatsApp.",
  ads: "Mira un anuncio de ejemplo para invitar a personas a conocer tu negocio.",
  reservas: "Prueba cómo una persona podría escoger un horario disponible.",
  web: "Mira cómo podría verse una página sencilla con tu marca.",
  automatizacion: "Descubre cómo se podría crear un aviso cuando alguien necesita seguimiento.",
  app: "Explora cómo una alumna podría consultar sus clases.",
  seo: "Mira cómo podría aparecer la información de tu negocio en Google.",
  "crm-medida": "Explora un ejemplo de sistema propio para organizar tu operación.",
};
type GuidedGoalId = (typeof guidedGoals)[number]["id"];
type WizardStage = "welcome" | "personalize" | "explore" | "impact" | "quote";
const demoHints: Record<ShowroomExperienceId, string> = {
  crm: "Prueba marcar una consulta como respondida o cambia a la vista de operación.",
  chatbot: "Elige una pregunta, como horarios o precios, y mira la respuesta de ejemplo.",
  ads: "Cambia el tipo de anuncio y descubre cómo variaría el mensaje.",
  reservas: "Elige un horario de ejemplo para ver qué sucede después.",
  web: "Pulsa el botón de la página para ver qué encontraría el visitante.",
  automatizacion: "Pulsa «Simular recorrido» para ver los avisos y tareas.",
  app: "Prueba las pestañas de clases y membresía.",
  seo: "Mira cómo podría presentarse tu negocio en un resultado de búsqueda.",
  "crm-medida": "Explora las vistas de interesados y operación del panel de ejemplo.",
};
const wizardLabels = [
  { stage: "personalize", title: "Tu negocio", detail: "Pon tu nombre y colores" },
  { stage: "explore", title: "Prueba una idea", detail: "Toca y ve qué pasa" },
  { stage: "impact", title: "Calcula (opcional)", detail: "Estima un posible resultado" },
  { stage: "quote", title: "Tu propuesta", detail: "Ve precios y pide información" },
] as const;

const priceLine = (service: (typeof individualServices)[number]) =>
  (service.from ? "Desde " : "") + (service.setup
    ? formatMXN(service.setup) + " inicial" + (service.monthly ? " · " + formatMXN(service.monthly) + "–" + formatMXN(service.monthlyMax) + "/mes" : " · pago único")
    : formatMXN(service.monthly) + "/mes");

export function ShowroomBuilder() {
  const [stage, setStage] = useState<WizardStage>("welcome");
  // El botón de la portada inicia el tutorial directamente, sin pedir un segundo clic.
  useEffect(() => {
    const startFromHero = () => {
      if (window.location.hash === "#showroom-wizard") {
        setStage((current) => current === "welcome" ? "personalize" : current);
      }
    };
    startFromHero();
    window.addEventListener("hashchange", startFromHero);
    return () => window.removeEventListener("hashchange", startFromHero);
  }, []);
  const [personalizeField, setPersonalizeField] = useState(0);
  const activeWizardIndex = wizardLabels.findIndex((item) => item.stage === stage);
  const goTo = (next: WizardStage) => setStage(next);
  // Cada etapa mantiene los datos de la anterior. Sin almacenamiento ni envío silencioso.
  useEffect(() => {
    if (stage === "welcome") return;
    const el = document.getElementById("showroom-wizard");
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    const heading = el?.querySelector<HTMLElement>("[data-wizard-heading]");
    heading?.focus({ preventScroll: true });
  }, [stage, personalizeField]);
  const [industry, setIndustry] = useState<ShowroomIndustryId>("pilates");
  const [businessName, setBusinessName] = useState("");
  const [paletteId, setPaletteId] = useState<ShowroomPaletteId>("suma");
  const [experience, setExperience] = useState<ShowroomExperienceId>("crm");
  const [guidedGoal, setGuidedGoal] = useState<GuidedGoalId>("responder");
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showImpactCalculator, setShowImpactCalculator] = useState(false);
  const [hasChosenGoal, setHasChosenGoal] = useState(false);
  const [mode, setMode] = useState<"services" | "package">("services");
  const [planId, setPlanId] = useState<PricingPlanId>("flow");
  // La demo inicial es ilustrativa, no una selección de compra.
  const [serviceIds, setServiceIds] = useState<IndividualServiceId[]>([]);
  const [locations, setLocations] = useState(1);
  const [teamUsers, setTeamUsers] = useState(5);
  const [months, setMonths] = useState<number>(pricingSettings.defaultMonths);
  const [setupPayments, setSetupPayments] = useState<SetupPayments>(pricingSettings.defaultSetupPayments);
  const [adBudget, setAdBudget] = useState<number>(pricingSettings.defaultAdBudget);
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
  const selectedPalette = showroomPalettes.find((item) => item.id === paletteId) ?? showroomPalettes[0];
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
  const chosenDescription = quote.isEmpty
    ? "Solo estás probando una demostración. No has elegido ningún servicio para pagar."
    : mode === "package"
      ? "Elegiste " + quote.plan.name + (quote.services.length ? " con " + quote.services.length + " extras." : ".")
      : "Has elegido " + quote.services.length + (quote.services.length === 1 ? " servicio." : " servicios.");
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
      <div id="showroom-wizard" className="scroll-mt-28">
        {stage === "welcome" ? (
          <section aria-labelledby="showroom-welcome-title" className="rounded-[2rem] border border-suma-line bg-suma-cream-soft p-6 shadow-soft md:p-10">
            <p className="text-eyebrow text-suma-orange-ink">SUMA VISION STUDIO · UNA EXPERIENCIA A TU RITMO</p>
            <h2 id="showroom-welcome-title" className="mt-3 max-w-3xl font-display text-3xl font-extrabold text-suma-navy md:text-4xl">
              Descubre cómo podría funcionar SUMA en tu negocio.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-suma-navy/75">
              Te guiaremos con preguntas fáciles. Verás una pantalla de ejemplo, podrás tocar sus botones y decidir si quieres incluir esa solución en tu propuesta. Sin registro ni pagos.
            </p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {wizardLabels.map((item, index) => (
                <li key={item.stage} className="rounded-2xl border border-suma-line bg-white p-4">
                  <span className="text-xs font-extrabold text-suma-orange-ink">PASO {index + 1}</span>
                  <p className="mt-1 font-bold text-suma-navy">{item.title}</p>
                  <p className="mt-1 text-xs text-suma-navy/65">{item.detail}</p>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => goTo("personalize")}
              className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-suma-orange px-8 text-base font-extrabold text-suma-navy transition-colors hover:bg-suma-navy hover:text-white focus-visible:outline-2 focus-visible:outline-suma-purple">
              Iniciar experiencia →
            </button>
            <p className="mt-3 text-sm font-medium text-suma-navy/75">No necesitas saber de tecnología. Te explicaremos cada elección y siempre podrás regresar.</p>
          </section>
        ) : (
          <nav aria-label="Avance de la experiencia" className="mb-7 rounded-2xl border border-suma-line bg-white px-4 py-4 md:px-6">
            <p aria-live="polite" className="text-sm font-extrabold text-suma-navy">Estás en el paso {activeWizardIndex + 1} de 4: {wizardLabels[activeWizardIndex]?.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-suma-navy/70">
              {stage === "personalize" ? "Aquí eliges cómo se verá el ejemplo. Todavía no estás contratando nada." :
                stage === "explore" ? "Aquí pruebas una herramienta ficticia. Solo se añade a tu propuesta cuando tú lo indicas." :
                stage === "impact" ? "Aquí puedes hacer un cálculo hipotético o saltarlo sin problema." :
                "Aquí revisas lo que elegiste, cuánto costaría y cómo pedir información."}
            </p>
            <ol className="mt-3 grid grid-cols-4 gap-2">
              {wizardLabels.map((item, index) => (
                <li key={item.stage} className="min-w-0">
                  <div aria-current={stage === item.stage ? "step" : undefined}
                    className={"h-2 rounded-full " + (index <= activeWizardIndex ? "bg-suma-orange" : "bg-suma-navy/10")} />
                  <span className={"mt-1.5 block truncate text-[0.65rem] font-bold sm:text-xs " + (stage === item.stage ? "text-suma-navy" : "text-suma-navy/50")}>{item.title}</span>
                </li>
              ))}
            </ol>
          </nav>
        )}

      {stage === "personalize" && (
        <section id="showroom-construir" aria-labelledby="showroom-custom-title" className="rounded-[2rem] border border-suma-line bg-suma-cream-soft p-5 shadow-soft md:p-8">
          <p className="text-eyebrow text-suma-orange-ink">01 · HAZ QUE EL EJEMPLO SE PAREZCA A TU NEGOCIO</p>
          <h2 id="showroom-custom-title" data-wizard-heading tabIndex={-1} className="mt-2 font-display text-2xl font-extrabold text-suma-navy md:text-3xl">
            {personalizeField === 0 ? "¿Cómo se llama tu negocio?" :
              personalizeField === 1 ? "¿A qué se dedica tu negocio?" : "¿Qué estilo te gusta más?"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-suma-navy/70">
            {personalizeField === 0 ? "Es opcional. Si lo escribes, aparecerá en tu demostración." :
              personalizeField === 1 ? "Usaremos situaciones parecidas a tu negocio, como clases, consultas o reservas." : "Los colores se muestran abajo: tócalos y mira cómo se ve la pantalla antes de seguir."}
          </p>
          <p className="mt-5 text-sm font-bold text-suma-purple">Pregunta {personalizeField + 1} de 3 · Solo estamos preparando tu demo</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-suma-navy/10">
            <div className="h-full rounded-full bg-suma-orange transition-all" style={{ width: ((personalizeField + 1) / 3 * 100) + "%" }} />
          </div>
          <div className="mt-6 max-w-xl">
            {personalizeField === 0 && (
              <div>
                <label htmlFor="showroom-name" className="text-sm font-bold text-suma-navy">Nombre de tu negocio (opcional)</label>
                <input id="showroom-name" maxLength={45} value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={field} placeholder="Ej. Mi estudio de Pilates" autoComplete="organization" />
              </div>
            )}
            {personalizeField === 1 && (
              <div>
                <label htmlFor="showroom-industry" className="text-sm font-bold text-suma-navy">Tipo de negocio</label>
                <select id="showroom-industry" value={industry}
                  onChange={(e) => setIndustry(e.target.value as ShowroomIndustryId)}
                  className={field}>
                  {showroomIndustries.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
            )}
            {personalizeField === 2 && (
              <div>
                <p id="showroom-color-label" className="text-sm font-bold text-suma-navy">Toca los colores que más te gusten</p>
                <div role="group" aria-labelledby="showroom-color-label" className="mt-3 grid gap-3 sm:grid-cols-3">
                  {showroomPalettes.map((item) => {
                    const selected = item.id === paletteId;
                    return (
                      <button key={item.id} type="button" aria-label={"Elegir colores " + item.label}
                        aria-pressed={selected} onClick={() => setPaletteId(item.id)}
                        className={cn("min-h-32 rounded-2xl border-2 bg-white p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-suma-orange",
                          selected ? "border-suma-purple shadow-md ring-2 ring-suma-purple/15" : "border-suma-line hover:border-suma-purple/60")}>
                        <span className="flex gap-1.5" aria-hidden="true">
                          <span className={item.base + " h-9 min-w-0 flex-1 rounded-lg border border-black/10"} />
                          <span className={item.light + " h-9 min-w-0 flex-1 rounded-lg border border-black/10"} />
                          <span className={item.accent + " h-9 min-w-0 flex-1 rounded-lg border border-black/10"} />
                        </span>
                        <span className="mt-3 block text-sm font-extrabold text-suma-navy">
                          {item.label} {selected ? "✓" : ""}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-suma-navy/65">{paletteDescriptions[item.id]}</span>
                      </button>
                    );
                  })}
                </div>
                <div aria-live="polite" className="mt-5 overflow-hidden rounded-2xl border border-suma-line bg-white">
                  <div className={selectedPalette.base + " px-5 py-4 text-white"}>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/75">Vista previa de los colores elegidos</p>
                    <p className="mt-1 font-display text-lg font-extrabold">{businessName.trim() || "Tu negocio · ejemplo"}</p>
                  </div>
                  <div className={selectedPalette.light + " flex items-center justify-between gap-3 p-4"}>
                    <p className={selectedPalette.text + " text-xs font-bold"}>Así se verá tu demostración</p>
                    <span className={selectedPalette.accent + " rounded-full border border-black/10 px-4 py-2 text-xs font-bold text-suma-navy"}>Ver horarios</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-suma-navy/60">Esto solo cambia el aspecto de la demo; no modifica tu página ni contrata un diseño.</p>
              </div>
            )}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button type="button"
              onClick={() => personalizeField === 0 ? goTo("welcome") : setPersonalizeField((value) => value - 1)}
              className="min-h-12 w-full rounded-full border-2 border-suma-navy/30 bg-white px-6 text-sm font-bold text-suma-navy hover:border-suma-purple sm:w-auto">
              ← Atrás
            </button>
            <button type="button"
              onClick={() => {
                if (personalizeField < 2) setPersonalizeField((value) => value + 1);
                else { personalized({}); goTo("explore"); }
              }}
              className="min-h-12 w-full rounded-full bg-suma-orange px-7 text-sm font-extrabold text-suma-navy shadow-sm hover:bg-suma-navy hover:text-white sm:w-auto">
              {personalizeField < 2 ? personalizeField === 0 && !businessName.trim() ? "Omitir nombre y seguir →" : "Siguiente →" : "Probar mi demo →"}
            </button>
          </div>
          <p className="mt-5 text-xs text-suma-navy/60">Los datos de esta prueba solo se usan en tu navegador. No enviamos nada.</p>
        </section>
      )}

      {stage === "explore" && (
      <section id="showroom-explorar" aria-labelledby="showroom-preview-title"
        className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-7">
        <div className="rounded-[2rem] bg-suma-navy p-5 text-suma-cream md:p-7 lg:col-start-1 lg:row-start-1">
          <p className="text-eyebrow text-suma-orange">02 · PRUEBA CÓMO FUNCIONARÍA</p>
          <h2 id="showroom-preview-title" data-wizard-heading tabIndex={-1} className="mt-3 font-display text-3xl font-extrabold">¿En qué te gustaría mejorar?</h2>
          <p className="mt-3 text-sm leading-relaxed text-suma-cream/85">
            No hace falta que sepas qué programa necesitas. Elige tu problema y te mostramos un ejemplo.
          </p>
          <div className="mt-5 space-y-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm leading-relaxed text-suma-cream">
            <p><strong className="text-suma-orange">1.</strong> Elige qué quieres mejorar.</p>
            <p><strong className="text-suma-orange">2.</strong> Prueba los botones de la pantalla de ejemplo.</p>
            <p><strong className="text-suma-orange">3.</strong> Si te interesa, añádelo a tu propuesta. Sin compromiso.</p>
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-suma-orange">1 · Elige tu objetivo</p>
          <div role="group" aria-label="Objetivo principal del negocio" className="mt-3 flex flex-wrap gap-2">
            {guidedGoals.map((goal) => (
              <button key={goal.id} type="button" aria-pressed={guidedGoal === goal.id}
                onClick={() => {
                  setHasChosenGoal(true);
                  setGuidedGoal(goal.id);
                  showDemo(goal.id, goal.experience as ShowroomExperienceId);
                }}
                className={"min-h-12 w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-extrabold transition-colors focus-visible:outline-suma-orange sm:w-auto " +
                  (guidedGoal === goal.id ? "border-suma-orange bg-suma-orange text-suma-navy" : "border-white/30 bg-white/5 text-white hover:border-white")}>
                {goal.name}
              </button>
            ))}
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-suma-orange">2 · Elige qué ejemplo quieres ver</p>
          <p className="mt-2 text-xs leading-relaxed text-suma-cream/75">
            {hasChosenGoal ? "Estos ejemplos se relacionan con lo que quieres mejorar." : "Empezamos con ejemplos para organizar mensajes. Puedes elegir otro objetivo arriba."}
          </p>
          <div role="group" aria-label="Experiencias para probar" className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {visibleExperiences.map((item) => (
              <button key={item.id} type="button" aria-pressed={experience === item.id}
                onClick={() => showDemo(guidedGoal, item.id)}
                className={"min-h-[4.5rem] rounded-2xl border-2 px-4 py-3 text-left transition-colors focus-visible:outline-suma-orange " +
                  (experience === item.id
                    ? "border-suma-orange bg-suma-orange text-suma-navy"
                    : "border-white/20 bg-white/5 text-white hover:border-white/60")}>
                <span className="block text-xs font-semibold opacity-75">{experience === item.id ? "✓ Estás viendo esta opción" : "Toca para ver el ejemplo"}</span>
                <span className="mt-1 block text-sm font-bold leading-tight">{friendlyDemoTitles[item.id]}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setShowAllExperiences((current) => !current)}
            aria-expanded={showAllExperiences}
            className="mt-3 min-h-12 w-full rounded-xl border-2 border-white/50 bg-white/10 px-4 text-sm font-bold text-suma-cream transition-colors hover:border-suma-orange hover:bg-white/15">
            {showAllExperiences ? "Ver solo las 3 sugeridas ↑" : "Ver las 9 demos ↓"}
          </button>
        </div>

        <div className="rounded-[2rem] border border-suma-line bg-white p-5 md:p-6 lg:col-start-1 lg:row-start-2">
          <p className="text-xs font-bold uppercase tracking-widest text-suma-purple">3 · AHORA ESTÁS PROBANDO</p>
          <p className="mt-2 font-display text-xl font-bold text-suma-navy">{friendlyDemoTitles[experience]}</p>
          <p className="mt-2 text-sm leading-relaxed text-suma-navy/80">{simpleDemoExplanations[experience]}</p>
          <p className="mt-3 rounded-xl bg-suma-purple/5 p-3 text-sm font-semibold leading-relaxed text-suma-purple">
            Pruébalo tú: {demoHints[experience]}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-suma-navy/65">Es una prueba con información inventada: los botones no envían mensajes ni reservan clases.</p>
          <p className="mt-3 text-xs font-bold text-suma-purple">Si te gusta, usa el botón de abajo para incluirlo en tu propuesta. Probarlo no tiene costo.</p>
          {selectedCurrent ? (
            <div role="status" className="mt-5 flex min-h-12 flex-wrap items-center justify-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
              <span>✓ Añadido a tu propuesta</span>
              {serviceIds.includes(active.serviceId) && !included.includes(active.serviceId) && (
                <button type="button" onClick={() => toggle(active.serviceId)}
                  className="rounded-full border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-900 hover:border-emerald-600">
                  Quitar
                </button>
              )}
            </div>
          ) : (
            <button type="button" onClick={addCurrent}
              className="mt-5 min-h-14 w-full rounded-full bg-suma-orange px-5 text-base font-extrabold text-suma-navy shadow-sm transition-colors hover:bg-suma-navy hover:text-white">
              Sí, añadir esta solución a mi propuesta +
            </button>
          )}
          <Link href={active.href} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-suma-navy underline decoration-suma-orange underline-offset-4">
            Ver detalles de este servicio →
          </Link>
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ShowroomLivePreview experience={experience} industry={industry} brandName={businessName} paletteId={paletteId} teamUsers={teamUsers} locations={locations} />
          <p className="mt-3 text-center text-xs leading-relaxed text-suma-navy/60">
            Prototipo con datos ficticios: no envía mensajes, no crea reservas ni se conecta a otras plataformas.
          </p>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-suma-line bg-white px-5 py-5 md:px-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-suma-purple">Tu selección hasta ahora</p>
          <p aria-live="polite" className="text-sm font-semibold text-suma-navy">{chosenDescription}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => { setPersonalizeField(0); goTo("personalize"); }}
              className="min-h-12 w-full rounded-full border-2 border-suma-navy/30 px-5 text-sm font-bold text-suma-navy hover:border-suma-purple sm:w-auto">
              ← Cambiar datos de mi negocio
            </button>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => goTo("quote")}
                className="min-h-12 w-full rounded-full bg-suma-orange px-5 text-sm font-extrabold text-suma-navy hover:bg-suma-navy hover:text-white sm:w-auto">
                Ver mi propuesta sin calcular
              </button>
              <button type="button" onClick={() => goTo("impact")}
                className="min-h-12 w-full rounded-full border-2 border-suma-purple bg-white px-6 text-sm font-extrabold text-suma-purple hover:bg-suma-purple hover:text-white sm:w-auto">
                Opcional: hacer un cálculo →
              </button>
            </div>
          </div>
        </div>
      </section>
      )}

      {stage === "impact" && (
      <div className="space-y-3">
        <div className="rounded-2xl border border-suma-line bg-white p-5 shadow-soft md:p-7">
          <p className="text-eyebrow text-suma-orange-ink">PASO 3 · TOTALMENTE OPCIONAL</p>
          <h2 data-wizard-heading tabIndex={-1} className="mt-2 font-display text-2xl font-extrabold text-suma-navy">¿Te gustaría hacer un cálculo de ejemplo?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-suma-navy/75">
            Podemos estimar cuántos clientes adicionales necesitarías para cubrir el costo. Los resultados son ejemplos, no promesas de venta.
            Si prefieres, pasa directo a tu propuesta.
          </p>
          {!quote.isEmpty && !showImpactCalculator && (
            <button type="button" onClick={() => setShowImpactCalculator(true)}
              className="mt-5 min-h-12 w-full rounded-full border-2 border-suma-purple bg-white px-6 text-sm font-extrabold text-suma-purple hover:bg-suma-purple hover:text-white sm:w-auto">
              Sí, quiero ver el cálculo →
            </button>
          )}
        </div>
        {quote.isEmpty ? (
          <div className="rounded-[2rem] border border-suma-line bg-white p-6 text-suma-navy shadow-soft md:p-9">
            <p className="text-eyebrow text-suma-orange-ink">03 · CALCULA</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold">¿Quieres calcular el impacto?</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-suma-navy/75">
              Todavía no has elegido una solución. Para evitar resultados engañosos, primero elige qué te interesa.
              También puedes pedirnos una recomendación sin hacer ningún cálculo.
            </p>
          </div>
        ) : showImpactCalculator ? (
          <ShowroomImpacto selection={selection} quote={quote} onMonthsChange={setMonths} />
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-suma-line bg-white p-5">
          <button type="button" onClick={() => goTo("explore")}
            className="min-h-12 rounded-full border border-suma-line px-5 text-sm font-bold text-suma-navy hover:border-suma-purple">
            ← Volver a las demos
          </button>
          <button type="button" onClick={() => goTo("quote")}
            className="min-h-12 w-full rounded-full bg-suma-orange px-6 text-sm font-extrabold text-suma-navy hover:bg-suma-navy hover:text-white sm:w-auto">
            {quote.isEmpty ? "Pedir una recomendación →" : "Ver mi propuesta →"}
          </button>
        </div>
      </div>
      )}

      {stage === "quote" && (
      <section id="showroom-cotizar" aria-labelledby="showroom-price-title" className="rounded-[2rem] bg-suma-cream-deep/60 p-5 md:p-8">
        <div className="mb-7">
          <p className="text-eyebrow text-suma-orange-ink">04 · Tu propuesta</p>
          <h2 id="showroom-price-title" data-wizard-heading tabIndex={-1} className="mt-3 font-display text-3xl font-extrabold text-suma-navy">Esta es tu propuesta.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-suma-navy/75">
            Este es el resumen de los servicios que tú decidiste incluir. Aquí verás el pago inicial, la mensualidad y los gastos que van aparte. Todavía no estás contratando nada.
          </p>
          <p className="mt-3 rounded-xl border border-suma-purple/20 bg-white px-4 py-3 text-sm font-bold text-suma-navy">
            {chosenDescription}
          </p>
          <button type="button" onClick={() => goTo("explore")}
            className="mt-4 min-h-11 rounded-full border border-suma-purple px-5 text-sm font-bold text-suma-purple hover:bg-white">
            ← Cambiar la solución que probé
          </button>
        </div>
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-7">
            <details className="rounded-2xl border border-suma-line bg-white p-4 md:p-5">
              <summary className="min-h-11 cursor-pointer text-sm font-bold text-suma-navy">
                Cambiar mi plan o agregar funciones (opcional)
              </summary>
              <p className="mb-4 mt-2 text-xs text-suma-navy/65">
                Solo abre esto si quieres comparar otras opciones. Si cambias de plan, se reinician los extras para evitar cobros sorpresa.
              </p>
            <fieldset>
              <legend className="text-sm font-bold text-suma-navy">¿Cómo prefieres contratar?</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" aria-pressed={mode === "services"} onClick={() => { if (mode !== "services") setServiceIds([]); setMode("services"); }}
                  className={"min-h-12 rounded-xl border px-4 text-sm font-bold " + (mode === "services" ? "border-suma-navy bg-suma-navy text-white" : "border-suma-line bg-white text-suma-navy")}>
                  Servicios por separado
                </button>
                <button type="button" aria-pressed={mode === "package"} onClick={() => { if (mode !== "package") setServiceIds([]); setMode("package"); }}
                  className={"min-h-12 rounded-xl border px-4 text-sm font-bold " + (mode === "package" ? "border-suma-navy bg-suma-navy text-white" : "border-suma-line bg-white text-suma-navy")}>
                  Un plan completo
                </button>
              </div>
            </fieldset>

            {mode === "package" && (
              <fieldset>
                <legend className="text-sm font-bold text-suma-navy">Elige un plan</legend>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {pricingPlans.map((plan) => (
                    <button key={plan.id} type="button" aria-pressed={planId === plan.id} onClick={() => { if (planId !== plan.id) setServiceIds([]); setPlanId(plan.id); }}
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
              <legend className="text-sm font-bold text-suma-navy">{mode === "package" ? "Funciones adicionales (opcionales)" : "Servicios disponibles"}</legend>
              <p className="mt-1 text-xs text-suma-navy/60">
                {showAllServices ? "Catálogo completo." : "Recomendados para «" + activeGoal.name.toLowerCase() + "»."} Los importes mínimos son para la versión sencilla de cada servicio.
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
            </details>

            <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-3 sm:gap-4">
              <div><label htmlFor="showroom-users" className="text-sm font-bold text-suma-navy">Personas del equipo</label>
                <select id="showroom-users" value={teamUsers} onChange={(e) => setTeamUsers(Number(e.target.value))} className={field}>
                  {[1, 5, 10, 25, 50, 100, 500].map((number) => <option value={number} key={number}>{number === 500 ? "500 o más" : number}</option>)}
                </select></div>
              <div><label htmlFor="showroom-locations" className="text-sm font-bold text-suma-navy">Sucursales</label>
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
                <legend className="px-2 text-sm font-bold text-suma-navy">¿Cómo prefieres pagar la configuración inicial?</legend>
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
                <p className="mt-5 rounded-xl border border-white/15 p-4 text-sm">Elige una solución o pídenos una recomendación para conocer el costo.</p>
              ) : (
                <>
                  <ul aria-label="Lo que estás eligiendo" className="mt-4 space-y-2 text-sm">
                    {quote.mode === "package" && (
                      <li className="flex justify-between gap-3">
                        <span className="font-bold">{quote.plan.name} <span className="font-normal text-suma-cream/60">· {quote.plan.label}</span></span>
                        <span className="shrink-0 tabular-nums text-suma-cream/80">{formatMXN(quote.plan.setup)} inicial · {formatMXN(quote.plan.monthly)}–{formatMXN(quote.plan.monthlyMax)}/mes</span>
                      </li>
                    )}
                    {quote.services.map((service) => (
                      <li key={service.id} className="flex justify-between gap-3">
                        <span>{service.name}</span>
                        <span className="shrink-0 tabular-nums text-suma-cream/80">
                          {service.setup ? formatMXN(service.setup) + " inicial" : ""}{service.setup && service.monthly ? " · " : ""}{service.monthly ? formatMXN(service.monthly) + "–" + formatMXN(service.monthlyMax) + "/mes" : ""}
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

                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-suma-cream/60">Primer pago estimado · desde</p>
                  <p className="mt-2 font-display text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold leading-none tabular-nums">{formatMXNExact(quote.firstPaymentSuma)}</p>
                  <p className="mt-2 text-xs text-suma-cream/60">{quote.setupPayments === 1 ? "Implementación íntegra" : "Primer abono de implementación"} + primera mensualidad, antes de IVA.</p>
                  <dl className="mt-5 divide-y divide-white/15 border-y border-white/15 text-sm">
                    <div className="flex justify-between gap-4 py-3"><dt>Configuración (pago único)</dt><dd className="font-bold tabular-nums">{formatMXN(quote.setup)}</dd></div>
                    {quote.setupPayments > 1 && <div className="flex justify-between gap-4 py-3">
                      <dt>Configuración: abono 1 de {quote.setupPayments}</dt>
                      <dd className="font-bold tabular-nums">{formatMXNExact(quote.setupInstallment)}</dd>
                    </div>}
                    <div className="flex justify-between gap-4 py-3"><dt>Servicio mensual de SUMA</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlySuma)}</dd></div>
                    {quote.hasAds && <div className="flex justify-between gap-4 py-3"><dt>Presupuesto de anuncios (aparte)</dt><dd className="font-bold tabular-nums">{formatMXN(quote.monthlyAds)}</dd></div>}
                    <div className="flex justify-between gap-4 py-3">
                      <dt>
                        Primer pago con IVA ({IVA_RATE * 100}%), si aplica{" "}
                        <a href="https://wwwmatnp.sat.gob.mx/articulo/19848/articulo-1" target="_blank" rel="noopener noreferrer" className="text-xs underline decoration-suma-orange underline-offset-4">SAT ↗</a>
                      </dt>
                      <dd className="font-bold tabular-nums">{formatMXNExact(quote.firstPaymentSuma * (1 + IVA_RATE))}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3"><dt>Total mínimo: pago inicial + {quote.months} {quote.months === 1 ? "mes de servicio" : "meses de servicio"}</dt><dd className="font-bold tabular-nums">{formatMXN(quote.totalSuma)}</dd></div>
                  </dl>
                  <p className="mt-4 rounded-xl bg-white/10 p-3 text-xs leading-relaxed text-suma-cream/85">
                    <strong>Rango de referencia para 1 sucursal:</strong> pago inicial {formatMXN(quote.setup)}–{formatMXN(quote.setupMax)}
                    {quote.monthlyMax > 0 ? " y servicio mensual " + formatMXN(quote.monthlySuma) + "–" + formatMXN(quote.monthlyMax) : ""}.
                    Un proyecto más grande puede superar ese rango. Confirmamos el costo final antes de contratar.
                  </p>
                  {quote.hasAds && <p className="mt-2 text-xs text-suma-cream/70">+ {formatMXN(quote.totalExternalAds)} de pauta en {quote.months} {quote.months === 1 ? "mes" : "meses"}, pagada directo a la plataforma.</p>}
                  {quote.setupPayments > 1 && <p className="mt-3 text-xs leading-relaxed text-suma-cream/70">
                    El costo total incluye el 100% de la implementación, aunque algunos abonos venzan después del periodo elegido. El calendario exacto se confirma antes de contratar.
                  </p>}
                </>
              )}
              <p className="mt-4 text-xs leading-relaxed text-suma-cream/65">
                Sin cargo de SUMA por persona del equipo. Aparte: licencias de software, WhatsApp API, consumo de IA, hosting y publicidad. {locations > 1 ? "Con varias sucursales revisamos el precio final." : ""}
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
              <p className="mt-4 text-xs text-suma-cream/55">La opción básica empieza en el importe menor. El rango es orientativo, no un límite máximo ni una cotización. Confirmamos alcance y gastos externos antes de contratar.</p>
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
      )}
      </div>
    </div>
  );
}
