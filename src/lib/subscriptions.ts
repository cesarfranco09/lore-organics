import type { ShopifyProduct, ShopifySellingPlan } from "./shopify";
import type { SubscriptionCadence } from "./pricing";

/**
 * Maps the CycleBox delivery cadences to the Appstle selling plans
 * configured in Shopify. Plans are matched by their name/option text
 * ("Every 2 months", "Delivery every 8 weeks", "Alle 6 Monate", …) — adjust
 * the patterns below if the Appstle plan names use different wording.
 */

export type CycleFrequency = SubscriptionCadence;

/** "month" in EN / DE / NL plan names (months, Monate, maanden). */
const MONTH = "(?:month|monat|maand)";
/** "week" in EN / DE / NL (weeks, Wochen, weken). */
const WEEK = "(?:week|woche)";

// Word boundaries keep "2 months" from matching "12 months" and "8 weeks" from "18 weeks".
const FREQUENCY_PATTERNS: Record<CycleFrequency, RegExp[]> = {
  "2m": [new RegExp(`\\b2[\\s-]*${MONTH}`, "i"), new RegExp(`\\b8[\\s-]*${WEEK}`, "i"), /\btwo[\s-]*month/i],
  "3m": [new RegExp(`\\b3[\\s-]*${MONTH}`, "i"), new RegExp(`\\b12[\\s-]*${WEEK}`, "i"), /\bthree[\s-]*month/i],
  "6m": [new RegExp(`\\b6[\\s-]*${MONTH}`, "i"), new RegExp(`\\b26[\\s-]*${WEEK}`, "i"), /\bsix[\s-]*month/i],
};

/** Find the selling plan on a product that matches a CycleBox cadence. */
export function resolveSellingPlan(
  product: ShopifyProduct | undefined,
  frequency: CycleFrequency
): ShopifySellingPlan | null {
  if (!product) return null;
  const patterns = FREQUENCY_PATTERNS[frequency];
  for (const group of product.sellingPlanGroups) {
    for (const plan of group.sellingPlans) {
      const haystack = [plan.name, ...plan.options.map((o) => `${o.name} ${o.value}`)].join(" ");
      if (patterns.some((re) => re.test(haystack))) return plan;
    }
  }
  if (import.meta.env.DEV && product.sellingPlanGroups.length > 0) {
    console.warn(
      `No selling plan on "${product.handle}" matches frequency "${frequency}". Available:`,
      product.sellingPlanGroups.flatMap((g) => g.sellingPlans.map((p) => p.name))
    );
  }
  return null;
}

/** True when every given product has a plan for the cadence — gates the subscribe CTA. */
export function allPlansResolvable(
  products: (ShopifyProduct | undefined)[],
  frequency: CycleFrequency
): boolean {
  return products.length > 0 && products.every((p) => resolveSellingPlan(p, frequency) !== null);
}
