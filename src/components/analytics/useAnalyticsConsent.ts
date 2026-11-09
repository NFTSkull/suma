"use client";

import { useSyncExternalStore } from "react";
import { getConsentSnapshot, getServerConsentSnapshot, subscribeConsent, type ConsentSnapshot } from "@/lib/consent";

/** Elección de medición de la persona. En el servidor y antes de hidratar es `pending`. */
export function useAnalyticsConsent(): ConsentSnapshot {
  return useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);
}
