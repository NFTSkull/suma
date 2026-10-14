export type ActionLogEntry = {
  action: "contact.submit";
  outcome:
    | "delivered"
    | "invalid_json"
    | "validation_failed"
    | "spam_discarded"
    | "rate_limited"
    | "not_configured"
    | "delivery_failed";
  provider?: "webhook" | "resend";
  servicios?: string[];
  tipoNegocio?: string;
  fromSelector?: boolean;
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
