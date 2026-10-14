"use client";

import { ChatbotDemo } from "@/components/demos/ChatbotDemo";
import { FunnelDemo } from "@/components/demos/FunnelDemo";
import { MobileAppDemo } from "@/components/demos/MobileAppDemo";
import { SpaCrmDemo } from "@/components/demos/SpaCrmDemo";
import { useTabs } from "@/components/ui/useTabs";
import { cn } from "@/lib/cn";

const demos = [
  { id: "pilates", label: "Un estudio de pilates", sub: "Chatbot + reservas", color: "bg-suma-orange" },
  { id: "spa", label: "Un spa", sub: "Mini CRM", color: "bg-suma-purple" },
  { id: "marca", label: "Una marca wellness", sub: "Anuncio → seguimiento", color: "bg-suma-pink" },
  { id: "app", label: "Aplicación móvil", sub: "Prototipo navegable", color: "bg-suma-orange" },
] as const;

type DemoId = (typeof demos)[number]["id"];

export function SumaEnAccion() {
  const { active, listProps, tabProps, panelProps } = useTabs<DemoId>(demos.map((d) => d.id));

  return (
    <div>
      <div {...listProps} aria-label="Escenarios de demostración" className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:px-0">
        {demos.map((d) => (
          <button
            key={d.id}
            {...tabProps(d.id)}
            className={cn(
              "group flex min-h-16 shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-[background-color,border-color] duration-[var(--dur-panel)]",
              active === d.id ? "border-suma-cream bg-suma-cream text-suma-navy" : "border-suma-cream/20 text-suma-cream hover:border-suma-cream/60",
            )}
          >
            <span aria-hidden="true" className={cn("blob size-6 shrink-0 transition-transform duration-[var(--dur-panel)]", d.color, active === d.id && "scale-125")} />
            <span>
              <span className="block font-display text-[1.05rem] font-bold leading-tight">{d.label}</span>
              <span className={cn("text-xs font-semibold", active === d.id ? "text-suma-navy/65" : "text-suma-cream/65")}>{d.sub}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 text-suma-cream">
        <div {...panelProps("pilates")}>{active === "pilates" && <ChatbotDemo />}</div>
        <div {...panelProps("spa")}>{active === "spa" && <SpaCrmDemo />}</div>
        <div {...panelProps("marca")}>{active === "marca" && <FunnelDemo />}</div>
        <div {...panelProps("app")}>{active === "app" && <MobileAppDemo />}</div>
      </div>
    </div>
  );
}
