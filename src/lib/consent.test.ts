import { beforeEach, describe, expect, it } from "vitest";
import {
  ANALYTICS_DEFAULT,
  CONSENT_STORAGE_KEY,
  consentDefaultsScript,
  getConsentSnapshot,
  parseStoredConsent,
  readAnalyticsConsent,
  resetConsentMemoryForTests,
  saveAnalyticsConsent,
} from "./consent";

type W = Window & { dataLayer?: IArguments[]; gtag?: unknown };
const calls = () => ((window as W).dataLayer ?? []).map((a) => Array.from(a));
const run = () => new Function(consentDefaultsScript())();
const DENIED_ADS = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

describe("Consent Mode", () => {
  beforeEach(() => {
    localStorage.clear();
    resetConsentMemoryForTests();
    delete (window as W).dataLayer;
    delete (window as W).gtag;
  });

  it("sin decisión todo está denegado, en todas las regiones", () => {
    expect(ANALYTICS_DEFAULT).toBe("denied");
    run();
    const [defaults, redaction, passthrough] = calls();
    expect(defaults).toEqual(["consent", "default", { ...DENIED_ADS, analytics_storage: "denied" }]);
    expect(defaults[2]).not.toHaveProperty("region");
    expect(redaction).toEqual(["set", "ads_data_redaction", true]);
    expect(passthrough).toEqual(["set", "url_passthrough", false]);
    expect(getConsentSnapshot()).toBe("unset");
  });

  it("los comandos van como objetos arguments (formato que exige GTM)", () => {
    run();
    expect(Object.prototype.toString.call((window as W).dataLayer![0])).toBe("[object Arguments]");
  });

  it("una aceptación guardada se respeta desde el primer comando; la publicidad sigue denegada", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "granted" }));
    run();
    expect(calls()[0][2]).toEqual({ ...DENIED_ADS, analytics_storage: "granted" });
  });

  it("guardar la preferencia la persiste y envía consent update sin activar publicidad", () => {
    saveAnalyticsConsent("granted");
    expect(readAnalyticsConsent()).toBe("granted");
    expect(getConsentSnapshot()).toBe("granted");
    saveAnalyticsConsent("denied");
    expect(calls()).toEqual([
      ["consent", "update", { ...DENIED_ADS, analytics_storage: "granted" }],
      ["consent", "update", { ...DENIED_ADS, analytics_storage: "denied" }],
    ]);
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toEqual({ v: 1, analytics: "denied" });
  });

  it("ignora valores guardados inválidos", () => {
    expect(parseStoredConsent("{")).toBeNull();
    expect(parseStoredConsent(JSON.stringify({ v: 2, analytics: "granted" }))).toBeNull();
    expect(parseStoredConsent(JSON.stringify({ v: 1, analytics: "yes" }))).toBeNull();
  });
});
