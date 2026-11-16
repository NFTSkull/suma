import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { WhatsAppPrivacyNotice } from "@/components/legal/WhatsAppPrivacyNotice";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { absoluteUrl, buildMetadata, ids, pageGraph } from "@/lib/seo";

const path = "/guias/chatbot-whatsapp-pilates";
const seo = {
  path,
  title: "Chatbot WhatsApp para estudios de pilates: guía práctica",
  description:
    "Qué automatizar en WhatsApp para un estudio de pilates: cupos, membresías, reservas reales, seguimiento y atención humana. Checklist de siete pruebas.",
  keywords: ["chatbot WhatsApp pilates", "automatizar WhatsApp estudio de pilates", "reservas WhatsApp pilates"],
};
const crumbs = [{ name: "Guías", path: "/guias" }, { name: "WhatsApp para pilates", path }];
export const metadata: Metadata = buildMetadata(seo);

const checks = [
  ["Horarios reales", "Pregunta por una clase que acaba de cambiar de horario.", "Consulta datos actualizados o deriva la pregunta. Nunca inventa clases."],
  ["Cupos y reformers", "Pide dos lugares cuando solo queda un reformer.", "Distingue solicitud y reserva, y no promete cupos inexistentes."],
  ["Créditos de membresía", "Intenta reservar con un paquete vencido.", "Comprueba reglas y saldo antes de confirmar."],
  ["Solicitudes simultáneas", "Dos alumnos piden el último lugar a la vez.", "Solo una transacción registra el lugar; la otra ofrece una alternativa."],
  ["Cancelaciones", "Cancela una clase dentro y fuera del plazo permitido.", "Respeta la política, actualiza la agenda y gestiona la lista de espera."],
  ["Atención humana", "Pregunta por un cobro erróneo o una excepción.", "Pasa el caso a una persona y conserva el contexto indispensable."],
  ["Privacidad", "Pregunta por consentimiento y baja de recordatorios.", "Explica el uso real de los datos y las reglas del canal."],
];

const options = [
  {
    title: "Respuestas rápidas",
    good: "Pocas consultas y un equipo que confirma reservas manualmente.",
    limit: "No se consulta ni modifica la agenda automáticamente.",
  },
  {
    title: "Asistente conectado a la agenda",
    good: "Alumnos preguntan por clases, cupos y cambios a lo largo del día.",
    limit: "Necesita integraciones autorizadas, manejo de errores y reglas de confirmación.",
  },
  {
    title: "CRM personalizado",
    good: "Múltiples sedes, paquetes especiales o sistemas que no comparten información.",
    limit: "Requiere definir alcance, migración, seguridad y mantenimiento antes de construir.",
  },
];

const faqs = [
  {
    q: "¿Un chatbot puede reservar clases de pilates por WhatsApp?",
    a: "Sí, si está conectado a una agenda que permite consultar disponibilidad y registrar reservas con controles. Si solo responde mensajes, debe recibir una solicitud sin presentarla como confirmada.",
  },
  {
    q: "¿Necesito cambiar el software de mi estudio?",
    a: "No necesariamente. Revisa primero si tu herramienta actual ofrece integraciones autorizadas; conectar lo que ya funciona puede ser más sencillo que sustituirlo.",
  },
  {
    q: "¿Qué pasa si dos personas piden el último lugar?",
    a: "El cupo se valida al registrar la reserva, no al escribir la respuesta. Una de las solicitudes puede requerir otra clase u horario.",
  },
  {
    q: "¿Puedo mandar recordatorios automáticos por WhatsApp?",
    a: "Depende del consentimiento aplicable, las políticas del canal y la configuración real de la cuenta. No se debe asumir que cualquier mensaje está permitido.",
  },
];

export default function ChatbotWhatsappPilatesGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Guía práctica · Pilates · Yoga · WhatsApp"
        accent="orange"
        crumbs={crumbs}
        title="Un chatbot para tu estudio no debería inventar lugares disponibles."
        lead="Antes de automatizar WhatsApp, prueba estas siete situaciones de operación. Así podrás distinguir un asistente que solo responde de uno que trabaja con tu agenda y tu equipo."
      >
        <ButtonLink href="#pruebas" size="lg" arrow>Ver las siete pruebas</ButtonLink>
      </PageHero>

      <div className="bg-suma-cream">
        <section className="container-suma py-16 md:py-24" aria-labelledby="respuesta-title">
          <p className="text-eyebrow text-suma-orange-ink">Respuesta directa</p>
          <h2 id="respuesta-title" className="text-display-md mt-4 max-w-4xl">Primero organiza tu agenda. Después automatiza la conversación.</h2>
          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-suma-navy/80">
            Un asistente de WhatsApp puede responder preguntas sobre horarios, ubicación, políticas y servicios.
            Pero escribir &ldquo;te esperamos&rdquo; no equivale a reservar: para confirmar un lugar
            debe consultar disponibilidad real, cupos y, cuando corresponda, créditos de membresía.
          </p>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-suma-navy/80">
            Si tu estudio ya tiene un software que funciona, evalúa sus integraciones antes de reemplazarlo.
            También puedes leer la{" "}
            <Link href="/guias/software-para-estudios-de-pilates" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">
              guía para elegir un CRM o sistema de reservas para pilates
            </Link>.
          </p>
        </section>

        <section className="on-dark bg-suma-navy py-16 text-suma-cream md:py-24" aria-labelledby="ejemplo-title">
          <div className="container-suma grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-eyebrow text-suma-orange">Ejemplo ilustrativo</p>
              <h2 id="ejemplo-title" className="text-display-md mt-4">Solicitud no es confirmación.</h2>
              <p className="mt-5 text-lg text-suma-cream/75">
                El segundo mensaje solo debería enviarse cuando la agenda registró la reserva correctamente.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-suma-cream/20 bg-suma-cream/5 p-6">
                <p className="text-sm font-bold uppercase tracking-wider text-suma-orange">Solicitud recibida</p>
                <p className="mt-3 text-lg">&ldquo;Recibimos tu solicitud de reformer para mañana a las 8:00. Revisaremos disponibilidad antes de confirmarla.&rdquo;</p>
              </div>
              <div className="rounded-2xl border border-suma-cream/20 bg-suma-cream/5 p-6">
                <p className="text-sm font-bold uppercase tracking-wider text-suma-orange">Reserva confirmada</p>
                <p className="mt-3 text-lg">&ldquo;Tu lugar para mañana a las 8:00 quedó registrado y confirmado. Consulta aquí nuestra política de cancelación.&rdquo;</p>
              </div>
              <p className="text-sm text-suma-cream/65">Mensajes hipotéticos; no representan sistemas instalados ni resultados de clientes.</p>
            </div>
          </div>
        </section>

        <section id="pruebas" className="container-suma scroll-mt-20 py-16 md:py-24" aria-labelledby="pruebas-title">
          <p className="text-eyebrow text-suma-orange-ink">Checklist para contratar</p>
          <h2 id="pruebas-title" className="text-display-md mt-4 max-w-4xl">Siete pruebas antes de contratar un chatbot.</h2>
          <p className="mt-5 max-w-3xl text-lg text-suma-navy/75">
            Pídele a cualquier proveedor que haga estas pruebas con las reglas reales de tu estudio.
          </p>
          <ol className="mt-10 grid gap-5 md:grid-cols-2">
            {checks.map(([title, test, expected], i) => (
              <li key={title} className="rounded-[1.75rem] border border-suma-line bg-suma-cream-soft p-7">
                <span className="font-display text-2xl font-bold text-suma-purple">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-2xl font-bold">{title}</h3>
                <p className="mt-4 text-suma-navy/80"><strong>Prueba:</strong> {test}</p>
                <p className="mt-4 border-t border-suma-line pt-4 text-suma-navy/75"><strong>Resultado esperado:</strong> {expected}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-suma-cream-soft py-16 md:py-24" aria-labelledby="opciones-title">
          <div className="container-suma">
            <p className="text-eyebrow text-suma-purple">Elige según tu operación</p>
            <h2 id="opciones-title" className="text-display-md mt-4 max-w-4xl">Tres opciones, sin contratar más de lo necesario.</h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {options.map((option) => (
                <article key={option.title} className="rounded-[1.75rem] border border-suma-line bg-suma-cream p-7">
                  <h3 className="font-display text-2xl font-bold">{option.title}</h3>
                  <p className="mt-5 text-suma-navy/80"><strong>Cuándo conviene:</strong> {option.good}</p>
                  <p className="mt-5 border-t border-suma-line pt-5 text-suma-navy/75"><strong>Qué revisar:</strong> {option.limit}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container-suma py-16 md:py-24" aria-labelledby="medir-title">
          <p className="text-eyebrow text-suma-orange-ink">Medición</p>
          <h2 id="medir-title" className="text-display-md mt-4 max-w-4xl">Mide reservas confirmadas, no solo mensajes.</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            <li className="rounded-2xl bg-suma-cream-soft p-6"><h3 className="font-display text-xl font-bold">Primera respuesta útil</h3><p className="mt-3 text-suma-navy/75">Tiempo desde la consulta hasta que alguien puede avanzar con su solicitud.</p></li>
            <li className="rounded-2xl bg-suma-cream-soft p-6"><h3 className="font-display text-xl font-bold">Solicitudes confirmadas</h3><p className="mt-3 text-suma-navy/75">Reservas registradas frente a solicitudes válidas en el mismo periodo.</p></li>
            <li className="rounded-2xl bg-suma-cream-soft p-6"><h3 className="font-display text-xl font-bold">Atención humana</h3><p className="mt-3 text-suma-navy/75">Casos que pasan a recepción y si se resuelven.</p></li>
          </ul>
        </section>

        <section className="bg-suma-cream-soft py-16 md:py-24" aria-labelledby="preguntas-title">
          <div className="container-suma grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div><p className="text-eyebrow text-suma-purple">Preguntas frecuentes</p><h2 id="preguntas-title" className="text-display-md mt-4">Antes de conectar WhatsApp.</h2></div>
            <dl className="space-y-7">
              {faqs.map(({ q, a }) => (
                <div key={q} className="border-b border-suma-line pb-6"><dt className="font-display text-xl font-bold">{q}</dt><dd className="mt-3 text-suma-navy/80">{a}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section className="container-suma py-16 md:py-20" aria-labelledby="siguiente-title">
          <p className="text-eyebrow text-suma-orange-ink">Siguiente paso</p>
          <h2 id="siguiente-title" className="text-display-md mt-4">Conecta WhatsApp con tu operación real.</h2>
          <p className="mt-5 max-w-3xl text-lg text-suma-navy/75">Cuéntanos qué agenda utilizas, qué tipo de clases impartes y qué tareas te quitan más tiempo.</p>
          <div className="mt-8 space-y-3">
            <div className="flex flex-wrap items-center gap-5">
              <ButtonLink href={site.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" size="lg" arrow>Hablar con SUMA por WhatsApp</ButtonLink>
              <ButtonLink href="/contacto" variant="link">Prefiero el formulario</ButtonLink>
              <Link href="/servicios/chatbots" className="inline-flex min-h-12 items-center font-bold underline decoration-suma-orange decoration-2 underline-offset-4">Ver nuestros chatbots</Link>
            </div>
            <WhatsAppPrivacyNotice />
          </div>
          <p className="mt-8 max-w-3xl text-sm text-suma-navy/65">Material educativo de SUMA STUDIO. Los escenarios son hipotéticos y no constituyen testimonios, implementaciones reales ni resultados garantizados.</p>
        </section>
      </div>

      <ClosingCta
        title="Que WhatsApp ayude a tu estudio, sin comprometer las reservas."
        text="Podemos revisar tu flujo de consultas y evaluar si conviene conectar las herramientas que ya utilizas o desarrollar una solución a medida."
        secondary={{ label: "Comparar software para pilates", href: "/guias/software-para-estudios-de-pilates" }}
      />
      <JsonLd data={pageGraph({
        path, name: seo.title, description: seo.description, crumbs,
        mainEntity: absoluteUrl(path) + "#article",
        about: [ids.service({ href: "/servicios/chatbots" }), ids.service({ href: "/servicios/crm" })],
        faqs,
        extra: [{
          "@type": "Article",
          "@id": absoluteUrl(path) + "#article",
          headline: seo.title, description: seo.description, inLanguage: "es-MX",
          mainEntityOfPage: { "@id": ids.webpage(path) },
          author: { "@id": ids.organization }, publisher: { "@id": ids.organization },
        }],
      })} />
    </>
  );
}
