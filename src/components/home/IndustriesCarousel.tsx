"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { industries } from "@/content/industries";
import { photos } from "@/content/photos";
import { cn } from "@/lib/cn";

export function IndustriesCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <div className="container-suma mb-8 flex justify-end gap-2">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => scrollBy(dir)}
            disabled={dir === -1 ? edges.start : edges.end}
            aria-label={dir === -1 ? "Industrias anteriores" : "Siguientes industrias"}
            className="grid size-12 place-items-center rounded-full border-2 border-suma-navy/80 text-suma-navy transition-colors hover:bg-suma-navy hover:text-suma-cream disabled:opacity-30"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className={cn("size-4", dir === -1 && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10h11M11 5l5 5-5 5" />
            </svg>
          </button>
        ))}
      </div>

      <ul
        ref={trackRef}
        aria-label="Industrias"
        className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth gutter-x pb-6 motion-reduce:scroll-auto"
      >
        {industries.map((ind, i) => {
          const photo = photos[ind.photo];
          return (
            <li key={ind.slug} className="w-[min(82vw,24rem)] shrink-0 snap-start">
              <Link href={ind.href} className="group block">
                <div className={cn("relative overflow-hidden rounded-[2rem]", i % 2 === 0 ? "aspect-[4/5]" : "aspect-[4/4.4]")}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 24rem, 82vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-flow)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-suma-navy/85 via-suma-navy/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-suma-cream">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-suma-cream/80">{ind.navTagline}</p>
                    <h3 className="mt-2 font-display text-[1.75rem] font-bold leading-[1.05]">{ind.name}</h3>
                  </div>
                </div>
                <div className="px-1 pt-5">
                  <p className="text-sm text-suma-navy/70">{ind.need}</p>
                  <p className="mt-2 font-display text-lg font-bold leading-snug text-suma-navy">“{ind.benefit}”</p>
                  <span className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-suma-navy underline decoration-suma-orange decoration-2 underline-offset-[6px] group-hover:decoration-suma-pink">
                    Ver cómo podemos ayudarte
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
