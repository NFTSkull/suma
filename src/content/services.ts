import type { Service, ServiceSlug } from "@/types/content";

export const services: Service[] = [
  {
    slug: "chatbots",
    href: "/servicios/chatbots",
    name: "Chatbots y asistentes inteligentes",
    shortName: "Chatbots",
    navTagline: "Atención que continúa",
    color: "orange",
    home: {
      title: "Conversaciones que siguen fluyendo.",
      text: "Asistentes inteligentes que te ayudan a responder consultas, organizar solicitudes y atender a tus clientes mientras tú te ocupas de tu negocio.",
    },
    hero: {
      eyebrow: "Chatbots y asistentes inteligentes",
      title: "Mientras tú te enfocas en tus clientes, tus conversaciones pueden seguir avanzando.",
      lead: "Diseñamos asistentes que responden lo que más te preguntan, ayudan a solicitar reservas y te pasan la conversación cuando hace falta una persona.",
    },
    problem: {
      title: "Lo que pasa cuando nadie puede contestar",
      points: [
        "Terminas una clase o una sesión y tienes decenas de mensajes esperando.",
        "Las mismas preguntas se repiten todos los días: horarios, precios, ubicación.",
        "Una consulta sin respuesta a tiempo puede convertirse en una reserva que no llegó.",
        "Tu equipo dedica horas a copiar y pegar información en lugar de atender.",
      ],
    },
    capabilities: [
      { title: "Respuestas frecuentes", text: "Horarios, precios, ubicación, políticas y paquetes, siempre con la información que tú defines." },
      { title: "Solicitudes de reserva", text: "El asistente guía a la persona para elegir clase, servicio u horario y deja la solicitud lista para confirmar." },
      { title: "Seguimiento", text: "Recordatorios y mensajes de seguimiento para que nadie se quede a medio camino." },
      { title: "Transferencia al equipo", text: "Cuando una conversación necesita criterio humano, el asistente la pasa a tu equipo con el contexto completo." },
      { title: "Tono de tu marca", text: "Escribimos con tu voz: cercana, cálida o directa, según cómo hablas con tus clientes." },
      { title: "Integraciones posibles", text: "WhatsApp Business, chat en tu sitio web, Instagram o tu CRM, sujetas a viabilidad técnica y a los canales autorizados por cada plataforma." },
    ],
    showcase: {
      title: "Así podría sonar tu asistente",
      lead: "Elige una pregunta y recorre una conversación de ejemplo para un estudio de pilates.",
    },
    benefits: [
      { title: "Más tiempo para tus clientes", text: "Tu equipo deja de responder lo mismo y se dedica a lo que solo una persona puede hacer." },
      { title: "Respuestas a cualquier hora", text: "Las consultas reciben atención aunque estés en clase, en cabina o descansando." },
      { title: "Menos solicitudes perdidas", text: "Cada interesado sabe cuál es el siguiente paso para reservar." },
      { title: "Información ordenada", text: "Las conversaciones pueden registrarse para que sepas qué preguntan y qué necesitan." },
    ],
    industryExamples: [
      { industry: "yoga-pilates", text: "Responde disponibilidad de reformer, explica la clase muestra y orienta a principiantes." },
      { industry: "spas", text: "Presenta el menú de tratamientos, sugiere opciones y recibe solicitudes de cita." },
      { industry: "marcas-wellness", text: "Resuelve dudas sobre productos, envíos y formas de uso antes de la compra." },
      { industry: "experiencias-retiros", text: "Explica qué incluye cada retiro, fechas y cómo apartar un lugar." },
    ],
    scopeNote: {
      title: "Qué se automatiza y qué no",
      text: "Un buen asistente sabe cuándo detenerse. Automatizamos lo repetitivo y predecible; las quejas, los casos de salud, los cambios especiales o cualquier situación sensible se transfieren a tu equipo. Definimos esas reglas contigo antes de lanzar.",
    },
    related: [
      { slug: "crm", why: "Las conversaciones y solicitudes pueden llegar directo a tu sistema de clientes." },
      { slug: "paginas-web", why: "Tu sitio web puede integrar el asistente desde la primera visita." },
    ],
    faqs: [
      { q: "¿El asistente reemplaza a mi equipo?", a: "No. Se encarga de lo repetitivo para que tu equipo tenga más tiempo para atender a las personas. Siempre definimos cuándo debe transferir la conversación." },
      { q: "¿Funciona en WhatsApp?", a: "Puede funcionar en WhatsApp Business mediante la plataforma oficial, además de chat web o Instagram. La viabilidad depende de los requisitos y aprobaciones de cada plataforma, y la revisamos contigo al inicio." },
      { q: "¿Puede hacer reservas reales?", a: "Puede conectarse con tu sistema de reservas o con un CRM cuando la herramienta lo permite. Si no, dejamos la solicitud lista para que tu equipo la confirme." },
      { q: "¿Quién define lo que responde?", a: "Tú. Construimos la base de información con tus horarios, políticas y servicios, y la ajustamos con el tiempo." },
    ],
    cta: {
      title: "¿Cuántas conversaciones se quedan esperando hoy?",
      text: "Cuéntanos cómo te contactan tus clientes y diseñemos un asistente con tu tono.",
    },
    seo: {
      title: "Chatbots para negocios de bienestar y estudios de pilates",
      description: "Asistentes inteligentes para estudios, spas y marcas wellness: responden consultas, ayudan a reservar y transfieren a tu equipo cuando hace falta. Desde Monterrey para todo México.",
      keywords: ["chatbots para negocios de bienestar", "chatbot para estudio de pilates", "automatización de reservas", "chatbot WhatsApp spa"],
    },
  },
  {
    slug: "crm",
    href: "/servicios/crm",
    name: "Sistemas CRM personalizados",
    shortName: "CRM",
    navTagline: "Tu negocio en orden",
    color: "purple",
    home: {
      title: "Todo en su lugar.",
      text: "Organiza clientes, citas, membresías y oportunidades en un sistema diseñado alrededor de tu operación.",
    },
    hero: {
      eyebrow: "Sistemas CRM personalizados",
      title: "Más claridad para ti. Más orden para tu negocio.",
      lead: "Un solo lugar para tus clientes, citas, membresías y seguimientos, diseñado según cómo trabaja tu negocio y no al revés.",
    },
    problem: {
      title: "Cuando la información vive en todas partes",
      points: [
        "Las reservas están entre WhatsApp, una libreta y el calendario del celular.",
        "No sabes con certeza qué membresías vencen esta semana.",
        "Conocer a tus clientes depende de la memoria de tu equipo.",
        "Dar seguimiento a un prospecto se olvida entre tantas tareas.",
      ],
    },
    capabilities: [
      { title: "Clientes", text: "Historial, preferencias, notas y visitas de cada persona en una ficha clara." },
      { title: "Reservas y agenda", text: "Clases, cabinas o citas con disponibilidad visible para tu equipo." },
      { title: "Membresías y paquetes", text: "Vigencias, clases restantes y renovaciones a la vista." },
      { title: "Prospectos", text: "Personas interesadas organizadas por etapa para que nadie se quede sin respuesta." },
      { title: "Seguimiento", text: "Recordatorios de llamada, mensaje o confirmación con responsables claros." },
      { title: "Indicadores", text: "Los números que te importan, sin hojas de cálculo interminables." },
      { title: "Productos", text: "Catálogo e inventario básico cuando tu negocio también vende productos." },
    ],
    showcase: {
      title: "Un día en el CRM de un spa",
      lead: "Cambia de pestaña y abre una cita para ver cómo se organiza la información.",
    },
    benefits: [
      { title: "Decisiones con claridad", text: "Sabes qué está pasando en tu negocio sin tener que reconstruirlo." },
      { title: "Clientes que se sienten recordados", text: "Tu equipo conoce preferencias e historial antes de saludar." },
      { title: "Menos tareas olvidadas", text: "Cada seguimiento tiene fecha y responsable." },
      { title: "Un sistema que crece contigo", text: "Empezamos por lo esencial y agregamos módulos cuando los necesitas." },
    ],
    industryExamples: [
      { industry: "spas", text: "Agenda de cabinas y terapeutas, historial de tratamientos y clientes recurrentes." },
      { industry: "yoga-pilates", text: "Alumnos, paquetes de clases, cancelaciones y listas de espera." },
      { industry: "fitness-boutique", text: "Membresías, asistencia y alertas de clientes que dejaron de venir." },
      { industry: "profesionales-bienestar", text: "Agenda personal, notas de sesión y recordatorios de seguimiento." },
    ],
    scopeNote: {
      title: "Hecho a la medida de tu operación",
      text: "No vendemos una licencia genérica. Cada CRM se diseña a partir de tus procesos reales; en algunos casos conviene construirlo desde cero y en otros configurar o integrar herramientas existentes. Lo decidimos juntos según tu presupuesto y tu momento.",
    },
    related: [
      { slug: "chatbots", why: "Las solicitudes que llegan por chat pueden registrarse automáticamente." },
      { slug: "aplicaciones-moviles", why: "Tus clientes pueden ver sus reservas y membresías desde una app conectada." },
    ],
    faqs: [
      { q: "¿Por qué no usar un software que ya existe?", a: "A veces es la mejor opción y te lo diremos. Un CRM personalizado conviene cuando tus procesos no encajan en herramientas genéricas o cuando necesitas conectar varias piezas." },
      { q: "¿Puedo migrar la información que ya tengo?", a: "Sí. Revisamos tus archivos actuales (hojas de cálculo, exportaciones de otras herramientas) y planeamos cómo trasladarlos." },
      { q: "¿Mi equipo podrá usarlo sin capacitación técnica?", a: "Ese es el objetivo de diseño. Probamos los flujos con tu equipo y simplificamos lo que haga falta." },
      { q: "¿Dónde se guardan los datos?", a: "En infraestructura en la nube con controles de acceso por usuario. Definimos contigo permisos y políticas de privacidad." },
    ],
    cta: {
      title: "Ordenemos tu operación.",
      text: "Cuéntanos qué herramientas usas hoy y qué te gustaría ver en un solo lugar.",
    },
    seo: {
      title: "CRM para estudios de yoga, pilates y spas",
      description: "Sistemas CRM personalizados para negocios wellness: clientes, reservas, membresías, prospectos y seguimiento en un solo lugar.",
      keywords: ["CRM para estudios de yoga", "software para spas", "CRM para estudio de pilates", "sistema de membresías"],
    },
  },
  {
    slug: "aplicaciones-moviles",
    href: "/servicios/aplicaciones-moviles",
    name: "Aplicaciones móviles",
    shortName: "Apps",
    navTagline: "Experiencias móviles",
    color: "pink",
    home: {
      title: "Tu marca, en sus manos.",
      text: "Una experiencia móvil para que tus clientes consulten, reserven y mantengan una relación más cercana con tu negocio.",
    },
    hero: {
      eyebrow: "Aplicaciones móviles",
      title: "Una experiencia que acompaña a tus clientes, dondequiera que estén.",
      lead: "Diseñamos y desarrollamos apps con la identidad de tu marca para reservar, consultar membresías y mantenerse cerca de tu comunidad.",
    },
    problem: {
      title: "Cuando tu experiencia termina al salir del estudio",
      points: [
        "Tus clientes dependen de mensajes para saber horarios o reservar.",
        "Las novedades se pierden entre publicaciones y estados.",
        "La relación con tu marca se limita al tiempo que pasan en tu espacio.",
        "Usas una app genérica que no se parece a tu negocio.",
      ],
    },
    capabilities: [
      { title: "Reservar clases o servicios", text: "Disponibilidad en tiempo real cuando hay un sistema de reservas conectado." },
      { title: "Consultar membresías", text: "Vigencia, clases restantes y beneficios siempre a la mano." },
      { title: "Recibir novedades", text: "Notificaciones para nuevos horarios, eventos o lanzamientos, con permiso del usuario." },
      { title: "Explorar experiencias", text: "Talleres, retiros o colecciones presentados con la estética de tu marca." },
      { title: "Acceder a contenido", text: "Videos, rutinas o guías para quienes forman parte de tu comunidad." },
      { title: "Gestionar servicios", text: "Cambios de horario, cancelaciones y preferencias sin escribir a nadie." },
    ],
    showcase: {
      title: "Toca, reserva, explora",
      lead: "Un prototipo navegable con las pantallas principales de una app wellness.",
    },
    benefits: [
      { title: "Una relación más cercana", text: "Tu marca acompaña a tus clientes también fuera de tu espacio." },
      { title: "Menos mensajes operativos", text: "Las personas resuelven reservas y consultas por su cuenta." },
      { title: "Identidad propia", text: "Tu app se ve y se siente como tu negocio, no como una plantilla." },
      { title: "Base para crecer", text: "Comunidad, contenido y beneficios pueden sumarse con el tiempo." },
    ],
    industryExamples: [
      { industry: "fitness-boutique", text: "Reservas de clase, retos de comunidad y control de membresía." },
      { industry: "yoga-pilates", text: "Calendario semanal, paquetes y lista de espera para clases llenas." },
      { industry: "experiencias-retiros", text: "Itinerario, información práctica y comunicación con participantes." },
      { industry: "marcas-wellness", text: "Rutinas de uso, recompras y beneficios para clientes frecuentes." },
    ],
    scopeNote: {
      title: "Alcance claro desde el principio",
      text: "Cada app se define según tus objetivos y presupuesto. Podemos empezar con una aplicación web instalable o con apps nativas para iOS y Android. La publicación en tiendas depende de las revisiones de Apple y Google, por lo que la planeamos con tiempo y sin prometer fechas que no controlamos.",
    },
    related: [
      { slug: "crm", why: "Una app necesita un sistema detrás que organice reservas y clientes." },
      { slug: "paginas-web", why: "Tu sitio y tu app pueden compartir identidad y contenido." },
    ],
    faqs: [
      { q: "¿Necesito una app o me basta una página web?", a: "Depende de qué tan seguido te visitan tus clientes y qué necesitan hacer. Muchas veces conviene empezar con un sitio web excelente y evaluar la app después." },
      { q: "¿La app estará en App Store y Google Play?", a: "Si el proyecto lo requiere, preparamos la publicación. La aprobación final depende de cada tienda y de sus políticas." },
      { q: "¿Puede conectarse con mi sistema de reservas actual?", a: "Si tu sistema ofrece una forma segura de integrarse, sí. Lo revisamos en la etapa de descubrimiento." },
      { q: "¿Quién mantiene la app después?", a: "Podemos acompañarte con mantenimiento y mejoras continuas. Lo definimos en la propuesta." },
    ],
    cta: {
      title: "Imaginemos tu app.",
      text: "Cuéntanos qué te gustaría que tus clientes pudieran hacer desde su teléfono.",
    },
    seo: {
      title: "Aplicaciones móviles para centros wellness y estudios",
      description: "Apps con la identidad de tu marca para reservar clases, consultar membresías y mantenerte cerca de tu comunidad.",
      keywords: ["aplicaciones para centros wellness", "app para estudio de yoga", "app de reservas para gimnasio boutique"],
    },
  },
  {
    slug: "paginas-web",
    href: "/servicios/paginas-web",
    name: "Páginas web y experiencias digitales",
    shortName: "Web",
    navTagline: "Tu presencia digital",
    color: "navy",
    home: {
      title: "Una experiencia que comienza antes de la primera visita.",
      text: "Diseñamos sitios web que expresan la personalidad de tu marca y convierten el interés en oportunidades.",
    },
    hero: {
      eyebrow: "Páginas web y experiencias digitales",
      title: "Tu espacio merece una presencia digital igual de especial.",
      lead: "Sitios con diseño editorial, rápidos y fáciles de usar, pensados para que quien te descubra quiera conocerte en persona.",
    },
    problem: {
      title: "Cuando tu sitio no se parece a tu negocio",
      points: [
        "Tu espacio es hermoso, pero tu página web no le hace justicia.",
        "En el celular se ve mal o tarda demasiado en cargar.",
        "Las personas no encuentran horarios, precios o cómo reservar.",
        "No apareces cuando alguien busca lo que ofreces en tu ciudad.",
      ],
    },
    capabilities: [
      { title: "Diseño de sitios premium", text: "Dirección de arte, tipografía y composición a la altura de tu marca." },
      { title: "Versión móvil impecable", text: "Pensada primero para el teléfono, que es donde te encuentran." },
      { title: "Catálogos", text: "Tratamientos, clases, productos o experiencias presentados con claridad." },
      { title: "Sistemas de reserva", text: "Integración con tu herramienta de reservas o con un sistema propio." },
      { title: "SEO", text: "Estructura, contenido y velocidad para que te encuentren en búsquedas locales." },
      { title: "Landing pages", text: "Páginas enfocadas para campañas, lanzamientos o clases de prueba." },
      { title: "Integraciones", text: "Formularios, chat, CRM, analítica y pagos cuando el proyecto lo requiere." },
      { title: "Experiencias de compra", text: "Tiendas en línea para marcas wellness, cuando corresponde." },
    ],
    showcase: {
      title: "Conceptos de diseño",
      lead: "Prototipos originales creados por SUMA para mostrar posibles direcciones visuales. No son sitios de clientes.",
    },
    benefits: [
      { title: "Primera impresión a tu altura", text: "Tu sitio comunica la calidad de tu experiencia antes de la primera visita." },
      { title: "Más consultas con contexto", text: "Las personas llegan sabiendo qué ofreces y cómo reservar." },
      { title: "Te encuentran", text: "Una base técnica sólida para posicionarte en tu ciudad." },
      { title: "Fácil de actualizar", text: "Cambiar horarios, precios o promociones no debería requerir un programador." },
    ],
    industryExamples: [
      { industry: "spas", text: "Menú de tratamientos con fotografía, precios y solicitud de cita." },
      { industry: "yoga-pilates", text: "Horarios, instructores, paquetes y reserva de clase muestra." },
      { industry: "marcas-wellness", text: "Tienda en línea con historias de producto y rituales de uso." },
      { industry: "profesionales-bienestar", text: "Perfil profesional, enfoque, agenda y preguntas frecuentes." },
    ],
    scopeNote: {
      title: "Diseñado para durar",
      text: "Elegimos la tecnología según tus necesidades: desde sitios editables por tu equipo hasta desarrollos a medida. Todo se entrega optimizado para móviles, accesible y con la estructura básica de SEO lista.",
    },
    related: [
      { slug: "publicidad-digital", why: "Una buena página hace que tu inversión en anuncios rinda más." },
      { slug: "chatbots", why: "Un asistente en tu sitio responde mientras exploran." },
    ],
    faqs: [
      { q: "¿Puedo actualizar el contenido yo mismo?", a: "Sí, si así lo necesitas. Definimos qué partes podrás editar y te mostramos cómo hacerlo." },
      { q: "¿Incluye SEO?", a: "Incluye la base técnica y de contenido: estructura, metadatos, velocidad y textos pensados para búsquedas reales. El posicionamiento sostenido requiere trabajo continuo." },
      { q: "¿Pueden integrar mi sistema de reservas?", a: "Normalmente sí. Revisamos tu herramienta actual y te proponemos la mejor forma de integrarla." },
      { q: "¿Los diseños que muestran son de clientes?", a: "No. Son conceptos originales para ilustrar posibilidades. Cada proyecto tiene una dirección visual propia." },
    ],
    cta: {
      title: "Diseñemos tu presencia digital.",
      text: "Cuéntanos sobre tu espacio y lo que quieres que sientan quienes te visitan en línea.",
    },
    seo: {
      title: "Páginas web para spas y estudios de pilates en Monterrey",
      description: "Diseño y desarrollo web para negocios wellness: sitios editoriales, rápidos, optimizados para móvil y SEO local en Monterrey y todo México.",
      keywords: ["páginas web para spas en Monterrey", "desarrollo web para estudios de pilates", "diseño web wellness México"],
    },
  },
  {
    slug: "publicidad-digital",
    href: "/servicios/publicidad-digital",
    name: "Publicidad digital",
    shortName: "Publicidad",
    navTagline: "Nuevas oportunidades",
    color: "orange",
    home: {
      title: "Haz que te descubran.",
      text: "Estrategias digitales para conectar tus servicios, productos y experiencias con las personas adecuadas.",
    },
    hero: {
      eyebrow: "Publicidad digital",
      title: "Haz que las personas correctas descubran lo que haces.",
      lead: "Campañas en Meta y Google pensadas para negocios wellness, conectadas con tu sitio y tu seguimiento para que cada consulta tenga un camino claro.",
    },
    problem: {
      title: "Cuando publicar no es suficiente",
      points: [
        "Publicas constantemente y no sabes qué genera consultas reales.",
        "Has invertido en anuncios sin saber qué pasó con esas personas.",
        "Los interesados llegan a una página que no les dice qué hacer.",
        "Cuesta llenar clases nuevas, horarios valle o lanzamientos.",
      ],
    },
    capabilities: [
      { title: "Meta Ads", text: "Campañas en Instagram y Facebook con creatividad alineada a tu marca." },
      { title: "Google Ads", text: "Presencia cuando alguien busca lo que ofreces en tu zona." },
      { title: "Captación de contactos", text: "Formularios y páginas que convierten el interés en conversaciones." },
      { title: "Clases de prueba", text: "Campañas para que nuevas personas conozcan tu estudio." },
      { title: "Servicios, membresías y productos", text: "Promoción de lo que quieres impulsar en cada temporada." },
      { title: "Medición y seguimiento", text: "Configuramos la medición para saber qué campañas generan consultas, con reportes claros." },
    ],
    showcase: {
      title: "Del anuncio a la oportunidad",
      lead: "Elige un objetivo de campaña y sigue el recorrido de una persona interesada.",
    },
    benefits: [
      { title: "Inversión con dirección", text: "Cada campaña tiene un objetivo claro y una forma de medirlo." },
      { title: "Mensajes con tu identidad", text: "Anuncios que se ven como tu marca, no como publicidad genérica." },
      { title: "Seguimiento conectado", text: "Las consultas llegan a donde tu equipo puede atenderlas." },
      { title: "Aprendizaje continuo", text: "Revisamos resultados y ajustamos con información real." },
    ],
    industryExamples: [
      { industry: "yoga-pilates", text: "Campañas de clase muestra para nuevos alumnos cerca de tu estudio." },
      { industry: "fitness-boutique", text: "Lanzamiento de nuevos horarios o retos de temporada." },
      { industry: "marcas-wellness", text: "Campañas de producto con recorridos hacia tu tienda en línea." },
      { industry: "experiencias-retiros", text: "Difusión de fechas y captación de interesados para próximos retiros." },
    ],
    scopeNote: {
      title: "Sin promesas que no podemos cumplir",
      text: "No prometemos retornos de inversión ni cifras antes de conocer tu negocio. Los resultados dependen de tu oferta, tu presupuesto, tu mercado y la temporada. Lo que sí garantizamos es claridad: sabrás qué se hizo, qué se midió y qué aprendimos.",
    },
    related: [
      { slug: "paginas-web", why: "Una página de aterrizaje bien diseñada mejora cada campaña." },
      { slug: "crm", why: "Cada contacto generado se organiza para darle seguimiento." },
    ],
    faqs: [
      { q: "¿Cuánto debo invertir en anuncios?", a: "Depende de tu objetivo, zona y temporada. Te ayudamos a definir un presupuesto de prueba razonable antes de escalar." },
      { q: "¿Ustedes crean los anuncios?", a: "Sí. Proponemos mensajes y piezas visuales alineados a tu marca, o trabajamos con tu material." },
      { q: "¿Cómo sabré si funciona?", a: "Configuramos la medición de consultas y te compartimos reportes claros con lo que aprendimos y los siguientes pasos." },
      { q: "¿Garantizan resultados?", a: "No prometemos cifras. Sí te garantizamos una estrategia clara, transparencia y ajustes con base en datos." },
    ],
    cta: {
      title: "Que te encuentren las personas correctas.",
      text: "Cuéntanos qué quieres impulsar y en qué zona están tus clientes.",
    },
    seo: {
      title: "Publicidad digital para estudios de pilates y negocios wellness",
      description: "Campañas en Meta Ads y Google Ads para estudios, spas y marcas wellness en México, conectadas con tu sitio y tu seguimiento.",
      keywords: ["publicidad para estudios de pilates", "marketing digital para negocios wellness en México", "Meta Ads spa"],
    },
  },
];

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s])) as Record<
  ServiceSlug,
  Service
>;

export function getService(slug: ServiceSlug): Service {
  return serviceBySlug[slug];
}

/** Nombre del servicio para usar dentro de una frase ("Conocer …", "Explorar …"). */
export const serviceInlineName: Record<ServiceSlug, string> = {
  chatbots: "chatbots",
  crm: "CRM",
  "aplicaciones-moviles": "apps",
  "paginas-web": "páginas web",
  "publicidad-digital": "publicidad digital",
};
