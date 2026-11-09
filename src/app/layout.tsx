import type { Metadata, Viewport } from "next";
import { League_Spartan, Quicksand } from "next/font/google";
import { AnalyticsClicks } from "@/components/analytics/AnalyticsClicks";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { SplashScreen } from "@/components/brand/SplashScreen";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import Script from "next/script";
import { site } from "@/content/site";
import { consentDefaultsScript } from "@/lib/consent";
import { HOME_SEO } from "@/lib/seo";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Sin canonical ni og:url aquí: cada página declara los suyos (`buildMetadata`). */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: HOME_SEO.title, template: "%s · SUMA STUDIO" },
  description: HOME_SEO.description,
  applicationName: site.name,
  ...(site.indexable ? {} : { robots: { index: false, follow: false } }),
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#FFF4E6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${leagueSpartan.variable} ${quicksand.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <SplashScreen />
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Valores por defecto de Consent Mode: deben ejecutarse antes que GTM. */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {consentDefaultsScript()}
        </Script>
        <AnalyticsClicks />
        {/* GTM solo se carga con consentimiento de medición (ver ConsentBanner). */}
        <GoogleTagManager id={site.gtmId} />
        <ConsentBanner />
      </body>
    </html>
  );
}
