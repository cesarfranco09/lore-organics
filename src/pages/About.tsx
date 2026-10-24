import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import Reveal from "@/components/brand/Reveal";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import foundersPhoto from "@/assets/founders.webp";

const About = () => {
  const { t } = useTranslation("about");
  const { localize } = useLocalizedPath();
  const paragraphs = t("story.paragraphs", { returnObjects: true });

  return (
    <main>
      <Seo title={t("seo.title")} description={t("seo.description")} path="/about" />

      <section className="section">
        <div className="container-lore">
          <Reveal>
            <p className="eyebrow mb-7">{t("mission.label")}</p>
            <h1 className="t-h1 mb-10">
              {t("mission.titleLine1")} <em className="font-light italic">{t("mission.titleLine2")}</em>
            </h1>
            <p className="t-lead measure mb-10">{t("mission.body")}</p>
            <Link to={localize("/products")} className="btn-primary">
              {t("mission.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-lore grid items-start gap-10 md:grid-cols-[5fr_6fr] md:gap-16 lg:gap-24">
          <Reveal className="md:sticky md:top-32">
            <img
              src={foundersPhoto}
              alt={t("story.imageAlt")}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-xl object-cover object-[center_35%]"
            />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow mb-7">{t("story.label")}</p>
            <div className="t-body measure space-y-5 text-foreground/85">
              {Array.isArray(paragraphs) && (paragraphs as string[]).map((p) => <p key={p}>{p}</p>)}
            </div>
            <p className="t-lead mt-8 italic">{t("story.signoff")}</p>
            <Link to={localize("/products")} className="btn-secondary mt-10">
              {t("story.cta")}
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default About;
