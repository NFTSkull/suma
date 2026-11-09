"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ANALYTICS_DEFAULT, readAnalyticsConsent, saveAnalyticsConsent, type ConsentState } from "@/lib/consent";

/** Botón del footer que permite activar o desactivar la medición de visitas. */
export function PrivacyPreferences() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [analytics, setAnalytics] = useState<ConsentState>(ANALYTICS_DEFAULT);
  const [saved, setSaved] = useState(false);

  const open = () => {
    setAnalytics(readAnalyticsConsent() ?? ANALYTICS_DEFAULT);
    setSaved(false);
    dialogRef.current?.showModal();
  };

  const save = () => {
    saveAnalyticsConsent(analytics);
    setSaved(true);
    dialogRef.current?.close();
  };

  return (
    <>
      <button type="button" onClick={open} className="inline-flex min-h-10 items-center hover:text-suma-cream">
        Preferencias de privacidad
      </button>
      {saved && (
        <span role="status" className="sr-only">
          Preferencias guardadas.
        </span>
      )}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-[1.75rem] bg-suma-cream p-7 text-suma-navy shadow-lift backdrop:bg-suma-navy/50 md:p-9"
      >
        <h2 id={titleId} className="font-display text-2xl font-bold">
          Preferencias de privacidad
        </h2>
        <p className="mt-3 text-base text-suma-navy/80">
          Con tu permiso usamos Google Analytics para saber qué páginas se visitan y mejorar el sitio. Sin él, no se carga ninguna herramienta de medición. No usamos cookies publicitarias ni compartimos datos para anuncios.
        </p>
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-suma-cream-soft p-4">
          <input
            type="checkbox"
            checked={analytics === "granted"}
            onChange={(e) => setAnalytics(e.target.checked ? "granted" : "denied")}
            className="mt-1 size-5 shrink-0 accent-suma-purple"
          />
          <span>
            <span className="block font-bold">Medición de visitas</span>
            <span className="block text-sm text-suma-navy/70">Estadísticas de uso del sitio, sin datos de contacto.</span>
          </span>
        </label>
        <p className="mt-4 text-sm text-suma-navy/70">
          Más detalles en el{" "}
          <Link href="/aviso-de-privacidad" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">
            aviso de privacidad
          </Link>
          .
        </p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="min-h-12 rounded-full border-2 border-suma-navy/70 px-6 font-bold hover:bg-suma-navy hover:text-suma-cream"
          >
            Cancelar
          </button>
          <button type="button" onClick={save} className="min-h-12 rounded-full bg-suma-navy px-7 font-bold text-suma-cream hover:bg-suma-purple">
            Guardar
          </button>
        </div>
      </dialog>
    </>
  );
}
