"use client";

import Link from "next/link";
import { useId } from "react";
import { Button } from "@/components/ui/Button";
import { saveAnalyticsConsent } from "@/lib/consent";
import { useAnalyticsConsent } from "./useAnalyticsConsent";

/**
 * Aviso de medición: aparece solo si no hay una decisión guardada. No es modal
 * (no bloquea la página ni mueve el foco) y aceptar o rechazar cuesta lo mismo.
 * La elección se puede cambiar después desde "Preferencias de privacidad".
 */
export function ConsentBanner() {
  const consent = useAnalyticsConsent();
  const titleId = useId();
  if (consent !== "unset") return null;

  return (
    <section
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-3 z-[60] rounded-[1.75rem] border border-suma-line bg-suma-cream-soft p-5 text-suma-navy shadow-lift motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[30rem] sm:p-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <h2 id={titleId} className="flex items-center gap-2.5 font-display text-xl font-bold">
        <span aria-hidden="true" className="blob inline-block size-3.5 bg-suma-orange" />
        Tu privacidad, tu decisión
      </h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-suma-navy/80">
        Con tu permiso usamos Google Analytics para saber qué páginas se visitan y mejorar el sitio. No usamos cookies publicitarias.{" "}
        <Link href="/aviso-de-privacidad" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">
          Aviso de privacidad
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Button variant="secondary" onClick={() => saveAnalyticsConsent("denied")}>
          Rechazar
        </Button>
        <Button variant="primary" onClick={() => saveAnalyticsConsent("granted")}>
          Aceptar estadísticas
        </Button>
      </div>
    </section>
  );
}
