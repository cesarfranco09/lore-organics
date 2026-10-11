import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/brand/Reveal";
import GotsBadge from "@/components/brand/GotsBadge";
import { ClaimGrid } from "@/components/brand/ClaimIcon";
import LeafShadow from "@/components/brand/LeafShadow";
import ProductBox from "@/components/brand/ProductBox";
import { CLAIM_KEYS, getProduct } from "@/lib/catalog";
import { useIsMobile } from "@/hooks/use-mobile";
import cottonBoll from "@/assets/cotton-texture.webp";
import cottonField from "@/assets/sustainability-hero.webp";

/**
 * "Why Lore" as a feature explorer: the four reasons as a list on the left
 * (the active one opens to show its text) and a large visual on the right
 * that changes with it. Auto-advances while on screen until the visitor
 * picks one; stays put with reduced motion.
 */

const FEATURES = ["0", "1", "2", "3"] as const;
type FeatureKey = (typeof FEATURES)[number];
const ADVANCE_MS = 6500;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Large visual per feature. Panels sit on top of each other and cross-fade. */
const FeatureVisual = ({ feature }: { feature: FeatureKey }) => {
  const isMobile = useIsMobile();
  switch (feature) {
    case "0": // Engineered for Comfort
      return <img src={cottonBoll} alt="" className="h-full w-full object-cover" loading="lazy" />;
    case "1": // Clean by Design
      return (
        <div className="relative flex h-full w-full items-end justify-center bg-lore-day pb-[8%]">
          <LeafShadow color="rgb(10, 3, 5)" opacity={0.45} seed={31} blur={14} />
          <ProductBox product={getProduct("day-pad")} width={isMobile ? 150 : 230} turn={-26} grounded />
        </div>
      );
    case "2": // GOTS-Certified, Field to Shelf
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <img src={cottonField} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-lore-night/70" />
          <div className="relative flex flex-col gap-3 text-lore-birch sm:flex-row">
            <GotsBadge family="pads" className="bg-lore-night/40 backdrop-blur-sm" />
            <GotsBadge family="tampons" className="bg-lore-night/40 backdrop-blur-sm" />
          </div>
        </div>
      );
    default: // Transparent by Default
      return (
        <div className="relative flex h-full w-full items-center bg-lore-night px-5 text-lore-birch md:px-12">
          <LeafShadow color="rgb(10, 3, 5)" opacity={0.4} seed={57} blur={16} />
          <ClaimGrid claims={CLAIM_KEYS} columns={2} iconSize={isMobile ? 34 : 44} className="relative w-full gap-y-4 md:gap-y-7" />
        </div>
      );
  }
};

const WhyLoreSection = () => {
  const { t } = useTranslation("home");
  const [active, setActive] = useState<FeatureKey>("0");
  const [touched, setTouched] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Only auto-advance while the section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplay = inView && !touched && !prefersReducedMotion();

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => {
      setActive((a) => FEATURES[(FEATURES.indexOf(a) + 1) % FEATURES.length]);
    }, ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, active]);

  const choose = (f: FeatureKey) => {
    setTouched(true);
    setActive(f);
  };

  return (
    <section ref={sectionRef} id="why-lore" className="relative overflow-hidden bg-lore-ivory scroll-mt-20">
      <style>{`@keyframes whyProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-24 md:px-12 md:py-32 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-20">
        {/* Visual: first on phones so the list below can drive it */}
        <Reveal className="lg:order-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-[28px] shadow-[0_40px_80px_-50px_rgba(58,46,41,0.6)] lg:aspect-[4/5]">
            {FEATURES.map((f) => (
              <div
                key={f}
                id={`why-panel-${f}`}
                className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out"
                style={{
                  opacity: active === f ? 1 : 0,
                  transform: active === f ? "scale(1)" : "scale(1.03)",
                  pointerEvents: active === f ? "auto" : "none",
                }}
                aria-hidden={active !== f}
              >
                <FeatureVisual feature={f} />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="lg:order-1">
          <Reveal>
            <p className="text-label mb-6 text-lore-night/70">{t("whyLore.label")}</p>
            <h2 className="text-editorial-lg mb-4">
              {t("whyLore.heading1")}
              <br />
              <em className="font-light">{t("whyLore.heading2")}</em>
            </h2>
            <p className="mb-10 font-serif text-xl italic text-muted-foreground md:mb-12">{t("whyLore.tagline")}</p>
          </Reveal>

          <ul className="border-t border-lore-charcoal/10">
            {FEATURES.map((f, i) => {
              const open = active === f;
              return (
                <li key={f} className="relative border-b border-lore-charcoal/10">
                  <button
                    type="button"
                    onClick={() => choose(f)}
                    aria-expanded={open}
                    aria-controls={`why-panel-${f}`}
                    className="group flex w-full items-baseline gap-5 py-5 text-left md:py-6"
                  >
                    <span
                      className={`w-6 shrink-0 font-sans text-xs font-medium tabular-nums transition-colors duration-300 ${
                        open ? "text-lore-night" : "text-lore-charcoal/40"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`font-serif text-2xl font-light transition-colors duration-300 md:text-[28px] ${
                        open ? "text-lore-night" : "text-lore-charcoal/60 group-hover:text-lore-charcoal"
                      }`}
                    >
                      {t(`whyLore.features.${f}.title`)}
                    </span>
                  </button>
                  {/* Description opens smoothly (grid-rows trick animates to auto height) */}
                  <div
                    className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-body max-w-md pb-6 pl-11 text-muted-foreground">
                        {t(`whyLore.features.${f}.description`)}
                      </p>
                    </div>
                  </div>
                  {/* Auto-advance progress */}
                  {open && autoplay && (
                    <span
                      key={`${f}-progress`}
                      className="absolute -bottom-px left-0 h-px w-full origin-left bg-lore-night"
                      style={{ animation: `whyProgress ${ADVANCE_MS}ms linear forwards` }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyLoreSection;
