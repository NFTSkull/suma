// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contactRateLimiter } from "@/lib/rate-limit";
import { POST } from "./route";

const payload = {
  nombre: "Ana López",
  negocio: "Estudio Flow",
  tipoNegocio: "spa",
  email: "ana@ejemplo.com",
  whatsapp: "8112345678",
  servicios: ["crm"],
  privacidad: true,
  sitio: "",
  inicio: Date.now() - 60_000,
};

const req = (body: unknown, ip = "1.1.1.1") =>
  new Request("http://localhost/api/contacto", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("POST /api/contacto", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    contactRateLimiter.reset();
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.CONTACT_FROM_EMAIL;
  });

  const useResend = (from = "SUMA STUDIO <contacto@sumastudio.mx>") => {
    process.env.RESEND_API_KEY = "re_test_123";
    process.env.CONTACT_TO_EMAIL = "equipo@ejemplo.mx";
    process.env.CONTACT_FROM_EMAIL = from;
  };
  type LogLine = Record<string, unknown>;
  const logs = (spy: { mock: { calls: unknown[][] } }): LogLine[] => spy.mock.calls.map((c) => JSON.parse(String(c[0])) as LogLine);

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("400 ante JSON inválido", async () => {
    const res = await POST(req("{no-json"));
    expect(res.status).toBe(400);
  });

  it("422 con errores por campo", async () => {
    const res = await POST(req({ ...payload, email: "x" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.fields.email).toBeDefined();
  });

  it("descarta en silencio el honeypot sin entregar", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/x";
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const res = await POST(req({ ...payload, sitio: "spam" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("descarta envíos demasiado rápidos", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/x";
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const res = await POST(req({ ...payload, inicio: Date.now() }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("503 si no hay proveedor configurado (no simula éxito)", async () => {
    const res = await POST(req(payload));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "not_configured" });
  });

  it("200 cuando el webhook confirma recepción", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/x";
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const res = await POST(req(payload));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, delivered: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.lead.tipoNegocio).toBe("Spa o centro de bienestar");
    expect(sent.lead).not.toHaveProperty("sitio");
  });

  it("502 cuando el proveedor falla", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/x";
    globalThis.fetch = vi.fn().mockResolvedValue(new Response("err", { status: 500 })) as unknown as typeof fetch;
    const res = await POST(req(payload));
    expect(res.status).toBe(502);
  });

  it("escribe action_log sin datos personales", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    await POST(req(payload));
    const logged = info.mock.calls.map((c) => String(c[0])).join("\n");
    expect(logged).toContain("action_log");
    expect(logged).not.toContain("ana@ejemplo.com");
    expect(logged).not.toContain("8112345678");
  });

  describe("Resend", () => {
    it("entrega con remitente propio, reply_to del prospecto e idempotencia; solo confirma con id", async () => {
      useResend();
      const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: "email_123" }, { status: 200 }));
      globalThis.fetch = fetchMock as unknown as typeof fetch;
      const info = vi.spyOn(console, "info").mockImplementation(() => {});

      const res = await POST(req(payload));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true, delivered: true });

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("https://api.resend.com/emails");
      expect(init.headers.Authorization).toBe("Bearer re_test_123");
      expect(init.headers["Idempotency-Key"]).toMatch(/^contact-lead\/[a-f0-9]{64}$/);
      const sent = JSON.parse(init.body);
      expect(sent).toMatchObject({
        from: "SUMA STUDIO <contacto@sumastudio.mx>",
        to: ["equipo@ejemplo.mx"],
        reply_to: "ana@ejemplo.com",
        subject: "Nuevo proyecto: Estudio Flow",
      });
      expect(sent.text).toContain("Correo: ana@ejemplo.com");

      const entry = logs(info).find((l) => l.outcome === "delivered");
      expect(entry).toMatchObject({ provider: "resend", providerId: "email_123" });
    });

    it("la misma solicitud produce la misma clave de idempotencia", async () => {
      useResend();
      const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: "email_123" }));
      globalThis.fetch = fetchMock as unknown as typeof fetch;
      await POST(req(payload, "2.2.2.2"));
      await POST(req(payload, "3.3.3.3"));
      expect(fetchMock.mock.calls[0][1].headers["Idempotency-Key"]).toBe(fetchMock.mock.calls[1][1].headers["Idempotency-Key"]);
    });

    it("un 200 de Resend sin id no cuenta como entrega", async () => {
      useResend();
      globalThis.fetch = vi.fn().mockResolvedValue(Response.json({}, { status: 200 })) as unknown as typeof fetch;
      const res = await POST(req(payload));
      expect(res.status).toBe(502);
    });

    it("dominio no verificado (403) ⇒ 502 y registra el código del proveedor", async () => {
      useResend();
      globalThis.fetch = vi.fn().mockResolvedValue(Response.json({ name: "validation_error" }, { status: 403 })) as unknown as typeof fetch;
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      const res = await POST(req(payload));
      expect(res.status).toBe(502);
      expect(logs(error)[0]).toMatchObject({ outcome: "delivery_failed", provider: "resend", providerStatus: 403 });
    });

    it.each([
      ["sin remitente", undefined, "resend_from_missing"],
      ["remitente de pruebas resend.dev", "SUMA STUDIO <onboarding@resend.dev>", "resend_from_invalid"],
      ["remitente inválido", "contacto", "resend_from_invalid"],
    ])("%s ⇒ 503 not_configured sin llamar a Resend", async (_label, from, reason) => {
      useResend();
      if (from === undefined) delete process.env.CONTACT_FROM_EMAIL;
      else process.env.CONTACT_FROM_EMAIL = from;
      const fetchMock = vi.fn();
      globalThis.fetch = fetchMock as unknown as typeof fetch;
      const info = vi.spyOn(console, "info").mockImplementation(() => {});

      const res = await POST(req(payload));
      expect(res.status).toBe(503);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(logs(info).find((l) => l.outcome === "not_configured")).toMatchObject({ reason });
    });

    it("acepta formatos reales de configuración: remitente sin nombre y varios destinatarios", async () => {
      useResend("contacto@sumastudio.mx");
      process.env.CONTACT_TO_EMAIL = "equipo@ejemplo.mx, ventas@ejemplo.mx";
      process.env.RESEND_API_KEY = "re_AbC123-xyz_456";
      const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: "email_456" }));
      globalThis.fetch = fetchMock as unknown as typeof fetch;
      const res = await POST(req(payload));
      expect(await res.json()).toEqual({ ok: true, delivered: true });
      const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(sent.from).toBe("contacto@sumastudio.mx");
      expect(sent.to).toEqual(["equipo@ejemplo.mx", "ventas@ejemplo.mx"]);
    });

    it("clave o destinatario inválidos ⇒ 503 y el log no expone sus valores", async () => {
      useResend();
      process.env.RESEND_API_KEY = "clave-equivocada";
      const info = vi.spyOn(console, "info").mockImplementation(() => {});
      const res = await POST(req(payload));
      expect(res.status).toBe(503);
      const logged = info.mock.calls.map((c) => String(c[0])).join("\n");
      expect(logged).toContain("resend_api_key_invalid");
      expect(logged).not.toContain("clave-equivocada");
    });
  });

  it("429 tras exceder el límite por IP", async () => {
    for (let i = 0; i < 5; i++) await POST(req(payload, "9.9.9.9"));
    const res = await POST(req(payload, "9.9.9.9"));
    expect(res.status).toBe(429);
  });
});
