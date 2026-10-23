# ARQUITECTURA

## Stack
- Next.js 16 (App Router, `cacheComponents`, Turbopack) + React 19 + TypeScript estricto.
- Tailwind CSS v4 (tokens en `src/app/globals.css` vía `@theme`).
- Movimiento con CSS (keyframes y transiciones) + IntersectionObserver; sin librerías de animación.
- `zod` para validar entradas (formulario y API).
- Vitest + Testing Library (jsdom).

## Principios
- Server Components por defecto; `"use client"` solo en interacción (header, demos, selector, formulario, revelaciones).
- Todas las rutas son estáticas (carpetas explícitas, sin `params`), por lo que se prerenderizan completas.
- El contenido estructural vive en `src/content/*` (una sola fuente de verdad para menús, servicios, industrias, SEO y selector).
- Las demos están aisladas: datos ficticios locales, sin red, sin persistencia.
- Sin base de datos ni autenticación (no son necesarias en esta etapa).

## Estructura
```
src/
  app/                      Rutas (App Router), metadata, sitemap, robots, OG, API
    api/contacto/route.ts   Único endpoint (POST)
  components/
    brand/                  Logo (con fallback provisional), formas orgánicas, isotipo animado, pantalla de carga
    layout/                 Header, navegación móvil, footer, breadcrumbs
    ui/                     Botones, encabezados, Reveal, acordeón, avisos
    home/                   Secciones de la home
    demos/                  Demos conceptuales (chatbot, CRM, funnel, app, web, ads)
    services/               Plantilla y visuales de páginas de servicio
    industries/             Plantilla de páginas de industria
    selector/               Selector de soluciones (reglas tipadas)
    contact/                Formulario de contacto
  content/                  site, navigation, services, service-shortcuts, industries, situations, process, selector-rules, brand-assets, photos
  lib/                      contact-schema, recommend, seo, rate-limit, action-log, contact-delivery, cn
```

## Formulario de contacto
`ContactForm` (cliente) → `POST /api/contacto` → validación Zod → anti-spam (honeypot + tiempo mínimo + rate limit en memoria) → entrega por `CONTACT_WEBHOOK_URL` o Resend (`RESEND_API_KEY` + `CONTACT_TO_EMAIL`). Si no hay proveedor configurado responde `503 not_configured` y la UI lo comunica sin simular éxito.

El contexto del selector se transfiere al formulario mediante `sessionStorage` (no viaja en la URL).

## Movimiento ("Suma Flow")
- Tokens de duración y curvas en CSS (`--ease-flow`, `--dur-*`).
- `Reveal` usa IntersectionObserver; el contenido solo se oculta dentro de `@media (scripting: enabled)` (sin JS todo es visible) y el estado visible se escribe en el DOM sin re-render.
- `prefers-reduced-motion` desactiva animaciones ambientales y revelaciones.
- Isotipo animado (`AnimatedSumaSymbol`, GSAP): tres capas `next/image` con las piezas oficiales de `public/brand/`. Como comparten viewBox, la pose final es desplazamiento cero; la caja recorta el margen transparente (`SYMBOL_BOUNDS`). Coreografía y variantes en `suma-symbol-config.ts`. Con `trigger="load"` espera a la pantalla de carga (`splash-signal.ts`); con `in-view` arranca al 35 % visible. Los bucles se pausan fuera de pantalla y el símbolo formado oscila como una sola pieza (nunca se desalinea).
- Pantalla de carga (`SplashScreen`, montada en el layout raíz): reproduce `SumaStudioLogoReveal` (única pieza que usa GSAP), en cada carga completa (la navegación interna no la repite porque vive en el layout raíz). Si la URL no trae `#sección`, desactiva la restauración de scroll del navegador y abre arriba. Mientras está en `playing` o `leaving` las animaciones de `#contenido` quedan en pausa; sin JavaScript no se muestra y, si la hidratación falla, se retira sola a los 4 s. Es decorativa (`aria-hidden`).
- Transformación "Antes → Con SUMA" del manifiesto (`SumaScrollTransformation`): contenido en `src/content/transformation.ts`, lógica pura de umbrales e histéresis en `scroll-transformation.ts`. Un IntersectionObserver (margen 20 %) activa un listener pasivo de scroll solo mientras el bloque está cerca; cada evento se agrupa en un rAF y React solo se actualiza cuando cambia el estado. Cambia a "Con SUMA" cuando el centro del bloque sube al 60 % de la ventana y vuelve a "Antes" al bajar del 72 %. El estado se refleja en `data-state` y una única variable CSS (`--p`) anima opacidad y transform; ambas capas de texto comparten celda, así la altura no cambia. Sin JS o con movimiento reducido se ve el estado final. Una elección manual (botones `aria-pressed`) se respeta hasta que el bloque sale de pantalla.

- Selector de necesidades de "Lo que hacemos" (`ServiceShortcuts`): cada opción hace `scrollIntoView` (suave o directo según `prefers-reduced-motion`) hasta la tarjeta `servicio-<slug>` (`capabilityAnchorId`) y, al terminar el desplazamiento (`scrollend` o respaldo de 900 ms), escribe `data-emphasis` en ella durante 1.6 s. El énfasis es un `outline` en el color del servicio (`--emphasis`), sin cambio de layout. Nunca se desplaza al cargar.

## Variables de entorno
| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica (metadata, sitemap, OG). Obligatoria en producción. |
| `CONTACT_WEBHOOK_URL` | Destino del formulario (Make, Zapier, n8n, etc.). Solo servidor. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Alternativa: envío por correo con Resend. Solo servidor. |
