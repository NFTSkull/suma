import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { situations } from "@/content/situations";
import { SituationsExplorer } from "./SituationsExplorer";

vi.mock("next/link", () => import("@/test/next-link-mock"));

const tile = (i: number) => screen.getByRole("button", { name: new RegExp(situations[i].title.slice(0, 30)) });

describe("SituationsExplorer", () => {
  it("selecciona con clic", async () => {
    const user = userEvent.setup();
    render(<SituationsExplorer />);
    expect(tile(0)).toHaveAttribute("aria-pressed", "true");
    await user.click(tile(2));
    expect(tile(2)).toHaveAttribute("aria-pressed", "true");
    expect(tile(0)).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByText(situations[2].explanation).length).toBeGreaterThan(0);
  });

  it("navega con flechas, Home y End", async () => {
    const user = userEvent.setup();
    render(<SituationsExplorer />);
    tile(0).focus();
    await user.keyboard("{ArrowRight}");
    expect(tile(1)).toHaveFocus();
    expect(tile(1)).toHaveAttribute("aria-pressed", "true");
    await user.keyboard("{End}");
    expect(tile(situations.length - 1)).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(tile(0)).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(tile(situations.length - 1)).toHaveFocus();
    await user.keyboard("{Home}");
    expect(tile(0)).toHaveAttribute("aria-pressed", "true");
  });
});
