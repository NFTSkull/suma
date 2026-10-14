"use client";

import gsap from "gsap";
import Image from "next/image";
import { memo, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { afterSplash } from "./splash-signal";
import {
  SYMBOL_ASPECT_RATIO,
  SYMBOL_VIEWBOX,
  spreadPose,
  symbolImageFrame,
  symbolMotion,
  symbolPieces,
  travelScale,
  type SymbolVariant,
} from "./suma-symbol-config";

type Props = {
  variant?: SymbolVariant;
  theme?: "cream" | "navy";
  /** `load`: se une al cargar (después de la pantalla de carga). `in-view`: al entrar al viewport. */
  trigger?: "load" | "in-view";
  className?: string;
  /** Fuerza (true) o desactiva (false) el modo sin movimiento; por defecto sigue prefers-reduced-motion. */
  reducedMotion?: boolean;
  /** Precarga los SVG (solo para el símbolo visible al cargar). */
  preload?: boolean;
};

/**
 * Isotipo de SUMA STUDIO construido con las tres piezas oficiales: flotan
 * separadas, se unen en la composición exacta del símbolo y quedan respirando
 * como una sola pieza. Decorativo (aria-hidden).
 *
 * Estados en `data-state`: (sin valor) → floating → assembling → formed.
 */
export const AnimatedSumaSymbol = memo(function AnimatedSumaSymbol({
  variant = "hero",
  theme = "cream",
  trigger = "load",
  className,
  reducedMotion,
  preload = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = reducedMotion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion = symbolMotion[variant];
    const travel = travelScale(window.innerWidth);
    const loops: gsap.core.Animation[] = [];
    const disposers: Array<() => void> = [];
    let onScreen = true;

    const ctx = gsap.context(() => {}, root);
    const q = gsap.utils.selector(root);
    const glow = q("[data-glow]");
    const group = q("[data-group]");

    const loop = (anim: gsap.core.Animation) => {
      loops.push(anim);
      if (!onScreen) anim.pause();
      return anim;
    };

    const showFormed = () =>
      ctx.add(() => {
        root.dataset.state = "formed";
        gsap.fromTo([...q("[data-piece]"), ...glow], { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" });
      });

    const settle = () =>
      ctx.add(() => {
        root.dataset.state = "formed";
        gsap.fromTo(group, { scale: 1 }, { scale: 1.025, duration: 0.32, yoyo: true, repeat: 1, ease: "sine.inOut" });
        loop(
          gsap.to(group, {
            yPercent: -motion.idle.lift,
            rotation: motion.idle.rotate,
            duration: motion.idle.duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.7,
          }),
        );
      });

    const assemble = () =>
      ctx.add(() => {
        root.dataset.state = "assembling";
        loops.splice(0).forEach((anim) => anim.kill());
        const tl = gsap.timeline({ onComplete: settle });
        tl.to(q("[data-drift]"), { xPercent: 0, yPercent: 0, rotation: 0, duration: motion.assemble.duration * 0.7, ease: "power2.inOut" }, 0);
        symbolPieces.forEach(({ key }, i) => {
          tl.to(
            q(`[data-piece="${key}"]`),
            {
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              scale: 1,
              duration: motion.assemble.duration,
              ease: key === "morado" ? "back.out(1.3)" : "expo.inOut",
            },
            i * motion.assemble.stagger,
          );
        });
        tl.to(glow, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, motion.assemble.duration * 0.6);
      });

    const start = () =>
      ctx.add(() => {
        root.dataset.state = "floating";
        symbolPieces.forEach(({ key }, i) => {
          const pose = spreadPose(variant, key, travel);
          const piece = q(`[data-piece="${key}"]`);
          gsap.set(piece, { xPercent: pose.x, yPercent: pose.y, rotation: pose.rotate, scale: pose.scale });
          gsap.fromTo(piece, { opacity: 0 }, { opacity: 1, duration: 0.9, delay: i * 0.1, ease: "power2.out" });

          const amp = motion.float.amplitude * travel;
          const dir = i % 2 === 0 ? 1 : -1;
          loop(
            gsap.to(q(`[data-piece="${key}"] [data-drift]`), {
              xPercent: amp * 0.6 * dir,
              yPercent: -amp * dir,
              rotation: motion.float.rotate * dir,
              duration: motion.float.duration + i * 0.55,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            }),
          );
        });
        gsap.set(glow, { opacity: theme === "navy" ? 0.45 : 0, scale: 0.8 });
      });

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      loops.forEach((anim) => (onScreen ? anim.resume() : anim.pause()));
    });
    visibility.observe(root);

    if (reduce) {
      showFormed();
    } else if (trigger === "load") {
      disposers.push(
        afterSplash(() => {
          start();
          ctx.add(() => gsap.delayedCall(motion.hold, assemble));
        }),
      );
    } else {
      const entrance = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          entrance.disconnect();
          start();
          ctx.add(() => gsap.delayedCall(motion.hold, assemble));
        },
        { threshold: 0.35 },
      );
      disposers.push(afterSplash(() => entrance.observe(root)), () => entrance.disconnect());
    }

    return () => {
      visibility.disconnect();
      disposers.forEach((dispose) => dispose());
      ctx.revert();
      delete root.dataset.state;
    };
  }, [variant, theme, trigger, reducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-variant={variant}
      data-theme={theme}
      className={cn("suma-symbol pointer-events-none select-none", className)}
    >
      <div className="relative w-full" style={{ aspectRatio: SYMBOL_ASPECT_RATIO }}>
        <div data-glow className="suma-symbol__glow" />
        <div data-group className="absolute inset-0">
          {symbolPieces.map(({ key, src, origin }) => (
            <div
              key={key}
              data-piece={key}
              className="absolute inset-0 will-change-transform"
              style={{ transformOrigin: origin }}
            >
              <div data-drift className="absolute inset-0" style={{ transformOrigin: origin }}>
                <Image
                  src={src}
                  alt=""
                  width={SYMBOL_VIEWBOX.width}
                  height={SYMBOL_VIEWBOX.height}
                  preload={preload}
                  loading={preload ? "eager" : undefined}
                  draggable={false}
                  className="absolute max-w-none"
                  style={symbolImageFrame}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
