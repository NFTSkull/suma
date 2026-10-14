import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClosingCta } from "./ClosingCta";

vi.mock("next/link", () => import("@/test/next-link-mock"));

const symbolProps = vi.fn();
vi.mock("@/components/brand/AnimatedSumaSymbol", () => ({
  AnimatedSumaSymbol: (props: { className?: string }) => {
    symbolProps(props);
    return null;
  },
}));

describe("ClosingCta", () => {
  it("muestra el isotipo animado completo en móvil y en escritorio", () => {
    render(<ClosingCta />);
    const calls = symbolProps.mock.calls.map(([p]) => p as { variant: string; trigger: string; className: string });
    const mobile = calls.find((p) => p.className.includes("lg:hidden"));
    const desktop = calls.find((p) => p.className.includes("lg:block"));
    expect(mobile).toMatchObject({ variant: "cta", trigger: "in-view" });
    expect(desktop).toMatchObject({ variant: "cta", trigger: "in-view" });
  });
});
