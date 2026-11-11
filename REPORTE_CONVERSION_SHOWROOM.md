# Reporte: Optimización de Conversión Showroom

**Fecha**: 11 de noviembre de 2026  
**Branch**: `cursor/showroom-lead-capture-conversion-e5cd`  
**PR**: #30

---

## Resumen Ejecutivo

Se implementó captura de leads comerciales en `/showroom` con el objetivo de conversión <2 minutos desde mobile Instagram.

### ✅ Implementado

1. **Formulario de captura** integrado con validación Zod client + server
2. **API endpoint** `/api/showroom-lead` con anti-spam, rate limiting, idempotencia
3. **Entrega automatizada** a `ventas@sumastudio.mx` vía Resend
4. **Eventos GA4** completos para medir embudo
5. **Persistencia** de configuración en sessionStorage
6. **Bugs de auditoría** corregidos (4/4)

### ⚠️ Pendiente Verificación Post-Merge

**Testing E2E bloqueado** por protección SSO en preview. Requiere verificación en producción:
- Flujo completo mobile 390px y desktop
- Tiempo de conversión <2 min
- Entrega de emails a ventas@sumastudio.mx
- Eventos GA4 en Google Analytics
- Anti-spam (honeypot, rate limiting, duplicados)

---

## Implementación Técnica

### 1. Formulario de Lead

**Archivo**: `src/components/showroom/ShowroomLeadForm.tsx`

**Campos**:
- `nombre` (requerido, 2-80 chars)
- `negocio` (requerido, 2-120 chars)
- `email` / `whatsapp` (al menos uno requerido)
- `necesidades` (opcional, max 500 chars)
- `quieroDemoPersonalizada` (checkbox)
- `privacidad` (checkbox requerido, link a `/privacidad`)

**Validación**: Schema Zod `showroomLeadSchema` con refinement para email O whatsapp.

**Anti-spam client-side**:
- Honeypot oculto: `<input name="sitio" type="hidden" />`
- Timestamp: `<input name="inicio" type="hidden" value={Date.now()} />`

**Eventos GA4**:
- `showroom_proposal_requested` - Al renderizar formulario (una vez)
- `generate_lead` - Submit exitoso
- `form_error` - Error de validación

### 2. API Endpoint

**Ruta**: `POST /api/showroom-lead`

**Seguridad**:
- Rate limiting: 5 requests/IP/10 minutos (in-memory)
- Honeypot: campo `sitio` debe estar vacío
- Timing: mínimo 2.5s desde apertura del formulario
- Validación server-side con Zod

**Atribución** (extraída de headers y query params):
- UTM: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Referrer
- Píxeles: `fbclid`, `gclid`, `li_fat_id`

**Idempotencia**:
```typescript
const fingerprint = `${email}|${whatsapp}|${negocio}|${serviceIds}|${planId}`;
const hash = createHash("sha256").update(fingerprint).digest("hex");
const idempotencyKey = `showroom-lead/${hash}`;
```

**Respuestas**:
- `200 { ok: true, delivered: true }` - Éxito, email enviado
- `200 { ok: true }` - Descarte silencioso (anti-spam)
- `422 { error: "validation", fields: {...} }` - Validación fallida
- `429` - Rate limited
- `503 { error: "not_configured" }` - Variables RESEND no configuradas

**Action Log**: Registro estructurado sin PII en logs del servidor.

### 3. Entrega de Email

**Función**: `deliverShowroomLead()` en `src/lib/contact-delivery.ts`

**Destinatario**: `ventas@sumastudio.mx` (variable `CONTACT_TO_EMAIL`)  
**Remitente**: Dominio verificado sumastudio.mx (variable `CONTACT_FROM_EMAIL`)  
**Reply-To**: Email del prospecto (si proporcionó)

**Subject**: `Propuesta desde Showroom: {negocio}`

**Cuerpo HTML** estructurado:
1. **Contacto**: Nombre, negocio, email, whatsapp, necesidades, demo personalizada
2. **Configuración**: Modo, plan, servicios, período, ubicaciones, estimado orientativo, notas
3. **Atribución**: Fuente, medio, campaña, referrer, píxeles

**Idempotencia Resend**: Header `Idempotency-Key: showroom-lead/{hash}` con TTL 24h.

### 4. Eventos GA4

| Evento | Trigger | Metadata |
|--------|---------|----------|
| `showroom_visit` | Al cargar ShowroomBuilder | - |
| `showroom_personalized` | Al cambiar giro/estilo | `industry`, `style` |
| `showroom_demo_viewed` | Al cambiar demo/objetivo | `goal`, `experience` |
| `showroom_demo_started` | Al interactuar con demo | `experience` |
| `showroom_quote_updated` | Al modificar config (1.5s debounce) | `mode`, `plan`, `services_count`, `months` |
| `showroom_proposal_requested` | Al renderizar formulario | `has_config` |
| `generate_lead` | Submit exitoso | `form_name: "showroom_lead"`, `method: "email"` |
| `form_error` | Error de validación | `form_name`, `error_type` |

**Implementación**: Helper `track()` de `src/lib/analytics.ts` con tipos extendidos.

### 5. Persistencia sessionStorage

**Key**: `suma-showroom-config`

**Funciones** (`src/lib/showroom.ts`):
- `saveShowroomConfig(config)` - Guarda configuración
- `loadShowroomConfig()` - Carga configuración
- `clearShowroomConfig()` - Limpia configuración

**Qué se persiste**:
- Giro, nombre del negocio, paleta, demo
- Modo (servicios/paquete), plan, servicios seleccionados
- Período, ubicaciones, setup, estimados, notas

**Qué NO se persiste**: Datos personales del formulario (por privacidad).

**Lazy initialization**:
```typescript
const [serviceIds, setServiceIds] = useState<IndividualServiceId[]>(
  () => loadShowroomConfig()?.serviceIds || []
);
```

---

## Bugs Corregidos

### ✅ #1: "Estudio Aurora (ejemplo)"

**Problema**: Mostraba "Estudio Aurora" sin contexto cuando usuario no ingresaba nombre.

**Solución**: `ShowroomLivePreview.tsx` línea 23-24
```typescript
const userBrandName = brandName.trim().slice(0, 45);
const name = userBrandName || `${business.example} (ejemplo)`;
```

**Test**: ✅ `ShowroomBuilder.test.tsx` actualizado y passing.

### ✅ #2: Extras no reaparecen

**Problema**: Al cambiar de plan, extras podían reaparecer.

**Solución**: `ShowroomBuilder.tsx` limpia `serviceIds` al cambiar plan:
```typescript
onClick={() => { if (planId !== plan.id) setServiceIds([]); setPlanId(plan.id); }}
```

**Test**: ✅ "limpia extras del paquete anterior al cambiar de Flow a Growth"

### ✅ #3: Mensajes WhatsApp largos

**Problema**: Mensajes >1000 chars causaban errores en WhatsApp.

**Solución**: `showroomWhatsAppHref()` en `src/lib/showroom.ts` trunca y resume:
- Lista servicios truncada a 3 items (modo servicios) o 2 (modo paquete)
- Textos cortos: "Referencia:" en lugar de "Precio de referencia desde"
- "(sin IVA ni terceros)" en lugar de "antes de IVA; terceros aparte"
- **Objetivo**: ~800 chars

**Test**: ✅ `showroom.test.ts` actualizado y passing.

### ✅ #4: CRM NO preseleccionado

**Problema**: Demo inicial mostraba "crm" por defecto, dando impresión de preselección.

**Solución**: `ShowroomBuilder.tsx` línea 41
```typescript
// Antes: || "crm"
const [experience, setExperience] = useState<ShowroomExperienceId>(
  () => loadShowroomConfig()?.experience || "chatbot"  // Después
);
```

**Nota**: `serviceIds` (selección real de compra) siempre estuvo vacío `[]` por defecto.

**Test**: ✅ 17/17 passing en ShowroomBuilder.test.tsx después del cambio.

---

## Testing

### Unit Tests: ✅ 230/230 Passing

```bash
npm test

Test Files  36 passed (36)
Tests  230 passed (230)
```

**Archivos relevantes**:
- `ShowroomBuilder.test.tsx` - 17 tests
- `showroom.test.ts` - Helper functions
- `contact-schema.test.ts` - Validación (si existe)

### E2E Tests: Preparados, Pendientes de Ejecución

**Archivos**:
- `e2e/showroom-real-test.spec.ts` - Suite completa
- `playwright.config.ts` - Configuración

**Tests preparados**:
1. Mobile 390px: Flujo completo con medición de tiempo
2. Desktop 1920x1080: Flujo completo
3. Validación de campos requeridos
4. Honeypot anti-spam
5. Eventos GA4 completos

**Estado**: ⚠️ No ejecutados - Preview bloqueado por SSO.

**Comando** (requiere variables de entorno):
```bash
PREVIEW_URL=https://... VERCEL_SHARE_TOKEN=... npx playwright test
```

---

## Limitaciones Conocidas

### 1. Sin Base de Datos

**Decisión arquitectónica**: `docs/ARQUITECTURA.md` línea 15: *"Sin base de datos ni autenticación (no son necesarias en esta etapa)."*

**Impacto**:
- Rate limiting in-memory no sobrevive instancias serverless distintas
- Idempotencia delegada a Resend (24h TTL)
- Si email falla antes de llegar a Resend, lead se pierde
- Solo queda registro en action_log sin PII

**Solución futura** (documentada en `DEVLOG.md`):
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  fingerprint TEXT UNIQUE,
  created_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  resend_id TEXT,
  nombre TEXT,
  negocio TEXT,
  email TEXT,
  whatsapp TEXT,
  showroom_config JSONB,
  attribution JSONB
);
```

### 2. Testing E2E Bloqueado por SSO

**Causa**: Preview deployments con protección SSO habilitada.

**Impacto**:
- Playwright no puede navegar (redirige a login Vercel)
- Fetch al API retorna 401 "Protected deployment"
- Lighthouse no puede analizar

**Solución**: Ejecutar testing en producción post-merge.

---

## Verificación Post-Merge (OBLIGATORIA)

### Checklist

#### 1. Test Manual Mobile 390px
- [ ] Ir a `https://www.sumastudio.mx/showroom?utm_source=test_post_merge`
- [ ] ⏱️ Cronometrar tiempo desde landing hasta submit exitoso (objetivo: <2 min)
- [ ] ✅ Verificar que demo inicial NO es CRM (debe mostrar Chatbot)
- [ ] ✅ Verificar "(ejemplo)" cuando nombre vacío
- [ ] Llenar formulario de prueba y enviar

#### 2. Verificar Email
- [ ] Revisar `ventas@sumastudio.mx`
- [ ] Subject: "Propuesta desde Showroom: {negocio}"
- [ ] Body incluye: contacto, configuración, atribución
- [ ] Atribución incluye `utm_source=test_post_merge`

#### 3. Google Analytics
- [ ] GA4 → Events → Filtrar "showroom"
- [ ] Confirmar eventos: `showroom_visit`, `showroom_proposal_requested`, `generate_lead`

#### 4. Lighthouse Mobile
```bash
lighthouse https://www.sumastudio.mx/showroom \
  --only-categories=performance,accessibility \
  --form-factor=mobile
```

#### 5. Tests Anti-Spam
- [ ] **Honeypot**: Llenar campo oculto `sitio`, confirmar descarte silencioso
- [ ] **Rate limiting**: 6 requests rápidos, confirmar 429 en el 6to
- [ ] **Duplicate**: Mismo lead 2 veces, confirmar idempotencia Resend

---

## Variables de Entorno

### Producción (Configuradas)
- ✅ `RESEND_API_KEY` - API key de Resend
- ✅ `CONTACT_TO_EMAIL` - `ventas@sumastudio.mx`
- ✅ `CONTACT_FROM_EMAIL` - Dominio verificado sumastudio.mx

### Preview
- ❌ Variables RESEND no configuradas (por seguridad, correcto)

---

## Archivos Modificados

### Nuevos
- `src/components/showroom/ShowroomLeadForm.tsx`
- `src/app/api/showroom-lead/route.ts`
- `src/lib/showroom.ts` (funciones sessionStorage)
- `e2e/showroom-real-test.spec.ts`
- `playwright.config.ts`

### Modificados
- `src/components/showroom/ShowroomBuilder.tsx` (integración formulario, CRM fix)
- `src/components/showroom/ShowroomLivePreview.tsx` (ejemplo fix)
- `src/lib/contact-schema.ts` (showroomLeadSchema)
- `src/lib/contact-delivery.ts` (deliverShowroomLead)
- `src/lib/analytics.ts` (nuevos eventos)
- `src/lib/action-log.ts` (showroom_lead.submit)
- Tests actualizados

### Documentación
- `CHANGELOG.md`
- `DEVLOG.md`
- Este reporte

---

## Conclusión

**Implementación**: ✅ Completa y verificada por código + unit tests  
**Bugs**: ✅ Todos corregidos (4/4)  
**Testing E2E**: ⚠️ Pendiente de verificación post-merge  
**Precios**: ✅ Sin cambios

**Próximo paso**: Merge con verificación obligatoria en producción según checklist.
