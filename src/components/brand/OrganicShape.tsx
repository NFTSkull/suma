import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Formas fluidas originales del sistema SUMA (no derivan geométricamente del isotipo). */
export const blobPaths = {
  a: "M44.7,-61.7C57.2,-52.4,66.2,-38.5,71.4,-23.1C76.6,-7.7,78,9.2,72.2,23.2C66.4,37.2,53.4,48.3,39.3,57.3C25.2,66.3,10,73.2,-5.6,75.6C-21.2,78,-37.2,75.9,-48.7,66.9C-60.2,57.9,-67.2,42,-72.1,25.6C-77,9.2,-79.8,-7.7,-74.6,-21.9C-69.4,-36.1,-56.2,-47.6,-42,-56.6C-27.8,-65.6,-13.9,-72.1,1.2,-73.7C16.3,-75.3,32.2,-71,44.7,-61.7Z",
  b: "M39.9,-55.3C52.8,-45.8,65.3,-35.4,70.6,-21.7C75.9,-8,73.9,9,67.1,23.4C60.3,37.8,48.6,49.6,35,58.3C21.4,67,5.9,72.6,-10.9,73.1C-27.7,73.6,-45.8,69,-57.1,57.4C-68.4,45.8,-72.9,27.2,-73.2,9.6C-73.5,-8,-69.6,-24.6,-60.3,-36.8C-51,-49,-36.3,-56.8,-22.4,-65.6C-8.5,-74.4,4.6,-84.2,16.4,-81.4C28.2,-78.6,27,-64.8,39.9,-55.3Z",
  c: "M52.1,-68.4C66.3,-60.4,75.8,-43.7,79.6,-26.3C83.4,-8.9,81.5,9.2,74.1,24.4C66.7,39.6,53.8,51.9,39.1,61.4C24.4,70.9,7.9,77.6,-8.6,77.8C-25.1,78,-41.6,71.7,-53.6,60.6C-65.6,49.5,-73.1,33.6,-76.5,16.8C-79.9,0,-79.2,-17.7,-71.6,-31.5C-64,-45.3,-49.5,-55.2,-34.7,-63.1C-19.9,-71,-4.8,-76.9,11.2,-78.6C27.2,-80.3,37.9,-76.4,52.1,-68.4Z",
  d: "M33.4,-47.2C44.5,-38.5,55.4,-29.9,62.3,-17.4C69.2,-4.9,72.1,11.5,66.5,24.1C60.9,36.7,46.8,45.5,32.6,53.9C18.4,62.3,4.1,70.3,-11.6,71.5C-27.3,72.7,-44.4,67.1,-55.7,55.4C-67,43.7,-72.5,25.9,-72.4,9.1C-72.3,-7.7,-66.6,-23.5,-56.6,-33.7C-46.6,-43.9,-32.3,-48.5,-19.7,-56.4C-7.1,-64.3,3.8,-75.5,13.6,-73.6C23.4,-71.7,22.3,-55.9,33.4,-47.2Z",
} as const;

export type BlobKey = keyof typeof blobPaths;

const fills = {
  orange: "var(--color-suma-orange)",
  pink: "var(--color-suma-pink)",
  purple: "var(--color-suma-purple)",
  navy: "var(--color-suma-navy)",
  cream: "var(--color-suma-cream)",
} as const;

type Props = {
  shape?: BlobKey;
  color?: keyof typeof fills;
  className?: string;
  style?: CSSProperties;
  animate?: "drift" | "drift-reverse" | "breathe" | false;
  blend?: boolean;
};

export function OrganicShape({ shape = "a", color = "orange", className, style, animate = false, blend = false }: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 200 200"
      className={cn(
        "pointer-events-none select-none will-change-transform",
        animate === "drift" && "animate-drift",
        animate === "drift-reverse" && "animate-drift-reverse",
        animate === "breathe" && "animate-breathe",
        blend && "mix-blend-multiply",
        className,
      )}
      style={style}
    >
      <path d={blobPaths[shape]} transform="translate(100 100)" fill={fills[color]} />
    </svg>
  );
}
