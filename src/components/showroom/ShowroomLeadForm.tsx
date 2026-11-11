"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { showroomLeadSchema, type ShowroomLeadField } from "@/lib/contact-schema";
import { cn } from "@/lib/cn";
import type { ShowroomSelection } from "@/lib/showroom";

type Status = "idle" | "sending" | "success" | "unconfirmed" | "not_configured" | "rate_limited" | "error";
type Errors = Partial<Record<ShowroomLeadField, string>>;

const statusCopy: Record<Exclude<Status, "idle" | "sending">, { title: string; text: string; tone: "ok" | "warn" }> = {
  success: {
    title: "Gracias, recibimos tu solicitud.",
    text: "Revisaremos tu propuesta y te contactaremos pronto para afinar los detalles.",
    tone: "ok",
  },
  unconfirmed: {
    title: "No pudimos confirmar el envío.",
    text: "Tus datos siguen aquí. Espera unos segundos y vuelve a intentarlo.",
    tone: "warn",
  },
  not_configured: {
    title: "Tu solicitud no se envió.",
    text: "El formulario todavía no está conectado. Tus datos siguen aquí; intenta de nuevo más tarde o contáctanos por WhatsApp.",
    tone: "warn",
  },
  rate_limited: {
    title: "Recibimos varios intentos seguidos.",
    text: "Espera unos minutos e inténtalo de nuevo.",
    tone: "warn",
  },
  error: {
    title: "No pudimos enviar tu solicitud.",
    text: "Revisa tu conexión e inténtalo de nuevo en un momento.",
    tone: "warn",
  },
};

const field = "mt-2 min-h-11 w-full rounded-xl border border-suma-line bg-white px-4 text-base text-suma-navy focus-visible:outline-2 focus-visible:outline-suma-orange";

type Props = {
  selection: ShowroomSelection;
  quote: { setup: number; monthly: number; isEmpty: boolean };
};

export function ShowroomLeadForm({ selection, quote }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [nombre, setNombre] = useState("");
  const [negocio, setNegocio] = useState(selection.businessName || "");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [necesidades, setNecesidades] = useState("");
  const [quieroDemoPersonalizada, setQuieroDemoPersonalizada] = useState(false);
  const [privacidad, setPrivacidad] = useState(false);
  const startedAt = useRef(0);
  
  // Inicializar timestamp en mount
  useEffect(() => {
    if (startedAt.current === 0) {
      startedAt.current = Date.now();
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus("sending");

    const payload = {
      nombre,
      negocio,
      email: email.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      necesidades,
      quieroDemoPersonalizada,
      privacidad,
      showroomConfig: quote.isEmpty
        ? undefined
        : {
            mode: selection.mode,
            planId: selection.planId,
            serviceIds: selection.serviceIds,
            months: selection.months,
            setup: quote.setup,
            monthly: quote.monthly,
            locations: selection.locations,
            notes: selection.notes,
          },
      sitio: "",
      inicio: startedAt.current,
    };

    const parsed = showroomLeadSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as ShowroomLeadField | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("idle");
      track({ event: "form_error", form_name: "showroom_lead", error_type: "validation" });
      return;
    }

    try {
      const res = await fetch("/api/showroom-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; delivered?: boolean; error?: string } | null;

      if (res.ok && data?.delivered) {
        setStatus("success");
        track({
          event: "generate_lead",
          form_name: "showroom_lead",
          lead_source: "showroom",
          business_type: selection.industry,
          services: selection.mode === "package" ? selection.planId || "" : selection.serviceIds.join(","),
          from_selector: false,
        });
        return;
      }

      if (res.ok && data?.ok && !data.delivered) {
        setStatus("unconfirmed");
        track({ event: "form_error", form_name: "showroom_lead", error_type: "unconfirmed" });
        return;
      }

      if (res.status === 503) {
        setStatus("not_configured");
        track({ event: "form_error", form_name: "showroom_lead", error_type: "not_configured" });
        return;
      }

      if (res.status === 429) {
        setStatus("rate_limited");
        track({ event: "form_error", form_name: "showroom_lead", error_type: "rate_limited" });
        return;
      }

      if (res.status === 422 && data?.error === "validation") {
        const fields = (data as { fields?: Errors }).fields;
        if (fields) setErrors(fields);
        setStatus("idle");
        track({ event: "form_error", form_name: "showroom_lead", error_type: "validation" });
        return;
      }

      setStatus("error");
      track({ event: "form_error", form_name: "showroom_lead", error_type: res.ok ? "server_error" : "network" });
    } catch {
      setStatus("error");
      track({ event: "form_error", form_name: "showroom_lead", error_type: "network" });
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-center md:p-8">
        <div className="mx-auto size-16 rounded-full bg-emerald-500 grid place-items-center text-3xl text-white">✓</div>
        <h3 className="mt-4 font-display text-2xl font-extrabold text-emerald-900">{statusCopy.success.title}</h3>
        <p className="mt-2 text-sm text-emerald-800">{statusCopy.success.text}</p>
        <p className="mt-4 text-xs text-emerald-700">
          Te contactaremos a: {email && whatsapp ? `${email} o ${whatsapp}` : email || whatsapp}
        </p>
      </div>
    );
  }

  const finalStatus = status !== "idle" && status !== "sending" ? statusCopy[status] : null;

  return (
    <div className="rounded-[2rem] border border-suma-line bg-white p-6 shadow-soft md:p-8">
      <div className="text-center">
        <p className="text-eyebrow text-suma-purple">Solicitar propuesta</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold text-suma-navy md:text-3xl">
          ¿Te interesa? Armemos tu propuesta.
        </h3>
        <p className="mt-3 text-sm text-suma-navy/70">
          {quote.isEmpty
            ? "Cuéntanos qué necesitas y te recomendaremos una solución."
            : "Revisaremos tu configuración y te daremos una cotización ajustada a tu negocio."}
        </p>
      </div>

      {finalStatus && (
        <div
          className={cn(
            "mt-6 rounded-xl border p-4",
            finalStatus.tone === "ok" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
          )}
          role="alert"
        >
          <p className={cn("font-bold", finalStatus.tone === "ok" ? "text-emerald-900" : "text-amber-900")}>
            {finalStatus.title}
          </p>
          <p className={cn("mt-1 text-sm", finalStatus.tone === "ok" ? "text-emerald-800" : "text-amber-800")}>
            {finalStatus.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="showroom-lead-nombre" className="text-sm font-bold text-suma-navy">
            Tu nombre <span className="text-suma-orange">*</span>
          </label>
          <input
            id="showroom-lead-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={cn(field, errors.nombre && "border-red-500")}
            required
            autoComplete="name"
          />
          {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
        </div>

        <div>
          <label htmlFor="showroom-lead-negocio" className="text-sm font-bold text-suma-navy">
            Nombre de tu negocio <span className="text-suma-orange">*</span>
          </label>
          <input
            id="showroom-lead-negocio"
            type="text"
            value={negocio}
            onChange={(e) => setNegocio(e.target.value)}
            className={cn(field, errors.negocio && "border-red-500")}
            required
            autoComplete="organization"
          />
          {errors.negocio && <p className="mt-1 text-xs text-red-600">{errors.negocio}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="showroom-lead-email" className="text-sm font-bold text-suma-navy">
              Correo electrónico
            </label>
            <input
              id="showroom-lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(field, errors.email && "border-red-500")}
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="showroom-lead-whatsapp" className="text-sm font-bold text-suma-navy">
              WhatsApp
            </label>
            <input
              id="showroom-lead-whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className={cn(field, errors.whatsapp && "border-red-500")}
              placeholder="10 dígitos"
              autoComplete="tel"
            />
            {errors.whatsapp && <p className="mt-1 text-xs text-red-600">{errors.whatsapp}</p>}
          </div>
        </div>
        <p className="text-xs text-suma-navy/60">
          Proporciona al menos un correo o WhatsApp para que podamos contactarte.
        </p>

        <div>
          <label htmlFor="showroom-lead-necesidades" className="text-sm font-bold text-suma-navy">
            ¿Qué necesitas? (opcional)
          </label>
          <textarea
            id="showroom-lead-necesidades"
            rows={3}
            value={necesidades}
            onChange={(e) => setNecesidades(e.target.value)}
            maxLength={500}
            className={cn(field, "resize-none")}
            placeholder="Ej. Necesito organizar consultas y enviar recordatorios automáticos."
          />
          {errors.necesidades && <p className="mt-1 text-xs text-red-600">{errors.necesidades}</p>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={quieroDemoPersonalizada}
            onChange={(e) => setQuieroDemoPersonalizada(e.target.checked)}
            className="mt-1 size-4 accent-suma-purple"
          />
          <span className="text-sm text-suma-navy">
            Quiero una sesión de diagnóstico personalizada (coordinamos por WhatsApp)
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={privacidad}
            onChange={(e) => setPrivacidad(e.target.checked)}
            className="mt-1 size-4 accent-suma-purple"
            required
          />
          <span className="text-sm text-suma-navy">
            Acepto el{" "}
            <Link href="/privacidad" className="font-semibold underline decoration-suma-orange underline-offset-2">
              aviso de privacidad
            </Link>{" "}
            <span className="text-suma-orange">*</span>
          </span>
        </label>
        {errors.privacidad && <p className="mt-1 text-xs text-red-600">{errors.privacidad}</p>}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-6 min-h-14 w-full rounded-full bg-suma-orange px-6 text-base font-extrabold text-suma-navy transition-colors hover:bg-suma-pink disabled:opacity-50"
        >
          {status === "sending" ? "Enviando..." : "Enviar solicitud →"}
        </button>

        <p className="text-center text-xs text-suma-navy/55">
          No enviamos mensajes automáticos. Revisaremos tu solicitud y te contactaremos personalmente.
        </p>
      </form>
    </div>
  );
}
