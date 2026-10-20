import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useProductPricing } from "@/hooks/useProductPricing";
import { productPath, type CatalogProduct } from "@/lib/catalog";
import { formatEuro } from "@/lib/pricing";
import ProductImage from "@/components/brand/ProductImage";
import Droplets from "@/components/brand/Droplets";

/**
 * One product, one link (brief note 16): photo on cream, name, droplets,
 * size and pack, price and the Cycle Box price.
 */
const ProductCard = ({ product }: { product: CatalogProduct }) => {
  const { t, i18n } = useTranslation("shop");
  const { localize } = useLocalizedPath();
  const { price, fromBox } = useProductPricing(product);
  const lang = i18n.language;
  const name = t(`items.${product.id}.name`);

  return (
    <Link to={localize(productPath(product))} className="group block" aria-label={name}>
      <div className="relative overflow-hidden rounded-xl">
        <ProductImage
          product={product}
          alt={name}
          className="aspect-[4/5] w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          scale={0.44}
        />
        {product.comingSoon && (
          <span className="absolute left-4 top-4 rounded-full bg-background px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            {t("comingSoon")}
          </span>
        )}
      </div>
      <div className="pt-5">
        <h3 className="t-h3">{name}</h3>
        <p className="t-small mt-2 flex flex-wrap items-center gap-x-2 text-muted-foreground">
          <span className="text-sage-mid">
            <Droplets count={product.absorbency} size={9} />
          </span>
          <span>{t(`items.${product.id}.spec`)}</span>
        </p>
        <p className="t-small mt-2 text-foreground">
          {product.comingSoon
            ? t("comingSoon")
            : t("priceLine", { price: formatEuro(price("once"), lang), box: formatEuro(fromBox, lang) })}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
