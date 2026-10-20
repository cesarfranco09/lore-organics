import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import Reveal from "@/components/brand/Reveal";
import foundersPhoto from "@/assets/founders.webp";

/** Replaces Impact: one cream background with sage accents, no plum or red panels. */
const Giving = () => {
  const { t } = useTranslation("giving");
  const cards = [0, 1, 2];

  return (
    <main>
      <Seo title={t("seo.title")} description={t("seo.description")} path="/giving" />

      <section className="section">
        <div className="container-lore">
          <Reveal>
            <h1 className="t-h1 measure mb-6">{t("hero.title")}</h1>
            <p className="t-lead">{t("hero.body")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-lore grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <Reveal>
            <p className="font-serif text-[72px] font-light leading-none text-primary md:text-[104px]">{t("stat.figure")}</p>
          </Reveal>
          <Reveal delay={60} className="measure">
            <p className="t-lead mb-6">
              {t("stat.body1")}
              <sup>
                <a href="#source-1" className="text-primary">1</a>
              </sup>{" "}
              {t("stat.body2")}
              <sup>
                <a href="#source-2" className="text-primary">2</a>
              </sup>
            </p>
            <p className="t-body text-muted-foreground">{t("stat.body3")}</p>
            <div className="mt-10 border-t border-border pt-4">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{t("sources")}</p>
              <p id="source-1" className="text-[11px] leading-[16px] text-muted-foreground">
                1. Plan International Deutschland &amp; WASH United, "Menstruation im Fokus," 2022.
              </p>
              <p id="source-2" className="text-[11px] leading-[16px] text-muted-foreground">
                2. Neighborhood Feminists &amp; Opinium, CODE RED 2024.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-lore">
          <Reveal className="rounded-xl bg-sage-light/40 px-6 py-12 md:px-16 md:py-16">
            <h2 className="t-h2 mb-6">{t("howWeGive.title")}</h2>
            <p className="t-lead measure mb-4">{t("howWeGive.body")}</p>
            <p className="t-body measure text-foreground/80">{t("howWeGive.addOn")}</p>
          </Reveal>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {cards.map((i) => (
              <Reveal key={i} delay={i * 60}>
                <h3 className="t-h3 mb-3">{t(`cards.${i}.title`)}</h3>
                <p className="t-body text-muted-foreground">
                  {t(`cards.${i}.body`)}
                  {i === 1 && (
                    <>
                      {" "}
                      <a href="mailto:info@lore-organics.com" className="text-primary underline underline-offset-2">
                        info@lore-organics.com
                      </a>
                      .
                    </>
                  )}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-lore grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <img src={foundersPhoto} alt={t("imageAlt")} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover object-[center_35%]" />
          </Reveal>
          <Reveal delay={80}>
            <p className="font-serif text-[36px] font-light italic leading-[44px] md:text-[48px] md:leading-[56px]">
              {t("love")}
              <br />
              Rachael &amp; Geneviève.
            </p>
            <p className="t-small mt-4 text-muted-foreground">{t("role")}</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default Giving;
