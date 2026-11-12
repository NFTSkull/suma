import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, pageGraph } from "@/lib/seo";
import { legalDomicile, legalEffectiveDate } from "@/content/site";

const seo = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso del sitio web y de SUMA Inbox prestados por VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V. (SUMA STUDIO).",
  path: "/terminos-y-condiciones",
};
const crumbs = [{ name: "Términos y condiciones", path: "/terminos-y-condiciones" }];

export const metadata: Metadata = buildMetadata(seo);

function Placeholder({ children }: { children: string }) {
  return <mark className="rounded bg-suma-orange/20 px-1 font-semibold text-suma-navy">{children}</mark>;
}

export default function TerminosPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        accent="purple"
        crumbs={crumbs}
        title="Términos y condiciones"
        lead="Términos y condiciones de uso del sitio web y de SUMA Inbox prestados por VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V."
      />
      <article className="container-suma max-w-3xl space-y-10 pb-28 text-lg leading-relaxed text-suma-navy/85 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-suma-navy [&_li]:mt-2 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <p className="rounded-2xl border-2 border-dashed border-suma-orange-ink/40 bg-suma-orange/10 p-5 text-base">
          <strong>Aviso:</strong> Este documento contiene placeholders visibles (datos entre corchetes) que deben completarse antes de su publicación definitiva. La información jurídica aquí incluida debe ser revisada por un especialista legal.
        </p>

        <section>
          <p className="text-sm text-suma-navy/60">
            <strong>Última actualización:</strong> <Placeholder>{legalEffectiveDate}</Placeholder>
          </p>
        </section>

        <section>
          <h2>1. Identificación</h2>
          <p className="mt-3">
            Estos términos regulan el acceso a https://www.sumastudio.mx y, cuando se contrate, el uso de SUMA Inbox y servicios relacionados, prestados por VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V., con nombre comercial SUMA Studio, domicilio en <Placeholder>{legalDomicile}</Placeholder>.
          </p>
          <p className="mt-3">
            Contacto: ventas@sumastudio.mx.
          </p>
          <p className="mt-3">
            Privacidad: el <a href="/aviso-de-privacidad" className="underline decoration-suma-purple underline-offset-4">Aviso de privacidad</a> forma parte de estos términos.
          </p>
        </section>

        <section>
          <h2>2. Aceptación</h2>
          <p className="mt-3">
            Al usar este sitio o al contratar los servicios, aceptas estos términos. Si no estás de acuerdo, no uses el sitio ni el servicio. Condiciones particulares de una propuesta o un contrato escrito prevalecen, en lo que se opongan, sobre este texto general.
          </p>
        </section>

        <section>
          <h2>3. El sitio</h2>
          <p className="mt-3">
            El sitio describe servicios de tecnología y experiencias digitales para negocios, con énfasis en bienestar. La información es general y puede actualizarse. Una solicitud de contacto no constituye por sí misma un contrato. Las demostraciones, el showroom o los materiales educativos no garantizan resultados de negocio, posicionamiento o ventas.
          </p>
        </section>

        <section>
          <h2>4. SUMA Inbox</h2>
          <p className="mt-3">
            SUMA Inbox es un servicio de CRM y de asistencia para que un negocio gestione conversaciones, incluida la conexión de su WhatsApp Business al entorno de SUMA cuando ello sea técnicamente viable y el número resulte elegible en el flujo de Meta.
          </p>
          <p className="mt-3">
            SUMA Inbox no está disponible para el público hasta que SUMA complete los requisitos de Meta aplicables y se formalice un contrato con el cliente. Este apartado describe las reglas que gobernarán ese servicio; no anticipa una fecha de lanzamiento ni un cupo de onboarding.
          </p>
        </section>

        <section>
          <h2>5. Uso de WhatsApp Business y políticas de Meta</h2>
          <p className="mt-3">
            El envío y la recepción de mensajes de WhatsApp, el alta de números, las plantillas y el uso de la Cloud API o de herramientas de Meta se rigen, además de por estos términos, por las políticas y condiciones vigentes de Meta y de WhatsApp, entre ellas las WhatsApp Business Terms, las Commerce and Business Policies y las reglas de mensajería aplicables. El cliente se obliga a respetarlas. Si Meta modifica o retira una función, SUMA no puede garantizar que el servicio se mantenga idéntico.
          </p>
          <p className="mt-3">
            SUMA no es Meta ni WhatsApp, y no habla en su nombre.
          </p>
        </section>

        <section>
          <h2>6. Responsabilidad del cliente sobre el opt-in y el contenido</h2>
          <p className="mt-3">El cliente es el único responsable de:</p>
          <ul>
            <li>obtener y conservar el consentimiento o el opt-in que exijan Meta, WhatsApp y la legislación aplicable antes de enviar mensajes;</li>
            <li>informar a sus destinatarios, mediante su propio aviso de privacidad, del tratamiento de sus datos;</li>
            <li>el contenido de los mensajes, las plantillas, las campañas y los archivos que envíe o almacene;</li>
            <li>no enviar mensajes no solicitados, engañosos o ilícitos, ni usar el servicio para spam, acoso o contenidos prohibidos;</li>
            <li>la exactitud de los datos de su negocio, de su portafolio de Meta y de sus números.</li>
          </ul>
          <p className="mt-3">
            SUMA no revisa de forma previa todos los mensajes y no asume esa responsabilidad del cliente.
          </p>
        </section>

        <section>
          <h2>7. Elegibilidad del número: no hay garantía</h2>
          <p className="mt-3">
            <strong>No todos los números de teléfono son elegibles</strong> para conectarse a la API de WhatsApp Business, para transferirse desde otro proveedor o para coexistir con la aplicación WhatsApp Business. La elegibilidad la determina Meta en el propio flujo de alta (por ejemplo, Embedded Signup). SUMA no promete que un número concreto, mexicano o de otro país, pueda onboardearse.
          </p>
          <p className="mt-3">
            Un número personal de WhatsApp, un número ya vinculado a la Cloud API con otro socio, un número que no cumpla la versión mínima de la aplicación o que no satisfaga otras reglas de Meta puede ser rechazado. El cliente debe comprobar la elegibilidad en el flujo antes de asumir que podrá conservar su número habitual.
          </p>
        </section>

        <section>
          <h2>8. Límites de la coexistencia con la aplicación WhatsApp Business</h2>
          <p className="mt-3">
            La coexistencia (seguir usando la aplicación WhatsApp Business en el teléfono al tiempo que se conecta el número a la API) es una función distinta del servicio de Tech Provider y está sujeta a las reglas vigentes de Meta. Entre las limitaciones documentadas por Meta se encuentran, según la documentación oficial revisada el 11 de noviembre de 2026, restricciones sobre grupos, listas de difusión y llamadas a través de la API, además de requisitos de versión de la aplicación (WhatsApp Business 2.24.17 o posterior, según esa documentación) y de elegibilidad del número.
          </p>
          <p className="mt-3">
            Estas limitaciones pueden cambiar. SUMA no garantiza la coexistencia ni el conjunto completo de funciones de la aplicación WhatsApp Business una vez conectado el número. Si la coexistencia no está disponible para un número, el cliente deberá elegir, en los términos que Meta permita, entre opciones de migración o de uso exclusivo por API.
          </p>
        </section>

        <section>
          <h2>9. Cuentas, accesos y seguridad</h2>
          <p className="mt-3">
            El cliente es responsable de las personas a las que dé acceso a SUMA Inbox, de sus credenciales y de activar medidas de autenticación razonables. Debe notificar de inmediato cualquier uso no autorizado. SUMA puede suspender el acceso si detecta un riesgo de seguridad, un incumplimiento de estos términos o de las políticas de Meta, o un requerimiento legal.
          </p>
        </section>

        <section>
          <h2>10. Disponibilidad y soporte</h2>
          <p className="mt-3">
            SUMA procurará una operación continua y razonable del servicio, pero no garantiza disponibilidad ininterrumpida. El sitio, Meta, WhatsApp, el alojamiento y las redes de terceros pueden fallar o sufrir mantenimientos. El soporte se brinda por los canales acordados en el contrato.
          </p>
        </section>

        <section>
          <h2>11. Propiedad intelectual</h2>
          <p className="mt-3">
            El sitio, la marca SUMA Studio, el software, los textos y los diseños de SUMA son titularidad de VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V. o de sus licenciantes. El cliente conserva la titularidad de sus datos, contenidos y marcas. SUMA recibe una licencia limitada para tratar esos contenidos solo en la medida necesaria para prestar el servicio.
          </p>
        </section>

        <section>
          <h2>12. Datos personales</h2>
          <p className="mt-3">
            El tratamiento de datos se describe en el <a href="/aviso-de-privacidad" className="underline decoration-suma-purple underline-offset-4">Aviso de privacidad</a>. En SUMA Inbox, el cliente es responsable de los datos de sus destinatarios y SUMA actúa como encargada, en los términos de ese aviso y del contrato.
          </p>
        </section>

        <section>
          <h2>13. Limitación de responsabilidad</h2>
          <p className="mt-3">
            En la medida que permita la ley mexicana, SUMA no responde por lucro cesante, pérdida de mensajes, rechazo o bloqueo de un número por parte de Meta, inelegibilidad para coexistencia, interrupciones de WhatsApp o de internet, ni por el contenido enviado por el cliente. La responsabilidad máxima de SUMA, cuando exista un contrato de servicio, se limitará a lo que ese contrato establezca.
          </p>
          <p className="mt-3">
            Nada en este apartado limita la responsabilidad que la ley no permite excluir.
          </p>
        </section>

        <section>
          <h2>14. Suspensión y terminación</h2>
          <p className="mt-3">
            SUMA puede suspender o dar por terminado el servicio en caso de incumplimiento, ilicitud, riesgo para terceros o instrucción de Meta o de una autoridad. El cliente puede terminar el servicio en los términos del contrato. Tras la terminación, se estará al procedimiento de eliminación o exportación de datos acordado y a la página de <a href="/eliminacion-de-datos" className="underline decoration-suma-purple underline-offset-4">Eliminación de datos</a>.
          </p>
        </section>

        <section>
          <h2>15. Cambios a estos términos</h2>
          <p className="mt-3">
            Publicaremos la versión actualizada en esta página, con su fecha. El uso continuado del sitio después de un cambio razonable implica aceptación, salvo que el contrato particular exija otra formalidad.
          </p>
        </section>

        <section>
          <h2>16. Ley aplicable y jurisdicción</h2>
          <p className="mt-3">
            Estos términos se rigen por las leyes federales de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a los tribunales competentes de Monterrey, Nuevo León, México, con renuncia expresa a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros, sin perjuicio de los derechos del consumidor para acudir a la Procuraduría Federal del Consumidor (PROFECO) en los términos de la Ley Federal de Protección al Consumidor.
          </p>
        </section>
      </article>
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description, crumbs })} />
    </>
  );
}
