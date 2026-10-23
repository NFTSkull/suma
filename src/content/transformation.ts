/** Contenido de la transformación "Antes → Con SUMA" del manifiesto de la home. */
export type TransformationRow = { number: string; before: string; after: string };

export const transformation = {
  eyebrow: "Una forma más simple de trabajar",
  labels: { before: "Antes", after: "Con SUMA" },
  rows: [
    { number: "01", before: "Mensajes sin responder.", after: "Atención más ágil." },
    { number: "02", before: "Reservas por organizar.", after: "Reservas en orden." },
    { number: "03", before: "Tareas repetitivas.", after: "Más tiempo para tus clientes." },
  ] satisfies TransformationRow[],
} as const;
