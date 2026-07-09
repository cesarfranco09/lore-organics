import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { isStoreLive, createCart } from "@/lib/shopify";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  /** Shopify ProductVariant GID (e.g. "gid://shopify/ProductVariant/123"). Required for real checkout. */
  variantId?: string;
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
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  /** When the store is live, builds a Shopify cart and redirects to hosted checkout. */
  checkout: () => Promise<void>;
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.id === item.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          return next;
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      setIsOpen(true);
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

  const checkout = useCallback(async () => {
    // Not live yet (Coming Soon mode) — do nothing.
    if (!isStoreLive()) return;

    const lines = items
      .filter((i) => i.variantId)
      .map((i) => ({ merchandiseId: i.variantId as string, quantity: i.quantity }));

    if (lines.length === 0) {
      console.warn("Checkout skipped: no cart items have a Shopify variantId.");
      return;
    }

    setIsCheckingOut(true);
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
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, totalItems, subtotal, isOpen, isCheckingOut, openCart, closeCart, toggleCart, addItem, removeItem, updateQuantity, clearCart, checkout }}
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
