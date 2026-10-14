import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("bloquea tras el límite y libera después de la ventana", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.check("a", 0).ok).toBe(true);
    expect(rl.check("a", 10).ok).toBe(true);
    expect(rl.check("a", 20).ok).toBe(false);
    expect(rl.check("b", 20).ok).toBe(true);
    expect(rl.check("a", 1001).ok).toBe(true);
  });
});
