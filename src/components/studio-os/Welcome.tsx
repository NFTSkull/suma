"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { afterSplash } from "@/components/brand/splash-signal";
import { OsWordmark } from "./brand";
import { Icon } from "./icons";
import { ease } from "./motion";
import { cx } from "./ui";

/**
 * Bienvenida: breve, oscura y editorial. La entrada espera a que termine la
 * pantalla de carga del sitio para que la coreografía se vea completa.
 */
export function Welcome({ onStart, resume }: { onStart: () => void; resume: boolean }) {
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const cta = useRef<HTMLButtonElement>(null);
  useEffect(() => afterSplash(() => setReady(true)), []);
  useEffect(() => { if (ready) cta.current?.focus({ preventScroll: true }); }, [ready]);
  const show = ready ? "show" : "hidden";
  const item = (delay: number) => ({
    variants: { hidden: { opacity: 0, y: 22, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease, delay } } },
    initial: "hidden", animate: show,
  });

  return (
    <div className="os-grain relative flex h-dvh flex-col overflow-hidden bg-(--os-night) text-(--os-ivory)">
      {/* Aura: dos luces lentas en terracota y salvia */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div className="absolute -right-[10%] top-[-20%] size-[70vmax] rounded-full opacity-50 blur-[120px]" style={{ background: "radial-gradient(circle, #B5643F 0%, transparent 62%)" }}
          animate={reduce ? undefined : { x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-[30%] -left-[15%] size-[60vmax] rounded-full opacity-35 blur-[120px]" style={{ background: "radial-gradient(circle, #7C8C74 0%, transparent 60%)" }}
          animate={reduce ? undefined : { x: [0, 50, 0], y: [0, -20, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <header className="relative flex items-center justify-between px-5 pt-5 sm:px-10 sm:pt-8">
        <motion.div {...item(0)}><OsWordmark tone="ivory" /></motion.div>
        <motion.p {...item(0.05)} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11.5px] font-medium text-white/70 backdrop-blur">
          <Icon name="lock" className="size-3.5" /> Demostración privada
        </motion.p>
      </header>

      <main className="relative mx-auto grid w-full max-w-[1320px] flex-1 items-center gap-12 px-5 sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="max-w-[44rem]">
          <motion.p {...item(0.15)} className="os-eyebrow text-[#E2B79F]">Pilates · Yoga · Spa · Wellness</motion.p>
          <motion.h2 {...item(0.25)} className="os-display mt-5 text-[2.75rem] leading-[0.98] sm:text-[4rem] lg:text-[5.2rem]" style={{ fontWeight: 300 }}>
            Tu negocio. Tu esencia. <em className="text-[#E9C4AE]">Tu propio sistema.</em>
          </motion.h2>
          <motion.p {...item(0.4)} className="mt-6 max-w-lg text-[16.5px] leading-relaxed text-white/70 sm:text-[18px]">
            Diseña y explora cómo funcionaría tu negocio con reservas, clientes, equipo, pagos y seguimiento en un solo lugar.
          </motion.p>
          <motion.div {...item(0.55)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button ref={cta} type="button" onClick={onStart}
              className={cx("group inline-flex min-h-14 items-center gap-3 rounded-full bg-(--os-ivory) py-2 pl-7 pr-2 text-[16px] font-semibold text-(--os-night) shadow-[0_20px_50px_-20px_rgba(233,196,174,0.6)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--os-ivory)")}>
              {resume ? "Continuar mi sistema" : "Diseñar mi sistema"}
              <span className="grid size-10 place-items-center rounded-full bg-(--os-night) text-(--os-ivory) transition-transform duration-300 group-hover:translate-x-0.5"><Icon name="arrowRight" className="size-[18px]" /></span>
            </button>
            <span className="text-[13px] text-white/50">Una pregunta a la vez · unos 2 minutos · sin registro</span>
          </motion.div>
        </div>

        <Glimpse ready={ready} reduce={!!reduce} />
      </main>

      <motion.footer {...item(0.8)} className="relative flex flex-wrap items-center justify-between gap-3 px-5 pb-5 text-[12px] text-white/40 sm:px-10 sm:pb-8">
        <span>Demostración personalizada, no un software contratado. Datos ficticios: no se cobra ni se envían mensajes.</span>
        <span className="max-sm:hidden">Reservas · Clientes · Equipo · Pagos · Seguimiento</span>
      </motion.footer>
    </div>
  );
}

/** Fragmentos del producto flotando con perspectiva: insinúan el sistema sin explicarlo. */
function Glimpse({ ready, reduce }: { ready: boolean; reduce: boolean }) {
  const float = (d: number) => (reduce ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 7 + d, repeat: Infinity, ease: "easeInOut" as const, delay: d } });
  const enter = (delay: number) => ({ initial: { opacity: 0, y: 40, rotateX: 18 }, animate: ready ? { opacity: 1, y: 0, rotateX: 0 } : undefined, transition: { duration: 1.1, ease, delay } });
  return (
    <div aria-hidden="true" className="relative hidden h-[520px] [perspective:1400px] lg:block">
      <motion.div {...enter(0.5)} className="absolute left-0 top-6 w-[340px]">
        <motion.div {...float(0)} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <p className="os-eyebrow text-white/50">Hoy · jueves</p>
          <ul className="mt-3 space-y-2.5">
            {[["07:00", "Reformer básico", 100], ["10:00", "Masaje relajante · Cabina Jade", 100], ["12:30", "Sesión de recuperación", 60], ["19:00", "Meditación grupal", 75]].map(([t, n, p]) => (
              <li key={t as string} className="grid grid-cols-[44px_1fr_56px] items-center gap-3 text-[13px]">
                <span className="os-num text-white/60">{t}</span>
                <span className="truncate font-medium text-white/90">{n}</span>
                <span className="h-1 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-[#E9C4AE]" style={{ width: `${p}%` }} /></span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
      <motion.div {...enter(0.7)} className="absolute right-0 top-40 w-[270px]">
        <motion.div {...float(1.2)} className="rounded-[22px] bg-(--os-ivory) p-5 text-(--os-ink) shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[#EBD6C8] text-[13px] font-semibold text-[#6B3B25]">DG</span>
            <span><span className="block text-[14px] font-semibold">Daniela Garza</span><span className="text-[12px] text-(--os-muted)">Paquete 10 clases</span></span>
          </div>
          <div className="mt-4 flex items-baseline justify-between"><span className="os-num text-[28px] font-medium leading-none">7</span><span className="text-[12px] text-(--os-muted)">créditos · vence 28 nov</span></div>
          <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-(--os-subtle)"><span className="block h-full w-[30%] rounded-full bg-[#A4502F]" /></span>
        </motion.div>
      </motion.div>
      <motion.div {...enter(0.9)} className="absolute bottom-4 left-16 w-[300px]">
        <motion.div {...float(2.1)} className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
          <svg viewBox="0 0 64 64" className="size-16 -rotate-90"><circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" /><circle cx="32" cy="32" r="27" fill="none" stroke="#9FB096" strokeWidth="6" strokeLinecap="round" strokeDasharray="169.6" strokeDashoffset="23.7" /></svg>
          <span><span className="os-num block text-[26px] font-medium leading-none text-white">86%</span><span className="mt-1 block text-[12.5px] text-white/60">Ocupación esta semana</span></span>
        </motion.div>
      </motion.div>
    </div>
  );
}

