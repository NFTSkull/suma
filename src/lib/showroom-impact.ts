/**
 * SUMA Vision Studio / Impacto
 * Hipótesis propias editables, NO porcentajes de mejora derivados de estudios.
 * Sin persistencia ni acceso a sistemas reales de los negocios.
 */
export type ImpactInputs = {
  leadsPerMonth: number;
  unansweredPct: number;
  recoveryPct: number;
  conversionPct: number;
  revenuePerClient: number;
  contributionMarginPct: number;
  capacity: number;
  manualTasksPerMonth: number;
  minutesSavedPerTask: number;
  hourlyCost: number;
};

export type ImpactCost = {
  setup: number;
  monthlySuma: number;
  monthlyAds: number;
  months: number;
};

export type ImpactScenario = "conservative" | "base" | "optimistic";

export const impactSample: ImpactInputs = {
  leadsPerMonth: 180,
  unansweredPct: 30,
  recoveryPct: 40,
  conversionPct: 25,
  revenuePerClient: 1800,
  contributionMarginPct: 60,
  capacity: 12,
  manualTasksPerMonth: 120,
  minutesSavedPerTask: 6,
  hourlyCost: 100,
};

/**
 * Las bandas son factores de sensibilidad elegidos por SUMA.
 * NO son tasas de éxito respaldadas por una fuente externa.
 */
export const impactScenarios = {
  conservative: { label: "Conservador", factor: 0.5 },
  base: { label: "Base", factor: 1 },
  optimistic: { label: "Optimista", factor: 1.25 },
} as const;

const nonnegative = (value: number, upper = 1e9) =>
  Number.isFinite(value) ? Math.max(0, Math.min(upper, value)) : 0;

export function calculateShowroomImpact(
  raw: ImpactInputs,
  quote: ImpactCost,
  scenario: ImpactScenario = "base",
) {
  const input = {
    leadsPerMonth: nonnegative(raw.leadsPerMonth, 1e6),
    unansweredPct: nonnegative(raw.unansweredPct, 100),
    recoveryPct: nonnegative(raw.recoveryPct, 100),
    conversionPct: nonnegative(raw.conversionPct, 100),
    revenuePerClient: nonnegative(raw.revenuePerClient),
    contributionMarginPct: nonnegative(raw.contributionMarginPct, 100),
    capacity: nonnegative(raw.capacity, 1e6),
    manualTasksPerMonth: nonnegative(raw.manualTasksPerMonth, 1e6),
    minutesSavedPerTask: nonnegative(raw.minutesSavedPerTask, 1440),
    hourlyCost: nonnegative(raw.hourlyCost),
  };
  const sensitivity = impactScenarios[scenario].factor;
  const missed = input.leadsPerMonth * input.unansweredPct / 100;
  const recoveryRate = Math.min(100, input.recoveryPct * sensitivity);
  const recovered = missed * recoveryRate / 100;
  const clientsFromRecovery = recovered * input.conversionPct / 100;
  const additionalClients = Math.min(input.capacity, clientsFromRecovery);
  const initialClients = (input.leadsPerMonth - missed) * input.conversionPct / 100;
  const growthPct = initialClients > 0 ? additionalClients / initialClients * 100 : null;

  const addedRevenue = additionalClients * input.revenuePerClient;
  const marginContribution = addedRevenue * input.contributionMarginPct / 100;
  const costMonthly = nonnegative(quote.monthlySuma) + nonnegative(quote.monthlyAds);
  const setup = nonnegative(quote.setup);
  const months = Math.max(1, Math.min(12, Math.floor(nonnegative(quote.months) || 1)));
  const monthlyNet = marginContribution - costMonthly;
  const netOverPeriod = monthlyNet * months - setup;

  const marginPerClient = input.revenuePerClient * input.contributionMarginPct / 100;
  const clientsToCoverMonthly =
    costMonthly === 0 ? 0 : marginPerClient > 0 ? Math.ceil(costMonthly / marginPerClient) : null;
  const clientsToCoverFirstMonth =
    setup + costMonthly === 0 ? 0 : marginPerClient > 0 ? Math.ceil((setup + costMonthly) / marginPerClient) : null;
  const paybackMonths =
    setup === 0 ? (monthlyNet >= 0 ? 0 : null) : monthlyNet > 0 ? Math.ceil(setup / monthlyNet) : null;

  const hoursReleased = input.manualTasksPerMonth * input.minutesSavedPerTask / 60 * sensitivity;
  const timeValue = hoursReleased * input.hourlyCost;

  return {
    scenario,
    missed,
    recovered,
    additionalClients,
    initialClients,
    growthPct,
    addedRevenue,
    marginContribution,
    costMonthly,
    setup,
    months,
    monthlyNet,
    netOverPeriod,
    marginPerClient,
    clientsToCoverMonthly,
    clientsToCoverFirstMonth,
    paybackMonths,
    hoursReleased,
    timeValue,
    capacityBound: input.capacity < clientsFromRecovery,
  };
}
