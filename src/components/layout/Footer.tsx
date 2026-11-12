import Link from "next/link";
import { PrivacyPreferences } from "@/components/analytics/PrivacyPreferences";
import { OrganicShape } from "@/components/brand/OrganicShape";
import { SumaLogo } from "@/components/brand/SumaLogo";
import { WhatsAppPrivacyNotice } from "@/components/legal/WhatsAppPrivacyNotice";
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
                  <>
                    <li>
                      <a
                        href={site.contact.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center underline decoration-suma-orange underline-offset-4"
                      >
                        WhatsApp · {site.contact.phoneDisplay}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`tel:${site.contact.phoneE164}`}
                        className="inline-flex min-h-10 items-center underline decoration-suma-orange underline-offset-4"
                      >
                        Llamar al {site.contact.phoneDisplay}
                      </a>
                    </li>
                  </>
                )}
              </ul>
            )}

            {site.social.length > 0 && (
              <nav aria-label="Redes sociales de SUMA STUDIO" className="mt-6">
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {site.social.map((social) => (
                    <li key={social.href}>
                      <a href={social.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center font-semibold underline decoration-suma-orange underline-offset-4">
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="mt-8 space-y-3">
              <ButtonLink href={primaryCta.href} variant="accent" arrow target="_blank" rel="noopener noreferrer">
                {primaryCta.label}
              </ButtonLink>
              <WhatsAppPrivacyNotice className="text-xs text-suma-cream/60" />
            </div>
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

        <div className="mt-6 border-t border-suma-cream/15 pt-6 text-sm text-suma-cream/60">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
            <div className="flex-1 space-y-2">
              <p className="text-suma-cream/80">
                © <CurrentYear /> {site.name}
              </p>
              <p className="text-xs leading-relaxed">
                VIOZ CREACIONES Y PRODUCCIONES, S.A. de C.V. es la persona moral responsable de la marca SUMA STUDIO
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-10 items-center hover:text-suma-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <PrivacyPreferences />
              </li>
            </ul>
          </div>
          <p className="mt-4 text-xs">Fotografía: Unsplash</p>
        </div>
      </div>
    </footer>
  );
}
