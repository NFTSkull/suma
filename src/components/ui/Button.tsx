import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "secondary" | "light" | "outline-light" | "link" | "link-light";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 text-balance font-sans font-bold tracking-tight " +
  "transition-[background-color,color,box-shadow,transform] duration-[var(--dur-micro)] ease-[var(--ease-flow)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 select-none";

const variants: Record<Variant, string> = {
  primary: "rounded-full bg-suma-navy text-suma-cream hover:bg-suma-purple shadow-[0_10px_30px_-12px_rgb(11_18_64/0.6)]",
  accent: "rounded-full bg-suma-orange text-suma-navy hover:bg-suma-pink",
  secondary: "rounded-full border-2 border-suma-navy/80 text-suma-navy hover:bg-suma-navy hover:text-suma-cream",
  light: "rounded-full bg-suma-cream text-suma-navy hover:bg-suma-orange",
  "outline-light": "rounded-full border-2 border-suma-cream/70 text-suma-cream hover:bg-suma-cream hover:text-suma-navy",
  link: "text-suma-navy underline decoration-2 decoration-suma-orange underline-offset-[6px] hover:decoration-suma-pink",
  "link-light": "text-suma-cream underline decoration-2 decoration-suma-orange underline-offset-[6px] hover:decoration-suma-pink",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 text-[0.95rem]",
  lg: "min-h-14 px-8 text-base",
};

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-4 shrink-0 transition-transform duration-[var(--dur-micro)] ease-[var(--ease-flow)] group-hover/btn:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

type CommonProps = { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode; className?: string };

function classesFor({ variant = "primary", size = "md", className }: CommonProps) {
  const isLink = variant === "link" || variant === "link-light";
  return cn(base, variants[variant], isLink ? "min-h-11 px-0 text-base" : sizes[size], className);
}

export function ButtonLink({
  href,
  variant,
  size,
  arrow,
  children,
  className,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const showArrow = arrow ?? (variant === "link" || variant === "link-light");
  return (
    <Link href={href} className={classesFor({ variant, size, className, children })} {...rest}>
      <span>{children}</span>
      {showArrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant,
  size,
  arrow,
  children,
  className,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={classesFor({ variant, size, className, children })} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
