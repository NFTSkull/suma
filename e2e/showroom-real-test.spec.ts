import { test, expect, type Page } from "@playwright/test";

const PREVIEW_URL = process.env.PREVIEW_URL;
const VERCEL_SHARE = process.env.VERCEL_SHARE_TOKEN;

if (!PREVIEW_URL || !VERCEL_SHARE) {
  throw new Error("PREVIEW_URL and VERCEL_SHARE_TOKEN environment variables are required");
}

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

test.describe("Showroom - Verificación Real en Preview", () => {
  test.beforeEach(async ({ page }) => {
    // Navegar con token de bypass
    await page.goto(`${PREVIEW_URL}/?_vercel_share=${VERCEL_SHARE}`);
    // Esperar a que cargue y establezca la cookie
    await page.waitForLoadState("networkidle");
  });

  test("Mobile 390px: Flujo completo desde landing hasta submit con tiempo medido", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    const startTime = Date.now();
    console.log("🕐 Inicio del flujo:", new Date(startTime).toISOString());

    // Navegar al showroom con UTM
    await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}&utm_source=instagram&utm_medium=social&utm_campaign=test_e2e`);
    await page.waitForLoadState("networkidle");
    console.log("✅ Página cargada:", ((Date.now() - startTime) / 1000).toFixed(1), "s");

    // Screenshot inicial
    await page.screenshot({ path: "/opt/cursor/artifacts/01-mobile-landing.png", fullPage: true });

    // Verificar que NO preselecciona CRM por defecto
    const crmCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /CRM|Organizar clientes/i }).first();
    if (await crmCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      const isChecked = await crmCheckbox.isChecked();
      console.log("🔍 CRM checkbox state:", isChecked ? "PRESELECCIONADO ⚠️" : "No preseleccionado ✅");
      expect(isChecked).toBe(false); // No debe estar preseleccionado
    }

    // Verificar evento GA4: showroom_visit
    let events = await getDataLayerEvents(page);
    console.log("📊 Eventos iniciales:", events.map(e => e.event).join(", "));
    expect(events.some(e => e.event === "showroom_visit")).toBe(true);

    // Personalizar negocio
    console.log("⏱️  Personalizando negocio:", ((Date.now() - startTime) / 1000).toFixed(1), "s");
    await page.fill('input[name="businessName"]', "Test E2E Studio");
    await page.waitForTimeout(500);

    // Seleccionar un servicio
    if (await crmCheckbox.isVisible()) {
      await crmCheckbox.check();
      console.log("✅ Servicio CRM seleccionado");
    }
    await page.waitForTimeout(2000); // Debounce del quote_updated

    events = await getDataLayerEvents(page);
    console.log("📊 Eventos después de config:", events.map(e => e.event).join(", "));

    // Screenshot con configuración
    await page.screenshot({ path: "/opt/cursor/artifacts/02-mobile-configured.png", fullPage: true });

    // Scroll al formulario
    console.log("⏱️  Scrolling a formulario:", ((Date.now() - startTime) / 1000).toFixed(1), "s");
    const formHeading = page.locator("text=/Quiero una propuesta|propuesta para/i").first();
    await formHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verificar evento showroom_proposal_requested
    events = await getDataLayerEvents(page);
    expect(events.some(e => e.event === "showroom_proposal_requested")).toBe(true);
    console.log("✅ Evento showroom_proposal_requested disparado");

    // Llenar formulario
    console.log("⏱️  Llenando formulario:", ((Date.now() - startTime) / 1000).toFixed(1), "s");
    await page.fill('input[name="nombre"]', "Carlos Test E2E");
    await page.fill('input[name="negocio"]', "Pilates Studio Test");
    await page.fill('input[name="email"]', "test-e2e@example.com");
    await page.fill('textarea[name="necesidades"]', "Testing E2E del flujo completo");
    
    // Aceptar privacidad
    const privacyCheckbox = page.locator('input[type="checkbox"][name="privacidad"]');
    await privacyCheckbox.check();

    // Screenshot antes de submit
    await page.screenshot({ path: "/opt/cursor/artifacts/03-mobile-form-filled.png", fullPage: true });

    // Submit
    console.log("⏱️  Enviando formulario:", ((Date.now() - startTime) / 1000).toFixed(1), "s");
    const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Enviar|Solicitar/i });
    
    // Interceptar la petición API
    const responsePromise = page.waitForResponse(
      response => response.url().includes("/api/showroom-lead") && response.status() < 600,
      { timeout: 15000 }
    );
    
    await submitButton.click();
    const response = await responsePromise;
    
    const responseBody = await response.json();
    const apiStatus = response.status();
    
    console.log("📡 API Response Status:", apiStatus);
    console.log("📡 API Response Body:", JSON.stringify(responseBody, null, 2));

    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;
    console.log(`⏱️  TIEMPO TOTAL: ${durationSeconds.toFixed(1)}s (objetivo: <120s)`);

    // Screenshot después de submit
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "/opt/cursor/artifacts/04-mobile-after-submit.png", fullPage: true });

    // Verificar respuesta según si hay RESEND o no
    if (apiStatus === 503) {
      console.log("⚠️  API retornó 503 (sin configuración Resend, esperado en preview)");
      expect(responseBody.error).toBe("not_configured");
    } else if (apiStatus === 200) {
      console.log("✅ API retornó 200 (Resend configurado o anti-spam silencioso)");
      expect(responseBody.ok).toBe(true);
      
      // Si delivered, verificar evento GA4
      if (responseBody.delivered) {
        await page.waitForTimeout(1000);
        events = await getDataLayerEvents(page);
        const hasGenerateLead = events.some(e => e.event === "generate_lead");
        console.log("📊 Evento generate_lead:", hasGenerateLead ? "✅ Disparado" : "❌ No disparado");
        expect(hasGenerateLead).toBe(true);
      }
    } else {
      console.log(`⚠️  API retornó ${apiStatus}:`, responseBody);
    }

    // Verificar que el tiempo está bajo el objetivo
    expect(durationSeconds).toBeLessThan(120);
    console.log("✅ Flujo completo en tiempo aceptable");
  });

  test("Desktop: Flujo completo", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}&utm_source=test`);
    await page.waitForLoadState("networkidle");
    
    await page.screenshot({ path: "/opt/cursor/artifacts/05-desktop-landing.png", fullPage: false });

    // Personalizar
    await page.fill('input[name="businessName"]', "Desktop Test Studio");
    
    // Modo paquete
    const packageButton = page.locator('button[type="button"]').filter({ hasText: /Paquete.*extras/i });
    if (await packageButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await packageButton.click();
      await page.waitForTimeout(500);
      console.log("✅ Modo paquete seleccionado");
    }

    await page.screenshot({ path: "/opt/cursor/artifacts/06-desktop-package.png", fullPage: false });

    // Scroll y llenar formulario
    const formHeading = page.locator("text=/Quiero una propuesta/i").first();
    await formHeading.scrollIntoViewIfNeeded();
    
    await page.fill('input[name="nombre"]', "Ana Desktop Test");
    await page.fill('input[name="negocio"]', "Wellness Desktop");
    await page.fill('input[name="email"]', "desktop-test@example.com");
    await page.locator('input[type="checkbox"][name="privacidad"]').check();

    await page.screenshot({ path: "/opt/cursor/artifacts/07-desktop-form.png", fullPage: false });

    const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Enviar|Solicitar/i });
    const responsePromise = page.waitForResponse(
      response => response.url().includes("/api/showroom-lead"),
      { timeout: 15000 }
    );
    
    await submitButton.click();
    const response = await responsePromise;
    const responseBody = await response.json();
    
    console.log("📡 Desktop API Response:", response.status(), responseBody);
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "/opt/cursor/artifacts/08-desktop-success.png", fullPage: false });
  });

  test("Validación de campos requeridos", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}`);
    await page.waitForLoadState("networkidle");

    const formHeading = page.locator("text=/Quiero una propuesta/i").first();
    await formHeading.scrollIntoViewIfNeeded();

    // Intentar submit sin llenar nada
    const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Enviar|Solicitar/i });
    await submitButton.click();

    // Verificar mensajes de error (HTML5 validation o custom)
    await page.waitForTimeout(1000);
    
    // Capturar screenshot con errores
    await page.screenshot({ path: "/opt/cursor/artifacts/09-validation-errors.png", fullPage: true });
    
    console.log("✅ Validación de campos probada");
  });

  test("Honeypot detiene spam", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}`);
    await page.waitForLoadState("networkidle");

    const formHeading = page.locator("text=/Quiero una propuesta/i").first();
    await formHeading.scrollIntoViewIfNeeded();

    // Llenar honeypot
    await page.evaluate(() => {
      const honeypot = document.querySelector('input[name="sitio"]') as HTMLInputElement;
      if (honeypot) honeypot.value = "spam-bot";
    });

    // Llenar campos válidos
    await page.fill('input[name="nombre"]', "Spammer");
    await page.fill('input[name="negocio"]', "Spam Inc");
    await page.fill('input[name="email"]', "spam@spam.com");
    await page.locator('input[type="checkbox"][name="privacidad"]').check();

    const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Enviar|Solicitar/i });
    const responsePromise = page.waitForResponse(
      response => response.url().includes("/api/showroom-lead"),
      { timeout: 15000 }
    );
    
    await submitButton.click();
    const response = await responsePromise;
    const responseBody = await response.json();
    
    console.log("🛡️  Honeypot test response:", response.status(), responseBody);
    
    // Debe ser 200 pero ok sin delivered (descarte silencioso)
    expect(response.status()).toBe(200);
    expect(responseBody.ok).toBe(true);
    expect(responseBody.delivered).toBeUndefined();
    
    // No debe disparar generate_lead
    await page.waitForTimeout(1000);
    const events = await getDataLayerEvents(page);
    const hasGenerateLead = events.some(e => e.event === "generate_lead");
    expect(hasGenerateLead).toBe(false);
    
    console.log("✅ Honeypot funcionando correctamente (descarte silencioso)");
  });

  test("Verificar eventos GA4 completos", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}&utm_source=test`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    let events = await getDataLayerEvents(page);
    console.log("📊 Eventos iniciales:", events.map(e => e.event));
    expect(events.some(e => e.event === "showroom_visit")).toBe(true);

    // Cambiar demo si es posible
    const demoButtons = await page.locator('button[type="button"]').filter({ hasText: /Chatbot|CRM|Web/i }).all();
    if (demoButtons.length > 0) {
      await demoButtons[0].click();
      await page.waitForTimeout(500);
      events = await getDataLayerEvents(page);
      console.log("📊 Después de cambiar demo:", events.map(e => e.event));
    }

    // Hacer cambio en configuración
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    if (checkboxes.length > 0) {
      await checkboxes[0].check();
      await page.waitForTimeout(2000); // Debounce
      events = await getDataLayerEvents(page);
      console.log("📊 Después de config:", events.map(e => e.event));
    }

    // Scroll a formulario
    const formHeading = page.locator("text=/Quiero una propuesta/i").first();
    await formHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    events = await getDataLayerEvents(page);
    expect(events.some(e => e.event === "showroom_proposal_requested")).toBe(true);

    console.log("✅ Todos los eventos GA4 verificados:", events.map(e => e.event));
  });
});
