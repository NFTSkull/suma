/**
 * Consentimiento de medición (Consent Mode v2 + carga condicionada de GTM).
 *
 * - Publicidad (ad_storage, ad_user_data, ad_personalization): siempre "denied".
 * - Medición (analytics_storage): "denied" hasta que la persona acepta en el
 *   banner o en "Preferencias de privacidad". La elección se guarda en
 *   localStorage y se respeta en las páginas siguientes.
 * - GTM no se carga hasta que hay consentimiento (ver `GoogleTagManager`): las
 *   etiquetas analíticas no se ejecutan, no solo se les niega almacenamiento.
 *
 * Requiere revisión legal antes de publicarse (SEO_AUDIT.md §5).
 */
export const CONSENT_STORAGE_KEY = "suma-consent";
export const CONSENT_VERSION = 1;
const CONSENT_EVENT = "suma:consent-change";

export type ConsentState = "granted" | "denied";
/** `unset`: aún no decide; `pending`: servidor/antes de hidratar (no se sabe). */
export type ConsentSnapshot = ConsentState | "unset" | "pending";
export type StoredConsent = { v: typeof CONSENT_VERSION; analytics: ConsentState };

/** Sin elección guardada, la medición está denegada en todas las regiones. */
export const ANALYTICS_DEFAULT: ConsentState = "denied";

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
 * Script inline (`beforeInteractive`) que fija los valores por defecto antes de
 * cualquier etiqueta. Si la persona ya eligió, el default refleja su elección.
 */
export function consentDefaultsScript(): string {
  return `(function(){
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
var a=null;
try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})||"null");if(s&&s.v===${CONSENT_VERSION}&&(s.analytics==="granted"||s.analytics==="denied"))a=s.analytics;}catch(e){}
gtag("consent","default",Object.assign({},${JSON.stringify(DENIED_ADS)},{analytics_storage:a||${JSON.stringify(ANALYTICS_DEFAULT)}}));
gtag("set","ads_data_redaction",true);
gtag("set","url_passthrough",false);
})();`;
}

type GtagWindow = Window & { dataLayer?: unknown[] };

/** Elección de esta visita cuando localStorage no está disponible. */
let memoryChoice: ConsentState | null = null;

export function readAnalyticsConsent(): ConsentState | null {
  try {
    const stored = parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY))?.analytics ?? null;
    return stored ?? memoryChoice;
  } catch {
    return memoryChoice;
  }
}

/** Guarda la elección, la comunica a GTM (`consent update`) y avisa a los componentes. */
export function saveAnalyticsConsent(analytics: ConsentState): void {
  memoryChoice = analytics;
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
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/* ─────────── Store para useSyncExternalStore ─────────── */

export function subscribeConsent(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_STORAGE_KEY) onChange();
  };
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export const getConsentSnapshot = (): ConsentSnapshot => readAnalyticsConsent() ?? "unset";
export const getServerConsentSnapshot = (): ConsentSnapshot => "pending";

/** Solo para pruebas. */
export function resetConsentMemoryForTests(): void {
  memoryChoice = null;
}
