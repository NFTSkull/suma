import { beforeEach, describe, expect, it } from "vitest";
import { CONSENT_STORAGE_KEY, resetConsentMemoryForTests, saveAnalyticsConsent } from "@/lib/consent";
import { track } from "./analytics";

type LayerWindow = Window & { dataLayer?: unknown[] };

describe("eventos analíticos y consentimiento", () => {
  beforeEach(() => {
    localStorage.clear();
    resetConsentMemoryForTests();
    (window as LayerWindow).dataLayer = [];
  });

  it("no encola eventos sin decisión", () => {
    track({ event: "pricing_plan_selected", plan: "ads" });
    expect((window as LayerWindow).dataLayer).toEqual([]);
  });

  it("no encola eventos cuando el visitante rechazó analítica", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "denied" }));
    track({ event: "contact_click", contact_method: "whatsapp" });
    expect((window as LayerWindow).dataLayer).toEqual([]);
  });

  it("solo registra eventos producidos después de aceptar", () => {
    track({ event: "pricing_plan_selected", plan: "flow" });
    saveAnalyticsConsent("granted");
    track({ event: "pricing_cta_click", plan: "flow", source: "estimator" });
    expect((window as LayerWindow).dataLayer).toHaveLength(2);
    expect((window as LayerWindow).dataLayer![1]).toEqual({ event: "pricing_cta_click", plan: "flow", source: "estimator" });
    expect(JSON.stringify((window as LayerWindow).dataLayer)).not.toContain("pricing_plan_selected");
  });

  it("deja de registrar eventos inmediatamente al revocar el consentimiento", () => {
    saveAnalyticsConsent("granted");
    track({ event: "pricing_plan_selected", plan: "ads" });
    saveAnalyticsConsent("denied");
    track({ event: "pricing_plan_selected", plan: "growth" });
    expect((window as LayerWindow).dataLayer!.filter((x) => (x as { event?: string }).event === "pricing_plan_selected")).toEqual([{ event: "pricing_plan_selected", plan: "ads" }]);
  });
});
