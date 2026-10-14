"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { businessOptions, challengeOptions, type BusinessId, type ChallengeId } from "@/content/selector-rules";
import { serviceBySlug, serviceInlineName } from "@/content/services";
import { cn } from "@/lib/cn";
import { colorStyles } from "@/lib/colors";
import { recommend, SELECTOR_STORAGE_KEY, type SelectorContext } from "@/lib/recommend";

type Step = 1 | 2 | 3;

function OptionGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly { id: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const checked = value === o.id;
          return (
            <label
              key={o.id}
              className={cn(
                "flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 py-4 font-bold transition-[background-color,border-color,transform] duration-[var(--dur-micro)]",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-suma-purple",
                checked ? "border-suma-navy bg-suma-navy text-suma-cream" : "border-suma-line bg-suma-cream-soft text-suma-navy hover:border-suma-navy/40",
              )}
            >
              <input type="radio" name={name} value={o.id} checked={checked} onChange={() => onChange(o.id)} className="sr-only" />
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border-2",
                  checked ? "border-suma-orange" : "border-suma-navy/30",
                )}
              >
                {checked && <span className="size-2.5 rounded-full bg-suma-orange" />}
              </span>
              <span className="leading-snug">{o.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function NeedsSelector() {
  const [step, setStep] = useState<Step>(1);
  const [business, setBusiness] = useState<BusinessId | null>(null);
  const [challenge, setChallenge] = useState<ChallengeId | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastStep = useRef<Step>(step);

  useEffect(() => {
    if (lastStep.current === step) return;
    lastStep.current = step;
    headingRef.current?.focus();
  }, [step]);

  const result = business && challenge ? recommend(business, challenge) : null;

  const saveContext = () => {
    if (!business || !challenge || !result) return;
    const ctx: SelectorContext = { negocio: business, reto: challenge, servicios: result.recommendations.map((r) => r.service) };
    try {
      sessionStorage.setItem(SELECTOR_STORAGE_KEY, JSON.stringify(ctx));
    } catch {
      /* almacenamiento no disponible: el formulario funciona sin contexto */
    }
  };

  const reset = () => {
    setBusiness(null);
    setChallenge(null);
    setStep(1);
  };

  const titles: Record<Step, string> = {
    1: "¿Qué tipo de negocio tienes?",
    2: "¿Qué te gustaría mejorar primero?",
    3: "Un buen punto de partida",
  };

  return (
    <div className="rounded-[2rem] bg-suma-cream p-6 shadow-soft md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ol className="flex items-center gap-2" aria-label="Progreso">
          {[1, 2, 3].map((n) => (
            <li key={n} className="flex items-center gap-2">
              <span
                aria-current={step === n ? "step" : undefined}
                className={cn(
                  "grid size-9 place-items-center rounded-full font-display text-sm font-bold transition-colors",
                  step === n ? "bg-suma-orange text-suma-navy" : step > n ? "bg-suma-navy text-suma-cream" : "bg-suma-navy/8 text-suma-navy/60",
                )}
              >
                <span className="sr-only">Paso </span>
                {n}
              </span>
              {n < 3 && <span aria-hidden="true" className={cn("h-0.5 w-8 rounded-full", step > n ? "bg-suma-navy" : "bg-suma-navy/15")} />}
            </li>
          ))}
        </ol>
        {step > 1 && (
          <button type="button" onClick={reset} className="min-h-11 rounded-full px-4 text-sm font-bold text-suma-purple hover:bg-suma-purple/10">
            Reiniciar
          </button>
        )}
      </div>

      <h3 ref={headingRef} tabIndex={-1} className="mt-8 font-display text-3xl font-bold text-suma-navy outline-none md:text-4xl">
        {titles[step]}
      </h3>

      <div key={step} className="mt-8 motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]">
        {step === 1 && (
          <>
            <OptionGroup name="negocio" legend={titles[1]} options={businessOptions} value={business} onChange={setBusiness} />
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={!business}
                onClick={() => setStep(2)}
                className="min-h-12 rounded-full bg-suma-navy px-7 font-bold text-suma-cream transition-colors hover:bg-suma-purple disabled:opacity-40"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <OptionGroup name="reto" legend={titles[2]} options={challengeOptions} value={challenge} onChange={setChallenge} />
            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button type="button" onClick={() => setStep(1)} className="min-h-12 rounded-full border-2 border-suma-navy/70 px-6 font-bold text-suma-navy hover:bg-suma-navy hover:text-suma-cream">
                Regresar
              </button>
              <button
                type="button"
                disabled={!challenge}
                onClick={() => setStep(3)}
                className="min-h-12 rounded-full bg-suma-navy px-7 font-bold text-suma-cream transition-colors hover:bg-suma-purple disabled:opacity-40"
              >
                Ver recomendación
              </button>
            </div>
          </>
        )}

        {step === 3 && result && (
          <div>
            <p className="text-sm font-semibold text-suma-navy/65">
              {businessOptions.find((b) => b.id === business)?.label} · {challengeOptions.find((c) => c.id === challenge)?.label}
            </p>
            <p className="text-lead mt-4 max-w-3xl text-suma-navy">{result.summary}</p>

            <ul className="mt-8 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
              {result.recommendations.map((r, i) => {
                const s = serviceBySlug[r.service];
                const c = colorStyles[s.color];
                return (
                  <li key={r.service} className="flex flex-col rounded-[1.5rem] border border-suma-line bg-suma-cream-soft p-6">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-suma-navy/60">
                      <span aria-hidden="true" className={cn("blob size-3.5", c.dot)} />
                      {i === 0 ? "Para empezar" : "Después"}
                    </p>
                    <h4 className="mt-3 font-display text-2xl font-bold text-suma-navy">{s.name}</h4>
                    <p className="mt-3 text-sm text-suma-navy/80">
                      <span className="font-bold">Por qué encaja: </span>
                      {r.why}
                    </p>
                    <p className="mt-2 text-sm text-suma-navy/80">
                      <span className="font-bold">Qué resuelve: </span>
                      {r.problem}
                    </p>
                    <Link href={s.href} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-sm font-bold text-suma-navy underline decoration-suma-orange decoration-2 underline-offset-4">
                      Conocer {serviceInlineName[s.slug]} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink href="/contacto" size="lg" arrow onClick={saveContext}>
                Conversemos sobre esto
              </ButtonLink>
              <button type="button" onClick={() => setStep(2)} className="min-h-12 rounded-full border-2 border-suma-navy/70 px-6 font-bold text-suma-navy hover:bg-suma-navy hover:text-suma-cream">
                Cambiar respuestas
              </button>
            </div>
            <p className="mt-5 text-xs font-semibold text-suma-navy/60">
              Recomendación orientativa basada en reglas simples. La definimos juntos en la primera conversación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
