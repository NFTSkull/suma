"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export { themeStyle } from "./theme";

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");
export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--os-accent)";
export const inputClass =
  "h-11 w-full min-w-0 rounded-xl border border-(--os-line) bg-white px-3 text-base text-(--os-ink) placeholder:text-[#958E87] transition-colors duration-150 hover:border-[#D6CEC4] focus-visible:border-(--os-accent) focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-(--os-accent) sm:text-[15px]";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-(--os-accent) text-white shadow-[0_1px_0_rgba(0,0,0,0.06)] hover:bg-(--os-hover)",
  secondary: "border border-(--os-line) bg-white text-(--os-ink) hover:bg-(--os-subtle)",
  ghost: "text-(--os-ink) hover:bg-(--os-subtle)",
  soft: "bg-(--os-soft) text-(--os-accent-ink) hover:brightness-[0.97]",
  danger: "border border-[#EBC9C4] bg-white text-[#9B2C2C] hover:bg-[#FBEAE7]",
};
const sizes = { sm: "min-h-10 px-3 text-[13px]", md: "min-h-11 px-4 text-sm", lg: "min-h-12 px-5 text-[15px]" };

export function Button({
  variant = "secondary", size = "md", icon, iconRight, className, children, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: keyof typeof sizes; icon?: IconName; iconRight?: IconName }) {
  return (
    <button
      type="button"
      className={cx("inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45", focusRing, variants[variant], sizes[size], className)}
      {...rest}
    >
      {icon && <Icon name={icon} className="size-[18px]" />}
      {children}
      {iconRight && <Icon name={iconRight} className="size-[18px]" />}
    </button>
  );
}

export function Card({ className, children, as: Tag = "section", ...rest }: { className?: string; children: ReactNode; as?: "section" | "div" | "article" | "li" } & Record<string, unknown>) {
  return <Tag className={cx("rounded-2xl border border-(--os-line) bg-white", className)} {...rest}>{children}</Tag>;
}

export function PageHeader({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="os-display text-[1.75rem] leading-tight text-(--os-ink) lg:text-[2rem]">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-(--os-muted)">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, hint, action }: { children: ReactNode; hint?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[15px] font-semibold text-(--os-ink)">{children}</h3>
        {hint && <p className="mt-0.5 text-[13px] leading-snug text-(--os-muted)">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

type Tone = "neutral" | "accent" | "success" | "warn" | "danger";
const tones: Record<Tone, string> = {
  neutral: "bg-[#EFEBE6] text-[#4F4943]",
  accent: "bg-(--os-soft) text-(--os-accent-ink)",
  success: "bg-[#E2F0E6] text-[#25603D]",
  warn: "bg-[#FBEFD9] text-[#7D5210]",
  danger: "bg-[#FBE6E3] text-[#962B2B]",
};
export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

export function Stat({ label, value, hint, icon, onClick }: { label: string; value: ReactNode; hint?: ReactNode; icon?: IconName; onClick?: () => void }) {
  const body = (
    <>
      <span className="flex items-center gap-2 text-[13px] font-medium text-(--os-muted)">
        {icon && <span className="grid size-7 place-items-center rounded-lg bg-(--os-soft) text-(--os-accent-ink)"><Icon name={icon} className="size-4" /></span>}
        {label}
      </span>
      <span className="mt-3 block text-[1.65rem] font-semibold leading-none tracking-tight text-(--os-ink) tabular-nums">{value}</span>
      {hint && <span className="mt-1.5 block text-[13px] leading-snug text-(--os-muted)">{hint}</span>}
    </>
  );
  const base = "block w-full rounded-2xl border border-(--os-line) bg-white p-4 text-left";
  return onClick ? (
    <button type="button" onClick={onClick} className={cx(base, focusRing, "transition-colors duration-150 hover:border-[#D6CEC4] hover:bg-[#FDFCFA]")}>{body}</button>
  ) : (
    <div className={base}>{body}</div>
  );
}

export function Avatar({ name, hue, size = "md" }: { name: string; hue: number; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const dims = { sm: "size-8 text-[11px]", md: "size-10 text-[13px]", lg: "size-14 text-base" }[size];
  return (
    <span aria-hidden="true" className={cx("grid shrink-0 place-items-center rounded-full font-semibold", dims)}
      style={{ background: `hsl(${hue} 42% 90%)`, color: `hsl(${hue} 38% 28%)` }}>
      {initials}
    </span>
  );
}

export function Empty({ icon = "info", title, text, action }: { icon?: IconName; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-(--os-line) bg-white/60 px-6 py-10 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-(--os-soft) text-(--os-accent-ink)"><Icon name={icon} /></span>
      <p className="mt-3 font-semibold text-(--os-ink)">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-(--os-muted)">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Confirmación en línea, sin modal: el primer clic pide confirmar. */
export function ConfirmButton({ label, confirmLabel, onConfirm, icon, variant = "danger", size = "sm" }: {
  label: string; confirmLabel: string; onConfirm: () => void; icon?: IconName; variant?: Variant; size?: keyof typeof sizes;
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) return <Button variant={variant} size={size} icon={icon} onClick={() => setAsking(true)}>{label}</Button>;
  return (
    <span className="inline-flex flex-wrap items-center gap-2 os-fade" role="group" aria-label={confirmLabel}>
      <Button variant="danger" size={size} onClick={() => { setAsking(false); onConfirm(); }}>{confirmLabel}</Button>
      <Button variant="ghost" size={size} onClick={() => setAsking(false)}>No</Button>
    </span>
  );
}

export function Field({ label, htmlFor, hint, children, className }: { label: string; htmlFor?: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx("min-w-0", className)}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-(--os-ink)">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-[12.5px] leading-snug text-(--os-muted)">{hint}</p>}
    </div>
  );
}

export function Segmented<T extends string>({ label, options, value, onChange, className }: {
  label: string; options: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx("os-scroll-x flex max-w-full gap-1 overflow-x-auto rounded-xl bg-[#EFEBE5] p-1", className)}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={cx("inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold transition-colors duration-150", focusRing,
            value === o.value ? "bg-white text-(--os-ink) shadow-[0_1px_2px_rgba(31,28,26,0.08)]" : "text-(--os-muted) hover:text-(--os-ink)")}>
          {o.label}
          {o.count !== undefined && <span className="tabular-nums text-(--os-muted)">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Switch({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description?: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={onChange}
      className={cx("flex w-full items-start justify-between gap-4 rounded-xl text-left", focusRing)}>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-(--os-ink)">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] leading-snug text-(--os-muted)">{description}</span>}
      </span>
      <span aria-hidden="true" className={cx("relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors duration-200", checked ? "bg-(--os-accent)" : "bg-[#D9D2CA]")}>
        <span className={cx("absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
      </span>
    </button>
  );
}

export function Meter({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-[#ECE7E1]" role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
      <span className={cx("block h-full rounded-full transition-[width] duration-200", pct >= 100 ? "bg-[#B4532A]" : "bg-(--os-accent)")} style={{ width: `${pct}%` }} />
    </span>
  );
}

/** Barras horizontales sencillas para reportes. */
export function Bars({ items, format = (n) => String(n), label }: { items: { label: string; value: number; max?: number; note?: string }[]; format?: (n: number) => string; label: string }) {
  const top = Math.max(1, ...items.map((i) => i.max ?? i.value));
  return (
    <ul aria-label={label} className="space-y-3">
      {items.map((i) => (
        <li key={i.label}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="truncate font-medium text-(--os-ink)">{i.label}</span>
            <span className="shrink-0 tabular-nums text-(--os-muted)">{format(i.value)}{i.note ? ` · ${i.note}` : ""}</span>
          </div>
          <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-[#EFEAE4]">
            <span className="block h-full rounded-full bg-(--os-accent) transition-[width] duration-200" style={{ width: `${Math.round(((i.max ? i.value / i.max : i.value / top)) * 100)}%` }} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Detalle: columna lateral en escritorio y pantalla completa en móvil, con
 * botón de regreso visible (sin modal bloqueante en escritorio).
 */
export function DetailPanel({ title, onClose, children, closeLabel = "Volver" }: { title: string; onClose: () => void; children: ReactNode; closeLabel?: string }) {
  return (
    <section aria-label={title}
      className="os-slide fixed inset-0 z-[95] overflow-y-auto bg-(--os-canvas) lg:static lg:z-auto lg:max-h-[calc(100dvh-8.5rem)] lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-(--os-line) lg:bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-(--os-line) bg-white/95 px-3 py-2 backdrop-blur lg:px-4">
        <Button variant="ghost" size="sm" icon="chevronLeft" onClick={onClose} className="lg:hidden">{closeLabel}</Button>
        <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-(--os-ink) max-lg:sr-only">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="max-lg:hidden" aria-label="Cerrar detalle"><Icon name="x" className="size-[18px]" /></Button>
      </div>
      <div className="p-4 lg:p-5">{children}</div>
    </section>
  );
}
