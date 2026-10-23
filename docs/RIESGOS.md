# RIESGOS Y PENDIENTES

| # | Riesgo / pendiente | Impacto | Mitigación actual |
|---|---|---|---|
| R1 | **No se recibieron archivos oficiales de marca** (logotipo horizontal/vertical, wordmark, isotipo en SVG/PNG). Las capturas del Escritorio son referencias de otros sitios. | Alto (marca) | Wordmark tipográfico provisional (`SumaLogo`, `data-provisional`). Al colocar los SVG en `public/brand/` y registrarlos en `src/content/brand-assets.ts`, el sitio los usa automáticamente. El favicon (`src/app/icon.svg`) ya es el isotipo oficial; la imagen OG sigue siendo tipográfica; la animación oficial del logo (`SumaStudioLogoReveal`) ya contiene los trazos oficiales y se usa como pantalla de carga; el isotipo animado del hero y del cierre usa las piezas oficiales de `public/brand/`. El logo estático de header/footer sigue siendo provisional: `logo_horizontal_transparente.svg` ya está disponible pero su texto es azul marino (no sirve en el footer oscuro) y falta revisar su margen interno antes de registrarlo en `brand-assets.ts`. |
| R2 | Sin proveedor de envío para el formulario. | Alto (conversión) | API responde 503 `not_configured` y la UI lo dice con honestidad. Configurar `CONTACT_WEBHOOK_URL` o Resend. |
| R3 | Sin datos de contacto reales (correo, WhatsApp, redes). | Medio | Campos `null` en `src/content/site.ts`; el footer solo los muestra si existen. |
| R4 | Dominio definitivo desconocido. | Medio (SEO) | `NEXT_PUBLIC_SITE_URL`; sin él, canonical/sitemap usan `http://localhost:3000`. |
| R5 | Aviso de privacidad sin datos del responsable (razón social, domicilio, correo ARCO). | Alto (legal) | Plantilla basada en LFPDPPP con marcadores visibles; requiere revisión legal. |
| R6 | Fotografía de Unsplash (licencia libre), no propia. | Bajo | Créditos en `src/content/photos.ts`. Sustituir por sesión propia cuando exista. |
| R7 | Rate limit en memoria (por instancia). | Bajo | Suficiente para tráfico inicial; usar almacén compartido si se escala. |
| R8 | Google Tag Manager (`GTM-W2CSD45N`) activo sin banner de consentimiento, y el aviso de privacidad aún no menciona cookies ni herramientas de medición. | Medio (legal) | GTM se carga después de la hidratación y no lleva etiquetas propias en el código. Añadir al aviso de privacidad las cookies y herramientas que se configuren en GTM (revisión legal) y, si se requiere, un banner de consentimiento con Consent Mode. |
| R9 | Core Web Vitals no medidos en producción. | Medio | Imágenes optimizadas con `next/image`, fuentes con `next/font`, JS cliente acotado. Medir tras despliegue. |
| R10 | Avisos de `npm audit` en dependencias de desarrollo (no en producción: `npm audit --omit=dev` = 0). | Bajo | Revisar al actualizar herramientas de prueba. |
