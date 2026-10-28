# Prueba aislada de Precalix B2B desde Suma Studio

Esta carpeta prueba cómo un proyecto diferente consume la API de Precalix, sin conectar el sitio comercial de Suma ni modificar sus páginas o ventas.

**Estado:** rama test/precalix-b2b-sandbox, NO fusionada con main. No hay NSS reales, Stripe ni consultas al portal.

## Pruebas automáticas (sin red ni créditos)

Ejecutar: `node --test integraciones/precalix/cliente.test.mjs`

Se simulan respuestas HTTP y se verifican el POST, GET, NSS ausente de la URL, aislamiento de claves pcx_test_ y pcx_b2b_, errores y Retry-After.

## Conectar al sandbox cuando Precalix habilite acceso al entorno

Importar `crearClientePrecalix` desde `./cliente.mjs` en el BACKEND del proyecto.
Configurar `modo: "sandbox"`, `apiKey: process.env.PRECALIX_B2B_SANDBOX_KEY`,
y `baseUrl: process.env.PRECALIX_B2B_BASE_URL`.
Usar únicamente NSS ficticio `00000000000` y UUID de prueba.

El despliegue Preview de Precalix está protegido por Vercel. La prueba directa
requiere acceso Vercel autorizado. NO deshabilitar la protección global.
Para probar de forma independiente se puede usar el servidor local de Precalix.

En Suma no hay rutas públicas conectadas al servicio: sin variables configuradas
no hay consultas. No añadir claves a frontend, NEXT_PUBLIC_, repos ni logs.
El módulo no modifica el sitio productivo de Suma Studio.
