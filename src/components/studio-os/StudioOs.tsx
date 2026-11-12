"use client";

import { useEffect, useRef, useState } from "react";
import { defaultConfig } from "@/lib/studio-os/catalog";
import { updateConfig } from "@/lib/studio-os/engine";
import { createDemo } from "@/lib/studio-os/seed";
import { loadSession, saveSession } from "@/lib/studio-os/storage";
import type { DemoState, Result, StudioConfig } from "@/lib/studio-os/types";
import { AppShell } from "./AppShell";
import { Configurator } from "./Configurator";

/** Campos que definen los datos de ejemplo; si cambian, la demo se vuelve a generar. */
const structuralKey = (c: StudioConfig) => JSON.stringify([c.type, c.classes, c.instructors, c.rooms, c.capacity, c.plans]);

export default function StudioOs() {
  const [saved] = useState(() => loadSession());
  const [phase, setPhase] = useState<"setup" | "loading" | "app">(saved?.state && saved.phase === "app" ? "app" : "setup");
  const [step, setStep] = useState(saved?.step ?? 1);
  const [config, setConfig] = useState<StudioConfig>(saved?.config ?? defaultConfig());
  const [demo, setDemo] = useState<DemoState | null>(saved?.state ?? null);
  const [baseline, setBaseline] = useState(saved?.baseline ?? null);
  const [logo, setLogo] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; ok: boolean; text: string }[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    saveSession({ phase: phase === "loading" ? "setup" : phase, step, config, state: demo, baseline });
  }, [phase, step, config, demo, baseline]);

  useEffect(() => {
    if (phase !== "loading") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const timer = window.setTimeout(() => setPhase("app"), reduced ? 100 : 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const notify = (ok: boolean, text: string) => {
    const id = ++toastId.current;
    setToasts((list) => [...list.slice(-2), { id, ok, text }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), ok ? 4200 : 6000);
  };
  const apply = (result: Result, options?: { quiet?: boolean }) => {
    if (result.ok) setDemo(result.state);
    if (!result.ok || !options?.quiet) notify(result.ok, result.message);
    return result.ok;
  };

  const enter = () => {
    if (demo && baseline && structuralKey(baseline.config) === structuralKey(config)) {
      // Solo cambió marca, módulos o integraciones: se conservan los datos de la demo.
      setDemo(updateConfig(demo, { name: config.name, theme: config.theme, modules: config.modules }).state);
      setBaseline({ config, now: baseline.now });
    } else {
      const now = new Date().toISOString();
      setDemo(createDemo(config, now));
      setBaseline({ config, now });
    }
    setPhase("loading");
  };
  const restore = () => {
    if (!baseline) return;
    setDemo(createDemo(baseline.config, baseline.now));
    notify(true, "Demostración restaurada: todo volvió a como estaba al entrar.");
  };
  const exit = () => {
    if (demo) setConfig((c) => ({ ...c, name: demo.config.name, theme: demo.config.theme, modules: demo.config.modules }));
    setPhase("setup");
    window.setTimeout(() => document.getElementById("configurador")?.scrollIntoView({ block: "start" }), 0);
  };

  return (
    <>
      <Configurator config={config} setConfig={setConfig} step={step} setStep={setStep} logo={logo} setLogo={setLogo} onEnter={enter} hasStudio={!!demo && phase === "setup" && !!baseline && structuralKey(baseline.config) === structuralKey(config)} />
      {phase === "loading" && (
        <div role="status" aria-live="polite" aria-label="Preparando tu estudio" className="fixed inset-0 z-[100] grid place-items-center bg-[#FBF8F5] px-6 text-center">
          <div className="os-fade mx-auto flex max-w-sm flex-col items-center gap-5">
            <div className="relative grid size-20 place-items-center rounded-[1.75rem] border border-[#D8CEC3] bg-white shadow-[0_16px_35px_-24px_rgba(28,29,23,0.25)]">
              <span className="size-10 rounded-full border-[3px] border-[#E9DED4] border-t-[#A4502F] motion-safe:animate-spin" aria-hidden="true" />
            </div>
            <div>
              <p className="os-display text-[2rem] leading-tight text-[#292E28]">Preparando tu estudio</p>
              <p className="mt-2 text-sm text-[#6C6E69]">Personalizando tu agenda, alumnas y membresías con datos de ejemplo.</p>
            </div>
            <span className="rounded-full border border-[#D8CEC3] bg-white px-3 py-1.5 text-xs font-semibold text-[#4A514B]">Todo es una demostración · Sin información real</span>
          </div>
        </div>
      )}
      {phase === "app" && demo && (
        <AppShell state={demo} apply={apply} logo={logo} onRestore={restore} onExit={exit} toasts={toasts}
          dismissToast={(id) => setToasts((list) => list.filter((t) => t.id !== id))} />
      )}
    </>
  );
}
