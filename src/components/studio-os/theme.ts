import type { CSSProperties } from "react";
import { themes } from "@/lib/studio-os/catalog";
import type { ThemeId } from "@/lib/studio-os/types";

/**
 * Tokens de SUMA Studio OS. Neutros fijos (marfil, piedra, grafito) y un acento
 * por tema. Todo el color pasa por estas variables; las de acento están
 * registradas con @property (studio-os.css) para que el cambio de tema se anime.
 */
export const neutrals = {
  "--os-ink": "#1D1B19",
  "--os-ink-2": "#3A3632",
  "--os-muted": "#6A635B",
  "--os-faint": "#9A938A",
  "--os-line": "#E6E0D6",
  "--os-line-strong": "#D6CEC2",
  "--os-subtle": "#F2EEE7",
  "--os-paper": "#FFFDF9",
  "--os-ivory": "#F7F4EE",
  "--os-night": "#171513",
  "--os-sage": "#7C8C74",
  "--os-sage-soft": "#E6EBE1",
  "--os-terra": "#B5643F",
  "--os-success": "#2F6B47",
  "--os-success-soft": "#E3EFE6",
  "--os-warn": "#7D5210",
  "--os-warn-soft": "#F8EDD8",
  "--os-danger": "#962B2B",
  "--os-danger-soft": "#F8E5E2",
} as const;

export function themeStyle(theme: ThemeId): CSSProperties {
  const t = themes[theme];
  return {
    "--os-accent": t.accent,
    "--os-hover": t.hover,
    "--os-soft": t.soft,
    "--os-accent-ink": t.ink,
    "--os-canvas": t.canvas,
    ...neutrals,
  } as CSSProperties;
}
