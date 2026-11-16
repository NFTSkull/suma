"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { studioDisplayName } from "@/lib/studio-os/catalog";
import { moduleCopy, verticalOf } from "@/lib/studio-os/verticals";
import type { StudioConfig } from "@/lib/studio-os/types";
import { Monogram } from "./brand";
import { Icon } from "./icons";
import { ease, spring } from "./motion";
import { moduleIcon } from "./nav";

/**
 * Revelación: tu marca, tu nombre y las piezas de tu sistema aparecen en
 * secuencia (≈2 s). No simula cargas: el botón para entrar está desde el inicio.
 */
export function Reveal({ config, logo, onDone }: { config: StudioConfig; logo: string | null; onDone: () => void }) {
  const reduce = useReducedMotion();
  const name = studioDisplayName(config);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => { button.current?.focus({ preventScroll: true }); }, []);
  const t = (s: number) => (reduce ? 0 : s);
  const letters = Array.from(name);

  return (
    <div className="os-grain relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-(--os-night) px-5 text-center text-(--os-ivory)">
      <motion.div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--os-accent) 0%, transparent 65%)" }}
        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.55, scale: 1 }} transition={{ duration: t(1.6), ease }} />

      <div className="relative">
        <motion.svg viewBox="0 0 120 120" className="absolute -inset-5 size-[calc(100%+40px)] -rotate-90" aria-hidden="true">
          <motion.circle cx="60" cy="60" r="57" fill="none" stroke="var(--os-ivory)" strokeOpacity="0.35" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: t(1.2), ease, delay: t(0.15) }} />
        </motion.svg>
        <motion.div initial={{ scale: 0.6, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={reduce ? { duration: 0 } : { ...spring.soft, delay: 0.1 }}>
          <Monogram name={name} logo={logo} size={88} />
        </motion.div>
      </div>

      <motion.p className="os-eyebrow relative mt-9 text-[#E9C4AE]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: t(0.6), delay: t(0.35) }}>{verticalOf(config).name}</motion.p>
      <h2 className="os-display relative mt-3 text-[2.6rem] leading-none sm:text-[4rem]" aria-label={name} style={{ fontWeight: 330 }}>
        {letters.map((ch, i) => (
          <motion.span key={i} aria-hidden="true" className="inline-block whitespace-pre" initial={{ opacity: 0, y: "0.4em", filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: t(0.7), ease, delay: t(0.45 + i * 0.03) }}>{ch}</motion.span>
        ))}
      </h2>

      <motion.ul className="relative mt-10 flex max-w-xl flex-wrap justify-center gap-2" initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: t(0.08), delayChildren: t(0.9) } } }}>
        {config.modules.map((m) => (
          <motion.li key={m} variants={{ hidden: { opacity: 0, y: 14, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: reduce ? { duration: 0 } : spring.soft } }}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-2 text-[13px] text-white/85 backdrop-blur">
            <Icon name={moduleIcon[m]} className="size-4 text-[#E9C4AE]" />{moduleCopy(m, config).name.split(" y ")[0]}
          </motion.li>
        ))}
      </motion.ul>

      <motion.div className="relative mt-12 flex flex-col items-center gap-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: t(0.7), ease, delay: t(1.5) }}>
        <p className="max-w-md text-[16px] leading-relaxed text-white/70">Te damos la bienvenida. Así se vería <span className="text-white">{name}</span> funcionando hoy, con datos de ejemplo.</p>
        <button ref={button} type="button" onClick={onDone}
          className="group inline-flex min-h-13 items-center gap-3 rounded-full bg-(--os-ivory) py-2 pl-6 pr-2 text-[15px] font-semibold text-(--os-night) transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--os-ivory)">
          Entrar a mi sistema
          <span className="grid size-9 place-items-center rounded-full bg-(--os-accent) text-white transition-transform duration-300 group-hover:translate-x-0.5"><Icon name="arrowRight" className="size-4" /></span>
        </button>
      </motion.div>
    </div>
  );
}
