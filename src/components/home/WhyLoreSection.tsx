import { useTranslation } from "react-i18next";
import Reveal from "@/components/brand/Reveal";
import GotsBadge from "@/components/brand/GotsBadge";
import { ClaimGrid } from "@/components/brand/ClaimIcon";
import LeafShadow from "@/components/brand/LeafShadow";
import { CLAIM_KEYS } from "@/lib/catalog";

const FEATURES = ["0", "1", "2", "3"] as const;
/** "GOTS-Certified, Field to Shelf" carries the certifier badges. */
const GOTS_FEATURE = "2";

const WhyLoreSection = () => {
  const { t } = useTranslation("home");
  return (
    <section id="why-lore" className="relative overflow-hidden bg-lore-ivory scroll-mt-20">
      <LeafShadow color="rgb(58, 46, 41)" opacity={0.08} seed={5} blur={18} sunlight={false} />
      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-36 lg:px-20">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-label mb-6 text-lore-night/70">{t("whyLore.label")}</p>
            <h2 className="text-editorial-lg">
              {t("whyLore.heading1")}
              <br />
              <em className="font-light">{t("whyLore.heading2")}</em>
            </h2>
            <p className="mt-8 font-serif text-xl italic text-muted-foreground">{t("whyLore.tagline")}</p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-3xl bg-lore-charcoal/10 sm:grid-cols-2">
            {FEATURES.map((key, i) => (
              <Reveal key={key} delay={i * 90} className="group bg-lore-ivory p-8 transition-colors duration-500 hover:bg-lore-birch md:p-10">
                <span className="mb-8 block font-serif text-sm italic text-lore-night/60">0{i + 1}</span>
                <h3 className="mb-3 font-serif text-2xl font-normal transition-colors group-hover:text-lore-night md:text-[28px]">
                  {t(`whyLore.features.${key}.title`)}
                </h3>
                <p className="text-body text-muted-foreground">{t(`whyLore.features.${key}.description`)}</p>
                {key === GOTS_FEATURE && (
                  <div className="mt-6 flex flex-wrap gap-3 text-lore-charcoal">
                    <GotsBadge family="pads" />
                    <GotsBadge family="tampons" />
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-24 border-t border-lore-charcoal/10 pt-16 text-lore-night md:mt-32">
          <ClaimGrid claims={CLAIM_KEYS} className="mx-auto max-w-4xl" />
        </Reveal>
      </div>
    </section>
  );
};

export default WhyLoreSection;
