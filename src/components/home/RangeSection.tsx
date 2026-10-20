import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { CATALOG } from "@/lib/catalog";
import ProductCard from "@/components/shop/ProductCard";
import Reveal from "@/components/brand/Reveal";

/**
 * "The range.": pads, then tampons, every product shown directly. Liners sit
 * with the pads as "Coming soon"; the tampon row ends with the way into the
 * Cycle Box.
 */

const PADS = CATALOG.filter((p) => p.family === "pads" || p.family === "liners");
const TAMPONS = CATALOG.filter((p) => p.family === "tampons");

const BoxCard = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  return (
    <Link
      to={localize("/cycle-box")}
      className="group flex aspect-[4/5] flex-col justify-end rounded-xl border border-sage-light bg-sage-light/40 p-6 md:p-8"
    >
      <h3 className="t-h3 mb-3">{t("range.boxCard.title")}</h3>
      <p className="t-body mb-6 text-muted-foreground">{t("range.boxCard.body")}</p>
      <span className="link-arrow">
        {t("range.boxCard.cta")} <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
};

const RangeSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();

  return (
    <section id="range" className="section scroll-mt-28">
      <div className="container-lore">
        <Reveal>
          <h2 className="t-h1 mb-12 md:mb-16">{t("range.heading")}</h2>
        </Reveal>

        <div className="space-y-14 md:space-y-20">
          {[
            { label: t("range.pads"), products: PADS, extra: null },
            { label: t("range.tampons"), products: TAMPONS, extra: <BoxCard key="box" /> },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-label mb-5 text-muted-foreground">{row.label}</p>
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {row.products.map((p, i) => (
                  <Reveal key={p.id} delay={i * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
                {row.extra && <Reveal delay={row.products.length * 60}>{row.extra}</Reveal>}
              </div>
            </div>
          ))}
        </div>

        <p className="t-small mt-12 text-muted-foreground">
          {t("range.priceNote")}{" "}
          <Link to={localize("/shipping")} className="underline underline-offset-2 hover:opacity-70">
            {t("range.shippingLink")}
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default RangeSection;
