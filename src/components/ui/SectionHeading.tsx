import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  size?: "lg" | "md";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  as: H = "h2",
  size = "lg",
  className,
  id,
}: Props) {
  const light = tone === "light";
  return (
    <Reveal className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-eyebrow mb-5 inline-flex items-center gap-3",
            light ? "text-suma-orange" : "text-suma-orange-ink",
          )}
        >
          <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-current" />
          {eyebrow}
        </p>
      )}
      <H
        id={id}
        className={cn(size === "lg" ? "text-display-lg" : "text-display-md", light ? "text-suma-cream" : "text-suma-navy")}
      >
        {title}
      </H>
      {lead && (
        <p
          className={cn(
            "text-lead mt-6 max-w-2xl",
            align === "center" && "mx-auto",
            light ? "text-suma-cream/80" : "text-suma-navy/75",
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
