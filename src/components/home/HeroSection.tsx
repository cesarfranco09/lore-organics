import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import HeroBackdrop from "@/components/brand/HeroBackdrop";
import ProductBox from "@/components/brand/ProductBox";
import { getProduct } from "@/lib/catalog";
import { useIsMobile } from "@/hooks/use-mobile";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** "Natural, period." — the second half is set in italic, as on the box. */
const Tagline = ({ text }: { text: string }) => {
  const match = text.match(/^(.*?[,.])\s+(.*)$/);
  if (!match) return <>{text}</>;
  return (
    <>
      {match[1]} <em className="font-light italic">{match[2]}</em>
    </>
  );
};

const HeroSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const isMobile = useIsMobile();
  const w = isMobile ? 132 : 225;

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-lore-night text-lore-birch">
      <HeroBackdrop />
      {/* darker top edge so the transparent header always reads */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[rgba(20,8,10,0.55)] to-transparent" />
      {/* soft vignette so the type always reads */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(30,12,16,0.35),rgba(30,12,16,0.6))] md:hidden" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_80%,rgba(30,12,16,0.55),transparent_60%)]" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 items-center gap-6 px-6 pb-16 pt-32 md:px-12 lg:grid-cols-[1.05fr_1fr] lg:px-20 lg:pb-24">
        <div className="max-w-xl">
          <h1
            className="mb-8 font-sans text-[56px] font-light leading-[0.98] tracking-[-0.03em] md:text-[88px] lg:text-[104px] fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Tagline text={t("hero.title")} />
          </h1>
          <p className="text-body-lg mb-5 max-w-md opacity-85 fade-in-up" style={{ animationDelay: "0.2s" }}>
            {t("hero.body")}
          </p>
          <p className="mb-10 font-serif text-xl italic opacity-80 fade-in-up" style={{ animationDelay: "0.25s" }}>
            {t("hero.signoff")}
          </p>
          <div className="flex flex-wrap gap-3 fade-in-up" style={{ animationDelay: "0.3s" }}>
            <button type="button" onClick={() => scrollTo("waitlist")} className="btn-cream">
              {t("hero.ctaWaitlist")}
            </button>
            <Link to={localize("/products")} className="btn-ghost text-lore-birch">
              {t("hero.ctaProducts")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* The range, resting together in the leaf light: drag or hover a box to turn it */}
        <div
          className="relative mx-auto flex w-full max-w-[640px] items-end justify-center pt-4 fade-in lg:pt-24"
          style={{ animationDelay: "0.35s" }}
        >
          {/* back: sits a little higher, as if further along the ledge */}
          <div className="relative z-10 -mr-[13%] -translate-y-[6%]">
            <ProductBox product={getProduct("regular-tampon")} width={w * 0.82} turn={28} grounded />
          </div>
          <div className="relative z-20">
            <ProductBox product={getProduct("night-pad")} width={w} turn={-22} grounded />
          </div>
          {/* front: a touch lower and closer */}
          <div className="relative z-30 -ml-[15%] translate-y-[5%]">
            <ProductBox product={getProduct("day-pad")} width={w * 0.8} turn={-38} grounded />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollTo("day-night")}
        aria-label={t("hero.ctaLearn")}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full p-3 opacity-70 transition-opacity hover:opacity-100"
      >
        <ArrowDown size={18} strokeWidth={1.25} className="animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;
