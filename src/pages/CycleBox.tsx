import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BadgePercent, Check, Leaf, Minus, Plus, Repeat, Truck } from "lucide-react";
import Seo from "@/components/Seo";
import { useCart } from "@/contexts/CartContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { isStoreLive, type CartLineInput } from "@/lib/shopify";
import { resolveSellingPlan } from "@/lib/subscriptions";
import { CATALOG, getProduct, familyColor, type CatalogProduct, type ProductId } from "@/lib/catalog";
import {
  SUBSCRIPTION_CADENCES,
  BOX_LIMITS,
  RECOMMENDATIONS,
  SHIPPING,
  priceFor,
  formatEuro,
  type SubscriptionCadence,
} from "@/lib/pricing";
import ProductBox from "@/components/brand/ProductBox";
import LeafShadow from "@/components/brand/LeafShadow";
import Reveal from "@/components/brand/Reveal";
import Droplets from "@/components/brand/Droplets";

/* ─── Data ─── */

type Quantities = Record<ProductId, number>;

const EMPTY: Quantities = { "day-pad": 0, "night-pad": 0, "regular-tampon": 0, "super-tampon": 0, liner: 0 };

/** Products that can go in a box today (liner is coming soon). */
const ADDABLE = CATALOG.filter((p) => !p.comingSoon);

const DEFAULT_CADENCE: SubscriptionCadence = "2m";

/* Titles/descriptions live in the "cyclebox" i18n namespace under benefits.items.{index}. */
const benefitIcons = [Leaf, Truck, Repeat, BadgePercent];

/* Q/A pairs live in the "cyclebox" i18n namespace under faq.items.{index}. */
const FAQ_COUNT = 10;

const totalOf = (q: Quantities) => Object.values(q).reduce((a, b) => a + b, 0);

/** Trim boxes (last product first) until the box fits the cadence's maximum. */
const clampToMax = (q: Quantities, max: number): Quantities => {
  let over = totalOf(q) - max;
  if (over <= 0) return q;
  const next = { ...q };
  for (const p of [...CATALOG].reverse()) {
    const take = Math.min(next[p.id], over);
    next[p.id] -= take;
    over -= take;
    if (over <= 0) break;
  }
  return next;
};

const isCadence = (v: string | null): v is SubscriptionCadence =>
  !!v && (SUBSCRIPTION_CADENCES as string[]).includes(v);

const addableProduct = (v: string | null): CatalogProduct | undefined =>
  ADDABLE.find((p) => p.id === v);

/* Page-local motion (kept here so the shared stylesheet stays untouched). */
const PAGE_STYLES = `
@keyframes cbSwap {
  from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
  to { opacity: 1; transform: none; filter: none; }
}
@keyframes cbDrop {
  0% { opacity: 0; transform: translateY(-18px) scale(0.85); }
  60% { opacity: 1; transform: translateY(2px) scale(1.02); }
  100% { opacity: 1; transform: none; }
}
.cb-swap { animation: cbSwap 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
.cb-drop { animation: cbDrop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
@media (prefers-reduced-motion: reduce) {
  .cb-swap, .cb-drop { animation: none !important; }
}
`;

/* ─── Pieces ─── */

/** One box in the summary stack: a small block in the family color with a lit top edge. */
const StackBlock = ({ product }: { product: CatalogProduct }) => (
  <span
    className="cb-drop relative block h-9 w-6 rounded-[3px]"
    style={{
      background: familyColor(product),
      boxShadow:
        "inset 0 0 0 1px rgba(255,255,255,0.22), inset 0 4px 0 rgba(255,255,255,0.18), 0 6px 14px -6px rgba(0,0,0,0.55)",
    }}
    aria-hidden="true"
  />
);

const EmptySlot = () => (
  <span className="block h-9 w-6 rounded-[3px] border border-dashed border-lore-birch/35" aria-hidden="true" />
);

/* ─── Component ─── */

const CycleBox = () => {
  const { t, i18n } = useTranslation("cyclebox");
  const lang = i18n.language;
  const builderRef = useRef<HTMLElement>(null);
  const [searchParams] = useSearchParams();

  const [cadence, setCadence] = useState<SubscriptionCadence>(DEFAULT_CADENCE);
  const [quantities, setQuantities] = useState<Quantities>(EMPTY);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { checkoutLines, isCheckingOut } = useCart();
  const { byHandle } = useShopifyProducts();
  const storeLive = isStoreLive();

  const limits = BOX_LIMITS[cadence];
  const totalSelected = totalOf(quantities);
  const atMax = totalSelected >= limits.max;
  const meetsMin = totalSelected >= limits.min;
  const selectedProducts = CATALOG.filter((p) => quantities[p.id] > 0);

  /* Prefill from ?cadence=…&add=… (links from the home page). Invalid values are ignored. */
  const search = searchParams.toString();
  useEffect(() => {
    const params = new URLSearchParams(search);
    const rawCadence = params.get("cadence");
    const rawAdd = params.get("add");
    if (rawCadence === null && rawAdd === null) return;

    const nextCadence = isCadence(rawCadence) ? rawCadence : null;
    const product = addableProduct(rawAdd);
    const c = nextCadence ?? cadence;
    if (nextCadence) setCadence(nextCadence);
    if (product) {
      setQuantities({ ...EMPTY, [product.id]: BOX_LIMITS[c].min });
    } else if (nextCadence) {
      setQuantities((q) => clampToMax(q, BOX_LIMITS[nextCadence].max));
    }
    const timer = window.setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(timer);
    // Only re-run when the query string changes.
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Live Shopify base price when loaded, else undefined (priceFor falls back to PRICE_TABLE). */
  const liveBase = (p: CatalogProduct): number | undefined => {
    const amount = byHandle[p.shopifyHandle]?.priceRange.minVariantPrice.amount;
    return amount === undefined ? undefined : parseFloat(amount);
  };
  const unitPrice = (p: CatalogProduct, c: SubscriptionCadence = cadence) => priceFor(p.id, c, liveBase(p));
  const fromPrice = (c: SubscriptionCadence) => Math.min(...ADDABLE.map((p) => unitPrice(p, c)));

  const subtotal = selectedProducts.reduce((sum, p) => sum + quantities[p.id] * unitPrice(p), 0);
  const freeShipping = subtotal >= SHIPPING.freeThreshold;
  const shipping = totalSelected === 0 || freeShipping ? 0 : SHIPPING.subscription;
  const total = subtotal + shipping;

  // Every selected product must be live, in stock, and carry an Appstle selling
  // plan for the chosen cadence.
  const plansReady =
    storeLive &&
    selectedProducts.length > 0 &&
    selectedProducts.every((p) => {
      const live = byHandle[p.shopifyHandle];
      return live?.availableForSale && live.variants[0] && resolveSellingPlan(live, cadence);
    });
  // Not live yet, or a selected product has no plan: keep the "Coming soon" state.
  const comingSoon = !storeLive || (selectedProducts.length > 0 && !plansReady);
  const canSubscribe = plansReady && meetsMin && totalSelected <= limits.max;

  const chooseCadence = (c: SubscriptionCadence) => {
    setCadence(c);
    setQuantities((q) => clampToMax(q, BOX_LIMITS[c].max));
  };

  const updateQty = (id: ProductId, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, prev[id] + delta);
      if (delta > 0 && totalOf(prev) >= BOX_LIMITS[cadence].max) return prev;
      return next === prev[id] ? prev : { ...prev, [id]: next };
    });
  };

  const startSubscription = () => {
    if (!canSubscribe) return;
    // Send base variants + sellingPlanId — Shopify checkout applies the
    // subscription pricing itself (never pre-discount the payload).
    const lines: CartLineInput[] = selectedProducts.map((p) => {
      const live = byHandle[p.shopifyHandle];
      return {
        merchandiseId: live.variants[0].id,
        quantity: quantities[p.id],
        sellingPlanId: resolveSellingPlan(live, cadence)?.id,
      };
    });
    void checkoutLines(
      lines,
      selectedProducts.map((p) => ({
        id: p.shopifyHandle,
        name: p.name,
        price: unitPrice(p),
        quantity: quantities[p.id],
      }))
    );
  };

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cadenceLower = t(`cadences.${cadence}.labelLower`);
  const rec = RECOMMENDATIONS[cadence];
  const missing = Math.max(0, limits.min - totalSelected);
  const stackSlots = Math.max(totalSelected, limits.min);

  return (
    <main className="pt-20 overflow-x-hidden">
      <Seo title={t("seo.title")} description={t("seo.description")} path="/cycle-box" />
      <style>{PAGE_STYLES}</style>

      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden bg-lore-night text-lore-birch">
        <LeafShadow color="rgba(18, 6, 9, 1)" opacity={0.42} seed={11} blur={16} />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-12 lg:gap-6">
          <div className="text-center lg:col-span-7 lg:text-left">
            <p className="text-label mb-6 text-lore-birch/70 fade-in-up">Cycle Box</p>
            <h1 className="text-editorial-xl mb-6 fade-in-up">
              {t("hero.title1")}
              <br />
              <em className="font-light">{t("hero.title2")}</em>
            </h1>
            <p className="mx-auto mb-3 max-w-xl font-serif text-xl font-light text-lore-birch/90 sm:text-2xl lg:mx-0 fade-in-up">
              {t("hero.tagline")}
            </p>
            <p className="text-body-lg mx-auto mb-10 max-w-md text-lore-birch/70 lg:mx-0 fade-in-up">
              {t("hero.subtitle")}
            </p>
            <div className="mb-10 fade-in-up">
              <button onClick={scrollToBuilder} className="btn-cream">
                {t("hero.cta")} <ArrowRight size={14} />
              </button>
            </div>
            <ul className="flex flex-col items-center gap-3 text-sm text-lore-birch/80 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-7 lg:justify-start fade-in-up">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={14} strokeWidth={1.5} className="text-lore-birch/60" />
                  {t(`perks.${i}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden h-[420px] lg:col-span-5 lg:block" aria-hidden="true">
            <div className="absolute right-6 top-0">
              <ProductBox product={getProduct("night-pad")} width={200} turn={-26} float />
            </div>
            <div className="absolute bottom-0 left-0">
              <ProductBox product={getProduct("super-tampon")} width={140} turn={22} />
            </div>
          </div>
          <div className="flex justify-center lg:hidden" aria-hidden="true">
            <ProductBox product={getProduct("night-pad")} width={130} turn={-24} interactive={false} float />
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" className="section-padding bg-lore-ivory">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-label mb-4 text-center text-muted-foreground">{t("howItWorks.label")}</p>
            <h2 className="text-editorial-md mb-16 text-center">{t("howItWorks.title")}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
            <Reveal className="text-center md:text-left">
              <span className="mb-4 block font-serif text-5xl font-light text-lore-night/40">01</span>
              <h3 className="mb-4 font-serif text-2xl font-light">{t("howItWorks.step1.title")}</h3>
              <ul className="mb-3 space-y-1">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="text-body text-muted-foreground">
                    {t(`howItWorks.step1.items.${i}`)}
                  </li>
                ))}
              </ul>
              <p className="text-body text-muted-foreground">{t("howItWorks.step1.desc")}</p>
            </Reveal>
            <Reveal delay={120} className="text-center md:text-left">
              <span className="mb-4 block font-serif text-5xl font-light text-lore-night/40">02</span>
              <h3 className="mb-4 font-serif text-2xl font-light">{t("howItWorks.step2.title")}</h3>
              <p className="text-body text-muted-foreground">{t("howItWorks.step2.desc")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ BOX BUILDER ════════ */}
      <section ref={builderRef} className="section-padding scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14 text-center md:mb-20">
            <p className="text-label mb-4 text-muted-foreground">{t("builder.label")}</p>
            <h2 className="text-editorial-lg">{t("builder.title")}</h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left: steps */}
            <div className="space-y-16 lg:col-span-7">
              {/* Step 1: cadence */}
              <div>
                <h3 className="text-label mb-6 font-sans text-muted-foreground">{t("builder.step1Label")}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t("builder.step1Label")}>
                  {SUBSCRIPTION_CADENCES.map((c) => {
                    const active = cadence === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => chooseCadence(c)}
                        className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-all duration-500 ease-out sm:block sm:py-5 ${
                          active
                            ? "border-lore-night bg-lore-night text-lore-birch shadow-[0_18px_40px_-20px_hsl(var(--lore-night)/0.8)]"
                            : "border-border bg-lore-birch hover:-translate-y-0.5 hover:border-lore-night/40"
                        }`}
                      >
                        <span className="block whitespace-nowrap font-serif text-xl font-light leading-tight">
                          {t(`cadences.${c}.label`)}
                        </span>
                        <span className="block text-right sm:mt-3 sm:text-left">
                          <span className={`text-label block ${active ? "text-lore-birch/80" : "text-lore-night/70"}`}>
                            {t(`cadences.${c}.tag`)}
                          </span>
                          <span className={`mt-1 block text-xs ${active ? "text-lore-birch/70" : "text-muted-foreground"}`}>
                            {t("builder.fromPerPack", { price: formatEuro(fromPrice(c), lang) })}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Recommendation, swaps in per cadence */}
                <div className="relative mt-5 overflow-hidden rounded-2xl bg-lore-linen px-6 py-7 sm:px-8">
                  <LeafShadow opacity={0.07} seed={3} blur={10} still sunlight={false} />
                  <div key={cadence} className="cb-swap relative" aria-live="polite">
                    <p className="text-label mb-3 text-muted-foreground">{t("builder.recommendationLabel")}</p>
                    <p className="mb-4 font-serif text-xl font-light leading-snug sm:text-2xl">
                      {t(`cadences.${cadence}.recommendation`, { tampons: rec.tampons, pads: rec.pads })}
                    </p>
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Leaf size={14} strokeWidth={1.5} className="mt-[3px] shrink-0 text-lore-botanical" />
                      {t("builder.carbon")}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("builder.limits", { min: limits.min, max: limits.max })}
                </p>
              </div>

              {/* Step 2: build the box */}
              <div>
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-label font-sans text-muted-foreground">{t("builder.step2Label")}</h3>
                  <span className="text-sm text-muted-foreground">
                    {t("builder.boxCount", { count: totalSelected })} / {limits.max}
                  </span>
                </div>

                <ul className="divide-y divide-border border-y border-border">
                  {CATALOG.map((p) => {
                    const qty = quantities[p.id];
                    const name = t(`products.${p.id}.name`);
                    return (
                      <li key={p.id} className={`flex items-center gap-3 py-4 sm:gap-5 ${p.comingSoon ? "opacity-60" : ""}`}>
                        <div className="-my-2 -ml-2 shrink-0" aria-hidden="true">
                          <ProductBox product={p} width={40} turn={-22} interactive={false} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-lg leading-tight sm:text-xl">{name}</p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground sm:text-sm">
                            <span>{t(`products.${p.id}.subtitle`)}</span>
                            <Droplets count={p.absorbency} size={8} color="hsl(var(--muted-foreground))" />
                          </p>
                          {!p.comingSoon && (
                            <p className="mt-0.5 text-xs text-foreground/80 sm:text-sm">
                              {t("builder.perPack", { price: formatEuro(unitPrice(p), lang) })}
                            </p>
                          )}
                        </div>
                        {p.comingSoon ? (
                          <span className="text-label shrink-0 rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground">
                            {t("builder.comingSoon")}
                          </span>
                        ) : (
                          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <button
                              type="button"
                              onClick={() => updateQty(p.id, -1)}
                              disabled={qty === 0}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all duration-200 hover:border-lore-night/50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={t("builder.decrease", { name })}
                            >
                              <Minus size={14} strokeWidth={1.5} />
                            </button>
                            <span className="w-5 text-center font-serif text-xl tabular-nums" aria-live="polite">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(p.id, 1)}
                              disabled={atMax}
                              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 ${
                                qty > 0 ? "bg-lore-night text-lore-birch" : "border border-border hover:border-lore-night/50"
                              }`}
                              aria-label={t("builder.increase", { name })}
                            >
                              <Plus size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {atMax && (
                  <p className="cb-swap mt-4 text-sm text-lore-night">{t("builder.maxReached", { max: limits.max })}</p>
                )}
              </div>
            </div>

            {/* Right: summary (sticky) */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl bg-lore-night p-6 text-lore-birch shadow-[0_30px_60px_-30px_hsl(var(--lore-night)/0.9)] sm:p-8 lg:sticky lg:top-28">
                <LeafShadow color="rgba(18, 6, 9, 1)" opacity={0.35} seed={23} blur={14} />
                <div className="relative">
                  <div className="mb-6 flex items-baseline justify-between gap-4">
                    <div>
                      <p className="text-label mb-1 text-lore-birch/60">{t("selection.label")}</p>
                      <h3 className="font-serif text-2xl font-light">{t("bag.kitLabel")}</h3>
                    </div>
                    <span className="shrink-0 text-sm text-lore-birch/70">{t(`cadences.${cadence}.label`)}</span>
                  </div>

                  {/* The box, filling up */}
                  <div className="mb-6 flex min-h-[2.25rem] flex-wrap gap-1.5" aria-label={t("builder.boxCount", { count: totalSelected })}>
                    {selectedProducts.flatMap((p) =>
                      Array.from({ length: quantities[p.id] }, (_, i) => (
                        <StackBlock key={`${p.id}-${i}`} product={p} />
                      ))
                    )}
                    {Array.from({ length: stackSlots - totalSelected }, (_, i) => (
                      <EmptySlot key={`slot-${i}`} />
                    ))}
                  </div>

                  {totalSelected > 0 ? (
                    <div className="mb-4 space-y-2">
                      {selectedProducts.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-3 text-sm text-lore-birch/80">
                          <span>
                            {t(`products.${p.id}.name`)} <span className="text-lore-birch/50">× {quantities[p.id]}</span>
                          </span>
                          <span className="tabular-nums text-lore-birch">{formatEuro(unitPrice(p) * quantities[p.id], lang)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mb-4 font-serif text-lg font-light italic text-lore-birch/70">{t("bag.empty")}</p>
                  )}

                  {totalSelected > 0 && (
                    <div className="space-y-1.5 border-t border-lore-birch/15 pt-4 text-sm">
                      <div className="flex justify-between text-lore-birch/80">
                        <span>{t("summary.subtotal")}</span>
                        <span className="tabular-nums">{formatEuro(subtotal, lang)}</span>
                      </div>
                      <div className="flex justify-between text-lore-birch/80">
                        <span>{t("summary.shipping")}</span>
                        <span className="tabular-nums">{freeShipping ? t("summary.shippingFree") : formatEuro(shipping, lang)}</span>
                      </div>
                      {!freeShipping && (
                        <p className="text-xs text-lore-birch/55">
                          {t("summary.freeShippingHint", { amount: formatEuro(SHIPPING.freeThreshold - subtotal, lang) })}
                        </p>
                      )}
                      <div className="mt-3 flex items-baseline justify-between border-t border-lore-birch/15 pt-3 font-serif text-2xl font-light">
                        <span>{t("summary.total")}</span>
                        <span className="tabular-nums">{formatEuro(total, lang)}</span>
                      </div>
                    </div>
                  )}

                  {!meetsMin && (
                    <p key={missing} className="cb-swap mt-5 text-sm text-lore-birch/85">
                      {t("summary.belowMin", { count: missing, min: limits.min })}
                    </p>
                  )}

                  {comingSoon ? (
                    <>
                      <button type="button" disabled aria-disabled="true" className="btn-cream mt-5 w-full cursor-not-allowed opacity-50">
                        {t("summary.comingSoon")}
                      </button>
                      <p className="mt-3 text-center text-xs text-lore-birch/60">{t("summary.launching")}</p>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={startSubscription}
                        disabled={!canSubscribe || isCheckingOut}
                        className="btn-cream mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isCheckingOut ? t("summary.redirecting") : t("summary.start")}
                        {!isCheckingOut && <ArrowRight size={14} />}
                      </button>
                      <p className="mt-3 text-center text-xs text-lore-birch/60">
                        {t("summary.recurring", { frequency: cadenceLower })}
                      </p>
                    </>
                  )}

                  <p className="mt-5 border-t border-lore-birch/15 pt-4 text-[11px] leading-relaxed text-lore-birch/55">
                    {t("summary.firstBox")}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-center text-sm italic text-muted-foreground">
                {t("summary.delivered", { frequency: cadenceLower })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ BENEFITS ════════ */}
      <section className="section-padding bg-lore-ivory">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-label mb-4 text-center text-muted-foreground">{t("benefits.label")}</p>
            <h2 className="text-editorial-md mb-16 text-center">{t("benefits.title")}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {benefitIcons.map((Icon, i) => (
              <Reveal key={i} delay={i * 90} className="text-center">
                <Icon size={22} className="mx-auto mb-5 text-lore-night/70" strokeWidth={1.25} />
                <h3 className="mb-2 font-serif text-xl font-light">{t(`benefits.items.${i}.title`)}</h3>
                <p className="text-body text-muted-foreground">{t(`benefits.items.${i}.desc`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <p className="text-label mb-4 text-center text-muted-foreground">{t("faq.label")}</p>
            <h2 className="text-editorial-md mb-12 text-center">{t("faq.title")}</h2>
          </Reveal>
          <div>
            {Array.from({ length: FAQ_COUNT }).map((_, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-lg sm:text-xl">{t(`faq.items.${i}.q`)}</span>
                    <Plus
                      size={18}
                      strokeWidth={1.25}
                      className={`shrink-0 text-muted-foreground transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-body pb-6 pr-8 text-muted-foreground">{t(`faq.items.${i}.a`)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="relative overflow-hidden bg-lore-regular text-lore-charcoal">
        <LeafShadow opacity={0.16} seed={41} blur={14} />
        <Reveal className="section-padding relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-editorial-lg mb-6">
            {t("finalCta.title1")}
            <br />
            <em className="font-light">{t("finalCta.title2")}</em>
          </h2>
          <p className="text-body-lg mx-auto mb-10 max-w-lg text-lore-charcoal/75">{t("finalCta.body")}</p>
          <button onClick={scrollToBuilder} className="btn-primary">
            {t("finalCta.cta")} <ArrowRight size={14} />
          </button>
        </Reveal>
      </section>
    </main>
  );
};

export default CycleBox;
