// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { config, proxy } from "./proxy";

const request = () => new NextRequest("https://www.sumastudio.mx/demo/studio-os");

describe("proxy de demos privadas", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("solo aplica a /demo", () => {
    expect(config.matcher).toEqual(["/demo/:path*"]);
  });

  it("en producción la demo responde como página inexistente", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const res = proxy(request());
    expect(res.headers.get("x-middleware-rewrite")).toMatch(/\/demo-no-disponible$/);
  });

  it("en previews y local deja pasar (Vercel protege el acceso al preview)", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(proxy(request()).headers.get("x-middleware-next")).toBe("1");
  });
});
