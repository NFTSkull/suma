# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: showroom-real-test.spec.ts >> Showroom - Verificación Real en Preview >> Honeypot detiene spam
- Location: e2e/showroom-real-test.spec.ts:218:3

# Error details

```
Error: Channel closed
```

```
Error: locator.scrollIntoViewIfNeeded: Test ended.
Call log:
  - waiting for locator('text=/Quiero una propuesta/i').first()

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - banner [ref=f2e2]:
    - link "Saltar al contenido" [ref=f2e3] [cursor=pointer]:
      - /url: "#contenido"
    - generic [ref=f2e4]:
      - link "SUMA STUDIO, ir al inicio" [ref=f2e5] [cursor=pointer]:
        - /url: /
        - 'generic "Wordmark provisional: pendiente logotipo oficial" [ref=f2e6]':
          - generic [ref=f2e7]: SUMA
          - generic [ref=f2e8]: Studio
      - button "Menú" [ref=f2e10]
  - main [ref=f2e14]:
    - region "Tu idea, a la vista." [ref=f2e15]:
      - generic [ref=f2e16]:
        - navigation "Ruta de navegación" [ref=f2e17]:
          - list [ref=f2e18]:
            - listitem [ref=f2e19]:
              - link "Inicio" [ref=f2e20] [cursor=pointer]:
                - /url: /
              - generic [aria-hidden] [ref=f2e21]: /
            - listitem [ref=f2e22]:
              - generic [ref=f2e23]: Showroom
        - paragraph [ref=f2e24]: SUMA VISION STUDIO · Interactivo
        - heading "Tu idea, a la vista." [level=1] [ref=f2e25]
        - paragraph [ref=f2e26]: En cuatro pasos ves cómo funcionaría SUMA en tu negocio, estimas qué tendría que pasar para que la inversión te convenga y armas tu propuesta con precios «desde» y rangos orientativos. Sin registro ni compromiso.
        - generic [ref=f2e27]:
          - list "Cómo funciona" [ref=f2e28]:
            - listitem [ref=f2e29]:
              - link "01 Personaliza Tu nombre y estilo en la demo" [ref=f2e30] [cursor=pointer]:
                - /url: "#showroom-construir"
                - generic [ref=f2e31]: "01"
                - generic [ref=f2e32]: Personaliza
                - generic [ref=f2e33]: Tu nombre y estilo en la demo
            - listitem [ref=f2e34]:
              - link "02 Pruébalo Demo interactiva de cada servicio" [ref=f2e35] [cursor=pointer]:
                - /url: "#showroom-explorar"
                - generic [ref=f2e36]: "02"
                - generic [ref=f2e37]: Pruébalo
                - generic [ref=f2e38]: Demo interactiva de cada servicio
            - listitem [ref=f2e39]:
              - link "03 Calcula Qué tendría que pasar, con tus números" [ref=f2e40] [cursor=pointer]:
                - /url: "#showroom-impacto"
                - generic [ref=f2e41]: "03"
                - generic [ref=f2e42]: Calcula
                - generic [ref=f2e43]: Qué tendría que pasar, con tus números
            - listitem [ref=f2e44]:
              - link "04 Tu propuesta Precio, qué incluye y WhatsApp" [ref=f2e45] [cursor=pointer]:
                - /url: "#showroom-cotizar"
                - generic [ref=f2e46]: "04"
                - generic [ref=f2e47]: Tu propuesta
                - generic [ref=f2e48]: Precio, qué incluye y WhatsApp
          - generic [ref=f2e49]:
            - link "Empezar" [ref=f2e50] [cursor=pointer]:
              - /url: "#showroom-construir"
            - link "Ver precios base" [ref=f2e54] [cursor=pointer]:
              - /url: /precios
    - region "Showroom personalizado" [ref=f2e58]:
      - generic [ref=f2e60]:
        - region "Pon tu marca en la demo." [ref=f2e61]:
          - paragraph [ref=f2e62]: 01 · Personaliza
          - heading "Pon tu marca en la demo." [level=2] [ref=f2e63]
          - generic [ref=f2e64]:
            - generic [ref=f2e65]:
              - text: Nombre de tu negocio
              - textbox "Nombre de tu negocio" [ref=f2e66]:
                - /placeholder: Ej. Estudio Aurora
            - generic [ref=f2e67]:
              - text: Giro
              - combobox "Giro" [ref=f2e68]:
                - option "Pilates / yoga" [selected]
                - option "Spa / wellness"
                - option "Fitness boutique"
                - option "Estética / belleza"
                - option "Otro negocio"
            - generic [ref=f2e69]:
              - text: Estilo de la demo
              - combobox "Estilo de la demo" [ref=f2e70]:
                - option "Azul editorial" [selected]
                - option "Almendra"
                - option "Salvia"
          - paragraph [ref=f2e71]: Solo cambia la demo en tu navegador. No se guarda ni se envía.
        - region "Mira cómo podría funcionar." [ref=f2e72]:
          - generic [ref=f2e73]:
            - paragraph [ref=f2e74]: 02 · Pruébalo
            - heading "Mira cómo podría funcionar." [level=2] [ref=f2e75]
            - paragraph [ref=f2e76]: ¿Qué quieres mejorar primero?
            - group "Objetivo principal del negocio" [ref=f2e77]:
              - button "Atraer más clientes" [ref=f2e78]
              - button "Responder mejor" [pressed] [ref=f2e79]
              - button "Ordenar mi operación" [ref=f2e80]
            - group "Experiencias para probar" [ref=f2e81]:
              - button "Operación CRM y seguimiento" [pressed] [ref=f2e82]:
                - generic [ref=f2e83]: Operación
                - generic [ref=f2e84]: CRM y seguimiento
              - button "Atención Chatbot para WhatsApp" [ref=f2e85]:
                - generic [ref=f2e86]: Atención
                - generic [ref=f2e87]: Chatbot para WhatsApp
              - button "Operación Automatizaciones" [ref=f2e88]:
                - generic [ref=f2e89]: Operación
                - generic [ref=f2e90]: Automatizaciones
            - button "Ver las 9 demos ↓" [ref=f2e91]
          - generic [ref=f2e92]:
            - generic "Vista previa interactiva" [ref=f2e93]:
              - generic [ref=f2e94]:
                - generic [ref=f2e95]: Vista previa de tu experiencia
                - generic [ref=f2e100]: DEMO · NO OPERATIVA
              - generic [ref=f2e102]:
                - generic [ref=f2e103]:
                  - generic [ref=f2e104]:
                    - paragraph [ref=f2e105]: CRM comercial · conceptual
                    - heading "Estudio Aurora (ejemplo)" [level=3] [ref=f2e106]
                  - generic [ref=f2e107]: Equipo · 5 personas
                - generic [ref=f2e108]:
                  - generic [ref=f2e109]:
                    - button "Interesados" [pressed] [ref=f2e110]
                    - button "Operación" [ref=f2e111]
                  - generic [ref=f2e112]:
                    - generic [ref=f2e113]:
                      - paragraph [ref=f2e114]: "12"
                      - paragraph [ref=f2e115]: Nuevos
                    - generic [ref=f2e116]:
                      - paragraph [ref=f2e117]: "7"
                      - paragraph [ref=f2e118]: En seguimiento
                    - generic [ref=f2e119]:
                      - paragraph [ref=f2e120]: "4"
                      - paragraph [ref=f2e121]: Visitas previstas
                  - generic [ref=f2e122]:
                    - paragraph [ref=f2e123]: Oportunidad de ejemplo · WhatsApp
                    - generic [ref=f2e124]:
                      - generic [ref=f2e125]:
                        - paragraph [ref=f2e126]: Mariana G.
                        - paragraph [ref=f2e127]: "Preguntó por: Clase de Reformer"
                      - generic [ref=f2e128]: Pendiente
                    - button "Simular seguimiento →" [ref=f2e129]
              - generic [ref=f2e130]: Simulación con datos ficticios · Sin conexiones reales
            - paragraph [ref=f2e131]: "Prototipo con datos ficticios: no envía mensajes, no crea reservas ni se conecta a otras plataformas."
          - generic [ref=f2e132]:
            - paragraph [ref=f2e133]: Estás viendo
            - paragraph [ref=f2e134]: CRM y seguimiento
            - paragraph [ref=f2e135]: Visualiza tus interesados, responsables y próximos pasos.
            - paragraph [ref=f2e136]: Un embudo claro que aprovecha tus herramientas existentes.
            - button "Añadir a mi propuesta +" [ref=f2e137]
            - link "Ver detalles de este servicio →" [ref=f2e138] [cursor=pointer]:
              - /url: /servicios/crm
        - generic [ref=f2e139]:
          - paragraph [ref=f2e140]: El cálculo es opcional. Primero elige una solución; si aún no sabes cuál, puedes solicitar una recomendación.
          - region "¿Qué tendría que pasar para que esta inversión te convenga?" [ref=f2e141]:
            - generic [ref=f2e143]:
              - generic [ref=f2e144]:
                - paragraph [ref=f2e145]: 03 · Calcula con tus números
                - heading "¿Qué tendría que pasar para que esta inversión te convenga?" [level=2] [ref=f2e146]
                - paragraph [ref=f2e147]: Cambia los datos por los de tu negocio y mira el cálculo paso a paso. Es una simulación, no una promesa de resultados.
              - list "Cómo leer esta simulación" [ref=f2e148]:
                - listitem [ref=f2e149]: Ejemplo
                - listitem [ref=f2e150]: Tu dato
                - listitem [ref=f2e151]: Supuesto
                - listitem [ref=f2e152]: Resultado no garantizado
            - generic [ref=f2e153]:
              - generic [ref=f2e155]:
                - generic [ref=f2e157]:
                  - heading "1. Tus números" [level=3] [ref=f2e158]
                  - paragraph [ref=f2e159]: Partimos de un estudio de ejemplo. Cambia lo que sepas.
                - generic [ref=f2e160]:
                  - generic [ref=f2e161]:
                    - generic [ref=f2e162]:
                      - generic [ref=f2e163]: Consultas nuevas al mes
                      - generic [ref=f2e164]: Ejemplo
                    - spinbutton "Consultas nuevas al mes" [ref=f2e165]: "180"
                    - paragraph [ref=f2e166]: Mensajes o interesados únicos, no seguidores.
                  - generic [ref=f2e167]:
                    - generic [ref=f2e168]:
                      - generic [ref=f2e169]: "% que queda sin respuesta o seguimiento"
                      - generic [ref=f2e170]: Ejemplo
                    - spinbutton "% que queda sin respuesta o seguimiento" [ref=f2e171]: "30"
                    - paragraph [ref=f2e172]: Tu mejor estimación.
                  - generic [ref=f2e173]:
                    - generic [ref=f2e174]:
                      - generic [ref=f2e175]: Ingreso por cliente nuevo (MXN)
                      - generic [ref=f2e176]: Ejemplo
                    - spinbutton "Ingreso por cliente nuevo (MXN)" [ref=f2e177]: "1800"
                    - paragraph [ref=f2e178]: Solo la primera compra, sin contar pagos futuros.
                  - generic [ref=f2e179]:
                    - generic [ref=f2e180]:
                      - generic [ref=f2e181]: Margen que te queda (%)
                      - generic [ref=f2e182]: Ejemplo
                    - spinbutton "Margen que te queda (%)" [ref=f2e183]: "60"
                    - paragraph [ref=f2e184]: Lo que queda tras costos variables (instructor, insumos).
                - group [ref=f2e185]:
                  - generic "Supuestos avanzados y ahorro de tiempo" [ref=f2e186] [cursor=pointer]
                - paragraph [ref=f2e187]: "Privacidad: se calcula en tu navegador y no se guarda. Solo si pulsas el botón de WhatsApp se prepara un mensaje editable."
              - generic [ref=f2e188]:
                - heading "2. El resultado" [level=3] [ref=f2e189]
                - generic [ref=f2e190]:
                  - generic [ref=f2e191]:
                    - paragraph [ref=f2e192]:
                      - text: Escenario
                      - generic [ref=f2e193]: Supuesto
                    - group "Escenario de impacto" [ref=f2e194]:
                      - button "Conservador" [ref=f2e195]
                      - button "Base" [pressed] [ref=f2e196]
                      - button "Optimista" [ref=f2e197]
                  - generic [ref=f2e198]:
                    - paragraph [ref=f2e199]: Periodo a evaluar
                    - group "Periodo a evaluar" [ref=f2e200]:
                      - button "1 m" [ref=f2e201]
                      - button "3 m" [pressed] [ref=f2e202]
                      - button "6 m" [ref=f2e203]
                      - button "12 m" [ref=f2e204]
                - generic [ref=f2e205]:
                  - generic [ref=f2e206]:
                    - paragraph [ref=f2e207]: Oportunidad si alguien atiende esas consultas
                    - generic [ref=f2e208]: No garantizado
                  - generic [ref=f2e209]:
                    - generic [ref=f2e210]:
                      - term [ref=f2e211]:
                        - generic [ref=f2e212]: Clientes nuevos estimados
                        - generic [ref=f2e213]: 54 sin respuesta × 40% recuperadas × 25% compran
                      - definition [ref=f2e214]: "5.4"
                    - generic [ref=f2e215]:
                      - term [ref=f2e216]:
                        - generic [ref=f2e217]: Ingresos adicionales estimados
                        - generic [ref=f2e218]: × $1,800 por cliente
                      - definition [ref=f2e219]: $9,720
                    - generic [ref=f2e220]:
                      - term [ref=f2e221]:
                        - generic [ref=f2e222]: Margen estimado
                        - generic [ref=f2e223]: 60% de margen tras costos variables
                      - definition [ref=f2e224]: $5,832
                  - paragraph [ref=f2e225]: Elige al menos un módulo en el paso 4 para restar la inversión de SUMA.
                - generic [ref=f2e226]:
                  - strong [ref=f2e227]: "Importante:"
                  - text: esta oportunidad solo existe si alguien responde y da seguimiento a esas consultas. Publicidad, SEO, web, reservador o app no lo hacen por sí solos, así que no la comparamos contra tu mensualidad ni estimamos horas liberadas. Para que aplique, añade CRM, chatbot o automatización en el paso 4.
                - group [ref=f2e228]:
                  - generic "Cómo se calcula y qué no incluye" [ref=f2e229] [cursor=pointer]
                - link "Quiero que SUMA revise mis números →" [ref=f2e230] [cursor=pointer]:
                  - /url: https://wa.me/528114688882?text=Hola%2C%20SUMA.%20Quiero%20revisar%20una%20simulaci%C3%B3n%20con%20datos%20reales.%0AMe%20interesa%3A%20una%20recomendaci%C3%B3n.%0A%C2%BFPodemos%20revisar%20lo%20que%20incluye%3F
                - paragraph [ref=f2e231]: Abre WhatsApp con un mensaje editable · No contratas ni reservas nada.
            - paragraph [ref=f2e233]:
              - strong [ref=f2e234]: "Contexto:"
              - text: estudios como
              - link "HBR 2011 (respuesta a prospectos) ↗" [ref=f2e235] [cursor=pointer]:
                - /url: https://hbr.org/2011/03/the-short-life-of-online-sales-leads
              - text: "y"
              - link "Mindbody 2025 (retención wellness) ↗" [ref=f2e236] [cursor=pointer]:
                - /url: https://www.mindbodyonline.com/business/education/research-reports/2025-state-industry-report
              - text: explican por qué importa responder rápido, pero sus cifras no son resultados prometidos por SUMA.
        - region "Elige qué contratar y ve cuánto pagarías." [ref=f2e237]:
          - generic [ref=f2e238]:
            - paragraph [ref=f2e239]: 04 · Tu propuesta
            - heading "Elige qué contratar y ve cuánto pagarías." [level=2] [ref=f2e240]
            - paragraph [ref=f2e241]: Prueba la opción básica de cada servicio. Te mostramos cuánto puede variar el presupuesto, antes de IVA.
          - generic [ref=f2e242]:
            - generic [ref=f2e243]:
              - group "¿Cómo prefieres contratar?" [ref=f2e244]:
                - generic [ref=f2e246]:
                  - button "Por módulos" [pressed] [ref=f2e247]
                  - button "Paquete + extras" [ref=f2e248]
              - group "Módulos" [ref=f2e249]:
                - paragraph [ref=f2e251]: Recomendados para «responder mejor». Los importes mínimos son para la versión sencilla de cada servicio.
                - generic [ref=f2e252]:
                  - generic [ref=f2e253]:
                    - heading "Atención" [level=3] [ref=f2e254]
                    - generic [ref=f2e255]:
                      - generic [ref=f2e256] [cursor=pointer]:
                        - checkbox "Organizar clientes (CRM)" [ref=f2e257]
                        - generic [ref=f2e258]:
                          - generic [ref=f2e259]: Organizar clientes (CRM)
                          - generic [ref=f2e260]: Desde $2,490 inicial · $1,490–$3,900/mes
                      - generic [ref=f2e261] [cursor=pointer]:
                        - checkbox "Asistente con IA para WhatsApp" [ref=f2e262]
                        - generic [ref=f2e263]:
                          - generic [ref=f2e264]: Asistente con IA para WhatsApp
                          - generic [ref=f2e265]: Desde $6,900 inicial · $1,990–$6,900/mes
                  - generic [ref=f2e266]:
                    - heading "Operación" [level=3] [ref=f2e267]
                    - generic [ref=f2e269] [cursor=pointer]:
                      - checkbox "Una tarea automática" [ref=f2e270]
                      - generic [ref=f2e271]:
                        - generic [ref=f2e272]: Una tarea automática
                        - generic [ref=f2e273]: Desde $1,490 inicial · pago único
                - button "Ver los 13 módulos (10 más) ↓" [ref=f2e274]
              - generic [ref=f2e275]:
                - generic [ref=f2e276]:
                  - text: Personas del equipo
                  - combobox "Personas del equipo" [ref=f2e277]:
                    - option "1"
                    - option "5" [selected]
                    - option "10"
                    - option "25"
                    - option "50"
                    - option "100"
                    - option "500 o más"
                - generic [ref=f2e278]:
                  - text: Sedes
                  - combobox "Sedes" [ref=f2e279]:
                    - option "1" [selected]
                    - option "2"
                    - option "3"
                    - option "4"
                    - option "5"
                    - option "10 o más"
                - generic [ref=f2e280]:
                  - text: Periodo
                  - combobox "Periodo" [ref=f2e281]:
                    - option "1 mes"
                    - option "3 meses" [selected]
                    - option "6 meses"
                    - option "12 meses"
              - generic [ref=f2e282]:
                - generic [ref=f2e283]:
                  - text: Qué usas hoy
                  - combobox "Qué usas hoy" [ref=f2e284]:
                    - option "WhatsApp / Instagram" [selected]
                    - option "Fitco / Fitune"
                    - option "Wellhub / TotalPass / Fitpass"
                    - option "CRM existente"
                    - option "Sitio o reservador propio"
                    - option "Aún no utilizo herramientas"
                    - option "Otra herramienta"
                - generic [ref=f2e285]:
                  - text: Algo más (opcional)
                  - textbox "Algo más (opcional)" [ref=f2e286]:
                    - /placeholder: Ej. Seguimiento de membresías y reservas en Fitco.
            - generic [ref=f2e288]:
              - paragraph [ref=f2e289]: Tu propuesta estimada
              - paragraph [ref=f2e290]: Elige al menos un módulo para ver cuánto pagarías.
              - paragraph [ref=f2e291]: "Sin cargo de SUMA por persona del equipo. Aparte: licencias de software, WhatsApp API, consumo de IA, hosting y publicidad."
              - link "Enviar mi propuesta por WhatsApp →" [ref=f2e292] [cursor=pointer]:
                - /url: https://wa.me/528114688882?text=Hola%2C%20SUMA.%20Quiero%20una%20propuesta.%0AMe%20interesa%3A%20una%20recomendaci%C3%B3n.%0A%C2%BFPodemos%20revisar%20lo%20que%20incluye%3F
              - paragraph [ref=f2e293]: Abre WhatsApp con un mensaje que puedes editar. Nada se envía sin ti.
              - group [ref=f2e294]:
                - generic "¿Tienes un presupuesto definido?" [ref=f2e295] [cursor=pointer]
              - group [ref=f2e296]:
                - generic "¿Prefieres verlo en una llamada?" [ref=f2e297] [cursor=pointer]
                - option "Por definir" [selected]
                - option "Entre semana, mañanas"
                - option "Entre semana, tardes"
                - option "Horario flexible"
              - paragraph [ref=f2e298]: La opción básica empieza en el importe menor. El rango es orientativo, no un límite máximo ni una cotización. Confirmamos alcance y gastos externos antes de contratar.
          - generic [ref=f2e299]:
            - heading "Así sería la implementación" [level=3] [ref=f2e300]
            - paragraph [ref=f2e301]: Los tiempos se definen en el diagnóstico según el alcance. No se conecta nada sin revisar permisos y viabilidad contigo.
            - list [ref=f2e302]:
              - listitem [ref=f2e303]:
                - paragraph [ref=f2e304]: 01Descubrimos
                - paragraph [ref=f2e305]: Escuchamos cómo funciona tu negocio, qué necesitas y qué te gustaría mejorar.
              - listitem [ref=f2e306]:
                - paragraph [ref=f2e307]: 02Diseñamos
                - paragraph [ref=f2e308]: Convertimos tus necesidades en una propuesta clara, visual y funcional.
              - listitem [ref=f2e309]:
                - paragraph [ref=f2e310]: 03Construimos
                - paragraph [ref=f2e311]: Desarrollamos y conectamos las herramientas que forman parte de tu solución.
              - listitem [ref=f2e312]:
                - paragraph [ref=f2e313]: 04Evolucionamos
                - paragraph [ref=f2e314]: Revisamos lo que funciona y buscamos oportunidades para seguir mejorando.
        - region [ref=f2e315]:
          - generic [ref=f2e316]:
            - generic [ref=f2e317]:
              - paragraph [ref=f2e318]: Solicitar propuesta
              - heading "¿Te interesa? Armemos tu propuesta." [level=3] [ref=f2e319]
              - paragraph [ref=f2e320]: Cuéntanos qué necesitas y te recomendaremos una solución.
            - generic [ref=f2e321]:
              - generic [ref=f2e322]:
                - generic [ref=f2e323]: Tu nombre *
                - textbox "Tu nombre *" [ref=f2e324]
              - generic [ref=f2e325]:
                - generic [ref=f2e326]: Nombre de tu negocio *
                - textbox "Nombre de tu negocio *" [ref=f2e327]
              - generic [ref=f2e328]:
                - generic [ref=f2e329]:
                  - text: Correo electrónico
                  - textbox "Correo electrónico" [ref=f2e330]
                - generic [ref=f2e331]:
                  - text: WhatsApp
                  - textbox "WhatsApp" [ref=f2e332]:
                    - /placeholder: 10 dígitos
              - paragraph [ref=f2e333]: Proporciona al menos un correo o WhatsApp para que podamos contactarte.
              - generic [ref=f2e334]:
                - text: ¿Qué necesitas? (opcional)
                - textbox "¿Qué necesitas? (opcional)" [ref=f2e335]:
                  - /placeholder: Ej. Necesito organizar consultas y enviar recordatorios automáticos.
              - generic [ref=f2e336] [cursor=pointer]:
                - checkbox "Quiero una sesión de diagnóstico personalizada (coordinamos por WhatsApp)" [ref=f2e337]
                - generic [ref=f2e338]: Quiero una sesión de diagnóstico personalizada (coordinamos por WhatsApp)
              - generic [ref=f2e339] [cursor=pointer]:
                - checkbox "Acepto el aviso de privacidad *" [ref=f2e340]
                - generic [ref=f2e341]:
                  - text: Acepto el
                  - link "aviso de privacidad" [ref=f2e342]:
                    - /url: /privacidad
                  - text: "*"
              - button "Enviar solicitud →" [ref=f2e343]
              - paragraph [ref=f2e344]: No enviamos mensajes automáticos. Revisaremos tu solicitud y te contactaremos personalmente.
    - region "¿Tu proyecto necesita algo más especial?" [ref=f2e345]:
      - generic [ref=f2e347]:
        - heading "¿Tu proyecto necesita algo más especial?" [level=2] [ref=f2e349]
        - paragraph [ref=f2e351]: Envíanos tu configuración por WhatsApp o pide una sesión de diagnóstico. Te diremos qué es factible y cuál sería la propuesta real.
        - generic [ref=f2e352]:
          - link "Hablemos por WhatsApp" [ref=f2e353] [cursor=pointer]:
            - /url: https://wa.me/528114688882?text=Hola%2C%20vi%20SUMA%20STUDIO%20y%20me%20gustar%C3%ADa%20platicar%20sobre%20un%20proyecto.
          - link "Consultar precios y paquetes" [ref=f2e357] [cursor=pointer]:
            - /url: /precios
  - contentinfo [ref=f2e361]:
    - generic [ref=f2e362]:
      - generic [ref=f2e363]:
        - generic [ref=f2e364]:
          - 'generic "Wordmark provisional: pendiente logotipo oficial" [ref=f2e365]':
            - generic [ref=f2e366]: SUMA
            - generic [ref=f2e367]: Studio
          - paragraph [ref=f2e368]: Creaciones y Producciones
          - paragraph [ref=f2e369]: Tecnología y experiencias digitales para negocios de bienestar.
          - paragraph [ref=f2e370]: Desde Monterrey, Nuevo León · Para todo México
          - list [ref=f2e371]:
            - listitem [ref=f2e372]:
              - link "WhatsApp · 81 1468 8882" [ref=f2e373] [cursor=pointer]:
                - /url: https://wa.me/528114688882?text=Hola%2C%20vi%20SUMA%20STUDIO%20y%20me%20gustar%C3%ADa%20platicar%20sobre%20un%20proyecto.
            - listitem [ref=f2e374]:
              - link "Llamar al 81 1468 8882" [ref=f2e375] [cursor=pointer]:
                - /url: tel:+528114688882
          - navigation "Redes sociales de SUMA STUDIO" [ref=f2e376]:
            - list [ref=f2e377]:
              - listitem [ref=f2e378]:
                - link "LinkedIn · SUMA STUDIO" [ref=f2e379] [cursor=pointer]:
                  - /url: https://www.linkedin.com/company/sumastudio-tecnologia/
          - link "Hablemos por WhatsApp" [ref=f2e380] [cursor=pointer]:
            - /url: https://wa.me/528114688882?text=Hola%2C%20vi%20SUMA%20STUDIO%20y%20me%20gustar%C3%ADa%20platicar%20sobre%20un%20proyecto.
        - navigation "Pie de página" [ref=f2e384]:
          - generic [ref=f2e385]:
            - heading "Estudio" [level=2] [ref=f2e386]
            - list [ref=f2e387]:
              - listitem [ref=f2e388]:
                - link "Inicio" [ref=f2e389] [cursor=pointer]:
                  - /url: /
              - listitem [ref=f2e390]:
                - link "Soluciones" [ref=f2e391] [cursor=pointer]:
                  - /url: /soluciones
              - listitem [ref=f2e392]:
                - link "Showroom interactivo" [ref=f2e393] [cursor=pointer]:
                  - /url: /showroom
              - listitem [ref=f2e394]:
                - link "Cómo trabajamos" [ref=f2e395] [cursor=pointer]:
                  - /url: /como-trabajamos
              - listitem [ref=f2e396]:
                - link "Precios y paquetes" [ref=f2e397] [cursor=pointer]:
                  - /url: /precios
              - listitem [ref=f2e398]:
                - link "Guías prácticas" [ref=f2e399] [cursor=pointer]:
                  - /url: /guias
              - listitem [ref=f2e400]:
                - link "El estudio" [ref=f2e401] [cursor=pointer]:
                  - /url: /nosotros
              - listitem [ref=f2e402]:
                - link "Contacto" [ref=f2e403] [cursor=pointer]:
                  - /url: /contacto
          - generic [ref=f2e404]:
            - heading "Servicios" [level=2] [ref=f2e405]
            - list [ref=f2e406]:
              - listitem [ref=f2e407]:
                - link "Chatbots" [ref=f2e408] [cursor=pointer]:
                  - /url: /servicios/chatbots
              - listitem [ref=f2e409]:
                - link "CRM" [ref=f2e410] [cursor=pointer]:
                  - /url: /servicios/crm
              - listitem [ref=f2e411]:
                - link "Apps" [ref=f2e412] [cursor=pointer]:
                  - /url: /servicios/aplicaciones-moviles
              - listitem [ref=f2e413]:
                - link "Web" [ref=f2e414] [cursor=pointer]:
                  - /url: /servicios/paginas-web
              - listitem [ref=f2e415]:
                - link "Publicidad" [ref=f2e416] [cursor=pointer]:
                  - /url: /servicios/publicidad-digital
          - generic [ref=f2e417]:
            - heading "Industrias" [level=2] [ref=f2e418]
            - list [ref=f2e419]:
              - listitem [ref=f2e420]:
                - link "Estudios de Yoga y Pilates" [ref=f2e421] [cursor=pointer]:
                  - /url: /industrias/yoga-pilates
              - listitem [ref=f2e422]:
                - link "Spas y centros de bienestar" [ref=f2e423] [cursor=pointer]:
                  - /url: /industrias/spas
              - listitem [ref=f2e424]:
                - link "Fitness Boutique" [ref=f2e425] [cursor=pointer]:
                  - /url: /industrias/fitness-boutique
              - listitem [ref=f2e426]:
                - link "Marcas Wellness" [ref=f2e427] [cursor=pointer]:
                  - /url: /industrias/marcas-wellness
              - listitem [ref=f2e428]:
                - link "Experiencias y Retiros" [ref=f2e429] [cursor=pointer]:
                  - /url: /industrias/experiencias-retiros
              - listitem [ref=f2e430]:
                - link "Profesionales de Bienestar" [ref=f2e431] [cursor=pointer]:
                  - /url: /industrias/profesionales-bienestar
      - paragraph [aria-hidden] [ref=f2e432]: SUMA
      - generic [ref=f2e433]:
        - paragraph [ref=f2e434]: © 2026 SUMA STUDIO · Creaciones y Producciones
        - list [ref=f2e435]:
          - listitem [ref=f2e436]:
            - link "Aviso de privacidad" [ref=f2e437] [cursor=pointer]:
              - /url: /aviso-de-privacidad
          - listitem [ref=f2e438]:
            - button "Preferencias de privacidad" [ref=f2e439]
          - listitem [ref=f2e440]: "Fotografía: Unsplash"
  - alert [ref=f2e441]
  - region "Tu privacidad, tu decisión" [ref=f2e442]:
    - heading "Tu privacidad, tu decisión" [level=2] [ref=f2e443]
    - paragraph [ref=f2e445]:
      - text: Con tu permiso usamos Google Analytics para saber qué páginas se visitan y mejorar el sitio. No usamos cookies publicitarias.
      - link "Aviso de privacidad" [ref=f2e446] [cursor=pointer]:
        - /url: /aviso-de-privacidad
    - generic [ref=f2e447]:
      - button "Rechazar" [ref=f2e448]
      - button "Aceptar estadísticas" [ref=f2e450]
```

# Test source

```ts
  125 |       console.log("⚠️  API retornó 503 (sin configuración Resend, esperado en preview)");
  126 |       expect(responseBody.error).toBe("not_configured");
  127 |     } else if (apiStatus === 200) {
  128 |       console.log("✅ API retornó 200 (Resend configurado o anti-spam silencioso)");
  129 |       expect(responseBody.ok).toBe(true);
  130 |       
  131 |       // Si delivered, verificar evento GA4
  132 |       if (responseBody.delivered) {
  133 |         await page.waitForTimeout(1000);
  134 |         events = await getDataLayerEvents(page);
  135 |         const hasGenerateLead = events.some(e => e.event === "generate_lead");
  136 |         console.log("📊 Evento generate_lead:", hasGenerateLead ? "✅ Disparado" : "❌ No disparado");
  137 |         expect(hasGenerateLead).toBe(true);
  138 |       }
  139 |     } else {
  140 |       console.log(`⚠️  API retornó ${apiStatus}:`, responseBody);
  141 |     }
  142 | 
  143 |     // Verificar que el tiempo está bajo el objetivo
  144 |     expect(durationSeconds).toBeLessThan(120);
  145 |     console.log("✅ Flujo completo en tiempo aceptable");
  146 |   });
  147 | 
  148 |   test("Desktop: Flujo completo", async ({ page }) => {
  149 |     await page.setViewportSize({ width: 1920, height: 1080 });
  150 |     
  151 |     await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}&utm_source=test`);
  152 |     await page.waitForLoadState("networkidle");
  153 |     
  154 |     await page.screenshot({ path: "/opt/cursor/artifacts/05-desktop-landing.png", fullPage: false });
  155 | 
  156 |     // Personalizar
  157 |     await page.fill('input[name="businessName"]', "Desktop Test Studio");
  158 |     
  159 |     // Modo paquete
  160 |     const packageButton = page.locator('button[type="button"]').filter({ hasText: /Paquete.*extras/i });
  161 |     if (await packageButton.isVisible({ timeout: 2000 }).catch(() => false)) {
  162 |       await packageButton.click();
  163 |       await page.waitForTimeout(500);
  164 |       console.log("✅ Modo paquete seleccionado");
  165 |     }
  166 | 
  167 |     await page.screenshot({ path: "/opt/cursor/artifacts/06-desktop-package.png", fullPage: false });
  168 | 
  169 |     // Scroll y llenar formulario
  170 |     const formHeading = page.locator("text=/Quiero una propuesta/i").first();
  171 |     await formHeading.scrollIntoViewIfNeeded();
  172 |     
  173 |     await page.fill('input[name="nombre"]', "Ana Desktop Test");
  174 |     await page.fill('input[name="negocio"]', "Wellness Desktop");
  175 |     await page.fill('input[name="email"]', "desktop-test@example.com");
  176 |     await page.locator('input[type="checkbox"][name="privacidad"]').check();
  177 | 
  178 |     await page.screenshot({ path: "/opt/cursor/artifacts/07-desktop-form.png", fullPage: false });
  179 | 
  180 |     const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Enviar|Solicitar/i });
  181 |     const responsePromise = page.waitForResponse(
  182 |       response => response.url().includes("/api/showroom-lead"),
  183 |       { timeout: 15000 }
  184 |     );
  185 |     
  186 |     await submitButton.click();
  187 |     const response = await responsePromise;
  188 |     const responseBody = await response.json();
  189 |     
  190 |     console.log("📡 Desktop API Response:", response.status(), responseBody);
  191 |     
  192 |     await page.waitForTimeout(1000);
  193 |     await page.screenshot({ path: "/opt/cursor/artifacts/08-desktop-success.png", fullPage: false });
  194 |   });
  195 | 
  196 |   test("Validación de campos requeridos", async ({ page }) => {
  197 |     await page.setViewportSize({ width: 390, height: 844 });
  198 |     
  199 |     await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}`);
  200 |     await page.waitForLoadState("networkidle");
  201 | 
  202 |     const formHeading = page.locator("text=/Quiero una propuesta/i").first();
  203 |     await formHeading.scrollIntoViewIfNeeded();
  204 | 
  205 |     // Intentar submit sin llenar nada
  206 |     const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Enviar|Solicitar/i });
  207 |     await submitButton.click();
  208 | 
  209 |     // Verificar mensajes de error (HTML5 validation o custom)
  210 |     await page.waitForTimeout(1000);
  211 |     
  212 |     // Capturar screenshot con errores
  213 |     await page.screenshot({ path: "/opt/cursor/artifacts/09-validation-errors.png", fullPage: true });
  214 |     
  215 |     console.log("✅ Validación de campos probada");
  216 |   });
  217 | 
  218 |   test("Honeypot detiene spam", async ({ page }) => {
  219 |     await page.setViewportSize({ width: 390, height: 844 });
  220 |     
  221 |     await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}`);
  222 |     await page.waitForLoadState("networkidle");
  223 | 
  224 |     const formHeading = page.locator("text=/Quiero una propuesta/i").first();
> 225 |     await formHeading.scrollIntoViewIfNeeded();
      |                       ^ Error: locator.scrollIntoViewIfNeeded: Test ended.
  226 | 
  227 |     // Llenar honeypot
  228 |     await page.evaluate(() => {
  229 |       const honeypot = document.querySelector('input[name="sitio"]') as HTMLInputElement;
  230 |       if (honeypot) honeypot.value = "spam-bot";
  231 |     });
  232 | 
  233 |     // Llenar campos válidos
  234 |     await page.fill('input[name="nombre"]', "Spammer");
  235 |     await page.fill('input[name="negocio"]', "Spam Inc");
  236 |     await page.fill('input[name="email"]', "spam@spam.com");
  237 |     await page.locator('input[type="checkbox"][name="privacidad"]').check();
  238 | 
  239 |     const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Enviar|Solicitar/i });
  240 |     const responsePromise = page.waitForResponse(
  241 |       response => response.url().includes("/api/showroom-lead"),
  242 |       { timeout: 15000 }
  243 |     );
  244 |     
  245 |     await submitButton.click();
  246 |     const response = await responsePromise;
  247 |     const responseBody = await response.json();
  248 |     
  249 |     console.log("🛡️  Honeypot test response:", response.status(), responseBody);
  250 |     
  251 |     // Debe ser 200 pero ok sin delivered (descarte silencioso)
  252 |     expect(response.status()).toBe(200);
  253 |     expect(responseBody.ok).toBe(true);
  254 |     expect(responseBody.delivered).toBeUndefined();
  255 |     
  256 |     // No debe disparar generate_lead
  257 |     await page.waitForTimeout(1000);
  258 |     const events = await getDataLayerEvents(page);
  259 |     const hasGenerateLead = events.some(e => e.event === "generate_lead");
  260 |     expect(hasGenerateLead).toBe(false);
  261 |     
  262 |     console.log("✅ Honeypot funcionando correctamente (descarte silencioso)");
  263 |   });
  264 | 
  265 |   test("Verificar eventos GA4 completos", async ({ page }) => {
  266 |     await page.setViewportSize({ width: 390, height: 844 });
  267 |     
  268 |     await page.goto(`${PREVIEW_URL}/showroom?_vercel_share=${VERCEL_SHARE}&utm_source=test`);
  269 |     await page.waitForLoadState("networkidle");
  270 |     await page.waitForTimeout(500);
  271 | 
  272 |     let events = await getDataLayerEvents(page);
  273 |     console.log("📊 Eventos iniciales:", events.map(e => e.event));
  274 |     expect(events.some(e => e.event === "showroom_visit")).toBe(true);
  275 | 
  276 |     // Cambiar demo si es posible
  277 |     const demoButtons = await page.locator('button[type="button"]').filter({ hasText: /Chatbot|CRM|Web/i }).all();
  278 |     if (demoButtons.length > 0) {
  279 |       await demoButtons[0].click();
  280 |       await page.waitForTimeout(500);
  281 |       events = await getDataLayerEvents(page);
  282 |       console.log("📊 Después de cambiar demo:", events.map(e => e.event));
  283 |     }
  284 | 
  285 |     // Hacer cambio en configuración
  286 |     const checkboxes = await page.locator('input[type="checkbox"]').all();
  287 |     if (checkboxes.length > 0) {
  288 |       await checkboxes[0].check();
  289 |       await page.waitForTimeout(2000); // Debounce
  290 |       events = await getDataLayerEvents(page);
  291 |       console.log("📊 Después de config:", events.map(e => e.event));
  292 |     }
  293 | 
  294 |     // Scroll a formulario
  295 |     const formHeading = page.locator("text=/Quiero una propuesta/i").first();
  296 |     await formHeading.scrollIntoViewIfNeeded();
  297 |     await page.waitForTimeout(500);
  298 |     events = await getDataLayerEvents(page);
  299 |     expect(events.some(e => e.event === "showroom_proposal_requested")).toBe(true);
  300 | 
  301 |     console.log("✅ Todos los eventos GA4 verificados:", events.map(e => e.event));
  302 |   });
  303 | });
  304 | 
```