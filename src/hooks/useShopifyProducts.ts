import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchProducts, isStoreLive, type ShopifyProduct, type ShopifyLanguage } from "@/lib/shopify";

/**
 * Fetches live Shopify products (only when the store is live) and returns them
 * keyed by handle, so page components can merge commerce data (price,
 * availability, variant ID) into their existing static/editorial content.
 *
 * Usage:
 *   const { byHandle } = useShopifyProducts();
 *   const live = byHandle["organic-cotton-day-pad"];
 *   const variantId = live?.variants[0]?.id;
 */
export function useShopifyProducts() {
  const enabled = isStoreLive();
  const { i18n } = useTranslation();
  const language = (i18n.language?.toUpperCase() ?? "EN") as ShopifyLanguage;

  const query = useQuery({
    queryKey: ["shopify-products", language],
    queryFn: () => fetchProducts(50, language),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const byHandle: Record<string, ShopifyProduct> = {};
  for (const p of query.data ?? []) {
    byHandle[p.handle] = p;
  }

  return {
    products: query.data ?? [],
    byHandle,
    isLoading: query.isLoading,
    isLive: enabled,
  };
}
