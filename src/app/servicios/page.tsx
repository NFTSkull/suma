import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ClosingCta } from "@/components/home/ClosingCta";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { AdJourneyMini, ChatMini, CrmMini, PhoneMini, WebScreensMini } from "@/components/visuals/MiniVisuals";
import { services, serviceInlineName } from "@/content/services";
import { cn } from "@/lib/cn";
import { colorStyles } from "@/lib/colors";
import { buildMetadata } from "@/lib/seo";
import type { ServiceSlug } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "Servicios: chatbots, CRM, apps, páginas web y publicidad digital",
  description:
    "Cinco servicios para negocios de bienestar en Monterrey y todo México: chatbots, CRM personalizados, aplicaciones móviles, páginas web y publicidad digital.",
  path: "/servicios",
  keywords: ["servicios digitales para negocios wellness", "agencia digital wellness Monterrey"],
});

const visuals: Record<ServiceSlug, ReactNode> = {
  chatbots: <ChatMini />,
  crm: <CrmMini />,
  "aplicaciones-moviles": <PhoneMini />,
  "paginas-web": <WebScreensMini />,
  "publicidad-digital": <AdJourneyMini />,
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        eyebrow="Servicios"
        crumbs={[{ name: "Servicios", path: "/servicios" }]}
        title="Cinco maneras de hacer que tu negocio fluya."
        lead="Cada servicio resuelve algo concreto. Juntos, conectan la forma en que tus clientes te descubren, te preguntan, reservan y regresan."
      >
        <ButtonLink href="/soluciones" variant="secondary">
          No sé por dónde empezar
        </ButtonLink>
      </PageHero>

      <section aria-label="Lista de servicios" className="bg-suma-cream pb-24">
        <ol className="container-suma space-y-6">
          {services.map((s, i) => {
            const c = colorStyles[s.color];
            const dark = s.color === "navy" || s.color === "purple";
            return (
              <Reveal as="li" key={s.slug}>
                <Link
                  href={s.href}
                  className={cn(
                    "group grid items-center gap-10 overflow-hidden rounded-[2.25rem] p-8 transition-shadow hover:shadow-lift md:p-12 lg:grid-cols-[1.1fr_0.9fr]",
                    i % 2 === 0 ? "bg-suma-cream-soft" : cn(c.bg, c.onBg),
                    dark && i % 2 !== 0 && "on-dark",
                  )}
                >
                  <div className={cn(i % 2 !== 0 && "lg:order-2")}>
                    <span className={cn("font-display text-lg font-bold", i % 2 === 0 ? c.ink : "opacity-80")}>0{i + 1}</span>
                    <h2 className="text-display-md mt-3">{s.name}</h2>
                    <p className={cn("mt-4 max-w-xl text-lg", i % 2 === 0 ? "text-suma-navy/75" : "opacity-90")}>{s.home.text}</p>
                    <span className="mt-8 inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-[6px]">
                      Conocer {serviceInlineName[s.slug]}
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-center">{visuals[s.slug]}</div>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <ClosingCta
        title="No necesitas todas las herramientas desde el primer día."
        text="Necesitas las adecuadas para el momento de tu negocio. Cuéntanos dónde estás y te ayudamos a priorizar."
        secondary={{ label: "Cómo trabajamos", href: "/como-trabajamos" }}
      />
    </>
  );
}
