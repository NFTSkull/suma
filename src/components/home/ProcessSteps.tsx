import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/content/process";
import { cn } from "@/lib/cn";
import { colorStyles } from "@/lib/colors";

export function ProcessSteps({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {processSteps.map((step, i) => {
        const c = colorStyles[step.color];
        return (
          <Reveal as="li" key={step.number} delay={i * 110} className={cn("relative", i % 2 === 1 && "xl:mt-16")}>
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-suma-line bg-suma-cream-soft p-7">
              <span aria-hidden="true" className={cn("blob absolute -right-6 -top-6 size-24 opacity-90", c.bg)} />
              <p className="relative font-display text-6xl font-extrabold leading-none tracking-[-0.04em] text-suma-navy">
                {step.number}
                <span className="text-suma-navy/25">/</span>
              </p>
              <h3 className="mt-8 font-display text-3xl font-bold text-suma-navy">{step.title}</h3>
              <p className="mt-3 text-suma-navy/75">{step.text}</p>
              {detailed && (
                <ul className="mt-6 space-y-2 border-t border-suma-line pt-5 text-sm text-suma-navy/80">
                  {step.details.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span aria-hidden="true" className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", c.dot)} />
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
