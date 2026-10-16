import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import LeafShadow from "@/components/brand/LeafShadow";
import ProductBox from "@/components/brand/ProductBox";
import Droplets from "@/components/brand/Droplets";
import { CATALOG, type CatalogProduct } from "@/lib/catalog";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
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

/** Memoized: the section re-renders on every scroll frame, the tiles don't need to. */
const ProductTile = memo(function ProductTile({
  product,
  width,
  light,
  lite,
}: {
  product: CatalogProduct;
  width: number;
  light: boolean;
  lite: boolean;
}) {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const i = COPY_INDEX[product.id];
  return (
    <div className="flex flex-col items-center text-center">
      <ProductBox product={product} width={width} turn={-20} lite={lite} interactive={!lite} />
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
});

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const segment = (p: number, start: number, end: number) => clamp01((p - start) / (end - start));
const mixColor = (n: number) => `color-mix(in srgb, #3A2E29 ${Math.round((1 - n) * 100)}%, #F7F5F1)`;

type Els = Record<
  "stage" | "dusk" | "night" | "sun" | "moon" | "stars" | "leaves" | "dayLabel" | "nightLabel" | "dayGroup" | "nightGroup" | "dot",
  HTMLElement | null
>;

/**
 * Drives the scene straight from the scroll position: each moving element
 * gets its own opacity/transform written directly (cheap for the browser, and
 * no React render per frame). React only re-renders when one of the few
 * discrete states flips (which group is clickable, light/dark captions).
 */
function useDayNightScroll(sectionRef: React.RefObject<HTMLElement>, els: React.MutableRefObject<Els>) {
  const [phase, setPhase] = useState({ dayActive: true, nightActive: false, light: false });
  useEffect(() => {
    let frame = 0;
    let colorStep = -1;
    const update = () => {
      frame = 0;
      const sec = sectionRef.current;
      const e = els.current;
      if (!sec || !e.stage) return;
      const r = sec.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
      const n = segment(p, 0.34, 0.66);
      const dayOut = segment(p, 0.3, 0.5);
      const nightIn = segment(p, 0.5, 0.72);
      const dl = segment(p, 0.4, 0.5);
      const nl = segment(p, 0.5, 0.6);
      const vh = window.innerHeight;
      const set = (el: HTMLElement | null, opacity: number, transform?: string) => {
        if (!el) return;
        el.style.opacity = opacity.toFixed(3);
        if (transform !== undefined) el.style.transform = transform;
      };
      set(e.dusk, Math.sin(Math.PI * n));
      set(e.night, n);
      set(e.sun, 1 - n * 0.9, `translate3d(0, ${(n * 0.85 * vh).toFixed(1)}px, 0)`);
      // On phones the moon stops a little lower so it clears the "By night" label.
      const moonRise = window.innerWidth < 768 ? 0.58 : 0.72;
      set(e.moon, nightIn, `translate3d(0, ${(-nightIn * moonRise * vh).toFixed(1)}px, 0)`);
      set(e.stars, nightIn);
      set(e.leaves, 1 - n);
      set(e.dayLabel, 1 - dl, `translate3d(0, ${(-dl * 20).toFixed(1)}px, 0)`);
      set(e.nightLabel, nl, `translate3d(0, ${((1 - nl) * 20).toFixed(1)}px, 0)`);
      set(e.dayGroup, 1 - dayOut, `translate3d(0, ${(-dayOut * 60).toFixed(1)}px, 0)`);
      set(e.nightGroup, nightIn, `translate3d(0, ${((1 - nightIn) * 80).toFixed(1)}px, 0)`);
      if (e.dot) e.dot.style.left = `${(p * 100).toFixed(2)}%`;
      // Text color: inherited by everything below, so change it in 10 steps, not every frame.
      const step = Math.round(n * 10);
      if (step !== colorStep) {
        colorStep = step;
        e.stage.style.color = mixColor(step / 10);
      }
      const next = { dayActive: p < 0.4, nightActive: p > 0.61, light: p > 0.52 };
      setPhase((cur) =>
        cur.dayActive === next.dayActive && cur.nightActive === next.nightActive && cur.light === next.light ? cur : next
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionRef, els]);
  return phase;
}

const DayNightSection = () => {
  const { t } = useTranslation("home");
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const els = useRef<Els>({
    stage: null, dusk: null, night: null, sun: null, moon: null, stars: null, leaves: null,
    dayLabel: null, nightLabel: null, dayGroup: null, nightGroup: null, dot: null,
  });
  const bind = (key: keyof Els) => (el: HTMLElement | null) => {
    els.current[key] = el;
  };
  const { dayActive, nightActive, light } = useDayNightScroll(sectionRef, els);

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

  const starField = useMemo(
    () =>
      (isMobile ? stars.slice(0, 28) : stars).map((s, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-lore-birch ${isMobile ? "" : "animate-pulse"}`}
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
      )),
    [stars, isMobile]
  );

  // Moving layers get their own compositing layer.
  const layer = { willChange: "opacity, transform" } as const;

  return (
    <section id="day-night" ref={sectionRef} className="relative" style={{ height: isMobile ? "230vh" : "340vh" }}>
      <div ref={bind("stage")} className="sticky top-0 h-[100svh] overflow-hidden" style={{ color: mixColor(0) }}>
        {/* Sky layers */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #F6EEDF 0%, #EFE9E2 70%, #E9DFD2 100%)" }} />
        <div
          className="absolute inset-0"
          ref={bind("dusk")}
          style={{
            ...layer,
            opacity: 0,
            background: "linear-gradient(180deg, #8E5A63 0%, #C88F84 55%, #E7B99A 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          ref={bind("night")}
          style={{ ...layer, opacity: 0, background: "linear-gradient(180deg, #1E1013 0%, #341D21 45%, #563037 100%)" }}
        />

        {/* Sun sets, moon rises (moved with transforms: no layout work per frame) */}
        <div
          className="absolute left-[72%] top-[10%] h-28 w-28 rounded-full md:h-40 md:w-40"
          ref={bind("sun")}
          style={{
            ...layer,
            background: "radial-gradient(circle, #FFF6E3 0%, #FBE3C0 45%, rgba(251,227,192,0) 70%)",
          }}
        />
        <div
          className="absolute right-[14%] top-full h-16 w-16 rounded-full md:right-[22%] md:h-24 md:w-24"
          ref={bind("moon")}
          style={{
            ...layer,
            opacity: 0,
            boxShadow: "inset -14px 8px 0 0 #F7F5F1, 0 0 60px 6px rgba(247,245,241,0.15)",
          }}
        />
        <div ref={bind("stars")} className="absolute inset-0" style={{ ...layer, opacity: 0 }} aria-hidden="true">
          {starField}
        </div>

        <div ref={bind("leaves")} className="absolute inset-0" style={layer}>
          <LeafShadow color="rgb(58, 46, 41)" opacity={0.2} seed={23} blur={14} sunlight={false} still={isMobile} />
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
                ref={bind("dayLabel")}
              >
                {t("dayNight.day")}
              </span>
              <span
                className="absolute right-0 top-0 font-serif text-4xl font-light italic md:text-6xl"
                ref={bind("nightLabel")}
                style={{ opacity: 0 }}
              >
                {t("dayNight.night")}
              </span>
            </div>
          </div>

          {/* Stage */}
          <div className="relative flex-1">
            <div
              className="absolute inset-0 grid grid-cols-2 content-center justify-items-center gap-x-2 gap-y-4 md:grid-cols-4 md:gap-6"
              ref={bind("dayGroup")}
              style={{ ...layer, pointerEvents: dayActive ? "auto" : "none" }}
              aria-hidden={!dayActive}
            >
              {DAY.map((prod) => (
                <ProductTile key={prod.id} product={prod} width={boxW} light={false} lite={isMobile} />
              ))}
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              ref={bind("nightGroup")}
              style={{ ...layer, opacity: 0, pointerEvents: nightActive ? "auto" : "none" }}
              aria-hidden={!nightActive}
            >
              {NIGHT.map((prod) => (
                <ProductTile key={prod.id} product={prod} width={boxW * 1.45} light={light} lite={isMobile} />
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
                ref={bind("dot")}
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
