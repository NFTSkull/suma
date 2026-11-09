import { beforeEach, describe, expect, it } from "vitest";
import {
  ANALYTICS_DEFAULT,
  CONSENT_STORAGE_KEY,
  consentDefaultsScript,
  OPT_IN_REGIONS,
  parseStoredConsent,
  readAnalyticsConsent,
  saveAnalyticsConsent,
} from "./consent";

type W = Window & { dataLayer?: IArguments[]; gtag?: unknown };
const calls = () => ((window as W).dataLayer ?? []).map((a) => Array.from(a));
const run = () => new Function(consentDefaultsScript())();

describe("Consent Mode", () => {
  beforeEach(() => {
    localStorage.clear();
    delete (window as W).dataLayer;
    delete (window as W).gtag;
  });

  it("por defecto niega toda la publicidad y la medición en EEE/UK/CH", () => {
    run();
    const [regional, global, redaction] = calls();
    expect(regional[0]).toBe("consent");
    expect(regional[1]).toBe("default");
    expect(regional[2]).toMatchObject({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      region: [...OPT_IN_REGIONS],
    });
    expect(global[2]).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: ANALYTICS_DEFAULT,
    });
    expect(redaction).toEqual(["set", "ads_data_redaction", true]);
  });

  it("los comandos van como objetos arguments (formato que exige GTM)", () => {
    run();
    expect(Object.prototype.toString.call((window as W).dataLayer![0])).toBe("[object Arguments]");
  });

  it("respeta una elección guardada de rechazo en todas las regiones", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "denied" }));
    run();
    const [regional, global] = calls();
    expect((regional[2] as Record<string, string>).analytics_storage).toBe("denied");
    expect((global[2] as Record<string, string>).analytics_storage).toBe("denied");
  });

  it("guardar la preferencia la persiste y envía consent update sin activar publicidad", () => {
    saveAnalyticsConsent("denied");
    expect(readAnalyticsConsent()).toBe("denied");
    expect(calls()).toEqual([
      ["consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" }],
    ]);
  });

  it("ignora valores guardados inválidos", () => {
    expect(parseStoredConsent("{")).toBeNull();
    expect(parseStoredConsent(JSON.stringify({ v: 2, analytics: "granted" }))).toBeNull();
    expect(parseStoredConsent(JSON.stringify({ v: 1, analytics: "yes" }))).toBeNull();
  });
});
