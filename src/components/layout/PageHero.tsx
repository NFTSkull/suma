import type { ReactNode } from "react";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { cn } from "@/lib/cn";
import type { SumaColor } from "@/types/content";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: { name: string; path: string }[];
  accent?: SumaColor;
  children?: ReactNode;
  dark?: boolean;
};

/** Hero de páginas índice e institucionales. */
export function PageHero({ eyebrow, title, lead, crumbs, accent = "orange", children, dark = false }: Props) {
  return (
    <section
      aria-labelledby="page-title"
      className={cn("relative isolate overflow-hidden", dark ? "on-dark bg-suma-navy text-suma-cream" : "bg-suma-cream text-suma-navy")}
    >
      <OrganicShape shape="a" color={accent} animate="drift" className="absolute -right-24 -top-24 -z-10 size-[22rem] opacity-90 md:size-[30rem]" />
      <OrganicShape shape="d" color={dark ? "purple" : "pink"} blend={!dark} animate="drift-reverse" className="absolute right-[18%] top-[55%] -z-10 hidden size-40 md:block" />
      <div className="container-suma pb-20 pt-8 md:pb-28 md:pt-12">
        <Breadcrumbs items={crumbs} tone={dark ? "light" : "dark"} />
        <p className={cn("text-eyebrow mt-10 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_both]", dark ? "text-suma-orange" : "text-suma-orange-ink")}>
          {eyebrow}
        </p>
        <h1 id="page-title" className="text-display-lg mt-6 max-w-5xl motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_80ms_both]">
          {title}
        </h1>
        {lead && (
          <p
            className={cn(
              "text-lead mt-8 max-w-2xl motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_160ms_both]",
              dark ? "text-suma-cream/80" : "text-suma-navy/75",
            )}
          >
            {lead}
          </p>
        )}
        {children && <div className="mt-10 motion-safe:animate-[enter_var(--dur-reveal)_var(--ease-flow)_240ms_both]">{children}</div>}
      </div>
    </section>
  );
}
