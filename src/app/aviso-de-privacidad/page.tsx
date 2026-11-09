import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad del sitio de SUMA STUDIO: datos del formulario de contacto, proveedores, medición con consentimiento y derechos ARCO.",
  path: "/aviso-de-privacidad",
};
const crumbs = [{ name: "Aviso de privacidad", path: "/aviso-de-privacidad" }];

/** Borrador con datos pendientes: `buildMetadata` lo marca noindex (ver `noindexRoutes`). */
export const metadata: Metadata = buildMetadata(seo);

function Pendiente({ children }: { children: string }) {
  return <mark className="rounded bg-suma-orange/20 px-1 font-semibold text-suma-navy">[Pendiente: {children}]</mark>;
}

export default function AvisoPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        accent="purple"
        crumbs={crumbs}
        title="Aviso de privacidad"
        lead="Borrador base conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Debe completarse y revisarse por un especialista antes de su publicación."
      />
      <article className="container-suma max-w-3xl space-y-10 pb-28 text-lg leading-relaxed text-suma-navy/85 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-suma-navy [&_li]:mt-2 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <p className="rounded-2xl border-2 border-dashed border-suma-orange-ink/40 bg-suma-orange/10 p-5 text-base">
          <strong>Estado: borrador.</strong> Este documento describe los servicios que usa el sitio, pero aún no está completo ni ha sido aprobado por
          un especialista legal. Los datos marcados como pendientes deben proporcionarlos los responsables de SUMA STUDIO.
        </p>

        <section>
          <h2>Responsable</h2>
          <p className="mt-3">
            SUMA STUDIO (<Pendiente>razón social o nombre del titular</Pendiente>), con domicilio en <Pendiente>domicilio para oír y recibir notificaciones</Pendiente>, es
            responsable del tratamiento de tus datos personales. Contacto para temas de privacidad: <Pendiente>correo de privacidad y, en su caso, persona o área responsable</Pendiente>.
          </p>
        </section>

        <section>
          <h2>Datos que recabamos</h2>
          <p className="mt-3">
            <strong>Formulario de contacto.</strong> Nombre, nombre de tu negocio, tipo de negocio, correo electrónico, número de WhatsApp, servicios de
            interés y, si lo compartes, un mensaje. Si llegaste desde el selector de soluciones, también el tipo de negocio y el reto que elegiste ahí.
          </p>
          <p className="mt-3">
            <strong>Datos técnicos.</strong> Para proteger el formulario contra abusos, el servidor usa temporalmente tu dirección IP para limitar el
            número de envíos y nuestro proveedor de alojamiento registra datos técnicos de las solicitudes. Nuestros registros internos del formulario
            no guardan tu nombre, correo, teléfono ni mensaje.
          </p>
          <p className="mt-3">
            <strong>Estadísticas de uso, solo con tu permiso.</strong> Si aceptas la medición, Google Analytics registra páginas visitadas, tipo de
            dispositivo y navegador, ubicación aproximada y acciones en el sitio (por ejemplo, enviar el formulario o completar el selector), sin tu
            nombre, correo, teléfono ni el contenido de tus mensajes.
          </p>
          <p className="mt-3">No recabamos datos personales sensibles. El selector de soluciones no solicita datos personales.</p>
        </section>

        <section>
          <h2>Finalidades</h2>
          <p className="mt-3">Usamos los datos del formulario para:</p>
          <ul>
            <li>Atender y responder tu solicitud de contacto.</li>
            <li>Comunicarnos contigo por correo o WhatsApp sobre lo que nos pediste.</li>
            <li>Dar seguimiento comercial a tu solicitud y, si lo deseas, preparar una propuesta de servicios.</li>
          </ul>
          <p className="mt-3">
            Las estadísticas de uso, cuando las aceptas, sirven para entender cómo se usa el sitio y mejorarlo. No las usamos para publicidad.
          </p>
          <p className="mt-3">
            <Pendiente>definir si alguna finalidad es secundaria (por ejemplo, seguimiento comercial posterior) y el mecanismo para negarse a ella</Pendiente>
          </p>
        </section>

        <section>
          <h2>Proveedores que nos ayudan a tratar tus datos</h2>
          <p className="mt-3">Para operar el sitio nos apoyamos en estos proveedores, que tratan los datos por cuenta de SUMA STUDIO:</p>
          <ul>
            <li>
              <strong>Resend</strong> (envío de correo electrónico): recibe los datos del formulario para enviarlos por correo a nuestro buzón. Sus servidores se
              ubican en Estados Unidos.
            </li>
            <li>
              <strong>Proveedor del buzón que recibe las solicitudes</strong>: <Pendiente>confirmar el servicio de correo definitivo</Pendiente>.
            </li>
            <li>
              <strong>Vercel</strong> (alojamiento del sitio): procesa las solicitudes al sitio y al formulario.
            </li>
            <li>
              <strong>Google</strong> (Google Tag Manager y Google Analytics 4): solo si aceptas la medición. Google Tag Manager carga Google Analytics y no se
              descarga en tu navegador hasta que das tu permiso.
            </li>
          </ul>
          <p className="mt-3">
            No vendemos tus datos ni los compartimos con fines publicitarios. <Pendiente>revisión legal de estas comunicaciones (remisiones o transferencias) y de las transferencias internacionales</Pendiente>
          </p>
        </section>

        <section>
          <h2>Cookies, almacenamiento local y preferencias de medición</h2>
          <p className="mt-3">
            Al entrar al sitio te preguntamos si aceptas las estadísticas de uso. Mientras no decidas, o si las rechazas, no se cargan Google Tag Manager
            ni Google Analytics. Si las aceptas, Google Analytics puede usar cookies para distinguir visitas.
          </p>
          <p className="mt-3">
            Guardamos tu decisión en el almacenamiento local de tu navegador para no volver a preguntarte en cada página. El selector de soluciones guarda
            temporalmente, durante la sesión, el tipo de negocio y el reto que elegiste para prellenar el formulario; no incluye datos personales.
          </p>
          <p className="mt-3">
            No usamos cookies publicitarias. Puedes cambiar tu decisión en cualquier momento desde «Preferencias de privacidad», al pie de cada página, o
            borrar las cookies y el almacenamiento desde la configuración de tu navegador.
          </p>
        </section>

        <section>
          <h2>Conservación de los datos</h2>
          <p className="mt-3">
            Conservamos los datos del formulario mientras atendemos tu solicitud y durante el seguimiento comercial: <Pendiente>plazo de conservación y
            criterio de eliminación</Pendiente>. Las estadísticas de Google Analytics se conservan según el periodo configurado en esa herramienta:{" "}
            <Pendiente>periodo de retención configurado en Google Analytics</Pendiente>.
          </p>
        </section>

        <section>
          <h2>Derechos ARCO y revocación del consentimiento</h2>
          <p className="mt-3">
            Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos, revocar tu consentimiento o limitar su uso
            escribiendo a <Pendiente>correo para solicitudes ARCO</Pendiente>.
          </p>
          <p className="mt-3">
            Tu solicitud debe incluir tu nombre, un medio para responderte, la descripción de los datos y del derecho que quieres ejercer, y lo necesario
            para identificarte. <Pendiente>procedimiento, plazos de respuesta y medios de acreditación de identidad</Pendiente>
          </p>
          <p className="mt-3">Para las estadísticas de uso, puedes retirar tu permiso directamente en «Preferencias de privacidad».</p>
        </section>

        <section>
          <h2>Cambios a este aviso</h2>
          <p className="mt-3">
            Cualquier cambio se publicará en esta página. Última actualización: <Pendiente>fecha de entrada en vigor</Pendiente>.
          </p>
        </section>
      </article>
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description, crumbs })} />
    </>
  );
}
