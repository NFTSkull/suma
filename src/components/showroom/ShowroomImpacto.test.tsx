import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShowroomImpacto } from "./ShowroomImpacto";
import { showroomEstimate, type ShowroomSelection } from "@/lib/showroom";
import { formatMXN } from "@/lib/pricing";

const selection: ShowroomSelection = {
  businessName: "Estudio Aurora",
  industry: "pilates",
  experience: "crm",
  serviceIds: ["crm-gestionado"],
  locations: 1,
  teamUsers: 5,
  platform: "WhatsApp / Instagram",
};

describe("ShowroomImpacto · interacción", () => {
  it("muestra un ejemplo explícito y permite cambiar al escenario conservador", () => {
    render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} />);
    expect(screen.getByText(/Ejemplo ilustrativo · editable/)).toBeInTheDocument();
    expect(screen.getByText(formatMXN(9720))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Conservador" }));
    expect(screen.getByText(formatMXN(4860))).toBeInTheDocument();
  });

  it("se actualiza al cambiar consultas y jamás afirma que los datos se guardan", () => {
    render(<ShowroomImpacto selection={selection} quote={showroomEstimate(selection)} />);
    fireEvent.change(screen.getByLabelText("Consultas nuevas al mes"), { target: { value: "0" } });
    expect(screen.getByText(/Tus datos · sin guardar/)).toBeInTheDocument();
    expect(screen.getByText(/esta simulación se calcula en tu navegador/)).toBeInTheDocument();
    expect(screen.getByText(/no se cubre el costo mensual/)).toBeInTheDocument();
  });

  it("advierte cuando el paquete elegido no incluye seguimiento", () => {
    const adsSelection: ShowroomSelection = {
      ...selection,
      mode: "package",
      planId: "ads",
      serviceIds: [],
    };
    render(<ShowroomImpacto selection={adsSelection} quote={showroomEstimate(adsSelection)} />);
    expect(screen.getByText(/no una mejora automática por contratar publicidad/)).toBeInTheDocument();
  });
});
