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
  });

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

  it("429 tras exceder el límite por IP", async () => {
    for (let i = 0; i < 5; i++) await POST(req(payload, "9.9.9.9"));
    const res = await POST(req(payload, "9.9.9.9"));
    expect(res.status).toBe(429);
  });
});
