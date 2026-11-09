# TEST_PLAN

Comando de verificación por bloque: `npm run lint && npm run typecheck && npm test` (+ `npm run build` al cierre, que ejecuta `seo-check` como `postbuild`; para validar como producción: `NEXT_PUBLIC_SITE_URL=https://www.sumastudio.mx npm run build`).

## SEO (postbuild, `scripts/seo-check.mjs`)
- Una canonical absoluta por página igual a su URL; `og:url`, `og:image` y `twitter:image` absolutas al dominio.
- Sin `localhost` cuando hay dominio público; un solo `<h1>`; un solo bloque JSON-LD con Organization, WebSite y WebPage (url = canonical), `@id` resueltos y FAQ visibles en la página.
- Sitemap = exactamente las páginas indexables; robots.txt con el sitemap y `/api/` bloqueado. En previews: robots bloquea todo y el sitemap está vacío.

## Unitarias (Vitest)
- `lib/recommend` — toda combinación negocio × reto devuelve 1–3 recomendaciones válidas, sin duplicados, con enlaces a servicios existentes.
- `lib/contact-schema` — acepta payload válido; rechaza correo, WhatsApp, servicios vacíos, privacidad falsa; normaliza WhatsApp.
- `content/*` — slugs únicos; cada servicio/industria referenciada existe; navegación apunta a rutas existentes; cada servicio tiene FAQs y SEO.
- `lib/rate-limit` — bloquea tras el límite y libera tras la ventana.
- `lib/site-url` — producción exige URL https pública; previews usan su URL y no son indexables.
- `lib/seo` — canonical/OG absolutas, noindex de borradores, grafo JSON-LD con `@id` estables y sin datos inventados.
- `lib/consent` — defaults de Consent Mode (publicidad denegada, EEE/UK/CH denegado), elección guardada y `consent update`.
- `content/*` — títulos SEO ≤ 56 caracteres, descripciones de 70–160 y títulos únicos.

## Integración de API
- `app/api/contacto/route` — 400 JSON inválido, 422 validación, 200 honeypot sin entrega, 503 sin proveedor, 200 con webhook simulado, 502 si el proveedor falla, 429 por exceso.

## Componentes (Testing Library)
- Selector: avanzar, regresar, reiniciar, resultado con CTA y guardado de contexto.
- Explorador de situaciones: selección con clic y teclado (flechas).
- "Lo que hacemos" + selector de necesidades: cinco opciones en orden, cada una desplaza a su tarjeta (`servicio-<slug>`), énfasis tras `scrollend` o respaldo y retirada posterior, una sola tarjeta enfatizada, movimiento reducido, foco con teclado vs. puntero, sin scroll al montar y enlaces de tarjetas intactos.
- Demo chatbot: pregunta → horarios → confirmación de ejemplo.
- Formulario: errores accesibles, no muestra éxito ante 503, sí ante 200, evita doble envío.
- Analítica: `generate_lead` solo con entrega confirmada y sin datos personales; un 200 de descarte anti-spam no cuenta; `form_error` por tipo; `contact_click` y `service_cta_click` una vez por clic; `needs_selector_completed` una vez (StrictMode).
- Preferencias de privacidad: desactivar/guardar, reabrir con la elección guardada, cancelar sin cambios.

## Manual / navegador
- Navegación por teclado (header, dropdowns, menú móvil, tabs de demos).
- Responsive 375 / 768 / 1280 / 1440 sin desbordamiento horizontal.
- `prefers-reduced-motion`.
- Consola sin errores en rutas principales.
