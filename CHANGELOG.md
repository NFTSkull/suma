# CHANGELOG

## [Sin publicar]

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
