import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl, buildMetadata, ids, pageGraph } from "@/lib/seo";

const path = "/guias/automatizar-reservas-spa";
const seo = {
  path,
  title: "Cómo automatizar reservas de un spa | Guía práctica",
  description:
    "Guía para automatizar reservas en un spa: consultas por WhatsApp, disponibilidad, confirmaciones, cancelaciones y seguimiento sin perder atención humana.",
  keywords: [
    "automatizar reservas spa",
    "WhatsApp para reservas de spa",
    "sistema de citas para spa",
    "recordatorios automáticos spa",
  ],
};
const crumbs = [
  { name: "Guías", path: "/guias" },
  { name: "Automatizar reservas de un spa", path },
];
export const metadata: Metadata = buildMetadata(seo);

const flow = [
  {
    step: "01",
    title: "La consulta entra",
    question: "¿Tienen masaje de pareja el sábado?",
    action: "El equipo o un asistente recoge servicio, horario preferido y datos mínimos de contacto.",
    caution: "No prometas disponibilidad antes de revisar agenda y cabinas.",
  },
  {
    step: "02",
    title: "Se revisa disponibilidad real",
    question: "¿Hay cabina y terapeuta para ese servicio?",
    action: "La agenda compara duración, tiempos de preparación, cabinas y terapeutas disponibles.",
    caution: "Dos personas no deben confirmar el mismo recurso al mismo tiempo.",
  },
  {
    step: "03",
    title: "Se confirma o propone alternativa",
    question: "¿La persona aceptó el horario?",
    action: "Se comunica el horario y, si aplica, las condiciones de anticipo y cancelación.",
    caution: "Distingue una solicitud recibida de una cita efectivamente confirmada.",
  },
  {
    step: "04",
    title: "Se envía un recordatorio",
    question: "¿Sigue en pie la cita?",
    action: "Se solicita confirmación y se ofrece un camino claro para cancelar o reagendar.",
    caution: "Los mensajes dependen de consentimiento, políticas y capacidades del canal utilizado.",
  },
  {
    step: "05",
    title: "La agenda se actualiza",
    question: "¿Se confirmó, canceló o pidió cambiar la cita?",
    action: "Se registra el resultado, se libera la cabina cuando corresponda y se avisa a recepción.",
    caution: "La automatización debe dejar a una persona resolver excepciones.",
  },
  {
    step: "06",
    title: "Se da seguimiento sin invadir",
    question: "¿Conviene invitar a una nueva visita?",
    action: "Con el permiso correspondiente, se puede enviar un seguimiento pertinente o una invitación a reservar.",
    caution: "Evita mensajes repetitivos y no utilices información sensible de tratamientos para segmentar publicidad.",
  },
];

const checklist = [
  ["Agenda única", "Un mismo estado para las citas que llegan por WhatsApp, web o recepción."],
  ["Recursos y duración", "Disponibilidad por cabina, terapeuta, servicio y tiempos de preparación."],
  ["Estados claros", "Solicitud, pendiente de confirmación, confirmada, cancelada, reagendada y atendida."],
  ["Políticas visibles", "Anticipos, tolerancia, cancelaciones, devoluciones y cambios de horario."],
  ["Equipo responsable", "Una persona asignada para casos especiales y conflictos de agenda."],
  ["Permisos y privacidad", "Acceso por rol, datos mínimos y políticas de conservación apropiadas."],
];

const scenarios = [
  {
    title: "Spa pequeño con agenda sencilla",
    ideal: "Un calendario compartido, reglas claras y confirmaciones manuales pueden ser suficientes al inicio.",
    next: "Documenta qué mensajes se repiten y cuánto tiempo tarda tu equipo en contestar.",
  },
  {
    title: "Spa con volumen de mensajes",
    ideal: "Conviene conectar la agenda con respuestas frecuentes y recordatorios, siempre que la herramienta lo permita.",
    next: "Prioriza una automatización: confirmar, cancelar y actualizar estados antes de agregar más funciones.",
  },
  {
    title: "Spa con varias cabinas o sucursales",
    ideal: "Un CRM integrado o una solución personalizada puede ayudar cuando existen reglas complejas, equipos y sistemas separados.",
    next: "Define permisos, sincronización, migración y reportes antes de desarrollar.",
  },
];

const faqs = [
  {
    q: "¿Necesito un chatbot para automatizar las reservas de mi spa?",
    a: "No necesariamente. Primero necesitas una agenda confiable y un flujo claro de confirmación. Un asistente puede resolver preguntas repetidas, pero no debe confirmar horarios que el sistema no ha validado.",
  },
  {
    q: "¿Puedo automatizar mensajes de WhatsApp?",
    a: "Es posible mediante opciones oficiales y herramientas compatibles. La capacidad concreta depende de tu cuenta, el proveedor, las autorizaciones y las políticas vigentes de WhatsApp.",
  },
  {
    q: "¿Un CRM sustituye a recepción?",
    a: "No. Un CRM ayuda a organizar citas, clientes y seguimientos. La atención humana sigue siendo esencial para excepciones, quejas, preferencias especiales y decisiones delicadas.",
  },
  {
    q: "¿Cómo empiezo sin cambiar todo mi sistema?",
    a: "Prueba primero el recorrido completo de una reserva, identifica dónde se duplican mensajes o se pierden citas y automatiza un solo paso. Solo después considera integrar más herramientas.",
  },
];

export default function GuiaReservasSpaPage() {
  return (
    <>
      <PageHero
        eyebrow="Guía práctica · Spas y bienestar"
        accent="purple"
        crumbs={crumbs}
        title="Cómo automatizar las reservas de un spa sin perder el trato humano."
        lead="La experiencia de tus clientes empieza antes de entrar a la cabina. Aquí tienes un recorrido práctico para ordenar consultas, disponibilidad, confirmaciones y seguimiento sin prometer citas que aún no existen."
      >
        <ButtonLink href="#flujo" size="lg" arrow>Ver el flujo de reservas</ButtonLink>
      </PageHero>

      <div className="bg-suma-cream">
        <section aria-labelledby="respuesta-title" className="container-suma py-16 md:py-24">
          <p className="text-eyebrow text-suma-orange-ink">Respuesta rápida</p>
          <h2 id="respuesta-title" className="text-display-md mt-4 max-w-4xl">
            Automatizar no es contestar más mensajes. Es evitar que una reserva se pierda.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-suma-navy/80">
            Para automatizar citas en un spa, conecta cinco cosas: consultas entrantes, agenda con
            disponibilidad real, confirmación, cambios de horario y seguimiento. Cada etapa debe
            tener un estado visible para el equipo. Empieza por la más problemática; no es
            necesario construir un sistema nuevo si tu plataforma actual ya resuelve el proceso.
          </p>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-suma-navy/80">
            Si tu prioridad es la operación completa, conoce nuestras
            {" "}<Link href="/industrias/spas" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">soluciones digitales para spas</Link>.
            Si lo que más te consume son las preguntas repetidas, revisa también los
            {" "}<Link href="/servicios/chatbots" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">asistentes para WhatsApp y web</Link>.
          </p>
        </section>

        <section id="flujo" aria-labelledby="flujo-title" className="scroll-mt-20 bg-suma-cream-soft py-16 md:py-24">
          <div className="container-suma">
            <p className="text-eyebrow text-suma-purple">De la primera pregunta a la próxima visita</p>
            <h2 id="flujo-title" className="text-display-md mt-4 max-w-4xl">
              Un flujo de reservas que puedes probar antes de contratar software.
            </h2>
            <p className="mt-6 max-w-3xl text-lg text-suma-navy/75">
              Ejemplo hipotético de operación: no representa un cliente real ni una automatización
              ya instalada por SUMA. Úsalo para evaluar cómo debería responder tu sistema.
            </p>
            <ol className="mt-10 grid gap-5 md:grid-cols-2">
              {flow.map((item) => (
                <li key={item.step} className="rounded-[1.75rem] border border-suma-line bg-suma-cream p-7">
                  <span className="font-display text-2xl font-bold text-suma-purple">{item.step}</span>
                  <h3 className="mt-4 font-display text-2xl font-bold">{item.title}</h3>
                  <p className="mt-4 text-lg font-semibold">{item.question}</p>
                  <p className="mt-3 leading-relaxed text-suma-navy/80">{item.action}</p>
                  <p className="mt-5 border-t border-suma-line pt-4 text-sm text-suma-navy/75">
                    <strong>Atención:</strong> {item.caution}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="whatsapp-title" className="on-dark bg-suma-navy py-16 text-suma-cream md:py-24">
          <div className="container-suma grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-eyebrow text-suma-orange">WhatsApp y confirmaciones</p>
              <h2 id="whatsapp-title" className="text-display-md mt-4">
                Una consulta no es una cita confirmada.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-suma-cream/75">
                Un error común es contestar “¡Listo, te esperamos!” sin verificar la agenda.
                Una automatización segura distingue los estados y sabe cuándo derivar a recepción.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-suma-cream/20 bg-suma-cream/5 p-6">
                <p className="text-sm font-bold uppercase tracking-wider text-suma-orange">Solicitud recibida</p>
                <p className="mt-3 text-lg">“Recibimos tu solicitud para un masaje el sábado. Revisaremos disponibilidad y te confirmaremos el horario.”</p>
              </div>
              <div className="rounded-2xl border border-suma-cream/20 bg-suma-cream/5 p-6">
                <p className="text-sm font-bold uppercase tracking-wider text-suma-orange">Cita confirmada</p>
                <p className="mt-3 text-lg">“Tu cita quedó confirmada para las 17:00. Te compartimos la información necesaria y la forma de reagendar.”</p>
              </div>
              <p className="text-sm text-suma-cream/65">
                Mensajes ilustrativos. La automatización depende de las autorizaciones, reglas y características del canal que uses.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="checklist-title" className="container-suma py-16 md:py-24">
          <p className="text-eyebrow text-suma-orange-ink">Checklist de contratación</p>
          <h2 id="checklist-title" className="text-display-md mt-4 max-w-4xl">
            Seis condiciones que tu sistema debería resolver.
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-suma-navy/75">
            Pide una demostración con dos clientes que solicitan el mismo horario y una persona que cancela. Ahí aparecen los problemas de verdad.
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {checklist.map(([name, explanation]) => (
              <li key={name} className="rounded-[1.75rem] bg-suma-cream-soft p-7">
                <h3 className="font-display text-2xl font-bold">{name}</h3>
                <p className="mt-3 text-suma-navy/80">{explanation}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="opciones-title" className="bg-suma-cream-deep/60 py-16 md:py-24">
          <div className="container-suma">
            <p className="text-eyebrow text-suma-purple">Elige según tu operación</p>
            <h2 id="opciones-title" className="text-display-md mt-4 max-w-4xl">
              ¿Agenda sencilla, automatización o CRM personalizado?
            </h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {scenarios.map((scenario) => (
                <article key={scenario.title} className="rounded-[1.75rem] border border-suma-line bg-suma-cream p-7">
                  <h3 className="font-display text-2xl font-bold">{scenario.title}</h3>
                  <p className="mt-5 leading-relaxed text-suma-navy/80">{scenario.ideal}</p>
                  <p className="mt-5 border-t border-suma-line pt-5 text-sm font-bold">Primer paso</p>
                  <p className="mt-2 text-suma-navy/80">{scenario.next}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 max-w-4xl text-lg text-suma-navy/75">
              Compara los costos completos: mensualidad, mensajes, anticipos o cobros, configuración,
              migración, capacitación y mantenimiento. Pregunta también cómo puedes exportar la
              información si cambias de proveedor.
            </p>
          </div>
        </section>

        <section aria-labelledby="medir-title" className="container-suma py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-eyebrow text-suma-orange-ink">Medir para mejorar</p>
              <h2 id="medir-title" className="text-display-md mt-4">Tres números que sí vale la pena seguir.</h2>
              <p className="mt-6 text-lg text-suma-navy/75">
                Define primero qué cuenta como solicitud y qué cuenta como cita confirmada.
                Sin esa distinción, cualquier reporte puede dar una impresión equivocada.
              </p>
            </div>
            <dl className="space-y-5">
              <div className="border-t-2 border-suma-navy pt-5">
                <dt className="font-display text-2xl font-bold">Tiempo hasta la primera respuesta</dt>
                <dd className="mt-2 text-suma-navy/75">Desde que llega una consulta hasta que una persona o asistente responde de forma útil.</dd>
              </div>
              <div className="border-t-2 border-suma-navy pt-5">
                <dt className="font-display text-2xl font-bold">Solicitudes que terminan en cita</dt>
                <dd className="mt-2 text-suma-navy/75">Reservas confirmadas entre solicitudes válidas recibidas durante el mismo periodo, con un criterio consistente.</dd>
              </div>
              <div className="border-t-2 border-suma-navy pt-5">
                <dt className="font-display text-2xl font-bold">Cancelaciones y espacios recuperados</dt>
                <dd className="mt-2 text-suma-navy/75">Cuántos horarios se liberan a tiempo y cuántos se ocupan de nuevo, sin prometer una reducción automática de ausencias.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section aria-labelledby="faq-spa-title" className="bg-suma-cream-soft py-16 md:py-24">
          <div className="container-suma grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-eyebrow text-suma-purple">Preguntas frecuentes</p>
              <h2 id="faq-spa-title" className="text-display-md mt-4">Antes de automatizar.</h2>
            </div>
            <dl className="space-y-8">
              {faqs.map(({ q, a }) => (
                <div key={q} className="border-b border-suma-line pb-7">
                  <dt className="font-display text-xl font-bold">{q}</dt>
                  <dd className="mt-3 leading-relaxed text-suma-navy/80">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="enlaces-title" className="container-suma py-16 md:py-20">
          <p className="text-eyebrow text-suma-orange-ink">Siguientes recursos</p>
          <h2 id="enlaces-title" className="text-display-md mt-4">Cada negocio necesita una solución distinta.</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/servicios/crm" className="inline-flex min-h-12 items-center rounded-full border-2 border-suma-navy px-6 font-bold hover:bg-suma-cream-deep">CRM para spas →</Link>
            <Link href="/guias/software-para-estudios-de-pilates" className="inline-flex min-h-12 items-center rounded-full border-2 border-suma-navy px-6 font-bold hover:bg-suma-cream-deep">Software para pilates →</Link>
            <Link href="/guias" className="inline-flex min-h-12 items-center rounded-full border-2 border-suma-navy px-6 font-bold hover:bg-suma-cream-deep">Todas las guías →</Link>
          </div>
          <p className="mt-8 max-w-4xl text-sm text-suma-navy/65">
            Contenido educativo de SUMA STUDIO. Los escenarios son conceptuales; no muestran clientes,
            integraciones activas ni resultados garantizados.
          </p>
        </section>
      </div>

      <ClosingCta
        title="Que tus citas fluyan, sin complicar a tu equipo."
        text="Cuéntanos cómo recibes solicitudes, quién confirma horarios y qué parte del proceso te quita más tiempo. Podemos evaluar si conviene integrar tu sistema actual o crear algo a medida."
        secondary={{ label: "Ver soluciones para spas", href: "/industrias/spas" }}
      />
      <JsonLd
        data={pageGraph({
          path,
          name: seo.title,
          description: seo.description,
          crumbs,
          mainEntity: `${absoluteUrl(path)}#article`,
          about: [ids.service({ href: "/servicios/chatbots" }), ids.service({ href: "/servicios/crm" })],
          faqs,
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
