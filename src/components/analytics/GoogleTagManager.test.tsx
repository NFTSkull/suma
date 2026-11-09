import { act, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { site } from "@/content/site";
import { CONSENT_STORAGE_KEY, resetConsentMemoryForTests, saveAnalyticsConsent } from "@/lib/consent";
import { GoogleTagManager, gtmSnippet } from "./GoogleTagManager";

// next/script se sustituye por un <script> inerte para poder comprobar si se renderiza.
vi.mock("next/script", () => ({
  default: ({ id, children }: { id: string; children: string }) => <script data-testid={id} type="text/plain" dangerouslySetInnerHTML={{ __html: children }} />,
}));

const loaded = (container: HTMLElement) => container.querySelector('[data-testid="google-tag-manager"]');

describe("Google Tag Manager", () => {
  beforeEach(() => {
    localStorage.clear();
    resetConsentMemoryForTests();
    (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
  });

  it("usa el contenedor oficial y el fragmento oficial de gtm.js", () => {
    expect(site.gtmId).toBe("GTM-W2CSD45N");
    const code = gtmSnippet(site.gtmId);
    expect(code).toContain("https://www.googletagmanager.com/gtm.js?id=");
    expect(code).toContain("'dataLayer','GTM-W2CSD45N'");
    expect(() => new Function(code)).not.toThrow();
  });

  it("no se carga en el servidor ni sin decisión", () => {
    expect(renderToStaticMarkup(<GoogleTagManager id={site.gtmId} />)).toBe("");
    const { container } = render(<GoogleTagManager id={site.gtmId} />);
    expect(loaded(container)).toBeNull();
  });

  it("no se carga si la persona rechazó", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "denied" }));
    const { container } = render(<GoogleTagManager id={site.gtmId} />);
    expect(loaded(container)).toBeNull();
  });

  it("se carga si ya había aceptado (páginas posteriores) y al aceptar en esta visita", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: "granted" }));
    const first = render(<GoogleTagManager id={site.gtmId} />);
    expect(loaded(first.container)).not.toBeNull();
    first.unmount();

    localStorage.clear();
    const { container } = render(<GoogleTagManager id={site.gtmId} />);
    expect(loaded(container)).toBeNull();
    act(() => saveAnalyticsConsent("granted"));
    expect(loaded(container)).not.toBeNull();
  });
});
