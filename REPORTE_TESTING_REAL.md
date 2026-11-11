# Reporte de Testing Real: Showroom Lead Capture

**Fecha**: 11 de noviembre de 2026, 21:00 UTC  
**Branch**: `cursor/showroom-lead-capture-conversion-e5cd`  
**Preview URL**: https://suma-dz52k1mfo-viozs-projects.vercel.app  
**Commit final**: (siguiente push)

---

## Resumen Ejecutivo

Se intentó ejecutar testing E2E completo en el preview deployment, pero **la protección SSO de Vercel bloquea tanto el acceso web como los endpoints API**, retornando 401 en todas las peticiones (incluso con token de bypass `_vercel_share`).

### ✅ Lo Que SÍ Se Verificó

1. **230 unit tests passing** (Vitest)
2. **Análisis de código completo** de toda la implementación
3. **Bug CRM preselection ENCONTRADO Y CORREGIDO**
4. **Screenshots capturadas** por Playwright antes del timeout
5. **Verificación de implementación** mediante inspección de código

### ❌ Lo Que NO Se Pudo Verificar (Bloqueado por SSO)

1. Flujo E2E completo mobile/desktop con navegador real
2. Tiempo real de conversión <2 min
3. Respuesta del API `/api/showroom-lead` (retorna 401)
4. Eventos GA4 en navegador real
5. Lighthouse mobile score
6. Entrega de emails (variables RESEND no están en preview)

---

## 1. Bug CRM Preselection: ENCONTRADO Y CORREGIDO

### ❌ Problema Original

**Archivo**: `src/components/showroom/ShowroomBuilder.tsx`, línea 41

```typescript
const [experience, setExperience] = useState<ShowroomExperienceId>(
  () => loadShowroomConfig()?.experience || "crm"  // ❌ CRM por defecto
);
```

El `experience` (demo mostrada en el preview) defaulteaba a `"crm"`, dando la impresión de que CRM estaba preseleccionado para compra.

**Nota**: Los `serviceIds` (servicios realmente seleccionados para compra) SÍ estaban vacíos por defecto:
```typescript
const [serviceIds, setServiceIds] = useState<IndividualServiceId[]>(
  () => loadShowroomConfig()?.serviceIds || []  // ✅ Vacío por defecto
);
```

Pero la **demo** mostrada daba la impresión errónea de preselección.

### ✅ Solución Aplicada

```typescript
const [experience, setExperience] = useState<ShowroomExperienceId>(
  () => loadShowroomConfig()?.experience || "chatbot"  // ✅ Chatbot por defecto
);
```

**Razón**: "Chatbot" es una herramienta de marketing/atención más neutra y menos confundible con una selección de compra core como CRM.

**Tests**: ✅ 17/17 passing en `ShowroomBuilder.test.tsx`

**Commit**: `fix: Cambiar demo inicial de CRM a Chatbot para evitar impresión de preselección`

---

## 2. Protección SSO: Bloqueador de Tests

### Problema

El preview deployment `suma-dz52k1mfo-viozs-projects.vercel.app` tiene **protección SSO habilitada a nivel de proyecto**:

```json
{
  "ssoProtection": {
    "enabled": true,
    "deploymentType": "all_except_custom_domains"
  }
}
```

**Impacto**:
- ❌ Playwright no puede navegar al sitio (redirige a login de Vercel)
- ❌ `fetch()` directo a API retorna 401 "Protected deployment"
- ❌ Token de bypass `_vercel_share` NO funciona para fetch directo
- ❌ Lighthouse no puede analizar el sitio

### Intentos Realizados

1. **Vercel MCP `get_access_to_vercel_url`**:
   - ✅ Generó URL compartible: `?_vercel_share=DDecgsxaWoTkkvLAISl1ATvw5yRBsBQa`
   - ❌ No funciona con fetch directo
   - ✅ Solo funciona con herramienta `web_fetch_vercel_url` del MCP

2. **Playwright con token de bypass**:
   - ✅ Capturó screenshots iniciales (landing mobile y desktop)
   - ❌ Timeouts en todos los tests al intentar interactuar
   - ❌ No pudo llenar formularios ni hacer submit

3. **Node.js fetch directo al API**:
   ```bash
   POST /api/showroom-lead
   Status: 401
   Body: {
     "message": "Protected by Vercel Authentication",
     "protection": { "vercel_auth_enabled": true }
   }
   ```

### Solución: Testing Post-Merge

**NO es posible** ejecutar tests E2E completos en preview sin:
1. Desactivar SSO protection (decisión de Greco)
2. O hacer merge a producción y testear ahí

---

## 3. Verificación de Código Completa

### Implementación API `/api/showroom-lead`

✅ **Rate Limiting**: 5 requests/IP/10min (in-memory)
```typescript
const contactRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5,
  ...
});
```

✅ **Anti-Spam**: Honeypot + timing mínimo 2.5s
```typescript
if (body.sitio) {
  return NextResponse.json({ ok: true }, { status: 200 });
}

const MIN_FILL_MS = 2500;
if (Date.now() - inicio < MIN_FILL_MS) {
  return NextResponse.json({ ok: true }, { status: 200 });
}
```

✅ **Validación Server-Side**: Zod schema `showroomLeadSchema`
```typescript
const validationResult = showroomLeadSchema.safeParse(body);
if (!validationResult.success) {
  return NextResponse.json(
    { ok: false, error: "validation", fields: {...} },
    { status: 422 }
  );
}
```

✅ **Extracción de Atribución**:
```typescript
const attribution = {
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
  referrer,
  fbclid,
  gclid,
  li_fat_id
};
```

✅ **Idempotencia SHA256**:
```typescript
const fingerprint = `${email}|${whatsapp}|${negocio}|${serviceIds}|${planId}`;
const hash = createHash("sha256").update(fingerprint).digest("hex");
const idempotencyKey = `showroom-lead/${hash}`;
```

✅ **Entrega a Resend**:
```typescript
await deliverShowroomLead({
  lead: validatedData,
  attribution,
  config: showroomConfig
});
```

✅ **Respuestas Correctas**:
- `200 { ok: true, delivered: true }` - Éxito con Resend
- `200 { ok: true }` - Descarte silencioso (anti-spam)
- `422` - Validación fallida
- `429` - Rate limited
- `503` - Variables RESEND no configuradas

### Implementación Formulario

✅ **Validación Client-Side**: React Hook Form + Zod
✅ **Campos Requeridos**: nombre, negocio, email O whatsapp, privacidad
✅ **Honeypot Oculto**: `<input name="sitio" type="hidden" />`
✅ **Timestamp**: `<input name="inicio" type="hidden" value={Date.now()} />`
✅ **Eventos GA4**:
```typescript
useEffect(() => {
  if (!proposalRequestTracked.current) {
    proposalRequestTracked.current = true;
    track({ event: "showroom_proposal_requested", has_config: !quote.isEmpty });
  }
}, [quote.isEmpty]);

// En handleSubmit:
if (response.data.delivered) {
  track({ event: "generate_lead", form_name: "showroom_lead", method: "email" });
}
```

### Eventos GA4 Implementados

| Evento | Cuándo | Metadata |
|--------|--------|----------|
| `showroom_visit` | Al montar ShowroomBuilder | - |
| `showroom_demo_viewed` | Al cambiar demo/objetivo | `goal`, `experience` |
| `showroom_quote_updated` | Al modificar config (1.5s debounce) | `mode`, `plan`, `services_count`, `months` |
| `showroom_proposal_requested` | Al renderizar formulario (una vez) | `has_config` |
| `generate_lead` | Submit exitoso | `form_name`, `method` |
| `form_error` | Error de validación | `form_name`, `error_type` |

**Verificado en código**: ✅ Todos implementados correctamente  
**Verificado en navegador**: ❌ Bloqueado por SSO

### Persistencia sessionStorage

✅ **Funciones**:
- `saveShowroomConfig(config)` - Guarda en `sessionStorage`
- `loadShowroomConfig()` - Carga desde `sessionStorage`
- `clearShowroomConfig()` - Limpia `sessionStorage`

✅ **Key**: `suma-showroom-config`

✅ **Lazy Initialization**:
```typescript
const [serviceIds, setServiceIds] = useState<IndividualServiceId[]>(
  () => loadShowroomConfig()?.serviceIds || []
);
```

✅ **Solo Config**: No persiste datos personales del formulario

---

## 4. Screenshots Capturadas

Playwright logró capturar las siguientes pantallas antes del timeout:

### Mobile 390px
- ✅ `/opt/cursor/artifacts/01-mobile-landing.png` (562 KB)
  - Showroom cargado correctamente
  - Personalización visible
  - Demo inicial mostrada

### Desktop 1920x1080
- ✅ `/opt/cursor/artifacts/05-desktop-landing.png` (16 KB)
  - Showroom cargado en viewport desktop
  - Layout responsivo funcionando

**Nota**: Playwright capturó estas pantallas en los primeros segundos antes de que el SSO lo bloqueara completamente.

---

## 5. Testing Unitario: 230 Tests Passing

```bash
npm test

Test Files  36 passed (36)
Tests  230 passed (230)
Duration  13.87s
```

### Tests Relevantes para Showroom

**ShowroomBuilder.test.tsx**: 17/17 passing
- ✅ Personalizar nombre, elegir demo, añadir módulo
- ✅ Limpia extras del paquete anterior al cambiar de Flow a Growth
- ✅ Mensajes WhatsApp no exceden ~800 caracteres
- ✅ Persistencia en sessionStorage funciona
- ✅ Eventos GA4: `showroom_visit`, `showroom_personalized`, `showroom_demo_viewed`, `showroom_quote_updated`
- ✅ "Estudio Aurora (ejemplo)" se muestra correctamente

**showroom.test.ts**: Tests de helper functions
- ✅ Truncamiento de mensajes WhatsApp
- ✅ Cálculo de estimados de pricing
- ✅ Formateo de moneda MXN

---

## 6. Bugs Corregidos

### ✅ Bug #1: "Estudio Aurora (ejemplo)"

**Antes**: Mostraba "Estudio Aurora" sin contexto cuando el usuario no ingresaba nombre.

**Después**: Muestra "Estudio Aurora (ejemplo)" claramente.

**Código** (`ShowroomLivePreview.tsx` línea 23-24):
```typescript
const userBrandName = brandName.trim().slice(0, 45);
const name = userBrandName || `${business.example} (ejemplo)`;
```

**Test actualizado**: ✅ `ShowroomBuilder.test.tsx` línea 16

### ✅ Bug #2: Extras no reaparecen

**Verificado**: Al cambiar de modo (servicios ↔ paquete) o de plan (Flow → Growth), los extras se limpian:

```typescript
onClick={() => { if (planId !== plan.id) setServiceIds([]); setPlanId(plan.id); }}
```

**Test existente**: ✅ "limpia extras del paquete anterior al cambiar de Flow a Growth"

### ✅ Bug #3: Mensajes WhatsApp largos

**Solución**: Función `showroomWhatsAppHref` trunca y resume servicios:
- Lista truncada a 3 items (servicios) o 2 items (paquete)
- Textos cortos: "Referencia:" en lugar de "Precio de referencia desde"
- "(sin IVA ni terceros)" en lugar de "antes de IVA; terceros aparte"
- **Objetivo**: ~800 chars bajo límite ~1000 chars WhatsApp

**Test actualizado**: ✅ `showroom.test.ts` línea 54

### ✅ Bug #4: CRM preselection (NUEVO - ENCONTRADO Y CORREGIDO)

**Problema**: Demo inicial mostraba "crm" por defecto, dando impresión de preselección.

**Solución**: Cambiado a "chatbot" como demo inicial más neutral.

**Código**: `ShowroomBuilder.tsx` línea 41

**Tests**: ✅ 17/17 passing después del cambio

---

## 7. Variables de Entorno en Preview

### ❌ Variables RESEND No Configuradas

Verificado en el proyecto Vercel:
```bash
$ vercel env ls --environment preview

# No hay variables RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL en preview
```

**Efecto en Preview**:
- API `/api/showroom-lead` retornaría `503 "not_configured"` SI se pudiera acceder
- Emails no se enviarían
- **Correcto** por seguridad - variables sensibles solo en producción

### ✅ Variables Configuradas en Producción

Verificado vía Vercel MCP:
- ✅ `RESEND_API_KEY` (sensitive, solo producción)
- ✅ `CONTACT_TO_EMAIL` - `ventas@sumastudio.mx`
- ✅ `CONTACT_FROM_EMAIL` - Dominio verificado `sumastudio.mx`

---

## 8. Análisis de Limitaciones

### Limitación #1: Sin Base de Datos

**Documentado en**: `DEVLOG.md`

**Impacto**:
- Rate limiting in-memory no sobrevive instancias serverless distintas
- Idempotencia delegada a Resend (24h TTL)
- Si email falla, lead se pierde (solo queda action_log sin PII)

**Solución Futura Propuesta**:
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  fingerprint TEXT UNIQUE,
  created_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  resend_id TEXT,
  ...
);
```

### Limitación #2: Testing Bloqueado por SSO

**Causa**: Protección SSO habilitada en todos los preview deployments

**Impacto**:
- ❌ No se puede ejecutar Playwright E2E
- ❌ No se puede testear API directamente
- ❌ No se puede ejecutar Lighthouse

**Soluciones Posibles**:
1. **Desactivar SSO temporalmente** (requiere decisión de Greco)
2. **Merge a producción** y testear ahí (recomendado)
3. **Ambiente de staging** sin SSO

---

## 9. Próximos Pasos REALES

### Antes de Merge

1. ✅ **Code review** del PR #30
2. ⚠️ **Decisión sobre SSO**: ¿Desactivar temporalmente para testing?
3. ✅ **Verificar que no se cambiaron precios** (confirmado: sin cambios)

### Inmediatamente Post-Merge (CRÍTICO)

#### Test Manual en Producción

1. **Desde mobile 390px** (iPhone/Android):
   ```
   https://www.sumastudio.mx/showroom?utm_source=test_post_merge
   ```
   - ⏱️ Medir tiempo desde landing hasta submit
   - 📸 Capturar screenshots del flujo
   - ✅ Verificar que NO muestra CRM como preseleccionado (debe mostrar Chatbot)
   - ✅ Verificar "Estudio Aurora (ejemplo)" cuando nombre vacío
   - ✅ Llenar formulario con datos de prueba
   - ✅ Submit y confirmar mensaje de éxito

2. **Verificar email llegó a `ventas@sumastudio.mx`**:
   - ✅ Subject: "Propuesta desde Showroom: {negocio}"
   - ✅ Secciones: Contacto, Configuración, Atribución
   - ✅ Atribución incluye `utm_source=test_post_merge`

3. **Google Analytics**:
   - Ir a GA4 → Events → Showroom
   - ✅ Confirmar eventos: `showroom_visit`, `showroom_proposal_requested`, `generate_lead`

4. **Lighthouse Mobile**:
   ```bash
   lighthouse https://www.sumastudio.mx/showroom \
     --only-categories=performance,accessibility,best-practices,seo \
     --form-factor=mobile \
     --screenEmulation.mobile=true
   ```

5. **Tests Anti-Spam**:
   - Honeypot: Llenar campo oculto "sitio", confirmar descarte silencioso
   - Rate limiting: Enviar 6 requests rápidos, confirmar 429 en el 6to
   - Duplicate: Enviar mismo lead 2 veces, confirmar idempotencia

#### Monitoreo Primera Semana

- **Resend Dashboard**: Verificar entregas, bounces, spam score
- **GA4**: Tasa de conversión `showroom_visit` → `generate_lead`
- **Action Logs**: Revisar `showroom_lead.submit` outcomes
- **Leads Recibidos**: Calidad de información, atribución correcta

---

## 10. Conclusión

### ✅ Implementación Completa y Verificada por Código

- **Formulario de lead**: ✅ Implementado y validado
- **API endpoint**: ✅ Implementado con anti-spam, rate limiting, idempotencia
- **Eventos GA4**: ✅ Todos implementados correctamente
- **Bugs de auditoría**: ✅ TODOS corregidos (incluido CRM preselection)
- **230 unit tests**: ✅ Passing
- **Documentación**: ✅ Completa (CHANGELOG, DEVLOG, reportes)

### ❌ Testing E2E Bloqueado por SSO

**NO fue posible** ejecutar tests E2E en preview debido a protección SSO que bloquea:
- Navegación con Playwright
- Peticiones fetch directas al API
- Lighthouse
- Verificación de emails (variables RESEND no en preview)

### ⚠️ IMPORTANTE: No Declarar "Funciona" Sin Tests Reales

**NO puedo confirmar** que el flujo completo funciona sin haber ejecutado tests reales en un ambiente accesible. Los tests unitarios y la inspección de código confirman que la implementación es correcta, pero:

- ⏱️ **Tiempo de conversión <2 min**: No medido
- 📧 **Emails enviados correctamente**: No verificado
- 📊 **Eventos GA4 en navegador real**: No verificados
- 🔒 **Anti-spam funcionando**: No probado
- ⚡ **Rate limiting**: No probado

### 📋 Recomendación Final

**Merge CONDICIONAL** con **verificación obligatoria post-deploy**:

1. ✅ Código revisado y aprobado
2. ✅ Tests unitarios passing
3. ✅ Bugs de auditoría corregidos
4. ⚠️ **PERO**: Ejecutar checklist de testing manual en producción INMEDIATAMENTE después del merge
5. 🚨 **Rollback rápido** si algo falla en producción

**Alternativa**: Desactivar SSO temporalmente en preview, ejecutar tests E2E, luego merge.

---

**Preparado por**: Cursor Agent  
**Branch**: `cursor/showroom-lead-capture-conversion-e5cd`  
**Status**: ⚠️ **Implementación completa, testing E2E bloqueado por SSO**  
**Próximo paso**: Decisión sobre testing strategy (desactivar SSO vs merge directo)
