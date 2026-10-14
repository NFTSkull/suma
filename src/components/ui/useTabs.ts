"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

const NEXT = new Set(["ArrowRight", "ArrowDown"]);
const PREV = new Set(["ArrowLeft", "ArrowUp"]);

/** Patrón WAI-ARIA de pestañas con activación automática; flechas en ambos ejes. */
export function useTabs<T extends string>(ids: readonly T[], initial: T = ids[0]) {
  const [active, setActive] = useState<T>(initial);
  const base = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusAt = (index: number) => {
    const id = ids[(index + ids.length) % ids.length];
    setActive(id);
    refs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = ids.indexOf(active);
    let target: number | null = null;
    if (NEXT.has(e.key)) target = i + 1;
    else if (PREV.has(e.key)) target = i - 1;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = ids.length - 1;
    if (target === null) return;
    e.preventDefault();
    focusAt(target);
  };

  const tabId = (id: T) => `${base}-tab-${id}`;
  const panelId = (id: T) => `${base}-panel-${id}`;

  return {
    active,
    setActive,
    listProps: { role: "tablist" as const },
    tabProps: (id: T) => ({
      id: tabId(id),
      role: "tab" as const,
      type: "button" as const,
      "aria-selected": active === id,
      "aria-controls": panelId(id),
      tabIndex: active === id ? 0 : -1,
      onClick: () => setActive(id),
      onKeyDown,
      ref: (el: HTMLButtonElement | null) => {
        refs.current[id] = el;
      },
    }),
    panelProps: (id: T) => ({
      id: panelId(id),
      role: "tabpanel" as const,
      "aria-labelledby": tabId(id),
      tabIndex: 0,
      hidden: active !== id,
    }),
  };
}
