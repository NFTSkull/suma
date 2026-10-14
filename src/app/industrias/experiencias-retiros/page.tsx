import type { Metadata } from "next";
import { IndustryPage } from "@/components/industries/IndustryPage";
import { getIndustry } from "@/content/industries";
import { buildMetadata } from "@/lib/seo";

const industry = getIndustry("experiencias-retiros");

export const metadata: Metadata = buildMetadata({ ...industry.seo, path: industry.href });

export default function Page() {
  return <IndustryPage slug="experiencias-retiros" />;
}
