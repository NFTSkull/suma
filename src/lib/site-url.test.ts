import { describe, expect, it } from "vitest";
import { resolveSiteTarget } from "./site-url";

describe("resolveSiteTarget", () => {
  it("producción usa la URL configurada y es indexable", () => {
    expect(resolveSiteTarget({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://www.sumastudio.mx/" })).toEqual({
      url: "https://www.sumastudio.mx",
      indexable: true,
    });
  });

  it.each([undefined, "", "http://localhost:3000", "http://127.0.0.1:3000", "http://www.sumastudio.mx"])(
    "producción falla con NEXT_PUBLIC_SITE_URL=%s",
    (value) => {
      expect(() => resolveSiteTarget({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: value })).toThrow(/NEXT_PUBLIC_SITE_URL/);
    },
  );

  it("un preview usa su propia URL y no es indexable, aunque herede la URL de producción", () => {
    expect(
      resolveSiteTarget({ VERCEL_ENV: "preview", VERCEL_URL: "suma-abc-viozs-projects.vercel.app", NEXT_PUBLIC_SITE_URL: "https://www.sumastudio.mx" }),
    ).toEqual({ url: "https://suma-abc-viozs-projects.vercel.app", indexable: false });
  });

  it("fuera de Vercel usa la URL configurada o localhost", () => {
    expect(resolveSiteTarget({})).toEqual({ url: "http://localhost:3000", indexable: true });
    expect(resolveSiteTarget({ NEXT_PUBLIC_SITE_URL: "https://www.sumastudio.mx" }).url).toBe("https://www.sumastudio.mx");
  });
});
