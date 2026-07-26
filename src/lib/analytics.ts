/**
 * Shared analytics helpers — GA4 (gtag), Meta Pixel (fbq) and TikTok (ttq)
 * in one call each. Every helper is a safe no-op when the vendor global is
 * absent, which (per src/lib/martech.ts) encodes "no marketing consent yet";
 * GA4 is always present but runs under Google Consent Mode v2.
 */

export interface AnalyticsItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      page?: () => void;
      track?: (event: string, params?: Record<string, unknown>) => void;
    };
  }
}

const CURRENCY = "EUR";

/** Last path sent via trackPageView — lets martech replay the current page's
 *  view to pixels that load only after consent is granted mid-session. */
let lastTrackedPath: string | null = null;
export const getLastTrackedPath = (): string | null => lastTrackedPath;

const gaItem = (i: AnalyticsItem) => ({
  item_id: i.id,
  item_name: i.name,
  price: i.price,
  quantity: i.quantity ?? 1,
});

export function trackPageView(path: string, title?: string): void {
  lastTrackedPath = path;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  });
  window.fbq?.("track", "PageView");
  window.ttq?.page?.();
}

export function trackViewContent(items: AnalyticsItem[], listName = "Products"): void {
  if (items.length === 0) return;
  const value = items.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0);
  window.gtag?.("event", "view_item_list", {
    item_list_name: listName,
    items: items.map(gaItem),
  });
  window.fbq?.("track", "ViewContent", {
    content_ids: items.map((i) => i.id),
    content_type: "product",
    value,
    currency: CURRENCY,
  });
}

export function trackAddToCart(item: AnalyticsItem): void {
  window.gtag?.("event", "add_to_cart", {
    currency: CURRENCY,
    value: item.price,
    items: [gaItem(item)],
  });
  window.fbq?.("track", "AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: item.price,
    currency: CURRENCY,
  });
  window.ttq?.track?.("AddToCart", {
    content_id: item.id,
    content_name: item.name,
    value: item.price,
    currency: CURRENCY,
  });
}

export function trackInitiateCheckout(items: AnalyticsItem[], value: number): void {
  const numItems = items.reduce((s, i) => s + (i.quantity ?? 1), 0);
  window.gtag?.("event", "begin_checkout", {
    currency: CURRENCY,
    value,
    items: items.map(gaItem),
  });
  window.fbq?.("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.id),
    content_type: "product",
    num_items: numItems,
    value,
    currency: CURRENCY,
  });
  window.ttq?.track?.("InitiateCheckout", {
    value,
    currency: CURRENCY,
  });
}
