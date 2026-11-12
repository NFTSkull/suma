import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, pageGraph } from "@/lib/seo";
import { legalDomicile, legalPhone, legalEffectiveDate } from "@/content/site";

const seo = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad integral de VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V. (SUMA STUDIO) conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
  path: "/aviso-de-privacidad",
};
const crumbs = [{ name: "Aviso de privacidad", path: "/aviso-de-privacidad" }];

export const metadata: Metadata = buildMetadata(seo);

function Placeholder({ children }: { children: string }) {
  return <mark className="rounded bg-suma-orange/20 px-1 font-semibold text-suma-navy">{children}</mark>;
}

export default function AvisoPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        accent="purple"
        crumbs={crumbs}
        title="Aviso de privacidad"
        lead="Aviso de privacidad integral de VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V., conocida comercialmente como SUMA Studio, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares."
      />
      <article className="container-suma max-w-3xl space-y-10 pb-28 text-lg leading-relaxed text-suma-navy/85 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-suma-navy [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-suma-navy [&_li]:mt-2 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6">
        <p className="rounded-2xl border-2 border-dashed border-suma-orange-ink/40 bg-suma-orange/10 p-5 text-base">
          <strong>Aviso:</strong> Este documento contiene placeholders visibles (datos entre corchetes) que deben completarse antes de su publicación definitiva. La información jurídica aquí incluida debe ser revisada por un especialista legal.
        </p>

        <section>
          <p className="text-sm text-suma-navy/60">
            <strong>Última actualización:</strong> <Placeholder>{legalEffectiveDate}</Placeholder>
          </p>
        </section>

        <section>
          <h2>1. Identidad y domicilio del responsable</h2>
          <p className="mt-3">
            VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V., conocida comercialmente como SUMA Studio («SUMA», «nosotros»), es la persona moral <strong>responsable</strong> del tratamiento de los datos personales que recaba a través de este sitio y, en su caso, de los datos de sus propios clientes, prospectos y usuarios de SUMA Inbox cuando actúa por cuenta propia. SUMA STUDIO es el nombre comercial de esa sociedad; en el registro fiscal el nombre comercial inscrito es VIOZ CREACIONES Y PRODUCCIONES.
          </p>
          <p className="mt-3">
            Domicilio para oír y recibir notificaciones: <Placeholder>{legalDomicile}</Placeholder>.
          </p>
          <p className="mt-3">
            Régimen fiscal: Régimen General de Ley Personas Morales.
          </p>
          <p className="mt-3">
            Correo para privacidad y derechos ARCO: <a href="mailto:ventas@sumastudio.mx" className="underline decoration-suma-purple underline-offset-4">ventas@sumastudio.mx</a>.
          </p>
          <p className="mt-3">
            Teléfono de contacto: <Placeholder>{legalPhone}</Placeholder>.
          </p>
        </section>

        <section>
          <h2>2. Cuándo SUMA es responsable y cuándo es encargada</h2>
          <ul>
            <li>
              <strong>SUMA es responsable</strong> cuando trata datos para sus propias finalidades: por ejemplo, el formulario de contacto de este sitio, la atención comercial de quienes solicitan información, la administración de la cuenta de un cliente de SUMA y la mejora del sitio.
            </li>
            <li>
              <strong>SUMA es encargada</strong> (artículo 2, fracción XII, de la Ley) cuando, a través de SUMA Inbox u otros servicios de CRM o mensajería, trata datos <strong>por cuenta de un cliente</strong> y según sus instrucciones. En ese caso, el <strong>responsable</strong> frente a los clientes finales, alumnos, pacientes o contactos de ese negocio es el propio cliente. SUMA no usa esos datos para mercadotecnia propia ni para finalidades distintas del servicio contratado.
            </li>
          </ul>
          <p className="mt-3">
            Los apartados 3 a 6 describen el tratamiento en el que SUMA es responsable. El apartado 7 describe el tratamiento en el que SUMA actúa como encargada.
          </p>
        </section>

        <section>
          <h2>3. Datos personales que recabamos (SUMA como responsable)</h2>
          
          <h3 className="mt-6">3.1 Formulario de contacto y comunicación comercial</h3>
          <p className="mt-3">
            Nombre; nombre del negocio; tipo de negocio; correo electrónico; número de teléfono o WhatsApp; servicios de interés; el mensaje que nos escribas; y, si llegaste desde el selector de soluciones, el tipo de negocio y el reto que elegiste.
          </p>

          <h3 className="mt-6">3.2 Datos de clientes y de la relación comercial</h3>
          <p className="mt-3">
            Datos de contacto de representantes, información contractual, facturación y, cuando aplique, datos fiscales necesarios para emitir comprobantes. Los datos financieros o patrimoniales, si se recabaran, requieren consentimiento expreso (artículo 7 de la Ley), salvo las excepciones legales.
          </p>

          <h3 className="mt-6">3.3 Datos técnicos del sitio</h3>
          <p className="mt-3">
            Para proteger el formulario contra abusos, el servidor puede usar de forma temporal la dirección IP. El proveedor de alojamiento registra datos técnicos de las solicitudes (por ejemplo, fecha, ruta y datos del navegador).
          </p>

          <h3 className="mt-6">3.4 Estadísticas de uso, solo con tu permiso</h3>
          <p className="mt-3">
            Si aceptas la medición, Google Analytics puede registrar páginas visitadas, tipo de dispositivo y navegador, ubicación aproximada y acciones en el sitio (por ejemplo, enviar el formulario), sin tu nombre, correo, teléfono ni el contenido de tus mensajes.
          </p>

          <h3 className="mt-6">3.5 Datos personales sensibles</h3>
          <p className="mt-3">
            No recabamos de forma intencional datos personales sensibles a través de este sitio (artículo 2, fracción VI, de la Ley). Te pedimos que no nos envíes datos de salud, información genética, creencias, opiniones políticas, origen étnico ni preferencia sexual en el formulario de contacto. Si un mensaje los incluyera de manera incidental, los trataremos solo para atender esa solicitud y los eliminaremos cuando ya no sean necesarios, con el consentimiento expreso y por escrito que exige el artículo 8, en la medida en que el tratamiento proceda.
          </p>
          <p className="mt-3">
            El selector de soluciones no solicita datos personales.
          </p>
        </section>

        <section>
          <h2>4. Finalidades</h2>
          
          <h3 className="mt-6">4.1 Finalidades primarias (necesarias para la relación o para atender tu solicitud)</h3>
          <p className="mt-3">
            No requieren un consentimiento adicional distinto del que se deriva de tu solicitud o del contrato, sin perjuicio de las excepciones y reglas de la Ley:
          </p>
          <ul>
            <li>Atender y responder tu solicitud de contacto.</li>
            <li>Comunicarnos contigo por correo, teléfono o WhatsApp sobre lo que nos pediste.</li>
            <li>Preparar una propuesta de servicios si la solicitas.</li>
            <li>Formalizar, cumplir y dar seguimiento al contrato de servicios, incluida la facturación.</li>
            <li>Cumplir obligaciones legales y fiscales.</li>
            <li>Proteger la seguridad del sitio y prevenir abusos del formulario.</li>
          </ul>

          <h3 className="mt-6">4.2 Finalidades secundarias (requieren tu consentimiento y puedes oponerte)</h3>
          <ul>
            <li>Enviarte información comercial posterior sobre servicios de SUMA que puedan interesarte, distinta del seguimiento inmediato de una solicitud que tú iniciaste.</li>
            <li>Invitarte a demostraciones, eventos o contenidos informativos de SUMA.</li>
          </ul>
          <p className="mt-3">
            Las estadísticas de uso, cuando las aceptas en el banner de preferencias, sirven para entender cómo se usa el sitio y mejorarlo. No las usamos para publicidad dirigida de terceros.
          </p>
          <p className="mt-3">
            Puedes negarte a las finalidades secundarias desde el primer contacto, al escribir a <a href="mailto:ventas@sumastudio.mx" className="underline decoration-suma-purple underline-offset-4">ventas@sumastudio.mx</a>, o más adelante, sin que ello afecte las finalidades primarias ni la respuesta a tu solicitud.
          </p>
        </section>

        <section>
          <h2>5. Encargados, transferencias y proveedores</h2>
          <p className="mt-3">
            Para operar el sitio y los servicios nos apoyamos en proveedores que tratan datos <strong>por cuenta de SUMA</strong> (personas encargadas, no «terceros» en el sentido de una transferencia del artículo 2, fracción XX, de la Ley), entre ellos:
          </p>
          <ul>
            <li><strong>Vercel</strong>, que aloja el sitio y procesa las solicitudes al formulario. Su infraestructura puede situarse fuera de México, incluidos los Estados Unidos.</li>
            <li><strong>Resend, Inc.</strong> (Estados Unidos), servicio de envío y recepción de correo electrónico. Los datos del formulario se envían a través de Resend a nuestro buzón. Los mensajes recibidos se conservan en la plataforma hasta 30 días.</li>
            <li><strong>Google</strong> (Google Tag Manager y Google Analytics 4), solo si aceptas la medición.</li>
          </ul>
          <p className="mt-3">
            Cuando el servicio SUMA Inbox esté en operación, también intervendrá <strong>Meta Platforms</strong> y la plataforma <strong>WhatsApp Business</strong> (Cloud API, Business Management y flujos de alta relacionados) para el envío y la recepción de mensajes y la gestión de cuentas, números y plantillas. La calificación jurídica exacta de esa comunicación (persona encargada o transferencia a un tercero) debe revisarla un especialista antes de publicar este aviso; no se afirma aquí una u otra.
          </p>
          <p className="mt-3">
            No vendemos tus datos ni los compartimos con fines publicitarios de terceros.
          </p>
          <p className="mt-3">
            Cuando la Ley exija consentimiento para una transferencia a un tercero distinto de una persona encargada (artículos 35 y 36), te lo solicitaremos de forma expresa y podrás aceptarla o rechazarla. Mientras esa revisión legal no esté cerrada, no se publicará una cláusula que dé por aceptada una transferencia no confirmada.
          </p>
        </section>

        <section>
          <h2>6. Cookies, almacenamiento local y preferencias de medición</h2>
          <p className="mt-3">
            Al entrar al sitio te preguntamos si aceptas las estadísticas de uso. Mientras no decidas, o si las rechazas, no se cargan Google Tag Manager ni Google Analytics. Si las aceptas, Google Analytics puede usar cookies para distinguir visitas.
          </p>
          <p className="mt-3">
            Guardamos tu decisión en el almacenamiento local del navegador para no volver a preguntarte en cada página. El selector de soluciones guarda temporalmente, durante la sesión, el tipo de negocio y el reto que elegiste para prellenar el formulario; no incluye tu nombre ni tus datos de contacto.
          </p>
          <p className="mt-3">
            Google Analytics 4 está configurado con retención de datos de eventos de 2 meses y de datos de usuario de 14 meses, con reinicio de retención ante nueva actividad. Google Signals está desactivado. No se envían datos personales identificables a Google Analytics, y el servicio solo se activa con tu consentimiento de cookies.
          </p>
          <p className="mt-3">
            No usamos cookies publicitarias. Puedes cambiar tu decisión en cualquier momento desde «Preferencias de privacidad», al pie de cada página, o borrar las cookies y el almacenamiento desde la configuración de tu navegador.
          </p>
        </section>

        <section>
          <h2>7. SUMA Inbox: tratamiento por cuenta de nuestros clientes (SUMA como encargada)</h2>
          <p className="mt-3">
            Si un negocio contrata SUMA Inbox u otro servicio de CRM o mensajería de SUMA y conecta su WhatsApp Business, ese cliente es el <strong>responsable</strong> de los datos de sus propios contactos. SUMA, como <strong>encargada</strong>, puede tratar, según las instrucciones del cliente y las políticas de Meta aplicables, categorías como:
          </p>
          <ul>
            <li>números de teléfono de WhatsApp Business y de los destinos de los mensajes;</li>
            <li>contenido de los mensajes enviados o recibidos, incluidas plantillas, multimedia y metadatos de entrega o lectura;</li>
            <li>datos de la cuenta de WhatsApp Business (perfil, plantillas, números y webhooks);</li>
            <li>datos de identificación de quienes operan la bandeja en nombre del cliente.</li>
          </ul>
          <p className="mt-3">
            Finalidades de este tratamiento, limitadas al servicio contratado:
          </p>
          <ul>
            <li>permitir el envío y la recepción de mensajes y la operación de la bandeja;</li>
            <li>gestionar plantillas, números y la cuenta de WhatsApp Business en la medida en que el servicio lo requiera;</li>
            <li>prestar soporte técnico al cliente;</li>
            <li>cumplir obligaciones técnicas de la plataforma de Meta y de la ley.</li>
          </ul>
          <p className="mt-3">
            SUMA no utiliza el contenido de esos mensajes para finalidades propias de mercadotecnia. La licitud de la obtención, el aviso de privacidad frente a los destinatarios, el consentimiento o el opt-in de WhatsApp y el respeto a las políticas de Meta son <strong>responsabilidad del cliente responsable</strong>. No todos los números son elegibles para conectarse o para coexistir con la aplicación WhatsApp Business; véanse los Términos y condiciones.
          </p>
          <p className="mt-3">
            Las solicitudes ARCO de una persona cuyos datos trate un cliente de SUMA Inbox deben dirigirse, en primer lugar, a ese cliente, que es el responsable. Si la solicitud llega a SUMA, la canalizaremos al cliente correspondiente, en la medida en que podamos identificarlo, y cooperaremos para su atención.
          </p>
        </section>

        <section>
          <h2>8. Conservación</h2>
          <p className="mt-3">
            Conservamos los datos del formulario y de la relación comercial mientras resulta necesario para las finalidades informadas, para el cumplimiento del contrato y para las obligaciones legales o fiscales aplicables. Los plazos de conservación son:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-suma-navy/20 text-base">
              <thead>
                <tr className="bg-suma-navy/5">
                  <th className="border border-suma-navy/20 px-4 py-2 text-left font-semibold">Categoría de datos</th>
                  <th className="border border-suma-navy/20 px-4 py-2 text-left font-semibold">Plazo de conservación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-suma-navy/20 px-4 py-2">Prospectos sin contrato</td>
                  <td className="border border-suma-navy/20 px-4 py-2">12 meses desde el último contacto</td>
                </tr>
                <tr>
                  <td className="border border-suma-navy/20 px-4 py-2">Clientes</td>
                  <td className="border border-suma-navy/20 px-4 py-2">Durante la relación contractual y hasta 5 años después para obligaciones fiscales y legales (artículo 30 del Código Fiscal de la Federación)</td>
                </tr>
                <tr>
                  <td className="border border-suma-navy/20 px-4 py-2">Datos tratados en SUMA Inbox por cuenta de clientes (SUMA como encargada)</td>
                  <td className="border border-suma-navy/20 px-4 py-2">Conforme al contrato con el cliente y por defecto 12 meses tras su terminación, con eliminación o devolución a solicitud del cliente</td>
                </tr>
                <tr>
                  <td className="border border-suma-navy/20 px-4 py-2">Consentimiento de mercadotecnia</td>
                  <td className="border border-suma-navy/20 px-4 py-2">Hasta su revocación (conservando solo una ficha mínima de baja para respetar la oposición)</td>
                </tr>
                <tr>
                  <td className="border border-suma-navy/20 px-4 py-2">Estadísticas de Google Analytics</td>
                  <td className="border border-suma-navy/20 px-4 py-2">Eventos: 2 meses; datos de usuario: 14 meses con reinicio ante nueva actividad</td>
                </tr>
                <tr>
                  <td className="border border-suma-navy/20 px-4 py-2">Respaldos</td>
                  <td className="border border-suma-navy/20 px-4 py-2">Hasta 90 días</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Al término del periodo de conservación, los datos se eliminan o anonimizan, pasando por bloqueo y supresión conforme a los artículos 2, fracción III, y 10 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
          </p>
        </section>

        <section>
          <h2>9. Opciones para limitar el uso o la divulgación</h2>
          <p className="mt-3">Puedes:</p>
          <ul>
            <li>rechazar o retirar el permiso de medición en «Preferencias de privacidad»;</li>
            <li>oponerte a las finalidades secundarias escribiendo a <a href="mailto:ventas@sumastudio.mx" className="underline decoration-suma-purple underline-offset-4">ventas@sumastudio.mx</a>;</li>
            <li>solicitar la limitación del uso o la divulgación por el mismo correo, o ejercer tus derechos ARCO como se indica abajo;</li>
            <li>pedir la eliminación de tus datos relacionados con una aplicación de Meta en la página <a href="/eliminacion-de-datos" className="underline decoration-suma-purple underline-offset-4">Eliminación de datos</a>.</li>
          </ul>
        </section>

        <section>
          <h2>10. Derechos ARCO, revocación del consentimiento y procedimiento</h2>
          <p className="mt-3">
            Puedes solicitar el acceso, la rectificación, la cancelación o la oposición al tratamiento de tus datos personales (derechos ARCO, artículos 21 a 34 de la Ley), así como revocar tu consentimiento (artículo 7) o limitar el uso o la divulgación de tus datos, escribiendo a <a href="mailto:ventas@sumastudio.mx" className="underline decoration-suma-purple underline-offset-4">ventas@sumastudio.mx</a> <strong>desde el correo electrónico o número de WhatsApp que registraste con nosotros</strong>.
          </p>
          <p className="mt-3">
            Tu solicitud debe incluir, conforme al artículo 28:
          </p>
          <ol>
            <li>tu nombre y un medio para recibir notificaciones;</li>
            <li>la descripción clara de los datos respecto de los que buscas ejercer el derecho, salvo que se trate del derecho de acceso;</li>
            <li>la descripción del derecho que pretendes ejercer, o lo que solicitas;</li>
            <li>cualquier otro elemento que facilite la localización de los datos.</li>
          </ol>
          <p className="mt-3">
            <strong>Verificación de identidad:</strong> Para proteger tus datos, verificaremos tu identidad mediante el canal desde el que nos escribes (correo o WhatsApp registrado) o enviándote un código de confirmación a ese medio. Solo si no podemos confirmar tu identidad por este método, te solicitaremos que acredites tu identidad o, en su caso, la personalidad e identidad de tu representante, a través de un medio seguro que te indicaremos (nunca envíes documentos de identificación por correo electrónico sin cifrar).
          </p>
          <p className="mt-3">
            Responderemos en un plazo máximo de <strong>veinte días hábiles</strong>, contados desde la recepción de la solicitud, y, si resulta procedente, haremos efectiva la determinación dentro de los <strong>quince días</strong> siguientes a la comunicación de la respuesta, de acuerdo con el artículo 31 de la Ley. Estos plazos pueden ampliarse una sola vez por un periodo igual, cuando las circunstancias del caso lo justifiquen.
          </p>
          <p className="mt-3">
            La revocación del consentimiento no tiene efectos retroactivos sobre tratamientos ya realizados de forma lícita.
          </p>
          <p className="mt-3">
            El ejercicio de estos derechos es gratuito, con las excepciones de costos de envío o reproducción que prevé el artículo 34, si llegaran a aplicarse.
          </p>
          <p className="mt-3">
            Si no estás de acuerdo con la respuesta, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno, en los términos de la Ley.
          </p>
        </section>

        <section>
          <h2>11. Cambios a este aviso</h2>
          <p className="mt-3">
            Cualquier cambio se publicará en esta misma página, https://www.sumastudio.mx/aviso-de-privacidad, con la fecha de actualización. Cuando el cambio lo exija la Ley, pondremos el aviso actualizado a tu disposición por los medios de contacto que tengamos o por un aviso visible en el sitio.
          </p>
        </section>

        <section>
          <h2>12. Aviso simplificado</h2>
          <p className="mt-3">
            En los formularios electrónicos ponemos a tu disposición un aviso simplificado con la identidad y el domicilio del responsable, las categorías de datos, las finalidades (distinguiendo las que requieren consentimiento) y las opciones para limitar el uso, más el enlace a este aviso integral, conforme al artículo 16, fracción II.
          </p>
        </section>
      </article>
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description, crumbs })} />
    </>
  );
}
