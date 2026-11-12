import type { Metadata } from "next";
import { osFontClasses } from "@/components/studio-os/fonts";
import { StudioOsLoader } from "@/components/studio-os/StudioOsLoader";
import { themeStyle } from "@/components/studio-os/theme";
import "@/components/studio-os/studio-os.css";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, pageGraph } from "@/lib/seo";

/** Preview privado: fuera del menu/sitemap y bloqueado en produccion por el proxy. */
const seo = {
  title: "SUMA Studio OS: diseña tu estudio",
  description: "Demostración privada e interactiva con datos ficticios para estudios de yoga, Pilates y Reformer.",
  path: "/demo/studio-os",
};
export const metadata: Metadata = { ...buildMetadata(seo), robots: { index: false, follow: false } };

export default function StudioOsPage() {
  return (
    <div className={`${osFontClasses} os-root min-h-screen bg-(--os-canvas)`} style={themeStyle("arcilla")}>
      <section aria-labelledby="studio-os-title">
        <div className="container-suma mx-auto max-w-[78rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-(--os-line) pb-5">
            <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.12em] text-(--os-ink)">
              <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-(--os-accent) text-sm tracking-normal text-white">S</span>
              SUMA STUDIO <span className="font-normal tracking-normal text-(--os-muted)">/ OS</span>
            </p>
            <span className="rounded-full border border-(--os-line) bg-white px-3 py-1.5 text-[12px] font-medium text-(--os-muted)">
              Demostración privada · Datos ficticios
            </span>
          </div>
          <div className="mb-8 max-w-2xl">
            <p className="text-[12px] font-semibold tracking-[0.13em] text-(--os-accent-ink)">TU CRM PERSONALIZADO</p>
            <h1 id="studio-os-title" className="os-display mt-3 text-[2.1rem] leading-[1.1] sm:text-[2.9rem]">
              Diseña el sistema de tu estudio.
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-(--os-muted)">
              Una pregunta por vez. Elige cómo trabajas y descubre tu agenda, alumnas y membresías en un CRM interactivo creado con ejemplos para ti.
            </p>
          </div>
          <div id="configurador">
            <StudioOsLoader />
          </div>
          <p className="mt-8 text-center text-[12px] text-(--os-muted)">
            Sin registro · Sin pagos ni reservas reales · Puedes restaurar la demostración cuando quieras
          </p>
        </div>
      </section>
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description })} />
    </div>
  );
}
