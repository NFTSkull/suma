import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { formatMXN } from "@/lib/pricing";
import { ShowroomBuilder } from "./ShowroomBuilder";

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
    fireEvent.click(screen.getByRole("button", { name: /Añadir esta experiencia a mi propuesta/i }));
    expect(screen.getByRole("checkbox", { name: "Asistente de WhatsApp con IA" })).toBeChecked();
    expect(screen.getByText(formatMXN(38600))).toBeInTheDocument();
  });

  it("no duplica CRM al pasar al paquete Flow, y no eleva la cuota por equipo", () => {
    render(<ShowroomBuilder />);
    const before = screen.getByText(formatMXN(13800));
    expect(before).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Personas del equipo"), { target: { value: "50" } });
    expect(screen.getByText(formatMXN(13800))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Paquete + extras" }));
    expect(screen.getByText(formatMXN(13800))).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "CRM + seguimiento administrado" })).not.toBeInTheDocument();
  });

  it("genera un enlace WhatsApp con los detalles, pero no envía ni agenda una cita", () => {
    render(<ShowroomBuilder />);
    const href = screen.getByRole("link", { name: /Enviar mi configuración por WhatsApp/i }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/528114688882\?text=/);
    expect(decodeURIComponent(href!.split("?text=")[1])).toContain("CRM + seguimiento administrado");
    expect(screen.getByText(/Esta solicitud no agenda automáticamente una cita/i)).toBeInTheDocument();
  });
});
