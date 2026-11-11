import type { SimpleExplanation } from "@/content/pricing-explanations";

type Props = {
  explanation: SimpleExplanation;
  subject?: string;
  dark?: boolean;
  compact?: boolean;
};

/** Accesible con teclado, sin JS ni globos que se pierdan en móvil. */
export function PricingWhatIs({ explanation, subject, dark = false, compact = false }: Props) {
  return (
    <details className={"group min-w-0 rounded-xl border " +
      (dark ? "border-white/25 bg-white/5 text-suma-cream" : "border-suma-navy/15 bg-white/60 text-suma-navy") +
      (compact ? " mt-2" : " mt-3")}>
      <summary className={"flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold focus-visible:outline-2 focus-visible:outline-suma-orange " +
        (dark ? "hover:bg-white/10" : "hover:bg-suma-navy/5")}>
        <span>{subject ? "¿Qué es " + subject + "?" : "¿Qué es?"}</span>
        <span aria-hidden="true" className="text-lg leading-none group-open:rotate-45">+</span>
      </summary>
      <div className={"space-y-2 border-t px-3 py-3 text-xs leading-relaxed " +
        (dark ? "border-white/15 text-suma-cream/85" : "border-suma-navy/10 text-suma-navy/80")}>
        <p>{explanation.what}</p>
        <p><strong>Ejemplo:</strong> {explanation.example}</p>
        <p><strong>Va aparte o no incluye:</strong> {explanation.excluded}</p>
      </div>
    </details>
  );
}
