export const SPLASH_LEAVE_EVENT = "suma:splash-leave";

/**
 * Ejecuta `callback` cuando la pantalla de carga empieza a retirarse, o de
 * inmediato si no hay pantalla visible. Devuelve una función de limpieza.
 */
export function afterSplash(callback: () => void, maxWaitMs = 6000): () => void {
  const active = document.querySelector('.suma-splash:not([data-state="leaving"])');
  if (!active) {
    callback();
    return () => {};
  }

  let settled = false;
  const stop = () => {
    settled = true;
    window.clearTimeout(timer);
    window.removeEventListener(SPLASH_LEAVE_EVENT, fire);
  };
  const fire = () => {
    if (settled) return;
    stop();
    callback();
  };
  const timer = window.setTimeout(fire, maxWaitMs);
  window.addEventListener(SPLASH_LEAVE_EVENT, fire);
  return stop;
}
