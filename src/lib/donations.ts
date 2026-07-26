import type { ShopifyProduct } from "./shopify";
import type { CartItem } from "@/contexts/CartContext";

/**
 * Give-One donation model ("From One Woman to Another"):
 * customers add a pad/tampon box at cost price which is shipped to a partner
 * organisation in NL or DE instead of to them. The donation is a normal
 * Shopify cart line (so it flows through checkout/fulfilment) tagged with
 * line-item attributes.
 */

/** Shopify product handles for the at-cost donation boxes (as created in admin). */
export const DONATION_HANDLES = {
  pads: "donation-pad-box",
  tampons: "donation-tampons-regular",
} as const;

export type DonationPartnerId = "nl" | "de";

export interface DonationPartner {
  id: DonationPartnerId;
  /** Country shown at checkout / stored on the order. */
  region: "Netherlands" | "Germany";
  /** Display label — swap in the real organisation names once announced. */
  label: string;
}

export const DONATION_PARTNERS: DonationPartner[] = [
  { id: "nl", region: "Netherlands", label: "Partner organisation — Netherlands (announced at launch)" },
  { id: "de", region: "Germany", label: "Partner organisation — Germany (announced at launch)" },
];

/** Hidden marker attribute — invisible in checkout, visible on the admin order. */
export const DONATION_ATTR_KEY = "_donation";
/** Human-readable attribute — shown to the customer in Shopify checkout. */
export const DONATION_PARTNER_ATTR_KEY = "Donation partner";

export const isDonationItem = (item: Pick<CartItem, "attributes">): boolean =>
  item.attributes?.some((a) => a.key === DONATION_ATTR_KEY && a.value === "true") ?? false;

/** A donation product is offerable when it exists in Shopify and is in stock. */
export const isDonationOfferable = (product: ShopifyProduct | undefined): product is ShopifyProduct =>
  Boolean(product && product.availableForSale && product.variants[0]);

export function buildDonationCartItem(
  product: ShopifyProduct,
  partner: DonationPartner
): CartItem | null {
  const variant = product.variants[0];
  if (!variant) return null;
  return {
    id: `donation-${product.handle}-${partner.id}`,
    name: product.title,
    image: product.featuredImage?.url ?? "/placeholder.svg",
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    quantity: 1,
    variantId: variant.id,
    attributes: [
      { key: DONATION_ATTR_KEY, value: "true" },
      { key: DONATION_PARTNER_ATTR_KEY, value: partner.region },
    ],
  };
}
