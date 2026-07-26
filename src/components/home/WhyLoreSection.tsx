import { Leaf, Shield, Eye, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  { icon: Leaf, key: "0" },
  { icon: Shield, key: "1" },
  { icon: Eye, key: "2" },
  { icon: Heart, key: "3" },
];

const WhyLoreSection = () => {
  const { t } = useTranslation("home");
  return (
    <section id="why-lore" className="section-padding bg-card">
      <div className="max-w-5xl mx-auto">
        <div>
          <p className="text-label text-muted-foreground mb-4">{t("whyLore.label")}</p>
          <div className="divider-botanical mb-8" />
          <h2 className="text-editorial-lg mb-12">
            {t("whyLore.heading1")}<br />{t("whyLore.heading2")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.key}
                className="group p-5 -m-5 rounded-sm transition-all duration-300 hover:bg-lore-sage/15 hover:shadow-[0_4px_20px_-4px_hsl(var(--lore-sage)/0.2)]"
              >
                <div className="w-12 h-12 rounded-full bg-lore-sage/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-lore-sage/35 group-hover:scale-110">
                  <feature.icon
                    size={22}
                    className="text-lore-botanical transition-transform duration-300"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2">{t(`whyLore.features.${feature.key}.title`)}</h3>
                <p className="text-body text-muted-foreground">{t(`whyLore.features.${feature.key}.description`)}</p>
              </div>
            ))}
          </div>

          <p className="font-serif italic text-center text-muted-foreground mt-12">
            {t("whyLore.tagline")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyLoreSection;
