#!/usr/bin/env node
/**
 * Validación SEO posterior a `next build` (se ejecuta como `postbuild`).
 * Revisa el HTML prerenderizado, el sitemap y robots.txt de `.next/server/app`.
 *
 * Falla (exit 1) ante: URLs a localhost con un dominio público configurado, canonical
 * ausente/duplicada/relativa o distinta de la URL de la página, og:url/og:image
 * inválidas, JSON-LD que no parsea o con @id sin resolver, más de un H1, sitemap con
 * URLs no canónicas o páginas noindex, y robots.txt sin el sitemap correcto.
 * Longitudes de title/description solo generan avisos.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const APP_DIR = path.resolve(".next/server/app");
const LOCAL = "http://localhost:3000";
const vercelEnv = process.env.VERCEL_ENV;
const errors = [];
const warnings = [];
let pageCount = 0;
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

if (!existsSync(APP_DIR)) {
  console.error("seo-check: no existe .next/server/app; ejecuta `next build` primero.");
  process.exit(1);
}

const read = (rel) => readFileSync(path.join(APP_DIR, rel), "utf8");
const sitemapXml = existsSync(path.join(APP_DIR, "sitemap.xml.body")) ? read("sitemap.xml.body") : "";
const robotsTxt = existsSync(path.join(APP_DIR, "robots.txt.body")) ? read("robots.txt.body") : "";
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

// Previews de Vercel: deben bloquear todo y no publicar sitemap.
if (vercelEnv && vercelEnv !== "production") {
  if (!/Disallow:\s*\/\s*$/m.test(robotsTxt)) fail("preview: robots.txt debe incluir `Disallow: /`.");
  if (sitemapUrls.length) fail(`preview: el sitemap debe estar vacío (tiene ${sitemapUrls.length} URLs).`);
  report();
}

const base = (process.env.NEXT_PUBLIC_SITE_URL || LOCAL).trim().replace(/\/+$/, "");
const publicBase = !/localhost|127\.0\.0\.1/.test(base);
if (vercelEnv === "production" && !base.startsWith("https://")) fail(`producción: la URL base debe ser https (${base}).`);

/* ─────────────── Páginas prerenderizadas ─────────────── */
function htmlFiles(dir, prefix = "") {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full, `${prefix}/${name}`));
    else if (name.endsWith(".html") && !name.startsWith("_")) out.push(`${prefix}/${name}`);
  }
  return out;
}

const routeOf = (file) => (file === "/index.html" ? "/" : file.replace(/\.html$/, ""));
const urlOf = (route) => `${base}${route === "/" ? "" : route}`;
const attr = (head, re) => [...head.matchAll(re)].map((m) => m[1]);
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const pages = htmlFiles(APP_DIR).map((file) => {
  const html = read(file.slice(1));
  const route = routeOf(file);
  const [head = "", body = ""] = html.split("</head>");
  return { file, route, html, head, body };
});
pageCount = pages.length;
if (!pages.length) fail("no se encontró HTML prerenderizado.");

const indexable = new Set();
for (const { route, html, head, body } of pages) {
  const where = `[${route}]`;
  const expected = urlOf(route);

  if (publicBase && /localhost|127\.0\.0\.1/.test(html)) fail(`${where} contiene una URL a localhost.`);

  const robots = attr(head, /<meta name="robots" content="([^"]*)"/g).join(",");
  const noindex = /noindex/.test(robots);
  if (!noindex) indexable.add(expected);

  const canonicals = attr(head, /<link rel="canonical" href="([^"]*)"/g);
  if (canonicals.length !== 1) fail(`${where} debe tener exactamente una canonical (tiene ${canonicals.length}).`);
  else if (decode(canonicals[0]) !== expected) fail(`${where} canonical ${canonicals[0]} ≠ ${expected}.`);

  const ogUrl = attr(head, /<meta property="og:url" content="([^"]*)"/g);
  if (ogUrl.length !== 1 || decode(ogUrl[0]) !== expected) fail(`${where} og:url debe ser ${expected} (es ${ogUrl.join(", ") || "—"}).`);

  for (const key of ["og:image", "twitter:image"]) {
    const re = key.startsWith("og") ? /<meta property="og:image" content="([^"]*)"/g : /<meta name="twitter:image" content="([^"]*)"/g;
    const imgs = attr(head, re);
    if (!imgs.length) fail(`${where} sin ${key}.`);
    for (const img of imgs) if (!decode(img).startsWith(`${base}/`)) fail(`${where} ${key} no es absoluta al dominio: ${img}.`);
  }

  const titles = attr(head, /<title>([^<]*)<\/title>/g);
  if (titles.length !== 1) fail(`${where} debe tener un <title> en <head> (tiene ${titles.length}).`);
  else if (decode(titles[0]).length > 70) warn(`${where} title de ${decode(titles[0]).length} caracteres: "${decode(titles[0])}".`);

  const desc = attr(head, /<meta name="description" content="([^"]*)"/g);
  if (desc.length !== 1) fail(`${where} debe tener una meta description.`);
  else {
    const len = decode(desc[0]).length;
    if (len < 70 || len > 160) warn(`${where} description de ${len} caracteres.`);
  }

  const h1 = (body.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(`${where} debe tener un solo <h1> (tiene ${h1}).`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length !== 1) fail(`${where} debe tener un único bloque JSON-LD (tiene ${blocks.length}).`);
  for (const raw of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      fail(`${where} JSON-LD inválido.`);
      continue;
    }
    const graph = data["@graph"];
    if (data["@context"] !== "https://schema.org" || !Array.isArray(graph)) {
      fail(`${where} JSON-LD sin @context schema.org o sin @graph.`);
      continue;
    }
    const defined = new Set(graph.map((n) => n["@id"]).filter(Boolean));
    const walk = (v) => {
      if (Array.isArray(v)) return v.forEach(walk);
      if (v && typeof v === "object") {
        if (v["@id"]) defined.add(v["@id"]);
        Object.values(v).forEach(walk);
      }
    };
    walk(graph);
    const refs = [];
    const collect = (v) => {
      if (Array.isArray(v)) return v.forEach(collect);
      if (v && typeof v === "object") {
        const keys = Object.keys(v);
        if (keys.length === 1 && keys[0] === "@id") refs.push(v["@id"]);
        else Object.values(v).forEach(collect);
      }
    };
    collect(graph);
    // Los Service de otras páginas se referencian por @id sin repetirse; deben ser URLs del sitio.
    for (const ref of refs) if (!defined.has(ref) && !ref.startsWith(`${base}/`)) fail(`${where} JSON-LD referencia un @id externo: ${ref}.`);
    const types = graph.map((n) => n["@type"]);
    for (const t of ["Organization", "WebSite"]) if (!types.includes(t)) fail(`${where} JSON-LD sin ${t}.`);
    const page = graph.find((n) => typeof n["@type"] === "string" && n["@type"].endsWith("Page") && n["@type"] !== "FAQPage");
    if (!page) fail(`${where} JSON-LD sin nodo WebPage.`);
    else if (page.url !== expected) fail(`${where} WebPage.url ${page.url} ≠ ${expected}.`);
    for (const n of graph.filter((n) => n["@type"] === "FAQPage")) {
      for (const q of n.mainEntity || []) {
        if (!body.includes(q.name.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")) && !body.includes(q.name)) {
          fail(`${where} FAQPage con pregunta no visible: "${q.name}".`);
        }
      }
    }
  }
}

/* ─────────────── Sitemap ─────────────── */
if (!sitemapUrls.length) fail("sitemap.xml vacío o ausente.");
const seen = new Set();
for (const url of sitemapUrls) {
  if (seen.has(url)) fail(`sitemap: URL duplicada ${url}.`);
  seen.add(url);
  if (!url.startsWith(base)) fail(`sitemap: ${url} no usa ${base}.`);
  if (url.includes("/api/")) fail(`sitemap: incluye un endpoint (${url}).`);
  if (!indexable.has(url)) fail(`sitemap: ${url} no es una página indexable prerenderizada.`);
}
for (const url of indexable) if (!seen.has(url)) fail(`sitemap: falta la página indexable ${url}.`);
if (/<lastmod>/.test(sitemapXml)) warn("sitemap: incluye <lastmod>; debe reflejar cambios reales.");

/* ─────────────── robots.txt ─────────────── */
if (!robotsTxt.includes(`Sitemap: ${base}/sitemap.xml`)) fail(`robots.txt debe declarar Sitemap: ${base}/sitemap.xml.`);
if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) fail("robots.txt bloquea todo el sitio en un build indexable.");
if (!/Disallow:\s*\/api\//.test(robotsTxt)) fail("robots.txt debe bloquear /api/.");

report();

function report() {
  for (const w of warnings) console.warn(`seo-check ⚠ ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`seo-check ✗ ${e}`);
    console.error(`seo-check: ${errors.length} error(es).`);
    process.exit(1);
  }
  if (vercelEnv && vercelEnv !== "production") console.log("seo-check ✓ preview no indexable (robots bloquea todo y el sitemap está vacío).");
  else console.log(`seo-check ✓ ${pageCount} páginas, ${sitemapUrls.length} URLs en sitemap, base ${base}.`);
  process.exit(0);
}
