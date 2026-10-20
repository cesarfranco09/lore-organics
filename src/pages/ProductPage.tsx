import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, ChevronRight, Leaf, CalendarDays, Repeat, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useProductPricing } from "@/hooks/useProductPricing";
import { trackViewContent } from "@/lib/analytics";
import { CATALOG, CERTIFIERS, FAMILY_CATEGORY, productBySlug, productPath, type CatalogProduct } from "@/lib/catalog";
import { CADENCE_DISCOUNT, SUBSCRIPTION_CADENCES, formatEuro, type Cadence, type SubscriptionCadence } from "@/lib/pricing";
import Seo from "@/components/Seo";
import Reveal from "@/components/brand/Reveal";
import Droplets from "@/components/brand/Droplets";
import ProductImage, { type ProductView } from "@/components/brand/ProductImage";
import { ClaimGrid } from "@/components/brand/ClaimIcon";
import ProductCard from "@/components/shop/ProductCard";
import NotFound from "./NotFound";

/**
 * One template for every product (brief §3): gallery left, details right,
 * all on cream. Product color appears only in the pictures.
 */

interface Material {
  label: string;
  value: string;
}

/* ─── Gallery ─── */

type Slide = { kind: "photo"; src: string } | { kind: "render"; view: ProductView };

const slidesFor = (p: CatalogProduct): Slide[] => {
  // Photo slots: box front, the product, box side panel, in hand / on the shelf.
  if (p.photos && p.photos.length > 0) return p.photos.map((src) => ({ kind: "photo", src }));
  return [
    { kind: "render", view: "front" },
    { kind: "render", view: "side" },
  ];
};

const Gallery = ({ product, name }: { product: CatalogProduct; name: string }) => {
  const { t } = useTranslation("shop");
  const slides = slidesFor(product);
  const [index, setIndex] = useState(0);
  const slide = slides[Math.min(index, slides.length - 1)];

  const render = (s: Slide, className: string, scale = 0.42) =>
    s.kind === "photo" ? (
      <img src={s.src} alt={name} className={`object-cover ${className}`} />
    ) : (
      <ProductImage product={product} view={s.view} alt={name} className={className} scale={scale} priority />
    );

  return (
    <div>
      <div className="overflow-hidden rounded-xl">{render(slide, "aspect-[4/5] w-full")}</div>
      {slides.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("product.gallery.show", { n: i + 1 })}
              aria-current={i === index ? "true" : undefined}
              className={`overflow-hidden rounded-lg border-[1.5px] transition-colors duration-200 ${
                i === index ? "border-primary" : "border-transparent hover:border-border"
              }`}
            >
              {render(s, "aspect-square w-full", 0.36)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Accordion ─── */

const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-label text-foreground">{title}</span>
        <Plus size={16} strokeWidth={1.25} className={`text-sage-mid transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="t-body pb-6 text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
};

/* ─── Page ─── */

const ProductPage = () => {
  const { category = "", slug = "" } = useParams<{ category: string; slug: string }>();
  const product = productBySlug(category, slug);
  return product ? <ProductDetail key={product.id} product={product} /> : <NotFound />;
};

const ProductDetail = ({ product }: { product: CatalogProduct }) => {
  const { t, i18n } = useTranslation("shop");
  const { localize } = useLocalizedPath();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { live, price, purchasable, outOfStock } = useProductPricing(product);
  const lang = i18n.language;

  const [mode, setMode] = useState<"box" | "once">("box");
  const [cadence, setCadence] = useState<SubscriptionCadence>("3m");
  const [added, setAdded] = useState(false);
  const activeCadence: Cadence = mode === "box" ? cadence : "once";

  const item = (k: string) => t(`items.${product.id}.${k}`);
  const name = item("fullName");
  const materialsRaw = t(`items.${product.id}.materials`, { returnObjects: true });
  const materials = Array.isArray(materialsRaw) ? (materialsRaw as Material[]) : [];
  const cert = CERTIFIERS[product.family].lines;
  const related = CATALOG.filter((p) => p.id !== product.id).slice(0, 3);

  useEffect(() => {
    trackViewContent([{ id: product.shopifyHandle, name: product.name, price: price("once") }], "Product");
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const onBuy = () => {
    if (product.comingSoon) return;
    if (mode === "box") {
      navigate(`${localize("/cycle-box")}?cadence=${cadence}&add=${product.id}`);
      return;
    }
    if (!purchasable || !live) return;
    addItem({ id: product.id, name: product.name, image: product.image, price: price("once"), variantId: live.variants[0].id });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  const buyLabel = product.comingSoon
    ? t("product.purchase.comingSoon")
    : mode === "box"
      ? t("product.purchase.addToBox")
      : outOfStock
        ? t("product.purchase.outOfStock")
        : added
          ? t("product.purchase.added")
          : t("product.purchase.addToBag");
  const buyDisabled = product.comingSoon || (mode === "once" && !purchasable);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: item("description"),
    brand: { "@type": "Brand", name: "Lore Organics" },
    offers: product.comingSoon
      ? undefined
      : { "@type": "Offer", priceCurrency: "EUR", price: price("once").toFixed(2), availability: "https://schema.org/InStock" },
  };

  return (
    <main>
      <Seo title={`${name} | Lore Organics`} description={item("description")} path={productPath(product)} type="product" jsonLd={jsonLd} />

      <section className="pb-[72px] pt-8 md:pb-[120px] md:pt-10">
        <div className="container-lore">
          <nav aria-label="Breadcrumb" className="t-small mb-8 flex items-center gap-1.5 text-muted-foreground">
            <Link to={localize("/products")} className="hover:opacity-70">
              {t("product.breadcrumb")}
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link to={localize(`/products/${FAMILY_CATEGORY[product.family]}`)} className="hover:opacity-70">
              {t(`categories.${FAMILY_CATEGORY[product.family]}.heading`)}
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <Gallery product={product} name={name} />

            <div className="lg:pt-2">
              {/* 1–3: name, droplets and size, one line */}
              <h1 className="t-h1 mb-4">{name}</h1>
              <p className="t-small mb-5 flex items-center gap-2 text-muted-foreground">
                <span className="text-sage-mid">
                  <Droplets count={product.absorbency} size={10} />
                </span>
                {item("spec")}
              </p>
              <p className="t-body mb-8">{item("description")}</p>

              {/* 4: this product's claims */}
              {product.claims.length > 0 && (
                <ClaimGrid claims={product.claims} columns={3} iconSize={36} className="mb-10 border-y border-border py-8" />
              )}

              {/* 5: Cycle Box (preselected) or one-time */}
              {!product.comingSoon && (
                <fieldset className="mb-6">
                  <legend className="text-label mb-3 text-muted-foreground">{t("product.purchase.label")}</legend>
                  <div className="space-y-3">
                    <label
                      className={`block cursor-pointer rounded-xl border-[1.5px] p-5 transition-colors duration-200 ${
                        mode === "box" ? "border-primary bg-sage-light/40" : "border-border hover:border-sage-mid"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-3">
                          <input type="radio" name="mode" checked={mode === "box"} onChange={() => setMode("box")} className="sr-only" />
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] ${mode === "box" ? "border-primary bg-primary text-primary-foreground" : "border-sage-mid"}`}>
                            {mode === "box" && <Check size={11} strokeWidth={2.5} />}
                          </span>
                          <span className="t-body font-medium">{t("product.purchase.box")}</span>
                        </span>
                        <span className="t-small tabular-nums">{formatEuro(price(cadence), lang)}</span>
                      </span>
                      {mode === "box" && (
                        <span className="mt-4 block">
                          <span className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("product.purchase.every")}>
                            {SUBSCRIPTION_CADENCES.map((c) => {
                              const active = c === cadence;
                              return (
                                <button
                                  key={c}
                                  type="button"
                                  role="radio"
                                  aria-checked={active}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCadence(c);
                                  }}
                                  className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-[13px] transition-colors duration-200 ${
                                    active ? "border-primary bg-background text-primary" : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {t(`product.purchase.cadence.${c}`)}
                                  <span className="tabular-nums">· {formatEuro(price(c), lang)}</span>
                                </button>
                              );
                            })}
                          </span>
                          <span className="t-small mt-3 block text-muted-foreground">
                            {CADENCE_DISCOUNT[cadence] > 0 && <>{t("product.purchase.save", { pct: CADENCE_DISCOUNT[cadence] })} · </>}
                            {t("product.purchase.boxHint")}
                          </span>
                        </span>
                      )}
                    </label>

                    <label
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border-[1.5px] p-5 transition-colors duration-200 ${
                        mode === "once" ? "border-primary bg-sage-light/40" : "border-border hover:border-sage-mid"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input type="radio" name="mode" checked={mode === "once"} onChange={() => setMode("once")} className="sr-only" />
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] ${mode === "once" ? "border-primary bg-primary text-primary-foreground" : "border-sage-mid"}`}>
                          {mode === "once" && <Check size={11} strokeWidth={2.5} />}
                        </span>
                        <span className="t-body font-medium">{t("product.purchase.once")}</span>
                      </span>
                      <span className="t-small tabular-nums">{formatEuro(price("once"), lang)}</span>
                    </label>
                  </div>
                </fieldset>
              )}

              {/* 6: price incl. VAT, plus shipping */}
              {!product.comingSoon && (
                <p className="mb-6">
                  <span className="font-serif text-[32px] leading-none tabular-nums">{formatEuro(price(activeCadence), lang)}</span>{" "}
                  <span className="t-small text-muted-foreground">
                    {t("product.purchase.perPack")} · {t("product.purchase.inclVat")}{" "}
                    <Link to={localize("/shipping")} className="underline underline-offset-2 hover:opacity-70">
                      {t("product.purchase.shipping")}
                    </Link>
                  </span>
                </p>
              )}

              {/* 7: the button */}
              <button type="button" onClick={onBuy} disabled={buyDisabled} className="btn-primary w-full">
                {buyLabel}
              </button>
              {mode === "box" && !product.comingSoon && (
                <p className="t-small mt-3 text-muted-foreground">{t("product.purchase.firstBox")}</p>
              )}

              {/* icon row */}
              <ul className="mt-10 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-3">
                {[
                  { Icon: Leaf, key: "cotton" },
                  { Icon: CalendarDays, key: "schedule" },
                  { Icon: Repeat, key: "flexible" },
                ].map(({ Icon, key }) => (
                  <li key={key} className="t-small flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                    <Icon size={22} strokeWidth={1.25} className="shrink-0 text-sage-mid" aria-hidden="true" />
                    {t(`product.icons.${key}`)}
                  </li>
                ))}
              </ul>

              {/* one details accordion */}
              <div className="mt-10 border-t border-border">
                <AccordionItem title={t("product.accordion.materials")}>
                  <dl className="space-y-2">
                    {materials.map((m) => (
                      <div key={m.label} className="flex gap-2">
                        <dt className="font-medium text-foreground">{m.label}:</dt>
                        <dd>{m.value || <span className="italic">{t("product.accordion.specSoon")}</span>}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionItem>
                <AccordionItem title={t("product.accordion.certification")}>
                  <p className="mb-4">{t("product.accordion.certificationBody")}</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    <dt className="font-medium text-foreground">{t("product.accordion.grade")}</dt>
                    <dd>{cert[0]}</dd>
                    <dt className="font-medium text-foreground">{t("product.accordion.certifier")}</dt>
                    <dd>{cert[1]}</dd>
                    <dt className="font-medium text-foreground">{t("product.accordion.license")}</dt>
                    <dd>{cert[2]}</dd>
                  </dl>
                </AccordionItem>
                <AccordionItem title={t("product.accordion.howToUse")}>{item("howToUse")}</AccordionItem>
                {product.family === "tampons" && (
                  <AccordionItem title={t("product.accordion.safety")}>{t("product.accordion.safetyBody")}</AccordionItem>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-lore">
          <Reveal>
            <h2 className="t-h2 mb-10">{t("product.related")}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
