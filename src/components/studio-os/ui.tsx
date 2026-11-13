"use client";

import { motion } from "motion/react";
import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { spring } from "./motion";

export { themeStyle } from "./theme";

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");
export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--os-accent)";
export const inputClass =
  "h-11 w-full min-w-0 rounded-xl border border-(--os-line) bg-(--os-paper) px-3.5 text-base text-(--os-ink) placeholder:text-(--os-faint) transition-[border-color,box-shadow] duration-200 hover:border-(--os-line-strong) focus-visible:border-(--os-accent) focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--os-accent)_14%,transparent)] focus-visible:outline-none sm:text-[15px]";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "danger" | "dark";
const variants: Record<Variant, string> = {
  primary: "bg-(--os-accent) text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(29,27,25,0.12),0_8px_20px_-10px_var(--os-accent)] hover:bg-(--os-hover)",
  secondary: "border border-(--os-line) bg-(--os-paper) text-(--os-ink) shadow-[0_1px_1px_rgba(29,27,25,0.04)] hover:border-(--os-line-strong) hover:bg-white",
  ghost: "text-(--os-ink-2) hover:bg-(--os-subtle) hover:text-(--os-ink)",
  soft: "bg-(--os-soft) text-(--os-accent-ink) hover:brightness-[0.97]",
  danger: "border border-[#EBC9C4] bg-(--os-paper) text-(--os-danger) hover:bg-(--os-danger-soft)",
  dark: "bg-(--os-ink) text-(--os-ivory) shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_-12px_rgba(29,27,25,0.6)] hover:bg-[#2B2825]",
};
const sizes = { sm: "min-h-9 px-3.5 text-[13px]", md: "min-h-11 px-4.5 text-[14px]", lg: "min-h-13 px-6 text-[15px]" };

export function Button({
  variant = "secondary", size = "md", icon, iconRight, className, children, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: keyof typeof sizes; icon?: IconName; iconRight?: IconName }) {
  return (
    <button
      type="button"
      className={cx("group/btn inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.005em] transition-[background-color,border-color,color,box-shadow,transform,filter] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40", focusRing, variants[variant], sizes[size], className)}
      {...rest}
    >
      {icon && <Icon name={icon} className="size-[17px]" />}
      {children}
      {iconRight && <Icon name={iconRight} className="size-[17px] transition-transform duration-200 group-hover/btn:translate-x-0.5" />}
    </button>
  );
}

export function Card({ className, children, as: Tag = "section", ...rest }: { className?: string; children: ReactNode; as?: "section" | "div" | "article" | "li" } & Record<string, unknown>) {
  return <Tag className={cx("rounded-[20px] border border-(--os-line) bg-(--os-paper) shadow-[0_1px_2px_rgba(29,27,25,0.03)]", className)} {...rest}>{children}</Tag>;
}

export function PageHeader({ title, description, action, eyebrow }: { title: ReactNode; description?: ReactNode; action?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-9">
      <div className="min-w-0">
        {eyebrow && <p className="os-eyebrow mb-2 text-(--os-accent-ink)">{eyebrow}</p>}
        <h2 className="os-display text-[2rem] leading-[1.05] text-(--os-ink) lg:text-[2.6rem]">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-(--os-muted)">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, hint, action }: { children: ReactNode; hint?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-(--os-ink)">{children}</h3>
        {hint && <p className="mt-0.5 text-[13px] leading-snug text-(--os-muted)">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

type Tone = "neutral" | "accent" | "success" | "warn" | "danger";
const tones: Record<Tone, string> = {
  neutral: "bg-(--os-subtle) text-(--os-ink-2)",
  accent: "bg-(--os-soft) text-(--os-accent-ink)",
  success: "bg-(--os-success-soft) text-(--os-success)",
  warn: "bg-(--os-warn-soft) text-(--os-warn)",
  danger: "bg-(--os-danger-soft) text-(--os-danger)",
};
const dots: Record<Tone, string> = { neutral: "bg-(--os-faint)", accent: "bg-(--os-accent)", success: "bg-(--os-success)", warn: "bg-[#C08A2E]", danger: "bg-(--os-danger)" };
export function Badge({ tone = "neutral", children, className, dot = true }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11.5px] font-semibold", tones[tone], className)}>
      {dot && <span aria-hidden="true" className={cx("size-1.5 rounded-full", dots[tone])} />}
      {children}
    </span>
  );
}

export function Stat({ label, value, hint, icon, onClick }: { label: string; value: ReactNode; hint?: ReactNode; icon?: IconName; onClick?: () => void }) {
  const body = (
    <>
      <span className="flex items-center gap-2 text-[12.5px] font-medium text-(--os-muted)">
        {icon && <Icon name={icon} className="size-[15px] text-(--os-accent-ink)" />}
        {label}
      </span>
      <span className="os-num mt-3 block text-[2rem] font-medium leading-none text-(--os-ink)">{value}</span>
      {hint && <span className="mt-2 block text-[12.5px] leading-snug text-(--os-muted)">{hint}</span>}
    </>
  );
  const base = "block w-full rounded-[18px] border border-(--os-line) bg-(--os-paper) p-4 text-left";
  return onClick ? (
    <button type="button" onClick={onClick} className={cx(base, focusRing, "transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-(--os-line-strong) hover:shadow-[0_10px_24px_-18px_rgba(29,27,25,0.35)]")}>{body}</button>
  ) : (
    <div className={base}>{body}</div>
  );
}

export function Avatar({ name, hue, size = "md" }: { name: string; hue: number; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const dims = { sm: "size-8 text-[11px]", md: "size-10 text-[12.5px]", lg: "size-16 text-[17px]" }[size];
  return (
    <span aria-hidden="true" className={cx("grid shrink-0 place-items-center rounded-full font-semibold tracking-[0.02em] ring-1 ring-black/[0.04]", dims)}
      style={{ background: `linear-gradient(145deg, hsl(${hue} 38% 92%), hsl(${hue} 30% 84%))`, color: `hsl(${hue} 34% 26%)` }}>
      {initials}
    </span>
  );
}

export function Empty({ icon = "info", title, text, action }: { icon?: IconName; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[20px] border border-dashed border-(--os-line-strong) bg-(--os-paper)/60 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-(--os-soft) text-(--os-accent-ink)"><Icon name={icon} /></span>
      <p className="os-display mt-4 text-[1.25rem] text-(--os-ink)">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-(--os-muted)">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Confirmación en línea, sin modal: el primer clic pide confirmar. */
export function ConfirmButton({ label, confirmLabel, onConfirm, icon, variant = "danger", size = "sm", className }: {
  label: string; confirmLabel: string; onConfirm: () => void; icon?: IconName; variant?: Variant; size?: keyof typeof sizes; className?: string;
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) return <Button variant={variant} size={size} icon={icon} onClick={() => setAsking(true)} className={className}>{label}</Button>;
  return (
    <span className="os-fade inline-flex flex-wrap items-center gap-2" role="group" aria-label={confirmLabel}>
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

/** Control segmentado con indicador que se desliza entre opciones. */
export function Segmented<T extends string>({ label, options, value, onChange, className }: {
  label: string; options: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; className?: string;
}) {
  const layoutId = useId();
  return (
    <div role="group" aria-label={label} className={cx("os-scroll-x flex max-w-full gap-0.5 overflow-x-auto rounded-full border border-(--os-line) bg-(--os-subtle) p-1", className)}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button key={o.value} type="button" aria-pressed={active} onClick={() => onChange(o.value)}
            className={cx("relative inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-200", focusRing,
              active ? "text-(--os-ink)" : "text-(--os-muted) hover:text-(--os-ink)")}>
            {active && <motion.span layoutId={layoutId} transition={spring.snappy} className="absolute inset-0 rounded-full bg-(--os-paper) shadow-[0_1px_2px_rgba(29,27,25,0.08),0_0_0_1px_rgba(29,27,25,0.04)]" />}
            <span className="relative">{o.label}</span>
            {o.count !== undefined && <span className="os-num relative text-(--os-faint)">{o.count}</span>}
          </button>
        );
      })}
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
      <span aria-hidden="true" className={cx("relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors duration-300", checked ? "bg-(--os-accent)" : "bg-(--os-line-strong)")}>
        <span className={cx("absolute top-0.5 size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
      </span>
    </button>
  );
}

export function Meter({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <span className="block h-[5px] w-full overflow-hidden rounded-full bg-(--os-subtle)" role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
      <span className="block h-full rounded-full bg-(--os-accent) transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${pct}%`, opacity: pct >= 100 ? 1 : 0.85 }} />
    </span>
  );
}

/** Barras horizontales para reportes. */
export function Bars({ items, format = (n) => String(n), label }: { items: { label: string; value: number; max?: number; note?: string }[]; format?: (n: number) => string; label: string }) {
  const top = Math.max(1, ...items.map((i) => i.max ?? i.value));
  return (
    <ul aria-label={label} className="space-y-3.5">
      {items.map((i) => (
        <li key={i.label}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="truncate font-medium text-(--os-ink)">{i.label}</span>
            <span className="os-num shrink-0 text-(--os-muted)">{format(i.value)}{i.note ? ` · ${i.note}` : ""}</span>
          </div>
          <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-(--os-subtle)">
            <span className="block h-full rounded-full bg-(--os-accent) transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${Math.round(((i.max ? i.value / i.max : i.value / top)) * 100)}%` }} />
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
      className="os-slide os-scroll-y fixed inset-0 z-[95] overflow-y-auto bg-(--os-ivory) lg:sticky lg:top-0 lg:z-auto lg:max-h-[calc(100dvh-7.5rem)] lg:self-start lg:rounded-[22px] lg:border lg:border-(--os-line) lg:bg-(--os-paper) lg:shadow-[0_24px_48px_-32px_rgba(29,27,25,0.35)]">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-(--os-line) bg-(--os-paper)/90 px-3 py-2 backdrop-blur-md lg:px-4">
        <Button variant="ghost" size="sm" icon="chevronLeft" onClick={onClose} className="lg:hidden">{closeLabel}</Button>
        <h3 className="min-w-0 flex-1 truncate text-[14px] font-semibold text-(--os-ink) max-lg:sr-only">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="max-lg:hidden" aria-label="Cerrar detalle"><Icon name="x" className="size-[17px]" /></Button>
      </div>
      <div className="p-4 pb-10 lg:p-6">{children}</div>
    </section>
  );
}
