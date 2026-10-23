# SUMA STUDIO — sitio web

Sitio multipágina de SUMA STUDIO (*Creaciones y Producciones*): tecnología y experiencias digitales para negocios de bienestar. Desde Monterrey, Nuevo León · Para todo México.

## Requisitos
- Node.js 20+
- npm

## Comandos
```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test
npm run build && npm start
```

## Configuración
Copia `.env.example` a `.env.local` y completa:
- `NEXT_PUBLIC_SITE_URL` — dominio definitivo (canonical, sitemap, OG).
- `CONTACT_WEBHOOK_URL` **o** `RESEND_API_KEY` + `CONTACT_TO_EMAIL` — entrega del formulario. Sin ninguno, el formulario informa que no está conectado (no simula envíos).

## Marca
Los SVG oficiales están en `public/brand/` y los usan la pantalla de carga, el isotipo animado y el favicon (`src/app/icon.svg`, isotipo oficial recortado a cuadrado). El logo de header/footer sigue siendo provisional: para activarlo, regístralo en `src/content/brand-assets.ts`.

## Documentación
- `docs/PRODUCTO.md`, `docs/ARQUITECTURA.md`, `docs/API_CONTRATOS.md`, `docs/TEST_PLAN.md`, `docs/RIESGOS.md`
- `CHANGELOG.md` y `DEVLOG.md` (decisiones)
