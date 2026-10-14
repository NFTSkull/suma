"use client";

import Image from "next/image";
import { useState } from "react";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { useTabs } from "@/components/ui/useTabs";
import { photos } from "@/content/photos";
import { cn } from "@/lib/cn";

const concepts = [
  {
    id: "pilates",
    name: "Estudio de pilates",
    direction: "Editorial cálido",
    brand: "Núcleo",
    headline: "Fuerza que se siente ligera.",
    sub: "Reformer, mat y barre en un estudio pensado para moverte con calma.",
    cta: "Reservar clase muestra",
    photo: photos.pilatesEstudio,
    accent: "bg-suma-orange",
    surface: "bg-suma-cream-soft",
    menu: ["Clases", "Horarios", "Paquetes"],
  },
  {
    id: "spa",
    name: "Spa urbano",
    direction: "Calma mineral",
    brand: "Bruma",
    headline: "Una pausa en medio de la ciudad.",
    sub: "Rituales, masajes y tratamientos con tiempo para ti.",
    cta: "Ver tratamientos",
    photo: photos.spaAlberca,
    accent: "bg-suma-purple",
    surface: "bg-suma-cream-deep",
    menu: ["Rituales", "Membresía", "Regalos"],
  },
  {
    id: "marca",
    name: "Marca de skincare",
    direction: "Tienda de rituales",
    brand: "Gota",
    headline: "Rituales simples para piel feliz.",
    sub: "Fórmulas botánicas, explicadas con claridad.",
    cta: "Comprar ahora",
    photo: photos.marcaSerum,
    accent: "bg-suma-pink",
    surface: "bg-suma-cream-soft",
    menu: ["Tienda", "Rituales", "Ingredientes"],
  },
] as const;

type ConceptId = (typeof concepts)[number]["id"];

export function WebConceptGallery() {
  const { active, listProps, tabProps, panelProps } = useTabs<ConceptId>(concepts.map((c) => c.id));
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div {...listProps} aria-label="Conceptos de diseño" className="flex flex-wrap gap-2">
          {concepts.map((c) => (
            <button
              key={c.id}
              {...tabProps(c.id)}
              className={cn(
                "min-h-12 rounded-2xl border-2 px-4 py-2 text-left transition-colors",
                active === c.id ? "border-suma-cream bg-suma-cream text-suma-navy" : "border-suma-cream/25 text-suma-cream hover:border-suma-cream/60",
              )}
            >
              <span className="block text-sm font-bold">{c.name}</span>
              <span className="block text-xs opacity-70">{c.direction}</span>
            </button>
          ))}
        </div>
        <div role="group" aria-label="Vista" className="inline-flex rounded-full bg-suma-cream/10 p-1">
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={device === d}
              onClick={() => setDevice(d)}
              className={cn(
                "min-h-10 rounded-full px-4 text-sm font-bold transition-colors",
                device === d ? "bg-suma-cream text-suma-navy" : "text-suma-cream/80 hover:text-suma-cream",
              )}
            >
              {d === "desktop" ? "Escritorio" : "Móvil"}
            </button>
          ))}
        </div>
      </div>

      {concepts.map((c) => (
        <div key={c.id} {...panelProps(c.id)}>
          <div
            key={`${c.id}-${device}`}
            className={cn(
              "mx-auto overflow-hidden bg-suma-cream-soft text-suma-navy shadow-device transition-[max-width] duration-[var(--dur-panel)] motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]",
              device === "desktop" ? "max-w-5xl rounded-[1.25rem]" : "max-w-[20rem] rounded-[2.25rem] border-[10px] border-suma-navy-deep",
            )}
          >
            {device === "desktop" && (
              <div className="flex items-center gap-1.5 border-b border-suma-line bg-suma-cream px-4 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-2.5 rounded-full bg-suma-navy/20" />
                ))}
                <span className="ml-4 rounded-full bg-suma-cream-deep px-4 py-1 text-xs text-suma-navy/60">{c.brand.toLowerCase()}.concepto</span>
              </div>
            )}
            <div className={cn(c.surface)}>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="font-display text-xl font-extrabold tracking-tight">{c.brand}</span>
                {device === "desktop" ? (
                  <span className="flex gap-6 text-sm font-semibold text-suma-navy/75">
                    {c.menu.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </span>
                ) : (
                  <span aria-hidden="true" className="space-y-1">
                    <span className="block h-0.5 w-5 bg-suma-navy" />
                    <span className="block h-0.5 w-3.5 bg-suma-navy" />
                  </span>
                )}
              </div>
              <div className={cn("grid gap-6 px-6 pb-8", device === "desktop" && "grid-cols-[1fr_1.1fr] items-center pb-10")}>
                <div className={cn(device === "mobile" && "order-2")}>
                  <span className={cn("block h-1.5 w-12 rounded-full", c.accent)} />
                  <p className={cn("mt-4 font-display font-extrabold leading-[0.98] tracking-[-0.03em]", device === "desktop" ? "text-5xl" : "text-3xl")}>
                    {c.headline}
                  </p>
                  <p className="mt-4 text-sm text-suma-navy/70">{c.sub}</p>
                  <span className="mt-6 inline-flex min-h-11 items-center rounded-full bg-suma-navy px-5 text-sm font-bold text-suma-cream">{c.cta}</span>
                </div>
                <div className={cn("relative overflow-hidden", device === "desktop" ? "aspect-[5/4] rounded-[2rem]" : "blob aspect-square")}>
                  <Image src={c.photo.src} alt={c.photo.alt} fill sizes={device === "desktop" ? "34rem" : "18rem"} className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <DemoNotice tone="light" text="Conceptos originales de SUMA para ilustrar direcciones visuales. No son sitios de clientes." />
    </div>
  );
}
