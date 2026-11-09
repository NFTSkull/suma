import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/content/navigation";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

/** Solo URLs canónicas indexables. Sin `lastModified`: no hay una fecha real de cambio por página. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable) return [];
  return indexableRoutes.map((path) => ({ url: absoluteUrl(path) }));
}
