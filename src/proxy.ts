import { NextResponse, type NextRequest } from "next/server";

/**
 * Las demos de /demo no existen en producción hasta que se autorice publicarlas:
 * responden con la página 404 del sitio. En previews el acceso lo protege Vercel.
 * La página se sigue prerenderizando completa para que `seo-check` la valide.
 */
export function proxy(request: NextRequest) {
  if (process.env.VERCEL_ENV === "production") return NextResponse.rewrite(new URL("/demo-no-disponible", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/demo/:path*"] };
