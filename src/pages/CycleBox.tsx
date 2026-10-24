import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, Minus, Plus, Leaf, CalendarDays, Repeat, BadgePercent, ArrowRight, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Seo from "@/components/Seo";
import { useCart } from "@/contexts/CartContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useIsMobile } from "@/hooks/use-mobile";
import { isStoreLive, type CartLineInput } from "@/lib/shopify";
import { resolveSellingPlan } from "@/lib/subscriptions";
import { CATALOG, getProduct, type CatalogProduct, type ProductFamily, type ProductId } from "@/lib/catalog";
import {
  SUBSCRIPTION_CADENCES,
  CADENCE_DISCOUNT,
  BOX_LIMITS,
  RECOMMENDATIONS,
  SHIPPING,
  priceFor,
  formatEuro,
  type SubscriptionCadence,
} from "@/lib/pricing";
import ProductBox from "@/components/brand/ProductBox";
import LeafShadow from "@/components/brand/LeafShadow";
import Droplets from "@/components/brand/Droplets";
import Reveal from "@/components/brand/Reveal";
import HowItWorks from "@/components/cyclebox/HowItWorks";
import BoxVisual from "@/components/cyclebox/BoxVisual";

/* ─── Data ─── */

type Quantities = Record<ProductId, number>;

const EMPTY: Quantities = { "day-pad": 0, "night-pad": 0, "regular-tampon": 0, "super-tampon": 0, liner: 0 };

const ADDABLE = CATALOG.filter((p) => !p.comingSoon);
const GROUPS: ProductFamily[] = ["pads", "tampons", "liners"];
const DEFAULT_CADENCE: SubscriptionCadence = "2m";
const FAQ_COUNT = 10;
const WHY_ICONS = [Leaf, CalendarDays, Repeat, BadgePercent];
const MONTHS: Record<SubscriptionCadence, number> = { "2m": 2, "3m": 3, "6m": 6 };

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

const isCadence = (v: string | null): v is SubscriptionCadence => !!v && (SUBSCRIPTION_CADENCES as string[]).includes(v);
const addableProduct = (v: string | null): CatalogProduct | undefined => ADDABLE.find((p) => p.id === v);

/** Upper end of a "3–4" style range. */
const upper = (range: string) => Number(range.split(/[–-]/).pop());

/* ─── Component ─── */

const CycleBox = () => {
  const { t, i18n } = useTranslation("cyclebox");
  const lang = i18n.language;
  const builderRef = useRef<HTMLElement>(null);
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const [cadence, setCadence] = useState<SubscriptionCadence>(DEFAULT_CADENCE);
  const [quantities, setQuantities] = useState<Quantities>(EMPTY);
  const [howManyOpen, setHowManyOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { checkoutLines, isCheckingOut } = useCart();
  const { byHandle } = useShopifyProducts();
  const storeLive = isStoreLive();

  const limits = BOX_LIMITS[cadence];
  const totalSelected = totalOf(quantities);
  const atMax = totalSelected >= limits.max;
  const meetsMin = totalSelected >= limits.min;
  const selectedProducts = CATALOG.filter((p) => quantities[p.id] > 0);
  const packs = selectedProducts.flatMap((p) => Array.from({ length: quantities[p.id] }, () => p.id));

  /* Prefill from ?cadence=…&add=… (links from product pages). Invalid values are ignored. */
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

  // Every selected product must be live, in stock, and carry an Appstle selling plan for the cadence.
  const plansReady =
    storeLive &&
    selectedProducts.length > 0 &&
    selectedProducts.every((p) => {
      const live = byHandle[p.shopifyHandle];
      return live?.availableForSale && live.variants[0] && resolveSellingPlan(live, cadence);
    });
  const comingSoon = !storeLive || (selectedProducts.length > 0 && !plansReady);
  const canSubscribe = plansReady && meetsMin && totalSelected <= limits.max;

  const chooseCadence = (c: SubscriptionCadence) => {
    setCadence(c);
    setQuantities((q) => clampToMax(q, BOX_LIMITS[c].max));
  };

  const updateQty = (id: ProductId, delta: number) => {
    setQuantities((prev) => {
      if (delta > 0 && totalOf(prev) >= BOX_LIMITS[cadence].max) return prev;
      const next = Math.max(0, prev[id] + delta);
      return next === prev[id] ? prev : { ...prev, [id]: next };
    });
  };

  const applyRecommendation = (id: ProductId, count: number) => {
    setQuantities(clampToMax({ ...EMPTY, [id]: count }, limits.max));
    setHowManyOpen(false);
  };

  const startSubscription = () => {
    if (!canSubscribe) return;
    // Base variants + sellingPlanId: Shopify checkout applies the subscription pricing itself.
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
      selectedProducts.map((p) => ({ id: p.shopifyHandle, name: p.name, price: unitPrice(p), quantity: quantities[p.id] }))
    );
  };

  const scrollToBuilder = () => builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const rec = RECOMMENDATIONS[cadence];
  // Arrays come back once the namespace has loaded.
  const checklistRaw = t("hero.checklist", { returnObjects: true });
  const checklist = Array.isArray(checklistRaw) ? (checklistRaw as string[]) : [];
  const missing = Math.max(0, limits.min - totalSelected);
  const heroW = isMobile ? 96 : 168;

  /* The box summary: shared by the sticky panel (desktop) and the bottom sheet (phones). */
  const boxPanel = (
    <div className="rounded-xl bg-card p-6 sm:p-8">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h3 className="t-h3">{t("box.title")}</h3>
        <span className="t-small text-muted-foreground">{t(`cadences.${cadence}.label`)}</span>
      </div>

      <BoxVisual packs={packs} />

      <p className="mt-5 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-primary" aria-live="polite">
        {t("box.count", { count: totalSelected, max: limits.max })}
      </p>

      <div className="mt-6 border-t border-border pt-5">
        {totalSelected > 0 ? (
          <ul className="space-y-2">
            {selectedProducts.map((p) => (
              <li key={p.id} className="t-small flex items-baseline justify-between gap-3">
                <span>
                  {t(`products.${p.id}`)} <span className="text-muted-foreground">× {quantities[p.id]}</span>
                </span>
                <span className="tabular-nums">{formatEuro(unitPrice(p) * quantities[p.id], lang)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="t-small italic text-muted-foreground">{t("box.empty")}</p>
        )}
      </div>

      {totalSelected > 0 && (
        <div className="t-small mt-5 space-y-1.5 border-t border-border pt-5">
          <div className="flex justify-between text-muted-foreground">
            <span>{t("box.subtotal")}</span>
            <span className="tabular-nums">{formatEuro(subtotal, lang)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t("box.shipping")}</span>
            <span className="tabular-nums">{freeShipping ? t("box.shippingFree") : formatEuro(shipping, lang)}</span>
          </div>
          <div className="flex items-baseline justify-between pt-2 font-serif text-[22px]">
            <span>{t("box.total")}</span>
            <span className="tabular-nums">{formatEuro(total, lang)}</span>
          </div>
          <p className="text-[12px] text-muted-foreground">{t("box.inclVat")}</p>
        </div>
      )}

      {!meetsMin && (
        <p key={missing} className="t-small mt-5 text-primary fade-in">
          {t("box.belowMin", { count: missing })}
        </p>
      )}
      {atMax && <p className="t-small mt-5 text-primary fade-in">{t("box.atMax", { max: limits.max })}</p>}

      {comingSoon ? (
        <>
          <button type="button" disabled className="btn-primary mt-6 w-full">
            {t("box.comingSoon")}
          </button>
          <p className="t-small mt-3 text-center text-muted-foreground">{t("box.launching")}</p>
        </>
      ) : (
        <button
          type="button"
          onClick={startSubscription}
          disabled={!canSubscribe || isCheckingOut}
          className="btn-primary mt-6 w-full"
        >
          {isCheckingOut ? t("box.redirecting") : t("box.start")}
        </button>
      )}

      <p className="mt-5 border-t border-border pt-4 text-[12px] leading-[18px] text-muted-foreground">{t("box.firstOrder")}</p>
    </div>
  );

  return (
    <main>
      <Seo title={t("seo.title")} description={t("seo.description")} path="/cycle-box" />

      {/* ════════ HERO, on cream ════════ */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 60% at 18% 12%, rgba(255,252,246,1), rgba(255,252,246,0) 70%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(38 38% 93%) 100%)",
          }}
        />
        <LeafShadow color="rgb(60, 66, 58)" opacity={0.15} seed={5} blur={16} sunlight={false} className="-z-10" />
        <div className="container-lore grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-12">
          <div>
            <h1 className="t-h1 mb-4 fade-in-up">{t("hero.title")}</h1>
            <p className="t-lead mb-8 italic text-foreground/80 fade-in-up">{t("hero.tagline")}</p>
            <ul className="mb-10 space-y-3 fade-in-up">
              {checklist.map((line) => (
                <li key={line} className="t-body flex items-center gap-3">
                  <Check size={16} strokeWidth={1.5} className="shrink-0 text-sage-mid" />
                  {line}
                </li>
              ))}
            </ul>
            <button type="button" onClick={scrollToBuilder} className="btn-primary fade-in-up">
              {t("hero.cta")}
            </button>
          </div>
          <div className="flex items-end justify-center fade-in" role="img" aria-label={t("hero.imageAlt")}>
            <div className="relative z-10 -mr-[10%]">
              <ProductBox product={getProduct("regular-tampon")} width={heroW * 0.82} turn={26} />
            </div>
            <div className="relative z-20">
              <ProductBox product={getProduct("day-pad")} width={heroW} turn={-18} />
            </div>
            <div className="relative z-30 -ml-[12%] translate-y-[2%]">
              <ProductBox product={getProduct("night-pad")} width={heroW * 0.86} turn={-36} />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks className="border-t border-border" />

      {/* ════════ BUILDER ════════ */}
      <section ref={builderRef} id="build" className="section scroll-mt-28 border-t border-border">
        <div className="container-lore">
          {/* Step 1 */}
          <Reveal>
            <p className="eyebrow mb-5">{t("step1.label")}</p>
            <h2 className="t-h2 mb-8">{t("step1.title")}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t("step1.title")}>
            {SUBSCRIPTION_CADENCES.map((c) => {
              const active = cadence === c;
              const pct = CADENCE_DISCOUNT[c];
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => chooseCadence(c)}
                  className={`relative flex items-center justify-between gap-4 rounded-xl px-5 py-4 text-left transition-colors duration-200 sm:block sm:px-6 sm:py-6 ${
                    active
                      ? "border-[1.5px] border-primary bg-sage-light/45"
                      : "border-[1.5px] border-border bg-background hover:border-sage-mid"
                  }`}
                >
                  <span className="t-h3 block">{t("step1.every", { n: MONTHS[c] })}</span>
                  <span className="t-small mt-1 block text-muted-foreground sm:mt-2">
                    {pct > 0 ? t("step1.save", { pct }) : t("step1.perPack", { price: formatEuro(fromPrice(c), lang) })}
                  </span>
                  <span
                    className={`absolute right-4 top-4 hidden h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground sm:flex ${
                      active ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-200`}
                    aria-hidden="true"
                  >
                    <Check size={12} strokeWidth={2} />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="t-small mt-4 text-muted-foreground">{t("step1.shippingNote")}</p>

          {/* How many do I need? */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setHowManyOpen((v) => !v)}
              aria-expanded={howManyOpen}
              aria-controls="how-many"
              className="link-arrow"
            >
              {t("howMany.link")}
              <Plus size={13} className={`transition-transform duration-200 ${howManyOpen ? "rotate-45" : ""}`} />
            </button>
            <div
              id="how-many"
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: howManyOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="mt-4 max-w-[640px] rounded-xl bg-card p-6">
                  <p className="t-body mb-5">{t("howMany.body")}</p>
                  <p className="t-small mb-3 text-muted-foreground">
                    {t("howMany.recommendLabel", { frequency: t(`cadences.${cadence}.labelLower`) })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyRecommendation("day-pad", rec.pads)}
                      className="h-10 rounded-full border border-primary px-4 text-[13px] text-primary transition-colors duration-200 hover:bg-sage-light/45"
                    >
                      {t("howMany.pads", { count: Math.min(rec.pads, limits.max) })}
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRecommendation("regular-tampon", upper(rec.tampons))}
                      className="h-10 rounded-full border border-primary px-4 text-[13px] text-primary transition-colors duration-200 hover:bg-sage-light/45"
                    >
                      {t("howMany.tampons", { count: Math.min(upper(rec.tampons), limits.max) })}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mt-16 md:mt-24">
            <Reveal>
              <p className="eyebrow mb-5">{t("step2.label")}</p>
              <h2 className="t-h2 mb-8">{t("step2.title")}</h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
              <div className="space-y-10">
                {GROUPS.map((family) => (
                  <div key={family}>
                    <p className="text-label mb-2 text-muted-foreground">{t(`step2.groups.${family}`)}</p>
                    <ul className="divide-y divide-border border-y border-border">
                      {CATALOG.filter((p) => p.family === family).map((p) => {
                        const qty = quantities[p.id];
                        const name = t(`products.${p.id}`);
                        return (
                          <li key={p.id} className={`flex items-center gap-4 py-4 ${p.comingSoon ? "opacity-60" : ""}`}>
                            <div className="flex h-16 w-14 shrink-0 items-end justify-center overflow-hidden rounded-lg bg-card" aria-hidden="true">
                              <div className="-mb-1">
                                <ProductBox product={p} width={30} turn={-20} />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="t-body font-medium">{name}</p>
                              <p className="t-small mt-0.5 flex flex-wrap items-center gap-x-2 text-muted-foreground">
                                <span className="text-sage-mid">
                                  <Droplets count={p.absorbency} size={8} />
                                </span>
                                {!p.comingSoon && <span>{formatEuro(unitPrice(p), lang)}</span>}
                              </p>
                            </div>
                            {p.comingSoon ? (
                              <span className="max-w-[45%] rounded-full border border-border px-3 py-1.5 text-center text-[11px] font-medium uppercase leading-[14px] tracking-[0.1em] text-muted-foreground">
                                {t("step2.comingSoon")}
                              </span>
                            ) : (
                              <div className="flex shrink-0 items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQty(p.id, -1)}
                                  disabled={qty === 0}
                                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors duration-200 hover:border-primary disabled:cursor-not-allowed disabled:opacity-35"
                                  aria-label={t("step2.decrease", { name })}
                                >
                                  <Minus size={14} strokeWidth={1.5} />
                                </button>
                                <span className="w-6 text-center font-serif text-[22px] tabular-nums" aria-live="polite">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQty(p.id, 1)}
                                  disabled={atMax}
                                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition-opacity duration-200 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
                                  aria-label={t("step2.increase", { name })}
                                >
                                  <Plus size={14} strokeWidth={1.5} />
                                </button>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* The box, in view as you scroll (desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-32">{boxPanel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ WHY SUBSCRIBE ════════ */}
      <section className="section border-t border-border">
        <div className="container-lore">
          <Reveal>
            <h2 className="t-h1 mb-12">{t("why.label")}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ICONS.map((Icon, i) => (
              <Reveal key={i} delay={i * 60}>
                <Icon size={24} strokeWidth={1.25} className="mb-5 text-sage-mid" aria-hidden="true" />
                <h3 className="t-h3 mb-2">{t(`why.items.${i}.title`)}</h3>
                <p className="t-body text-muted-foreground">{t(`why.items.${i}.body`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="section border-t border-border">
        <div className="container-lore grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <Reveal>
            <h2 className="t-h1">{t("faq.title")}</h2>
          </Reveal>
          <div className="border-t border-border">
            {Array.from({ length: FAQ_COUNT }).map((_, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="t-h3">{t(`faq.items.${i}.q`)}</span>
                    <Plus
                      size={18}
                      strokeWidth={1.25}
                      className={`shrink-0 text-sage-mid transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="t-body measure pb-6 text-muted-foreground">{t(`faq.items.${i}.a`)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ PHONES: the box as a bar fixed to the bottom ════════ */}
      <DialogPrimitive.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
          <DialogPrimitive.Trigger asChild>
            <button type="button" className="flex h-12 w-full items-center justify-between gap-3 rounded-full bg-primary px-5 text-primary-foreground">
              <span className="text-[12px] font-medium uppercase tracking-[0.12em]">
                {t("box.mobileBar", { count: totalSelected, max: limits.max })} · <span className="tabular-nums">{formatEuro(total, lang)}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.12em]">
                {t("box.continue")} <ArrowRight size={14} />
              </span>
            </button>
          </DialogPrimitive.Trigger>
        </div>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-foreground/30 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-[61] max-h-[90dvh] overflow-y-auto rounded-t-2xl bg-background p-3 pb-[max(12px,env(safe-area-inset-bottom))] outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-10">
            <DialogPrimitive.Title className="sr-only">{t("box.title")}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">{t("box.count", { count: totalSelected, max: limits.max })}</DialogPrimitive.Description>
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            {boxPanel}
            <DialogPrimitive.Close
              aria-label={t("box.close")}
              className="absolute right-5 top-6 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X size={18} strokeWidth={1.5} />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </main>
  );
};

export default CycleBox;
