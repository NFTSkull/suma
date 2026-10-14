import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Aviso de privacidad",
  description: "Aviso de privacidad del sitio de SUMA STUDIO: qué datos recabamos en el formulario de contacto y para qué los usamos.",
  path: "/aviso-de-privacidad",
});

function Pendiente({ children }: { children: string }) {
  return <mark className="rounded bg-suma-orange/20 px-1 font-semibold text-suma-navy">[Pendiente: {children}]</mark>;
}

export default function AvisoPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        accent="purple"
        crumbs={[{ name: "Aviso de privacidad", path: "/aviso-de-privacidad" }]}
        title="Aviso de privacidad"
        lead="Borrador base conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Debe completarse y revisarse por un especialista antes de su publicación."
      />
      <article className="container-suma max-w-3xl space-y-10 pb-28 text-lg leading-relaxed text-suma-navy/85 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-suma-navy">
        <section>
          <h2>Responsable</h2>
          <p className="mt-3">
            SUMA STUDIO (<Pendiente>razón social</Pendiente>), con domicilio en <Pendiente>domicilio fiscal</Pendiente>, es responsable del tratamiento de
            tus datos personales.
          </p>
        </section>
        <section>
          <h2>Datos que recabamos</h2>
          <p className="mt-3">A través del formulario de contacto recabamos: nombre, nombre de tu negocio, tipo de negocio, correo electrónico, número de WhatsApp, servicios de interés y, si lo compartes, un mensaje.</p>
          <p className="mt-3">No recabamos datos personales sensibles. El selector de soluciones del sitio no solicita ni guarda datos personales.</p>
        </section>
        <section>
          <h2>Finalidades</h2>
          <p className="mt-3">Usamos tus datos para responder tu solicitud, darte seguimiento comercial sobre los servicios que te interesan y preparar una propuesta.</p>
        </section>
        <section>
          <h2>Transferencias y encargados</h2>
          <p className="mt-3">
            Para recibir los mensajes del formulario podemos apoyarnos en proveedores de correo o automatización que actúan como encargados: <Pendiente>proveedor elegido</Pendiente>. No vendemos tus datos.
          </p>
        </section>
        <section>
          <h2>Derechos ARCO y revocación</h2>
          <p className="mt-3">
            Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos, o revocar tu consentimiento, escribiendo a{" "}
            <Pendiente>correo de privacidad</Pendiente>.
          </p>
        </section>
        <section>
          <h2>Cambios a este aviso</h2>
          <p className="mt-3">
            Cualquier cambio se publicará en esta página. Última actualización: <Pendiente>fecha</Pendiente>.
          </p>
        </section>
      </article>
    </>
  );
}
