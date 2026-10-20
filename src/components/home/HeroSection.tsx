import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import LeafShadow from "@/components/brand/LeafShadow";
import ProductBox from "@/components/brand/ProductBox";
import { getProduct } from "@/lib/catalog";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * A light cream wall in slow leaf-shadow daylight, the boxes standing in it.
 * "Natural, period." stays in English in every language (brief note 12).
 */

const HeroSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const isMobile = useIsMobile();
  const w = isMobile ? 100 : 190;

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* the wall: warm light from the upper left, leaves drifting across it once every 20s */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 18% 12%, rgba(255,252,246,1), rgba(255,252,246,0) 70%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(38 38% 93%) 100%)",
        }}
      />
      <LeafShadow color="rgb(60, 66, 58)" opacity={0.16} seed={12} blur={16} sunlight={false} className="-z-10" />

      <div className="container-lore grid grid-cols-[minmax(0,1fr)] items-center gap-10 pb-16 pt-14 md:pb-24 md:pt-20 lg:min-h-[calc(100svh-108px)] lg:grid-cols-[1fr_1fr] lg:gap-12 lg:py-16">
        <div className="max-w-[560px]">
          <h1 className="t-tagline mb-6 fade-in-up" lang="en">
            Natural, <em className="font-light italic">period.</em>
          </h1>
          <p className="t-body mb-4 max-w-[440px] text-foreground/85 fade-in-up" style={{ animationDelay: "0.08s" }}>
            {t("hero.body")}
          </p>
          <p className="t-lead mb-10 italic text-foreground/80 fade-in-up" style={{ animationDelay: "0.12s" }}>
            {t("hero.signoff")}
          </p>
          <div className="flex flex-wrap gap-3 fade-in-up" style={{ animationDelay: "0.16s" }}>
            <Link to={localize("/products")} className="btn-primary">
              {t("hero.ctaShop")}
            </Link>
            <Link to={localize("/cycle-box")} className="btn-secondary">
              {t("hero.ctaBox")}
            </Link>
          </div>
        </div>

        {/* The boxes on the ledge, in the same light */}
        <div
          className="relative mx-auto flex w-full max-w-[560px] items-end justify-center fade-in"
          role="img"
          aria-label={t("hero.imageAlt")}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative z-10 -mr-[12%] -translate-y-[4%]">
            <ProductBox product={getProduct("regular-tampon")} width={w * 0.84} turn={24} />
          </div>
          <div className="relative z-20">
            <ProductBox product={getProduct("night-pad")} width={w} turn={-20} />
          </div>
          <div className="relative z-30 -ml-[14%] translate-y-[3%]">
            <ProductBox product={getProduct("day-pad")} width={w * 0.8} turn={-34} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
