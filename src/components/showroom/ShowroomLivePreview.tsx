"use client";

import { useState } from "react";
import {
  showroomPalettes,
  type ShowroomExperienceId,
  type ShowroomIndustryId,
  type ShowroomPaletteId,
} from "@/content/showroom";
import { getShowroomIndustry } from "@/lib/showroom";

type Props = {
  experience: ShowroomExperienceId;
  industry: ShowroomIndustryId;
  brandName: string;
  paletteId: ShowroomPaletteId;
  teamUsers?: number;
  locations?: number;
};

const simulated = "Simulación con datos ficticios · Sin conexiones reales";

export function ShowroomLivePreview({ experience, industry, brandName, paletteId, teamUsers = 5, locations = 1 }: Props) {
  const palette = showroomPalettes.find((item) => item.id === paletteId) ?? showroomPalettes[0];
  const business = getShowroomIndustry(industry);
  const name = brandName.trim().slice(0, 45) || business.example;
  const [leadContacted, setLeadContacted] = useState(false);
  const [chatChoice, setChatChoice] = useState<"hola" | "horarios" | "precio" | "persona">("hola");
  const [adAngle, setAdAngle] = useState<"prueba" | "paquete">("prueba");
  const [slot, setSlot] = useState<string | null>(null);
  const [webExpanded, setWebExpanded] = useState(false);
  const [automationDone, setAutomationDone] = useState(false);
  const [appTab, setAppTab] = useState<"clases" | "perfil">("clases");
  const [crmView, setCrmView] = useState<"ventas" | "operaciones">("ventas");

  const softButton = "min-h-10 rounded-xl border border-suma-navy/15 bg-white px-3 py-2 text-xs font-bold text-suma-navy transition-colors hover:border-suma-purple focus-visible:outline-suma-orange";
  const leadName = industry === "spa" ? "Lucía M." : "Mariana G.";

  return (
    <div aria-label="Vista previa interactiva" className="overflow-hidden rounded-[1.5rem] border border-suma-line bg-white shadow-lift">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-suma-line bg-suma-cream-soft px-4 py-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-suma-orange" />
          <span aria-hidden="true" className="size-2.5 rounded-full bg-suma-pink" />
          <span aria-hidden="true" className="size-2.5 rounded-full bg-suma-purple" />
          <span className="ml-2 text-xs font-bold text-suma-navy/70">Vista previa de tu experiencia</span>
        </div>
        <span className="rounded-full bg-suma-navy/5 px-3 py-1 text-[0.7rem] font-bold text-suma-navy/70">DEMO · NO OPERATIVA</span>
      </div>

      <div className="min-h-[25rem] text-suma-navy">
        {(experience === "crm" || experience === "crm-medida") && (
          <div className="min-h-[25rem]">
            <div className={palette.base + " flex flex-wrap items-center justify-between gap-2 px-5 py-5 text-white"}>
              <div>
                <p className="text-xs font-medium text-white/70">{experience === "crm-medida" ? "Panel personalizado" : "Tus consultas · ejemplo de CRM"}</p>
                <h3 className="mt-1 font-display text-xl font-extrabold">{name}</h3>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                Equipo · {teamUsers} {teamUsers === 1 ? "persona" : "personas"}{locations > 1 ? " · " + locations + " sedes" : ""}
              </span>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex flex-wrap gap-2">
                {(["ventas", "operaciones"] as const).map((view) => (
                  <button type="button" key={view} onClick={() => setCrmView(view)}
                    aria-pressed={crmView === view}
                    className={softButton + (crmView === view ? " !border-suma-purple !bg-suma-purple/10" : "")}>
                    {view === "ventas" ? "Interesados" : "Operación"}
                  </button>
                ))}
              </div>
              {crmView === "ventas" ? (
                <>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[["12", "Nuevos"], [leadContacted ? "8" : "7", "En seguimiento"], ["4", "Visitas previstas"]].map(([num, label]) => (
                      <div key={label} className={palette.light + " rounded-xl px-3 py-4"}>
                        <p className={palette.text + " font-display text-2xl font-extrabold"}>{num}</p>
                        <p className="mt-1 text-[0.7rem] font-semibold text-suma-navy/70">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-suma-line p-4">
                    <p className="text-xs font-semibold text-suma-navy/55">Persona interesada · mensaje de ejemplo</p>
                    <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{leadName}</p>
                        <p className="mt-1 text-xs text-suma-navy/65">Preguntó por: {business.offering}</p>
                      </div>
                      <span className="rounded-full bg-suma-orange/15 px-3 py-1 text-xs font-semibold">{leadContacted ? "En seguimiento" : "Pendiente"}</span>
                    </div>
                    <button type="button" onClick={() => setLeadContacted(!leadContacted)}
                      className="mt-4 min-h-11 w-full rounded-xl bg-suma-navy px-4 text-sm font-bold text-white hover:bg-suma-purple">
                      {leadContacted ? "Volver a pendiente" : "Simular que mi equipo respondió →"}
                    </button>
                    <p aria-live="polite" className="mt-3 text-xs leading-relaxed text-suma-navy/65">
                      {leadContacted
                        ? "Así verías qué consulta ya tiene un siguiente paso. Es una prueba: no enviamos ningún mensaje."
                        : "Esta persona preguntó, pero tu equipo todavía no registra una respuesta. Pulsa el botón para simular el cambio."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-5 grid gap-3">
                  {["Asignación de consultas al equipo", "Permisos según responsabilidad", "Vista de pendientes por atender"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-suma-line p-3">
                      <span className={palette.accent + " flex size-9 items-center justify-center rounded-lg font-bold"}>{index + 1}</span>
                      <p className="text-sm font-semibold">{item}</p>
                    </div>
                  ))}
                  <p className="text-xs text-suma-navy/60">El funcionamiento real se define según software, roles y alcance contratado.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {experience === "chatbot" && (
          <div className="mx-auto max-w-lg p-4 md:p-6">
            <div className={palette.base + " flex items-center gap-3 rounded-t-2xl p-4 text-white"}>
              <span className={palette.accent + " grid size-10 place-items-center rounded-full font-bold text-suma-navy"}>{name[0]}</span>
              <div><h3 className="font-bold">{name}</h3><p className="text-xs text-white/70">Asistente · escenario ilustrativo</p></div>
            </div>
            <div className={palette.light + " space-y-3 rounded-b-2xl p-4"}>
              <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-white p-3 text-sm">¡Hola! Bienvenida a {name}. ¿Qué te gustaría saber?</p>
              {chatChoice !== "hola" && (
                <>
                  <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-suma-navy p-3 text-sm text-white">
                    {chatChoice === "horarios" ? "¿Qué horarios tienen?" : chatChoice === "precio" ? "¿Cuánto cuesta?" : "Quiero hablar con una persona"}
                  </p>
                  <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-white p-3 text-sm">
                    {chatChoice === "horarios"
                      ? "Podemos mostrar horarios de " + business.offering + " si tu sistema permite consultarlos. ¿Te gustaría conocer el siguiente paso?"
                      : chatChoice === "precio"
                        ? "Aquí mostraríamos tus paquetes y precios reales. El negocio decide qué información compartir."
                        : "Te comunicaríamos con alguien del equipo y dejaríamos el contexto preparado."}
                  </p>
                </>
              )}
              <div className="grid gap-2 pt-2 sm:grid-cols-3">
                <button type="button" className={softButton} onClick={() => setChatChoice("horarios")}>Ver horarios</button>
                <button type="button" className={softButton} onClick={() => setChatChoice("precio")}>Consultar precios</button>
                <button type="button" className={softButton} onClick={() => setChatChoice("persona")}>Hablar con equipo</button>
              </div>
            </div>
          </div>
        )}

        {experience === "ads" && (
          <div className="mx-auto max-w-[24rem] p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2 pb-3">
              <button type="button" aria-pressed={adAngle === "prueba"} onClick={() => setAdAngle("prueba")} className={softButton + (adAngle === "prueba" ? " !border-suma-purple !bg-suma-purple/10" : "")}>Primera visita</button>
              <button type="button" aria-pressed={adAngle === "paquete"} onClick={() => setAdAngle("paquete")} className={softButton + (adAngle === "paquete" ? " !border-suma-purple !bg-suma-purple/10" : "")}>Paquetes</button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-suma-line shadow-soft">
              <div className="flex items-center gap-3 bg-white p-3">
                <span className={palette.base + " grid size-9 place-items-center rounded-full font-bold text-white"}>{name[0]}</span>
                <span><strong className="block text-sm">{name}</strong><small className="text-suma-navy/55">Concepto de anuncio · ficticio</small></span>
              </div>
              <div className={palette.base + " relative flex min-h-64 flex-col justify-between overflow-hidden p-6 text-white"}>
                <span aria-hidden="true" className={palette.accent + " absolute -right-16 top-8 size-48 rounded-full opacity-70 blur-sm"} />
                <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-white/75">{business.name}</p>
                <div className="relative">
                  <h3 className="font-display text-3xl font-extrabold leading-none">
                    {adAngle === "prueba" ? "Tu siguiente experiencia empieza aquí." : "Haz espacio para lo que disfrutas."}
                  </h3>
                  <p className="mt-3 max-w-[14rem] text-sm text-white/85">
                    {adAngle === "prueba" ? "Conoce " + business.offering.toLowerCase() + " y pregunta por tu primera visita." : "Descubre las opciones y paquetes de " + name + "."}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 bg-white p-3">
                <span className="text-xs text-suma-navy/65">Destino: tu WhatsApp o reservador</span>
                <span className="rounded-lg bg-suma-navy px-3 py-2 text-xs font-bold text-white">Más información</span>
              </div>
            </div>
          </div>
        )}

        {experience === "reservas" && (
          <div className="p-5 md:p-7">
            <div className={palette.base + " rounded-2xl p-5 text-white"}>
              <p className="text-xs uppercase tracking-widest text-white/70">Disponibilidad · ejemplo</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold">{business.offering}</h3>
              <p className="mt-1 text-sm text-white/75">{name} · sin conexión a una agenda real</p>
            </div>
            <p className="mb-3 mt-6 text-sm font-bold">Elige un horario de ejemplo</p>
            <div className="grid grid-cols-3 gap-2">
              {["08:00", "17:30", "19:00"].map((time) => (
                <button key={time} type="button" onClick={() => setSlot(time)}
                  aria-pressed={slot === time}
                  className={"min-h-14 rounded-xl border-2 text-sm font-bold transition-colors " + (slot === time ? "border-suma-orange bg-suma-orange/10" : "border-suma-line hover:border-suma-orange")}>
                  {time}
                </button>
              ))}
            </div>
            <p className="mt-5 rounded-xl bg-suma-cream-deep p-4 text-sm font-semibold">
              {slot ? "Seleccionaste " + slot + ". Así se vería la siguiente etapa; no se registró ninguna reserva." : "Selecciona un horario para ver la experiencia de reserva."}
            </p>
          </div>
        )}

        {experience === "web" && (
          <div className={palette.light + " p-5 md:p-7"}>
            <div className={palette.base + " relative overflow-hidden rounded-2xl p-5 text-white md:p-8"}>
              <span aria-hidden="true" className={palette.accent + " absolute -right-12 top-14 size-44 rounded-full opacity-80"} />
              <div className="relative flex items-center justify-between gap-3">
                <strong className="font-display text-xl">{name}</strong>
                <span className="text-xs text-white/80">Clases · Nosotros · Contacto</span>
              </div>
              <div className="relative mb-8 mt-14 max-w-[19rem]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{business.name}</p>
                <h3 className="mt-2 font-display text-4xl font-extrabold leading-tight">Tu momento empieza aquí.</h3>
                <p className="mt-3 text-sm text-white/85">Descubre {business.offering.toLowerCase()} y encuentra tu siguiente paso.</p>
                <button type="button" onClick={() => setWebExpanded(!webExpanded)}
                  className={palette.accent + " mt-6 min-h-11 rounded-full px-6 text-sm font-bold text-suma-navy"}>
                  {business.cta} →
                </button>
              </div>
            </div>
            {webExpanded && <p className="mt-4 rounded-xl bg-white p-4 text-sm font-semibold text-suma-navy">Esta sección mostraría horarios, servicios o un enlace a tu sistema de reservas actual.</p>}
          </div>
        )}

        {experience === "automatizacion" && (
          <div className="p-5 md:p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-suma-purple">Flujo de seguimiento · ejemplo</p>
            <div className="mt-6 space-y-3">
              {[
                ["01", "Llega una consulta", "Desde formulario, campaña o canal autorizado"],
                ["02", "Se asigna al equipo", "Queda un siguiente paso visible"],
                ["03", "Se prepara un seguimiento", "Solo si se cuenta con permisos y datos"],
              ].map(([i, title, subtitle], index) => (
                <div key={i} className={"flex gap-4 rounded-xl border p-4 " + (automationDone && index <= 2 ? "border-suma-purple bg-suma-purple/5" : "border-suma-line")}>
                  <span className={palette.accent + " grid size-10 shrink-0 place-items-center rounded-full font-display font-extrabold"}>{i}</span>
                  <div><p className="font-bold">{title}</p><p className="mt-1 text-xs text-suma-navy/65">{subtitle}</p></div>
                  {automationDone && <span className="ml-auto text-suma-purple">✓</span>}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setAutomationDone(!automationDone)}
              className="mt-6 min-h-12 w-full rounded-xl bg-suma-navy px-4 text-sm font-bold text-white hover:bg-suma-purple">
              {automationDone ? "Reiniciar simulación" : "Simular recorrido →"}
            </button>
          </div>
        )}

        {experience === "app" && (
          <div className={palette.light + " flex min-h-[27rem] items-start justify-center p-5"}>
            <div className="w-full max-w-[19rem] overflow-hidden rounded-[2rem] border-[6px] border-suma-navy bg-white shadow-lift">
              <div className={palette.base + " px-5 pb-7 pt-5 text-white"}>
                <p className="text-xs text-white/70">Mi espacio</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold">{name}</h3>
                <p className="mt-2 text-sm">Un lugar para tus experiencias.</p>
              </div>
              <div className="min-h-40 p-4">
                {appTab === "clases" ? (
                  <><p className="text-xs font-bold uppercase tracking-widest text-suma-navy/55">Próximas experiencias</p>
                    <div className="mt-3 rounded-xl border border-suma-line p-4">
                      <p className="font-bold">{business.offering}</p>
                      <p className="mt-1 text-xs text-suma-navy/65">Mañana · 8:00 · demostración</p>
                    </div></>
                ) : (
                  <><p className="text-xs font-bold uppercase tracking-widest text-suma-navy/55">Tu membresía</p>
                    <div className="mt-3 rounded-xl border border-suma-line p-4">
                      <p className="font-bold">Plan de ejemplo</p><p className="mt-1 text-xs text-suma-navy/65">Beneficios e historial sujetos al producto que diseñemos.</p>
                    </div></>
                )}
              </div>
              <div className="grid grid-cols-2 border-t border-suma-line">
                {(["clases", "perfil"] as const).map((tab) => (
                  <button key={tab} type="button" aria-pressed={tab === appTab} onClick={() => setAppTab(tab)}
                    className={"min-h-11 text-xs font-bold " + (tab === appTab ? "bg-suma-orange/15 text-suma-navy" : "text-suma-navy/50")}>
                    {tab === "clases" ? "Clases" : "Membresía"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {experience === "seo" && (
          <div className="p-5 md:p-7">
            <div className="rounded-full border border-suma-line px-5 py-3 text-sm text-suma-navy/65"> {business.name.toLowerCase()} cerca de mí <span className="float-right">⌕</span></div>
            <p className="mt-6 text-xs text-suma-navy/55">Ejemplo de cómo podría presentarse tu información en una búsqueda</p>
            <div className="mt-4 rounded-xl border border-suma-line p-5">
              <p className="text-xs text-suma-navy/60">sitio-ejemplo.mx · Concepto visual</p>
              <p className="mt-2 font-display text-xl font-bold text-suma-purple">{name} | {business.offering}</p>
              <p className="mt-2 text-sm text-suma-navy/70">{name}: conoce nuestras experiencias, información y canales de contacto.</p>
              <p className="mt-5 text-xs font-semibold text-suma-orange-ink">Sin posiciones, reseñas ni fichas reales garantizadas.</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-suma-line bg-suma-cream-soft px-5 py-3 text-center text-xs font-semibold text-suma-navy/60">
        {simulated}
      </div>
    </div>
  );
}
