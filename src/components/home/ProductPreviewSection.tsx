import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const products = [
  {
    key: "0",
    image: "/lovable-uploads/04047f50-d84c-44fc-ac50-75a7c7e4e9b7.webp",
    color: "bg-lore-sage/30",
    alt: "Lore Organics organic cotton day pad in sage packaging, GOTS certified plastic free period care for the Netherlands",
  },
  {
    key: "1",
    image: "/lovable-uploads/d9a68e9d-d5ef-4bd6-b562-368f41f4532d.webp",
    color: "bg-lore-terracotta/10",
    alt: "Lore Organics organic cotton night pad in plum packaging, biodegradable 280mm sustainable period care",
  },
  {
    key: "2",
    image: "/lovable-uploads/tampons-box-2.webp",
    color: "bg-lore-linen",
    alt: "Lore Organics GOTS certified organic cotton regular tampons box with 360° Cottonlock safety veil, plastic free",
  },
  {
    key: "3",
    image: "/lovable-uploads/tampons-box-super.webp",
    color: "bg-lore-sage/10",
    alt: "Lore Organics organic cotton super tampons for heavier flow, GOTS certified organic tampons with no synthetic fibres",
  },
  {
    key: "4",
    image: "/lovable-uploads/daae0592-f7db-4ec4-99be-058364328e9a.webp",
    color: "bg-lore-linen",
    comingSoon: true,
    alt: "Lore Organics organic cotton pantyliner, ultra-thin biodegradable period care for daily wear",
  },
];

const ProductPreviewSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  return (
    <section className="section-padding">
      <div className="text-center mb-16">
        <p className="text-label text-muted-foreground mb-4">{t("productPreview.label")}</p>
        <div className="divider-botanical mx-auto mb-8" />
        <h2 className="text-editorial-lg">{t("productPreview.heading")}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
        {products.map((product) => (
          <Link
            to={localize("/products")}
            key={product.key}
            className="group block"
          >
            <div
              className={`${product.color} p-6 md:p-8 mb-6 overflow-hidden transition-all duration-500 ease-out group-hover:shadow-[0_12px_40px_-12px_hsl(var(--foreground)/0.12)] group-hover:translate-y-[-6px]`}
            >
              <img
                src={product.image}
                alt={product.alt}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-label text-muted-foreground mb-2">{t(`productPreview.items.${product.key}.subtitle`)}</p>
              {product.comingSoon && (
                <span className="inline-block text-label text-lore-botanical bg-lore-sage/30 px-3 py-1 mb-3 rounded-full">
                  {t("productPreview.comingSoon")}
                </span>
              )}
              <h3 className="font-serif text-2xl font-medium mb-2">{t(`productPreview.items.${product.key}.title`)}</h3>
              <p className="text-body text-muted-foreground mb-4">{t(`productPreview.items.${product.key}.description`)}</p>
              <span className="inline-flex items-center gap-2 text-label text-foreground transition-all duration-300 group-hover:gap-4">
                {t("productPreview.explore")} <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductPreviewSection;
