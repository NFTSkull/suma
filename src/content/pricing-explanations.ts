import type { IndividualServiceId, PricingPlanId } from "@/content/pricing";

/**
 * Lenguaje para personas que administran un negocio, no para especialistas en software.
 * Los ejemplos son ilustrativos; ninguna conexión, volumen o resultado queda garantizado.
 */
export type SimpleExplanation = {
  what: string;
  example: string;
  excluded: string;
};

export const planExplanations: Record<PricingPlanId, SimpleExplanation> = {
  ads: {
    what: "Creamos y revisamos anuncios en Facebook e Instagram para dar a conocer tu negocio y llevar personas interesadas a tu WhatsApp o enlace de reservas.",
    example: "Alguien ve tu anuncio de una clase de prueba, toca el botón y te escribe.",
    excluded: "El dinero de los anuncios se paga directamente a Meta. Tu equipo sigue atendiendo los mensajes.",
  },
  flow: {
    what: "Organizamos tus consultas en un programa para clientes (CRM): ves quién preguntó, quién le respondió y qué sigue. Configuramos una herramienta que ya existe, no un sistema nuevo.",
    example: "Alguien pregunta por una clase; tu equipo registra la consulta, responde y marca si necesita recordarle los horarios.",
    excluded: "Las licencias de la herramienta se pagan aparte. No respondemos tus WhatsApps por ti ni incluimos un asistente con IA.",
  },
  growth: {
    what: "Es la combinación de anuncios en Facebook e Instagram con la organización de consultas de SUMA Flow, para una misma sucursal.",
    example: "Una persona llega por un anuncio; tu equipo puede registrar su interés y dar seguimiento desde el programa de clientes.",
    excluded: "El presupuesto de anuncios, las licencias y los mensajes automáticos externos van aparte. No garantiza clientes ni ventas.",
  },
};

export const serviceExplanations: Record<IndividualServiceId, SimpleExplanation> = {
  "meta-ads": {
    what: "Preparamos una campaña sencilla de anuncios en Facebook e Instagram, con una imagen publicitaria, revisión y resumen de resultados.",
    example: "Un anuncio de tus clases lleva a WhatsApp para preguntar por horarios.",
    excluded: "El dinero que Meta cobra por mostrar anuncios va aparte; tampoco atendemos las conversaciones.",
  },
  "google-ads": {
    what: "Creamos anuncios para aparecer cuando alguien busca en Google servicios como los de tu negocio.",
    example: "Una búsqueda de «Pilates cerca de mí» podría mostrar tu anuncio, según la campaña.",
    excluded: "El presupuesto que cobra Google va aparte. No garantizamos aparecer en una posición específica.",
  },
  "crm-gestionado": {
    what: "CRM es un programa para organizar a las personas interesadas y recordar qué respuesta o tarea sigue. Configuramos una herramienta existente.",
    example: "Ves quién preguntó por una clase, quién le respondió y quién necesita seguimiento.",
    excluded: "No incluye desarrollar un programa propio ni contestar WhatsApp automáticamente. La licencia externa va aparte.",
  },
  "chatbot-guiado": {
    what: "Es un menú con respuestas que tú apruebas. La persona elige una opción y recibe información previamente preparada; no usa inteligencia artificial.",
    example: "«1. Horarios», «2. Precios», «3. Hablar con el equipo».",
    excluded: "Plataforma, mensajes y permisos del canal van aparte; no ofrece respuestas libres como una persona.",
  },
  "chatbot-ia": {
    what: "Es un asistente que puede responder algunas preguntas frecuentes con inteligencia artificial y pasar la conversación a una persona cuando sea necesario.",
    example: "Alguien pregunta por horarios y el asistente responde según la información que le hayamos configurado.",
    excluded: "Depende de autorizaciones y herramientas de WhatsApp; uso de IA, mensajes y servicios externos van aparte.",
  },
  reservas: {
    what: "Te ayudamos a configurar una agenda o sistema de reservas que ya existe para mostrar horarios disponibles.",
    example: "Una alumna puede revisar horarios y solicitar una clase desde tu sistema actual.",
    excluded: "No creamos una agenda nueva desde cero y la licencia del proveedor se paga aparte.",
  },
  automatizacion: {
    what: "Es una tarea repetitiva que una herramienta ejecuta siguiendo reglas que acordamos, cuando existe acceso y permiso.",
    example: "Crear un aviso interno cuando queda una consulta pendiente.",
    excluded: "Una tarea básica no incluye un asistente con IA, envíos automáticos por WhatsApp ni integraciones complejas.",
  },
  "seo-local": {
    what: "Revisamos y mejoramos la información de tu negocio para que las personas lo encuentren más fácilmente en búsquedas locales.",
    example: "Que tu estudio tenga información completa de ubicación, horarios y servicios donde corresponda.",
    excluded: "No garantizamos primeros lugares ni resultados inmediatos en Google.",
  },
  landing: {
    what: "Es una página enfocada en un solo servicio u oferta, diseñada para explicar lo importante y facilitar que te escriban.",
    example: "Una página de «Clase de prueba» con fotos, horarios y botón a WhatsApp.",
    excluded: "Dominio y alojamiento web van aparte. No incluye una tienda, sistema de reservas ni mantenimiento continuo.",
  },
  web: {
    what: "Es un sitio con varias páginas para presentar tu negocio, sus servicios y cómo contactarlo.",
    example: "Inicio, clases, nosotros y contacto.",
    excluded: "Dominio, alojamiento y nuevas funciones como tienda o sistema de reservas se cotizan aparte.",
  },
  "crm-medida": {
    what: "Creamos un programa propio con las pantallas y funciones específicas que necesita tu operación, después de definir el alcance.",
    example: "Un panel propio para organizar consultas y tareas de distintas áreas de tu negocio.",
    excluded: "No incluye funciones ilimitadas, infraestructura, licencias ni mantenimiento permanente sin acuerdo.",
  },
  "mantenimiento-crm": {
    what: "Revisamos y corregimos problemas pequeños de un programa hecho a medida, dentro del servicio acordado.",
    example: "Resolver un fallo de una pantalla o ajustar un comportamiento ya existente.",
    excluded: "Funciones nuevas, rediseños completos, servidores y servicios de otros proveedores se cotizan aparte.",
  },
  app: {
    what: "Desarrollamos una aplicación móvil para una necesidad concreta, después de acordar las pantallas y funciones.",
    example: "Una aplicación con acceso de usuarios y una función principal definida para tu negocio.",
    excluded: "Publicación en tiendas, mantenimiento y nuevas funciones no forman parte automáticamente del precio inicial.",
  },
};

export const pricingConcepts = {
  setup: {
    what: "Es lo que cobramos por preparar y dejar funcionando la solución acordada. Se paga una sola vez, aunque se pueda dividir en abonos.",
    example: "Configurar tu lista de clientes o crear la primera campaña.",
    excluded: "No incluye meses de servicio gratis ni ampliaciones que no estén acordadas.",
  },
  monthly: {
    what: "Es lo que cobra SUMA por revisar y trabajar en tu servicio durante cada mes contratado.",
    example: "Revisar campañas o dar soporte y hacer el ajuste pequeño incluido en Flow.",
    excluded: "No incluye trabajo ilimitado ni licencias de otros proveedores.",
  },
  payments: {
    what: "Puedes solicitar repartir el pago de configuración en 3 abonos mensuales, o 6 para implementaciones mayores. El precio total no baja.",
    example: "Cada abono de configuración se suma al servicio del mes que corresponda.",
    excluded: "Los abonos requieren un acuerdo comercial escrito. No representan crédito autorizado ni cobro automático.",
  },
  external: {
    what: "Es dinero que pagas a otras empresas, no a SUMA, por utilizar sus servicios.",
    example: "Anuncios de Meta o Google, licencia del programa de clientes, dominio o mensajes de WhatsApp.",
    excluded: "Son gastos adicionales. SUMA confirma qué herramientas necesitas antes de contratar.",
  },
  range: {
    what: "«Desde» significa el precio mínimo de la versión sencilla. El importe puede cambiar si pides más funciones, campañas o sucursales.",
    example: "Una sucursal con una campaña cuesta distinto de tres sucursales con varias campañas.",
    excluded: "El rango mostrado es orientativo y no funciona como precio máximo garantizado.",
  },
  period: {
    what: "Es una comparación para que veas cuánto costaría la configuración completa más el servicio de los meses que elijas.",
    example: "Si eliges 3 meses, suma una vez la configuración y tres mensualidades de SUMA.",
    excluded: "No representa una permanencia obligatoria ni descuenta abonos pendientes; gastos externos e IVA se calculan aparte.",
  },
  vat: {
    what: "IVA es el Impuesto al Valor Agregado. Mostramos un ejemplo con la tasa general del 16% cuando corresponda.",
    example: "Un primer pago de $1,000 antes de IVA sería $1,160 con IVA del 16%.",
    excluded: "El impuesto definitivo se determina al facturar según las condiciones aplicables.",
  },
} as const;
