import type { Metadata, Viewport } from "next";
import { League_Spartan, Quicksand } from "next/font/google";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/GoogleTagManager";
import { SplashScreen } from "@/components/brand/SplashScreen";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
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

const defaultTitle = "SUMA STUDIO · Tecnología y experiencias digitales para negocios de bienestar";
const defaultDescription =
  "Chatbots, CRM, aplicaciones, páginas web y publicidad digital para estudios de yoga y pilates, spas y marcas wellness. Desde Monterrey, Nuevo León, para todo México.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: "%s · SUMA STUDIO" },
  description: defaultDescription,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription },
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
        <GoogleTagManagerNoScript id={site.gtmId} />
        <SplashScreen />
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationJsonLd} />
        <GoogleTagManager id={site.gtmId} />
      </body>
    </html>
  );
}
