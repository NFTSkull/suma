# CHANGELOG

## [Sin publicar]

### SUMA Studio OS: demo interactiva de CRM para estudios (rama `feat/studio-os-demo-20261111`, sin publicar)
- Ruta privada `/demo/studio-os`: hero, configurador de tres pasos (tu estudio, cómo trabajas, qué necesitas controlar) con vista previa en vivo y CRM a pantalla completa con el nombre, colores, logotipo y módulos elegidos.
- Secciones: Inicio, Agenda (día/semana, crear clase, cupos, inscribir, cancelar, asistencia, lista de espera, sustituciones), Alumnas (fichas editables), Membresías (vender, renovar, pausar), Ventas (tablero por etapas con historial y tareas), Pagos (ficticios), Profesores, Reportes, Automatizaciones simuladas, Portal de alumnas, Personalizar y "Así quedaría" (resumen sin precios y WhatsApp solo al pulsar).
- Motor de simulación con funciones puras y un solo estado: sin sobrecupo, sin reservas duplicadas, créditos que se descuentan y devuelven una sola vez, cancelación tardía según regla, membresías pausadas o vencidas que no reservan. Roles Dueña, Recepción e Instructor. "Restaurar demostración" deja todo como al entrar.
- Sin red, base de datos, cobros ni mensajes; datos ficticios deterministas; `sessionStorage` sin logotipo. Fuera del menú y del sitemap, `noindex, nofollow`, y 404 en producción mediante `src/proxy.ts`.
- Pruebas: 260 (29 nuevas de Studio OS, 3 del proxy).

### SUMA Vision Studio (`/showroom`): pulido de experiencia (PR #21)
- **Hero**: explica en una frase qué se obtiene y muestra los cuatro pasos con el mismo nombre que usan después las secciones (Personaliza, Pruébalo, Calcula, Tu propuesta). Se quitaron la barra de chips, el texto intermedio y la sección de límites que repetían lo mismo. Acento morado para que "a la vista" no quede naranja sobre naranja en móvil. Title SEO sin la marca duplicada.
- **Personaliza**: solo nombre, giro y estilo; la herramienta actual pasó a la propuesta.
- **Pruébalo**: en móvil la vista previa aparece justo después de los controles; el estado "incluido" es una etiqueta verde ("Ya está en tu propuesta") en lugar de un botón que parecía deshabilitado.
- **Calcula**: cada dato indica si es "Ejemplo" o "Tu dato", con leyenda Ejemplo / Tu dato / Supuesto / Resultado no garantizado y "Volver al ejemplo". Cálculo mensual en cascada (clientes nuevos → ingresos → margen → mensualidad → diferencia) con la fórmula visible. Escenario y periodo junto al resultado; el periodo se comparte con la propuesta. Supuestos avanzados plegados. Columna de datos fija en escritorio. Corregido el mensaje de recuperación cuando la selección no tiene implementación. El IVA pasó a la propuesta.
- **Tu propuesta**: módulos recomendados para el objetivo elegido (el resto bajo "Ver los 13 módulos"), detalle de cada módulo marcado, desglose de lo elegido, "Qué incluye" del paquete, implementación, mensualidad, primer pago con IVA y total del periodo. Bloque "Así sería la implementación" con los cuatro pasos del proceso.
- **WhatsApp**: la revisión del simulador usa su propio asunto y envía la simulación completa (diferencia mensual y balance del periodo) aparte de las notas del cliente, que ya no se sobrescriben ni se recortan. "1 mes / N meses" en lugar de "mes(es)".
- Sin cambios en precios, catálogo, integraciones ni pagos.
- Pruebas: 199.

### SUMA Vision Studio: revisión final (PR #21)
- **Confianza financiera**: sin «la mensualidad se paga sola». Veredicto, punto de equilibrio, recuperación, balance y horas en condicional («cubriría», «harían falta», «se recuperaría», «podrían liberarse»). Cifras rotuladas como estimadas. Se explica que el cálculo supone el mismo resultado desde el primer mes y no suma consultas nuevas de publicidad, SEO o web.
- **Atribución**: si la selección no incluye CRM, chatbot, automatización ni los paquetes Flow o Growth, el simulador muestra la oportunidad pero no la compara contra la mensualidad, no da veredicto ni horas liberadas, y el mensaje de WhatsApp lo aclara.
- **Analítica**: cinco eventos del Vision Studio (`showroom_personalized`, `showroom_demo_viewed`, `showroom_impact_used`, `showroom_quote_updated`, `showroom_whatsapp_click`), solo con consentimiento y sin datos personales. Corregido `pricing_cta_click`, que no registraba el plan SUMA Ads.
- **Navegación móvil**: los pasos del hero dejaban 112 px vacíos bajo el header (doble margen de anclaje); ahora cada sección queda justo debajo.
- **WhatsApp**: «Escenario conservador» en lugar de «Simulación conservador».
- Pruebas: 208.

### Consentimiento opt-in y aviso de privacidad
- `ANALYTICS_DEFAULT = "denied"` en todas las regiones; `ad_storage`, `ad_user_data` y `ad_personalization` siempre `denied`.
- GTM ya no se carga sin consentimiento: `gtm.js` solo se descarga tras "Aceptar estadísticas" (primero `consent update`, después GTM) y en visitas posteriores si la aceptación está guardada. Se retiró el `<noscript>` de GTM.
- Banner de consentimiento (`ConsentBanner`): aparece solo sin decisión guardada; discreto, no modal, "Rechazar" y "Aceptar estadísticas" con el mismo peso, enlace al aviso de privacidad. "Preferencias de privacidad" en el footer parte desmarcada y permite cambiar la decisión.
- Aviso de privacidad reescrito con los servicios reales (formulario, Resend, alojamiento, buzón receptor, GTM y GA4 con consentimiento, almacenamiento local, conservación, ARCO), con aviso visible de borrador y datos legales pendientes marcados. Sigue `noindex`.
- Documentación: "aceptado por Resend" (lo que mide `generate_lead`) frente a "entregado en el buzón".
- Pruebas: 148.

### Formulario de contacto con Resend
- La API responde `200 { ok: true, delivered: true }` solo cuando el proveedor confirma la entrega (Resend con `id` del correo, o webhook 2xx); el descarte anti-spam sigue respondiendo `200 { ok: true }`. El formulario muestra éxito y envía `generate_lead` únicamente con `delivered: true`; en otro caso muestra "No pudimos confirmar el envío", conserva los datos y registra `form_error` (`unconfirmed`).
- Configuración de entrega validada con Zod: para Resend son obligatorios `RESEND_API_KEY` (`re_…`), `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL`; se eliminó el remitente de pruebas `onboarding@resend.dev` como valor por defecto y se rechaza cualquier `@resend.dev`. Si falta algo, `503 not_configured` con el motivo en `action_log`.
- Compatible con la configuración de producción: `RESEND_API_KEY` cualquier `re_…` sin espacios, `CONTACT_FROM_EMAIL` con o sin nombre visible, `CONTACT_TO_EMAIL` con uno o varios destinatarios separados por comas.
- Envíos de Resend con `Idempotency-Key` (misma solicitud ⇒ un solo correo), versión de texto plano y `reply_to` del prospecto. `action_log` registra `providerId` (id del correo), `providerStatus` y `reason`, sin datos personales.
- Pruebas: 140.

### SEO 360 (rama `seo/auditoria-360`, detalle en `SEO_AUDIT.md`)
- **Indexación**: URL del sitio resuelta por entorno (`src/lib/site-url.ts`): producción exige `NEXT_PUBLIC_SITE_URL` https (el build falla si falta o es localhost); los previews usan su propia URL y son `noindex` con robots `Disallow: /` y sitemap vacío. `X-Robots-Tag: noindex` en alias `*.vercel.app`. Canonical, `og:url`, `og:image` y `twitter:image` absolutas en todas las páginas (antes las internas no tenían imagen social). El layout raíz ya no hereda canonical `/`. Aviso de privacidad (borrador) en `noindex, follow` y fuera del sitemap. Sitemap sin `changefreq`/`priority`/`lastmod`.
- **Validación**: `scripts/seo-check.mjs` como `postbuild` (canonical, localhost, Open Graph, H1 único, JSON-LD, FAQ visibles, sitemap ↔ páginas indexables, robots).
- **JSON-LD**: un `@graph` por página con `@id` estables (Organization, WebSite, WebPage/CollectionPage/AboutPage/ContactPage, BreadcrumbList, Service ×5, FAQPage solo con preguntas visibles, ItemList en índices). `ProfessionalService` → `Organization`. Logo PNG oficial (`public/brand/isotipo-512.png`) y `apple-icon.png`. Schema Markup Validator: 0 errores y 0 avisos en 18 páginas.
- **On-page**: el nombre del servicio/sector forma parte del H1 (mismo aspecto visual); títulos ≤ 56 caracteres + marca y descripciones de 70–160; textos de enlace descriptivos entre servicios e industrias.
- **Medición**: eventos `generate_lead` (solo con entrega confirmada por el backend), `form_error`, `contact_click`, `service_cta_click` y `needs_selector_completed` vía `dataLayer`, sin datos personales.
- **Consentimiento** (pendiente de revisión legal): Consent Mode v2 con publicidad siempre `denied` y medición según elección guardada; "Preferencias de privacidad" en el footer; sección de cookies en el borrador del aviso.
- **Rendimiento**: imagen LCP del hero de `/servicios/paginas-web` con `preload`; `priority` (obsoleto en Next 16) → `preload`.
- **IndexNow**: clave pública en `public/` y `scripts/indexnow.mjs` (simulación por defecto, solo URLs publicadas o eliminadas, sin endpoint público).
- Pruebas: 130.

### Añadido
- Google Tag Manager (`GTM-W2CSD45N`) en todas las páginas: fragmento oficial cargado con `next/script` (`afterInteractive`) y `<noscript>` al inicio de `<body>`. Pruebas: 94.

### Seguridad
- `next` y `eslint-config-next` de 16.4.0 a 16.4.2 (parche de una vulnerabilidad conocida de 16.4.0). `npm audit --omit=dev`: 0 vulnerabilidades.

### Cambiado
- Favicon: la "S" provisional se sustituye por el isotipo oficial de SUMA (`public/brand/simbolo_capas.svg`), con fondo transparente y recortado a un cuadrado alrededor del símbolo para que se lea en la pestaña.
- Home: "Te entendemos" y "Lo que hacemos" se fusionan en una sola sección. Se retira de la home la sección "Te entendemos" (titular, seis situaciones y panel de solución); `SituationsExplorer` y `situations` se conservan porque `/soluciones` los usa. "Lo que hacemos" conserva titular, tarjetas, visuales y enlaces, y suma la pregunta "¿Qué te gustaría mejorar hoy?" con un selector de cinco necesidades (`ServiceShortcuts`): Responder mensajes → Chatbots, Organizar clientes y citas → CRM, Crear una experiencia móvil → Apps, Mejorar mi página web → Web, Atraer más clientes → Publicidad. Cada opción es un botón real (`aria-pressed`, `aria-controls`) que desplaza suavemente a la tarjeta existente (respeta el header sticky y `prefers-reduced-motion`), marca la opción con un subrayado naranja y da a la tarjeta un contorno temporal en su color (~360 ms de entrada, 1.6 s visible) sin mover el layout. Con teclado el foco pasa al enlace de la tarjeta. En móvil las opciones forman una fila deslizable; desde `sm` se acomodan en filas. Se retira el texto "No se trata de agregar más herramientas…". Cada tarjeta tiene id estable `servicio-<slug>`. Pruebas: 91.
- Manifiesto de la home: el párrafo de la derecha se sustituye por `SumaScrollTransformation`, una composición editorial "Antes → Con SUMA" ("Una forma más simple de trabajar": mensajes sin responder → atención más ágil; reservas por organizar → reservas en orden; tareas repetitivas → más tiempo para tus clientes). Cambia con el scroll natural, sin temporizadores ni scroll-jacking, con histéresis para no parpadear y regresa a "Antes" al subir; transición secuencial de ~600 ms (opacidad + 8 px) sin cambios de altura. Control manual discreto por teclado y tacto. En móvil el orden es titular → transformación → firma. Sin JS y con movimiento reducido muestra el estado final; los lectores de pantalla leen una lista estática con ambos estados. Titular, forma rosa y firma sin cambios. Pruebas: 76.
- Animaciones visibles en móvil: el isotipo del hero se une al entrar en pantalla (en móvil queda bajo el pliegue y antes terminaba sin que nadie lo viera; en escritorio se comporta igual que antes); recorrido de las piezas mayor en móvil y tablet; el CTA final muestra en móvil el isotipo animado completo sobre el titular en lugar de la marca de 48 px; la entrada del hero espera a que termine el fundido de la pantalla de carga para verse completa. Pruebas: 64.
- Composición tipográfica del hero rediseñada: H1 único en cuatro líneas en mayúsculas con Poppins (800/900, cargada con `next/font` solo en el hero): "CREATIVIDAD" en blanco sobre bloque naranja, "QUE SUMA." en navy, pausa editorial, "ESTRATEGIA" en blanco sobre bloque magenta y "QUE IMPULSA." en navy; mismo tamaño en todas las líneas, alineación izquierda y tamaños con `clamp()` (4 líneas también en móvil). Eyebrow "CREATIVIDAD + TECNOLOGÍA" en Quicksand SemiBold y nuevo texto de apoyo. Se eliminó el trazo naranja. Entrada escalonada (eyebrow → bloque naranja que se despliega → complemento → bloque magenta → complemento → descripción) en ~1.1 s, sin rebotes y desactivada con `prefers-reduced-motion`. CTAs, rutas y ubicación sin cambios. Pruebas: 62.
- Los SVG del símbolo del hero se cargan con `loading="eager"` (son el LCP).

### Añadido
- Prueba de que el selector no toma el foco al montarse (también en StrictMode).
- Pantalla de carga con la animación oficial del logo (`SumaStudioLogoReveal`, GSAP): se muestra en cada carga de la página (no en la navegación interna), abre la página arriba salvo que la URL lleve `#sección`, pausa las animaciones del hero mientras dura, se retira con un fundido y respeta `prefers-reduced-motion`. Pruebas: 48.
- Dependencia `gsap`.
- Isotipo animado `AnimatedSumaSymbol` con las piezas oficiales (`public/brand/naranja.svg`, `rosa.svg`, `morado.svg`): flotan separadas, se unen en la composición exacta del símbolo y quedan con una micro-oscilación del conjunto. Variantes `hero`, `cta` y `subtle`; temas `cream` y `navy`; disparadores `load` (espera a la pantalla de carga) e `in-view`; respeta `prefers-reduced-motion`. Configuración en `suma-symbol-config.ts`. Pruebas: 59.
- Archivos oficiales de marca en `public/brand/` (piezas del símbolo, símbolo por capas, logo horizontal y vertical).

### Corregido
- Al abrir la home la página saltaba a "Selector de soluciones": el selector enfocaba su título al montarse porque React ejecuta los efectos dos veces en desarrollo. Ahora solo mueve el foco cuando cambia de paso, y la página abre en el hero.

### Cambiado
- Hero: las formas genéricas (`OrganicShape`) se sustituyen por el isotipo animado (variante `hero`); las tarjetas de ejemplo pasan a las esquinas libres (arriba a la derecha y abajo a la izquierda) y la caja visual es algo más alta para que el símbolo formado no quede tapado.
- Cierre/CTA (`ClosingCta`, usado en todas las páginas): el símbolo animado (variante `cta`) ocupa una columna a la derecha del texto desde `lg`; en móvil y tablet aparece una marca pequeña (variante `subtle`) en el margen superior, sin tapar ni desplazar el contenido.
- `SumaStudioLogoReveal.tsx` se movió de `public/` a `src/components/brand/` (en `public/` se habría servido como archivo estático).

## [0.1.0] — 2026-10-12

### Añadido
- **B0 · Base**: proyecto Next.js 16 (App Router, Turbopack, `cacheComponents`), scripts `lint`, `typecheck` (`next typegen && tsc`), `test` (Vitest + Testing Library); documentación en `/docs`.
- **B1 · Fundamentos**: tokens de marca en Tailwind v4 (5 colores oficiales + tintas derivadas para contraste AA), League Spartan + Quicksand con `next/font`, wordmark provisional con registro para logotipos oficiales, header con menús editoriales, menú móvil a pantalla completa (`<dialog>`), footer, botones, `Reveal`, formas orgánicas, favicon provisional.
- **B2 · Contenido**: fuente única en `src/content/*` para 5 servicios, 6 industrias, navegación, situaciones, proceso, reglas del selector y fotografía (Unsplash, con créditos).
- **B3 · Home**: hero, manifiesto, explorador "Te entendemos", cinco capacidades, "SUMA en acción" (chatbot de pilates, mini CRM de spa, funnel de marca, prototipo de app), carrusel de industrias, selector de soluciones, experiencia conectada, proceso, bloque de impacto y CTA final.
- **B4 · Páginas internas**: `/soluciones`, `/servicios` + 5 servicios (plantilla con hero, problema, capacidades, demo propia, beneficios, ejemplos por industria, servicios relacionados, FAQ, CTA), `/industrias` + 6 industrias, `/como-trabajamos`, `/nosotros`, `/aviso-de-privacidad` (borrador con marcadores), 404.
- **B5 · Contacto**: `POST /api/contacto` validado con Zod, honeypot, tiempo mínimo, rate limit, `action_log` sin datos personales, entrega por webhook o Resend y `503 not_configured` sin proveedor. Formulario accesible con prellenado desde el selector y prevención de doble envío.
- **B6 · SEO**: metadata por página, canonical, Open Graph/Twitter, `sitemap.xml`, `robots.txt`, imagen OG generada, JSON-LD (ProfessionalService, BreadcrumbList, FAQPage, Service).
- Pruebas: 43 (reglas del selector, schema, rate limit, API, contenido/rutas, selector, explorador, chatbot, formulario).
- `.env.example`.

### Cambiado
- La ocultación previa de `Reveal` usa `@media (scripting: enabled)` en lugar de un `<script>` inline en el layout.

### Eliminado
- Dependencia `motion` (no utilizada).
