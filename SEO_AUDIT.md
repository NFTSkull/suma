# SUMA STUDIO — Auditoría e implementación SEO 360

Rama: `seo/auditoria-360` · Fecha: 2026-11-09 · Dominio canónico: `https://www.sumastudio.mx`

Este documento separa lo que se **encontró**, lo que se **corrigió** en esta rama, lo que queda **pendiente**, los **riesgos** y las **pruebas realmente ejecutadas**. No contiene promesas de posicionamiento: Google decide qué indexar, cómo mostrarlo y en qué posición.

---

## 0. Recepción de prospectos (formulario)

**Resuelto en producción (2026-11-09).** En la auditoría inicial `POST /api/contacto` respondía `503 not_configured`, porque no había proveedor. Después se configuró Resend con una cuenta propia de SUMA:
- **Vercel Production:** `RESEND_API_KEY` (sensible), `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL` (remitente en `sumastudio.mx`).
- **DNS:** DKIM `resend._domainkey`, SPF/MX en `send.` y DMARC `p=none` publicados.
- **Prueba real:** el equipo verificó una solicitud recibida en Gmail.

Esta rama endurece el flujo sin cambiar esa configuración:
- **Éxito confirmado:** la API responde `{ ok: true, delivered: true }` solo si Resend devuelve el `id` del correo. El descarte anti-spam responde `{ ok: true }` sin `delivered`, y el formulario no lo muestra como éxito ni lo cuenta como lead.
- **Configuración validada** con Zod. Ya no se usa en silencio `onboarding@resend.dev`; se acepta un remitente con o sin nombre y uno o varios destinatarios separados por comas.
- **Idempotencia:** `Idempotency-Key` evita correos duplicados.
- **Registro:** `action_log` guarda el `id` del correo de Resend, sin datos personales.

---

## 1. Rastreo e indexación

### Encontrado (producción, antes de esta rama)

| # | Hallazgo | Severidad |
|---|---|---|
| C1 | Las páginas internas **no tenían `og:image` ni `twitter:image`**: solo la home las tenía. Al compartir un servicio en WhatsApp/LinkedIn no aparecía imagen. | Alta (social) |
| C2 | `suma-ashy.vercel.app` (alias de producción) servía todo el sitio con `200` y **sin `noindex`**, lo que crea una copia duplicada del dominio. | Media |
| C3 | El layout raíz declaraba `canonical: "/"` y `og:url: "/"`; cualquier página sin canonical propia **heredaría la canonical de la home**. | Media (latente) |
| C4 | `/aviso-de-privacidad` es un **borrador con marcadores "[Pendiente: …]"** y estaba indexable y en el sitemap. | Media |
| C5 | Sin `NEXT_PUBLIC_SITE_URL`, el sitio usaba `http://localhost:3000` en silencio: los previews de Vercel (sin esa variable) generaban canonical, Open Graph y sitemap a `localhost`. | Media |
| C6 | No existía ninguna validación automática contra regresiones (localhost, canonical, sitemap). | Media |
| C7 | Sitemap con `changefreq`/`priority` (Google los ignora). No había `lastmod` ficticio (correcto). | Baja |
| OK | `sumastudio.mx` → `308` → `https://www.sumastudio.mx` (también desde `http://`, en dos saltos). Robots.txt correcto con `Disallow: /api/` y el sitemap absoluto. Sitemap con 19 URLs canónicas https. Sin `localhost` en el HTML de producción. Los previews `*-git-*.vercel.app` tienen SSO de Vercel y `x-robots-tag: noindex`. | — |

### Corregido

- **URL del sitio** (`src/lib/site-url.ts`):
  - **Producción en Vercel:** exige `NEXT_PUBLIC_SITE_URL` en https y sin localhost; si falta o es inválida, **el build falla** (lo verifiqué con `VERCEL_ENV=production next build`).
  - **Previews:** usan su propia URL (`VERCEL_URL`) y se marcan como no indexables.
  - **Fuera de Vercel:** la variable configurada o localhost.
  - **Sin cambios en Vercel:** la configuración de `NEXT_PUBLIC_SITE_URL` en producción se respeta tal cual.
- **Previews no indexables:** robots.txt con `Disallow: /`, sitemap vacío y `<meta name="robots" content="noindex, nofollow">` en todas las páginas.
- **Alias `*.vercel.app`:** cabecera `X-Robots-Tag: noindex` mediante `headers()` en `next.config.ts`. El dominio propio no se ve afectado.
- **Canonical, `og:url`, `og:image` y `twitter:image`** son ahora absolutas en todas las páginas (`buildMetadata`). Las internas usan la imagen OG por defecto (`/opengraph-image`, 1200×630).
- **El layout raíz ya no declara canonical ni `og:url`:** cada página declara los suyos, también la home.
- **`/aviso-de-privacidad`:** queda en `noindex, follow` y fuera del sitemap mientras sea borrador (`noindexRoutes` en `src/content/navigation.ts`). Para indexarlo cuando esté completo, basta con quitarlo de esa lista.
- **Sitemap:** solo URLs canónicas indexables, sin `changefreq`, `priority` ni `lastmod`.
- **Validación posterior al build** (`scripts/seo-check.mjs`, se ejecuta como `postbuild`, es decir, en cada despliegue de Vercel). **Falla el build** ante:
  - URLs a `localhost` cuando hay dominio público;
  - una canonical ausente, duplicada, relativa o distinta de la URL de la página;
  - un `og:url` o `og:image` inválido;
  - más de un `<h1>` o más de un bloque JSON-LD;
  - JSON-LD que no parsea, sin `Organization`/`WebSite`/`WebPage` o con `WebPage.url` distinta de la canonical;
  - FAQ en JSON-LD que no está visible en la página;
  - un sitemap con URLs no canónicas o `noindex`, o al que le falte alguna página indexable;
  - un robots.txt sin el sitemap correcto o que bloquee el sitio.

  Las longitudes de `title` y `description` solo generan avisos. En previews verifica que robots bloquee todo y que el sitemap esté vacío.

### Verificaciones ejecutadas

- **Producción simulada** (`NEXT_PUBLIC_SITE_URL=https://www.sumastudio.mx npm run build`): `seo-check ✓ 19 páginas, 18 URLs en sitemap`.
- **Preview simulado** (`VERCEL_ENV=preview VERCEL_URL=… npm run build`): robots `Disallow: /`, sitemap vacío, `noindex, nofollow` y canonical a la URL del preview.
- **Producción sin URL o con `http://localhost:3000`:** el build falla con un mensaje claro.
- **Prueba negativa del validador** (`NEXT_PUBLIC_SITE_URL=https://example.com`): detecta todas las canonical, `og:url` y `og:image` incorrectas.

---

## 2. SEO on-page

Intención de búsqueda principal: dueños y gerentes de estudios de yoga y pilates, spas, fitness boutique y marcas wellness en México (Monterrey como mercado local) que buscan resolver un problema operativo o comercial (*chatbot WhatsApp spa*, *CRM para estudio de pilates*, *páginas web para spas en Monterrey*…). El contenido existente ya responde bien a esa intención: problema → capacidades → demostración → beneficios → ejemplos por industria → servicios relacionados → FAQ → CTA. **No reescribí el contenido ni creé páginas nuevas.**

### Encontrado

- **H1 de servicios e industrias:** eran creativos ("Más claridad para ti. Más orden para tu negocio.") pero no nombraban el servicio. El nombre ("Sistemas CRM personalizados") era un `<p>` decorativo encima.
- **Títulos de 7 páginas:** superaban unos 70 caracteres con " · SUMA STUDIO" (hasta 82) y Google los recortaría.
- **Descripciones:** la de `/servicios/chatbots` tenía 180 caracteres.
- **Textos de enlace genéricos:** "Ver industria" y "Conocer el servicio".
- **Imágenes:** las fotos de industrias tienen ALT descriptivo; las decorativas (mockups) usan `alt=""` y `aria-hidden`, lo cual es correcto. No hay imágenes sin ALT.

### Corregido

- **H1:** el nombre del servicio o sector forma parte del `<h1>` (por ejemplo, "Sistemas CRM personalizados — Más claridad para ti…"), con el **mismo aspecto visual**. Lo medí en el navegador: posiciones idénticas al píxel a producción en `/servicios/crm` y `/industrias/spas`.
- **Títulos** (máximo 56 caracteres + marca):

  | Página | Antes | Ahora |
  |---|---|---|
  | Home | SUMA STUDIO · Tecnología y experiencias digitales para negocios de bienestar | SUMA STUDIO · Tecnología para negocios de bienestar en Monterrey |
  | Chatbots | Chatbots para negocios de bienestar y estudios de pilates | Chatbots para spas y estudios de yoga y pilates |
  | Apps | Aplicaciones móviles para centros wellness y estudios | Apps móviles para estudios, spas y fitness boutique |
  | Publicidad | Publicidad digital para estudios de pilates y negocios wellness | Publicidad digital para negocios wellness |
  | Yoga y pilates | Tecnología para estudios de yoga y pilates: reservas, CRM y chatbots | Software y web para estudios de yoga y pilates |
  | Fitness | Apps y CRM para fitness boutique y estudios de entrenamiento | Apps y CRM para fitness boutique en México |
  | Marcas | Ecommerce y marketing digital para marcas wellness en México | Ecommerce y marketing para marcas wellness |
  | Retiros | Páginas web e inscripciones para retiros y experiencias wellness | Páginas web para retiros y experiencias wellness |
  | Profesionales | Páginas web y agenda para terapeutas y profesionales del bienestar | Web y agenda para terapeutas y coaches de bienestar |
  | Servicios | Servicios: chatbots, CRM, apps, páginas web y publicidad digital | Servicios digitales para negocios wellness |
  | Industrias | Industrias: yoga, pilates, spas, fitness, marcas wellness y retiros | Tecnología para yoga, spas, fitness y marcas wellness |
  | Cómo trabajamos | Cómo trabajamos: de una idea a una experiencia que funciona | Cómo trabajamos: proceso de proyecto digital |
  | El estudio | El estudio: creatividad que conecta, tecnología que suma | El estudio: agencia creativa y tecnológica en Monterrey |

- **Descripciones:** todas tienen entre 70 y 160 caracteres. Monterrey o México aparecen donde es natural, sin repetir palabras clave.
- **Pruebas:** la de contenido exige títulos de 56 caracteres como máximo, descripciones de 70 a 160 caracteres y títulos únicos en servicios e industrias.

### Pendiente (contenido, decisión de SUMA)

Ver la sección 10, Recomendaciones de contenido.

---

## 3. Datos estructurados (JSON-LD)

### Encontrado

- **Tipo de organización:** `ProfessionalService` (un subtipo de `LocalBusiness`), con dirección parcial y sin un local que se pueda visitar. No encaja con SUMA, que no tiene dirección pública.
- **Bloques sueltos:** cada página emitía 2 a 4 bloques independientes (organización en el layout, migas, `Service` y FAQ) sin `@id` que los conectara.
- **Sin `WebSite` ni `WebPage`:** ninguna página los declaraba y no había logo.

### Corregido

- **Un único `@graph` por página** (`pageGraph` en `src/lib/seo.ts`), con `@id` estables:
  - `…/#organization` → **Organization** (no LocalBusiness ni ProfessionalService):
    - **Incluye:** nombre, `alternateName`, URL, descripción, `slogan`, logo en PNG (`/brand/isotipo-512.png`, rasterizado del isotipo oficial), ciudad y estado (Monterrey, Nuevo León; "Desde Monterrey" es un dato confirmado en `docs/PRODUCTO.md`), `areaServed: México` y `knowsAbout`.
    - **Excluye:** calle, teléfono, reseñas, calificaciones, precios, fundadores y fecha de fundación.
    - **Condicionales:** `sameAs` y `contactPoint` solo aparecen si se configuran en `site.ts`; hoy no hay ninguno.
  - `…/#website` → **WebSite** (`publisher` → Organization).
  - `<url>#webpage` → **WebPage** / **CollectionPage** (índices) / **AboutPage** (`/nosotros`) / **ContactPage** (`/contacto`), con `isPartOf`, `breadcrumb`, `mainEntity`, `about` y `hasPart`.
  - `<url>#breadcrumb` → **BreadcrumbList** en las páginas internas (antes lo emitía el componente de migas por separado).
  - `/servicios/<slug>#service` → **Service** (los cinco), con `provider` → Organization y `areaServed: México`. Sin `offers` ni precios.
  - `<url>#faq` → **FAQPage** solo donde las preguntas están visibles (acordeón) en servicios, industrias y `/como-trabajamos`. El validador posterior al build comprueba que cada pregunta aparezca en el HTML.
  - **Listas en los índices:** `ItemList` en `/servicios` y `/industrias`.
- **Pruebas unitarias** (`src/lib/seo.test.ts`): ausencia de datos inventados, `@id` estables, enlaces entre nodos y FAQ condicional.

### Validación ejecutada

- **Schema Markup Validator** (validator.schema.org), enviando el HTML del build de producción: **0 errores y 0 avisos en las 18 páginas** (home, 5 servicios, 7 industrias con su índice, soluciones, nosotros, contacto, cómo trabajamos y aviso). La primera pasada encontró un aviso (`availableLanguage` no es una propiedad válida de `Service`), que ya está corregido.
- **Rich Results Test de Google: no ejecutado.** Necesita una URL pública y los previews de Vercel están protegidos por SSO. Hay que correrlo sobre producción después del merge.
- **Expectativas realistas:** desde 2023 Google solo muestra resultados enriquecidos de FAQ para sitios gubernamentales y de salud, y `Service`/`Organization` no generan resultados enriquecidos propios. El beneficio es que Google entienda mejor la entidad; no se promete ningún resultado visual.

---

## 4. Medición de conversiones (GTM + GA4)

### Encontrado

- **Carga de GTM:** el contenedor `GTM-W2CSD45N` se cargaba una vez (con `next/script` `afterInteractive` y `<noscript>` al inicio de `<body>`) y sin consentimiento. Ahora solo se carga tras aceptar estadísticas (sección 5). No hay otra instalación de GA4 en el código.
- **Eventos:** no existía ningún evento de conversión.
- **Riesgo de leads falsos:** la API responde `200` también cuando descarta spam en silencio, así que un `generate_lead` basado solo en el 200 contaría spam como prospecto.

### Corregido

- **Capa de eventos tipada** (`src/lib/analytics.ts`). Los eventos solo llevan identificadores de catálogo:

| Evento | Cuándo | Parámetros |
|---|---|---|
| `generate_lead` | La API respondió `200 { ok: true, delivered: true }`: el proveedor confirmó la entrega (Resend devolvió el `id` del correo o el webhook respondió 2xx). Un descarte anti-spam responde sin `delivered` y no cuenta. Una vez por envío exitoso. | `form_name: "contacto"`, `lead_source: "contact_form"`, `business_type` (id, p. ej. `spa`), `services` (ids separados por comas), `from_selector` (bool) |
| `form_error` | El envío falla. Solo para diagnóstico. | `form_name: "contacto"`, `error_type`: `not_configured` · `rate_limited` · `validation` (422 del servidor) · `delivery_failed` (502) · `unconfirmed` (200 sin entrega confirmada) · `server_error` · `network` |
| `contact_click` | Clic en `mailto:`, `tel:` o un enlace de WhatsApp (`wa.me`, `api.whatsapp.com`). Hoy no hay canales publicados, así que no se dispara hasta que existan. | `contact_method`: `email` · `phone` · `whatsapp` |
| `service_cta_click` | Clic en "Hablemos de tu proyecto" del hero o del cierre de una página de servicio. | `service` (slug), `cta_location`: `hero` · `closing` |
| `needs_selector_completed` | Clic en "Ver recomendación" del selector de soluciones (home y `/soluciones`). | `business_type`, `challenge`, `recommended_services` (ids separados por comas) |

- **Datos personales:** nunca se envían nombre, negocio, correo, WhatsApp ni mensaje. Una prueba lo verifica.
- **Clics frente a leads:** `contact_click` y `service_cta_click` **no son leads**. Solo `generate_lead` representa un contacto confirmado por el backend.
- **Sin duplicados:**
  - Los clics se capturan con un único listener delegado, montado una vez en el layout.
  - El evento del selector se dispara en el clic, no en un efecto, así que StrictMode no lo duplica (hay prueba).
  - El código no envía ningún `page_view`.
- **Páginas vistas:** las mide GA4 con la medición mejorada ("cambios de página basados en eventos del historial"). Verifiqué en el navegador que la navegación interna no vuelve a cargar `gtm.js`.

**`generate_lead` significa "correo aceptado por Resend", no "correo en el buzón".** Resend responde con el `id` del correo cuando lo acepta para envío; la llegada a la bandeja de entrada se confirma después y fuera del sitio (panel de Resend, con el `id` que queda en `action_log`, o webhooks `email.delivered`/`email.bounced` si se configuran). Un rebote posterior no revierte el `generate_lead`.

### Eventos de SUMA Vision Studio (`/showroom`)

Mismo canal (`track()` → `dataLayer`), solo con consentimiento y sin datos personales: nunca el nombre del negocio, las notas, el presupuesto escrito ni las cifras que la persona escribe en el simulador.

| Evento | Qué representa | ¿Solo un clic? | Parámetros |
|---|---|---|---|
| `showroom_personalized` | Primer cambio de nombre, giro o estilo de la demo. Una vez por visita. | No: es una interacción con el formulario. | `industry` (id), `style` (id de paleta) |
| `showroom_demo_viewed` | Elige un objetivo o una demo distinta de la que ya ve. | **Sí**: registra la selección; la demo se muestra, pero no mide tiempo ni uso dentro de ella. | `goal` (`captar` · `responder` · `operar`), `experience` (id) |
| `showroom_impact_used` | Primera interacción con el simulador (dato, escenario o periodo); se envía 1.5 s después con el estado de ese momento. Una vez por visita. | No: es uso del simulador. | `scenario` (`conservative` · `base` · `optimistic`), `months`, `own_data_count` (cuántos datos cambió, sin sus valores) |
| `showroom_quote_updated` | La propuesta cambió de modo, paquete, número de módulos cobrados o periodo; se agrupa 1.5 s para no enviar un evento por clic. | No: es un cambio de configuración. | `mode` (`services` · `package`), `plan` (id o `none`), `services_count` (extras cobrados), `months` |
| `showroom_whatsapp_click` | Clic en un botón de WhatsApp del showroom. | **Sí**: abre WhatsApp con un mensaje editable; no confirma que se haya enviado. Se registra junto con `contact_click`. | `intent` (`quote` · `budget` · `diagnostic` · `impact`) |

Ninguno es un lead. El único evento de conversión sigue siendo `generate_lead`.

En la misma revisión se corrigió `pricing_cta_click`: comparaba contra un plan `start` que ya no existe, así que los clics del plan SUMA Ads de `/precios` no se registraban.

### Estado del contenedor GTM (revisado en el `gtm.js` público, 2026-11-10)

- **Configurado:** etiqueta de Google de GA4 `G-1WSGMR965K`, y etiquetas de evento de GA4 con activador de evento personalizado para `generate_lead`, `form_error`, `contact_click`, `service_cta_click` y `needs_selector_completed`. Producción carga una sola vez `GTM-W2CSD45N` y no hay otra instalación de GA4.
- **Falta:** etiquetas y activadores para `pricing_plan_selected`, `pricing_cta_click` y los cinco `showroom_*`. El sitio ya los envía a `dataLayer`, pero GTM todavía no los reenvía a GA4. Se configuran igual que los existentes: activador de evento personalizado con el nombre exacto y etiqueta de evento de GA4 con los parámetros de la tabla como variables de capa de datos. No marcarlos como evento clave.

### Estado del contenedor GTM (revisado en el `gtm.js` público, 2026-11-09)

- **Ya configurado:** etiqueta de Google de GA4 `G-1WSGMR965K` con medición mejorada (páginas vistas por historial, desplazamiento, clics salientes, formularios, etc.), redacción automática y `generate_lead` marcado como evento clave.
- **Falta (bloquea medir conversiones):** el contenedor **no tiene activadores ni etiquetas de evento** para `generate_lead`, `form_error`, `contact_click`, `service_cta_click` ni `needs_selector_completed`. El sitio los envía a `dataLayer`, pero GTM no los reenvía a GA4, así que hoy no llegan.

### Configuración pendiente en GTM

1. **Activadores de evento personalizado:** `generate_lead`, `form_error`, `contact_click`, `service_cta_click` y `needs_selector_completed`.
2. **Etiquetas de evento de GA4** (`G-1WSGMR965K`): una por evento, que pasen como parámetros las variables de capa de datos de la tabla anterior.
3. **En GA4:** dejar **solo `generate_lead`** como evento clave y registrar las dimensiones personalizadas que se quieran analizar (`service`, `business_type`, `error_type`…).
4. **Medición mejorada, interacciones con formularios:** genera `form_start`/`form_submit` al enviar, aunque el envío falle. No marcarlos como conversión, o desactivar esa opción para no confundirlos con `generate_lead`.
5. **No** crear un activador de *History Change* para `page_view`: la medición mejorada ya cubre la navegación de Next.js.
6. Publicar la versión del contenedor y validar con la vista previa de GTM sobre `https://www.sumastudio.mx`, después de aceptar estadísticas en el banner.

---

## 5. Consentimiento y privacidad

### Encontrado

- GTM estaba activo **sin Consent Mode**, así que las etiquetas se comportaban como si hubiera consentimiento total, incluido el publicitario.
- El aviso de privacidad **no mencionaba** cookies ni herramientas de medición.

### Implementado en esta rama: consentimiento previo (opt-in) en todas las regiones

- **Valores por defecto** (`next/script` `beforeInteractive`, antes de cualquier etiqueta):
  - `analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization` empiezan en `denied` en todas las regiones (`ANALYTICS_DEFAULT = "denied"`).
  - Si la persona ya eligió, el valor por defecto refleja su elección.
  - Se añaden `ads_data_redaction: true` y `url_passthrough: false`.
- **GTM bloqueado hasta el consentimiento.** No basta con denegar el almacenamiento: `gtm.js` **no se descarga** mientras no haya aceptación. Al aceptar, primero se envía `consent update` y después carga GTM. Se quitó el `<noscript>` de GTM, porque sin JavaScript no se puede pedir permiso.
- **Banner** (`ConsentBanner`):
  - Aparece solo si no hay decisión guardada. Es discreto, no es modal y no mueve el foco.
  - "Rechazar" y "Aceptar estadísticas" tienen el mismo tamaño, sin casillas premarcadas, y enlaza al aviso de privacidad.
  - Guarda la elección en `localStorage` y se respeta en las páginas siguientes.
- **"Preferencias de privacidad"** (footer): permite cambiar la decisión después. Si no hay decisión, la casilla parte desmarcada.
- **Verificado en el navegador** (build de producción en local):
  - Sin decisión: 0 peticiones a Google, banner visible.
  - Aceptar: `consent update=granted` → `gtm.js` → GA4 `page_view` con `G-1WSGMR965K`.
  - Página siguiente: GTM carga solo, con el valor por defecto `granted` y sin banner.
  - Rechazar: 0 peticiones a Google y banner oculto.
  - Móvil (375 px): sin desbordamiento horizontal y botones de 48 px de alto.
- **Retirar el consentimiento a media visita:** si GTM ya estaba cargado, se envía `consent update=denied` (GA4 deja de usar cookies) y GTM ya no se carga en las páginas siguientes.

### Pendiente legal (bloquea el merge)

El aviso de privacidad se reescribió con los servicios reales: formulario, Resend, proveedor de alojamiento, buzón receptor, GTM y GA4 solo con consentimiento, almacenamiento local, conservación y derechos ARCO. Sigue en `noindex` y con un aviso visible de borrador. Datos que deben proporcionar los responsables de SUMA (no se inventó ninguno):

1. Razón social o nombre del titular responsable.
2. Domicilio para oír y recibir notificaciones.
3. Correo de privacidad y, en su caso, persona o área responsable.
4. Correo o medio para solicitudes ARCO, procedimiento, plazos de respuesta y forma de acreditar identidad.
5. Plazo de conservación de los datos del formulario y criterio de eliminación.
6. Periodo de retención configurado en GA4.
7. Servicio de correo definitivo del buzón receptor (hoy, un Gmail conectado).
8. Si el seguimiento comercial posterior es una finalidad secundaria y el mecanismo para negarse a ella.
9. Revisión legal de las remisiones o transferencias a Resend, Google y el proveedor de alojamiento, incluidas las internacionales.
10. Fecha de entrada en vigor y aprobación del texto por un especialista.

---

## 6. Rendimiento y Core Web Vitals

### Medición inicial (antes de cambios) — **Lighthouse 13.6, móvil emulado, laboratorio, 1 corrida por página, sobre producción**

No son datos de campo (CrUX). La API de PageSpeed Insights devolvió `429` por falta de cuota, así que no se obtuvieron datos de usuarios reales. Una sola corrida tiene variación.

| Página | Puntuación | FCP | LCP | TBT | CLS | Speed Index | Peso |
|---|---|---|---|---|---|---|---|
| Home | 91 | 1.2 s | **2.8 s** | 241 ms | 0 | 2.7 s | 577 KB |
| /servicios/chatbots | 99 | 1.2 s | 1.2 s | 43 ms | 0 | 3.3 s | 613 KB |
| /servicios/crm | 94 | 1.2 s | 1.2 s | 167 ms | 0 | 5.4 s | 614 KB |
| /servicios/aplicaciones-moviles | 100 | 1.2 s | 1.2 s | 61 ms | 0 | 2.4 s | 614 KB |
| /servicios/paginas-web | 93 | 1.3 s | **2.6 s** | 42 ms | 0 | 5.1 s | 637 KB |
| /servicios/publicidad-digital | 96 | 1.2 s | 1.2 s | 83 ms | 0 | 5.0 s | 613 KB |
| /industrias/spas | 86 | 1.1 s | **3.1 s** | **339 ms** | 0 | 3.0 s | 653 KB |
| /industrias/yoga-pilates | 94 | 1.2 s | **2.7 s** | 54 ms | 0 | 4.2 s | 647 KB |
| /contacto | 98 | 1.1 s | 1.1 s | 52 ms | 0 | 3.8 s | 589 KB |

INP no se mide en laboratorio (requiere datos de campo). TBT es su indicador más cercano.

### Diagnóstico

- **Home, LCP de 2.8 s:**
  - **Causa:** el elemento LCP es el texto del logo, retrasado por la pantalla de carga animada, que se muestra en cada carga completa por decisión de producto (ver DEVLOG).
  - **Decisión:** no la toqué. Quitarla mejoraría la cifra a costa de la identidad del sitio.
- **/servicios/paginas-web, LCP de 2.6 s:**
  - **Causa:** el LCP era una imagen del mockup del hero con `loading="lazy"`.
  - **Corregido:** se carga con `preload` solo en ese hero; en la home sigue en diferido.
- **Industrias, LCP de 2.7 a 3.1 s:**
  - **Causa:** el LCP es la foto del hero, que ya tenía prioridad. El retraso lo explican la descarga de la imagen y el CPU emulado.
  - **Corregido:** `priority`, obsoleto en Next 16, se migró a `preload`.
- **CLS:** 0 en todas las páginas.
- **JavaScript:**
  - Unos 230 KB comprimidos por página: React + runtime de Next (~150 KB) y GSAP (~26 KB, pantalla de carga e isotipo animado).
  - Zod (~34 KB) solo se carga en `/contacto`.
  - GTM agrega ~100 ms de CPU.
  - No hay recursos que bloqueen de forma relevante el renderizado (ahorro estimado de 20 a 90 ms).
- **Fuentes:** `next/font` con `display: swap`; Lighthouse no marca problemas.

### Pendiente

- Volver a medir **después del merge, sobre producción**: Lighthouse con 3 a 5 corridas por página y mediana, y PageSpeed Insights con clave de API para obtener datos de campo de CrUX cuando haya tráfico suficiente.
- **No afirmo que se cumplan** LCP ≤ 2.5 s, INP ≤ 200 ms y CLS ≤ 0.1 en campo: no hay mediciones de campo.
- **Opcional, con prueba visual:** cargar GSAP de forma diferida (`import()` dentro de los efectos) para reducir el JavaScript inicial en ~26 KB comprimidos. Puede retrasar el arranque de la pantalla de carga en redes lentas, así que lo dejo como decisión de diseño.

---

## 7. Enlaces internos

### Estado

La arquitectura ya era temática y coherente:
- cada servicio enlaza a 4 industrias y a 2 servicios relacionados, cada uno con una frase que explica la relación;
- cada industria enlaza a 2 a 4 servicios (marcados como principal o complemento) y a 3 industrias más;
- el header y el footer enlazan todas las secciones.

No hay bloques repetidos con "todos los enlaces".

### Corregido

- En servicios: "Ver industria" pasa a "Ver soluciones para spas y centros de bienestar" (por ejemplo).
- En industrias: "Conocer el servicio" pasa a "Conocer CRM", "Conocer páginas web", etc.

---

## 8. IndexNow

- **Clave pública verificable:** `public/f3f0e168e7ee8c6ab102a15bf79ad74f.txt`, que contiene la propia clave, como exige el protocolo. No es un secreto: IndexNow la publica por diseño.
- **Script `scripts/indexnow.mjs`** (`npm run indexnow -- …`). **No hay endpoint público**, así que no hay superficie de abuso:
  - **Simulación por defecto:** sin `--send` solo lista lo que enviaría.
  - **Solo URLs de producción:** acepta únicamente URLs del dominio, y cada una debe estar en el sitemap publicado (nueva o modificada) o responder `404`/`410` (eliminada).
  - **`--changed-since <ref>`:** propone las rutas cuyo `page.tsx` cambió y **lista** los archivos compartidos modificados (contenido y componentes) para que una persona decida qué URLs cambiaron de verdad. Nunca envía el sitemap completo por defecto.
  - **Límite:** 100 URLs por ejecución.
- **Uso después del merge**, con el despliegue ya en producción y la clave accesible en `https://www.sumastudio.mx/<clave>.txt`:

  ```bash
  npm run indexnow -- /servicios/crm /industrias/spas          # revisar
  npm run indexnow -- --send /servicios/crm /industrias/spas   # enviar
  ```

- **Alcance:** IndexNow notifica a Bing, Yandex, Seznam, Naver y otros buscadores. **Google no participa**; para Google, usar el sitemap en Search Console.
- **No envié ninguna notificación:** la clave aún no está publicada.

---

## 9. Pruebas realmente ejecutadas

| Prueba | Resultado |
|---|---|
| `npm run lint` | ✓ sin errores ni avisos |
| `npm run typecheck` | ✓ |
| `npm test` (Vitest) | ✓ 24 archivos, 140 pruebas (antes 94). Nuevas: entrega confirmada con Resend (delivered, id, idempotencia, configuración inválida ⇒ 503), URL del sitio, grafo JSON-LD y metadata, límites de títulos y descripciones, eventos del formulario (lead confirmado sin datos personales, descarte por spam sin lead, `form_error` por 503/429/502/500/red), clics de contacto y CTA, selector una vez en StrictMode, Consent Mode y preferencias |
| `npm run build` con URL de producción + `seo-check` | ✓ 19 páginas, 18 URLs en el sitemap, sin avisos |
| Build simulado de preview + `seo-check` | ✓ robots `Disallow: /`, sitemap vacío, `noindex` |
| Build con el adaptador real de Vercel (`@vercel/next` vía `NEXT_ADAPTER_PATH`), producción y preview | ✓ `seo-check` lee `.next/output` (19 páginas en producción; preview no indexable) |
| Despliegue de preview en Vercel del PR | ✓ `seo-check ✓ preview no indexable [vercel-adapter]`. El primer intento falló porque el validador solo leía `.next/server/app`; ya está corregido |
| Build de producción sin URL o con localhost | ✓ falla con mensaje claro |
| Prueba negativa de `seo-check` con un dominio equivocado | ✓ detecta los errores |
| Schema Markup Validator (18 páginas) | ✓ 0 errores y 0 avisos (2026-11-09). Al revalidar más tarde el servicio respondió 405; el JSON-LD no ha cambiado desde esa validación |
| Navegador (build local con `next start`) | ✓ consentimiento por defecto antes de `gtm.js`; GTM cargado una vez; `service_cta_click` una vez; navegación interna sin recargar GTM; H1 nuevo idéntico en posición a producción |
| Lighthouse móvil sobre producción (9 páginas, antes de cambios) | Ver la sección 6 |
| `POST /api/contacto` en producción | `503 not_configured` (bloqueo, sección 0) |
| IndexNow (simulación) | ✓ acepta URLs publicadas y eliminadas (404); rechaza otros dominios |
| Rich Results Test de Google | ✗ no ejecutado (necesita URL pública) |
| PageSpeed Insights (campo) | ✗ cuota de API agotada sin clave |

---

## 10. Recomendaciones de contenido (sin trucos ni texto artificial)

1. **Prueba social real:** cuando existan, casos de clientes con permiso, aunque sean pocos y aunque sean de un solo servicio. Es lo que más falta para convertir y para la autoridad (E-E-A-T).
2. **Rangos de inversión orientativos** por servicio o una sección "¿Cuánto cuesta?". Es una de las búsquedas más frecuentes antes de contactar. Solo con cifras reales que SUMA esté dispuesta a publicar.
3. **Página local auténtica** ("Estudio en Monterrey") solo cuando haya algo verificable que decir: equipo, forma de trabajo presencial y clientes locales. No crear landings por ciudad duplicadas.
4. **Google Business Profile:** solo si SUMA atiende en una dirección o define un área de servicio. Hoy no hay dirección pública, y por eso el JSON-LD no declara `LocalBusiness`.
5. **Perfiles oficiales** (Instagram, LinkedIn) en `site.social`: se añaden solos a `sameAs` y al footer.
6. **Canales de contacto reales** (correo y WhatsApp) en `site.contact`: activan `contact_click` y el `contactPoint` del JSON-LD.
7. **Contenido editorial útil**, si hay capacidad para sostenerlo. Por ejemplo: "Cómo elegir un sistema de reservas para un estudio de pilates" o "WhatsApp Business API vs. app de WhatsApp Business para spas". Mejor 1 artículo excelente al mes que 10 genéricos.
8. **Completar el aviso de privacidad** (razón social, domicilio, correo ARCO, sección de cookies). Después, quitarlo de `noindexRoutes`.
9. **Imagen OG por servicio:** hoy todas usan la imagen general. Un `opengraph-image.tsx` por servicio mejoraría cómo se ven al compartirse.

---

## 11. Riesgos

| Riesgo | Mitigación |
|---|---|
| Formulario: el buzón de `CONTACT_TO_EMAIL` es un Gmail conectado, pendiente de sustituir por un buzón oficial de SUMA | Cambiar solo la variable en Vercel cuando exista el buzón; el código acepta uno o varios destinatarios |
| `sumastudio.mx` no tiene MX: `contacto@sumastudio.mx` envía pero no recibe | Las respuestas van al prospecto por `reply_to`; añadir buzón (Google Workspace u otro) si se quiere recibir en el dominio |
| Aviso de privacidad incompleto y sin revisión legal (datos del responsable, ARCO, plazos) | Mantener el PR abierto hasta completar los 10 puntos de la sección 5; el consentimiento ya es *opt-in* |
| Con *opt-in*, GA4 solo medirá a quien acepte: las cifras serán menores que antes | Esperado y correcto; no usar modelado publicitario |
| `seo-check` como `postbuild` podría bloquear un despliegue si un cambio futuro rompe canonical o JSON-LD | Es intencional: falla con un mensaje concreto por página; se corre en local con `npm run build` |
| Si `NEXT_PUBLIC_SITE_URL` se borra en Vercel, el build de producción falla | Intencional: evita publicar canonical a localhost |
| Los eventos personalizados no llegan a GA4: el contenedor publicado no tiene activadores ni etiquetas para ellos (sección 4) | Configurar en GTM los pasos de la sección 4 antes de medir conversiones |
| Cambiar títulos puede mover temporalmente posiciones ya obtenidas | El sitio es reciente y con poco histórico; los títulos nuevos son más claros y no compiten entre sí |
| La copia local del proyecto en `~/Desktop/Suma` está en iCloud con los archivos en estado `dataless` (no legibles desde la terminal) | Trabajé sobre un clon limpio en `~/Developer/suma`. Conviene mover el proyecto fuera del Escritorio sincronizado o marcarlo como "Mantener descargado" |
