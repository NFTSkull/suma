import type { Transition, Variants } from "motion/react";

/** Coreografía compartida: una sola curva y tres resortes para toda la demo. */
export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const spring = {
  snappy: { type: "spring", stiffness: 520, damping: 40, mass: 0.8 } satisfies Transition,
  soft: { type: "spring", stiffness: 220, damping: 30 } satisfies Transition,
  gentle: { type: "spring", stiffness: 120, damping: 22 } satisfies Transition,
};

/** Transición de preguntas: la nueva entra desde la dirección del avance. */
export const questionVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 28 : -28, filter: "blur(6px)" }),
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease } },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -18 : 18, filter: "blur(4px)", transition: { duration: 0.28, ease: easeInOut } }),
};

export const stagger = (delay = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
});

export const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
