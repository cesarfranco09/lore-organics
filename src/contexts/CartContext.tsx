import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { isStoreLive, createCart, type CartLineAttribute, type CartLineInput } from "@/lib/shopify";
import { trackAddToCart, trackInitiateCheckout, type AnalyticsItem } from "@/lib/analytics";
import { isDonationItem, isDonationOfferable, DONATION_HANDLES } from "@/lib/donations";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  /** Shopify ProductVariant GID (e.g. "gid://shopify/ProductVariant/123"). Required for real checkout. */
  variantId?: string;
  /** Shopify line item properties (e.g. donation markers). */
  attributes?: CartLineAttribute[];
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  isCheckingOut: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  /** When the store is live, builds a Shopify cart and redirects to hosted checkout.
   *  `extraItems` are included in the Shopify cart without waiting for React state. */
  checkout: (extraItems?: CartItem[]) => Promise<void>;
  /** Direct checkout for pre-built lines (e.g. CycleBox subscriptions with selling plans). */
  checkoutLines: (lines: CartLineInput[], trackingItems?: AnalyticsItem[]) => Promise<void>;
  /** Checkout entry point: may first show the Give-One interstitial, then checks out. */
  beginCheckout: () => void;
  /** Give-One interstitial dialog state. */
  isGiveOneOpen: boolean;
  closeGiveOne: (declined?: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "lore-cart";

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const GIVE_ONE_DECLINED_KEY = "lore-giveone-declined";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isGiveOneOpen, setIsGiveOneOpen] = useState(false);
  const { byHandle } = useShopifyProducts();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // If the user comes back from Shopify checkout via the browser Back button, the
  // page is often restored from cache with isCheckingOut still true — reset it.
  useEffect(() => {
    const reset = () => setIsCheckingOut(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.id === item.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + (item.quantity ?? 1) };
          return next;
        }
        return [...prev, { ...item, quantity: item.quantity ?? 1 }];
      });
      setIsOpen(true);
      trackAddToCart({ id: item.id, name: item.name, price: item.price });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  /** Shared handoff: create the Shopify cart from prepared lines and redirect. */
  const checkoutLines = useCallback(async (lines: CartLineInput[], trackingItems: AnalyticsItem[] = []) => {
    // Not live yet (Coming Soon mode) — do nothing.
    if (!isStoreLive()) return;

    if (lines.length === 0) {
      console.warn("Checkout skipped: no lines with a Shopify variantId.");
      return;
    }

    setIsCheckingOut(true);
    trackInitiateCheckout(
      trackingItems,
      trackingItems.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0)
    );
    try {
      const cart = await createCart(lines);
      if (cart?.checkoutUrl) {
        window.location.href = cart.checkoutUrl; // hand off to Shopify's hosted checkout
      } else {
        console.error("Could not create a Shopify cart for checkout.");
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      setIsCheckingOut(false);
    }
  }, []);

  const checkout = useCallback(async (extraItems: CartItem[] = []) => {
    const allItems = [...items, ...extraItems];
    const lines = allItems
      .filter((i) => i.variantId)
      .map((i) => ({
        merchandiseId: i.variantId as string,
        quantity: i.quantity,
        ...(i.attributes?.length ? { attributes: i.attributes } : {}),
      }));
    await checkoutLines(lines, allItems);
  }, [items, checkoutLines]);

  /**
   * Checkout entry point used by all Checkout buttons. If the cart has no
   * donation yet, the Give-One boxes exist in Shopify, and the shopper hasn't
   * declined this session, show the interstitial first — otherwise go straight
   * to Shopify checkout.
   */
  const beginCheckout = useCallback(() => {
    if (!isStoreLive()) return;

    const hasDonation = items.some(isDonationItem);
    const declined = sessionStorage.getItem(GIVE_ONE_DECLINED_KEY) === "1";
    const offerable =
      isDonationOfferable(byHandle[DONATION_HANDLES.pads]) ||
      isDonationOfferable(byHandle[DONATION_HANDLES.tampons]);

    if (!hasDonation && !declined && offerable) {
      setIsGiveOneOpen(true);
    } else {
      void checkout();
    }
  }, [items, byHandle, checkout]);

  const closeGiveOne = useCallback((declined = false) => {
    if (declined) sessionStorage.setItem(GIVE_ONE_DECLINED_KEY, "1");
    setIsGiveOneOpen(false);
  }, []);

  return (
    <CartContext.Provider
      value={{ items, totalItems, subtotal, isOpen, isCheckingOut, openCart, closeCart, toggleCart, addItem, removeItem, updateQuantity, clearCart, checkout, checkoutLines, beginCheckout, isGiveOneOpen, closeGiveOne }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
