import type { CSSProperties } from "react";
import { themes } from "@/lib/studio-os/catalog";
import type { ThemeId } from "@/lib/studio-os/types";

/** Tokens: neutros fijos y acento del tema elegido. Todo el color pasa por estas variables. */
export function themeStyle(theme: ThemeId): CSSProperties {
  const t = themes[theme];
  return {
    "--os-accent": t.accent,
    "--os-hover": t.hover,
    "--os-soft": t.soft,
    "--os-accent-ink": t.ink,
    "--os-canvas": t.canvas,
    "--os-ink": "#1F1C1A",
    "--os-muted": "#6B645D",
    "--os-line": "#E8E2DA",
    "--os-subtle": "#F3EFEA",
  } as CSSProperties;
}
