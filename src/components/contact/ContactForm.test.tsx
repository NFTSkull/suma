import { render, screen, waitFor } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SELECTOR_STORAGE_KEY } from "@/lib/recommend";
import { ContactForm } from "./ContactForm";

vi.mock("next/link", () => import("@/test/next-link-mock"));

const fetchMock = vi.fn();

beforeEach(() => {
  sessionStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

async function fillValid(user: UserEvent) {
  await user.type(screen.getByLabelText("Nombre"), "Ana López");
  await user.type(screen.getByLabelText("Nombre del negocio"), "Estudio Flor");
  await user.type(screen.getByLabelText("Correo electrónico"), "ana@ejemplo.mx");
  await user.type(screen.getByLabelText("WhatsApp"), "81 1234 5678");
  await user.selectOptions(screen.getByLabelText("Tipo de negocio"), "yoga-pilates");
  await user.click(screen.getByRole("checkbox", { name: /Chatbots/ }));
  await user.click(screen.getByRole("checkbox", { name: /Acepto el/ }));
}

const send = () => screen.getByRole("button", { name: /Enviar mensaje|Enviando/ });

describe("ContactForm", () => {
  it("muestra errores accesibles y no envía si faltan datos", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(send());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Revisa los campos marcados");
    const nombre = screen.getByLabelText("Nombre");
    expect(nombre).toHaveAttribute("aria-invalid", "true");
    expect(nombre).toHaveAccessibleDescription("Escribe tu nombre.");
    await waitFor(() => expect(nombre).toHaveFocus());
  });

  it("no muestra éxito si el servidor responde 503 (sin proveedor)", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: false, error: "not_configured" }), { status: 503 }));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(send());

    expect(await screen.findByText("Tu mensaje no se envió.")).toBeInTheDocument();
    expect(screen.queryByText(/recibimos tu mensaje/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ana López");
  });

  it("muestra éxito solo ante 200 y envía datos válidos", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(send());

    expect(await screen.findByText("Gracias, recibimos tu mensaje.")).toBeInTheDocument();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({ nombre: "Ana López", servicios: ["chatbots"], privacidad: true, sitio: "" });
    expect(typeof body.inicio).toBe("number");
  });

  it("evita el doble envío mientras está enviando", async () => {
    let resolve!: (r: Response) => void;
    fetchMock.mockReturnValue(new Promise<Response>((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(send());
    expect(send()).toBeDisabled();
    await user.click(send());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolve(new Response("{}", { status: 200 }));
    expect(await screen.findByText("Gracias, recibimos tu mensaje.")).toBeInTheDocument();
  });

  it("prellena con el contexto del selector y permite quitarlo", async () => {
    sessionStorage.setItem(SELECTOR_STORAGE_KEY, JSON.stringify({ negocio: "spa", reto: "orden", servicios: ["crm", "paginas-web"] }));
    const user = userEvent.setup();
    render(<ContactForm />);

    expect(await screen.findByText("Desde el selector de soluciones")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo de negocio")).toHaveValue("spa");
    expect(screen.getByRole("checkbox", { name: /CRM/ })).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Quitar contexto" }));
    expect(screen.queryByText("Desde el selector de soluciones")).not.toBeInTheDocument();
    expect(sessionStorage.getItem(SELECTOR_STORAGE_KEY)).toBeNull();
  });
});
