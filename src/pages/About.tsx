import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const scrollTop = () => window.scrollTo(0, 0);

const About = () => {
  const { t } = useTranslation("about");
  const { localize } = useLocalizedPath();
  return (
    <main className="pt-20">
      <Seo
        title={t("seo.title")}
        description={t("seo.description")}
        path="/about"
      />

      {/* ═══ SECTION 1, OUR MISSION ═══ */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <p className="text-label text-lore-botanical mb-6">{t("mission.label")}</p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-lore-sage to-transparent mb-12" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <h1 className="text-editorial-xl sticky top-28">
                {t("mission.titleLine1")}<br />{t("mission.titleLine2")}
              </h1>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <div className="bg-card rounded-sm p-8 md:p-12 shadow-[inset_0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-border/40">
                <div className="space-y-6">
                  <p className="text-body-lg text-muted-foreground">
                    {t("mission.body")}
                  </p>
                </div>
              </div>

              <Link
                to={localize("/products")}
                onClick={scrollTop}
                className="inline-flex items-center gap-3 mt-10 text-label text-foreground group"
              >
                {t("mission.cta")}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* ═══ SECTION 4, GET TO KNOW US ═══ */}
      <section className="bg-card shadow-[inset_0_2px_12px_-4px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          <div className="relative min-h-[50vh] lg:min-h-full shadow-[8px_0_30px_-10px_rgba(0,0,0,0.1)]">
            <img
              src="/lovable-uploads/1f7dba6d-beca-4ead-bc43-1c502b6f78cc.webp"
              alt="Portrait of Lore Organics co-founders Geneviève Silvestra and Rachael Hoogkamer, founders of a transparent organic period care brand"
              className="absolute inset-0 w-full h-full object-cover object-[center_35%] brightness-110"
              loading="lazy"
            />
          </div>

          <div className="flex items-center px-8 md:px-16 lg:px-20 py-20 md:py-28">
            <div>
              <p className="text-label text-lore-botanical mb-4">{t("story.label")}</p>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-lore-sage to-transparent mb-10" />

              <div className="space-y-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <p key={i} className="text-body-lg text-muted-foreground">
                    {t(`story.paragraphs.${i}`)}
                  </p>
                ))}
              </div>


              <Link
                to={localize("/products")}
                onClick={scrollTop}
                className="inline-flex items-center gap-3 mt-12 text-label text-foreground group"
              >
                {t("story.cta")}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CLOSING CTA, WAITLIST ═══ */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-editorial-lg mb-6">{t("closing.title")}</h2>
          <p className="text-body-lg text-muted-foreground mb-10">
            {t("closing.body")}
          </p>
          <Link
            to={localize("/") + "#waitlist"}
            className="inline-flex items-center justify-center px-8 py-3.5 text-label transition-all duration-300 hover:opacity-90 hover:translate-y-[-2px] active:translate-y-[1px]"
            style={{ backgroundColor: "#4B2E38", color: "#F7F5F1" }}
          >
            Join the waitlist
          </Link>
        </div>
      </section>

    </main>
  );
};

export default About;
