# CHANGELOG

## [Sin publicar]

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
