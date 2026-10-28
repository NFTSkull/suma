import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { crearClientePrecalix, PrecalixApiError } from "./cliente.mjs";

const key = "pcx_b2b_" + "a".repeat(43);
const uuid = "d5f2462d-a100-4d58-8f1d-46734479eb20";

describe("Ejemplo Node B2B — sin red ni consultas reales", () => {
  it("no permite credencial ausente ni HTTP", () => {
    assert.throws(() => crearClientePrecalix(), /servidor/);
    assert.throws(() => crearClientePrecalix({apiKey:key,baseUrl:"http://precalix.app"}), /HTTPS/);
  });

  it("envia la solicitud POST y consulta resultado sin NSS en URL", async () => {
    const llamadas = [];
    const fetchImpl = async (url, init) => {
      llamadas.push({url:String(url),method:init.method,headers:init.headers,body:init.body});
      if (init.method==="POST") {
        return Response.json({ precalificacion: {
          id:uuid, estado:"pendiente", en_proceso:true,
          consulta_url:"/api/v1/precalificaciones/"+uuid,
        } }, {status:202});
      }
      return Response.json({precalificacion:{id:uuid,estado:"exitosa",resultado:{saldo_subcuenta:1000}}});
    };
    const cliente = crearClientePrecalix({apiKey:key,fetchImpl});
    const resp = await cliente.solicitar({
      nss:"00000000000",idempotencyKey:uuid,consentimientoRef:"consent_demo123",
    });
    assert.equal(resp.precalificacion.en_proceso,true);
    const result = await cliente.consultar(uuid);
    assert.equal(result.precalificacion.resultado.saldo_subcuenta,1000);
    assert.equal(llamadas.length,2);
    assert.equal(llamadas[0].url,"https://precalix.app/api/v1/precalificaciones");
    assert.equal(llamadas[1].url,"https://precalix.app/api/v1/precalificaciones/"+uuid);
    assert.equal(llamadas[0].headers.Authorization,"Bearer "+key);
    assert.equal(JSON.parse(llamadas[0].body).consentimiento,true);
    assert.ok(!llamadas[0].url.includes("00000000000"));
    assert.ok(!llamadas[1].url.includes("00000000000"));
  });

  it("rechaza NSS, UUID o consentimiento invalidos antes de llamar a internet", async () => {
    let llamadas=0;
    const c=crearClientePrecalix({apiKey:key,fetchImpl:async()=>{llamadas++;throw Error("no");}});
    await assert.rejects(c.solicitar({nss:"123",idempotencyKey:uuid,consentimientoRef:"consent_demo123"}),/NSS/);
    await assert.rejects(c.solicitar({nss:"00000000000",idempotencyKey:"no",consentimientoRef:"consent_demo123"}),/UUID/);
    await assert.rejects(c.solicitar({nss:"00000000000",idempotencyKey:uuid,consentimientoRef:"nombre cliente"}),/referencia/);
    assert.equal(llamadas,0);
  });


  it("permite alternar modo sandbox sin cambiar las llamadas ni aceptar clave real", async () => {
    const token = "pcx_test_" + "t".repeat(43);
    const urls = [];
    const c = crearClientePrecalix({
      apiKey: token, modo: "sandbox",
      fetchImpl: async (url) => {
        urls.push(String(url));
        return Response.json({ sandbox: true, precalificacion: { id: uuid } }, {status:202});
      },
    });
    await c.solicitar({nss:"00000000000",idempotencyKey:uuid,consentimientoRef:"consent_demo123"});
    await c.consultar(uuid);
    assert.deepEqual(urls, [
      "https://precalix.app/api/v1/sandbox/precalificaciones",
      "https://precalix.app/api/v1/sandbox/precalificaciones/"+uuid,
    ]);
    assert.throws(()=>crearClientePrecalix({apiKey:key,modo:"sandbox"}),/clave API/);
    assert.throws(()=>crearClientePrecalix({apiKey:token,modo:"real"}),/clave API/);
  });

  it("interpreta codigo y Retry-After de indisponibilidad, sin volcar cuerpos", async () => {
    const c = crearClientePrecalix({apiKey:key,fetchImpl:async()=>Response.json({
      error:{codigo:"COLA_OCUPADA",detalle:"datos privados no deben aparecer"},
    },{status:503,headers:{"Retry-After":"60"}})});
    await assert.rejects(c.cuenta(),e=>
      e instanceof PrecalixApiError && e.codigo==="COLA_OCUPADA"
      && e.status===503 && e.reintentarSegundos===60
      && !e.message.includes("datos privados"));
  });
});
