"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SPLASH_LEAVE_EVENT } from "./splash-signal";
import { SumaStudioLogoReveal } from "./SumaStudioLogoReveal";

const HOLD_MS = 450;
const EXIT_MS = 650;

type Phase = "playing" | "leaving" | "done";

const noopSubscribe = () => () => {};

/**
 * Pantalla de carga con la animación oficial del logo. Se reproduce en cada
 * carga completa de la página (vive en el layout raíz, así que la navegación
 * interna no la repite). Mientras está en "playing" las animaciones de <main>
 * quedan en pausa (ver globals.css) para que el hero entre al retirarse.
 */
export function SplashScreen() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [phase, setPhase] = useState<Phase>("playing");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const finish = useCallback(() => setPhase("done"), []);

  const handleComplete = useCallback(() => {
    timers.current.push(
      window.setTimeout(() => {
        setPhase("leaving");
        window.dispatchEvent(new Event(SPLASH_LEAVE_EVENT));
        timers.current.push(window.setTimeout(finish, EXIT_MS + 150));
      }, HOLD_MS),
    );
  }, [finish]);

  if (phase === "done") return null;

  return (
    <div
      className="suma-splash"
      data-state={hydrated ? phase : "pending"}
      aria-hidden="true"
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "opacity" && phase === "leaving") finish();
      }}
    >
      <SumaStudioLogoReveal onComplete={handleComplete} />
    </div>
  );
}
