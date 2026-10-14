import { demoDisclaimer } from "@/content/site";
import { cn } from "@/lib/cn";

export function DemoNotice({ tone = "dark", className, text = demoDisclaimer }: { tone?: "dark" | "light"; className?: string; text?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold",
        tone === "light" ? "bg-suma-cream/10 text-suma-cream/85" : "bg-suma-navy/6 text-suma-navy/75",
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.2v4M8 4.8v.01" strokeLinecap="round" />
      </svg>
      {text}
    </p>
  );
}
