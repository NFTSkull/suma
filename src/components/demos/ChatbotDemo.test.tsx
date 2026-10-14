import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ChatbotDemo } from "./ChatbotDemo";

describe("ChatbotDemo", () => {
  it("pregunta → horarios ficticios → confirmación de ejemplo", async () => {
    const user = userEvent.setup();
    render(<ChatbotDemo />);

    await user.click(screen.getByRole("button", { name: /reformer por la tarde/ }));
    const horarios = await screen.findByRole("group", { name: "Horarios ficticios" }, { timeout: 2000 });
    await user.click(within(horarios).getByRole("button", { name: /18:30/ }));

    expect(await screen.findByText("Confirmación de ejemplo", {}, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByText("No se creó ninguna reserva real.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.queryByText("Confirmación de ejemplo")).not.toBeInTheDocument();
  });

  it("indica que es una demostración conceptual", () => {
    render(<ChatbotDemo />);
    expect(screen.getAllByText(/Demostración conceptual/).length).toBeGreaterThan(0);
  });
});
