import { useState, useRef, useEffect, useCallback } from "react";
import Seo from "@/components/Seo";
import { useCart } from "@/contexts/CartContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { isStoreLive, type CartLineInput } from "@/lib/shopify";
import { resolveSellingPlan } from "@/lib/subscriptions";
import { useTranslation } from "react-i18next";
import {
  Package,
  Leaf,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Repeat,
  BadgePercent,
  Sparkles,
} from "lucide-react";

/* ─── Data ─── */

interface ProductDef {
  id: string;
  /** Canonical English name — used for checkout tracking + alt text (alt stays English). Display name comes from i18n. */
  name: string;
  image: string;
  price: number;
  alt: string;
  /** Matching Shopify product handle (must carry an Appstle selling plan to subscribe). */
  shopifyHandle: string;
}

const products: ProductDef[] = [
  { id: "day-pad", shopifyHandle: "organic-cotton-day-pad", name: "Day Pads", price: 6.90, image: "/lovable-uploads/day-pads-cycle.webp", alt: "Lore Organics organic cotton day pads pack for Cycle Box subscription, GOTS certified plastic free period care" },
  { id: "night-pad", shopifyHandle: "organic-cotton-night-pad-by", name: "Night Pads", price: 7.90, image: "/lovable-uploads/6cf4ee2b-9d53-4707-a40f-661d9359f9ad.webp", alt: "Lore Organics organic cotton night pads pack, biodegradable 280mm overnight period protection" },
  { id: "regular-tampon", shopifyHandle: "organic-cotton-tampons-regular", name: "Tampons Regular", price: 5.90, image: "/lovable-uploads/tampons-box.webp", alt: "Lore Organics GOTS certified organic cotton regular tampons pack, sustainable period care subscription" },
  { id: "super-tampon", shopifyHandle: "organic-cotton-tampons-super", name: "Tampons Super", price: 5.90, image: "/lovable-uploads/tampons-box-super.webp", alt: "Lore Organics organic cotton super tampons pack for heavier flow, plastic free period care" },
  { id: "liners", shopifyHandle: "organic-cotton-panty-liners", name: "Liners", price: 4.90, image: "/lovable-uploads/daae0592-f7db-4ec4-99be-058364328e9a.webp", alt: "Lore Organics organic cotton pantyliners pack, ultra-thin biodegradable everyday liner" },
];

type ProductId = typeof products[number]["id"];

type FrequencyId = "bimonthly" | "quarterly";

interface FrequencyDef {
  id: FrequencyId;
  discount: number;
  maxes: Record<ProductId, number>;
}

const frequencies: FrequencyDef[] = [
  {
    id: "bimonthly",
    discount: 0,
    maxes: { "day-pad": 4, "night-pad": 4, "regular-tampon": 2, "super-tampon": 2, "liners": 2 },
  },
  {
    id: "quarterly",
    discount: 5,
    maxes: { "day-pad": 6, "night-pad": 6, "regular-tampon": 3, "super-tampon": 3, "liners": 3 },
  },
];

interface Suggestion {
  quantities: Record<ProductId, number>;
}

/* Labels/descriptions live in the "cyclebox" i18n namespace under suggestions.{frequency}.{index}. */
const suggestionsByFrequency: Record<FrequencyId, Suggestion[]> = {
  bimonthly: [
    { quantities: { "day-pad": 1, "night-pad": 1, "regular-tampon": 1, "super-tampon": 0, "liners": 1 } },
    { quantities: { "day-pad": 2, "night-pad": 1, "regular-tampon": 1, "super-tampon": 1, "liners": 1 } },
    { quantities: { "day-pad": 2, "night-pad": 2, "regular-tampon": 1, "super-tampon": 1, "liners": 2 } },
  ],
  quarterly: [
    { quantities: { "day-pad": 2, "night-pad": 1, "regular-tampon": 1, "super-tampon": 1, "liners": 2 } },
    { quantities: { "day-pad": 2, "night-pad": 2, "regular-tampon": 1, "super-tampon": 1, "liners": 2 } },
    { quantities: { "day-pad": 3, "night-pad": 3, "regular-tampon": 2, "super-tampon": 1, "liners": 3 } },
  ],
};

/* Titles/descriptions live in the "cyclebox" i18n namespace under benefits.items.{index}. */
const benefitIcons = [Leaf, Truck, Repeat, BadgePercent];

/* Q/A pairs live in the "cyclebox" i18n namespace under faq.items.{index}. */
const FAQ_COUNT = 10;

const SHIPPING = 4.95;

/* ─── Flying Particle ─── */

interface FlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const FlyingProduct = ({
  item,
  onDone,
}: {
  item: FlyingItem;
  onDone: (id: string) => void;
}) => {
  const [phase, setPhase] = useState<"lift" | "fly" | "done">("lift");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fly"), 120);
    const t2 = setTimeout(() => {
      setPhase("done");
      onDone(item.id);
    }, 1220);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [item.id, onDone]);

  const dx = item.endX - item.startX;
  const dy = item.endY - item.startY;

  const style: React.CSSProperties = {
    position: "fixed",
    left: item.startX,
    top: item.startY,
    width: 64,
    height: 64,
    pointerEvents: "none",
    zIndex: 9999,
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: phase === "lift"
      ? "0 16px 48px -8px rgba(0,0,0,0.25), 0 8px 20px -4px rgba(0,0,0,0.12)"
      : "0 12px 36px -8px rgba(0,0,0,0.2), 0 4px 16px -4px rgba(0,0,0,0.08)",
    transition:
      phase === "lift"
        ? "transform 120ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 120ms ease, box-shadow 120ms ease"
        : "transform 1100ms cubic-bezier(0.32,0,0.15,1), opacity 1100ms ease, box-shadow 1100ms ease",
    transform:
      phase === "lift"
        ? "translateY(-18px) scale(1.08) rotate(-2deg)"
        : `translate(${dx}px, ${dy}px) scale(0.52) rotate(2deg)`,
    opacity: phase === "done" ? 0 : 1,
  };

  return (
    <div style={style}>
      <img src={item.image} alt="" aria-hidden="true" className="w-full h-full object-cover" />
    </div>
  );
};

/* ─── Bag Item ─── */

interface BagItem {
  id: string;
  productId: string;
  image: string;
  name: string;
}

const BagItemCard = ({ item, removing }: { item: BagItem; removing: boolean }) => {
  const [landed, setLanded] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLanded(true), 40);
    const t2 = setTimeout(() => setSettled(true), 460);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      style={{
        transform: removing
          ? "translateY(-16px) scale(0.7)"
          : landed
          ? settled
            ? "translateY(0) scale(1)"
            : "translateY(-6px) scale(1.03)"
          : "translateY(-30px) scale(0.5)",
        opacity: removing ? 0 : landed ? 1 : 0,
        transition: removing
          ? "all 320ms ease-in"
          : landed && !settled
          ? "all 420ms cubic-bezier(0.34, 1.4, 0.64, 1)"
          : "all 200ms ease-out",
      }}
    >
      <div
        className="rounded overflow-hidden"
        style={{
          width: "100%",
          aspectRatio: "1 / 1.15",
          boxShadow: "0 2px 8px -2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <img src={item.image} alt={`${item.name} in your Lore Organics Cycle Box — organic cotton period care subscription`} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

/* ─── Sage Green Translucent Shopping Bag ─── */

const SageBag = ({
  bagRef,
  items,
  removingId,
  totalSelected,
}: {
  bagRef: React.RefObject<HTMLDivElement>;
  items: BagItem[];
  removingId: string | null;
  totalSelected: number;
}) => {
  const { t } = useTranslation("cyclebox");
  const sageBase = "193, 203, 184";

  return (
    <div ref={bagRef} className="relative select-none">
      <div
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "78%",
          height: 22,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(${sageBase},0.25) 0%, transparent 70%)`,
          filter: "blur(10px)",
          opacity: 0.55,
        }}
      />

      <div className="relative mx-auto" style={{ width: "100%", maxWidth: 270 }}>
        {/* Handles */}
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ width: 150 }}>
          <svg viewBox="0 0 150 44" fill="none" className="w-full h-auto">
            <path d="M 35 44 C 35 18, 42 6, 58 6 L 92 6 C 108 6, 115 18, 115 44"
              stroke={`rgba(${sageBase},0.25)`} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 35 44 C 35 18, 42 6, 58 6 L 92 6 C 108 6, 115 18, 115 44"
              stroke={`rgba(${sageBase},0.55)`} strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M 37 44 C 37 20, 44 8, 58 8 L 92 8 C 106 8, 113 20, 113 44"
              stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 62 5.5 L 82 5.5"
              stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bag body */}
        <div
          className="relative overflow-hidden"
          style={{
            minHeight: 340,
            borderRadius: "8px 8px 14px 14px",
            background: `linear-gradient(175deg, rgba(${sageBase},0.38) 0%, rgba(${sageBase},0.22) 25%, rgba(${sageBase},0.16) 50%, rgba(${sageBase},0.22) 75%, rgba(${sageBase},0.32) 100%)`,
            boxShadow: `0 24px 48px -16px rgba(0,0,0,0.1), 0 8px 20px -6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.03), inset 2px 0 0 rgba(255,255,255,0.3), inset -2px 0 0 rgba(255,255,255,0.3)`,
            backdropFilter: "blur(8px)",
            border: `1.5px solid rgba(${sageBase}, 0.35)`,
          }}
        >
          <div className="absolute top-0 left-0 w-12 h-full pointer-events-none"
            style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, transparent 100%)" }} />

          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none"
            style={{ opacity: items.length > 0 ? 0.1 : 0.18, transition: "opacity 0.5s ease", zIndex: 5 }}
          >
            <div className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 300, color: "hsl(var(--lore-charcoal))", letterSpacing: "0.12em" }}>
              Lore
            </div>
            <div className="font-sans uppercase" style={{ fontSize: "0.42rem", fontWeight: 500, letterSpacing: "0.4em", color: "hsl(var(--lore-charcoal))", marginTop: 1 }}>
              Organics
            </div>
          </div>

          <div className="relative px-5 pb-5" style={{ paddingTop: 52, minHeight: 280 }}>
            {items.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ paddingTop: 40 }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `rgba(${sageBase}, 0.15)`, boxShadow: "inset 0 1px 4px rgba(0,0,0,0.03)" }}>
                  <Package size={20} className="text-muted-foreground" strokeWidth={1} style={{ opacity: 0.3 }} />
                </div>
                <p className="text-center font-serif"
                  style={{ opacity: 0.35, fontStyle: "italic", fontSize: "0.85rem", color: "hsl(var(--muted-foreground))" }}>
                  {t("bag.empty")}
                </p>
              </div>
            )}

            {items.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5">
                {items.map((item) => (
                  <BagItemCard key={item.id} item={item} removing={removingId === item.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Counter badge */}
      <div className="absolute -right-1 top-6 z-40"
        style={{
          opacity: totalSelected > 0 ? 1 : 0,
          transform: totalSelected > 0 ? "scale(1)" : "scale(0.5)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <div className="flex items-center justify-center font-sans font-medium"
          style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "hsl(var(--lore-botanical))",
            color: "hsl(var(--primary-foreground))",
            fontSize: "0.7rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
          {totalSelected}
        </div>
      </div>

      <div className="flex items-center justify-center mt-5 px-2">
        <span className="text-label text-muted-foreground" style={{ fontSize: "0.58rem", letterSpacing: "0.15em" }}>
          {t("bag.kitLabel")}
        </span>
      </div>
    </div>
  );
};

/* ─── Component ─── */

const CycleBox = () => {
  const { t } = useTranslation("cyclebox");
  const builderRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyId>("bimonthly");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "day-pad": 0,
    "night-pad": 0,
    "regular-tampon": 0,
    "super-tampon": 0,
    "liners": 0,
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [animCounter, setAnimCounter] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { checkoutLines, isCheckingOut } = useCart();
  const { byHandle } = useShopifyProducts();
  const storeLive = isStoreLive();

  const frequency = frequencies.find((f) => f.id === selectedFrequency)!;
  const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);

  const selectedProducts = products.filter((p) => (quantities[p.id] || 0) > 0);

  // A box is subscribable when every selected product is live, in stock, and
  // carries an Appstle selling plan matching the chosen frequency.
  const subscribable =
    storeLive &&
    selectedProducts.length > 0 &&
    selectedProducts.every((p) => {
      const live = byHandle[p.shopifyHandle];
      return live?.availableForSale && live.variants[0] && resolveSellingPlan(live, selectedFrequency);
    });

  // Prefer the discount configured on the Shopify selling plan (checkout applies
  // that one server-side); the static value is only the pre-launch display.
  const livePlanDiscount = subscribable
    ? resolveSellingPlan(byHandle[selectedProducts[0].shopifyHandle], selectedFrequency)?.percentageOff ?? null
    : null;
  const effectiveDiscount = livePlanDiscount ?? frequency.discount;

  const subtotal = products.reduce((sum, p) => sum + (quantities[p.id] || 0) * p.price, 0);
  const discountAmount = subtotal * (effectiveDiscount / 100);
  const total = subtotal - discountAmount + (totalSelected > 0 ? SHIPPING : 0);

  const startSubscription = () => {
    if (!subscribable) return;
    // Send base variants + sellingPlanId — Shopify checkout applies the
    // subscription pricing itself (never pre-discount the payload).
    const lines: CartLineInput[] = selectedProducts.map((p) => {
      const live = byHandle[p.shopifyHandle];
      return {
        merchandiseId: live.variants[0].id,
        quantity: quantities[p.id],
        sellingPlanId: resolveSellingPlan(live, selectedFrequency)?.id,
      };
    });
    void checkoutLines(
      lines,
      selectedProducts.map((p) => ({
        id: p.shopifyHandle,
        name: p.name,
        price: p.price,
        quantity: quantities[p.id],
      }))
    );
  };

  const launchFlyingItem = useCallback((productId: string, image: string) => {
    const sourceEl = productRefs.current[productId];
    const bagEl = bagRef.current;
    if (!sourceEl || !bagEl) return;
    const srcRect = sourceEl.getBoundingClientRect();
    const bagRect = bagEl.getBoundingClientRect();
    const startX = srcRect.left + srcRect.width / 2 - 32;
    const startY = srcRect.top + srcRect.height / 2 - 32;
    const endX = bagRect.left + bagRect.width / 2 - 32;
    const endY = bagRect.top + bagRect.height * 0.55 - 32;
    const key = animCounter + 1;
    setAnimCounter(key);
    setFlyingItems((prev) => [...prev, { id: `fly-${key}`, image, startX, startY, endX, endY }]);
  }, [animCounter]);

  const onFlyDone = useCallback((flyId: string) => {
    setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
  }, []);

  const addBagItem = (productId: string, image: string, name: string) => {
    const key = `${Date.now()}-${Math.random()}`;
    setTimeout(() => {
      setBagItems((prev) => [...prev, { id: `bag-${key}`, productId, image, name }]);
    }, 1050);
  };

  const removeBagItem = (productId: string) => {
    setBagItems((prev) => {
      const reversedIdx = [...prev].reverse().findIndex((item) => item.productId === productId);
      if (reversedIdx === -1) return prev;
      const actualIdx = prev.length - 1 - reversedIdx;
      const itemToRemove = prev[actualIdx];
      setRemovingId(itemToRemove.id);
      setTimeout(() => {
        setBagItems((curr) => curr.filter((i) => i.id !== itemToRemove.id));
        setRemovingId(null);
      }, 380);
      return prev;
    });
  };

  const updateQty = (id: string, delta: number) => {
    const max = frequency.maxes[id as ProductId];
    const current = quantities[id];
    const next = Math.max(0, Math.min(max, current + delta));
    if (next === current) return;
    setQuantities((prev) => ({ ...prev, [id]: next }));
    const prod = products.find((p) => p.id === id)!;
    if (next > current) {
      launchFlyingItem(id, prod.image);
      addBagItem(id, prod.image, prod.name);
    } else {
      removeBagItem(id);
    }
  };

  /* Re-sync quantities to per-product max when frequency changes (clamp down) */
  useEffect(() => {
    setQuantities((prev) => {
      let changed = false;
      const next: Record<string, number> = { ...prev };
      for (const p of products) {
        const max = frequency.maxes[p.id as ProductId];
        if (next[p.id] > max) {
          next[p.id] = max;
          changed = true;
        }
      }
      if (!changed) return prev;
      // Rebuild bag items to match new totals (simple: trim from end per product)
      setBagItems((items) => {
        const counts: Record<string, number> = {};
        for (const p of products) counts[p.id] = next[p.id];
        const kept: BagItem[] = [];
        for (const it of items) {
          if (counts[it.productId] > 0) {
            kept.push(it);
            counts[it.productId] -= 1;
          }
        }
        return kept;
      });
      return next;
    });
  }, [selectedFrequency]); // eslint-disable-line react-hooks/exhaustive-deps

  const applySuggestion = (s: Suggestion) => {
    // Clamp to per-product max
    const next: Record<string, number> = {};
    for (const p of products) {
      const max = frequency.maxes[p.id as ProductId];
      next[p.id] = Math.min(max, s.quantities[p.id as ProductId] || 0);
    }
    setQuantities(next);
    // Rebuild bag items, no fly animation for bulk autofill
    const newItems: BagItem[] = [];
    for (const p of products) {
      for (let i = 0; i < next[p.id]; i++) {
        newItems.push({
          id: `bag-${p.id}-${i}-${Date.now()}`,
          productId: p.id,
          image: p.image,
          name: p.name,
        });
      }
    }
    setBagItems(newItems);
  };

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="pt-20">
      <Seo
        title={t("seo.title")}
        description={t("seo.description")}
        path="/cycle-box"
      />
      {flyingItems.map((item) => (
        <FlyingProduct key={item.id} item={item} onDone={onFlyDone} />
      ))}

      {/* ════════ HERO ════════ */}
      <section className="section-padding text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lore-sage/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="divider-botanical mx-auto mb-8" />
          <h1 className="text-editorial-xl mb-6 fade-in-up">
            {t("hero.title1")}<br />{t("hero.title2")}
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-foreground/80 max-w-xl mx-auto mb-4 fade-in-up">
            {t("hero.tagline")}
          </p>
          <p className="text-body-lg text-muted-foreground max-w-md mx-auto mb-10 fade-in-up">
            {t("hero.subtitle")}
          </p>
          <div className="flex justify-center mb-10 fade-in-up">
            <button
              onClick={scrollToBuilder}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-label hover:opacity-90 transition-opacity rounded-full"
            >
              {t("hero.cta")} <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-body text-muted-foreground fade-in-up">
            <span className="flex items-center gap-2">
              <Leaf size={15} className="text-secondary-foreground" strokeWidth={1.5} /> {t("hero.trust.organic")}
            </span>
            <span className="flex items-center gap-2">
              <Truck size={15} className="text-secondary-foreground" strokeWidth={1.5} /> {t("hero.trust.discreet")}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-secondary-foreground" strokeWidth={1.5} /> {t("hero.trust.flexible")}
            </span>
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" className="section-padding bg-card">
        <div className="max-w-5xl mx-auto">
          <p className="text-label text-muted-foreground text-center mb-4">{t("howItWorks.label")}</p>
          <h2 className="text-editorial-md text-center mb-16">{t("howItWorks.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                step: "01",
                icon: Truck,
                title: t("howItWorks.step1.title"),
                items: [t("howItWorks.step1.items.0"), t("howItWorks.step1.items.1")],
                desc: t("howItWorks.step1.desc"),
              },
              {
                step: "02",
                icon: Heart,
                title: t("howItWorks.step2.title"),
                desc: t("howItWorks.step2.desc"),
              },
            ].map((s, i) => (
              <div key={i} className="text-center md:text-left">
                <span className="text-label text-lore-botanical mb-4 block">{s.step}</span>
                <div className="w-14 h-14 mx-auto md:mx-0 mb-5 bg-lore-sage/25 rounded-full flex items-center justify-center">
                  <s.icon size={22} className="text-secondary-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl mb-3">{s.title}</h3>
                {s.desc && <p className="text-body text-muted-foreground mb-3">{s.desc}</p>}
                {s.items && (
                  <ul className="space-y-1">
                    {s.items.map((item) => (
                      <li key={item} className="text-body text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ BOX BUILDER ════════ */}
      <section ref={builderRef} className="section-padding">
        <div className="max-w-6xl mx-auto">
          <p className="text-label text-muted-foreground text-center mb-4">{t("builder.label")}</p>
          <h2 className="text-editorial-md text-center mb-4">{t("builder.title")}</h2>
          <p className="text-body text-muted-foreground text-center max-w-xl mx-auto mb-16 italic">
            {t("hero.tagline")}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Steps */}
            <div className="lg:col-span-7 space-y-14">

              {/* Step 1: Frequency */}
              <div>
                <h3 className="text-label text-muted-foreground mb-6">{t("builder.step1Label")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {frequencies.map((freq) => {
                    const active = selectedFrequency === freq.id;
                    return (
                      <button
                        key={freq.id}
                        onClick={() => setSelectedFrequency(freq.id)}
                        className={`border rounded-sm p-5 text-left transition-all duration-200 ${
                          active
                            ? "border-lore-botanical bg-lore-sage/10 ring-1 ring-lore-botanical shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]"
                            : "border-border/60 hover:border-lore-sage hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]"
                        }`}
                      >
                        <span className="font-serif text-lg block mb-1">{t(`frequencies.${freq.id}.label`)}</span>
                        {freq.discount > 0 && (
                          <span className="text-label text-lore-botanical block">{t(`frequencies.${freq.id}.tag`)}</span>
                        )}
                        <span className="text-body text-muted-foreground text-sm block mt-1">{t(`frequencies.${freq.id}.shipping`)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Build Your Box */}
              <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <h3 className="text-label text-muted-foreground">{t("builder.step2Label")}</h3>
                  <span className="text-body text-muted-foreground">
                    <span className="font-medium text-foreground">{totalSelected}</span>{" "}
                    {t("builder.packsSelected", { count: totalSelected })}
                  </span>
                </div>

                {/* Suggestions helper */}
                <div className="mb-5 border border-border/50 rounded-sm overflow-hidden bg-lore-linen/40">
                  <button
                    onClick={() => setShowSuggestions((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-lore-sage/10 transition-colors"
                    aria-expanded={showSuggestions}
                  >
                    <span className="flex items-center gap-2 text-body">
                      <Sparkles size={15} className="text-secondary-foreground" strokeWidth={1.5} />
                      <span className="font-serif italic">{t("builder.suggestionsToggle")}</span>
                    </span>
                    {showSuggestions ? (
                      <ChevronUp size={16} className="text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <ChevronDown size={16} className="text-muted-foreground" strokeWidth={1.5} />
                    )}
                  </button>
                  {showSuggestions && (
                    <div className="px-4 py-4 border-t border-border/40 space-y-3">
                      <p className="text-body text-muted-foreground/80 text-sm italic">
                        {t("builder.suggestionsHint")}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {suggestionsByFrequency[selectedFrequency].map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => applySuggestion(s)}
                            className="text-left border border-border/60 rounded-sm p-3 hover:border-lore-botanical hover:bg-lore-sage/10 transition-all duration-200"
                          >
                            <span className="font-serif text-base block mb-1">{t(`suggestions.${selectedFrequency}.${idx}.label`)}</span>
                            <span className="text-body text-muted-foreground text-xs block">{t(`suggestions.${selectedFrequency}.${idx}.desc`)}</span>
                            <span className="text-label text-lore-botanical block mt-2" style={{ fontSize: "0.6rem" }}>
                              {t("builder.autofill")}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((prod) => {
                    const qty = quantities[prod.id];
                    const max = frequency.maxes[prod.id as ProductId];
                    const atMax = qty >= max;
                    return (
                      <div
                        key={prod.id}
                        className={`group border rounded-sm overflow-hidden transition-all duration-300 ${
                          qty > 0
                            ? "border-lore-botanical/40 bg-lore-sage/[0.06] shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]"
                            : "border-border/50 hover:border-lore-sage hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]"
                        }`}
                      >
                        <div className="flex items-center gap-4 p-4">
                          <div
                            ref={(el) => { productRefs.current[prod.id] = el; }}
                            className="w-16 h-16 bg-muted/30 rounded-sm overflow-hidden shrink-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)] cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                            onClick={() => !atMax && updateQty(prod.id, 1)}
                            title={atMax ? t("builder.maxPer", { max, frequency: t(`frequencies.${selectedFrequency}.labelLower`) }) : t("builder.clickToAdd")}
                          >
                            <img
                              src={prod.image}
                              alt={prod.alt}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              draggable={false}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-lg leading-tight">{t(`products.${prod.id}.name`)}</p>
                            <p className="text-body text-muted-foreground text-sm">{t(`products.${prod.id}.subtitle`)} · €{prod.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              onClick={() => updateQty(prod.id, -1)}
                              disabled={qty === 0}
                              className="w-8 h-8 border border-border/60 rounded-full flex items-center justify-center text-foreground hover:bg-muted/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                              aria-label={t("builder.decrease", { name: t(`products.${prod.id}.name`) })}
                            >
                              <Minus size={14} strokeWidth={1.5} />
                            </button>
                            <span className="font-serif text-lg w-5 text-center">{qty}</span>
                            <button
                              onClick={() => updateQty(prod.id, 1)}
                              disabled={atMax}
                              className="w-8 h-8 border border-border/60 rounded-full flex items-center justify-center text-foreground hover:bg-muted/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                              aria-label={t("builder.increase", { name: t(`products.${prod.id}.name`) })}
                            >
                              <Plus size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Luxury Shopping Bag (sticky) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 space-y-6">

                <div className="text-center lg:text-left">
                  <p className="text-label text-muted-foreground mb-1">{t("selection.label")}</p>
                  <h3 className="font-serif text-2xl">{t("bag.kitLabel")}</h3>
                </div>

                <SageBag
                  bagRef={bagRef}
                  items={bagItems}
                  removingId={removingId}
                  totalSelected={totalSelected}
                />

                {/* Summary card */}
                <div
                  className="rounded-sm p-5 border"
                  style={{
                    background: "linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--lore-linen)/0.5) 100%)",
                    borderColor: "hsl(var(--border)/0.5)",
                    boxShadow: "0 4px 24px -8px rgba(0,0,0,0.06)",
                  }}
                >
                  {totalSelected > 0 ? (
                    <div className="space-y-2 mb-4">
                      {products
                        .filter((p) => quantities[p.id] > 0)
                        .map((p) => (
                          <div key={p.id} className="flex items-center justify-between text-body text-muted-foreground">
                            <span>{t(`products.${p.id}.name`)} <span className="text-foreground/70">×{quantities[p.id]}</span></span>
                            <span className="text-foreground font-medium">€{(p.price * quantities[p.id]).toFixed(2)}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-body text-muted-foreground/80 italic mb-4 text-center">
                      {t("summary.empty")}
                    </p>
                  )}

                  {totalSelected > 0 && (
                    <div className="border-t border-border/40 pt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-body text-muted-foreground">
                        <span>{t("summary.subtotal")}</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                      {effectiveDiscount > 0 && (
                        <div className="flex items-center justify-between text-body text-lore-botanical">
                          <span>{t("summary.discount", { percent: effectiveDiscount })}</span>
                          <span>−€{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-body text-muted-foreground">
                        <span>{t("summary.shipping")}</span>
                        <span>€{SHIPPING.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between font-serif text-lg pt-2 border-t border-border/40 mt-2">
                        <span>{t("summary.total")}</span>
                        <span>€{total.toFixed(2)}</span>
                      </div>
                      <p className="text-label text-muted-foreground text-center pt-2" style={{ fontSize: "0.6rem" }}>
                        {t("summary.billed", { frequency: t(`frequencies.${selectedFrequency}.labelLower`), shipping: t(`frequencies.${selectedFrequency}.shipping`) })}
                      </p>
                    </div>
                  )}

                  {subscribable ? (
                    <>
                      <button
                        type="button"
                        onClick={startSubscription}
                        disabled={isCheckingOut}
                        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-label rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-wait mt-4"
                      >
                        {isCheckingOut ? t("summary.redirecting") : t("summary.start")}
                        {!isCheckingOut && <ArrowRight size={14} />}
                      </button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {t("summary.recurring", { frequency: t(`frequencies.${selectedFrequency}.labelLower`) })}
                      </p>
                    </>
                  ) : (
                    <>
                      <button
                        disabled
                        aria-disabled="true"
                        className="w-full inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground px-8 py-3.5 text-label rounded-sm cursor-not-allowed opacity-70 mt-4"
                      >
                        {t("summary.comingSoon")}
                      </button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">{t("summary.launching")}</p>
                    </>
                  )}
                </div>

                <p className="text-body text-muted-foreground/70 italic text-center text-sm">
                  {t("summary.delivered", { frequency: t(`frequencies.${selectedFrequency}.labelLower`) })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ BENEFITS ════════ */}
      <section className="section-padding bg-card">
        <div className="max-w-5xl mx-auto">
          <p className="text-label text-muted-foreground text-center mb-4">{t("benefits.label")}</p>
          <h2 className="text-editorial-md text-center mb-16">{t("benefits.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {benefitIcons.map((Icon, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-5 bg-lore-sage/25 rounded-full flex items-center justify-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
                  <Icon size={22} className="text-secondary-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg mb-2">{t(`benefits.items.${i}.title`)}</h3>
                <p className="text-body text-muted-foreground">{t(`benefits.items.${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="section-padding bg-card">
        <div className="max-w-2xl mx-auto">
          <p className="text-label text-muted-foreground text-center mb-4">{t("faq.label")}</p>
          <h2 className="text-editorial-md text-center mb-12">{t("faq.title")}</h2>
          <div className="space-y-0">
            {Array.from({ length: FAQ_COUNT }).map((_, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-b border-border/40">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left"
                  >
                    <span className="font-serif text-lg pr-4">{t(`faq.items.${i}.q`)}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                    ) : (
                      <ChevronDown size={18} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                    )}
                  </button>
                  {isOpen && (
                    <div className="pb-6 pr-8">
                      <p className="text-body text-muted-foreground">{t(`faq.items.${i}.a`)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="section-padding text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-lore-sage/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="divider-botanical mx-auto mb-8" />
          <h2 className="text-editorial-lg mb-6">
            {t("finalCta.title1")}<br />{t("finalCta.title2")}
          </h2>
          <p className="text-body-lg text-muted-foreground mb-10 max-w-lg mx-auto">
            {t("finalCta.body")}
          </p>
          <button
            onClick={scrollToBuilder}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-label hover:opacity-90 transition-opacity rounded-sm"
          >
            {t("finalCta.cta")} <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default CycleBox;
