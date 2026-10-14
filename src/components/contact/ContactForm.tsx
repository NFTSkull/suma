"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { challengeOptions } from "@/content/selector-rules";
import { cn } from "@/lib/cn";
import {
  businessTypeOptions,
  contactSchema,
  fieldErrors,
  serviceInterestOptions,
  type ContactField,
} from "@/lib/contact-schema";
import { SELECTOR_STORAGE_KEY, type SelectorContext } from "@/lib/recommend";

type Status = "idle" | "sending" | "success" | "not_configured" | "rate_limited" | "error";
type Errors = Partial<Record<ContactField, string>>;

const serviceIds = new Set<string>(serviceInterestOptions.map((o) => o.id));
const businessIds = new Set<string>(businessTypeOptions.map((o) => o.id));

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readStorage = () => {
  try {
    return window.sessionStorage.getItem(SELECTOR_STORAGE_KEY);
  } catch {
    return null;
  }
};

function parseContext(raw: string | null): SelectorContext | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<SelectorContext>;
    if (typeof v.negocio !== "string" || typeof v.reto !== "string" || !Array.isArray(v.servicios)) return null;
    return v as SelectorContext;
  } catch {
    return null;
  }
}

/** Formulario de contacto. Lee el contexto del selector (sin datos personales) desde sessionStorage. */
export function ContactForm() {
  const raw = useSyncExternalStore(subscribe, readStorage, () => null);
  const context = useMemo(() => parseContext(raw), [raw]);
  return <ContactFormBody key={raw ?? "sin-contexto"} context={context} />;
}

const statusCopy: Record<Exclude<Status, "idle" | "sending">, { title: string; text: string; tone: "ok" | "warn" }> = {
  success: {
    title: "Gracias, recibimos tu mensaje.",
    text: "Te contactaremos pronto para conocer tu negocio y platicar por dónde empezar.",
    tone: "ok",
  },
  not_configured: {
    title: "Tu mensaje no se envió.",
    text: "El formulario todavía no está conectado a un canal de entrega. Tus datos siguen aquí; intenta de nuevo más adelante.",
    tone: "warn",
  },
  rate_limited: {
    title: "Recibimos varios intentos seguidos.",
    text: "Espera unos minutos e inténtalo de nuevo.",
    tone: "warn",
  },
  error: {
    title: "No pudimos enviar tu mensaje.",
    text: "Revisa tu conexión e inténtalo de nuevo en un momento.",
    tone: "warn",
  },
};

function ContactFormBody({ context }: { context: SelectorContext | null }) {
  const [useContext, setUseContext] = useState(Boolean(context));
  const [nombre, setNombre] = useState("");
  const [negocio, setNegocio] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState<string>(context && businessIds.has(context.negocio) ? context.negocio : "");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [servicios, setServicios] = useState<string[]>(context ? context.servicios.filter((s) => serviceIds.has(s)) : []);
  const [mensaje, setMensaje] = useState("");
  const [privacidad, setPrivacidad] = useState(false);
  const [sitio, setSitio] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const markStart = () => {
    if (startedAt.current === null) startedAt.current = Date.now();
  };

  const toggleService = (id: string) =>
    setServicios((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const discardContext = () => {
    setUseContext(false);
    try {
      window.sessionStorage.removeItem(SELECTOR_STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
  };

  const challengeLabel = context ? challengeOptions.find((c) => c.id === context.reto)?.label : undefined;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const payload = {
      nombre,
      negocio,
      tipoNegocio,
      email,
      whatsapp,
      servicios,
      mensaje,
      privacidad,
      ...(useContext && context ? { contexto: { negocio: context.negocio, reto: context.reto } } : {}),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      setStatus("idle");
      const first = Object.keys(errs)[0];
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      });
      return;
    }

    setErrors({});
    setStatus("sending");
    let next: Status = "error";
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, sitio, ...(startedAt.current ? { inicio: startedAt.current } : {}) }),
      });
      if (res.ok) next = "success";
      else if (res.status === 503) next = "not_configured";
      else if (res.status === 429) next = "rate_limited";
      else if (res.status === 422) {
        const body = (await res.json().catch(() => null)) as { fields?: Errors } | null;
        if (body?.fields) setErrors(body.fields);
        next = "idle";
      }
    } catch {
      next = "error";
    }
    setStatus(next);
    if (next === "success") discardContext();
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[2rem] bg-suma-navy p-8 text-suma-cream md:p-12">
        <span aria-hidden="true" className="blob block size-10 bg-suma-orange" />
        <p className="mt-6 font-display text-3xl font-bold md:text-4xl">{statusCopy.success.title}</p>
        <p className="mt-3 max-w-lg text-lg text-suma-cream/80">{statusCopy.success.text}</p>
      </div>
    );
  }

  const sending = status === "sending";
  const feedback = status !== "idle" && status !== "sending" ? statusCopy[status] : null;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onFocusCapture={markStart}
      onInputCapture={markStart}
      aria-busy={sending}
      className="space-y-8"
    >
      {useContext && context && (
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-[1.5rem] bg-suma-purple/10 p-5">
          <div>
            <p className="text-sm font-bold text-suma-purple">Desde el selector de soluciones</p>
            {challengeLabel && <p className="mt-1 text-suma-navy/80">{challengeLabel}</p>}
            <p className="mt-1 text-sm text-suma-navy/70">Prellenamos tu tipo de negocio y los servicios sugeridos. Puedes cambiarlos.</p>
          </div>
          <button type="button" onClick={discardContext} className="min-h-11 rounded-full px-4 text-sm font-bold underline underline-offset-4">
            Quitar contexto
          </button>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div role="alert" className="rounded-[1.25rem] border-2 border-suma-orange-ink/40 bg-suma-orange/10 p-4 text-sm font-semibold">
          Revisa los campos marcados para poder enviar tu mensaje.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <TextField id="nombre" label="Nombre" value={nombre} onChange={setNombre} error={errors.nombre} autoComplete="name" />
        <TextField id="negocio" label="Nombre del negocio" value={negocio} onChange={setNegocio} error={errors.negocio} autoComplete="organization" />
        <TextField id="email" label="Correo electrónico" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" inputMode="email" />
        <TextField
          id="whatsapp"
          label="WhatsApp"
          type="tel"
          value={whatsapp}
          onChange={setWhatsapp}
          error={errors.whatsapp}
          autoComplete="tel"
          inputMode="tel"
          hint="10 dígitos. Puedes incluir lada internacional."
        />
      </div>

      <div>
        <label htmlFor="tipoNegocio" className="block font-bold">
          Tipo de negocio
        </label>
        <select
          id="tipoNegocio"
          data-field="tipoNegocio"
          value={tipoNegocio}
          onChange={(e) => setTipoNegocio(e.target.value)}
          aria-invalid={Boolean(errors.tipoNegocio)}
          aria-describedby={errors.tipoNegocio ? "tipoNegocio-error" : undefined}
          className={cn(fieldClass, "appearance-none bg-[length:1rem] bg-[right_1.25rem_center] bg-no-repeat pr-12", errors.tipoNegocio && errorBorder)}
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3 6l5 5 5-5' fill='none' stroke='%230B1240' stroke-width='2'/%3E%3C/svg%3E\")" }}
        >
          <option value="">Selecciona una opción</option>
          {businessTypeOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <FieldError id="tipoNegocio" error={errors.tipoNegocio} />
      </div>

      <fieldset aria-describedby={errors.servicios ? "servicios-error" : undefined}>
        <legend className="font-bold">¿Qué te interesa? (puedes elegir varios)</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {serviceInterestOptions.map((o, i) => {
            const checked = servicios.includes(o.id);
            return (
              <label
                key={o.id}
                className={cn(
                  "inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 px-5 font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-suma-purple",
                  checked ? "border-suma-navy bg-suma-navy text-suma-cream" : "border-suma-navy/20 bg-suma-cream-soft hover:border-suma-navy/60",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleService(o.id)}
                  data-field={i === 0 ? "servicios" : undefined}
                />
                <span aria-hidden="true">{checked ? "✓" : "+"}</span>
                {o.label}
              </label>
            );
          })}
        </div>
        <FieldError id="servicios" error={errors.servicios} />
      </fieldset>

      <div>
        <label htmlFor="mensaje" className="block font-bold">
          Cuéntanos más <span className="font-normal text-suma-navy/60">(opcional)</span>
        </label>
        <textarea
          id="mensaje"
          data-field="mensaje"
          rows={5}
          maxLength={1500}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          aria-invalid={Boolean(errors.mensaje)}
          aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
          className={cn(fieldClass, "min-h-36 resize-y py-4", errors.mensaje && errorBorder)}
          placeholder="¿Qué te gustaría resolver primero?"
        />
        <FieldError id="mensaje" error={errors.mensaje} />
      </div>

      {/* Campo trampa para bots: oculto para personas y lectores de pantalla. */}
      <div aria-hidden="true" inert className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="sitio">Sitio web</label>
        <input id="sitio" name="sitio" type="text" tabIndex={-1} autoComplete="off" value={sitio} onChange={(e) => setSitio(e.target.value)} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            data-field="privacidad"
            checked={privacidad}
            onChange={(e) => setPrivacidad(e.target.checked)}
            aria-invalid={Boolean(errors.privacidad)}
            aria-describedby={errors.privacidad ? "privacidad-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-suma-purple"
          />
          <span>
            Acepto el{" "}
            <Link href="/aviso-de-privacidad" className="font-bold underline decoration-suma-orange decoration-2 underline-offset-4">
              aviso de privacidad
            </Link>{" "}
            y que SUMA STUDIO me contacte sobre mi solicitud.
          </span>
        </label>
        <FieldError id="privacidad" error={errors.privacidad} />
      </div>

      {feedback && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-[1.25rem] border-2 border-suma-orange-ink/40 bg-suma-orange/10 p-5"
        >
          <p className="font-bold">{feedback.title}</p>
          <p className="mt-1 text-suma-navy/80">{feedback.text}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" arrow disabled={sending} aria-disabled={sending}>
          {sending ? "Enviando…" : "Enviar mensaje"}
        </Button>
        <p className="text-sm text-suma-navy/60">Solo usamos tus datos para responder tu solicitud.</p>
      </div>
    </form>
  );
}

const fieldClass =
  "mt-2 block min-h-14 w-full rounded-2xl border-2 border-suma-navy/15 bg-suma-cream-soft px-5 text-base text-suma-navy placeholder:text-suma-navy/45 transition-colors hover:border-suma-navy/40 focus:border-suma-purple";
const errorBorder = "border-suma-orange-ink";

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-suma-orange-ink">
      {error}
    </p>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  inputMode,
  hint,
}: {
  id: ContactField;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  hint?: string;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        data-field={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(fieldClass, error && errorBorder)}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-suma-navy/60">
          {hint}
        </p>
      )}
      <FieldError id={id} error={error} />
    </div>
  );
}
