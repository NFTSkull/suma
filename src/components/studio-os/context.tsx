"use client";

import { createContext, useContext } from "react";
import type { DemoState, Result, ViewId } from "@/lib/studio-os/types";
import { capabilitiesOf, termsOf, type Terms } from "@/lib/studio-os/verticals";

export type StudioContext = {
  state: DemoState;
  /** Aplica el resultado del motor: actualiza el estado si fue válido y muestra el mensaje. */
  apply: (result: Result, options?: { quiet?: boolean }) => boolean;
  /** Navega a otra sección; `target` abre un elemento (alumna, clase…). */
  go: (view: ViewId, target?: string) => void;
  target: string | null;
  logo: string | null;
};

const Ctx = createContext<StudioContext | null>(null);
export const StudioProvider = Ctx.Provider;
export function useStudio(): StudioContext & { t: Terms; caps: ReturnType<typeof capabilitiesOf> } {
  const value = useContext(Ctx);
  if (!value) throw new Error("useStudio fuera de StudioProvider");
  return { ...value, t: termsOf(value.state.config), caps: capabilitiesOf(value.state.config) };
}
