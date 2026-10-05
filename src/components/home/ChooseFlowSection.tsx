import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import LeafShadow from "@/components/brand/LeafShadow";
import ProductBox from "@/components/brand/ProductBox";
import Droplets from "@/components/brand/Droplets";
import Reveal from "@/components/brand/Reveal";
import { CATALOG, familyColor, onFamilyColor, type ProductId } from "@/lib/catalog";
import { CADENCE_DISCOUNT, formatEuro, priceFor, type Cadence } from "@/lib/pricing";
import { useCart } from "@/contexts/CartContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useIsMobile } from "@/hooks/use-mobile";
import { isStoreLive } from "@/lib/shopify";

/**
 * "Choose your flow, rest in comfort." (inspired by tylko.com's color
 * picker): pick a product and the whole field takes on its family color;
 * pick one-time or a delivery rhythm and buy or start a box straight away.
 */

const CADENCES: Cadence[] = ["once", "2m", "3m", "6m"];

/** Copy index in home.json → productPreview.items. */
const COPY_INDEX: Record<ProductId, string> = {
  "day-pad": "0",
  "night-pad": "1",
  "regular-tampon": "2",
  "super-tampon": "3",
  liner: "4",
};

const ChooseFlowSection = () => {
  const { t, i18n } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const isMobile = useIsMobile();
  const { addItem } = useCart();
  const { byHandle } = useShopifyProducts();
  const [selected, setSelected] = useState<ProductId>("night-pad");
  const [cadence, setCadence] = useState<Cadence>("3m");

  const product = CATALOG.find((p) => p.id === selected)!;
  const live = byHandle[product.shopifyHandle];
  const liveBase = live ? parseFloat(live.priceRange.minVariantPrice.amount) : undefined;
  const price = priceFor(product.id, cadence, liveBase);
  const purchasable = isStoreLive() && !product.comingSoon && live?.availableForSale && Boolean(live.variants[0]);
  const fg = onFamilyColor(product);
  const lang = i18n.language;

  const addToCart = () => {
    if (!purchasable || !live) return;
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: priceFor(product.id, "once", liveBase),
      variantId: live.variants[0].id,
    });
  };

  return (
    <section
      id="choose-your-flow"
      className="relative isolate overflow-hidden transition-colors duration-700 ease-out"
      style={{ background: familyColor(product), color: fg }}
    >
      <LeafShadow
        color={product.lightText ? "rgb(15, 6, 8)" : "rgb(40, 50, 40)"}
        opacity={product.lightText ? 0.42 : 0.2}
        seed={41}
        blur={18}
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-2 lg:gap-16 lg:px-20">
        {/* Visual */}
        <div className="order-2 flex justify-center lg:order-1">
          <div key={product.id} className="fade-in-up">
            <ProductBox product={product} width={isMobile ? 170 : 260} turn={-26} float />
          </div>
        </div>

        {/* Picker */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-label mb-5 opacity-75">{t("flow.label")}</p>
            <h2 className="text-editorial-lg mb-10 max-w-md">{t("flow.heading")}</h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-label mb-4 opacity-70">{t("flow.chooseProduct")}</p>
            <div className="mb-3 flex flex-wrap gap-3" role="radiogroup" aria-label={t("flow.chooseProduct")}>
              {CATALOG.map((p) => {
                const active = p.id === selected;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={t(`productPreview.items.${COPY_INDEX[p.id]}.subtitle`)}
                    onClick={() => setSelected(p.id)}
                    className="group relative flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
                  >
                    <span
                      className="absolute inset-0 rounded-full border transition-all duration-300"
                      style={{
                        borderColor: "currentColor",
                        opacity: active ? 0.9 : 0,
                        transform: active ? "scale(1.18)" : "scale(1)",
                      }}
                    />
                    <span
                      className="h-10 w-10 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12),0_4px_14px_-6px_rgba(0,0,0,0.45)]"
                      style={{ background: familyColor(p) }}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-serif text-2xl md:text-3xl">{t(`productPreview.items.${COPY_INDEX[product.id]}.title`)}</span>
              <span className="flex items-center gap-2 text-sm opacity-80">
                <Droplets count={product.absorbency} size={9} />
                {product.size && <span>{product.size}</span>}
                <span>· {t("flow.packOf", { count: product.packCount })}</span>
              </span>
            </div>
            <p className="text-body mb-10 max-w-md opacity-80">{t(`productPreview.items.${COPY_INDEX[product.id]}.description`)}</p>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-label mb-4 opacity-70">{t("flow.chooseDelivery")}</p>
            <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={t("flow.chooseDelivery")}>
              {CADENCES.map((c) => {
                const active = c === cadence;
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setCadence(c)}
                    className="relative rounded-2xl border px-3 py-3 text-left transition-all duration-300"
                    style={{
                      borderColor: active ? "currentColor" : "color-mix(in srgb, currentColor 22%, transparent)",
                      background: active ? "color-mix(in srgb, currentColor 10%, transparent)" : "transparent",
                    }}
                  >
                    <span className="block text-[11px] font-medium uppercase tracking-[0.16em]">{t(`flow.cadence.${c}`)}</span>
                    <span className="mt-1 block text-sm opacity-80">{formatEuro(priceFor(product.id, c, liveBase), lang)}</span>
                    {CADENCE_DISCOUNT[c] > 0 && (
                      <span className="absolute -top-2 right-2 rounded-full bg-lore-birch px-2 py-0.5 text-[10px] font-medium text-lore-night">
                        −{CADENCE_DISCOUNT[c]}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="mr-2">
                <span className="font-serif text-4xl">{formatEuro(price, lang)}</span>
                <span className="ml-2 text-sm opacity-70">{t("flow.perPack")}</span>
              </div>
              {cadence === "once" ? (
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!purchasable}
                  className={product.lightText ? "btn-cream" : "btn-primary"}
                >
                  <ShoppingBag size={15} strokeWidth={1.5} />
                  {purchasable ? t("flow.addToCart") : t("productPreview.comingSoon")}
                </button>
              ) : product.comingSoon ? (
                <span className={`${product.lightText ? "btn-cream" : "btn-primary"} pointer-events-none opacity-50`}>
                  {t("productPreview.comingSoon")}
                </span>
              ) : (
                <Link
                  to={`${localize("/cycle-box")}?cadence=${cadence}&add=${product.id}`}
                  className={product.lightText ? "btn-cream" : "btn-primary"}
                >
                  {t("flow.buildBox")} <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <p className="mt-5 text-xs opacity-70">{t("flow.note")}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ChooseFlowSection;
