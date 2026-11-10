import { describe, expect, it } from "vitest";
import { calculateShowroomImpact, impactSample } from "./showroom-impact";

const flowCost = { setup: 9900, monthlySuma: 3900, monthlyAds: 0, months: 6 };

describe("SUMA Vision Studio · cálculos honestos", () => {
  it("usa el ticket y margen del usuario sin asumir ingreso recurrente", () => {
    const result = calculateShowroomImpact(impactSample, flowCost, "base");
    expect(result.missed).toBeCloseTo(54);
    expect(result.recovered).toBeCloseTo(21.6);
    expect(result.additionalClients).toBeCloseTo(5.4);
    expect(result.addedRevenue).toBeCloseTo(9720);
    expect(result.marginContribution).toBeCloseTo(5832);
    expect(result.monthlyNet).toBeCloseTo(1932);
    expect(result.clientsToCoverMonthly).toBe(4);
    expect(result.clientsToCoverFirstMonth).toBe(13);
    expect(result.paybackMonths).toBe(6);
  });
  it("no confunde horas liberadas con ahorro financiero", () => {
    const result = calculateShowroomImpact(impactSample, flowCost);
    expect(result.hoursReleased).toBe(12);
    expect(result.timeValue).toBe(1200);
    expect(result.monthlyNet).toBe(1932);
  });
  it("escenarios muestran límites, incluso si la inversión no se recupera", () => {
    const conservative = calculateShowroomImpact(impactSample, flowCost, "conservative");
    const optimistic = calculateShowroomImpact(impactSample, flowCost, "optimistic");
    expect(conservative.monthlyNet).toBeLessThan(0);
    expect(conservative.paybackMonths).toBeNull();
    expect(optimistic.marginContribution).toBeGreaterThan(conservative.marginContribution);
  });
  it("separa la pauta del servicio y limita ventas a los cupos disponibles", () => {
    const result = calculateShowroomImpact({ ...impactSample, capacity: 2 }, { ...flowCost, monthlyAds: 6000 });
    expect(result.additionalClients).toBe(2);
    expect(result.capacityBound).toBe(true);
    expect(result.costMonthly).toBe(9900);
  });
  it("maneja tasas fuera de rango, valores negativos y casos sin ventas", () => {
    const result = calculateShowroomImpact({
      ...impactSample,
      leadsPerMonth: -5,
      unansweredPct: 400,
      revenuePerClient: -1,
      contributionMarginPct: 0,
    }, flowCost);
    expect(result.addedRevenue).toBe(0);
    expect(result.growthPct).toBeNull();
    expect(result.clientsToCoverMonthly).toBeNull();
    expect(result.paybackMonths).toBeNull();
    expect(Number.isFinite(result.netOverPeriod)).toBe(true);
  });
  it("los importes de plazo incluyen setup solo una vez", () => {
    const result = calculateShowroomImpact(impactSample, flowCost);
    expect(result.netOverPeriod).toBeCloseTo(1932 * 6 - 9900);
  });
});
