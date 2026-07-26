import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const DonationSection = () => {
  const { t } = useTranslation("home");
  return (
    <section className="section-padding bg-lore-sage/20">
      <div className="max-w-3xl mx-auto text-center">
        <div className="group/heart inline-block cursor-default">
          <Heart
            size={32}
            className="text-lore-plum mx-auto mb-6 transition-all duration-500 group-hover/heart:scale-125 group-hover/heart:fill-lore-plum/30"
            strokeWidth={1}
          />
        </div>
        <p className="text-label text-secondary-foreground mb-4">{t("donation.label")}</p>
        <div className="divider-botanical mx-auto mb-10" />

        <h2 className="text-editorial-lg mb-8">
          {t("donation.heading1")}<br />{t("donation.heading2")}
        </h2>

        <p className="text-body-lg text-muted-foreground max-w-xl mx-auto mb-8">
          {t("donation.p1")}
        </p>

        <p className="text-body text-muted-foreground max-w-lg mx-auto">
          {t("donation.p2")}
        </p>
      </div>
    </section>
  );
};

export default DonationSection;
