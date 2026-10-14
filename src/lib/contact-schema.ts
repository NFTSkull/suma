import { z } from "zod";

export const businessTypeOptions = [
  { id: "yoga-pilates", label: "Yoga, Pilates o Barre" },
  { id: "spa", label: "Spa o centro de bienestar" },
  { id: "fitness", label: "Fitness boutique" },
  { id: "marca", label: "Marca o tienda wellness" },
  { id: "retiros", label: "Experiencias y retiros" },
  { id: "profesional", label: "Profesional independiente" },
  { id: "otro", label: "Otro" },
] as const;

export const serviceInterestOptions = [
  { id: "chatbots", label: "Chatbots" },
  { id: "crm", label: "CRM" },
  { id: "aplicaciones-moviles", label: "Aplicaciones móviles" },
  { id: "paginas-web", label: "Página web" },
  { id: "publicidad-digital", label: "Publicidad digital" },
  { id: "no-se", label: "Aún no lo sé" },
] as const;

type Ids<T extends readonly { id: string }[]> = T[number]["id"];
const ids = <T extends readonly { id: string }[]>(opts: T) =>
  opts.map((o) => o.id) as [Ids<T>, ...Ids<T>[]];

export const BusinessType = z.enum(ids(businessTypeOptions), {
  error: "Elige el tipo de negocio.",
});
export const ServiceInterest = z.enum(ids(serviceInterestOptions));

const slug = z
  .string()
  .max(40)
  .regex(/^[a-z0-9-]*$/);

export const contactSchema = z.object({
  nombre: z
    .string({ error: "Escribe tu nombre." })
    .trim()
    .min(2, { error: "Escribe tu nombre." })
    .max(80, { error: "El nombre es demasiado largo." }),
  negocio: z
    .string({ error: "Escribe el nombre de tu negocio." })
    .trim()
    .min(2, { error: "Escribe el nombre de tu negocio." })
    .max(120, { error: "El nombre del negocio es demasiado largo." }),
  tipoNegocio: BusinessType,
  email: z
    .string({ error: "Escribe tu correo electrónico." })
    .trim()
    .toLowerCase()
    .max(160, { error: "El correo es demasiado largo." })
    .pipe(z.email({ error: "Revisa tu correo electrónico; parece incompleto." })),
  whatsapp: z
    .string({ error: "Escribe tu número de WhatsApp." })
    .transform((v) => v.replace(/[\s\-().+]/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{10,15}$/, { error: "Escribe un número de 10 dígitos (puedes incluir lada internacional)." }),
    ),
  servicios: z
    .array(ServiceInterest, { error: "Elige al menos un servicio." })
    .min(1, { error: "Elige al menos un servicio." })
    .max(6)
    .transform((list) => Array.from(new Set(list))),
  mensaje: z
    .string()
    .trim()
    .max(1500, { error: "El mensaje puede tener hasta 1500 caracteres." })
    .optional()
    .transform((v) => (v ? v : undefined)),
  privacidad: z.literal(true, { error: "Necesitamos tu consentimiento para responderte." }),
  contexto: z
    .object({ negocio: slug.optional(), reto: slug.optional() })
    .strict()
    .optional(),
});

/** Campos técnicos anti-spam: se validan aparte para no mezclarlos con los datos del usuario. */
export const antiSpamSchema = z.object({
  sitio: z.string().max(200).optional().default(""),
  inicio: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Tiempo mínimo razonable para que una persona complete el formulario. */
export const MIN_FILL_MS = 2500;
