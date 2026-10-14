"use client";

import { useEffect, useRef, useState } from "react";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { cn } from "@/lib/cn";

type Message = { from: "client" | "bot"; text: string };
type Stage = "idle" | "typing" | "slots" | "confirmed" | "answered";

const slots = [
  { id: "1730", time: "17:30", label: "Reformer básico", spots: 3 },
  { id: "1830", time: "18:30", label: "Reformer intermedio", spots: 2 },
  { id: "1945", time: "19:45", label: "Reformer flow", spots: 5 },
];

const questions = [
  { id: "reformer", text: "Hola, ¿tienen clases de reformer por la tarde?" },
  { id: "muestra", text: "¿Cuánto cuesta la clase muestra?" },
  { id: "cancelar", text: "¿Puedo cancelar una reserva?" },
] as const;

const answers: Record<Exclude<(typeof questions)[number]["id"], "reformer">, string> = {
  muestra:
    "La clase muestra tiene un precio especial para tu primera visita. Aquí aparecería el precio que tú definas. ¿Te muestro horarios de reformer para esta tarde?",
  cancelar:
    "Sí, puedes cancelar hasta 12 horas antes desde tu enlace de reserva (política de ejemplo). ¿Te ayudo a buscar un horario?",
};

export function ChatbotDemo({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "¡Hola! Soy el asistente de Estudio Ejemplo. ¿En qué te ayudo?" },
  ]);
  const [stage, setStage] = useState<Stage>("idle");
  const [picked, setPicked] = useState<(typeof slots)[number] | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, stage]);

  const botReply = (text: string, next: Stage) => {
    setStage("typing");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text }]);
      setStage(next);
    }, reduce ? 0 : 850);
  };

  const ask = (id: (typeof questions)[number]["id"]) => {
    const q = questions.find((x) => x.id === id)!;
    setMessages((m) => [...m, { from: "client", text: q.text }]);
    if (id === "reformer") {
      botReply("¡Claro! Estos son los horarios de reformer para hoy por la tarde:", "slots");
    } else {
      botReply(answers[id], "answered");
    }
  };

  const choose = (slot: (typeof slots)[number]) => {
    setPicked(slot);
    setMessages((m) => [...m, { from: "client", text: `Me interesa la de las ${slot.time}` }]);
    botReply(`¡Listo! Te aparté un lugar en ${slot.label} a las ${slot.time}. Te enviaremos un recordatorio.`, "confirmed");
  };

  const reset = () => {
    window.clearTimeout(timer.current);
    setMessages([{ from: "bot", text: "¡Hola! Soy el asistente de Estudio Ejemplo. ¿En qué te ayudo?" }]);
    setStage("idle");
    setPicked(null);
  };

  return (
    <div className={cn("grid gap-6", !compact && "lg:grid-cols-[1fr_0.9fr] lg:items-start")}>
      <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-suma-line bg-suma-cream-soft text-suma-navy shadow-lift">
        <div className="flex items-center gap-3 border-b border-suma-line bg-suma-cream px-5 py-3.5">
          <span className="grid size-10 place-items-center rounded-full bg-suma-orange font-display font-extrabold text-suma-navy">E</span>
          <div className="flex-1">
            <p className="font-bold leading-tight">Estudio Ejemplo · Pilates</p>
            <p className="text-xs text-suma-navy/60">Asistente digital · demostración</p>
          </div>
          <button type="button" onClick={reset} className="min-h-10 rounded-full px-3 text-sm font-bold text-suma-purple hover:bg-suma-purple/10">
            Reiniciar
          </button>
        </div>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Conversación de ejemplo"
          className="h-[22rem] space-y-3 overflow-y-auto px-5 py-5"
        >
          {messages.map((m, i) => (
            <p
              key={i}
              className={cn(
                "w-fit max-w-[85%] rounded-3xl px-4 py-2.5 text-[0.95rem] leading-snug motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]",
                m.from === "client" ? "ml-auto rounded-br-lg bg-suma-navy text-suma-cream" : "rounded-bl-lg bg-suma-orange/15",
              )}
            >
              <span className="sr-only">{m.from === "client" ? "Cliente: " : "Asistente: "}</span>
              {m.text}
            </p>
          ))}

          {stage === "typing" && (
            <p className="flex w-fit gap-1 rounded-3xl rounded-bl-lg bg-suma-orange/15 px-4 py-3.5" aria-label="El asistente está escribiendo">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 rounded-full bg-suma-navy/70 animate-typing" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </p>
          )}

          {stage === "slots" && (
            <div className="grid gap-2 motion-safe:animate-[enter_var(--dur-panel)_var(--ease-flow)_both]" role="group" aria-label="Horarios ficticios">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => choose(slot)}
                  className="flex min-h-12 items-center justify-between rounded-2xl border-2 border-suma-navy/15 bg-suma-cream px-4 py-2 text-left transition-colors hover:border-suma-orange focus-visible:border-suma-orange"
                >
                  <span>
                    <span className="font-display text-lg font-bold">{slot.time}</span>
                    <span className="ml-2 text-sm text-suma-navy/70">{slot.label}</span>
                  </span>
                  <span className="text-xs font-bold text-suma-navy/60">{slot.spots} lugares</span>
                </button>
              ))}
              <p className="text-xs font-semibold text-suma-navy/55">Horarios ficticios para la demostración.</p>
            </div>
          )}

          {stage === "confirmed" && picked && (
            <div className="rounded-2xl border-2 border-dashed border-suma-purple/40 bg-suma-purple/5 p-4 motion-safe:animate-[enter-scale_var(--dur-panel)_var(--ease-flow)_both]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-suma-purple">Confirmación de ejemplo</p>
              <p className="mt-1 font-display text-xl font-bold">
                {picked.label} · Hoy {picked.time}
              </p>
              <p className="mt-1 text-sm text-suma-navy/70">No se creó ninguna reserva real.</p>
            </div>
          )}
        </div>

        <div className="border-t border-suma-line bg-suma-cream px-4 py-4">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-suma-navy/60">Elige una pregunta</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q) => (
              <button
                key={q.id}
                type="button"
                disabled={stage === "typing"}
                onClick={() => ask(q.id)}
                className="min-h-11 rounded-full border-2 border-suma-navy/15 bg-suma-cream-soft px-4 py-2 text-left text-sm font-bold transition-colors hover:border-suma-navy disabled:opacity-50"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!compact && (
        <aside className="space-y-5 text-suma-cream">
          <p className="text-eyebrow text-suma-orange">Cliente → Chatbot → Reserva</p>
          <ol className="space-y-3">
            {[
              ["Cliente", "Escribe cuando le surge la duda, aunque estés en clase."],
              ["Asistente", "Responde con tu información y muestra horarios disponibles."],
              ["Reserva", "La persona elige y la solicitud queda lista para tu sistema."],
            ].map(([t, d], i) => (
              <li
                key={t}
                className={cn(
                  "flex gap-4 rounded-2xl border p-4 transition-colors duration-[var(--dur-panel)]",
                  (i === 0 && messages.length > 1) || (i === 1 && stage !== "idle") || (i === 2 && stage === "confirmed")
                    ? "border-suma-orange bg-suma-cream/5"
                    : "border-suma-cream/15",
                )}
              >
                <span className="font-display text-xl font-bold text-suma-orange">0{i + 1}</span>
                <span>
                  <span className="block font-bold">{t}</span>
                  <span className="text-sm text-suma-cream/75">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="text-lg text-suma-cream/85">Así podría funcionar una experiencia de reservas conectada con tu negocio.</p>
          <DemoNotice tone="light" />
        </aside>
      )}
    </div>
  );
}
