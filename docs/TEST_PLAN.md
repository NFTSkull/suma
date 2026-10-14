# TEST_PLAN

Comando de verificación por bloque: `npm run lint && npm run typecheck && npm test` (+ `npm run build` al cierre).

## Unitarias (Vitest)
- `lib/recommend` — toda combinación negocio × reto devuelve 1–3 recomendaciones válidas, sin duplicados, con enlaces a servicios existentes.
- `lib/contact-schema` — acepta payload válido; rechaza correo, WhatsApp, servicios vacíos, privacidad falsa; normaliza WhatsApp.
- `content/*` — slugs únicos; cada servicio/industria referenciada existe; navegación apunta a rutas existentes; cada servicio tiene FAQs y SEO.
- `lib/rate-limit` — bloquea tras el límite y libera tras la ventana.

## Integración de API
- `app/api/contacto/route` — 400 JSON inválido, 422 validación, 200 honeypot sin entrega, 503 sin proveedor, 200 con webhook simulado, 502 si el proveedor falla, 429 por exceso.

## Componentes (Testing Library)
- Selector: avanzar, regresar, reiniciar, resultado con CTA y guardado de contexto.
- Explorador de situaciones: selección con clic y teclado (flechas).
- Demo chatbot: pregunta → horarios → confirmación de ejemplo.
- Formulario: errores accesibles, no muestra éxito ante 503, sí ante 200, evita doble envío.

## Manual / navegador
- Navegación por teclado (header, dropdowns, menú móvil, tabs de demos).
- Responsive 375 / 768 / 1280 / 1440 sin desbordamiento horizontal.
- `prefers-reduced-motion`.
- Consola sin errores en rutas principales.
