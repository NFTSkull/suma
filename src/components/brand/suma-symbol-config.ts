/**
 * Geometría y coreografía del isotipo animado de SUMA STUDIO.
 *
 * Las tres piezas oficiales (public/brand/naranja.svg, rosa.svg, morado.svg)
 * comparten el mismo viewBox que simbolo_capas.svg, así que la composición
 * final exacta es simplemente las tres capas superpuestas sin desplazamiento.
 * Todo el movimiento se expresa como desviaciones respecto a esa pose cero.
 */

export const SYMBOL_VIEWBOX = { width: 720, height: 974 } as const;

/** Área que ocupa el símbolo dentro del viewBox (con margen) para recortar el aire transparente. */
export const SYMBOL_BOUNDS = { x: 30, y: 144, width: 650, height: 701 } as const;

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

/** Posición de cada SVG dentro de la caja recortada del símbolo. */
export const symbolImageFrame = {
  left: pct(-SYMBOL_BOUNDS.x / SYMBOL_BOUNDS.width),
  top: pct(-SYMBOL_BOUNDS.y / SYMBOL_BOUNDS.height),
  width: pct(SYMBOL_VIEWBOX.width / SYMBOL_BOUNDS.width),
  height: pct(SYMBOL_VIEWBOX.height / SYMBOL_BOUNDS.height),
} as const;

export const SYMBOL_ASPECT_RATIO = `${SYMBOL_BOUNDS.width} / ${SYMBOL_BOUNDS.height}`;

export type PieceKey = "naranja" | "rosa" | "morado";

type Box = { x1: number; y1: number; x2: number; y2: number };

/** Centro de una pieza como transform-origin dentro de la caja del símbolo, para que gire sobre sí misma. */
function originOf({ x1, y1, x2, y2 }: Box): string {
  const cx = ((x1 + x2) / 2 - SYMBOL_BOUNDS.x) / SYMBOL_BOUNDS.width;
  const cy = ((y1 + y2) / 2 - SYMBOL_BOUNDS.y) / SYMBOL_BOUNDS.height;
  return `${pct(cx)} ${pct(cy)}`;
}

/**
 * Orden de apilado = orden de capas en simbolo_capas.svg (la intersección morada va encima).
 * Las cajas son los límites medidos de cada trazado en el viewBox 720×974.
 */
export const symbolPieces: ReadonlyArray<{ key: PieceKey; src: string; origin: string }> = [
  { key: "naranja", src: "/brand/naranja.svg", origin: originOf({ x1: 38, y1: 152, x2: 579, y2: 636 }) },
  { key: "rosa", src: "/brand/rosa.svg", origin: originOf({ x1: 123, y1: 409, x2: 672, y2: 837 }) },
  { key: "morado", src: "/brand/morado.svg", origin: originOf({ x1: 220, y1: 410, x2: 445, y2: 637 }) },
];

export type SymbolVariant = "hero" | "cta" | "subtle";

/** x / y en % del tamaño del símbolo; rotate en grados. */
export type Pose = { x: number; y: number; rotate: number; scale: number };

export const FORMED_POSE: Pose = { x: 0, y: 0, rotate: 0, scale: 1 };

export type SymbolMotion = {
  /** Pose de cada pieza mientras están separadas. */
  spread: Record<PieceKey, Pose>;
  /** Flotación mientras están separadas (amplitud en % del símbolo, duración de medio ciclo en s). */
  float: { amplitude: number; rotate: number; duration: number };
  /** Segundos que las piezas flotan separadas antes de unirse. */
  hold: number;
  /** Duración de cada pieza al unirse y desfase entre piezas (s). */
  assemble: { duration: number; stagger: number };
  /** Micro-oscilación del símbolo ya formado: se mueve completo, nunca se desalinea. */
  idle: { lift: number; rotate: number; duration: number };
};

export const symbolMotion: Record<SymbolVariant, SymbolMotion> = {
  hero: {
    spread: {
      naranja: { x: -30, y: -20, rotate: -16, scale: 0.92 },
      rosa: { x: 28, y: 22, rotate: 14, scale: 0.94 },
      morado: { x: 42, y: 4, rotate: 26, scale: 0.78 },
    },
    float: { amplitude: 3, rotate: 4, duration: 3.6 },
    hold: 1.2,
    assemble: { duration: 1.6, stagger: 0.14 },
    idle: { lift: 1.2, rotate: 1.2, duration: 5 },
  },
  cta: {
    spread: {
      naranja: { x: -18, y: -13, rotate: -10, scale: 0.95 },
      rosa: { x: 17, y: 14, rotate: 9, scale: 0.96 },
      morado: { x: 26, y: -16, rotate: 16, scale: 0.85 },
    },
    float: { amplitude: 2, rotate: 3, duration: 3.8 },
    hold: 0.8,
    assemble: { duration: 1.35, stagger: 0.12 },
    idle: { lift: 0.9, rotate: 0.9, duration: 5.5 },
  },
  subtle: {
    spread: {
      naranja: { x: -9, y: -7, rotate: -5, scale: 0.97 },
      rosa: { x: 9, y: 7, rotate: 5, scale: 0.98 },
      morado: { x: 12, y: -9, rotate: 8, scale: 0.92 },
    },
    float: { amplitude: 1.2, rotate: 1.5, duration: 4 },
    hold: 0.5,
    assemble: { duration: 1.1, stagger: 0.1 },
    idle: { lift: 0.6, rotate: 0.6, duration: 6 },
  },
};

/**
 * Factor de recorrido según el ancho de la ventana: algo menos de desplazamiento
 * en tablet y móvil, sin llegar a que el movimiento pase desapercibido.
 */
export function travelScale(viewportWidth: number): number {
  if (viewportWidth < 640) return 0.8;
  if (viewportWidth < 1024) return 0.9;
  return 1;
}

/** Pose separada de una pieza ya ajustada al recorrido disponible. */
export function spreadPose(variant: SymbolVariant, key: PieceKey, travel = 1): Pose {
  const p = symbolMotion[variant].spread[key];
  return { x: p.x * travel, y: p.y * travel, rotate: p.rotate * travel, scale: 1 - (1 - p.scale) * travel };
}
