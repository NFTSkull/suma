"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { defaultConfig, studioDisplayName } from "@/lib/studio-os/catalog";
import { updateConfig } from "@/lib/studio-os/engine";
import { createDemo } from "@/lib/studio-os/seed";
import { loadSession, saveSession, type SavedSession } from "@/lib/studio-os/storage";
import type { DemoState, Result, StudioConfig } from "@/lib/studio-os/types";
import { AppShell } from "./AppShell";
import { Configurator } from "./Configurator";
import { osFontClasses } from "./fonts";
import { structuralKey, usePreviewState } from "./LivePreview";
import { ease } from "./motion";
import { Reveal } from "./Reveal";
import { cx, themeStyle } from "./ui";
import { Welcome } from "./Welcome";

type Phase = SavedSession["phase"] | "reveal";

export default function StudioOs() {
  const [saved] = useState(() => loadSession());
  const [phase, setPhase] = useState<Phase>(saved?.state && saved.phase === "app" ? "app" : saved?.phase === "setup" ? "setup" : "welcome");
  const [step, setStep] = useState(saved?.step ?? 1);
  const [config, setConfig] = useState<StudioConfig>(saved?.config ?? defaultConfig());
  const [demo, setDemo] = useState<DemoState | null>(saved?.state ?? null);
  const [baseline, setBaseline] = useState(saved?.baseline ?? null);
  const [logo, setLogo] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; ok: boolean; text: string }[]>([]);
  const [previewNow] = useState(() => new Date().toISOString());
  const toastId = useRef(0);
  const preview = usePreviewState(config, baseline && structuralKey(baseline.config) === structuralKey(config) ? baseline.now : previewNow);

  useEffect(() => {
    saveSession({ phase: phase === "reveal" ? "app" : phase, step, config, state: demo, baseline });
  }, [phase, step, config, demo, baseline]);

  // La demo ocupa toda la pantalla: el sitio de fondo no se desplaza ni recibe foco.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [...document.querySelectorAll<HTMLElement>("body > header, #contenido, body > footer")];
    background.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      document.body.style.overflow = previous;
      background.forEach((el) => el.removeAttribute("inert"));
    };
  }, []);

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

  const sameStudio = !!demo && !!baseline && structuralKey(baseline.config) === structuralKey(config);
  const enter = () => {
    if (demo && baseline && sameStudio) {
      // Solo cambió marca o módulos: se conservan los datos de la demo.
      setDemo(updateConfig(demo, { name: config.name, theme: config.theme, modules: config.modules }).state);
      setBaseline({ config, now: baseline.now });
      setPhase("app");
    } else {
      // Mismo reloj que la vista previa: el sistema es exactamente el que se vio tomar forma.
      setDemo(createDemo(config, previewNow));
      setBaseline({ config, now: previewNow });
      setPhase("reveal");
    }
  };
  const restore = () => {
    if (!baseline) return;
    setDemo(createDemo(baseline.config, baseline.now));
    notify(true, "Demostración restaurada: todo volvió a como estaba al entrar.");
  };
  const exit = () => {
    if (demo) setConfig((c) => ({ ...c, name: demo.config.name, theme: demo.config.theme, modules: demo.config.modules }));
    setPhase("setup");
  };

  const theme = phase === "app" && demo ? demo.config.theme : config.theme;
  const screen =
    phase === "welcome" ? <Welcome onStart={() => setPhase("setup")} resume={step > 1 || !!config.name} /> :
    phase === "setup" ? <Configurator config={config} setConfig={setConfig} step={step} setStep={setStep} logo={logo} setLogo={setLogo} onEnter={enter} onHome={() => setPhase("welcome")} hasStudio={sameStudio} preview={preview} /> :
    phase === "reveal" ? <Reveal config={config} logo={logo} onDone={() => setPhase("app")} /> :
    demo ? <AppShell state={demo} apply={apply} logo={logo} onRestore={restore} onExit={exit} toasts={toasts} dismissToast={(id) => setToasts((list) => list.filter((t) => t.id !== id))} /> : null;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <div role="region" aria-label={`${studioDisplayName(config)} · SUMA Studio OS`} className={cx(osFontClasses, "os-root fixed inset-0 z-[80] overflow-hidden transition-colors duration-500", phase === "welcome" || phase === "reveal" ? "bg-(--os-night)" : "bg-(--os-ivory)")} style={themeStyle(theme)}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={phase === "reveal" ? "reveal" : phase} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }}>
            {screen}
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>,
    document.body,
  );
}
