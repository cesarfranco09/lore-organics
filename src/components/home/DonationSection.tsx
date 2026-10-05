import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import LeafShadow from "@/components/brand/LeafShadow";
import Reveal from "@/components/brand/Reveal";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

/** Giving teaser: "From one woman to another". */
const DonationSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  return (
    <section className="relative isolate overflow-hidden bg-lore-day text-lore-birch">
      <LeafShadow color="rgb(15, 6, 8)" opacity={0.45} seed={77} blur={16} />
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 px-6 py-24 md:px-12 md:py-36 lg:grid-cols-2 lg:px-20">
        <Reveal>
          <p className="text-label mb-6 opacity-75">{t("donation.label")}</p>
          <h2 className="text-editorial-lg">
            {t("donation.heading1")}
            <br />
            <em className="font-light">{t("donation.heading2")}</em>
          </h2>
        </Reveal>
        <Reveal delay={120} className="lg:pt-16">
          <p className="text-body-lg mb-6 opacity-90">{t("donation.p1")}</p>
          <p className="text-body mb-10 opacity-75">{t("donation.p2")}</p>
          <Link to={localize("/impact")} className="btn-cream">
            {t("donation.cta")} <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default DonationSection;
