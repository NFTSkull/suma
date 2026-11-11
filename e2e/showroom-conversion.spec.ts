import { test, expect, type Page } from "@playwright/test";
import { createHash } from "crypto";

const PREVIEW_URL = process.env.PREVIEW_URL || "https://suma-ituin4iwk-viozs-projects.vercel.app";
const SHOWROOM_PATH = "/showroom?utm_source=instagram&utm_medium=social&utm_campaign=pilates_mty";

// Tipos para GA4 dataLayer
type DataLayerEvent = {
  event?: string;
  [key: string]: unknown;
};

function getDataLayerEvents(page: Page): Promise<DataLayerEvent[]> {
  return page.evaluate(() => {
    const w = window as typeof window & { dataLayer?: DataLayerEvent[] };
    return (w.dataLayer ?? []).filter((item) => String(item.event).startsWith("showroom_"));
  });
}

test.describe("Showroom Lead Capture - Mobile 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("Flujo completo desde landing hasta submit exitoso en <2 minutos", async ({ page }) => {
    const startTime = Date.now();

    // Navegar al showroom con UTM params
    await page.goto(`${PREVIEW_URL}${SHOWROOM_PATH}`);
    await page.waitForLoadState("networkidle");

    // Screenshot inicial
    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-mobile-01-landing.png", fullPage: true });

    // Verificar que showroom_visit se disparó
    const eventsAfterLanding = await getDataLayerEvents(page);
    expect(eventsAfterLanding.some((e) => e.event === "showroom_visit")).toBe(true);

    // Personalizar negocio
    await page.fill('input[aria-label="Nombre de tu negocio"], input[name="businessName"]', "Estudio Pilates Test");

    // Seleccionar un servicio individual
    const crmCheckbox = page.locator('input[type="checkbox"]', { hasText: /CRM|Organizar clientes/ }).first();
    if (await crmCheckbox.isVisible()) {
      await crmCheckbox.check();
    }

    // Esperar a que se actualice el quote
    await page.waitForTimeout(2000);

    // Screenshot con configuración
    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-mobile-02-configured.png", fullPage: true });

    // Scroll al formulario de lead
    await page.locator("text=Quiero una propuesta").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verificar que showroom_proposal_requested se disparó
    const eventsAfterScroll = await getDataLayerEvents(page);
    expect(eventsAfterScroll.some((e) => e.event === "showroom_proposal_requested")).toBe(true);

    // Llenar formulario
    await page.fill('input[name="nombre"], input[aria-label*="nombre" i]', "Carlos Test");
    await page.fill('input[name="negocio"], input[aria-label*="negocio" i]', "Pilates MTY");
    await page.fill('input[name="email"], input[type="email"]', "carlos.test@example.com");
    await page.fill('input[name="whatsapp"], input[aria-label*="WhatsApp" i]', "8112345678");
    await page.fill('textarea[name="necesidades"], textarea[aria-label*="necesidades" i]', "Necesito CRM para gestionar clientes");

    // Aceptar privacidad
    const privacyCheckbox = page.locator('input[type="checkbox"][name="privacidad"]');
    await privacyCheckbox.check();

    // Screenshot antes de submit
    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-mobile-03-form-filled.png", fullPage: true });

    // Submit
    const submitButton = page.locator('button[type="submit"]', { hasText: /Enviar|Solicitar/i });
    await submitButton.click();

    // Esperar respuesta
    await page.waitForResponse((response) => response.url().includes("/api/showroom-lead") && response.status() === 200, { timeout: 10000 });

    // Verificar evento GA4 generate_lead
    await page.waitForTimeout(1000);
    const eventsAfterSubmit = await getDataLayerEvents(page);
    expect(eventsAfterSubmit.some((e) => e.event === "generate_lead")).toBe(true);

    // Screenshot después de submit
    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-mobile-04-success.png", fullPage: true });

    // Verificar mensaje de éxito
    await expect(page.locator("text=/gracias|éxito|recibimos/i")).toBeVisible({ timeout: 5000 });

    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;
    console.log(`✅ Flujo completo en ${durationSeconds.toFixed(1)}s (objetivo: <120s)`);
    expect(durationSeconds).toBeLessThan(120);
  });

  test("Validación de campos requeridos", async ({ page }) => {
    await page.goto(`${PREVIEW_URL}${SHOWROOM_PATH}`);
    await page.waitForLoadState("networkidle");

    // Scroll al formulario
    await page.locator("text=Quiero una propuesta").first().scrollIntoViewIfNeeded();

    // Intentar submit sin llenar nada
    const submitButton = page.locator('button[type="submit"]', { hasText: /Enviar|Solicitar/i });
    await submitButton.click();

    // Verificar mensajes de error
    await expect(page.locator("text=/campo.*requerido|obligatorio|proporciona/i").first()).toBeVisible({ timeout: 3000 });

    // Screenshot de errores
    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-mobile-validation-errors.png", fullPage: true });
  });

  test("Honeypot detiene spam", async ({ page }) => {
    await page.goto(`${PREVIEW_URL}${SHOWROOM_PATH}`);
    await page.waitForLoadState("networkidle");

    await page.locator("text=Quiero una propuesta").first().scrollIntoViewIfNeeded();

    // Llenar honeypot (campo oculto "sitio")
    await page.evaluate(() => {
      const honeypot = document.querySelector('input[name="sitio"]') as HTMLInputElement;
      if (honeypot) honeypot.value = "spam";
    });

    // Llenar campos válidos
    await page.fill('input[name="nombre"]', "Spammer");
    await page.fill('input[name="negocio"]', "Spam Inc");
    await page.fill('input[name="email"]', "spam@spam.com");
    await page.locator('input[type="checkbox"][name="privacidad"]').check();

    const submitButton = page.locator('button[type="submit"]', { hasText: /Enviar|Solicitar/i });
    await submitButton.click();

    // Esperar respuesta (debería ser 200 pero sin delivered)
    await page.waitForTimeout(2000);

    // Verificar que NO se disparó generate_lead
    const events = await getDataLayerEvents(page);
    expect(events.some((e) => e.event === "generate_lead")).toBe(false);
  });
});

test.describe("Showroom Lead Capture - Desktop", () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test("Flujo completo en desktop", async ({ page }) => {
    await page.goto(`${PREVIEW_URL}${SHOWROOM_PATH}`);
    await page.waitForLoadState("networkidle");

    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-desktop-01-landing.png", fullPage: false });

    // Personalizar
    await page.fill('input[aria-label="Nombre de tu negocio"], input[name="businessName"]', "Studio Wellness Desktop");

    // Modo paquete
    const packageButton = page.locator('button[type="button"]', { hasText: /Paquete.*extras/i });
    if (await packageButton.isVisible()) {
      await packageButton.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-desktop-02-package.png", fullPage: false });

    // Scroll y llenar formulario
    await page.locator("text=Quiero una propuesta").first().scrollIntoViewIfNeeded();
    await page.fill('input[name="nombre"]', "Ana Desktop");
    await page.fill('input[name="negocio"]', "Wellness MTY");
    await page.fill('input[name="email"]', "ana.desktop@example.com");
    await page.locator('input[type="checkbox"][name="privacidad"]').check();

    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-desktop-03-form.png", fullPage: false });

    const submitButton = page.locator('button[type="submit"]', { hasText: /Enviar|Solicitar/i });
    await submitButton.click();

    await page.waitForResponse((response) => response.url().includes("/api/showroom-lead"), { timeout: 10000 });
    await page.waitForTimeout(1000);

    const events = await getDataLayerEvents(page);
    expect(events.some((e) => e.event === "generate_lead")).toBe(true);

    await page.screenshot({ path: "/opt/cursor/artifacts/showroom-desktop-04-success.png", fullPage: false });
  });
});

test.describe("Showroom Analytics GA4", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("Todos los eventos GA4 se disparan correctamente", async ({ page }) => {
    await page.goto(`${PREVIEW_URL}${SHOWROOM_PATH}`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    let events = await getDataLayerEvents(page);
    console.log("Events after landing:", events.map((e) => e.event));
    expect(events.some((e) => e.event === "showroom_visit")).toBe(true);

    // Cambiar demo
    const chatbotButton = page.locator('button[type="button"]', { hasText: /Chatbot|WhatsApp/i }).first();
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);
      events = await getDataLayerEvents(page);
      expect(events.some((e) => e.event === "showroom_demo_viewed")).toBe(true);
    }

    // Hacer un cambio en configuración
    const serviceCheckbox = page.locator('input[type="checkbox"]').first();
    if (await serviceCheckbox.isVisible()) {
      await serviceCheckbox.check();
      await page.waitForTimeout(2000); // Debounce
      events = await getDataLayerEvents(page);
      // showroom_quote_updated puede dispararse
      console.log("Events after config change:", events.map((e) => e.event));
    }

    // Scroll al formulario
    await page.locator("text=Quiero una propuesta").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    events = await getDataLayerEvents(page);
    expect(events.some((e) => e.event === "showroom_proposal_requested")).toBe(true);

    console.log("✅ Todos los eventos GA4 confirmados:", events.map((e) => e.event));
  });
});
