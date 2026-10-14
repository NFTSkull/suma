import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { cn } from "@/lib/cn";
import { breadcrumbJsonLd } from "@/lib/seo";

type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Ruta de navegación" className="text-sm">
        <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", tone === "light" ? "text-suma-cream/70" : "text-suma-navy/65")}>
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className={cn("font-bold", tone === "light" ? "text-suma-cream" : "text-suma-navy")}>
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="inline-flex min-h-8 items-center underline-offset-4 hover:underline">
                      {item.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
