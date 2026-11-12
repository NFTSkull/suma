"use client";

import { cx } from "./ui";

/** Marca del estudio: el logotipo subido o un monograma con la inicial en el color del tema. */
export function Monogram({ name, logo, size = 36, className, tone = "accent" }: { name: string; logo: string | null; size?: number; className?: string; tone?: "accent" | "ivory" }) {
  const initial = (name.trim()[0] ?? "S").toUpperCase();
  const radius = Math.round(size * 0.3);
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- imagen local en memoria, sin optimización de servidor
      <img src={logo} alt="" className={cx("shrink-0 bg-white object-contain ring-1 ring-black/5", className)} style={{ width: size, height: size, borderRadius: radius, padding: size * 0.1 }} />
    );
  }
  return (
    <span aria-hidden="true" className={cx("os-display grid shrink-0 place-items-center leading-none", tone === "accent" ? "bg-(--os-accent) text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" : "bg-(--os-ivory) text-(--os-ink)", className)}
      style={{ width: size, height: size, borderRadius: radius, fontSize: size * 0.52, fontStyle: "italic" }}>
      {initial}
    </span>
  );
}

/** Firma de SUMA Studio OS para las pantallas propias de la demo. */
export function OsWordmark({ tone = "ink" }: { tone?: "ink" | "ivory" }) {
  return (
    <span className={cx("inline-flex items-baseline gap-2 text-[13px]", tone === "ivory" ? "text-(--os-ivory)" : "text-(--os-ink)")}>
      <span className="font-semibold tracking-[0.18em]">SUMA</span>
      <span className={cx("os-display text-[15px] italic", tone === "ivory" ? "text-(--os-ivory)/70" : "text-(--os-muted)")}>Studio OS</span>
    </span>
  );
}
