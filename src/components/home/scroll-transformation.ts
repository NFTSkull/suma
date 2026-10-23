export type Phase = "before" | "after";

/**
 * Posición del centro del bloque, como fracción de la altura de la ventana,
 * a la que cambia de estado. La banda entre ambos valores es la histéresis:
 * dentro de ella se conserva el estado actual para evitar parpadeos.
 */
export const ENTER_AT = 0.6;
export const EXIT_AT = 0.72;

/** Fracción de la ventana en la que está el centro de un bloque (0 = borde superior, 1 = inferior). */
export function centerRatio(rect: { top: number; height: number }, viewportHeight: number): number {
  return (rect.top + rect.height / 2) / Math.max(viewportHeight, 1);
}

/** Estado al montar o al entrar directo a mitad de página, sin histéresis. */
export function initialPhase(ratio: number): Phase {
  return ratio <= ENTER_AT ? "after" : "before";
}

/** Siguiente estado según el desplazamiento, respetando la banda de histéresis. */
export function nextPhase(current: Phase, ratio: number): Phase {
  if (current === "before" && ratio <= ENTER_AT) return "after";
  if (current === "after" && ratio >= EXIT_AT) return "before";
  return current;
}
