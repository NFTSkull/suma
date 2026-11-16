"use client";

import { motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { ease } from "./motion";
import { cx } from "./ui";

/**
 * Área con línea suave para series cortas (semanas). Etiquetas en el eje X,
 * punto y valor resaltados al pasar el puntero o enfocar con teclado.
 */
export function AreaChart({ points, format, label, height = 180, className }: {
  points: { label: string; value: number }[]; format: (n: number) => string; label: string; height?: number; className?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = height;
  const pad = { t: 18, b: 26, x: 8 };
  const max = Math.max(1, ...points.map((p) => p.value)) * 1.12;
  const x = (i: number) => pad.x + (i * (W - pad.x * 2)) / Math.max(1, points.length - 1);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const coords = points.map((p, i) => [x(i), y(p.value)] as const);
  // Curva monótona simple (Catmull-Rom con tensión baja) para no "inventar" picos.
  const line = coords.reduce((d, [cx_, cy], i, arr) => {
    if (i === 0) return `M${cx_},${cy}`;
    const [px, py] = arr[i - 1];
    const mx = (px + cx_) / 2;
    return `${d} C${mx},${py} ${mx},${cy} ${cx_},${cy}`;
  }, "");
  const area = `${line} L${x(points.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const active = hover ?? points.length - 1;

  return (
    <figure className={cx("relative", className)}>
      <figcaption className="sr-only">{label}: {points.map((p) => `${p.label} ${format(p.value)}`).join(", ")}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={`a${gid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--os-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--os-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad.x} x2={W - pad.x} y1={pad.t + f * (H - pad.t - pad.b)} y2={pad.t + f * (H - pad.t - pad.b)} stroke="var(--os-line)" strokeDasharray="2 5" />
        ))}
        <line x1={pad.x} x2={W - pad.x} y1={H - pad.b} y2={H - pad.b} stroke="var(--os-line-strong)" />
        <motion.path d={area} fill={`url(#a${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.3, ease }} />
        <motion.path d={line} fill="none" stroke="var(--os-accent)" strokeWidth={2.25} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease }} />
        <line x1={coords[active][0]} x2={coords[active][0]} y1={pad.t - 6} y2={H - pad.b} stroke="var(--os-accent)" strokeOpacity="0.25" />
        <circle cx={coords[active][0]} cy={coords[active][1]} r={5} fill="var(--os-paper)" stroke="var(--os-accent)" strokeWidth={2.25} />
        {points.map((p, i) => (
          <g key={p.label + i}>
            <text x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} fontSize="11" fill={i === active ? "var(--os-ink)" : "var(--os-faint)"} fontWeight={i === active ? 600 : 400}>{p.label}</text>
            <rect x={x(i) - (W / points.length) / 2} y={0} width={W / points.length} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
          </g>
        ))}
      </svg>
      <div className="pointer-events-none absolute top-0 rounded-lg bg-(--os-ink) px-2 py-1 text-[11.5px] font-semibold text-white tabular-nums shadow-lg transition-[left] duration-200"
        style={{ left: `clamp(0px, calc(${(coords[active][0] / W) * 100}% - 32px), calc(100% - 72px))` }}>
        {format(points[active].value)}
      </div>
    </figure>
  );
}

/** Anillo de progreso; el trazo se dibuja al aparecer. */
export function Ring({ value, max, size = 72, stroke = 6, children, track = "var(--os-subtle)", color = "var(--os-accent)", label }: {
  value: number; max: number; size?: number; stroke?: number; children?: ReactNode; track?: string; color?: string; label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max ? Math.min(1, value / max) : 0;
  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }} role={label ? "img" : undefined} aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct) }} transition={{ duration: 1, ease }} />
      </svg>
      {children && <span className="absolute inset-0 grid place-items-center">{children}</span>}
    </span>
  );
}
