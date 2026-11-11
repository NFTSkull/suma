# Reporte Final: Optimización Comercial Showroom SUMA STUDIO

**Fecha**: 11 de noviembre de 2026  
**Branch**: `cursor/showroom-lead-capture-conversion-e5cd`  
**PR**: #30 ([https://github.com/NFTSkull/suma/pull/30](https://github.com/NFTSkull/suma/pull/30))  
**Preview**: https://suma-ituin4iwk-viozs-projects.vercel.app/showroom

---

## Resumen Ejecutivo

Se implementó la captura de leads comerciales en el Showroom con el objetivo de que un visitante mobile desde Instagram pueda convertirse en lead comercial registrado en menos de 2 minutos.

### ✅ Completado

1. **Formulario de captura de leads** integrado en `/showroom` con validación robusta
2. **Sistema de entrega automatizada** a `ventas@sumastudio.mx` vía Resend
3. **Eventos GA4** completos para medir el embudo de conversión
4. **Bugs de auditoría corregidos**:
   - ✅ "Estudio Aurora" ahora muestra claramente "(ejemplo)"
   - ✅ Extras no reaparecen al cambiar de plan
   - ✅ Mensajes WhatsApp limitados a ~800 caracteres
5. **230 unit tests** passing
6. **Documentación** completa en CHANGELOG, DEVLOG y este reporte

### ⚠️ Limitaciones Documentadas

1. **No hay base de datos** (decisión arquitectónica explícita en docs/ARQUITECTURA.md)
   - Rate limiting in-memory no sobrevive instancias serverless
   - Idempotencia delegada a Resend
   - Si el email falla, el lead se pierde (solo queda action_log sin PII)
   - **Solución futura propuesta**: tabla `leads` en Postgres/Supabase con RLS

2. **Testing E2E bloqueado en preview** por protección SSO de Vercel
   - Variables RESEND no disponibles en preview por seguridad
   - Tests Playwright preparados pero requieren ambiente sin SSO
   - **Recomendación**: Ejecutar tests E2E en producción post-merge o desactivar SSO temporalmente

3. **Precios y paquetes no modificados** (verificado con `git diff`)

---

## Implementación Técnica

### 1. Formulario de Lead (`ShowroomLeadForm.tsx`)

**Ubicación**: Integrado al final de `ShowroomBuilder`, después del resumen de cotización.

**Campos**:
- `nombre` (requerido, 2-80 chars)
- `negocio` (requerido, 2-120 chars)
- `email` (opcional, pero email O whatsapp requerido)
- `whatsapp` (opcional, 10-15 dígitos)
- `necesidades` (opcional, max 500 chars)
- `quieroDemoPersonalizada` (checkbox opcional)
- `privacidad` (checkbox requerido, link a `/privacidad`)
- `sitio` (honeypot oculto)

**Validación**: Zod schema `showroomLeadSchema` con refinement para requerir al menos email O whatsapp.

**Estado del formulario**:
```typescript
IDLE → SUBMITTING → SUCCESS | ERROR
```

**Eventos GA4**:
- `showroom_proposal_requested` (al montar, una vez)
- `generate_lead` (submit exitoso)
- `form_error` (validación fallida)

### 2. API Endpoint (`/api/showroom-lead/route.ts`)

**Método**: POST  
**Rate Limiting**: 5 requests por IP en 10 minutos (in-memory, limitación conocida)  
**Anti-spam**:
- Honeypot: campo `sitio` debe estar vacío
- Timing: debe pasar al menos 2.5s desde `inicio` timestamp

**Flujo**:
1. Validar JSON y estructura con Zod
2. Revisar honeypot y timing
3. Extraer atribución de headers y search params:
   - UTM params (`utm_source`, `utm_medium`, `utm_campaign`, etc.)
   - `referrer`
   - Píxeles: `fbclid`, `gclid`, `li_fat_id`
4. Entregar email vía `deliverShowroomLead`
5. Registrar en action_log (sin PII)
6. Retornar `{ ok: true, delivered: true }` o error

**Respuestas**:
- `200 { ok: true, delivered: true }` - Éxito, Resend aceptó el email
- `200 { ok: true }` - Descartado por anti-spam (silencioso)
- `400` - JSON inválido
- `422` - Validación fallida (con `fields: {...}`)
- `429` - Rate limited
- `502` - Resend falló
- `503` - Variables de entorno no configuradas

### 3. Entrega de Email (`deliverShowroomLead`)

**Destinatario**: `ventas@sumastudio.mx` (desde `CONTACT_TO_EMAIL`)  
**Remitente**: `CONTACT_FROM_EMAIL` (dominio verificado sumastudio.mx)  
**Reply-To**: Email del prospecto (si proporcionó)

**Subject**: `Propuesta desde Showroom: {negocio}`

**Cuerpo HTML** con tres secciones:

1. **Datos de Contacto**
   - Nombre
   - Negocio
   - Email
   - WhatsApp
   - Necesidades
   - Solicita demo personalizada (sí/no)

2. **Configuración del Showroom**
   - Modo: Servicios individuales o Paquete + extras
   - Plan base (si aplica)
   - Servicios/extras seleccionados
   - Período de evaluación
   - Número de ubicaciones
   - **Estimado orientativo**: setup + mensual (claramente etiquetado como estimado)
   - Notas adicionales

3. **Atribución**
   - Fuente, medio, campaña (UTM)
   - Referrer
   - Píxeles de conversión

**Idempotencia**: Clave SHA256 del fingerprint (email, whatsapp, negocio, serviceIds, planId) con prefijo `showroom-lead/` y TTL 24h en Resend.

### 4. Eventos GA4

#### Nuevo en esta PR:

| Evento | Cuándo se dispara | Metadata |
|--------|-------------------|----------|
| `showroom_visit` | Al montar `ShowroomBuilder` | - |
| `showroom_demo_viewed` | Al cambiar demo/objetivo | `goal`, `experience` |
| `showroom_quote_updated` | Al modificar config (debounced 1.5s) | `mode`, `plan`, `services_count`, `months` |
| `showroom_proposal_requested` | Al renderizar formulario (una vez) | `has_config` |
| `generate_lead` | Submit exitoso | `form_name: "showroom_lead"`, `method: "email"` |
| `form_error` | Error de validación | `form_name`, `error_type` |

**Implementación**: Usando helper `track()` de `src/lib/analytics.ts`, con tipos extendidos (`AnalyticsEvent`).

#### Existentes (previos):
- `showroom_personalized` - Al cambiar giro o estilo
- `showroom_demo_started` - Al interactuar con demo

### 5. Persistencia de Configuración

**Implementación**: `sessionStorage` con key `suma-showroom-config`.

**Funciones**:
- `saveShowroomConfig(config)` - Guarda en sessionStorage
- `loadShowroomConfig()` - Carga desde sessionStorage
- `clearShowroomConfig()` - Limpia sessionStorage

**Qué se persiste**:
- Giro, nombre del negocio, paleta, demo
- Modo (servicios vs paquete)
- Plan y servicios seleccionados
- Período, ubicaciones, setup, estimados
- Notas

**Qué NO se persiste**: Datos personales del formulario de lead (nombre, email, etc.) para privacidad.

**Lazy initialization** en `useState` para evitar hydration issues:
```typescript
const [serviceIds, setServiceIds] = useState<IndividualServiceId[]>(
  () => loadShowroomConfig()?.serviceIds || []
);
```

### 6. Bugs Corregidos

#### a) "Estudio Aurora (ejemplo)"

**Antes**: Cuando el usuario no ingresaba nombre, la demo mostraba "Estudio Aurora" sin contexto.

**Después**: Muestra "Estudio Aurora (ejemplo)" para dejar claro que es un nombre de ejemplo.

**Código** (`ShowroomLivePreview.tsx`):
```typescript
const userBrandName = brandName.trim().slice(0, 45);
const name = userBrandName || `${business.example} (ejemplo)`;
```

**Test actualizado**: `src/components/showroom/ShowroomBuilder.test.tsx` línea 16.

#### b) Extras no reaparecen

**Verificado**: Al cambiar de modo (servicios ↔ paquete) o al cambiar de plan (Flow → Growth, etc.), los extras se limpian y no reaparecen.

**Código** (`ShowroomBuilder.tsx`):
```typescript
onClick={() => { if (planId !== plan.id) setServiceIds([]); setPlanId(plan.id); }}
```

**Test existente**: `src/components/showroom/ShowroomBuilder.test.tsx` línea 104: *"limpia extras del paquete anterior al cambiar de Flow a Growth"*.

#### c) Mensajes WhatsApp largos

**Problema**: Mensajes > 1000 chars causaban errores en algunos clientes WhatsApp.

**Solución**: Función `showroomWhatsAppHref` trunca y resume:
- Lista de servicios truncada a 3 items (modo servicios) o 2 items (modo paquete)
- Textos cortos: "Referencia:" en lugar de "Precio de referencia desde"
- "(sin IVA ni terceros)" en lugar de "antes de IVA; terceros aparte"
- **Objetivo**: ~800 chars, margen bajo el límite ~1000 chars

**Test actualizado**: `src/lib/showroom.test.ts` línea 54.

### 7. Tests

#### Unit Tests (Vitest)

**Total**: 230 tests passing

**Archivos actualizados**:
- `ShowroomBuilder.test.tsx`:
  - Test "Estudio Aurora (ejemplo)"
  - Tests analítica GA4 ajustados para nuevos eventos (`showroom_visit`, `showroom_proposal_requested`)
  - Filtros específicos para eventos de interés

**Comando**:
```bash
npm test
```

#### Integration Tests (Playwright)

**Archivos**:
- `e2e/showroom-conversion.spec.ts`
- `playwright.config.ts`

**Tests preparados**:
1. **Mobile 390px**:
   - Flujo completo desde landing hasta submit (<2 min)
   - Validación de campos requeridos
   - Honeypot anti-spam
2. **Desktop 1920x1080**:
   - Flujo completo con paquetes
3. **Analítica GA4**:
   - Verificación de todos los eventos

**Estado**: ⚠️ **No ejecutados** debido a protección SSO en preview deployments de Vercel.

**Dependencias**:
```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

**Comando** (requiere ambiente sin SSO o variables de entorno configuradas):
```bash
PREVIEW_URL=https://... npx playwright test
```

---

## Verificación de Código

### ✅ Precios y Paquetes No Modificados

Ejecutado:
```bash
git diff main...HEAD -- src/content/pricing.ts
```

**Resultado**: Sin cambios. Los precios y contenido de paquetes permanecen intactos.

### ✅ Linting y Typecheck

```bash
npm run lint    # ✅ Sin errores
npm run typecheck  # ✅ Sin errores
npm test        # ✅ 230 tests passing
```

### ✅ Commits

1. `6233ab3` - feat: Captura de leads comerciales desde Showroom (implementación inicial)
2. `54afc1b` - fix: Aclarar nombre de ejemplo y actualizar tests
3. `588f39e` - docs: Documentar limitaciones de persistencia sin base de datos
4. `f40fb88` - test: Añadir tests E2E con Playwright para Showroom

---

## Variables de Entorno Requeridas

### Producción (ya configuradas):
- `RESEND_API_KEY` - API key de Resend (sensitive)
- `CONTACT_TO_EMAIL` - Buzón que recibe leads (ventas@sumastudio.mx)
- `CONTACT_FROM_EMAIL` - Remitente verificado en Resend (dominio sumastudio.mx)

### Preview/Testing (NO configuradas):
⚠️ Las variables de producción no están disponibles en preview deployments por seguridad.

**Para testing completo en preview**:
1. Añadir variables RESEND a environment "Preview" en Vercel Dashboard
2. O esperar a merge para probar en producción

---

## Limitaciones Conocidas y Soluciones Futuras

### 1. Sin Base de Datos

**Decisión arquitectónica actual**: `docs/ARQUITECTURA.md` línea 15: *"Sin base de datos ni autenticación (no son necesarias en esta etapa)."*

**Limitaciones**:
- **Rate limiting in-memory**: No sobrevive instancias serverless diferentes. Un atacante podría eludir cambiando de región o esperando cold starts.
- **Idempotencia delegada a Resend**: Clave SHA256 con 24h TTL. Si el email falla antes de llegar a Resend, el lead se pierde.
- **Sin deduplicación server-side persistente**: Leads duplicados legítimos (distinto email/whatsapp) no se detectan.
- **Riesgo de pérdida**: Si Resend falla, solo queda entrada en action_log sin PII.

**Solución futura propuesta** (documentada en `DEVLOG.md`):

```sql
-- Tabla leads con RLS
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fingerprint TEXT UNIQUE NOT NULL,  -- SHA256 para dedupe
  nombre TEXT NOT NULL,
  negocio TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  necesidades TEXT,
  quiere_demo BOOLEAN DEFAULT FALSE,
  showroom_config JSONB,
  attribution JSONB,
  delivered_at TIMESTAMPTZ,
  resend_id TEXT
);

-- Índices
CREATE INDEX idx_leads_fingerprint ON leads(fingerprint);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

**Migración aditiva** (no afecta código existente):
1. Crear tabla `leads`
2. Implementar `storeLead()` en nuevo archivo `src/lib/lead-storage.ts`
3. Llamar desde `/api/showroom-lead` después de enviar email
4. Mantener compatibilidad con email como canal primario

### 2. Testing E2E Bloqueado por SSO

**Problema**: Preview deployments tienen protección SSO habilitada (`ssoProtection.deploymentType: "all_except_custom_domains"`).

**Impacto**:
- Playwright no puede acceder al preview sin autenticación
- Share tokens de Vercel (`_vercel_share`) redirigen a login
- Herramienta `web_fetch_vercel_url` de Vercel MCP funciona, pero Playwright no

**Soluciones**:
1. **Desactivar SSO temporalmente** en preview para ejecutar tests
2. **Ejecutar tests contra producción** post-merge con datos de prueba
3. **Usar Vercel CLI** con autenticación para bypassear SSO
4. **Configurar ambiente de staging** sin SSO específicamente para testing

**Recomendación**: Opción 2 (producción post-merge) es la más segura y realista.

---

## Medición del Objetivo: <2 Minutos de Conversión

### Objetivo Original

> "Un visitante mobile (390px) desde Instagram puede convertirse en lead comercial registrado en menos de 2 minutos."

### Flujo Esperado

1. **Landing** `/showroom?utm_source=instagram` - 0:00
2. **Personalizar** nombre del negocio - 0:15
3. **Seleccionar** servicio o paquete - 0:30
4. **Revisar** demo personalizada - 0:45
5. **Scroll** a formulario de lead - 1:00
6. **Llenar** formulario (nombre, negocio, email/whatsapp, privacidad) - 1:30
7. **Submit** y confirmación - 1:45

**Tiempo estimado**: ~1:45 (bajo objetivo de 2:00)

### Verificación

**Unit Tests**: ✅ Validación de componentes y lógica pasa en <1s cada uno

**E2E Tests**: ⚠️ Preparados pero no ejecutados (bloqueados por SSO)

**Verificación manual**:
- Página carga correctamente (verificado con Vercel `web_fetch_vercel_url`)
- Contenido presente: "Personaliza", "Quiero una propuesta", formulario
- Eventos GA4 implementados y testeados unitariamente

**Recomendación**: Ejecutar Playwright tests en producción post-merge para medir tiempo real de conversión.

---

## Próximos Pasos

### Inmediatos (Pre-Merge)

1. ✅ **Code review** del PR #30
2. ⚠️ **Decidir sobre testing E2E**:
   - Opción A: Desactivar SSO temporalmente y ejecutar Playwright
   - Opción B: Merge sin E2E tests, probar en producción
   - Opción C: Configurar ambiente de staging sin SSO
3. ✅ **Verificar documentación** (CHANGELOG, DEVLOG, este reporte)

### Post-Merge

1. **Monitorear emails** en `ventas@sumastudio.mx`:
   - Verificar formato y contenido
   - Confirmar idempotencia (sin duplicados)
   - Revisar atribución y configuración
2. **Verificar eventos GA4** en Google Analytics:
   - `showroom_visit`
   - `showroom_proposal_requested`
   - `generate_lead`
   - Tasas de conversión por fuente (Instagram, etc.)
3. **Ejecutar tests E2E** en producción con datos de prueba
4. **Medir tiempo real** de conversión mobile
5. **Evaluar implementación de base de datos** según volumen de leads

### Futuro (Según Necesidad)

1. **Base de datos**:
   - Añadir Postgres/Supabase cuando se requiera persistencia robusta
   - Implementar tabla `leads` con RLS
   - Migración aditiva sin afectar código existente
2. **Dashboard interno** para equipo de ventas:
   - Ver leads capturados
   - Filtrar por fuente, fecha, configuración
   - Marcar como contactado/convertido
3. **Notificaciones adicionales**:
   - Slack webhook para leads urgentes
   - SMS para leads de alto valor
4. **A/B Testing**:
   - Copy del CTA
   - Posición del formulario
   - Campos opcionales vs requeridos

---

## Conclusión

La implementación de captura de leads en el Showroom está **completa y lista para producción**, con las siguientes salvedades:

### ✅ Completado
- Formulario de lead con validación robusta
- API endpoint con anti-spam y rate limiting
- Entrega automatizada a ventas@sumastudio.mx
- Eventos GA4 para medir embudo completo
- Bugs de auditoría corregidos
- 230 unit tests passing
- Documentación completa

### ⚠️ Limitaciones Conocidas y Documentadas
- Sin base de datos (decisión arquitectónica, solución futura propuesta)
- Testing E2E bloqueado por SSO en preview (tests preparados, ejecutar post-merge)
- Variables RESEND no disponibles en preview (solo producción)

### ✅ Próximo Paso Recomendado
**Merge a producción** y ejecutar verificación completa (emails, GA4, tests E2E) con datos reales.

---

**Preparado por**: Cursor Agent  
**PR**: [#30](https://github.com/NFTSkull/suma/pull/30)  
**Branch**: `cursor/showroom-lead-capture-conversion-e5cd`
