import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { trackViewContent } from "@/lib/analytics";
import { CATALOG, CATEGORY_FAMILY, FAMILY_CATEGORY } from "@/lib/catalog";
import { priceFor } from "@/lib/pricing";
import Seo from "@/components/Seo";
import Reveal from "@/components/brand/Reveal";
import ProductCard from "@/components/shop/ProductCard";
import NotFound from "./NotFound";

/** The range: same cards as the homepage, with filter pills. */

const FILTERS = ["all", "pads", "tampons", "panty-liners"] as const;

const Products = () => {
  const { t } = useTranslation("shop");
  const { localize } = useLocalizedPath();
  const { category } = useParams<{ category?: string }>();
  const family = category ? CATEGORY_FAMILY[category] : undefined;
  const products = family ? CATALOG.filter((p) => p.family === family) : CATALOG;

  useEffect(() => {
    if (category && !family) return;
    trackViewContent(
      products.filter((p) => !p.comingSoon).map((p) => ({ id: p.shopifyHandle, name: p.name, price: priceFor(p.id, "once") })),
      family ? `Products: ${family}` : "Products"
    );
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  if (category && !family) return <NotFound />;

  const heading = family ? t(`categories.${FAMILY_CATEGORY[family]}.heading`) : t("heading");

  return (
    <main>
      <Seo
        title={family ? t("seo.categoryTitle", { heading }) : t("seo.title")}
        description={t("seo.description")}
        path={category ? `/products/${category}` : "/products"}
      />
      <section className="section pb-0 md:pb-0">
        <div className="container-lore">
          <Reveal>
            <h1 className="t-h1 mb-4">{t("heading")}</h1>
            <p className="t-body measure text-muted-foreground">{t("intro")}</p>
          </Reveal>

          <nav aria-label={t("heading")} className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f === "all" ? !category : f === category;
              return (
                <Link
                  key={f}
                  to={localize(f === "all" ? "/products" : `/products/${f}`)}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-10 items-center rounded-full border px-5 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
                    active ? "border-primary bg-sage-light/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(`filters.${f}`)}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="section pt-12 md:pt-16">
        <div className="container-lore">
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          <p className="t-small mt-14 text-muted-foreground">
            {t("priceNote")}{" "}
            <Link to={localize("/shipping")} className="underline underline-offset-2 hover:opacity-70">
              {t("shippingLink")}
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
};

export default Products;
