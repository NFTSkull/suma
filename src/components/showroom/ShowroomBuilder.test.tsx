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
  });

  it("genera un enlace WhatsApp con los detalles, pero no envía ni agenda una cita", () => {
    render(<ShowroomBuilder />);
    const href = screen.getByRole("link", { name: /Enviar mi configuración por WhatsApp/i }).getAttribute("href");
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
    fireEvent.click(screen.getByRole("button", { name: /Explorar las 9 experiencias/i }));
    expect(screen.getByRole("button", { name: /Chatbot para WhatsApp/i })).toBeInTheDocument();
  });

});
