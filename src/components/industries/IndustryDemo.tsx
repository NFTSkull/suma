"use client";

import { ChatbotDemo } from "@/components/demos/ChatbotDemo";
import { FunnelDemo } from "@/components/demos/FunnelDemo";
import { MobileAppDemo } from "@/components/demos/MobileAppDemo";
import { SpaCrmDemo } from "@/components/demos/SpaCrmDemo";
import type { Industry } from "@/types/content";

export function IndustryDemo({ demo, slug }: { demo: Industry["demo"]; slug: Industry["slug"] }) {
  switch (demo) {
    case "chatbot":
      return <ChatbotDemo />;
    case "crm":
      return <SpaCrmDemo />;
    case "app":
      return <MobileAppDemo />;
    case "funnel":
      return <FunnelDemo initial={slug === "experiencias-retiros" ? "clase" : "producto"} withObjectives />;
  }
}
