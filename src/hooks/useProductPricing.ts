import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { isStoreLive, type ShopifyProduct } from "@/lib/shopify";
import { priceFor, type Cadence } from "@/lib/pricing";
import type { CatalogProduct } from "@/lib/catalog";

export interface ProductPricing {
  live?: ShopifyProduct;
  /** Price per pack for a cadence (follows the live Shopify price when loaded). */
  price: (cadence: Cadence) => number;
  /** Lowest Cycle Box price per pack (every 6 months). */
  fromBox: number;
  /** Can be added to the bag right now. */
  purchasable: boolean;
  outOfStock: boolean;
}

/** Live Shopify price and availability merged with the launch price table. */
export function useProductPricing(product: CatalogProduct): ProductPricing {
  const { byHandle } = useShopifyProducts();
  const live = byHandle[product.shopifyHandle];
  const liveBase = live ? parseFloat(live.priceRange.minVariantPrice.amount) : undefined;
  const storeLive = isStoreLive();
  const price = (c: Cadence) => priceFor(product.id, c, liveBase);
  return {
    live,
    price,
    fromBox: price("6m"),
    purchasable: storeLive && !product.comingSoon && !!live?.availableForSale && !!live.variants[0],
    outOfStock: storeLive && !product.comingSoon && !!live && !live.availableForSale,
  };
}
