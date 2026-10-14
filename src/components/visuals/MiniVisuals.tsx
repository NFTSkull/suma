import Image from "next/image";
import { photos } from "@/content/photos";
import { cn } from "@/lib/cn";

/* Visuales de interfaz estáticos y decorativos (aria-hidden) para tarjetas de servicio. */

export function ChatMini({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("w-full max-w-[19rem] rounded-[1.4rem] bg-suma-cream-soft p-3 shadow-lift", className)}>
      <div className="flex items-center gap-2 border-b border-suma-line px-1 pb-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-suma-orange font-display text-sm font-extrabold text-suma-navy">E</span>
        <span>
          <span className="block text-[0.8rem] font-bold leading-none text-suma-navy">Estudio Ejemplo</span>
          <span className="text-[0.68rem] text-suma-navy/60">Asistente · en línea</span>
        </span>
      </div>
      <div className="space-y-2 px-1 pt-3 text-[0.8rem] leading-snug">
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-suma-navy px-3 py-2 text-suma-cream">
          ¿Tienen reformer por la tarde?
        </p>
        <p className="w-fit max-w-[88%] rounded-2xl rounded-bl-md bg-suma-orange/15 px-3 py-2 text-suma-navy">
          ¡Sí! Hoy hay lugares a las 18:30 y 19:45. ¿Te aparto uno?
        </p>
        <div className="flex gap-1.5">
          {["18:30", "19:45"].map((t) => (
            <span key={t} className="rounded-full border border-suma-navy/20 px-2.5 py-1 text-[0.7rem] font-bold text-suma-navy">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CrmMini({ className }: { className?: string }) {
  const rows = [
    { t: "10:00", n: "Mariana R.", s: "Masaje relajante", ok: true },
    { t: "11:30", n: "Daniel P.", s: "Facial hidratante", ok: false },
    { t: "13:00", n: "Lucía G.", s: "Ritual de pareja", ok: true },
  ];
  return (
    <div aria-hidden="true" className={cn("w-full max-w-[22rem] rounded-[1.4rem] bg-suma-cream-soft p-4 text-suma-navy shadow-lift", className)}>
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-bold">Citas de hoy</span>
        <span className="rounded-full bg-suma-purple/10 px-2 py-0.5 text-[0.65rem] font-bold text-suma-purple">3 pendientes</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["12", "Citas"],
          ["4", "Nuevos"],
          ["7", "Seguim."],
        ].map(([v, l]) => (
          <span key={l} className="rounded-xl bg-suma-cream-deep px-2 py-2">
            <span className="block font-display text-lg font-extrabold leading-none">{v}</span>
            <span className="text-[0.62rem] font-semibold text-suma-navy/60">{l}</span>
          </span>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <li key={r.t} className="flex items-center gap-2 rounded-xl border border-suma-line px-2.5 py-2 text-[0.72rem]">
            <span className="font-bold tabular-nums">{r.t}</span>
            <span className="flex-1 truncate">
              <span className="font-bold">{r.n}</span> · {r.s}
            </span>
            <span className={cn("size-2 rounded-full", r.ok ? "bg-suma-purple" : "bg-suma-orange")} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PhoneMini({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("w-40 rounded-[2rem] bg-suma-navy p-1.5 shadow-device", className)}>
      <div className="overflow-hidden rounded-[1.6rem] bg-suma-cream-soft">
        <div className="bg-suma-pink px-3 pb-4 pt-5 text-suma-navy">
          <span className="block text-[0.6rem] font-bold uppercase tracking-widest">Hola, Ana</span>
          <span className="mt-1 block font-display text-base font-extrabold leading-tight">Tu próxima clase</span>
          <span className="mt-2 block rounded-xl bg-suma-cream-soft/90 px-2 py-1.5 text-[0.62rem] font-bold">Barre · Mar 7:00</span>
        </div>
        <div className="space-y-1.5 p-2.5">
          {["Clases", "Membresía", "Novedades"].map((l, i) => (
            <span key={l} className="flex items-center justify-between rounded-lg bg-suma-cream-deep px-2 py-1.5 text-[0.62rem] font-bold text-suma-navy">
              {l}
              <span className={cn("size-1.5 rounded-full", i === 0 ? "bg-suma-pink" : "bg-suma-navy/30")} />
            </span>
          ))}
        </div>
        <div className="flex justify-around border-t border-suma-line py-2">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cn("size-1.5 rounded-full", i === 0 ? "bg-suma-navy" : "bg-suma-navy/25")} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WebScreensMini({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative h-56 w-full max-w-[30rem]", className)}>
      <div className="absolute left-0 top-0 w-[78%] overflow-hidden rounded-xl bg-suma-cream-soft shadow-lift">
        <div className="flex gap-1 border-b border-suma-line px-3 py-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-suma-navy/25" />
          ))}
        </div>
        <div className="grid grid-cols-[1.1fr_1fr] gap-3 p-3">
          <div>
            <span className="block h-2 w-10 rounded-full bg-suma-orange" />
            <span className="mt-2 block font-display text-[0.95rem] font-extrabold leading-[1.05] text-suma-navy">Respira. Muévete. Vuelve.</span>
            <span className="mt-2 block h-1.5 w-full rounded-full bg-suma-navy/15" />
            <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-suma-navy/15" />
            <span className="mt-3 inline-block rounded-full bg-suma-navy px-2.5 py-1 text-[0.55rem] font-bold text-suma-cream">Reservar clase</span>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image src={photos.yogaEstudio.src} alt="" fill sizes="160px" className="object-cover" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[30%] overflow-hidden rounded-2xl border-4 border-suma-cream-soft bg-suma-cream-soft shadow-lift">
        <div className="relative aspect-[9/14]">
          <Image src={photos.spaAlberca.src} alt="" fill sizes="120px" className="object-cover" />
          <span className="absolute inset-x-1.5 bottom-1.5 rounded-lg bg-suma-cream-soft/95 px-1.5 py-1 text-[0.5rem] font-bold text-suma-navy">
            Menú de tratamientos
          </span>
        </div>
      </div>
    </div>
  );
}

export function AdJourneyMini({ className }: { className?: string }) {
  const steps = [
    { l: "Anuncio", d: "Clase muestra", c: "bg-suma-orange" },
    { l: "Página", d: "Reserva fácil", c: "bg-suma-pink" },
    { l: "Consulta", d: "Mensaje recibido", c: "bg-suma-purple" },
    { l: "Seguimiento", d: "Primera visita", c: "bg-suma-navy" },
  ];
  return (
    <ol aria-hidden="true" className={cn("relative grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {steps.map((s, i) => (
        <li key={s.l} className="relative min-w-0 rounded-2xl bg-suma-cream-soft p-3 shadow-soft">
          <span className={cn("blob block size-6", s.c)} />
          <span className="mt-3 block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-suma-navy/60">0{i + 1}</span>
          <span lang="es" className="block hyphens-auto break-words font-display text-[0.95rem] font-bold text-suma-navy">{s.l}</span>
          <span className="text-xs text-suma-navy/70">{s.d}</span>
        </li>
      ))}
    </ol>
  );
}
