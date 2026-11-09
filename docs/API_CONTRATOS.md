# API_CONTRATOS

El sitio expone **un único endpoint**. No se implementa ningún otro sin actualizar este documento.

## POST `/api/contacto`

Recibe una solicitud de contacto y la entrega al proveedor configurado.

### Request (`application/json`)
| Campo | Tipo | Reglas |
|---|---|---|
| `nombre` | string | 2–80 caracteres, recortado |
| `negocio` | string | 2–120 caracteres |
| `tipoNegocio` | enum | `yoga-pilates` · `spa` · `fitness` · `marca` · `retiros` · `profesional` · `otro` |
| `email` | string | correo válido, máx. 160 |
| `whatsapp` | string | 10–15 dígitos tras limpiar espacios, guiones, paréntesis y `+` |
| `servicios` | enum[] | 1–5 de `chatbots` · `crm` · `aplicaciones-moviles` · `paginas-web` · `publicidad-digital` · `no-se` |
| `mensaje` | string? | opcional, máx. 1500 |
| `privacidad` | `true` | aceptación del aviso de privacidad (obligatoria) |
| `contexto` | object? | opcional, del selector: `{ negocio?: string, reto?: string }` (slugs, máx. 40) |
| `sitio` | string | honeypot; debe llegar vacío |
| `inicio` | number | timestamp (ms) de apertura del formulario |

### Respuestas
| Código | Cuerpo | Significado |
|---|---|---|
| 200 | `{ ok: true, delivered: true }` | **Aceptado por el proveedor** (webhook 2xx, o Resend 2xx con `id` del correo). Es la única respuesta que el formulario muestra como éxito y que genera `generate_lead`. "Aceptado por Resend" no equivale a "entregado en el buzón": la entrega final se verifica en el panel de Resend con el `id` registrado en `action_log`. |
| 200 | `{ ok: true }` | Descartado en silencio por anti-spam (honeypot o llenado en < 2.5 s). No se entrega nada; el formulario lo muestra como "No pudimos confirmar el envío". |
| 400 | `{ ok: false, error: "invalid_json" }` | Cuerpo no es JSON |
| 422 | `{ ok: false, error: "validation", fields: Record<campo, mensaje> }` | Validación Zod fallida |
| 429 | `{ ok: false, error: "rate_limited" }` | Más de 5 envíos por IP en 10 minutos |
| 502 | `{ ok: false, error: "delivery_failed" }` | El proveedor respondió con error |
| 503 | `{ ok: false, error: "not_configured" }` | No hay proveedor utilizable: faltan variables o son inválidas (validadas con Zod; para Resend, `CONTACT_FROM_EMAIL` es obligatorio y no puede ser `@resend.dev`) |

### Proveedores
- `CONTACT_WEBHOOK_URL` (https) tiene prioridad.
- Resend: `RESEND_API_KEY` (`re_…`), `CONTACT_TO_EMAIL` (buzón que recibe los prospectos) y `CONTACT_FROM_EMAIL` (remitente de un dominio verificado en Resend, p. ej. `SUMA STUDIO <contacto@sumastudio.mx>`). Cada envío lleva `reply_to` con el correo del prospecto e `Idempotency-Key: contact-lead/<sha256>` para no duplicar correos ante reintentos.

### Registro (action_log)
Cada solicitud escribe un evento estructurado `action_log` en los logs del servidor con `action`, `outcome`, `provider` y servicios elegidos; además `reason` (nombre del problema de configuración en `not_configured`), `providerStatus` (código HTTP del proveedor en `delivery_failed`) y `providerId` (id del correo en Resend en `delivered`). **No se registran datos personales.** No hay base de datos en esta etapa, por lo que no aplica RLS (ver DEVLOG).
