import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdJourneyMini, ChatMini, CrmMini, PhoneMini, WebScreensMini } from "@/components/visuals/MiniVisuals";
import { capabilityAnchorId } from "@/content/service-shortcuts";
import { getService, serviceInlineName } from "@/content/services";
import type { ServiceSlug } from "@/types/content";
import { cn } from "@/lib/cn";
import { ServiceShortcuts } from "./ServiceShortcuts";

function CardArrow({ light }: { light?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-[var(--dur-panel)] ease-[var(--ease-flow)] group-hover:translate-x-1 group-hover:-rotate-12",
        light ? "bg-suma-cream text-suma-navy" : "bg-suma-navy text-suma-cream",
      )}
    >
      <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h11M11 5l5 5-5 5" />
      </svg>
    </span>
  );
}

function CapabilityCard({
  slug,
  number,
  className,
  surface,
  light,
  visual,
  layout = "stack",
}: {
  slug: ServiceSlug;
  number: string;
  className?: string;
  surface: string;
  light?: boolean;
  visual: ReactNode;
  layout?: "stack" | "split";
}) {
  const s = getService(slug);
  return (
    <div
      id={capabilityAnchorId(slug)}
      className={cn("capability-card scroll-mt-4", className)}
      style={{ "--emphasis": `var(--color-suma-${s.color})` } as CSSProperties}
    >
      <Reveal className="h-full">
        <Link
          href={s.href}
          className={cn(
            "group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7 transition-[transform,box-shadow] duration-[var(--dur-panel)] ease-[var(--ease-flow)] hover:-translate-y-1 hover:shadow-lift md:p-9",
            layout === "split" && "lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-8",
            surface,
            light && "on-dark",
          )}
        >
          <div className="relative z-10 flex flex-col">
            <p className={cn("text-eyebrow flex items-center gap-3", light ? "text-suma-cream/75" : "text-suma-navy/65")}>
              <span className="font-display text-base tracking-normal">{number}</span>
              {s.shortName}
            </p>
            <h3 className={cn("mt-5 text-display-md", light ? "text-suma-cream" : "text-suma-navy")}>{s.home.title}</h3>
            <p className={cn("mt-4 max-w-md text-base leading-relaxed", light ? "text-suma-cream/80" : "text-suma-navy/75")}>{s.home.text}</p>
            <span className={cn("mt-6 inline-flex items-center gap-3 font-bold", light ? "text-suma-cream" : "text-suma-navy")}>
              <CardArrow light={light} />
              <span>Conocer {serviceInlineName[s.slug]}</span>
            </span>
          </div>
          <div className="relative mt-10 flex flex-1 items-end justify-center transition-transform duration-[var(--dur-reveal)] ease-[var(--ease-flow)] group-hover:-translate-y-1.5 lg:mt-8">
            {visual}
          </div>
        </Link>
      </Reveal>
    </div>
  );
}

export function Capabilities() {
  return (
    <section aria-labelledby="capacidades-title" className="section-y relative bg-suma-cream">
      <div className="container-suma">
        <SectionHeading
          id="capacidades-title"
          eyebrow="Lo que hacemos"
          title={
            <>
              Cinco maneras de hacer que tu negocio <span className="text-suma-purple">fluya.</span>
            </>
          }
        />
        <ServiceShortcuts />

        <div className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-12">
          <CapabilityCard
            slug="chatbots"
            number="01"
            className="lg:col-span-7"
            surface="bg-suma-cream-soft"
            layout="split"
            visual={
              <div className="relative">
                <OrganicShape shape="a" color="orange" className="absolute -right-10 -top-10 size-64 opacity-90" />
                <ChatMini className="relative" />
              </div>
            }
          />
          <CapabilityCard
            slug="crm"
            number="02"
            className="lg:col-span-5"
            surface="bg-suma-purple"
            light
            visual={<CrmMini />}
          />
          <CapabilityCard
            slug="aplicaciones-moviles"
            number="03"
            className="lg:col-span-4"
            surface="bg-suma-pink/18"
            visual={
              <div className="relative">
                <OrganicShape shape="b" color="pink" className="absolute -left-12 bottom-0 size-52" />
                <PhoneMini className="relative rotate-[-4deg]" />
              </div>
            }
          />
          <CapabilityCard
            slug="paginas-web"
            number="04"
            className="lg:col-span-8"
            surface="bg-suma-navy"
            light
            layout="split"
            visual={<WebScreensMini />}
          />
          <CapabilityCard
            slug="publicidad-digital"
            number="05"
            className="lg:col-span-12"
            surface="bg-gradient-to-br from-suma-orange/18 via-suma-cream-soft to-suma-pink/18"
            layout="split"
            visual={<AdJourneyMini className="w-full" />}
          />
        </div>
      </div>
    </section>
  );
}
