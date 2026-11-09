type SiteEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_ENV?: string;
  VERCEL_URL?: string;
};

export type SiteTarget = { url: string; indexable: boolean };

const LOCAL_URL = "http://localhost:3000";
const isLocalHost = (url: string) => /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(url);
const clean = (url: string) => url.trim().replace(/\/+$/, "");

/**
 * URL base del sitio y si el despliegue debe indexarse.
 * - Producción en Vercel: exige `NEXT_PUBLIC_SITE_URL` https sin localhost; si no, el build falla.
 * - Preview/desarrollo en Vercel: su propia URL y siempre no indexable.
 * - Fuera de Vercel: `NEXT_PUBLIC_SITE_URL` o localhost (builds locales y pruebas).
 */
export function resolveSiteTarget(env: SiteEnv): SiteTarget {
  const configured = env.NEXT_PUBLIC_SITE_URL ? clean(env.NEXT_PUBLIC_SITE_URL) : "";

  if (env.VERCEL_ENV === "production") {
    if (!configured || isLocalHost(configured) || !configured.startsWith("https://")) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL debe ser la URL https pública del sitio en producción (p. ej. https://www.sumastudio.mx).",
      );
    }
    return { url: configured, indexable: true };
  }

  if (env.VERCEL_ENV) {
    const own = env.VERCEL_URL ? `https://${clean(env.VERCEL_URL)}` : configured || LOCAL_URL;
    return { url: own, indexable: false };
  }

  return { url: configured || LOCAL_URL, indexable: true };
}
