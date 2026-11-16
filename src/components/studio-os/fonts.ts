import { Fraunces, Geist } from "next/font/google";

/**
 * Tipografías de la demo: Geist para la interfaz (precisa, neutra) y Fraunces
 * variable para la voz editorial (eje SOFT para un trazo cálido, itálica para acentos).
 */
const sans = Geist({ subsets: ["latin"], variable: "--font-os-sans", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-os-display", style: ["normal", "italic"], axes: ["SOFT", "opsz"], display: "swap" });

export const osFontClasses = `${sans.variable} ${display.variable}`;
