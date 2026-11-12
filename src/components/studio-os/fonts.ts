import { Fraunces, Inter } from "next/font/google";

/** Tipografías de la demo: Inter para la interfaz y Fraunces para títulos editoriales. */
const sans = Inter({ subsets: ["latin"], variable: "--font-os-sans", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-os-display", weight: ["400", "500", "600"], display: "swap" });

export const osFontClasses = `${sans.variable} ${display.variable}`;
