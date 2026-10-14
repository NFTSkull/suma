import type { Faq } from "@/types/content";
import { cn } from "@/lib/cn";

/** Acordeón con <details>: accesible y funcional sin JavaScript. */
export function Accordion({ items, tone = "dark" }: { items: Faq[]; tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <div className={cn("divide-y border-y", light ? "divide-suma-cream/15 border-suma-cream/15" : "divide-suma-line border-suma-line")}>
      {items.map((item) => (
        <details key={item.q} className="group py-1">
          <summary
            className={cn(
              "flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-display text-lg font-bold md:text-xl",
              "[&::-webkit-details-marker]:hidden",
              light ? "text-suma-cream" : "text-suma-navy",
            )}
          >
            {item.q}
            <span
              aria-hidden="true"
              className={cn(
                "relative grid size-9 shrink-0 place-items-center rounded-full transition-transform duration-[var(--dur-panel)] ease-[var(--ease-flow)] group-open:rotate-45",
                light ? "bg-suma-cream/10" : "bg-suma-navy/6",
              )}
            >
              <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
              <span className="absolute h-3.5 w-0.5 rounded-full bg-current" />
            </span>
          </summary>
          <p className={cn("max-w-3xl pb-6 text-base leading-relaxed", light ? "text-suma-cream/75" : "text-suma-navy/75")}>
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
