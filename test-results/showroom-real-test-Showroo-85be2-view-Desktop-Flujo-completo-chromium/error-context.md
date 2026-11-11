# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: showroom-real-test.spec.ts >> Showroom - Verificación Real en Preview >> Desktop: Flujo completo
- Location: e2e/showroom-real-test.spec.ts:148:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.fill: Test timeout of 120000ms exceeded.
Call log:
  - waiting for locator('input[name="businessName"]')

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
      - navigation "Principal" [ref=f2e9]:
        - list [ref=f2e10]:
          - listitem [ref=f2e11]:
            - link "Inicio" [ref=f2e12] [cursor=pointer]:
              - /url: /
          - listitem [ref=f2e13]:
            - link "Soluciones" [ref=f2e14] [cursor=pointer]:
              - /url: /soluciones
          - listitem [ref=f2e15]:
            - button "Servicios" [ref=f2e17]
          - listitem [ref=f2e20]:
            - button "Industrias" [ref=f2e22]
          - listitem [ref=f2e25]:
            - link "Precios" [ref=f2e26] [cursor=pointer]:
              - /url: /precios
          - listitem [ref=f2e27]:
            - link "Showroom" [ref=f2e28] [cursor=pointer]:
              - /url: /showroom
          - listitem [ref=f2e30]:
            - link "Contacto" [ref=f2e31] [cursor=pointer]:
              - /url: /contacto
      - link "Hablemos por WhatsApp" [ref=f2e34] [cursor=pointer]:
        - /url: https://wa.me/528114688882?text=Hola%2C%20vi%20SUMA%20STUDIO%20y%20me%20gustar%C3%ADa%20platicar%20sobre%20un%20proyecto.
  - main [ref=f2e38]:
    - region "Tu idea, a la vista." [ref=f2e39]:
      - generic [ref=f2e40]:
        - navigation "Ruta de navegación" [ref=f2e41]:
          - list [ref=f2e42]:
            - listitem [ref=f2e43]:
              - link "Inicio" [ref=f2e44] [cursor=pointer]:
                - /url: /
              - generic [aria-hidden] [ref=f2e45]: /
            - listitem [ref=f2e46]:
              - generic [ref=f2e47]: Showroom
        - paragraph [ref=f2e48]: SUMA VISION STUDIO · Interactivo
        - heading "Tu idea, a la vista." [level=1] [ref=f2e49]
        - paragraph [ref=f2e50]: En cuatro pasos ves cómo funcionaría SUMA en tu negocio, estimas qué tendría que pasar para que la inversión te convenga y armas tu propuesta con precios «desde» y rangos orientativos. Sin registro ni compromiso.
        - generic [ref=f2e51]:
          - list "Cómo funciona" [ref=f2e52]:
            - listitem [ref=f2e53]:
              - link "01 Personaliza Tu nombre y estilo en la demo" [ref=f2e54] [cursor=pointer]:
                - /url: "#showroom-construir"
                - generic [ref=f2e55]: "01"
                - generic [ref=f2e56]: Personaliza
                - generic [ref=f2e57]: Tu nombre y estilo en la demo
            - listitem [ref=f2e58]:
              - link "02 Pruébalo Demo interactiva de cada servicio" [ref=f2e59] [cursor=pointer]:
                - /url: "#showroom-explorar"
                - generic [ref=f2e60]: "02"
                - generic [ref=f2e61]: Pruébalo
                - generic [ref=f2e62]: Demo interactiva de cada servicio
            - listitem [ref=f2e63]:
              - link "03 Calcula Qué tendría que pasar, con tus números" [ref=f2e64] [cursor=pointer]:
                - /url: "#showroom-impacto"
                - generic [ref=f2e65]: "03"
                - generic [ref=f2e66]: Calcula
                - generic [ref=f2e67]: Qué tendría que pasar, con tus números
            - listitem [ref=f2e68]:
              - link "04 Tu propuesta Precio, qué incluye y WhatsApp" [ref=f2e69] [cursor=pointer]:
                - /url: "#showroom-cotizar"
                - generic [ref=f2e70]: "04"
                - generic [ref=f2e71]: Tu propuesta
                - generic [ref=f2e72]: Precio, qué incluye y WhatsApp
          - generic [ref=f2e73]:
            - link "Empezar" [ref=f2e74] [cursor=pointer]:
              - /url: "#showroom-construir"
            - link "Ver precios base" [ref=f2e78] [cursor=pointer]:
              - /url: /precios
    - region "Showroom personalizado" [ref=f2e82]:
      - generic [ref=f2e84]:
        - region "Pon tu marca en la demo." [ref=f2e85]:
          - paragraph [ref=f2e86]: 01 · Personaliza
          - heading "Pon tu marca en la demo." [level=2] [ref=f2e87]
          - generic [ref=f2e88]:
            - generic [ref=f2e89]:
              - text: Nombre de tu negocio
              - textbox "Nombre de tu negocio" [ref=f2e90]:
                - /placeholder: Ej. Estudio Aurora
            - generic [ref=f2e91]:
              - text: Giro
              - combobox "Giro" [ref=f2e92]:
                - option "Pilates / yoga" [selected]
                - option "Spa / wellness"
                - option "Fitness boutique"
                - option "Estética / belleza"
                - option "Otro negocio"
            - generic [ref=f2e93]:
              - text: Estilo de la demo
              - combobox "Estilo de la demo" [ref=f2e94]:
                - option "Azul editorial" [selected]
                - option "Almendra"
                - option "Salvia"
          - paragraph [ref=f2e95]: Solo cambia la demo en tu navegador. No se guarda ni se envía.
        - region "Mira cómo podría funcionar." [ref=f2e96]:
          - generic [ref=f2e97]:
            - paragraph [ref=f2e98]: 02 · Pruébalo
            - heading "Mira cómo podría funcionar." [level=2] [ref=f2e99]
            - paragraph [ref=f2e100]: ¿Qué quieres mejorar primero?
            - group "Objetivo principal del negocio" [ref=f2e101]:
              - button "Atraer más clientes" [ref=f2e102]
              - button "Responder mejor" [pressed] [ref=f2e103]
              - button "Ordenar mi operación" [ref=f2e104]
            - group "Experiencias para probar" [ref=f2e105]:
              - button "Operación CRM y seguimiento" [pressed] [ref=f2e106]:
                - generic [ref=f2e107]: Operación
                - generic [ref=f2e108]: CRM y seguimiento
              - button "Atención Chatbot para WhatsApp" [ref=f2e109]:
                - generic [ref=f2e110]: Atención
                - generic [ref=f2e111]: Chatbot para WhatsApp
              - button "Operación Automatizaciones" [ref=f2e112]:
                - generic [ref=f2e113]: Operación
                - generic [ref=f2e114]: Automatizaciones
            - button "Ver las 9 demos ↓" [ref=f2e115]
          - generic [ref=f2e116]:
            - generic "Vista previa interactiva" [ref=f2e117]:
              - generic [ref=f2e118]:
                - generic [ref=f2e119]: Vista previa de tu experiencia
                - generic [ref=f2e124]: DEMO · NO OPERATIVA
              - generic [ref=f2e126]:
                - generic [ref=f2e127]:
                  - generic [ref=f2e128]:
                    - paragraph [ref=f2e129]: CRM comercial · conceptual
                    - heading "Estudio Aurora (ejemplo)" [level=3] [ref=f2e130]
                  - generic [ref=f2e131]: Equipo · 5 personas
                - generic [ref=f2e132]:
                  - generic [ref=f2e133]:
                    - button "Interesados" [pressed] [ref=f2e134]
                    - button "Operación" [ref=f2e135]
                  - generic [ref=f2e136]:
                    - generic [ref=f2e137]:
                      - paragraph [ref=f2e138]: "12"
                      - paragraph [ref=f2e139]: Nuevos
                    - generic [ref=f2e140]:
                      - paragraph [ref=f2e141]: "7"
                      - paragraph [ref=f2e142]: En seguimiento
                    - generic [ref=f2e143]:
                      - paragraph [ref=f2e144]: "4"
                      - paragraph [ref=f2e145]: Visitas previstas
                  - generic [ref=f2e146]:
                    - paragraph [ref=f2e147]: Oportunidad de ejemplo · WhatsApp
                    - generic [ref=f2e148]:
                      - generic [ref=f2e149]:
                        - paragraph [ref=f2e150]: Mariana G.
                        - paragraph [ref=f2e151]: "Preguntó por: Clase de Reformer"
                      - generic [ref=f2e152]: Pendiente
                    - button "Simular seguimiento →" [ref=f2e153]
              - generic [ref=f2e154]: Simulación con datos ficticios · Sin conexiones reales
            - paragraph [ref=f2e155]: "Prototipo con datos ficticios: no envía mensajes, no crea reservas ni se conecta a otras plataformas."
          - generic [ref=f2e156]:
            - paragraph [ref=f2e157]: Estás viendo
            - paragraph [ref=f2e158]: CRM y seguimiento
            - paragraph [ref=f2e159]: Visualiza tus interesados, responsables y próximos pasos.
            - paragraph [ref=f2e160]: Un embudo claro que aprovecha tus herramientas existentes.
            - button "Añadir a mi propuesta +" [ref=f2e161]
            - link "Ver detalles de este servicio →" [ref=f2e162] [cursor=pointer]:
              - /url: /servicios/crm
        - generic [ref=f2e163]:
          - paragraph [ref=f2e164]: El cálculo es opcional. Primero elige una solución; si aún no sabes cuál, puedes solicitar una recomendación.
          - region "¿Qué tendría que pasar para que esta inversión te convenga?" [ref=f2e165]:
            - generic [ref=f2e167]:
              - generic [ref=f2e168]:
                - paragraph [ref=f2e169]: 03 · Calcula con tus números
                - heading "¿Qué tendría que pasar para que esta inversión te convenga?" [level=2] [ref=f2e170]
                - paragraph [ref=f2e171]: Cambia los datos por los de tu negocio y mira el cálculo paso a paso. Es una simulación, no una promesa de resultados.
              - list "Cómo leer esta simulación" [ref=f2e172]:
                - listitem [ref=f2e173]: Ejemplo
                - listitem [ref=f2e174]: Tu dato
                - listitem [ref=f2e175]: Supuesto
                - listitem [ref=f2e176]: Resultado no garantizado
            - generic [ref=f2e177]:
              - generic [ref=f2e179]:
                - generic [ref=f2e181]:
                  - heading "1. Tus números" [level=3] [ref=f2e182]
                  - paragraph [ref=f2e183]: Partimos de un estudio de ejemplo. Cambia lo que sepas.
                - generic [ref=f2e184]:
                  - generic [ref=f2e185]:
                    - generic [ref=f2e186]:
                      - generic [ref=f2e187]: Consultas nuevas al mes
                      - generic [ref=f2e188]: Ejemplo
                    - spinbutton "Consultas nuevas al mes" [ref=f2e189]: "180"
                    - paragraph [ref=f2e190]: Mensajes o interesados únicos, no seguidores.
                  - generic [ref=f2e191]:
                    - generic [ref=f2e192]:
                      - generic [ref=f2e193]: "% que queda sin respuesta o seguimiento"
                      - generic [ref=f2e194]: Ejemplo
                    - spinbutton "% que queda sin respuesta o seguimiento" [ref=f2e195]: "30"
                    - paragraph [ref=f2e196]: Tu mejor estimación.
                  - generic [ref=f2e197]:
                    - generic [ref=f2e198]:
                      - generic [ref=f2e199]: Ingreso por cliente nuevo (MXN)
                      - generic [ref=f2e200]: Ejemplo
                    - spinbutton "Ingreso por cliente nuevo (MXN)" [ref=f2e201]: "1800"
                    - paragraph [ref=f2e202]: Solo la primera compra, sin contar pagos futuros.
                  - generic [ref=f2e203]:
                    - generic [ref=f2e204]:
                      - generic [ref=f2e205]: Margen que te queda (%)
                      - generic [ref=f2e206]: Ejemplo
                    - spinbutton "Margen que te queda (%)" [ref=f2e207]: "60"
                    - paragraph [ref=f2e208]: Lo que queda tras costos variables (instructor, insumos).
                - group [ref=f2e209]:
                  - generic "Supuestos avanzados y ahorro de tiempo" [ref=f2e210] [cursor=pointer]
                - paragraph [ref=f2e211]: "Privacidad: se calcula en tu navegador y no se guarda. Solo si pulsas el botón de WhatsApp se prepara un mensaje editable."
              - generic [ref=f2e212]:
                - heading "2. El resultado" [level=3] [ref=f2e213]
                - generic [ref=f2e214]:
                  - generic [ref=f2e215]:
                    - paragraph [ref=f2e216]:
                      - text: Escenario
                      - generic [ref=f2e217]: Supuesto
                    - group "Escenario de impacto" [ref=f2e218]:
                      - button "Conservador" [ref=f2e219]
                      - button "Base" [pressed] [ref=f2e220]
                      - button "Optimista" [ref=f2e221]
                  - generic [ref=f2e222]:
                    - paragraph [ref=f2e223]: Periodo a evaluar
                    - group "Periodo a evaluar" [ref=f2e224]:
                      - button "1 m" [ref=f2e225]
                      - button "3 m" [pressed] [ref=f2e226]
                      - button "6 m" [ref=f2e227]
                      - button "12 m" [ref=f2e228]
                - generic [ref=f2e229]:
                  - generic [ref=f2e230]:
                    - paragraph [ref=f2e231]: Oportunidad si alguien atiende esas consultas
                    - generic [ref=f2e232]: No garantizado
                  - generic [ref=f2e233]:
                    - generic [ref=f2e234]:
                      - term [ref=f2e235]:
                        - generic [ref=f2e236]: Clientes nuevos estimados
                        - generic [ref=f2e237]: 54 sin respuesta × 40% recuperadas × 25% compran
                      - definition [ref=f2e238]: "5.4"
                    - generic [ref=f2e239]:
                      - term [ref=f2e240]:
                        - generic [ref=f2e241]: Ingresos adicionales estimados
                        - generic [ref=f2e242]: × $1,800 por cliente
                      - definition [ref=f2e243]: $9,720
                    - generic [ref=f2e244]:
                      - term [ref=f2e245]:
                        - generic [ref=f2e246]: Margen estimado
                        - generic [ref=f2e247]: 60% de margen tras costos variables
                      - definition [ref=f2e248]: $5,832
                  - paragraph [ref=f2e249]: Elige al menos un módulo en el paso 4 para restar la inversión de SUMA.
                - generic [ref=f2e250]:
                  - strong [ref=f2e251]: "Importante:"
                  - text: esta oportunidad solo existe si alguien responde y da seguimiento a esas consultas. Publicidad, SEO, web, reservador o app no lo hacen por sí solos, así que no la comparamos contra tu mensualidad ni estimamos horas liberadas. Para que aplique, añade CRM, chatbot o automatización en el paso 4.
                - group [ref=f2e252]:
                  - generic "Cómo se calcula y qué no incluye" [ref=f2e253] [cursor=pointer]
                - link "Quiero que SUMA revise mis números →" [ref=f2e254] [cursor=pointer]:
                  - /url: https://wa.me/528114688882?text=Hola%2C%20SUMA.%20Quiero%20revisar%20una%20simulaci%C3%B3n%20con%20datos%20reales.%0AMe%20interesa%3A%20una%20recomendaci%C3%B3n.%0A%C2%BFPodemos%20revisar%20lo%20que%20incluye%3F
                - paragraph [ref=f2e255]: Abre WhatsApp con un mensaje editable · No contratas ni reservas nada.
            - paragraph [ref=f2e257]:
              - strong [ref=f2e258]: "Contexto:"
              - text: estudios como
              - link "HBR 2011 (respuesta a prospectos) ↗" [ref=f2e259] [cursor=pointer]:
                - /url: https://hbr.org/2011/03/the-short-life-of-online-sales-leads
              - text: "y"
              - link "Mindbody 2025 (retención wellness) ↗" [ref=f2e260] [cursor=pointer]:
                - /url: https://www.mindbodyonline.com/business/education/research-reports/2025-state-industry-report
              - text: explican por qué importa responder rápido, pero sus cifras no son resultados prometidos por SUMA.
        - region "Elige qué contratar y ve cuánto pagarías." [ref=f2e261]:
          - generic [ref=f2e262]:
            - paragraph [ref=f2e263]: 04 · Tu propuesta
            - heading "Elige qué contratar y ve cuánto pagarías." [level=2] [ref=f2e264]
            - paragraph [ref=f2e265]: Prueba la opción básica de cada servicio. Te mostramos cuánto puede variar el presupuesto, antes de IVA.
          - generic [ref=f2e266]:
            - generic [ref=f2e267]:
              - group "¿Cómo prefieres contratar?" [ref=f2e268]:
                - generic [ref=f2e270]:
                  - button "Por módulos" [pressed] [ref=f2e271]
                  - button "Paquete + extras" [ref=f2e272]
              - group "Módulos" [ref=f2e273]:
                - paragraph [ref=f2e275]: Recomendados para «responder mejor». Los importes mínimos son para la versión sencilla de cada servicio.
                - generic [ref=f2e276]:
                  - generic [ref=f2e277]:
                    - heading "Atención" [level=3] [ref=f2e278]
                    - generic [ref=f2e279]:
                      - generic [ref=f2e280] [cursor=pointer]:
                        - checkbox "Organizar clientes (CRM)" [ref=f2e281]
                        - generic [ref=f2e282]:
                          - generic [ref=f2e283]: Organizar clientes (CRM)
                          - generic [ref=f2e284]: Desde $2,490 inicial · $1,490–$3,900/mes
                      - generic [ref=f2e285] [cursor=pointer]:
                        - checkbox "Asistente con IA para WhatsApp" [ref=f2e286]
                        - generic [ref=f2e287]:
                          - generic [ref=f2e288]: Asistente con IA para WhatsApp
                          - generic [ref=f2e289]: Desde $6,900 inicial · $1,990–$6,900/mes
                  - generic [ref=f2e290]:
                    - heading "Operación" [level=3] [ref=f2e291]
                    - generic [ref=f2e293] [cursor=pointer]:
                      - checkbox "Una tarea automática" [ref=f2e294]
                      - generic [ref=f2e295]:
                        - generic [ref=f2e296]: Una tarea automática
                        - generic [ref=f2e297]: Desde $1,490 inicial · pago único
                - button "Ver los 13 módulos (10 más) ↓" [ref=f2e298]
              - generic [ref=f2e299]:
                - generic [ref=f2e300]:
                  - text: Personas del equipo
                  - combobox "Personas del equipo" [ref=f2e301]:
                    - option "1"
                    - option "5" [selected]
                    - option "10"
                    - option "25"
                    - option "50"
                    - option "100"
                    - option "500 o más"
                - generic [ref=f2e302]:
                  - text: Sedes
                  - combobox "Sedes" [ref=f2e303]:
                    - option "1" [selected]
                    - option "2"
                    - option "3"
                    - option "4"
                    - option "5"
                    - option "10 o más"
                - generic [ref=f2e304]:
                  - text: Periodo
                  - combobox "Periodo" [ref=f2e305]:
                    - option "1 mes"
                    - option "3 meses" [selected]
                    - option "6 meses"
                    - option "12 meses"
              - generic [ref=f2e306]:
                - generic [ref=f2e307]:
                  - text: Qué usas hoy
                  - combobox "Qué usas hoy" [ref=f2e308]:
                    - option "WhatsApp / Instagram" [selected]
                    - option "Fitco / Fitune"
                    - option "Wellhub / TotalPass / Fitpass"
                    - option "CRM existente"
                    - option "Sitio o reservador propio"
                    - option "Aún no utilizo herramientas"
                    - option "Otra herramienta"
                - generic [ref=f2e309]:
                  - text: Algo más (opcional)
                  - textbox "Algo más (opcional)" [ref=f2e310]:
                    - /placeholder: Ej. Seguimiento de membresías y reservas en Fitco.
            - generic [ref=f2e312]:
              - paragraph [ref=f2e313]: Tu propuesta estimada
              - paragraph [ref=f2e314]: Elige al menos un módulo para ver cuánto pagarías.
              - paragraph [ref=f2e315]: "Sin cargo de SUMA por persona del equipo. Aparte: licencias de software, WhatsApp API, consumo de IA, hosting y publicidad."
              - link "Enviar mi propuesta por WhatsApp →" [ref=f2e316] [cursor=pointer]:
                - /url: https://wa.me/528114688882?text=Hola%2C%20SUMA.%20Quiero%20una%20propuesta.%0AMe%20interesa%3A%20una%20recomendaci%C3%B3n.%0A%C2%BFPodemos%20revisar%20lo%20que%20incluye%3F
              - paragraph [ref=f2e317]: Abre WhatsApp con un mensaje que puedes editar. Nada se envía sin ti.
              - group [ref=f2e318]:
                - generic "¿Tienes un presupuesto definido?" [ref=f2e319] [cursor=pointer]
              - group [ref=f2e320]:
                - generic "¿Prefieres verlo en una llamada?" [ref=f2e321] [cursor=pointer]
                - option "Por definir" [selected]
                - option "Entre semana, mañanas"
                - option "Entre semana, tardes"
                - option "Horario flexible"
              - paragraph [ref=f2e322]: La opción básica empieza en el importe menor. El rango es orientativo, no un límite máximo ni una cotización. Confirmamos alcance y gastos externos antes de contratar.
          - generic [ref=f2e323]:
            - heading "Así sería la implementación" [level=3] [ref=f2e324]
            - paragraph [ref=f2e325]: Los tiempos se definen en el diagnóstico según el alcance. No se conecta nada sin revisar permisos y viabilidad contigo.
            - list [ref=f2e326]:
              - listitem [ref=f2e327]:
                - paragraph [ref=f2e328]: 01Descubrimos
                - paragraph [ref=f2e329]: Escuchamos cómo funciona tu negocio, qué necesitas y qué te gustaría mejorar.
              - listitem [ref=f2e330]:
                - paragraph [ref=f2e331]: 02Diseñamos
                - paragraph [ref=f2e332]: Convertimos tus necesidades en una propuesta clara, visual y funcional.
              - listitem [ref=f2e333]:
                - paragraph [ref=f2e334]: 03Construimos
                - paragraph [ref=f2e335]: Desarrollamos y conectamos las herramientas que forman parte de tu solución.
              - listitem [ref=f2e336]:
                - paragraph [ref=f2e337]: 04Evolucionamos
                - paragraph [ref=f2e338]: Revisamos lo que funciona y buscamos oportunidades para seguir mejorando.
        - region [ref=f2e339]:
          - generic [ref=f2e340]:
            - generic [ref=f2e341]:
              - paragraph [ref=f2e342]: Solicitar propuesta
              - heading "¿Te interesa? Armemos tu propuesta." [level=3] [ref=f2e343]
              - paragraph [ref=f2e344]: Cuéntanos qué necesitas y te recomendaremos una solución.
            - generic [ref=f2e345]:
              - generic [ref=f2e346]:
                - generic [ref=f2e347]: Tu nombre *
                - textbox "Tu nombre *" [ref=f2e348]
              - generic [ref=f2e349]:
                - generic [ref=f2e350]: Nombre de tu negocio *
                - textbox "Nombre de tu negocio *" [ref=f2e351]
              - generic [ref=f2e352]:
                - generic [ref=f2e353]:
                  - text: Correo electrónico
                  - textbox "Correo electrónico" [ref=f2e354]
                - generic [ref=f2e355]:
                  - text: WhatsApp
                  - textbox "WhatsApp" [ref=f2e356]:
                    - /placeholder: 10 dígitos
              - paragraph [ref=f2e357]: Proporciona al menos un correo o WhatsApp para que podamos contactarte.
              - generic [ref=f2e358]:
                - text: ¿Qué necesitas? (opcional)
                - textbox "¿Qué necesitas? (opcional)" [ref=f2e359]:
                  - /placeholder: Ej. Necesito organizar consultas y enviar recordatorios automáticos.
              - generic [ref=f2e360] [cursor=pointer]:
                - checkbox "Quiero una sesión de diagnóstico personalizada (coordinamos por WhatsApp)" [ref=f2e361]
                - generic [ref=f2e362]: Quiero una sesión de diagnóstico personalizada (coordinamos por WhatsApp)
              - generic [ref=f2e363] [cursor=pointer]:
                - checkbox "Acepto el aviso de privacidad *" [ref=f2e364]
                - generic [ref=f2e365]:
                  - text: Acepto el
                  - link "aviso de privacidad" [ref=f2e366]:
                    - /url: /privacidad
                  - text: "*"
              - button "Enviar solicitud →" [ref=f2e367]
              - paragraph [ref=f2e368]: No enviamos mensajes automáticos. Revisaremos tu solicitud y te contactaremos personalmente.
    - region "¿Tu proyecto necesita algo más especial?" [ref=f2e369]:
      - generic [ref=f2e371]:
        - heading "¿Tu proyecto necesita algo más especial?" [level=2] [ref=f2e373]
        - paragraph [ref=f2e375]: Envíanos tu configuración por WhatsApp o pide una sesión de diagnóstico. Te diremos qué es factible y cuál sería la propuesta real.
        - generic [ref=f2e376]:
          - link "Hablemos por WhatsApp" [ref=f2e377] [cursor=pointer]:
            - /url: https://wa.me/528114688882?text=Hola%2C%20vi%20SUMA%20STUDIO%20y%20me%20gustar%C3%ADa%20platicar%20sobre%20un%20proyecto.
          - link "Consultar precios y paquetes" [ref=f2e381] [cursor=pointer]:
            - /url: /precios
  - contentinfo [ref=f2e385]:
    - generic [ref=f2e386]:
      - generic [ref=f2e387]:
        - generic [ref=f2e388]:
          - 'generic "Wordmark provisional: pendiente logotipo oficial" [ref=f2e389]':
            - generic [ref=f2e390]: SUMA
            - generic [ref=f2e391]: Studio
          - paragraph [ref=f2e392]: Creaciones y Producciones
          - paragraph [ref=f2e393]: Tecnología y experiencias digitales para negocios de bienestar.
          - paragraph [ref=f2e394]: Desde Monterrey, Nuevo León · Para todo México
          - list [ref=f2e395]:
            - listitem [ref=f2e396]:
              - link "WhatsApp · 81 1468 8882" [ref=f2e397] [cursor=pointer]:
                - /url: https://wa.me/528114688882?text=Hola%2C%20vi%20SUMA%20STUDIO%20y%20me%20gustar%C3%ADa%20platicar%20sobre%20un%20proyecto.
            - listitem [ref=f2e398]:
              - link "Llamar al 81 1468 8882" [ref=f2e399] [cursor=pointer]:
                - /url: tel:+528114688882
          - navigation "Redes sociales de SUMA STUDIO" [ref=f2e400]:
            - list [ref=f2e401]:
              - listitem [ref=f2e402]:
                - link "LinkedIn · SUMA STUDIO" [ref=f2e403] [cursor=pointer]:
                  - /url: https://www.linkedin.com/company/sumastudio-tecnologia/
          - link "Hablemos por WhatsApp" [ref=f2e404] [cursor=pointer]:
            - /url: https://wa.me/528114688882?text=Hola%2C%20vi%20SUMA%20STUDIO%20y%20me%20gustar%C3%ADa%20platicar%20sobre%20un%20proyecto.
        - navigation "Pie de página" [ref=f2e408]:
          - generic [ref=f2e409]:
            - heading "Estudio" [level=2] [ref=f2e410]
            - list [ref=f2e411]:
              - listitem [ref=f2e412]:
                - link "Inicio" [ref=f2e413] [cursor=pointer]:
                  - /url: /
              - listitem [ref=f2e414]:
                - link "Soluciones" [ref=f2e415] [cursor=pointer]:
                  - /url: /soluciones
              - listitem [ref=f2e416]:
                - link "Showroom interactivo" [ref=f2e417] [cursor=pointer]:
                  - /url: /showroom
              - listitem [ref=f2e418]:
                - link "Cómo trabajamos" [ref=f2e419] [cursor=pointer]:
                  - /url: /como-trabajamos
              - listitem [ref=f2e420]:
                - link "Precios y paquetes" [ref=f2e421] [cursor=pointer]:
                  - /url: /precios
              - listitem [ref=f2e422]:
                - link "Guías prácticas" [ref=f2e423] [cursor=pointer]:
                  - /url: /guias
              - listitem [ref=f2e424]:
                - link "El estudio" [ref=f2e425] [cursor=pointer]:
                  - /url: /nosotros
              - listitem [ref=f2e426]:
                - link "Contacto" [ref=f2e427] [cursor=pointer]:
                  - /url: /contacto
          - generic [ref=f2e428]:
            - heading "Servicios" [level=2] [ref=f2e429]
            - list [ref=f2e430]:
              - listitem [ref=f2e431]:
                - link "Chatbots" [ref=f2e432] [cursor=pointer]:
                  - /url: /servicios/chatbots
              - listitem [ref=f2e433]:
                - link "CRM" [ref=f2e434] [cursor=pointer]:
                  - /url: /servicios/crm
              - listitem [ref=f2e435]:
                - link "Apps" [ref=f2e436] [cursor=pointer]:
                  - /url: /servicios/aplicaciones-moviles
              - listitem [ref=f2e437]:
                - link "Web" [ref=f2e438] [cursor=pointer]:
                  - /url: /servicios/paginas-web
              - listitem [ref=f2e439]:
                - link "Publicidad" [ref=f2e440] [cursor=pointer]:
                  - /url: /servicios/publicidad-digital
          - generic [ref=f2e441]:
            - heading "Industrias" [level=2] [ref=f2e442]
            - list [ref=f2e443]:
              - listitem [ref=f2e444]:
                - link "Estudios de Yoga y Pilates" [ref=f2e445] [cursor=pointer]:
                  - /url: /industrias/yoga-pilates
              - listitem [ref=f2e446]:
                - link "Spas y centros de bienestar" [ref=f2e447] [cursor=pointer]:
                  - /url: /industrias/spas
              - listitem [ref=f2e448]:
                - link "Fitness Boutique" [ref=f2e449] [cursor=pointer]:
                  - /url: /industrias/fitness-boutique
              - listitem [ref=f2e450]:
                - link "Marcas Wellness" [ref=f2e451] [cursor=pointer]:
                  - /url: /industrias/marcas-wellness
              - listitem [ref=f2e452]:
                - link "Experiencias y Retiros" [ref=f2e453] [cursor=pointer]:
                  - /url: /industrias/experiencias-retiros
              - listitem [ref=f2e454]:
                - link "Profesionales de Bienestar" [ref=f2e455] [cursor=pointer]:
                  - /url: /industrias/profesionales-bienestar
      - paragraph [aria-hidden] [ref=f2e456]: SUMA
      - generic [ref=f2e457]:
        - paragraph [ref=f2e458]: © 2026 SUMA STUDIO · Creaciones y Producciones
        - list [ref=f2e459]:
          - listitem [ref=f2e460]:
            - link "Aviso de privacidad" [ref=f2e461] [cursor=pointer]:
              - /url: /aviso-de-privacidad
          - listitem [ref=f2e462]:
            - button "Preferencias de privacidad" [ref=f2e463]
          - listitem [ref=f2e464]: "Fotografía: Unsplash"
  - alert [ref=f2e465]
  - region "Tu privacidad, tu decisión" [ref=f2e466]:
    - heading "Tu privacidad, tu decisión" [level=2] [ref=f2e467]
    - paragraph [ref=f2e469]:
      - text: Con tu permiso usamos Google Analytics para saber qué páginas se visitan y mejorar el sitio. No usamos cookies publicitarias.
      - link "Aviso de privacidad" [ref=f2e470] [cursor=pointer]:
        - /url: /aviso-de-privacidad
    - generic [ref=f2e471]:
      - button "Rechazar" [ref=f2e472]
      - button "Aceptar estadísticas" [ref=f2e474]
```

# Test source

```ts
  57  | 
  58  |     // Seleccionar un servicio
  59  |     if (await crmCheckbox.isVisible()) {
  60  |       await crmCheckbox.check();
  61  |       console.log("✅ Servicio CRM seleccionado");
  62  |     }
  63  |     await page.waitForTimeout(2000); // Debounce del quote_updated
  64  | 
  65  |     events = await getDataLayerEvents(page);
  66  |     console.log("📊 Eventos después de config:", events.map(e => e.event).join(", "));
  67  | 
  68  |     // Screenshot con configuración
  69  |     await page.screenshot({ path: "/opt/cursor/artifacts/02-mobile-configured.png", fullPage: true });
  70  | 
  71  |     // Scroll al formulario
  72  |     console.log("⏱️  Scrolling a formulario:", ((Date.now() - startTime) / 1000).toFixed(1), "s");
  73  |     const formHeading = page.locator("text=/Quiero una propuesta|propuesta para/i").first();
  74  |     await formHeading.scrollIntoViewIfNeeded();
  75  |     await page.waitForTimeout(500);
  76  | 
  77  |     // Verificar evento showroom_proposal_requested
  78  |     events = await getDataLayerEvents(page);
  79  |     expect(events.some(e => e.event === "showroom_proposal_requested")).toBe(true);
  80  |     console.log("✅ Evento showroom_proposal_requested disparado");
  81  | 
  82  |     // Llenar formulario
  83  |     console.log("⏱️  Llenando formulario:", ((Date.now() - startTime) / 1000).toFixed(1), "s");
  84  |     await page.fill('input[name="nombre"]', "Carlos Test E2E");
  85  |     await page.fill('input[name="negocio"]', "Pilates Studio Test");
  86  |     await page.fill('input[name="email"]', "test-e2e@example.com");
  87  |     await page.fill('textarea[name="necesidades"]', "Testing E2E del flujo completo");
  88  |     
  89  |     // Aceptar privacidad
  90  |     const privacyCheckbox = page.locator('input[type="checkbox"][name="privacidad"]');
  91  |     await privacyCheckbox.check();
  92  | 
  93  |     // Screenshot antes de submit
  94  |     await page.screenshot({ path: "/opt/cursor/artifacts/03-mobile-form-filled.png", fullPage: true });
  95  | 
  96  |     // Submit
  97  |     console.log("⏱️  Enviando formulario:", ((Date.now() - startTime) / 1000).toFixed(1), "s");
  98  |     const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Enviar|Solicitar/i });
  99  |     
  100 |     // Interceptar la petición API
  101 |     const responsePromise = page.waitForResponse(
  102 |       response => response.url().includes("/api/showroom-lead") && response.status() < 600,
  103 |       { timeout: 15000 }
  104 |     );
  105 |     
  106 |     await submitButton.click();
  107 |     const response = await responsePromise;
  108 |     
  109 |     const responseBody = await response.json();
  110 |     const apiStatus = response.status();
  111 |     
  112 |     console.log("📡 API Response Status:", apiStatus);
  113 |     console.log("📡 API Response Body:", JSON.stringify(responseBody, null, 2));
  114 | 
  115 |     const endTime = Date.now();
  116 |     const durationSeconds = (endTime - startTime) / 1000;
  117 |     console.log(`⏱️  TIEMPO TOTAL: ${durationSeconds.toFixed(1)}s (objetivo: <120s)`);
  118 | 
  119 |     // Screenshot después de submit
  120 |     await page.waitForTimeout(1000);
  121 |     await page.screenshot({ path: "/opt/cursor/artifacts/04-mobile-after-submit.png", fullPage: true });
  122 | 
  123 |     // Verificar respuesta según si hay RESEND o no
  124 |     if (apiStatus === 503) {
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
> 157 |     await page.fill('input[name="businessName"]', "Desktop Test Studio");
      |                ^ Error: page.fill: Test timeout of 120000ms exceeded.
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
  225 |     await formHeading.scrollIntoViewIfNeeded();
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
```