# SUMA STUDIO — fichas locales y autoridad: expediente de preparación

**Fecha de revisión:** 9 de noviembre de 2026 (Monterrey)  
**Estado:** preparación interna, NO inscripción ni reclamación de fichas  
**Web canónica:** https://www.sumastudio.mx  
**Modelo confirmado:** atención remota para México y visitas presenciales a clientes. No se ha confirmado un local abierto al público.

> No publicar una dirección real, domicilio de verificación ni horarios inventados en este repositorio. La dirección física para verificar una ficha debe compartirse únicamente con el proveedor correspondiente por el propietario autorizado.

## 1. Elegibilidad y decisiones

| Plataforma | Decisión | Justificación / dependencia |
| --- | --- | --- |
| Google Business Profile | **Preparar ficha de empresa de servicios locales** (sin dirección visible) | SUMA visita clientes. Requiere una base física real y verificación. Confirmar que los desplazamientos se hacen en los municipios seleccionados. No crear/reclamar todavía. |
| Bing Places | **Preparar ficha de servicios en domicilio del cliente** | Bing exige una dirección válida para verificar y algunas empresas pueden ocultarla. No crear/reclamar todavía. |
| Apple Business / Apple Maps | **Posponer la ubicación** | El flujo de ubicación pide dirección verificable, datos asociados y gestión de ubicación. No usar domicilio no visitable como si fuera tienda. |
| LinkedIn Empresa | **No editar `/company/sumastudio/`** | Grok reportó que el propietario no tiene administración de esa página y encontró identidad visual/sector incompatibles. Titularidad NO confirmada; tratarla como posible homónimo. Preparar una página nueva solo con aprobación explícita del propietario. |
| Clutch / Sortlist | **Preparar descripción; registrar después** | Priorizar 2–3 trabajos autorizados y reseñas auténticas. No inventar clientes, métricas ni referencias. |
| GoodFirms / DesignRush | **Baja prioridad** | Primero resultados en Google/Bing, casos y reputación real. |

**Referencias oficiales**:
- Google: https://support.google.com/business/answer/3038177 (empresas de servicios locales, dirección oculta, centros virtuales no elegibles)
- Google: https://support.google.com/business/answer/9157481 (hasta 20 áreas definidas por localidad; zona real aproximada máxima de dos horas conduciendo)
- Bing: https://www.bingplaces.com/Home/Index (validación de dirección; algunas empresas pueden ocultarla)
- Apple: https://support.apple.com/en-ca/guide/business/abcb98816a34/web (requisitos de ubicación)

## 2. Ficha de Google — borrador, no publicar

| Campo | Contenido o estado |
| --- | --- |
| Nombre comercial | **SUMA STUDIO**, sujeto a política de uso real de marca; no añadir «Monterrey», «marketing», ni palabras clave al nombre |
| Modalidad | Empresa que presta servicios en la ubicación de clientes (**service-area business**); **ocultar dirección al público** si no recibe visitantes |
| Categoría principal | Evaluar «Empresa de software» o la categoría disponible que mejor describa actividad principal en el selector real; no elegir categorías solo por SEO |
| Categorías secundarias | Evaluar «Diseñador de sitios web», «Servicio de marketing por Internet» si están disponibles y son veraces |
| Área de servicio | Monterrey, Nuevo León, México, si efectivamente se realizan visitas. Agregar otros municipios **solo con confirmación real**; sin «todo México» como área presencial |
| Web | https://www.sumastudio.mx |
| Teléfono mostrado en sitio (9 nov) | 81 1468 8882 / +52 81 1468 8882; **confirmar que es el canal oficial de SUMA antes de vincularlo a ficha** |
| Correo público | Pendiente de aprobación |
| Horarios de atención | Pendientes de aprobación |
| Dirección para verificación | Pendiente; **no incluir en GitHub ni mostrar al público si no recibe clientes** |
| Logo | https://www.sumastudio.mx/brand/isotipo-512.png |
| Fotografías | Fotografías reales del equipo/trabajo y capturas con permiso. No emplear fotos de Unsplash como prueba de instalaciones |
| URL de reserva | No inventar: actualmente el sitio no demuestra un sistema público de citas de SUMA |

**Descripción preparada (sin afirmar experiencia no documentada):**

> SUMA STUDIO es un estudio creativo y tecnológico especializado en soluciones digitales para negocios de bienestar. Ayudamos a estudios de yoga y pilates, spas, centros fitness boutique y marcas wellness a organizar sus procesos con CRM personalizados, automatización, asistentes digitales, aplicaciones y páginas web. También diseñamos campañas digitales y conectamos las herramientas que cada negocio necesita. Trabajamos en línea con empresas de México y realizamos visitas a clientes en Monterrey cuando el proyecto lo requiere.

**Servicios a describir:** CRM personalizados; automatización de reservas; chatbots y asistentes digitales; aplicaciones; desarrollo web; publicidad digital. No afirmar funciones implementadas en instalaciones de terceros sin pruebas.

## 3. Bing Places — borrador

Reutilizar los mismos datos auténticos, una vez exista consistencia en la web y/o ficha de Google. **No confundir Bing Places con Bing Webmaster Tools**: el primero es un directorio de empresas y el segundo registra e inspecciona el sitio web. Bing puede requerir dirección válida de verificación, aunque no se exponga públicamente.

## 4. LinkedIn, Clutch y Sortlist — descripción base

**Especialización:** tecnología, software e IA aplicada a operación y crecimiento de negocios wellness.

> SUMA STUDIO desarrolla experiencias digitales y herramientas de negocio para estudios de yoga y pilates, spas, marcas wellness y equipos de bienestar. Ayudamos a organizar clientes y reservas mediante CRM, automatizar tareas y consultas con asistentes digitales, crear aplicaciones y sitios web, y conectar campañas de adquisición con procesos de seguimiento. Trabajamos desde Monterrey con negocios en México, de forma remota y con visitas presenciales cuando aplica. Proponemos primero entender el flujo operativo y después decidir si conviene integrar herramientas existentes o construir algo a medida.

**Antes de publicar perfiles:** validar página de LinkedIn, correo de empresa, titularidad, razón social si el formulario la exige, año de fundación, tamaño del equipo, precios verificables, proyectos auténticos y consentimiento de clientes para casos/reseñas.

## 5. Comprobaciones técnicas ya realizadas

- Vercel reportó despliegue de producción READY del commit `0c7e863c` (unificación de contacto WhatsApp).
- Lectura pública de `/guias`, `/guias/software-para-estudios-de-pilates` y `/guias/automatizar-reservas-spa`: se muestran contenido, títulos/canonicals propios y CTAs.
- Sitemap público: **21 URLs**, incluidas las tres rutas de guías; `robots.txt` incluye sitemap.
- La página `/nosotros` ya declara correctamente atención remota para México y visitas presenciales en Monterrey y su área metropolitana. PR #3 fusionado en `main` como commit `c59e4593`; despliegue de producción READY y contenido público comprobado.
- El aviso de privacidad aún es **borrador**; no marcarlo completo sin responsable legal, domicilio y correo reales.
- Search Console: la lectura pública de páginas y sitemap **no permite confirmar su indexación**. Inspeccionar estados en la propiedad verificada.
- La existencia de un enlace de WhatsApp **no equivale** a lead, conversación iniciada ni venta cerrada.

## 6. Próximos pasos controlados

1. Confirmar con el propietario el **correo público, horario, municipio(s) visitados, titularidad de la página LinkedIn y uso empresarial del teléfono** publicado.
2. Preparar fotos reales y dos casos autorizados; no crear reseñas falsas.
3. Completar aviso de privacidad con responsable legítimo y revisión jurídica; luego quitar `noindex` si corresponde.
4. Comprobar seguimiento de conversiones, sin enviar mensajes de prueba a clientes ni contar clics como leads.
5. Verificar indexación real de las 21 URLs en Search Console; importar propiedad a Bing Webmaster Tools solo con sesión/autorización de la cuenta.
6. **No crear, reclamar ni publicar fichas locales** hasta una instrucción explícita posterior.


## 7. Hallazgo de LinkedIn recibido del propietario (9 nov 2026, 20:54 Monterrey)

Grok Bot reporta que el perfil personal del fundador ya fue actualizado para incluir SUMA STUDIO, CRM, asistentes con IA y Precalix. **No es una comprobación independiente de este documento**; no se modifica ese perfil desde GitHub.

- La página `https://www.linkedin.com/company/sumastudio/` no muestra al fundador como administrador y exhibe un giro de producción multimedia y una identidad visual diferente. **No enlazarla en el schema `sameAs`, web, campañas ni fichas de negocios hasta verificar la titularidad.**
- No crear una nueva página sin autorización. Cuando se autorice, buscar primero duplicados y seleccionar una URL pública diferenciada si el nombre simple ya está ocupado.
- En el perfil personal eliminar la aptitud equivocada `Automatización de Marketing Silverpop Engage` usando Grok o edición manual; no afirmar que se eliminó todavía.
- Recomendar el enlace de perfil personal hacia SUMA solo si el propietario quiere que sea su destino comercial principal; Precalix puede figurar como experiencia separada.

### Borrador para eventual página oficial de empresa (NO publicada)

**Nombre visual:** SUMA STUDIO. **Sector:** elegir en LinkedIn la categoría que corresponda mejor al desarrollo de software y servicios tecnológicos reales de la empresa. **Ubicación:** Monterrey, Nuevo León, México.

**Eslogan:** Tecnología que hace fluir negocios de bienestar.

**Acerca de:** SUMA STUDIO es un estudio creativo y tecnológico especializado en negocios wellness. Ayudamos a estudios de yoga y pilates, spas, centros fitness boutique y marcas de bienestar a integrar tecnología en sus operaciones y mejorar la experiencia de sus clientes. Diseñamos CRM personalizados, asistentes para WhatsApp, automatizaciones, aplicaciones y páginas web, además de conectar estrategias de publicidad digital con los procesos de seguimiento. Trabajamos en línea con empresas de México y realizamos visitas presenciales a clientes en Monterrey y su área metropolitana, previa cita. Evaluamos primero los procesos y herramientas existentes para proponer soluciones que realmente tengan sentido para cada negocio.

**Especialidades:** CRM y reservas · Chatbots WhatsApp e IA · Desarrollo web y apps · Automatización de procesos · Marketing digital.

**Enlace:** https://www.sumastudio.mx

**Pendiente:** administración, logo, fecha de fundación, tamaño del equipo y cualquier información legal o comercial exigida por LinkedIn. No asumir que el perfil homónimo puede reclamarse.
