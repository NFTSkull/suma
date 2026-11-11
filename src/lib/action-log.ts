export type ActionLogEntry = {
  action: "contact.submit" | "showroom_lead.submit";
  outcome:
    | "delivered"
    | "invalid_json"
    | "validation_failed"
    | "spam_discarded"
    | "rate_limited"
    | "not_configured"
    | "delivery_failed";
  provider?: "webhook" | "resend";
  /** Motivo de `not_configured` (nombre del problema, nunca el valor de la variable). */
  reason?: string;
  /** Código HTTP del proveedor cuando falla la entrega. */
  providerStatus?: number;
  /** Id del correo aceptado por Resend, para rastrearlo en su panel. */
  providerId?: string;
  servicios?: string[];
  tipoNegocio?: string;
  fromSelector?: boolean;
  fromShowroom?: boolean;
  hasConfig?: boolean;
  wantsDemoPersonalizada?: boolean;
};

/**
 * Registro estructurado de acciones. Nunca incluye datos personales
 * (nombre, correo, teléfono o mensaje).
 */
export function actionLog(entry: ActionLogEntry): void {
  const line = JSON.stringify({ type: "action_log", at: new Date().toISOString(), ...entry });
  if (entry.outcome === "delivery_failed") console.error(line);
  else console.info(line);
}
