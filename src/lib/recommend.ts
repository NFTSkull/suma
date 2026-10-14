import {
  selectorRules,
  type BusinessId,
  type ChallengeId,
  type Recommendation,
  type SelectorRule,
} from "@/content/selector-rules";

export type RecommendationResult = {
  summary: string;
  recommendations: Recommendation[];
};

const MAX_RECOMMENDATIONS = 3;

export function findRule(
  business: BusinessId,
  challenge: ChallengeId,
  rules: SelectorRule[] = selectorRules,
): SelectorRule | undefined {
  const forChallenge = rules.filter((r) => r.challenge === challenge);
  return (
    forChallenge.find((r) => r.business?.includes(business)) ??
    forChallenge.find((r) => !r.business || r.business.length === 0)
  );
}

export function recommend(
  business: BusinessId,
  challenge: ChallengeId,
  rules: SelectorRule[] = selectorRules,
): RecommendationResult | null {
  const rule = findRule(business, challenge, rules);
  if (!rule) return null;

  const seen = new Set<string>();
  const recommendations = rule.recommendations
    .filter((r) => (seen.has(r.service) ? false : (seen.add(r.service), true)))
    .slice(0, MAX_RECOMMENDATIONS);

  if (recommendations.length === 0) return null;
  return { summary: rule.summary, recommendations };
}

/** Contexto que el selector transfiere al formulario (sin datos personales). */
export type SelectorContext = { negocio: BusinessId; reto: ChallengeId; servicios: string[] };

export const SELECTOR_STORAGE_KEY = "suma:selector";
