"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "rise" | "mask";
  id?: string;
};

/**
 * Revelación editorial al entrar en pantalla. Sin JS el contenido es visible
 * (la ocultación inicial depende de `@media (scripting: enabled)`). El estado
 * visible se escribe directo en el DOM para no re-renderizar.
 */
export function Reveal({ as: Tag = "div", children, className, delay = 0, variant = "rise", id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute("data-visible", "true");
    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal={variant === "mask" ? "mask" : ""}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
