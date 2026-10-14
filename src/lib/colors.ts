import type { SumaColor } from "@/types/content";

/** Clases de Tailwind por color de marca, con combinaciones de contraste verificadas. */
export const colorStyles: Record<
  SumaColor,
  { bg: string; text: string; onBg: string; ink: string; soft: string; ring: string; dot: string }
> = {
  orange: {
    bg: "bg-suma-orange",
    text: "text-suma-orange",
    onBg: "text-suma-navy",
    ink: "text-suma-orange-ink",
    soft: "bg-suma-orange/12",
    ring: "ring-suma-orange",
    dot: "bg-suma-orange",
  },
  pink: {
    bg: "bg-suma-pink",
    text: "text-suma-pink",
    onBg: "text-suma-navy",
    ink: "text-suma-pink-ink",
    soft: "bg-suma-pink/12",
    ring: "ring-suma-pink",
    dot: "bg-suma-pink",
  },
  purple: {
    bg: "bg-suma-purple",
    text: "text-suma-purple",
    onBg: "text-suma-cream",
    ink: "text-suma-purple",
    soft: "bg-suma-purple/10",
    ring: "ring-suma-purple",
    dot: "bg-suma-purple",
  },
  navy: {
    bg: "bg-suma-navy",
    text: "text-suma-navy",
    onBg: "text-suma-cream",
    ink: "text-suma-navy",
    soft: "bg-suma-navy/8",
    ring: "ring-suma-navy",
    dot: "bg-suma-navy",
  },
};
