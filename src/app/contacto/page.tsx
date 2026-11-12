import type { Metadata } from "next";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { WhatsAppPrivacyNotice } from "@/components/legal/WhatsAppPrivacyNotice";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { buildMetadata, pageGraph } from "@/lib/seo";

const seo = {
  title: "Contacto: hablemos de tu proyecto",
  description:
    "Cuéntanos sobre tu negocio de bienestar. SUMA STUDIO, desde Monterrey para todo México: chatbots, CRM, apps, páginas web y publicidad digital.",
  path: "/contacto",
};
const crumbs = [{ name: "Contacto", path: "/contacto" }];

export const metadata: Metadata = buildMetadata(seo);

const next = [
  "Leemos tu mensaje y revisamos lo que nos cuentas de tu negocio.",
  "Te contactamos para agendar una conversación breve.",
  "Identificamos juntos qué pieza tendría más impacto primero.",
];

export default function ContactoPage() {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden bg-suma-cream">
      <OrganicShape shape="b" color="orange" animate="drift" className="absolute -left-40 top-[28rem] -z-10 hidden size-80 opacity-80 lg:block" />
      <div className="container-suma grid gap-14 pb-28 pt-8 md:pt-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Breadcrumbs items={crumbs} />
          <p className="text-eyebrow mt-10 text-suma-orange-ink">Contacto</p>
          <h1 id="page-title" className="text-display-lg mt-6">
            Hablemos de tu proyecto.
          </h1>
          <p className="text-lead mt-8 max-w-xl text-suma-navy/75">
            Cuéntanos cómo funciona tu negocio hoy. No necesitas tener todo claro: para eso es la primera conversación.
          </p>
          <div className="mt-10 rounded-[2rem] border border-suma-line bg-suma-cream-soft p-7 shadow-soft md:p-8">
            <p className="text-eyebrow text-suma-orange-ink">Contacto directo</p>
            <h2 className="mt-3 font-display text-2xl font-bold">Escríbenos por WhatsApp</h2>
            <p className="mt-3 text-suma-navy/75">
              Cuéntanos qué necesitas para tu negocio. El mensaje llega a nuestro número de atención.
            </p>
            <p className="mt-5 font-display text-2xl font-bold text-suma-navy">{site.contact.phoneDisplay}</p>
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <ButtonLink href={site.contact.whatsappUrl} size="lg" arrow target="_blank" rel="noopener noreferrer">
                  Abrir WhatsApp
                </ButtonLink>
                <a
                  href={`tel:${site.contact.phoneE164}`}
                  className="inline-flex min-h-12 items-center font-bold text-suma-navy underline decoration-2 decoration-suma-orange underline-offset-4"
                >
                  Llamar al {site.contact.phoneDisplay}
                </a>
              </div>
              <WhatsAppPrivacyNotice />
            </div>
          </div>
          <div className="mt-12 rounded-[2rem] bg-suma-navy p-8 text-suma-cream">
            <h2 className="font-display text-2xl font-bold">Qué pasa después</h2>
            <ol className="mt-6 space-y-5">
              {next.map((n, i) => (
                <li key={n} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-suma-orange font-display font-bold text-suma-navy">{i + 1}</span>
                  <span className="pt-1 text-suma-cream/85">{n}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-t border-suma-cream/15 pt-6 text-sm text-suma-cream/70">{site.location.label}</p>
          </div>
        </div>
        <div className="rounded-[2rem] bg-suma-cream-soft p-6 shadow-soft md:p-10">
          <p className="text-eyebrow text-suma-purple">También puedes escribirnos aquí</p>
          <p className="mb-8 mt-3 text-suma-navy/75">Si prefieres explicar tu proyecto con más detalle, envía el formulario y revisaremos tu solicitud.</p>
          <ContactForm />
        </div>
      </div>
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description, type: "ContactPage", crumbs })} />
    </section>
  );
}
