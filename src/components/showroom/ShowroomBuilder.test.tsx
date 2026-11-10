import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { formatMXN } from "@/lib/pricing";
import { ShowroomBuilder } from "./ShowroomBuilder";

const summary = () => screen.getByRole("list", { name: "Lo que estás eligiendo" });

describe("ShowroomBuilder", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("permite personalizar nombre, elegir demo y añadir un módulo", () => {
    render(<ShowroomBuilder />);
    expect(screen.getByText("Estudio Aurora")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), { target: { value: "Casa Luz" } });
    expect(screen.getByText("Casa Luz")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Chatbot para WhatsApp/i }));
    expect(screen.getByText(/Prueba una conversación de ejemplo/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Añadir a mi propuesta +" }));
    expect(screen.getByRole("status")).toHaveTextContent("Ya está en tu propuesta");
    expect(screen.getByRole("checkbox", { name: "Asistente de WhatsApp con IA" })).toBeChecked();
    expect(within(summary()).getByText("Asistente de WhatsApp con IA")).toBeInTheDocument();
    expect(screen.getAllByText(formatMXN(38600)).length).toBeGreaterThan(0);
  });

  it("no duplica CRM al pasar al paquete Flow, y no eleva la cuota por equipo", () => {
    render(<ShowroomBuilder />);
    expect(screen.getAllByText(formatMXN(13800)).length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText("Personas del equipo"), { target: { value: "50" } });
    expect(screen.getAllByText(formatMXN(13800)).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    expect(screen.getAllByText(formatMXN(13800)).length).toBeGreaterThan(0);
    expect(screen.queryByRole("checkbox", { name: "CRM + seguimiento administrado" })).not.toBeInTheDocument();
    expect(screen.getByText(/Qué incluye SUMA Flow/)).toBeInTheDocument();
  });

  it("desglosa lo que se compra, muestra el IVA y explica qué incluye cada módulo elegido", () => {
    render(<ShowroomBuilder />);
    expect(within(summary()).getByText("CRM + seguimiento administrado")).toBeInTheDocument();
    expect(screen.getByText(/Configurar un CRM existente, un embudo/)).toBeInTheDocument();
    // $13,800 × 1.16
    expect(screen.getByText(formatMXN(16008))).toBeInTheDocument();
    for (const step of ["Descubrimos", "Diseñamos", "Construimos", "Evolucionamos"]) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }
  });

  it("muestra primero los módulos recomendados para el objetivo y permite ver el catálogo completo", () => {
    render(<ShowroomBuilder />);
    // «Responder mejor» → CRM, chatbot con IA y automatización.
    expect(screen.getByRole("checkbox", { name: "Asistente de WhatsApp con IA" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Automatización puntual" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Aplicación móvil a medida" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ver los 13 módulos/ }));
    expect(screen.getByRole("checkbox", { name: "Aplicación móvil a medida" })).toBeInTheDocument();
  });

  it("el periodo del simulador y el de la propuesta son el mismo", () => {
    render(<ShowroomBuilder />);
    fireEvent.click(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "6 m" }));
    expect(screen.getByLabelText("Periodo")).toHaveValue("6");
    expect(screen.getByText("Total SUMA en 6 meses")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Periodo"), { target: { value: "12" } });
    expect(within(screen.getByRole("group", { name: "Periodo a evaluar" })).getByRole("button", { name: "12 m" })).toHaveAttribute("aria-pressed", "true");
  });

  it("genera un enlace WhatsApp con los detalles, pero no envía ni agenda una cita", () => {
    render(<ShowroomBuilder />);
    const href = screen.getByRole("link", { name: /Enviar mi propuesta por WhatsApp/i }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    expect(decodeURIComponent(href!.split("?text=")[1])).toContain("CRM + seguimiento administrado");
    expect(screen.getByText(/Esta solicitud no agenda automáticamente una cita/i)).toBeInTheDocument();
  });

  it("recomienda tres experiencias sin esconder el catálogo completo", () => {
    render(<ShowroomBuilder />);
    expect(screen.getByRole("button", { name: /Chatbot para WhatsApp/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Campañas digitales/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Atraer más clientes" }));
    expect(screen.getByRole("button", { name: /Campañas digitales/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Chatbot para WhatsApp/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ver las 9 demos/i }));
    expect(screen.getByRole("button", { name: /Chatbot para WhatsApp/i })).toBeInTheDocument();
  });
});
