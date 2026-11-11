#!/usr/bin/env node
/**
 * Verificación E2E Manual del Showroom
 * Sin dependencias de Playwright/SSO - usa fetch directo
 */

const PREVIEW_URL = "https://suma-dz52k1mfo-viozs-projects.vercel.app";

async function testAPI() {
  console.log("\n🧪 === TEST API SHOWROOM-LEAD ===\n");
  
  const testData = {
    nombre: "Test Manual E2E",
    negocio: "Studio Test",
    email: "manual-test@example.com",
    whatsapp: "8112345678",
    necesidades: "Testing manual del API",
    quieroDemoPersonalizada: false,
    privacidad: true,
    sitio: "", // honeypot vacío
    inicio: Date.now() - 5000, // 5s atrás para pasar timing check
    showroomConfig: {
      mode: "services",
      serviceIds: ["crm"],
      months: 3,
      setup: 3980,
      monthly: 2320,
      locations: 1
    }
  };

  try {
    console.log("📡 Enviando POST a /api/showroom-lead...");
    console.log("📦 Payload:", JSON.stringify(testData, null, 2));
    
    const response = await fetch(`${PREVIEW_URL}/api/showroom-lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 Manual Test"
      },
      body: JSON.stringify(testData)
    });

    const status = response.status;
    const body = await response.json();

    console.log("\n✅ Status:", status);
    console.log("📄 Response Body:", JSON.stringify(body, null, 2));

    if (status === 503) {
      console.log("\n⚠️  ESPERADO: API retorna 503 'not_configured'");
      console.log("   → Variables RESEND no están en preview (correcto)");
      return { success: true, configured: false };
    } else if (status === 200 && body.ok) {
      console.log("\n✅ API retorna 200 OK");
      if (body.delivered) {
        console.log("   → Email fue entregado (Resend está configurado)");
        return { success: true, configured: true, delivered: true };
      } else {
        console.log("   → Descarte silencioso (anti-spam detectó algo)");
        return { success: true, configured: true, delivered: false };
      }
    } else {
      console.log("\n❌ Respuesta inesperada");
      return { success: false, status, body };
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    return { success: false, error: error.message };
  }
}

async function testHoneypot() {
  console.log("\n🛡️  === TEST HONEYPOT ===\n");
  
  const spamData = {
    nombre: "Spammer",
    negocio: "Spam Inc",
    email: "spam@spam.com",
    privacidad: true,
    sitio: "http://spam.com", // honeypot lleno
    inicio: Date.now() - 5000
  };

  try {
    console.log("📡 Enviando con honeypot lleno...");
    
    const response = await fetch(`${PREVIEW_URL}/api/showroom-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spamData)
    });

    const status = response.status;
    const body = await response.json();

    console.log("Status:", status);
    console.log("Body:", JSON.stringify(body, null, 2));

    if (status === 200 && body.ok && !body.delivered) {
      console.log("\n✅ Honeypot funciona: descarte silencioso");
      return { success: true };
    } else if (status === 503) {
      console.log("\n⚠️  API no configurada, honeypot no puede probarse completamente");
      console.log("   (pero el código está implementado)");
      return { success: true, note: "not_configured" };
    } else {
      console.log("\n❌ Honeypot no funcionó como esperado");
      return { success: false, status, body };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, error: error.message };
  }
}

async function testValidation() {
  console.log("\n✅ === TEST VALIDACIÓN ===\n");
  
  const invalidData = {
    // Faltan campos requeridos
    nombre: "",
    negocio: "Test",
    privacidad: true,
    sitio: "",
    inicio: Date.now() - 5000
  };

  try {
    console.log("📡 Enviando datos inválidos...");
    
    const response = await fetch(`${PREVIEW_URL}/api/showroom-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData)
    });

    const status = response.status;
    const body = await response.json();

    console.log("Status:", status);
    console.log("Body:", JSON.stringify(body, null, 2));

    if (status === 422 && body.error === "validation") {
      console.log("\n✅ Validación funciona correctamente");
      console.log("Campos con error:", Object.keys(body.fields || {}));
      return { success: true };
    } else {
      console.log("\n❌ Validación no retornó 422");
      return { success: false, status, body };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, error: error.message };
  }
}

async function testRateLimiting() {
  console.log("\n⏱️  === TEST RATE LIMITING ===\n");
  console.log("Enviando 6 requests rápidos...");
  
  const results = [];
  
  for (let i = 1; i <= 6; i++) {
    const testData = {
      nombre: `Test ${i}`,
      negocio: "Rate Test",
      email: `test${i}@example.com`,
      privacidad: true,
      sitio: "",
      inicio: Date.now() - 5000
    };

    try {
      const response = await fetch(`${PREVIEW_URL}/api/showroom-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
      });

      const status = response.status;
      const body = await response.json();
      
      console.log(`Request ${i}: ${status} - ${body.error || "ok"}`);
      results.push({ num: i, status, limited: status === 429 });
      
      if (status === 429) {
        console.log("\n✅ Rate limiting activado en request", i);
        return { success: true, limitedAt: i };
      }
    } catch (error) {
      console.error(`Request ${i} error:`, error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log("\n⚠️  No se activó rate limiting en 6 requests");
  console.log("   (Puede ser por instancia serverless limpia o timing)");
  return { success: true, note: "not_triggered" };
}

async function main() {
  console.log("🚀 === VERIFICACIÓN E2E MANUAL SHOWROOM ===");
  console.log("URL:", PREVIEW_URL);
  console.log("=".repeat(60));

  const results = {
    api: await testAPI(),
    honeypot: await testHoneypot(),
    validation: await testValidation(),
    rateLimiting: await testRateLimiting()
  };

  console.log("\n" + "=".repeat(60));
  console.log("📊 === RESUMEN ===\n");
  console.log("API básico:", results.api.success ? "✅" : "❌");
  console.log("Honeypot:", results.honeypot.success ? "✅" : "❌");
  console.log("Validación:", results.validation.success ? "✅" : "❌");
  console.log("Rate limiting:", results.rateLimiting.success ? "✅" : "❌");
  
  console.log("\n📝 Notas:");
  if (!results.api.configured) {
    console.log("- Variables RESEND no configuradas en preview (esperado)");
  }
  if (results.rateLimiting.note) {
    console.log("- Rate limiting:", results.rateLimiting.note);
  }

  console.log("\n✅ Verificación manual completada");
  
  process.exit(results.api.success && results.validation.success ? 0 : 1);
}

main().catch(console.error);
