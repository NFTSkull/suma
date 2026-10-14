"use client";

import { ChatbotDemo } from "@/components/demos/ChatbotDemo";
import { FunnelDemo } from "@/components/demos/FunnelDemo";
import { MobileAppDemo } from "@/components/demos/MobileAppDemo";
import { SpaCrmDemo } from "@/components/demos/SpaCrmDemo";
import { WebConceptGallery } from "@/components/demos/WebConceptGallery";
import type { ServiceSlug } from "@/types/content";

export function ServiceShowcase({ slug }: { slug: ServiceSlug }) {
  switch (slug) {
    case "chatbots":
      return <ChatbotDemo />;
    case "crm":
      return <SpaCrmDemo />;
    case "aplicaciones-moviles":
      return <MobileAppDemo />;
    case "paginas-web":
      return <WebConceptGallery />;
    case "publicidad-digital":
      return <FunnelDemo withObjectives initial="clase" />;
  }
}
