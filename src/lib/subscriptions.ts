import type { ShopifyProduct, ShopifySellingPlan } from "./shopify";

/**
 * Maps the CycleBox delivery frequencies to the Appstle selling plans
 * configured in Shopify. Plans are matched by their name/option text
 * ("Every 2 months", "Delivery every 8 weeks", …) — adjust the patterns
 * below if the Appstle plan names use different wording.
 */

export type CycleFrequency = "bimonthly" | "quarterly";

const FREQUENCY_PATTERNS: Record<CycleFrequency, RegExp[]> = {
  bimonthly: [/2\s*month/i, /8\s*week/i, /every\s*two\s*month/i],
  quarterly: [/3\s*month/i, /12\s*week/i, /every\s*three\s*month/i],
};

/** Find the selling plan on a product that matches a CycleBox frequency. */
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

/** True when every given product has a plan for the frequency — gates the subscribe CTA. */
export function allPlansResolvable(
  products: (ShopifyProduct | undefined)[],
  frequency: CycleFrequency
): boolean {
  return products.length > 0 && products.every((p) => resolveSellingPlan(p, frequency) !== null);
}
