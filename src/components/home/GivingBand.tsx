import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import Reveal from "@/components/brand/Reveal";

/** The giving band on a light sage panel. */
const GivingBand = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  return (
    <section className="section">
      <div className="container-lore">
        <Reveal className="rounded-xl bg-sage-light/40 px-6 py-14 text-center md:px-16 md:py-20">
          <h2 className="t-h1 mb-6 italic">{t("giving.title")}</h2>
          <p className="t-body measure mx-auto mb-10 text-foreground/85">{t("giving.body")}</p>
          <Link to={localize("/giving")} className="btn-secondary">
            {t("giving.cta")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default GivingBand;
