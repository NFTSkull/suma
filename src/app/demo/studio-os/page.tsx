import type { Metadata } from "next";
import { osFontClasses } from "@/components/studio-os/fonts";
import { Icon } from "@/components/studio-os/icons";
import { StudioOsLoader } from "@/components/studio-os/StudioOsLoader";
import { themeStyle } from "@/components/studio-os/theme";
import "@/components/studio-os/studio-os.css";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, pageGraph } from "@/lib/seo";

/**
 * SUMA Studio OS — demostración privada. Fuera del menú y del sitemap, `noindex`.
 * En producción `src/proxy.ts` la oculta; en previews el acceso lo protege Vercel.
 */
const seo = {
  title: "SUMA Studio OS: demo de sistema para estudios",
  description: "Demostración interactiva con datos ficticios: configura tu estudio de yoga o Pilates y prueba agenda, alumnas, membresías y reportes.",
  path: "/demo/studio-os",
};
export const metadata: Metadata = { ...buildMetadata(seo), robots: { index: false, follow: false } };

const benefits = [
  { icon: "calendar", title: "Organiza tus clases", text: "Agenda, cupos, lista de espera y asistencia." },
  { icon: "users", title: "Controla alumnas y membresías", text: "Créditos, vencimientos y renovaciones al día." },
  { icon: "chart", title: "Da seguimiento a tu negocio", text: "Ventas, pagos y reportes que se explican solos." },
] as const;

export default function StudioOsPage() {
  return (
    <div className={`${osFontClasses} os-root`} style={themeStyle("arcilla")}>
      <section aria-labelledby="studio-os-title" className="relative overflow-hidden bg-(--os-canvas)">
        <div className="container-suma grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-(--os-line) bg-white px-3 py-1 text-[12.5px] font-semibold text-(--os-muted)">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-(--os-accent)" /> Demostración interactiva · datos ficticios
            </p>
            <h1 id="studio-os-title" className="os-display mt-5 text-[2.6rem] leading-[1.04] text-(--os-ink) sm:text-[3.3rem] lg:text-[3.9rem]">
              Imagina tener todo tu estudio bajo control
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-(--os-muted) sm:text-lg">
              Personaliza tu espacio, elige qué quieres administrar y prueba cómo funcionaría tu propio sistema.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href="#configurador" className="inline-flex min-h-14 items-center gap-2.5 rounded-2xl bg-(--os-accent) px-7 text-[17px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(164,80,47,0.7)] transition-colors duration-200 hover:bg-(--os-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--os-accent)">
                Diseñar mi estudio <Icon name="arrowRight" className="size-5" />
              </a>
              <span className="text-[13.5px] text-(--os-muted)">Tres pasos · sin registro</span>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-3 sm:block">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-(--os-soft) text-(--os-accent-ink)"><Icon name={b.icon} /></span>
                  <span className="sm:mt-3 sm:block">
                    <span className="block text-[15px] font-semibold text-(--os-ink)">{b.title}</span>
                    <span className="mt-0.5 block text-[13.5px] leading-snug text-(--os-muted)">{b.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section id="configurador" aria-label="Configurador" className="border-t border-(--os-line) bg-[#F5F1EC] py-12 md:py-16">
        <div className="container-suma">
          <StudioOsLoader />
        </div>
      </section>
      <JsonLd data={pageGraph({ path: seo.path, name: seo.title, description: seo.description })} />
    </div>
  );
}

/** Ilustración estática del producto (no son métricas). */
function HeroVisual() {
  const rows = [
    { time: "07:00", name: "Reformer básico", who: "Mariel · Sala Reformer", pct: 100 },
    { time: "09:00", name: "Mat Pilates", who: "Sofía · Sala Mat", pct: 75 },
    { time: "18:00", name: "Reformer power", who: "Diego · Sala Reformer", pct: 50 },
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[34rem]">
      <div className="absolute -inset-6 -z-0 rounded-[2.5rem] bg-(--os-soft) opacity-70 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-(--os-line) bg-white shadow-[0_30px_60px_-30px_rgba(31,28,26,0.35)]">
        <div className="flex items-center justify-between border-b border-(--os-line) px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-(--os-accent) text-sm font-bold text-white">C</span>
            <span><span className="block text-sm font-semibold">Casa Aurora</span><span className="block text-[11px] text-(--os-muted)">Inicio</span></span>
          </div>
          <span className="rounded-full bg-[#FBEFD9] px-2.5 py-1 text-[11px] font-semibold text-[#7D5210]">Datos ficticios</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5 p-5 pb-3">
          {[["Clases hoy", "6"], ["Reservas", "41"], ["Por vencer", "3"]].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-(--os-line) p-3">
              <p className="text-[11px] text-(--os-muted)">{k}</p>
              <p className="mt-1.5 text-xl font-semibold tabular-nums">{v}</p>
            </div>
          ))}
        </div>
        <div className="px-5 pb-5">
          <p className="mb-2 text-[12px] font-semibold text-(--os-muted)">Clases de hoy</p>
          <ul className="space-y-1.5">
            {rows.map((r) => (
              <li key={r.time} className="grid grid-cols-[3rem_minmax(0,1fr)_4.5rem] items-center gap-3 rounded-xl bg-[#FAF7F3] px-3 py-2.5">
                <span className="text-[13px] font-semibold tabular-nums">{r.time}</span>
                <span className="min-w-0"><span className="block truncate text-[13px] font-semibold">{r.name}</span><span className="block truncate text-[11px] text-(--os-muted)">{r.who}</span></span>
                <span className="h-1.5 overflow-hidden rounded-full bg-[#ECE7E1]"><span className="block h-full rounded-full bg-(--os-accent)" style={{ width: `${r.pct}%` }} /></span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-(--os-line) px-3 py-2.5">
            <span className="text-[12.5px] text-(--os-muted)">Daniela pasó de lista de espera a reservada</span>
            <span className="rounded-md bg-(--os-accent) px-2 py-1 text-[11px] font-semibold text-white">Ver</span>
          </div>
        </div>
      </div>
    </div>
  );
}
