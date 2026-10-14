import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeroVisual } from "./HeroVisual";

const symbolProps = vi.fn();
vi.mock("@/components/brand/AnimatedSumaSymbol", () => ({
  AnimatedSumaSymbol: (props: Record<string, unknown>) => {
    symbolProps(props);
    return null;
  },
}));

describe("HeroVisual", () => {
  it("une el isotipo al entrar en pantalla para que también se vea en móvil", () => {
    render(<HeroVisual />);
    expect(symbolProps).toHaveBeenCalledWith(expect.objectContaining({ variant: "hero", trigger: "in-view", preload: true }));
  });
});
