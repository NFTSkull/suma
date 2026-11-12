import type { Metadata } from "next";
import { osFontClasses } from "@/components/studio-os/fonts";
import { StudioOsLoader } from "@/components/studio-os/StudioOsLoader";
import { themeStyle } from "@/components/studio-os/theme";
import "@/components/studio-os/studio-os.css";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, pageGraph } from "@/lib/seo";

/**
 * SUMA Studio OS — demostración privada. Fuera del menú y del sitemap, `noindex`.
 * En producción `src/proxy.ts` la oculta; en previews el acceso lo protege Vercel.
 * La experiencia ocupa toda la pantalla (se monta en el cliente sobre el sitio).
 */
const seo = {
  title: "SUMA Studio OS: demo de sistema para estudios",
  description: "Demostración interactiva con datos ficticios: configura tu estudio de yoga o Pilates y prueba agenda, alumnas, membresías y reportes.",
  path: "/demo/studio-os",
};
export const metadata: Metadata = { ...buildMetadata(seo), robots: { index: false, follow: false } };

export default function StudioOsPage() {
  return (
    <div className={`${osFontClasses} os-root`} style={themeStyle("arcilla")}>
      {/* Telón mientras carga la demo: mismo fondo que la bienvenida, sin saltos. */}
      <section aria-labelledby="studio-os-title" className="fixed inset-0 z-[79] grid place-items-center bg-(--os-night) px-6 text-center text-(--os-ivory)">
        <div>
          <p className="text-[13px] font-semibold tracking-[0.18em]">SUMA <span className="os-display font-normal italic tracking-normal opacity-70">Studio OS</span></p>
          <h1 id="studio-os-title" className="sr-only">Tu estudio merece un sistema hecho a su medida</h1>
          <noscript><p className="mt-4 text-sm opacity-70">Esta demostración necesita JavaScript.</p></noscript>
        </div>
      </section>
      <StudioOsLoader />
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description })} />
    </div>
  );
}
