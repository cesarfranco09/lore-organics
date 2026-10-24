import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import Reveal from "@/components/brand/Reveal";
import foundersPhoto from "@/assets/founders.webp";

const FoundersSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  return (
    <section className="section border-t border-border">
      <div className="container-lore grid items-center gap-10 md:grid-cols-[5fr_6fr] md:gap-16 lg:gap-24">
        <Reveal>
          <img
            src={foundersPhoto}
            alt={t("founders.imageAlt")}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-xl object-cover object-[center_35%]"
          />
        </Reveal>
        <Reveal delay={80}>
          <p className="eyebrow mb-7">{t("founders.label")}</p>
          <p className="t-h2 measure mb-10">{t("founders.body")}</p>
          <Link to={localize("/about")} className="link-arrow">
            {t("founders.cta")} <ArrowRight size={13} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default FoundersSection;
