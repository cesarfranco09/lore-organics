import { Leaf, Recycle, TreePine, Sun, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";
import sustainabilityHero from "@/assets/sustainability-hero.webp";
import Seo from "@/components/Seo";

const pillarIcons = [Leaf, Recycle, TreePine, Sun, Droplets];

const Sustainability = () => {
  const { t } = useTranslation("sustainability");
  const pillars = pillarIcons.map((icon, i) => ({
    icon,
    title: t(`pillars.${i}.title`),
    description: t(`pillars.${i}.description`),
  }));
  return (
    <main className="pt-20">
      <Seo
        title={t("seo.title")}
        description={t("seo.description")}
        path="/sustainability"
      />
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-end pb-16">
        <div className="absolute inset-0">
          <img src={sustainabilityHero} alt="GOTS certified organic cotton field at golden hour, source for Lore Organics plastic free tampons and pads" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-3xl">
          <p className="text-label text-lore-botanical mb-4">{t("hero.label")}</p>
          <div className="divider-botanical mb-8" />
          <h1 className="text-editorial-xl mb-6">{t("hero.titleLine1")}<br />{t("hero.titleLine2")}</h1>
          <p className="text-body-lg text-muted-foreground max-w-lg">
            {t("hero.body")}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding bg-card">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          {Array.from({ length: 6 }, (_, i) => (
            <p key={i} className="text-body-lg text-muted-foreground">
              {t(`overview.paragraphs.${i}`)}
            </p>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
          {Array.from({ length: 3 }, (_, i) => ({
            stat: t(`stats.${i}.stat`),
            label: t(`stats.${i}.label`),
          })).map((item) => (
            <div key={item.label} className="text-center p-6 bg-lore-sage/10 rounded-sm">
              <span className="font-serif text-4xl md:text-5xl font-light text-lore-botanical">{item.stat}</span>
              <p className="text-label text-muted-foreground mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding">
        <div className="text-center mb-16">
          <p className="text-label text-lore-botanical mb-4">{t("pillarsSection.label")}</p>
          <div className="divider-botanical mx-auto mb-8" />
          <h2 className="text-editorial-lg">{t("pillarsSection.title")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="group p-5 -m-3 rounded-sm transition-all duration-300 hover:bg-lore-sage/15">
              <div className="w-12 h-12 rounded-full bg-lore-sage/25 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-lore-sage/40">
                <pillar.icon size={28} className="text-lore-botanical" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-medium mb-3">{pillar.title}</h3>
              <p className="text-body text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Lifecycle */}
      <section className="section-padding bg-lore-sage/15">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-editorial-lg mb-6">{t("lifecycle.title")}</h2>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
              {t("lifecycle.body")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }, (_, i) => ({
              step: `0${i + 1}`,
              title: t(`lifecycle.steps.${i}.title`),
              desc: t(`lifecycle.steps.${i}.desc`),
            })).map((item) => (
              <div key={item.step} className="text-center">
                <span className="font-serif text-5xl font-light text-lore-sage">{item.step}</span>
                <h3 className="font-serif text-xl font-medium mt-4 mb-2">{item.title}</h3>
                <p className="text-body text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Sustainability;
