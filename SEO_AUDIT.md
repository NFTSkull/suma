# SUMA STUDIO — Auditoría e implementación SEO 360

Rama: `seo/auditoria-360` · Fecha: 2026-11-09 · Dominio canónico: `https://www.sumastudio.mx`

Este documento separa lo que se **encontró**, lo que se **corrigió** en esta rama, lo que queda **pendiente**, los **riesgos** y las **pruebas realmente ejecutadas**. No contiene promesas de posicionamiento: Google decide qué indexar, cómo mostrarlo y en qué posición.

---

## 0. Bloqueo comercial crítico

**El formulario de contacto de producción no entrega mensajes.**

- En Vercel solo existe `NEXT_PUBLIC_SITE_URL` (entorno *production*). No hay `CONTACT_WEBHOOK_URL` ni `RESEND_API_KEY` + `CONTACT_TO_EMAIL`.
- Prueba ejecutada el 2026-11-09 con un envío válido de prueba: `POST https://www.sumastudio.mx/api/contacto` → `503 {"ok":false,"error":"not_configured"}`. Al no haber proveedor configurado, no se entregó nada.
- La interfaz lo comunica con honestidad ("Tu mensaje no se envió"), pero **hoy ningún prospecto llega a SUMA**. Todo el trabajo SEO de esta rama atrae visitas a un formulario que no entrega.
- Acción requerida (no la hice porque necesita credenciales y una decisión de negocio): configurar en Vercel, entorno *Production*, `CONTACT_WEBHOOK_URL` (Make/Zapier/n8n) **o** `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL`), y redeplegar. Después, hacer un envío real de prueba.
- Mientras tanto, `generate_lead` no se disparará nunca (correcto: no hay leads confirmados) y cada intento quedará como `form_error` con `error_type: not_configured`, lo que permite medir cuánta demanda se está perdiendo.

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

- **Carga de GTM:** el contenedor `GTM-W2CSD45N` se carga una vez (con `next/script` `afterInteractive` y `<noscript>` al inicio de `<body>`). No hay otra instalación de GA4 en el código.
- **Eventos:** no existía ningún evento de conversión.
- **Riesgo de leads falsos:** la API responde `200` también cuando descarta spam en silencio, así que un `generate_lead` basado solo en el 200 contaría spam como prospecto.

### Corregido

- **Capa de eventos tipada** (`src/lib/analytics.ts`). Los eventos solo llevan identificadores de catálogo:

| Evento | Cuándo | Parámetros |
|---|---|---|
| `generate_lead` | La API respondió `200` **y** el envío no cumple la regla de descarte silencioso (honeypot o llenado en menos de 2.5 s), con la misma función que usa la API (`isSilentlyDiscarded`). Una vez por envío exitoso. | `form_name: "contacto"`, `lead_source: "contact_form"`, `business_type` (id, p. ej. `spa`), `services` (ids separados por comas), `from_selector` (bool) |
| `form_error` | El envío falla. Solo para diagnóstico. | `form_name: "contacto"`, `error_type`: `not_configured` · `rate_limited` · `validation` (422 del servidor) · `delivery_failed` (502) · `server_error` · `network` |
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

### Configuración pendiente en GTM (no está en el código y no tengo acceso al contenedor)

1. **Etiqueta de configuración de GA4** (Google tag) con el ID de medición, disparada en *Initialization – All Pages*. **No** crear un activador de *History Change* para `page_view`: la medición mejorada de GA4 ya cubre la navegación de Next.js.
2. **Activadores de evento personalizado:** `generate_lead`, `form_error`, `contact_click`, `service_cta_click` y `needs_selector_completed`.
3. **Etiquetas de evento de GA4:** una por evento, que pasen como parámetros las variables de capa de datos de la tabla anterior.
4. **En GA4:** marcar **solo `generate_lead`** como evento clave (conversión) y registrar las dimensiones personalizadas que se quieran analizar (`service`, `business_type`, `error_type`…).
5. **Configuración del contenedor:** activar *Consent Overview* y verificar que GA4 respete `analytics_storage` (su comprobación de consentimiento integrada).

---

## 5. Consentimiento y privacidad

### Encontrado

- GTM estaba activo **sin Consent Mode**, así que las etiquetas se comportaban como si hubiera consentimiento total, incluido el publicitario.
- El aviso de privacidad **no mencionaba** cookies ni herramientas de medición.

### Preparado en esta rama (**requiere revisión legal antes de publicar**)

- **Consent Mode v2:** los valores por defecto se fijan **antes** de que cargue GTM (`next/script` `beforeInteractive` en el layout raíz). En el navegador verifiqué que los comandos `consent default` quedan antes de `gtm.js` en `dataLayer`:
  - `ad_storage`, `ad_user_data` y `ad_personalization`: **siempre `denied`**, porque no hay base para activarlos.
  - `analytics_storage`: si la persona ya eligió, se respeta su elección; si no, `denied` en el EEE, Reino Unido y Suiza, y `ANALYTICS_DEFAULT` (`granted`) en el resto.
  - `ads_data_redaction: true` y `url_passthrough: false`.
- **"Preferencias de privacidad"** (enlace en el footer):
  - Abre un `<dialog>` nativo con una sola opción, "Medición de visitas".
  - Guarda la elección en `localStorage`, envía `consent update` y nunca activa la publicidad.
  - No hay banner intrusivo.
- **Borrador del aviso:** se añadió la sección "Cookies y tecnologías de medición", con un marcador de revisión legal.
- **Decisión pendiente (legal y negocio):** en México la LFPDPPP exige informar el uso de cookies y tecnologías de rastreo y ofrecer cómo deshabilitarlas, lo que corresponde a un modelo de aviso con exclusión voluntaria. Si el despacho legal prefiere el consentimiento previo (*opt-in*) en todas las regiones, basta con cambiar `ANALYTICS_DEFAULT` a `"denied"` en `src/lib/consent.ts` y añadir un banner. No publiques esta rama sin esa validación.

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
| `npm test` (Vitest) | ✓ 24 archivos, 130 pruebas (antes 94). Nuevas: URL del sitio, grafo JSON-LD y metadata, límites de títulos y descripciones, eventos del formulario (lead confirmado sin datos personales, descarte por spam sin lead, `form_error` por 503/429/502/500/red), clics de contacto y CTA, selector una vez en StrictMode, Consent Mode y preferencias |
| `npm run build` con URL de producción + `seo-check` | ✓ 19 páginas, 18 URLs en el sitemap, sin avisos |
| Build simulado de preview + `seo-check` | ✓ robots `Disallow: /`, sitemap vacío, `noindex` |
| Build de producción sin URL o con localhost | ✓ falla con mensaje claro |
| Prueba negativa de `seo-check` con un dominio equivocado | ✓ detecta los errores |
| Schema Markup Validator (18 páginas) | ✓ 0 errores y 0 avisos |
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
| Formulario sin proveedor en producción (sección 0) | Configurar `CONTACT_WEBHOOK_URL` o Resend. **Prioridad 1.** |
| Consent Mode y el texto del aviso sin revisión legal | No hacer merge sin revisión; la constante `ANALYTICS_DEFAULT` permite pasar a *opt-in* |
| `seo-check` como `postbuild` podría bloquear un despliegue si un cambio futuro rompe canonical o JSON-LD | Es intencional: falla con un mensaje concreto por página; se corre en local con `npm run build` |
| Si `NEXT_PUBLIC_SITE_URL` se borra en Vercel, el build de producción falla | Intencional: evita publicar canonical a localhost |
| Los eventos de GA4 no aparecerán hasta configurar las etiquetas en GTM (sección 4) | Lista de pasos en la sección 4 |
| Cambiar títulos puede mover temporalmente posiciones ya obtenidas | El sitio es reciente y con poco histórico; los títulos nuevos son más claros y no compiten entre sí |
| La copia local del proyecto en `~/Desktop/Suma` está en iCloud con los archivos en estado `dataless` (no legibles desde la terminal) | Trabajé sobre un clon limpio en `~/Developer/suma`. Conviene mover el proyecto fuera del Escritorio sincronizado o marcarlo como "Mantener descargado" |
