/**
 * Ejemplo portable para integrar Precalix en el BACKEND de un socio B2B.
 * Node.js 20+ y fetch nativo: NO requiere paquetes npm ni Supabase SDK.
 * No guardar ni imprimir NSS, API keys o respuestas crudas en logs.
 *
 * La API todavía no está habilitada para terceros.
 */
export class PrecalixApiError extends Error {
  constructor(codigo, status, reintentarSegundos = null) {
    super(codigo);
    this.name = "PrecalixApiError";
    this.codigo = codigo;
    this.status = status;
    this.reintentarSegundos = reintentarSegundos;
  }
}

export function crearClientePrecalix({
  apiKey,
  baseUrl = "https://precalix.app",
  modo = "real",
  fetchImpl = fetch,
} = {}) {
  if (modo !== "real" && modo !== "sandbox") throw new Error("Modo de API no soportado");
  const patron = modo === "sandbox" ? /^pcx_test_[A-Za-z0-9_-]{43}$/ : /^pcx_b2b_[A-Za-z0-9_-]{43}$/;
  if (typeof apiKey !== "string" || !patron.test(apiKey)) {
    throw new Error("Configura la clave API privada correspondiente al modo solamente en tu servidor");
  }
  const base = new URL(baseUrl);
  if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash) {
    throw new Error("La direccion de la API debe usar HTTPS sin credenciales");
  }
  const raiz = new URL(modo === "sandbox" ? "/api/v1/sandbox/" : "/api/v1/", base);
  const headers = {
    Authorization: "Bearer " + apiKey,
    Accept: "application/json",
  };

  async function peticion(metodo, ruta, datos) {
    // Timeout finito para la llamada HTTP; NO espera al portal externo.
    const respuesta = await fetchImpl(new URL(ruta, raiz), {
      method: metodo,
      headers: { ...headers, ...(datos ? { "Content-Type": "application/json" } : {}) },
      ...(datos ? { body: JSON.stringify(datos) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const tipo = respuesta.headers.get("content-type") ?? "";
    let json;
    if (tipo.includes("application/json")) {
      try { json = await respuesta.json(); } catch { /* respuesta invalida */ }
    }
    if (!respuesta.ok) {
      const codigo = typeof json?.error?.codigo === "string"
        ? json.error.codigo : "SERVICIO_NO_DISPONIBLE";
      const retry = Number(respuesta.headers.get("retry-after"));
      throw new PrecalixApiError(
        codigo, respuesta.status, Number.isFinite(retry) && retry > 0 ? retry : null,
      );
    }
    if (!json || typeof json !== "object") {
      throw new PrecalixApiError("RESPUESTA_INVALIDA", 502);
    }
    return json;
  }

  return Object.freeze({
    async cuenta() {
      return peticion("GET", "cuenta");
    },
    async solicitar({ nss, idempotencyKey, consentimientoRef }) {
      if (!/^\d{11}$/.test(nss)) throw new Error("NSS invalido");
      if (!/^[A-Za-z0-9_-]{6,80}$/.test(consentimientoRef)) {
        throw new Error("Se requiere referencia opaca del consentimiento");
      }
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
        throw new Error("Se requiere UUID de idempotencia persistido por el socio");
      }
      return peticion("POST", "precalificaciones", {
        nss,
        idempotency_key: idempotencyKey,
        producto: "mejora",
        consentimiento: true,
        evidencia_consentimiento: consentimientoRef,
      });
    },
    async consultar(id) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error("Identificador de precalificacion invalido");
      }
      return peticion("GET", "precalificaciones/" + id);
    },
  });
}
