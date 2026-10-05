import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ShoppingBag, Move3d } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/contexts/CartContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useIsMobile } from "@/hooks/use-mobile";
import { isStoreLive } from "@/lib/shopify";
import { trackViewContent } from "@/lib/analytics";
import { CATALOG, familyColor, onFamilyColor, type CatalogProduct, type ProductFamily } from "@/lib/catalog";
import { CADENCE_DISCOUNT, formatEuro, priceFor, type Cadence } from "@/lib/pricing";
import Seo from "@/components/Seo";
import LeafShadow from "@/components/brand/LeafShadow";
import ProductBox from "@/components/brand/ProductBox";
import Droplets from "@/components/brand/Droplets";
import Reveal from "@/components/brand/Reveal";
import GotsBadge from "@/components/brand/GotsBadge";
import { ClaimIcon } from "@/components/brand/ClaimIcon";

/** URL category → catalog family. */
const CATEGORY_FAMILY: Record<string, ProductFamily> = {
  pads: "pads",
  tampons: "tampons",
  "panty-liners": "liners",
};
const KNOWN_CATEGORIES = Object.keys(CATEGORY_FAMILY);
const CADENCES: Cadence[] = ["once", "2m", "3m", "6m"];

/** One product, on its own family color field. */
const ProductPanel = ({ product, index }: { product: CatalogProduct; index: number }) => {
  const { t, i18n } = useTranslation("products");
  const { t: tc } = useTranslation();
  const { t: th } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const { addItem } = useCart();
  const { byHandle } = useShopifyProducts();
  const isMobile = useIsMobile();
  const [cadence, setCadence] = useState<Cadence>("once");

  const live = byHandle[product.shopifyHandle];
  const liveBase = live ? parseFloat(live.priceRange.minVariantPrice.amount) : undefined;
  const storeLive = isStoreLive();
  const purchasable = storeLive && !product.comingSoon && live?.availableForSale && Boolean(live.variants[0]);
  // In Shopify but not sellable (e.g. inventory at 0) → "Out of Stock".
  const outOfStock = storeLive && !product.comingSoon && live && !live.availableForSale;
  const lang = i18n.language;
  const fg = onFamilyColor(product);
  const reversed = index % 2 === 1;

  // Materials come back as an array once the namespace has loaded.
  const translatedMaterials = t(`items.${product.id}.materials`, { returnObjects: true });
  const materials = Array.isArray(translatedMaterials) ? (translatedMaterials as string[]) : [];

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

  const showPrice = !product.comingSoon;

  return (
    <section
      id={product.id}
      className="relative isolate overflow-hidden scroll-mt-24"
      style={{ background: familyColor(product), color: fg }}
    >
      <LeafShadow
        color={product.lightText ? "rgb(15, 6, 8)" : "rgb(40, 50, 40)"}
        opacity={product.lightText ? 0.4 : 0.18}
        seed={index * 13 + 3}
        blur={16}
      />
      <div
        className={`relative z-10 mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-2 lg:gap-16 lg:px-20 ${
          reversed ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal className="flex flex-col items-center">
          <ProductBox product={product} width={isMobile ? 180 : 280} turn={reversed ? 24 : -24} />
          <p className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] opacity-60">
            <Move3d size={13} strokeWidth={1.25} /> {t("dragToTurn")}
          </p>
        </Reveal>

        <Reveal delay={120}>
          {product.comingSoon && (
            <span
              className="mb-5 inline-block rounded-full px-4 py-1 text-[10px] font-medium uppercase tracking-[0.22em]"
              style={{ background: "color-mix(in srgb, currentColor 12%, transparent)" }}
            >
              {t("buttons.comingSoon")}
            </span>
          )}
          <h2 className="text-editorial-lg mb-5">{t(`items.${product.id}.title`)}</h2>
          <p className="text-body-lg mb-6 max-w-lg opacity-85">{t(`items.${product.id}.description`)}</p>

          <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm opacity-85">
            <span className="flex items-center gap-2">
              <Droplets count={product.absorbency} size={10} />
              {t(`items.${product.id}.variants.0`)}
            </span>
            {product.size && <span>{product.size}</span>}
            <span>{th("flow.packOf", { count: product.packCount })}</span>
          </div>

          {showPrice && (
            <div className="mb-6 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={th("flow.chooseDelivery")}>
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
                    <span className="block text-[11px] font-medium uppercase tracking-[0.16em]">{th(`flow.cadence.${c}`)}</span>
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
          )}

          <div className="mb-14 flex flex-wrap items-center gap-4">
            {showPrice && (
              <span className="mr-2 font-serif text-4xl">{formatEuro(priceFor(product.id, cadence, liveBase), lang)}</span>
            )}
            {cadence === "once" || product.comingSoon ? (
              <button
                type="button"
                onClick={addToCart}
                disabled={!purchasable}
                className={product.lightText ? "btn-cream" : "btn-primary"}
              >
                <ShoppingBag size={15} strokeWidth={1.5} />
                {purchasable ? t("buttons.addToCart") : outOfStock ? t("buttons.outOfStock") : t("buttons.comingSoon")}
              </button>
            ) : (
              <Link
                to={`${localize("/cycle-box")}?cadence=${cadence}&add=${product.id}`}
                className={product.lightText ? "btn-cream" : "btn-primary"}
              >
                {th("flow.buildBox")} <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="grid gap-10 border-t pt-10 md:grid-cols-2" style={{ borderColor: "color-mix(in srgb, currentColor 20%, transparent)" }}>
            <div>
              <h3 className="text-label mb-4 opacity-70">{t("sections.materials")}</h3>
              <ul className="space-y-2">
                {materials.map((m) => (
                  <li key={m} className="flex items-start gap-3 text-sm leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-label mb-4 opacity-70">{t("sections.certifications")}</h3>
              <GotsBadge family={product.family} />
            </div>
          </div>

          {product.claims.length > 0 && (
            <ul className="mt-10 grid max-w-xl grid-cols-3 gap-x-6 gap-y-8">
              {product.claims.map((c) => (
                <li key={c} className="flex flex-col items-center gap-2 text-center">
                  <ClaimIcon claim={c} size={40} />
                  <span className="max-w-[16ch] text-[10px] font-medium uppercase leading-snug tracking-[0.14em]">{tc(`claims.${c}`)}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
};

const Products = () => {
  const { category } = useParams<{ category?: string }>();
  const { t } = useTranslation("products");
  const { localize } = useLocalizedPath();

  const family = category ? CATEGORY_FAMILY[category] : undefined;
  const filteredProducts = family ? CATALOG.filter((p) => p.family === family) : CATALOG;

  // Meta ViewContent + GA4 view_item_list, once per category view.
  useEffect(() => {
    const fam = category ? CATEGORY_FAMILY[category] : undefined;
    const visible = fam ? CATALOG.filter((p) => p.family === fam) : CATALOG;
    trackViewContent(
      visible.map((p) => ({ id: p.shopifyHandle, name: p.name, price: priceFor(p.id, "once") })),
      category ?? "all-products"
    );
  }, [category]);

  const knownCategory = category && KNOWN_CATEGORIES.includes(category) ? category : undefined;
  const heroLabel = knownCategory ? t(`categories.${knownCategory}.label`) : t("hero.label");
  const heroHeading = knownCategory ? t(`categories.${knownCategory}.heading`) : t("hero.heading");
  const heroDescription = knownCategory ? t(`categories.${knownCategory}.description`) : t("hero.description");

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: heroHeading,
    description: heroDescription,
    hasPart: filteredProducts.map((p) => ({
      "@type": "Product",
      name: p.name,
      description: t(`items.${p.id}.description`),
      image: `https://www.lore-organics.com${p.image}`,
      brand: { "@type": "Brand", name: "Lore Organics" },
      offers: {
        "@type": "Offer",
        price: priceFor(p.id, "once").toFixed(2),
        priceCurrency: "EUR",
        availability: p.comingSoon ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      },
    })),
  };

  const seoTitle = knownCategory ? t("seo.categoryTitle", { heading: heroHeading }) : t("seo.title");
  const seoDescription = knownCategory ? heroDescription : t("seo.description");
  const seoPath = category ? `/products/${category}` : "/products";

  const filters = [
    { href: "/products", label: t("hero.label"), active: !category },
    ...KNOWN_CATEGORIES.map((c) => ({ href: `/products/${c}`, label: t(`categories.${c}.label`), active: category === c })),
  ];

  return (
    <main>
      <Seo title={seoTitle} description={seoDescription} path={seoPath} jsonLd={productJsonLd} />

      <section className="relative overflow-hidden bg-lore-ivory px-6 pb-16 pt-40 text-center md:pb-20 md:pt-48">
        <LeafShadow color="rgb(58, 46, 41)" opacity={0.12} seed={2} blur={16} sunlight={false} />
        <div className="relative">
          <p className="text-label mb-6 text-lore-night/70 fade-in-up">{heroLabel}</p>
          <h1 className="text-editorial-xl mb-6 fade-in-up" style={{ animationDelay: "0.1s" }}>
            {heroHeading}
          </h1>
          <p className="text-body-lg mx-auto mb-10 max-w-xl text-muted-foreground fade-in-up" style={{ animationDelay: "0.2s" }}>
            {heroDescription}
          </p>
          <nav className="inline-flex flex-wrap justify-center gap-2 fade-in-up" style={{ animationDelay: "0.3s" }}>
            {filters.map((f) => (
              <Link
                key={f.href}
                to={localize(f.href)}
                className={`rounded-full border px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                  f.active
                    ? "border-lore-night bg-lore-night text-lore-birch"
                    : "border-lore-charcoal/15 text-lore-charcoal/70 hover:border-lore-night hover:text-lore-night"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {filteredProducts.map((product, index) => (
        <ProductPanel key={product.id} product={product} index={index} />
      ))}

      <section className="bg-lore-ivory px-6 py-24 text-center md:py-32">
        <Reveal>
          <h2 className="text-editorial-lg mb-6">{t("cta.heading")}</h2>
          <p className="text-body mx-auto mb-10 max-w-md text-muted-foreground">{t("cta.body")}</p>
          <Link to={localize("/cycle-box")} className="btn-primary">
            {t("cta.button")} <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
};

export default Products;
