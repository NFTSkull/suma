# DEVLOG — decisiones

## 2026-10-12

**Logotipo provisional.** No se recibieron archivos oficiales; las capturas disponibles no son assets de SUMA. Se usa un wordmark tipográfico marcado con `data-provisional="wordmark"` y un registro (`src/content/brand-assets.ts`) para que los SVG oficiales sustituyan todo el sitio al añadirse. No se dibujó ni se "recreó" ningún logo. Favicon y OG también son tipográficos y provisionales.

**Contraste antes que fidelidad literal del color.** Naranja y rosa no alcanzan 4.5:1 como texto sobre crema. Se mantienen los cinco colores oficiales para superficies y acentos, y se derivan tintas solo para texto pequeño (`orange-ink #C24400`, `pink-ink #B3008F`). Texto navy sobre naranja/rosa; crema sobre violeta/navy. Sobre violeta, los eyebrows van en crema (el naranja da ~3.7:1).

**Sin base de datos → sin RLS.** La regla del proyecto pide consultas sujetas a RLS, pero el brief prohíbe introducir bases de datos que aún no se necesitan. El único endpoint no consulta datos; escribe `action_log` como JSON estructurado en los logs del servidor, sin datos personales. Si se añade una base, el lead y el `action_log` deben ir a tablas con RLS.

**Contacto honesto.** Sin `CONTACT_WEBHOOK_URL` ni Resend, la API responde `503 not_configured` y la UI dice que el mensaje no se envió, conservando los datos. El honeypot y los envíos demasiado rápidos reciben `200` silencioso (para no enseñar a los bots), sin entrega.

**Contexto del selector por `sessionStorage`.** Pasarlo por URL obligaría a leer `searchParams` (render dinámico y Suspense con `cacheComponents`). `sessionStorage` mantiene `/contacto` estático, no expone datos en la URL y solo guarda ids de negocio, reto y servicios.

**Todas las rutas estáticas.** Carpetas explícitas por servicio e industria en lugar de `[slug]`; la prueba de contenido verifica que cada ruta de `allRoutes` tenga su `page.tsx`.

**Movimiento con CSS.** Keyframes y transiciones con `motion-safe:` y un bloque `prefers-reduced-motion`; `Reveal` con IntersectionObserver y escritura directa de `data-visible` en el DOM (evita `setState` en efectos). Se retiró `motion` por no usarse. La ocultación previa vive en `@media (scripting: enabled)` para no depender de un `<script>` inline (React 19 lo advierte) y para que sin JS todo sea visible.

**Hero sin `Reveal`.** El H1 usa animaciones CSS de entrada para no retrasar el LCP con JavaScript.

**Fotografía.** Unsplash (licencia libre) con créditos en `src/content/photos.ts`, hasta contar con sesión propia. Las demos usan datos ficticios y siempre muestran "Demostración conceptual…".

**Rendimiento.** No se reportan métricas de Core Web Vitals: no se han medido en producción.

**Pantalla de carga con el logo oficial.** La animación entregada (`SumaStudioLogoReveal.tsx`, GSAP) se movió de `public/` a `src/components/brand/` porque `public/` sirve archivos tal cual y un `.tsx` ahí no se compila. Se añadió `gsap` como dependencia porque el componente lo requiere; no se usa en otras partes. Decisiones: se muestra en cada carga completa de la página (petición del cliente; antes era una vez por sesión) y no en la navegación interna, porque vive en el layout raíz; como cubre la pantalla, la página abre arriba (`history.scrollRestoration = "manual"`) salvo que la URL apunte a una sección con `#`; es `aria-hidden` (decorativa, el contenido real ya está en el DOM); sin JS no aparece y con hidratación fallida se retira sola (CSS) para no bloquear el sitio; las animaciones del hero se pausan mientras se reproduce para que el sitio "entre" después del logo. El estado se lee con `useSyncExternalStore` para evitar diferencias de hidratación y `setState` en efectos.

**Foco del selector.** El salto al selector al abrir la home se debía a un `focus()` protegido con una bandera de "primer render", que StrictMode anula al montar dos veces. Se compara contra el último paso enfocado: el foco solo se mueve (para lectores de pantalla) cuando el usuario cambia de paso, nunca al cargar.

**Isotipo animado con las piezas oficiales.** GSAP en lugar de Framer Motion: ya estaba instalado para la pantalla de carga y la coreografía (separadas → flotación → unión escalonada → respiración) necesita una línea de tiempo con control fino; añadir una segunda librería no aportaba. Las piezas se cargan como archivos (`next/image`, sin optimizar por ser SVG) desde `public/brand/` en lugar de copiar los trazados al código, para que el SVG entregado sea la única fuente. Como naranja, rosa y morado comparten el viewBox de `simbolo_capas.svg`, la unión precisa es llevar cada capa a desplazamiento cero; no hay coordenadas inventadas. La micro-oscilación final mueve el grupo completo, nunca piezas sueltas, para que la intersección morada siga calzando. Recorridos en % del tamaño del símbolo (escalan solos) y multiplicados por `travelScale` en tablet/móvil. El hero espera a que se retire la pantalla de carga para no animarse detrás de ella. En el hero las tarjetas de ejemplo se movieron a las esquinas opuestas a la dirección en que se separan las piezas; en el CTA el símbolo va en columna propia desde `lg` y como marca pequeña en el margen superior en pantallas menores, para no tapar titulares. El símbolo no se integró en secciones navy existentes porque no se pidió; el tema `navy` está listo y verificado visualmente.
