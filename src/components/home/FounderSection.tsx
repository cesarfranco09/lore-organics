import { useTranslation } from "react-i18next";
import foundersImage from "@/assets/founders.webp";

const FounderSection = () => {
  const { t } = useTranslation("home");
  return (
    <section className="section-padding bg-lore-sage/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Image */}
        <div className="overflow-hidden">
          <img
            src={foundersImage}
            alt="Geneviève Silvestra and Rachael Hoogkamer, co-founders of Lore Organics — the organic period care brand with nothing to hide"
            className="w-full aspect-[4/3] object-cover object-[center_35%] brightness-110"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div>
          <p className="text-label text-muted-foreground mb-4">{t("founder.label")}</p>
          <div className="divider-botanical mb-8" />
          <h2 className="text-editorial-lg mb-8">
            {t("founder.heading1")}<br />{t("founder.heading2")}
          </h2>

          <div className="space-y-4">
            {["0", "1"].map((key) => (
              <div
                key={key}
                className="group/founder p-6 -mx-6 rounded-sm transition-all duration-300 hover:bg-lore-sage/15 hover:shadow-[0_2px_16px_-4px_hsl(var(--lore-sage)/0.2)]"
              >
                <h3 className="font-serif text-xl font-semibold mb-1">{t(`founder.founders.${key}.name`)}</h3>
                <p className="text-label text-muted-foreground mb-3">{t(`founder.founders.${key}.role`)}</p>
                <p className="text-body text-muted-foreground">{t(`founder.founders.${key}.bio`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
