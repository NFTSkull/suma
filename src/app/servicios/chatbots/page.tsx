import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { getService } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

const service = getService("chatbots");

export const metadata: Metadata = buildMetadata({ ...service.seo, path: service.href });

export default function Page() {
  return <ServicePage slug="chatbots" />;
}
