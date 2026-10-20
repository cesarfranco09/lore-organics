import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import LeafShadow from "@/components/brand/LeafShadow";

/**
 * The boxes on sunlit linen with cotton, the copy over the calm left side.
 * Wide screens: the photo fills the hero, a faint leaf shadow drifting over
 * it on a 20s loop. Tablets and phones: copy on cream, then the photo
 * (cropped to the boxes on phones).
 * "Natural, period." stays in English in every language (brief note 12).
 */

const HeroSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Desktop photo, with a cream wash on the left so the copy always reads */}
      <div className="absolute inset-0 -z-10 hidden xl:block">
        <img
          src="/media/hero-linen-2400.webp"
          srcSet="/media/hero-linen-1400.webp 1400w, /media/hero-linen-2400.webp 2400w"
          sizes="100vw"
          alt={t("hero.imageAlt")}
          fetchPriority="high"
          className="h-full w-full object-cover object-[80%_50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,248,245,0.82)_0%,rgba(250,248,245,0.55)_32%,rgba(250,248,245,0)_55%)]" />
        <LeafShadow color="rgb(60, 50, 40)" opacity={0.08} seed={12} blur={18} sunlight={false} />
      </div>

      <div className="container-lore flex items-center pb-10 pt-14 md:pb-14 md:pt-20 xl:min-h-[min(calc(100svh-108px),760px)] xl:py-20">
        <div className="max-w-[540px]">
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
            <Link to={localize("/cycle-box")} className="btn-secondary bg-background/60">
              {t("hero.ctaBox")}
            </Link>
          </div>
        </div>
      </div>

      {/* Tablets and phones: the photo below the copy */}
      <picture className="block xl:hidden">
        <source media="(min-width: 768px)" srcSet="/media/hero-linen-1400.webp" />
        <img
          src="/media/hero-linen-mobile.webp"
          alt={t("hero.imageAlt")}
          className="aspect-[4/3] w-full object-cover md:aspect-[16/8] md:object-[75%_60%]"
        />
      </picture>
    </section>
  );
};

export default HeroSection;
