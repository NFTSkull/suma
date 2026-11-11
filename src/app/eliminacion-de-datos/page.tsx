import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "Eliminación de datos",
  description: "Instrucciones para solicitar la eliminación de tus datos personales relacionados con aplicaciones de SUMA STUDIO conectadas a Meta.",
  path: "/eliminacion-de-datos",
};
const crumbs = [{ name: "Eliminación de datos", path: "/eliminacion-de-datos" }];

export const metadata: Metadata = buildMetadata(seo);

function Placeholder({ children }: { children: string }) {
  return <mark className="rounded bg-suma-orange/20 px-1 font-semibold text-suma-navy">{children}</mark>;
}

export default function EliminacionPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        accent="purple"
        crumbs={crumbs}
        title="Eliminación de datos"
        lead="Instrucciones para solicitar la eliminación de tus datos personales, incluidos los relacionados con aplicaciones de SUMA conectadas a Meta."
      />
      <article className="container-suma max-w-3xl space-y-10 pb-28 text-lg leading-relaxed text-suma-navy/85 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-suma-navy [&_li]:mt-2 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <p className="rounded-2xl border-2 border-dashed border-suma-orange-ink/40 bg-suma-orange/10 p-5 text-base">
          <strong>Aviso:</strong> Este documento contiene placeholders visibles (datos entre corchetes) que deben completarse antes de su publicación definitiva. La información jurídica aquí incluida debe ser revisada por un especialista legal.
        </p>

        <section>
          <p className="text-sm text-suma-navy/60">
            <strong>Última actualización:</strong> <Placeholder>[FECHA DE ENTRADA EN VIGOR — PENDIENTE]</Placeholder>
          </p>
        </section>

        <section>
          <p className="mt-3">
            Esta página explica cómo pedirnos que eliminemos tus datos personales, incluidos los relacionados con el uso de aplicaciones de SUMA conectadas a Meta (por ejemplo, SUMA Inbox, cuando exista). Forma parte de las instrucciones que Meta pide en los ajustes de la aplicación («User Data Deletion» / URL de instrucciones de eliminación).
          </p>
          <p className="mt-3">
            El responsable es VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V., con nombre comercial SUMA Studio y domicilio en <Placeholder>[DOMICILIO PENDIENTE DE CONFIRMAR]</Placeholder>. El tratamiento general se describe en el <a href="/aviso-de-privacidad" className="underline decoration-suma-purple underline-offset-4">Aviso de privacidad</a>.
          </p>
        </section>

        <section>
          <h2>1. Cómo solicitar la eliminación</h2>
          <p className="mt-3">
            Envía un correo a <a href="mailto:ventas@sumastudio.mx" className="underline decoration-suma-purple underline-offset-4">ventas@sumastudio.mx</a> con el asunto «Solicitud de eliminación de datos» e incluye:
          </p>
          <ul>
            <li>tu nombre completo;</li>
            <li>un medio para responderte;</li>
            <li>una descripción de los datos o del servicio a los que se refiere la solicitud (por ejemplo, formulario de este sitio, cuenta de cliente, o uso de una aplicación de SUMA en Facebook o WhatsApp);</li>
            <li>un documento o dato que permita acreditar tu identidad.</li>
          </ul>
          <p className="mt-3">
            También puedes ejercer el derecho de cancelación u otros derechos ARCO por la misma vía, en los términos del aviso de privacidad y de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
          </p>
          <p className="mt-3">
            Responderemos en un plazo máximo de veinte días hábiles y, si la solicitud procede, haremos efectiva la eliminación dentro de los quince días siguientes a nuestra respuesta, salvo ampliación justificada por una sola vez, conforme al artículo 31 de la Ley.
          </p>
        </section>

        <section>
          <h2>2. Qué eliminamos y qué podemos conservar</h2>
          <p className="mt-3">
            Cuando la solicitud proceda, eliminaremos o bloquearemos los datos personales que tratemos como responsables y que ya no sea necesario conservar. Podemos retener, bloqueados o en la medida estrictamente indispensable, los datos que la ley nos obligue a conservar (por ejemplo, obligaciones fiscales o la defensa de un derecho), o durante el periodo de bloqueo que prevé la Ley.
          </p>
          <p className="mt-3">
            Si tus datos los trata un cliente de SUMA Inbox (mensajes de WhatsApp u otros datos de sus contactos), ese cliente es el responsable. En ese caso, canalizaremos tu solicitud hacia él y cooperaremos en lo que nos corresponda como encargada. También puedes dirigirla primero a ese negocio.
          </p>
        </section>

        <section>
          <h2>3. Si usaste una aplicación de SUMA con tu cuenta de Facebook</h2>
          <p className="mt-3">
            Puedes solicitar la eliminación desde tu cuenta de Facebook:
          </p>
          <ol>
            <li>Abre <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer" className="underline decoration-suma-purple underline-offset-4">Configuración y privacidad › Configuración › Aplicaciones y sitios web</a>.</li>
            <li>Quita la aplicación de SUMA.</li>
            <li>En aplicaciones eliminadas, pulsa <strong>Enviar solicitud</strong> (Send Request) para pedir que se eliminen tus datos.</li>
          </ol>
          <p className="mt-3">
            Si en el futuro implementamos el <em>callback</em> técnico de Meta (véase el apartado 4), esa solicitud llegará también de forma automática a nuestros sistemas.
          </p>
        </section>

        <section>
          <h2>4. Alternativa técnica: callback de eliminación de Meta</h2>
          <p className="mt-3">
            Además de esta página de instrucciones, Meta permite configurar una <strong>Data Deletion Request URL</strong> (callback) en los ajustes de la aplicación. Ese endpoint, si se implementa, recibe un <code className="rounded bg-suma-navy/10 px-1.5 py-0.5 text-base">POST</code> firmado cuando una persona quita la app y pide borrar sus datos, y debe responder un JSON con una URL de seguimiento y un código de confirmación, en HTTPS.
          </p>
          <p className="mt-3">
            No está implementado todavía. Cuando exista, publicaremos en esta misma página la ruta del callback (solo la URL pública de estado, no secretos) y el modo de consultar el folio. Mientras tanto, el canal de correo del apartado 1 es el medio vigente para pedir la eliminación.
          </p>
          <p className="mt-3">
            La implementación del callback requiere autorización para desarrollar en el sitio o en el backend, y no forma parte de esta preparación.
          </p>
        </section>

        <section>
          <h2>5. Contacto</h2>
          <p className="mt-3">
            VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V.<br />
            <Placeholder>[DOMICILIO PENDIENTE DE CONFIRMAR]</Placeholder><br />
            Correo: <a href="mailto:ventas@sumastudio.mx" className="underline decoration-suma-purple underline-offset-4">ventas@sumastudio.mx</a>
          </p>
        </section>
      </article>
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description, crumbs })} />
    </>
  );
}
