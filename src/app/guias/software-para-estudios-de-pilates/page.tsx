import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl, buildMetadata, ids, pageGraph } from "@/lib/seo";

const path = "/guias/software-para-estudios-de-pilates";
const seo = {
  path,
  title: "Software para estudios de pilates: CRM y reservas",
  description:
    "Guía para elegir software para tu estudio de pilates: agenda, reformers, listas de espera, membresías, pagos y CRM. Desde Monterrey para México.",
  keywords: [
    "software para estudios de pilates",
    "CRM para estudios de pilates",
    "reservas para pilates reformer",
    "sistema de membresías pilates",
  ],
};
const crumbs = [
  { name: "Guías", path: "/guias" },
  { name: "Software para estudios de pilates", path },
];

export const metadata: Metadata = buildMetadata(seo);

const essentialFunctions = [
  {
    name: "Cupo y recursos",
    detail: "No basta con tener un calendario: una clase de reformer necesita controlar lugares y máquinas disponibles, sin permitir dobles reservas.",
    question: "¿La plataforma impide reservar más reformers de los disponibles?",
  },
  {
    name: "Paquetes y membresías",
    detail: "Cada alumno debería poder saber cuántas clases le quedan, cuándo vence su paquete y qué reservas consumen créditos.",
    question: "¿Las cancelaciones regresan créditos según tu política?",
  },
  {
    name: "Lista de espera",
    detail: "Cuando alguien cancela, el equipo necesita saber quién sigue y cuánto tiempo tiene para confirmar el lugar.",
    question: "¿Qué ocurre si una persona no responde a tiempo?",
  },
  {
    name: "Pagos y conciliación",
    detail: "Relaciona pagos con alumnos, paquetes y reservas. Considera comisiones, transferencias y pagos en recepción.",
    question: "¿Puedes conciliar una venta sin revisar tres aplicaciones?",
  },
  {
    name: "Comunicación",
    detail: "Confirmaciones, cambios de horario y respuestas frecuentes deben seguir la voz del estudio y las reglas de cada canal.",
    question: "¿Se puede transferir una consulta a una persona cuando hace falta?",
  },
  {
    name: "Indicadores útiles",
    detail: "Mide ocupación por horario, cancelaciones, alumnos activos y renovaciones. No necesitas un tablero lleno de números irrelevantes.",
    question: "¿Puedes detectar qué clase requiere atención en menos de un minuto?",
  },
];

const decisionOptions = [
  {
    title: "Una plataforma de reservas existente",
    forWhom: "Tienes un estudio pequeño o procesos bastante estándar.",
    whatToCheck: "Cupos, paquetes, pagos, políticas de cancelación y facilidad de uso para alumnos.",
    nextStep: "Empieza comparando opciones reales y solicita una prueba con tu calendario.",
  },
  {
    title: "Plataforma actual + automatizaciones",
    forWhom: "Ya tienes reservas, pero los mensajes y seguimientos viven fuera del sistema.",
    whatToCheck: "Exportaciones, integraciones autorizadas, acceso a datos y funcionamiento de los avisos.",
    nextStep: "Conecta solo los pasos que hoy te hacen perder más tiempo.",
  },
  {
    title: "CRM o desarrollo personalizado",
    forWhom: "Tienes varios estudios, reglas especiales o procesos que no caben en una solución genérica.",
    whatToCheck: "Migración, permisos, mantenimiento, costos de operación y propiedad de los datos.",
    nextStep: "Documenta primero el flujo real y construye únicamente lo necesario.",
  },
];

export default function SoftwarePilatesGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Guía práctica · Pilates y Reformer"
        accent="orange"
        crumbs={crumbs}
        title="Software para estudios de pilates: qué elegir antes de contratar."
        lead="Reservas, reformers, paquetes y mensajes son partes de un mismo recorrido. Esta guía te ayuda a decidir qué sistema necesita tu estudio, sin comprar funciones que todavía no vas a usar."
      >
        <ButtonLink href="#comparar" size="lg" arrow>
          Comparar opciones
        </ButtonLink>
      </PageHero>

      <div id="guia-pilates" className="bg-suma-cream">
        <section aria-labelledby="respuesta-title" className="container-suma py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-eyebrow text-suma-orange-ink">La respuesta corta</p>
            <h2 id="respuesta-title" className="text-display-md mt-4">
              El mejor sistema es el que respeta cómo funciona tu estudio.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-suma-navy/80">
              Si lo único que necesitas es aceptar reservas y cobrar paquetes, una plataforma existente puede resolverlo.
              Si tu equipo utiliza una app para reservas, otra para cobros y WhatsApp para todo lo demás, quizá necesites
              integraciones y seguimiento. Un CRM a medida cobra sentido cuando tus reglas y operaciones no encajan en
              herramientas listas para usar. No hay que empezar desarrollando todo desde cero.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-suma-navy/80">
              Esta guía está dirigida a propietarios de estudios de pilates mat, reformer y barre en México.
              Si buscas una solución adaptada a tu operación, también puedes revisar nuestros
              {" "}<Link href="/industrias/yoga-pilates" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">servicios para estudios de yoga y pilates</Link>.
            </p>
          </div>
        </section>

        <section id="comparar" aria-labelledby="comparar-title" className="scroll-mt-20 bg-suma-cream-soft py-16 md:py-24">
          <div className="container-suma">
            <p className="text-eyebrow text-suma-purple">Elige con criterio</p>
            <h2 id="comparar-title" className="text-display-md mt-4 max-w-4xl">
              ¿Sistema de reservas, automatización o CRM personalizado?
            </h2>
            <p className="mt-5 max-w-3xl text-lg text-suma-navy/75">
              Las tres rutas pueden funcionar. Lo importante es reconocer dónde se pierde tiempo o información.
            </p>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {decisionOptions.map((option, i) => (
                <article key={option.title} className="rounded-[1.75rem] border border-suma-line bg-suma-cream p-7">
                  <span className="text-eyebrow text-suma-orange-ink">Opción 0{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl font-bold">{option.title}</h3>
                  <p className="mt-5 text-suma-navy/80">{option.forWhom}</p>
                  <p className="mt-5 text-sm font-bold">Qué revisar</p>
                  <p className="mt-1 text-suma-navy/80">{option.whatToCheck}</p>
                  <p className="mt-5 text-sm font-bold">Primer paso</p>
                  <p className="mt-1 text-suma-navy/80">{option.nextStep}</p>
                </article>
              ))}
            </div>
            <p className="mt-7 max-w-4xl text-base text-suma-navy/75">
              SUMA desarrolla e integra soluciones a medida, pero no todas las operaciones necesitan ese tipo de inversión.
              Si una herramienta ya resuelve tu proceso, puede ser preferible aprovecharla.
            </p>
          </div>
        </section>

        <section aria-labelledby="funciones-title" className="container-suma py-16 md:py-24">
          <p className="text-eyebrow text-suma-orange-ink">Lista de verificación</p>
          <h2 id="funciones-title" className="text-display-md mt-4 max-w-4xl">
            Seis funciones que vale la pena probar con un caso real.
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-suma-navy/75">
            No te conformes con una demostración bonita. Pide que hagan estos recorridos con los horarios y políticas de tu estudio.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-2">
            {essentialFunctions.map((feature, i) => (
              <li key={feature.name} className="rounded-[1.75rem] bg-suma-cream-soft p-7">
                <span className="font-display text-xl font-bold text-suma-purple">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl font-bold">{feature.name}</h3>
                <p className="mt-3 text-suma-navy/80">{feature.detail}</p>
                <p className="mt-4 border-t border-suma-line pt-4 font-semibold text-suma-navy">{feature.question}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="ejemplo-title" className="on-dark bg-suma-navy py-16 text-suma-cream md:py-24">
          <div className="container-suma grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-eyebrow text-suma-orange">Ejemplo hipotético</p>
              <h2 id="ejemplo-title" className="text-display-md mt-4">
                Una alumna cancela su clase de reformer. ¿Qué debería pasar?
              </h2>
              <p className="mt-6 text-lg text-suma-cream/75">
                Este flujo ilustrativo sirve para evaluar cualquier proveedor. No es un caso de cliente ni una promesa de funcionalidades existentes.
              </p>
            </div>
            <ol className="space-y-4">
              {[
                "El sistema verifica que la cancelación respeta la política del estudio.",
                "Libera un reformer y actualiza el cupo de la clase.",
                "Ofrece ese lugar a la siguiente persona en la lista de espera.",
                "Actualiza los créditos del paquete según las reglas acordadas.",
                "Muestra al equipo qué sucedió y qué queda pendiente de confirmar.",
              ].map((step, i) => (
                <li key={step} className="flex gap-5 rounded-2xl border border-suma-cream/20 bg-suma-cream/5 p-5">
                  <span className="font-display text-2xl font-bold text-suma-orange">0{i + 1}</span>
                  <span className="text-lg text-suma-cream/90">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="costos-title" className="container-suma py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-eyebrow text-suma-purple">Antes de contratar</p>
              <h2 id="costos-title" className="text-display-md mt-4">
                Compara el costo completo, no solo la mensualidad.
              </h2>
              <p className="mt-6 text-lg text-suma-navy/75">
                La tarifa de entrada no explica cuánto te costará operar o cambiar de plataforma.
                Pide una propuesta escrita y comprueba lo que incluye.
              </p>
            </div>
            <ul className="space-y-3 text-lg text-suma-navy/85">
              {[
                "Número de sedes, instructores y alumnos que contempla el plan.",
                "Comisiones por cobros, recordatorios y mensajes de WhatsApp.",
                "Costos de configuración, migración de alumnos y capacitación.",
                "Exportación de información, copias de seguridad y controles de acceso.",
                "Soporte, mantenimiento y qué pasa cuando necesitas una integración nueva.",
                "Condiciones para cancelar y recuperar tus datos si cambias de proveedor.",
              ].map((item) => (
                <li key={item} className="flex gap-3 border-b border-suma-line py-4">
                  <span aria-hidden="true" className="font-bold text-suma-orange-ink">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="suma-title" className="bg-suma-cream-soft py-16 md:py-24">
          <div className="container-suma">
            <div className="max-w-4xl">
              <p className="text-eyebrow text-suma-orange-ink">Dónde puede ayudarte SUMA</p>
              <h2 id="suma-title" className="text-display-md mt-4">
                No necesitas reemplazar todo para mejorar tu operación.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-suma-navy/80">
                Podemos analizar tu flujo de reserva, alumnos y seguimiento; después evaluar si conviene
                configurar una plataforma existente, conectar un
                {" "}<Link href="/servicios/chatbots" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">asistente para consultas frecuentes</Link>
                {" "}o diseñar un
                {" "}<Link href="/servicios/crm" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">CRM personalizado para estudios de pilates</Link>.
                La recomendación depende de tus procesos, presupuesto e integraciones disponibles.
              </p>
              <p className="mt-5 text-lg text-suma-navy/80">
                Trabajamos desde Monterrey con negocios en México. El diagnóstico empieza por entender
                el problema que necesitas resolver, no por imponerte un software.
              </p>
              <div className="mt-9">
                <ButtonLink href="/contacto" size="lg" arrow>
                  Cuéntanos cómo funciona tu estudio
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ClosingCta
        title="La tecnología debería adaptarse a tus clases, no al revés."
        text="Cuéntanos qué sistema utilizas hoy, qué procesos te cuestan más tiempo y qué te gustaría resolver primero."
        secondary={{ label: "Explorar CRM para pilates", href: "/servicios/crm" }}
      />
      <JsonLd
        data={pageGraph({
          path,
          name: seo.title,
          description: seo.description,
          crumbs,
          mainEntity: `${absoluteUrl(path)}#article`,
          about: [ids.service({ href: "/servicios/crm" })],
          extra: [
            {
              "@type": "Article",
              "@id": `${absoluteUrl(path)}#article`,
              headline: seo.title,
              description: seo.description,
              inLanguage: "es-MX",
              mainEntityOfPage: { "@id": ids.webpage(path) },
              author: { "@id": ids.organization },
              publisher: { "@id": ids.organization },
            },
          ],
        })}
      />
    </>
  );
}
