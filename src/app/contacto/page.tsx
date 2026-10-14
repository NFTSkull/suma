import type { Metadata } from "next";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contacto: hablemos de tu proyecto",
  description:
    "Cuéntanos sobre tu negocio de bienestar. SUMA STUDIO, desde Monterrey, Nuevo León, para todo México: chatbots, CRM, apps, páginas web y publicidad digital.",
  path: "/contacto",
});

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
          <Breadcrumbs items={[{ name: "Contacto", path: "/contacto" }]} />
          <p className="text-eyebrow mt-10 text-suma-orange-ink">Contacto</p>
          <h1 id="page-title" className="text-display-lg mt-6">
            Hablemos de tu proyecto.
          </h1>
          <p className="text-lead mt-8 max-w-xl text-suma-navy/75">
            Cuéntanos cómo funciona tu negocio hoy. No necesitas tener todo claro: para eso es la primera conversación.
          </p>
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
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
