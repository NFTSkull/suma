import type { DemoState, StudioConfig } from "./types";

/**
 * Conserva la demo durante la sesión del navegador (sessionStorage).
 * Solo datos ficticios y la configuración; el logotipo nunca se guarda.
 */
export const STORAGE_KEY = "suma-studio-os:v2";

export type SavedSession = {
  phase: "setup" | "app";
  step: number;
  config: StudioConfig;
  state: DemoState | null;
  baseline: { config: StudioConfig; now: string } | null;
};

export function loadSession(): SavedSession | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedSession;
    if (!data?.config?.type || (data.state && data.state.version !== 1)) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveSession(data: SavedSession) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* Sin almacenamiento disponible: la demo sigue funcionando en memoria. */
  }
}

export function clearSession() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
