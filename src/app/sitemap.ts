import type { MetadataRoute } from "next";
import { allRoutes } from "@/content/navigation";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.7 : 0.8,
  }));
}
