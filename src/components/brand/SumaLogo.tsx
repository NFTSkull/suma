import Image from "next/image";
import { brandAssets } from "@/content/brand-assets";
import { cn } from "@/lib/cn";

type Props = {
  tone?: "dark" | "light";
  variant?: "horizontal" | "compact";
  className?: string;
  /** Altura visual en px del logotipo. */
  height?: number;
};

/**
 * Logotipo SUMA STUDIO.
 * Usa el asset oficial cuando está registrado en brand-assets.ts; mientras tanto
 * muestra un wordmark tipográfico provisional (no intenta reproducir el isotipo).
 */
export function SumaLogo({ tone = "dark", variant = "horizontal", className, height = 34 }: Props) {
  const official = tone === "light" ? brandAssets.logoHorizontalOnDark ?? null : brandAssets.logoHorizontal;

  if (official) {
    return (
      <Image
        src={official.src}
        alt="SUMA STUDIO"
        width={Math.round(height * official.ratio)}
        height={height}
        priority
        className={className}
      />
    );
  }

  return (
    <span
      data-provisional="wordmark"
      title="Wordmark provisional: pendiente logotipo oficial"
      className={cn(
        "inline-flex items-center gap-2 leading-none",
        tone === "light" ? "text-suma-cream" : "text-suma-navy",
        className,
      )}
      style={{ height }}
    >
      <span className="font-display font-extrabold tracking-[-0.04em]" style={{ fontSize: height * 0.82 }}>
        SUMA
      </span>
      {variant === "horizontal" && (
        <span
          className="border-l-2 border-current/25 pl-2 font-sans font-bold uppercase tracking-[0.32em]"
          style={{ fontSize: Math.max(9, height * 0.3) }}
        >
          Studio
        </span>
      )}
    </span>
  );
}
