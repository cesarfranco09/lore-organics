import { useTranslation } from "react-i18next";
import { ArrowDown } from "lucide-react";
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
  const isMobile = useIsMobile();
  const w = isMobile ? 120 : 190;

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-lore-night text-lore-birch">
      <HeroBackdrop />
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
            <button type="button" onClick={() => scrollTo("why-lore")} className="btn-ghost text-lore-birch">
              {t("hero.ctaLearn")}
            </button>
          </div>
        </div>

        {/* Floating range: drag or hover a box to turn it */}
        <div
          className="relative mx-auto flex h-[300px] w-full max-w-[560px] items-center justify-center md:h-[460px] lg:h-[560px] fade-in"
          style={{ animationDelay: "0.35s" }}
        >
          <div className="absolute left-[2%] top-[18%] z-10" style={{ animationDelay: "1s" }}>
            <ProductBox product={getProduct("regular-tampon")} width={w * 0.82} turn={28} float />
          </div>
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <ProductBox product={getProduct("night-pad")} width={w} turn={-22} float />
          </div>
          <div className="absolute right-[0%] top-[46%] z-30">
            <ProductBox product={getProduct("day-pad")} width={w * 0.78} turn={-40} float />
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
