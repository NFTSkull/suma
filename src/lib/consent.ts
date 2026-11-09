/**
 * Consent Mode v2 para Google Tag Manager.
 *
 * REQUIERE REVISIÓN LEGAL antes de publicarse (ver SEO_AUDIT.md y RIESGOS R8).
 * - Publicidad (ad_storage, ad_user_data, ad_personalization): siempre "denied".
 *   No hay base para activarla; si algún día se usan etiquetas publicitarias,
 *   hace falta un banner de consentimiento explícito.
 * - Medición (analytics_storage): respeta la elección guardada por la persona
 *   ("Preferencias de privacidad" en el footer). Sin elección, usa
 *   ANALYTICS_DEFAULT fuera de las regiones con consentimiento previo obligatorio
 *   (EEE, Reino Unido y Suiza), donde siempre es "denied".
 */
export const CONSENT_STORAGE_KEY = "suma-consent";
export const CONSENT_VERSION = 1;

export type ConsentState = "granted" | "denied";
export type StoredConsent = { v: typeof CONSENT_VERSION; analytics: ConsentState };

/** Decisión de negocio/legal: cambiar a "denied" convierte la medición en opt-in. */
export const ANALYTICS_DEFAULT: ConsentState = "granted";

/** EEE + Reino Unido + Suiza (ISO 3166-1 alfa-2). */
export const OPT_IN_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
] as const;

const DENIED_ADS = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" } as const;

export function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<StoredConsent>;
    return v.v === CONSENT_VERSION && (v.analytics === "granted" || v.analytics === "denied") ? (v as StoredConsent) : null;
  } catch {
    return null;
  }
}

/**
 * Script inline que fija los valores por defecto ANTES de que cargue GTM.
 * Lee la elección guardada para que una persona que rechazó la medición no
 * envíe ni el primer hit.
 */
export function consentDefaultsScript(): string {
  return `(function(){
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
var a=null;
try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})||"null");if(s&&s.v===${CONSENT_VERSION}&&(s.analytics==="granted"||s.analytics==="denied"))a=s.analytics;}catch(e){}
var ads=${JSON.stringify(DENIED_ADS)};
gtag("consent","default",Object.assign({},ads,{analytics_storage:a||"denied",region:${JSON.stringify(OPT_IN_REGIONS)}}));
gtag("consent","default",Object.assign({},ads,{analytics_storage:a||${JSON.stringify(ANALYTICS_DEFAULT)}}));
gtag("set","ads_data_redaction",true);
gtag("set","url_passthrough",false);
})();`;
}

type GtagWindow = Window & { dataLayer?: unknown[] };

/** Guarda la elección y la comunica a GTM (`consent update`). */
export function saveAnalyticsConsent(analytics: ConsentState): void {
  const value: StoredConsent = { v: CONSENT_VERSION, analytics };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible: la elección aplica solo a esta visita */
  }
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  // GTM exige el objeto `arguments`, no un arreglo; `_args` solo tipa la llamada.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  })("consent", "update", { ...DENIED_ADS, analytics_storage: analytics });
}

export function readAnalyticsConsent(): ConsentState | null {
  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY))?.analytics ?? null;
  } catch {
    return null;
  }
}
