import type { SumaColor } from "@/types/content";

export type ProcessStep = {
  number: string;
  title: string;
  text: string;
  color: SumaColor;
  details: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Descubrimos",
    text: "Escuchamos cómo funciona tu negocio, qué necesitas y qué te gustaría mejorar.",
    color: "orange",
    details: [
      "Conversación inicial sobre tu operación y tus objetivos.",
      "Revisión de las herramientas que ya usas.",
      "Identificación de lo que conviene resolver primero.",
    ],
  },
  {
    number: "02",
    title: "Diseñamos",
    text: "Convertimos tus necesidades en una propuesta clara, visual y funcional.",
    color: "pink",
    details: [
      "Propuesta de alcance y prioridades por etapas.",
      "Flujos y prototipos para validar antes de construir.",
      "Dirección visual alineada a tu marca.",
    ],
  },
  {
    number: "03",
    title: "Construimos",
    text: "Desarrollamos y conectamos las herramientas que forman parte de tu solución.",
    color: "purple",
    details: [
      "Desarrollo por entregas que puedes revisar.",
      "Pruebas con tu equipo en escenarios reales.",
      "Capacitación y documentación para tu operación.",
    ],
  },
  {
    number: "04",
    title: "Evolucionamos",
    text: "Revisamos lo que funciona y buscamos oportunidades para seguir mejorando.",
    color: "navy",
    details: [
      "Revisión de uso y resultados con información real.",
      "Ajustes y mejoras continuas.",
      "Nuevas piezas cuando tu negocio las necesita.",
    ],
  },
];
