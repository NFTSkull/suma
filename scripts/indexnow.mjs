#!/usr/bin/env node
/**
 * Notifica a IndexNow (Bing, Yandex, Seznam, Naver…; Google no participa) URLs
 * realmente nuevas, modificadas o eliminadas. No hay endpoint público: se ejecuta
 * a mano o desde CI después de que el despliegue de producción esté activo.
 *
 * Uso:
 *   node scripts/indexnow.mjs /servicios/crm /industrias/spas          # simulación (no envía)
 *   node scripts/indexnow.mjs --changed-since origin/main~1            # rutas de page.tsx cambiadas
 *   node scripts/indexnow.mjs --send /servicios/crm                    # envía
 *
 * Reglas:
 * - Solo URLs del dominio de producción (NEXT_PUBLIC_SITE_URL o https://www.sumastudio.mx).
 * - Cada URL debe estar en el sitemap publicado (nueva/modificada) o responder 404/410 (eliminada).
 * - Nunca envía el sitemap completo por defecto.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.sumastudio.mx").replace(/\/+$/, "");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 100;

const args = process.argv.slice(2);
const send = args.includes("--send");
const sinceIdx = args.indexOf("--changed-since");
const since = sinceIdx >= 0 ? args[sinceIdx + 1] : null;
const inputs = args.filter((a, i) => !a.startsWith("--") && (sinceIdx < 0 || i !== sinceIdx + 1));

function findKey() {
  const dir = path.resolve("public");
  const file = readdirSync(dir).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  if (!file) throw new Error("No hay archivo de clave IndexNow en public/<clave>.txt.");
  const key = readFileSync(path.join(dir, file), "utf8").trim();
  if (`${key}.txt` !== file) throw new Error(`El contenido de public/${file} no coincide con su nombre.`);
  return key;
}

/** Rutas cuyo page.tsx cambió desde `ref` (sin contenido compartido: eso se decide a mano). */
function changedRoutes(ref) {
  const out = execFileSync("git", ["diff", "--name-only", `${ref}...HEAD`, "--", "src/app"], { encoding: "utf8" });
  const routes = [];
  const shared = [];
  for (const file of out.split("\n").filter(Boolean)) {
    const m = file.match(/^src\/app\/(?:(.*)\/)?page\.tsx$/);
    if (m) routes.push(m[1] ? `/${m[1]}` : "/");
    else shared.push(file);
  }
  const content = execFileSync("git", ["diff", "--name-only", `${ref}...HEAD`, "--", "src/content", "src/components"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  if (shared.length || content.length) {
    console.log("Archivos compartidos modificados (elige a mano qué URLs cambiaron de verdad):");
    for (const f of [...shared, ...content]) console.log(`  · ${f}`);
  }
  return routes;
}

const toUrl = (value) => {
  const url = value.startsWith("http") ? value.replace(/\/+$/, "") : `${SITE}${value === "/" ? "" : value.replace(/\/+$/, "")}`;
  if (url !== SITE && !url.startsWith(`${SITE}/`)) throw new Error(`URL fuera del dominio de producción: ${value}`);
  return url;
};

async function main() {
  const candidates = [...new Set([...inputs, ...(since ? changedRoutes(since) : [])].map(toUrl))];
  if (!candidates.length) {
    console.log("Nada que notificar. Indica rutas o usa --changed-since <ref>.");
    return;
  }
  if (candidates.length > MAX_URLS) throw new Error(`Demasiadas URLs (${candidates.length}); IndexNow es para cambios puntuales.`);

  const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => r.text());
  const published = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));

  const accepted = [];
  for (const url of candidates) {
    if (published.has(url)) {
      accepted.push(url);
      console.log(`  ✓ ${url} (publicada)`);
      continue;
    }
    const status = await fetch(url, { method: "HEAD", redirect: "manual" }).then((r) => r.status);
    if (status === 404 || status === 410) {
      accepted.push(url);
      console.log(`  ✓ ${url} (eliminada, ${status})`);
    } else {
      console.log(`  ✗ ${url} no está en el sitemap y responde ${status}; se omite.`);
    }
  }
  if (!accepted.length) return;

  const key = findKey();
  const host = new URL(SITE).host;
  const body = { host, key, keyLocation: `${SITE}/${key}.txt`, urlList: accepted };
  if (!send) {
    console.log(`Simulación: se enviarían ${accepted.length} URL(s). Repite con --send para notificar.`);
    return;
  }
  const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body) });
  console.log(`IndexNow respondió ${res.status} ${res.statusText}`);
  if (res.status >= 400) process.exit(1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
