"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { SumaLogo } from "@/components/brand/SumaLogo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, primaryCta } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function MobileNav({ pathname }: { pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border-2 border-suma-navy/80 px-4 font-bold text-suma-navy lg:hidden"
      >
        <span className="text-sm">Menú</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M3 7h14M3 13h9" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menú principal"
        onClose={() => setOpen(false)}
        className={cn(
          "m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-suma-cream p-0 text-suma-navy backdrop:bg-suma-navy/40",
          "open:motion-safe:animate-[menu-in_var(--dur-panel)_var(--ease-flow)]",
        )}
      >
        <div className="relative flex min-h-full flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
          <OrganicShape shape="b" color="pink" className="absolute -right-24 top-40 size-72 opacity-25" />
          <OrganicShape shape="c" color="orange" className="absolute -left-28 bottom-10 size-72 opacity-20" />

          <div className="container-suma flex h-[var(--header-h)] items-center justify-between">
            <SumaLogo height={26} variant="compact" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-suma-navy px-4 font-bold text-suma-cream"
            >
              <span className="text-sm">Cerrar</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            </button>
          </div>

          <nav aria-label="Principal (móvil)" className="container-suma relative mt-6 flex-1">
            <ul className="space-y-1">
              {mainNav.map((item) =>
                item.kind === "menu" ? (
                  <li key={item.label}>
                    <details className="group">
                      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-display text-3xl font-extrabold [&::-webkit-details-marker]:hidden">
                        {item.label}
                        <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <ul className="mb-4 ml-1 space-y-0.5 border-l-2 border-suma-orange pl-4">
                        {[{ label: item.label === "Servicios" ? "Todos los servicios" : "Todas las industrias", href: item.href, description: "" }, ...item.links].map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className="flex min-h-11 flex-col justify-center py-1.5">
                              <span className="font-bold">{link.label}</span>
                              {link.description && <span className="text-sm text-suma-navy/65">{link.description}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center font-display text-3xl font-extrabold",
                        pathname === item.href && "text-suma-purple",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              <li>
                <Link href="/como-trabajamos" className="flex min-h-14 items-center font-display text-3xl font-extrabold">
                  Cómo trabajamos
                </Link>
              </li>
            </ul>
          </nav>

          <div className="container-suma relative mt-10 space-y-5">
            <ButtonLink href={primaryCta.href} size="lg" arrow className="w-full">
              {primaryCta.label}
            </ButtonLink>
            <p className="text-center text-sm text-suma-navy/65">{site.location.label}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
