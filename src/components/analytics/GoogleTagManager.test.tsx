import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { GoogleTagManagerNoScript, gtmSnippet } from "./GoogleTagManager";

describe("Google Tag Manager", () => {
  it("usa el contenedor oficial", () => {
    expect(site.gtmId).toBe("GTM-W2CSD45N");
  });

  it("el fragmento carga gtm.js con el id del contenedor en dataLayer", () => {
    const code = gtmSnippet(site.gtmId);
    expect(code).toContain("https://www.googletagmanager.com/gtm.js?id=");
    expect(code).toContain("'dataLayer','GTM-W2CSD45N'");
    expect(() => new Function(code)).not.toThrow();
  });

  it("el respaldo sin JS es un iframe oculto de ns.html", () => {
    const html = renderToStaticMarkup(<GoogleTagManagerNoScript id={site.gtmId} />);
    expect(html).toBe(
      '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W2CSD45N" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
    );
  });
});
