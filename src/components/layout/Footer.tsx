import Link from "next/link";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { SumaLogo } from "@/components/brand/SumaLogo";
import { ButtonLink } from "@/components/ui/Button";
import { footerNav, legalLinks, primaryCta } from "@/content/navigation";
import { site } from "@/content/site";

async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const { email, whatsapp } = site.contact;
  return (
    <footer className="on-dark relative overflow-hidden bg-suma-navy text-suma-cream">
      <OrganicShape shape="a" color="purple" className="absolute -right-32 -top-40 size-[30rem] opacity-60" />
      <OrganicShape shape="d" color="pink" className="absolute -right-10 -top-24 size-60 opacity-30 mix-blend-screen" />

      <div className="container-suma relative pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <SumaLogo tone="light" height={32} />
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-suma-cream/60">
              {site.institutionalDescriptor}
            </p>
            <p className="mt-8 text-lg leading-relaxed text-suma-cream/80">{site.serviceDescriptor}.</p>
            <p className="mt-4 text-sm text-suma-cream/60">{site.location.label}</p>

            {(email || whatsapp) && (
              <ul className="mt-6 space-y-2 text-sm">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="underline decoration-suma-orange underline-offset-4">
                      {email}
                    </a>
                  </li>
                )}
                {whatsapp && (
                  <li>
                    <a href={`https://wa.me/${whatsapp}`} className="underline decoration-suma-orange underline-offset-4">
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            )}

            <ButtonLink href={primaryCta.href} variant="accent" className="mt-8" arrow>
              {primaryCta.label}
            </ButtonLink>
          </div>

          <nav aria-label="Pie de página" className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="text-eyebrow text-suma-orange">{group.title}</h2>
                <ul className="mt-5 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-10 items-center text-[0.95rem] text-suma-cream/80 transition-colors hover:text-suma-cream"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 select-none font-display text-[clamp(4.5rem,19vw,17rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-suma-cream/[0.06]"
        >
          SUMA
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-suma-cream/15 pt-6 text-sm text-suma-cream/60 md:flex-row md:items-center md:justify-between">
          <p>
            © <CurrentYear /> {site.name} · {site.institutionalDescriptor}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-10 items-center hover:text-suma-cream">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="inline-flex min-h-10 items-center">Fotografía: Unsplash</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
