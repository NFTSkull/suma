"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SumaLogo } from "@/components/brand/SumaLogo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, primaryCta, type MainNavItem } from "@/content/navigation";
import { cn } from "@/lib/cn";
import { MobileNav } from "./MobileNav";

type MenuItem = Extract<MainNavItem, { kind: "menu" }>;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopMenu({
  item,
  open,
  onOpenChange,
  active,
}: {
  item: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  active: boolean;
}) {
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  const schedule = (next: boolean, delay: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => onOpenChange(next), delay);
  };

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && schedule(true, 90)}
      onPointerLeave={(e) => e.pointerType === "mouse" && schedule(false, 160)}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) onOpenChange(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "relative inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.95rem] xl:px-3.5 font-bold transition-colors duration-[var(--dur-micro)]",
          open || active ? "text-suma-purple" : "text-suma-navy hover:text-suma-purple",
        )}
      >
        {item.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={cn("size-3 transition-transform duration-[var(--dur-micro)]", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {active && <span aria-hidden="true" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-suma-orange" />}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-1/2 top-full z-50 w-[min(40rem,calc(100vw-3rem))] -translate-x-1/2 pt-3"
      >
        <div className="grid grid-cols-[13rem_1fr] overflow-hidden rounded-[1.75rem] border border-suma-line bg-suma-cream-soft shadow-lift motion-safe:animate-[menu-in_var(--dur-panel)_var(--ease-flow)]">
          <div className="relative flex flex-col justify-between overflow-hidden bg-suma-navy p-6 text-suma-cream">
            <p className="font-display text-2xl font-bold leading-tight">{item.intro}</p>
            <Link
              href={item.href}
              className="relative z-10 mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-suma-orange underline-offset-4 hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Ver {item.label.toLowerCase()} <span aria-hidden="true">→</span>
            </Link>
            <span aria-hidden="true" className="blob absolute -bottom-10 -right-10 size-28 bg-suma-pink/80" />
            <span aria-hidden="true" className="blob absolute -bottom-4 right-8 size-16 bg-suma-orange mix-blend-screen" />
          </div>
          <ul className="grid gap-0.5 p-3">
            {item.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className="group/item flex min-h-11 items-baseline justify-between gap-4 rounded-2xl px-4 py-2.5 transition-colors hover:bg-suma-cream-deep focus-visible:bg-suma-cream-deep"
                >
                  <span className="font-display text-[1.05rem] font-bold text-suma-navy">{link.label}</span>
                  <span className="text-right text-sm text-suma-navy/65 group-hover/item:text-suma-navy">{link.description}</span>
                </Link>
              </li>
            ))}
            <li className="mt-1 border-t border-suma-line pt-1">
              <Link
                href={item.footer.href}
                onClick={() => onOpenChange(false)}
                className="flex min-h-11 items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-bold text-suma-purple hover:bg-suma-cream-deep"
              >
                {item.footer.label}
                {item.footer.description && (
                  <span className="font-medium text-suma-navy/60">{item.footer.description}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu]);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
  }

  const handleOpenChange = useCallback((label: string, open: boolean) => {
    setOpenMenu((current) => (open ? label : current === label ? null : current));
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-[var(--dur-panel)]",
        scrolled ? "bg-suma-cream/90 shadow-[0_1px_0_var(--color-suma-line)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-suma-navy focus:px-5 focus:py-3 focus:text-suma-cream"
      >
        Saltar al contenido
      </a>
      <div className="container-suma flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" aria-label="SUMA STUDIO, ir al inicio" className="flex min-h-11 items-center rounded-lg">
          <SumaLogo height={30} />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) => (
              <li key={item.label} className={item.kind === "link" && item.href === "/" ? "hidden xl:block" : undefined}>
                {item.kind === "menu" ? (
                  <DesktopMenu
                    item={item}
                    open={openMenu === item.label}
                    active={isActive(pathname, item.href)}
                    onOpenChange={(open) => handleOpenChange(item.label, open)}
                  />
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-[0.95rem] xl:px-3.5 font-bold transition-colors duration-[var(--dur-micro)]",
                      isActive(pathname, item.href) ? "text-suma-purple" : "text-suma-navy hover:text-suma-purple",
                    )}
                  >
                    {item.label}
                    {isActive(pathname, item.href) && (
                      <span aria-hidden="true" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-suma-orange" />
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ButtonLink href={primaryCta.href} variant="primary" className="whitespace-nowrap" arrow>
              {primaryCta.label}
            </ButtonLink>
          </div>
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
