import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import LeafShadow from "@/components/brand/LeafShadow";
import ProductBox from "@/components/brand/ProductBox";
import Droplets from "@/components/brand/Droplets";
import { CATALOG, type CatalogProduct } from "@/lib/catalog";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useScrollProgress, segment } from "@/hooks/useScrollProgress";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Day → night (inspired by takearecess.com). A pinned scene whose sky moves
 * from morning light to night as you scroll: day pads, tampons and liners by
 * day; the night pad once the moon is up. Tampons stay in the day scene, as
 * they aren't meant to be worn overnight.
 */

/** Index of each product's copy in home.json → productPreview.items. */
const COPY_INDEX: Record<string, string> = {
  "day-pad": "0",
  "night-pad": "1",
  "regular-tampon": "2",
  "super-tampon": "3",
  liner: "4",
};

const DAY = CATALOG.filter((p) => !p.night);
const NIGHT = CATALOG.filter((p) => p.night);

const mix = (a: string, b: string, t: number) =>
  `color-mix(in srgb, ${a} ${Math.round((1 - t) * 100)}%, ${b})`;

const ProductTile = ({
  product,
  width,
  light,
}: {
  product: CatalogProduct;
  width: number;
  light: boolean;
}) => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const i = COPY_INDEX[product.id];
  return (
    <div className="flex flex-col items-center text-center">
      <ProductBox product={product} width={width} turn={-20} />
      <div className="-mt-2 max-w-[230px]">
        <p className="text-label mb-1 flex items-center justify-center gap-2 opacity-75">
          {t(`productPreview.items.${i}.subtitle`)}
          <Droplets count={product.absorbency} size={8} />
        </p>
        {product.comingSoon && (
          <span
            className="mb-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ background: light ? "rgba(247,245,241,0.15)" : "rgba(58,46,41,0.08)" }}
          >
            {t("productPreview.comingSoon")}
          </span>
        )}
        <p className="hidden text-sm leading-relaxed opacity-75 md:block">{t(`productPreview.items.${i}.description`)}</p>
        <Link
          to={localize("/products")}
          className="group mt-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em]"
        >
          {t("productPreview.explore")}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

const DayNightSection = () => {
  const { t } = useTranslation("home");
  const isMobile = useIsMobile();
  const [ref, p] = useScrollProgress<HTMLDivElement>("sticky");

  // n: 0 = full day, 1 = full night
  const n = segment(p, 0.34, 0.66);
  const dusk = Math.sin(Math.PI * n);
  const dayOut = segment(p, 0.3, 0.5);
  const nightIn = segment(p, 0.5, 0.72);
  const light = n > 0.55;

  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        x: (i * 137.5) % 100,
        y: ((i * 61.8) % 70) + 2,
        s: (i % 3) + 1,
        d: (i % 7) * 0.4,
      })),
    []
  );

  const boxW = isMobile ? 92 : 150;

  return (
    <section id="day-night" ref={ref} className="relative" style={{ height: "340vh" }}>
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ color: mix("#3A2E29", "#F7F5F1", n) }}
      >
        {/* Sky layers */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #F6EEDF 0%, #EFE9E2 70%, #E9DFD2 100%)" }} />
        <div
          className="absolute inset-0"
          style={{ opacity: dusk, background: "linear-gradient(180deg, #8E5A63 0%, #C88F84 55%, #E7B99A 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ opacity: n, background: "linear-gradient(180deg, #1E1013 0%, #341D21 45%, #563037 100%)" }}
        />

        {/* Sun sets, moon rises */}
        <div
          className="absolute left-[72%] h-28 w-28 rounded-full md:h-40 md:w-40"
          style={{
            top: `${10 + n * 85}%`,
            opacity: 1 - n * 0.9,
            background: "radial-gradient(circle, #FFF6E3 0%, #FBE3C0 45%, rgba(251,227,192,0) 70%)",
            filter: "blur(2px)",
          }}
        />
        <div
          className="absolute right-[14%] h-16 w-16 rounded-full md:right-[22%] md:h-24 md:w-24"
          style={{
            top: `${100 - nightIn * 72}%`,
            opacity: nightIn,
            boxShadow: "inset -14px 8px 0 0 #F7F5F1, 0 0 60px 6px rgba(247,245,241,0.15)",
          }}
        />
        <div className="absolute inset-0" style={{ opacity: nightIn }} aria-hidden="true">
          {stars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-lore-birch animate-pulse"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.s,
                height: s.s,
                opacity: 0.35 + (i % 4) * 0.15,
                animationDelay: `${s.d}s`,
                animationDuration: `${3 + (i % 5)}s`,
              }}
            />
          ))}
        </div>

        <div style={{ opacity: 1 - n }} className="absolute inset-0">
          <LeafShadow color="rgb(58, 46, 41)" opacity={0.2} seed={23} blur={14} sunlight={false} />
        </div>

        {/* Copy */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col px-6 pt-32 md:px-12 md:pt-36 lg:px-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-label mb-4 opacity-70">{t("productPreview.label")}</p>
              <h2 className="text-editorial-lg">{t("productPreview.heading")}</h2>
            </div>
            <div className="relative h-14 min-w-[8rem] shrink-0 whitespace-nowrap text-right md:h-20 md:min-w-[16rem]">
              <span
                className="absolute right-0 top-0 font-serif text-4xl font-light italic md:text-6xl"
                style={{ opacity: 1 - segment(p, 0.4, 0.5), transform: `translateY(${-segment(p, 0.4, 0.5) * 20}px)` }}
              >
                {t("dayNight.day")}
              </span>
              <span
                className="absolute right-0 top-0 font-serif text-4xl font-light italic md:text-6xl"
                style={{ opacity: segment(p, 0.5, 0.6), transform: `translateY(${(1 - segment(p, 0.5, 0.6)) * 20}px)` }}
              >
                {t("dayNight.night")}
              </span>
            </div>
          </div>

          {/* Stage */}
          <div className="relative flex-1">
            <div
              className="absolute inset-0 grid grid-cols-2 content-center justify-items-center gap-x-2 gap-y-4 md:grid-cols-4 md:gap-6"
              style={{
                opacity: 1 - dayOut,
                transform: `translateY(${-dayOut * 60}px)`,
                pointerEvents: dayOut > 0.5 ? "none" : "auto",
              }}
            >
              {DAY.map((prod) => (
                <ProductTile key={prod.id} product={prod} width={boxW} light={false} />
              ))}
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: nightIn,
                transform: `translateY(${(1 - nightIn) * 80}px)`,
                pointerEvents: nightIn > 0.5 ? "auto" : "none",
              }}
            >
              {NIGHT.map((prod) => (
                <ProductTile key={prod.id} product={prod} width={boxW * 1.45} light={light} />
              ))}
            </div>
          </div>

          {/* Day → night progress */}
          <div className="mb-6 flex items-center gap-3 md:mb-10" aria-hidden="true">
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">{t("dayNight.day")}</span>
            <div className="relative h-px flex-1">
              <div className="absolute inset-0 bg-current opacity-25" />
              <div
                className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
                style={{ left: `${p * 100}%` }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">{t("dayNight.night")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DayNightSection;
