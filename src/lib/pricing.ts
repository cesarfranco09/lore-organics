import type { ProductId } from "./catalog";

/**
 * Launch pricing and subscription rules from the website brief.
 *
 * Checkout always charges the Shopify price. These numbers are what the site
 * shows when a product isn't loaded from Shopify, and the source for the
 * cadence discounts — keep Shopify and Appstle in sync with them.
 */

export type Cadence = "once" | "2m" | "3m" | "6m";
export type SubscriptionCadence = Exclude<Cadence, "once">;

export const SUBSCRIPTION_CADENCES: SubscriptionCadence[] = ["2m", "3m", "6m"];

/** Cadence discount in percent. Applied from the second delivery onward. */
export const CADENCE_DISCOUNT: Record<Cadence, number> = { once: 0, "2m": 0, "3m": 5, "6m": 10 };

/** Price per pack, exactly as in the brief (one-time & 2 months / 3 months / 6 months). */
export const PRICE_TABLE: Record<ProductId, Record<Cadence, number>> = {
  "day-pad": { once: 4.62, "2m": 4.62, "3m": 4.39, "6m": 4.16 },
  "night-pad": { once: 5.1, "2m": 5.1, "3m": 4.85, "6m": 4.59 },
  "regular-tampon": { once: 4.62, "2m": 4.62, "3m": 4.39, "6m": 4.16 },
  "super-tampon": { once: 5.1, "2m": 5.1, "3m": 4.85, "6m": 4.59 },
  liner: { once: 5.1, "2m": 5.1, "3m": 4.85, "6m": 4.59 },
};

/**
 * Price for a cadence. When a live Shopify base price is known, the cadence
 * discount is applied to it so the site follows Shopify after a price change.
 */
export function priceFor(id: ProductId, cadence: Cadence, liveBasePrice?: number): number {
  if (liveBasePrice === undefined || Number.isNaN(liveBasePrice)) return PRICE_TABLE[id][cadence];
  return Math.round(liveBasePrice * (1 - CADENCE_DISCOUNT[cadence] / 100) * 100) / 100;
}

export const SHIPPING = {
  oneTime: 5.95,
  subscription: 4.95,
  freeThreshold: 50,
} as const;

export const WELCOME_DISCOUNT_PERCENT = 10;

/**
 * Boxes per delivery. The brief fixes a minimum of 3 boxes on 2-month
 * deliveries; the other limits are proposals derived from the
 * recommendations below — confirm with the team.
 */
export const BOX_LIMITS: Record<SubscriptionCadence, { min: number; max: number }> = {
  "2m": { min: 3, max: 10 },
  "3m": { min: 4, max: 14 },
  "6m": { min: 8, max: 28 },
};

/** "The average customer uses …" per cadence (copy in cyclebox.json → cadences.<id>.recommendation). */
export const RECOMMENDATIONS: Record<SubscriptionCadence, { tampons: string; pads: number }> = {
  "2m": { tampons: "3–4", pads: 5 },
  "3m": { tampons: "5", pads: 7 },
  "6m": { tampons: "10", pads: 14 },
};

export const formatEuro = (amount: number, lang = "en"): string =>
  new Intl.NumberFormat(lang === "en" ? "en-IE" : lang === "nl" ? "nl-NL" : "de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
