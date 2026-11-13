import type { DemoState, StudioConfig } from "./types";

import { verticals } from "./verticals";

/**
 * Conserva la demo durante la sesión del navegador (sessionStorage).
 * Solo datos ficticios y la configuración; el logotipo nunca se guarda.
 * v4 = modelo multi-giro. Las claves anteriores se borran al cargar: una sesión
 * guardada con el modelo viejo nunca llega a la demo nueva.
 */
export const STORAGE_KEY = "suma-studio-os:v4";
const LEGACY_KEYS = ["suma-studio-os:v1", "suma-studio-os:v2", "suma-studio-os:v3"];

export type SavedSession = {
  phase: "welcome" | "setup" | "app";
  step: number;
  config: StudioConfig;
  state: DemoState | null;
  baseline: { config: StudioConfig; now: string } | null;
};

export function loadSession(): SavedSession | null {
  try {
    for (const key of LEGACY_KEYS) window.sessionStorage.removeItem(key);
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedSession;
    const valid = data?.config && data.config.vertical in verticals && Array.isArray(data.config.offerings) && Array.isArray(data.config.modules)
      && (!data.state || (data.state.version === 2 && Array.isArray(data.state.sessions) && (data.state.config?.vertical ?? "") in verticals));
    if (!valid) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
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
