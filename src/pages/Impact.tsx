import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const IVORY = "#F7F5F1";
const FOREST = "#1A3528";
const TERRA = "#C4967A";
const PLUM = "#4B2E38";

const Impact = () => {
  const { t } = useTranslation("impact");
  const { localize } = useLocalizedPath();
  return (
    <main className="pt-[112px]">
      <Seo
        title={t("seo.title")}
        description={t("seo.description")}
        path="/impact"
      />
      {/* SECTION 1, HERO */}
      <section
        className="px-6 md:px-12 lg:px-24 py-32 md:py-48"
        style={{ backgroundColor: "#D6DDD3", color: FOREST }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
            {t("hero.titleLine1")}<br />{t("hero.titleLine2")}
          </h1>
          <p className="font-sans text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {t("hero.body")}
          </p>
        </div>
      </section>

      {/* SECTION 2, THE STAT */}
      <section
        className="px-6 md:px-12 lg:px-24 py-24 md:py-32 text-center"
        style={{ backgroundColor: IVORY }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="font-serif text-8xl md:text-[10rem] leading-none mb-6"
            style={{ color: TERRA }}
          >
            {t("stat.figure")}
          </p>
          <p className="font-sans text-lg md:text-xl mb-10" style={{ color: FOREST }}>
            {t("stat.body1")}
            <sup><a href="#footnote-1" style={{ color: TERRA }}>1</a></sup>{" "}
            {t("stat.body2")}
            <sup><a href="#footnote-2" style={{ color: TERRA }}>2</a></sup>
          </p>
          <p className="font-sans text-base leading-relaxed max-w-2xl mx-auto" style={{ color: FOREST }}>
            {t("stat.body3")}
          </p>
        </div>
      </section>

      {/* SECTION 3, HOW IT WORKS */}
      <section
        className="px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-foreground/10"
        style={{ backgroundColor: IVORY }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
          {Array.from({ length: 3 }, (_, i) => ({
            n: `0${i + 1}`,
            title: t(`cards.${i}.title`),
            body:
              i === 1 ? (
                <>{t(`cards.${i}.body`)} <a href="mailto:info@lore-organics.com" className="underline-offset-4 hover:underline transition-colors" style={{ color: PLUM }}>info@lore-organics.com</a>.</>
              ) : (
                t(`cards.${i}.body`)
              ),
          })).map((c) => (
            <div key={c.n}>
              <p className="font-serif text-2xl mb-4" style={{ color: TERRA }}>
                {c.n}
              </p>
              <h3 className="font-serif text-3xl mb-4" style={{ color: FOREST }}>
                {c.title}
              </h3>
              <p className="font-sans text-base leading-relaxed" style={{ color: FOREST }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4, TWO WAYS WE GIVE BACK */}
      <section
        className="px-6 md:px-12 lg:px-24 py-24 md:py-32"
        style={{ backgroundColor: IVORY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto items-start">
          <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ color: FOREST }}>
            {t("ways.titleLine1")}<br />{t("ways.titleLine2")}
          </h2>
          <div className="space-y-10">
            <div>
              <p
                className="font-sans text-xs tracking-[0.2em] uppercase mb-4"
                style={{ color: TERRA }}
              >
                {t("ways.items.0.label")}
              </p>
              <p className="font-sans text-base leading-relaxed" style={{ color: FOREST }}>
                {t("ways.items.0.body")}
              </p>
            </div>
            <div className="border-t" style={{ borderColor: `${FOREST}33` }} />
            <div>
              <p
                className="font-sans text-xs tracking-[0.2em] uppercase mb-4"
                style={{ color: TERRA }}
              >
                {t("ways.items.1.label")}
              </p>
              <p className="font-sans text-base leading-relaxed" style={{ color: FOREST }}>
                {t("ways.items.1.body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5, QUOTE PULL */}
      <section
        className="px-6 md:px-12 lg:px-24 py-32 md:py-48 text-center"
        style={{ backgroundColor: PLUM, color: IVORY }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="font-serif italic text-4xl md:text-6xl leading-tight mb-8 whitespace-pre-line">
            {t("quote.love")}&nbsp;{"\n"}
            Rachael &amp; Geneviève.{"\n\n"}
          </p>
          <p className="font-sans text-sm tracking-wide opacity-80">
            {t("quote.role")}
          </p>
          <div className="mt-16 pt-8 border-t max-w-2xl mx-auto text-left space-y-2" style={{ borderColor: `${IVORY}33` }}>
            <p id="footnote-1" className="font-sans text-xs opacity-70 leading-relaxed">
              <sup>1</sup> Plan International Deutschland &amp; WASH United, "Menstruation im Fokus," 2022.
            </p>
            <p id="footnote-2" className="font-sans text-xs opacity-70 leading-relaxed">
              <sup>2</sup> Neighborhood Feminists &amp; Opinium, CODE RED 2024.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6, CTA */}
      <section
        className="px-6 md:px-12 lg:px-24 py-24 md:py-32 text-center"
        style={{ backgroundColor: IVORY }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl mb-6" style={{ color: FOREST }}>
            {t("cta.title")}
          </h2>
          <p className="font-sans text-lg mb-10" style={{ color: FOREST }}>
            {t("cta.body")}
          </p>
          <Link
            to={localize("/") + "#waitlist"}
            className="inline-block px-10 py-4 font-sans text-sm tracking-[0.15em] uppercase transition-opacity hover:opacity-90"
            style={{ backgroundColor: FOREST, color: IVORY }}
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Impact;
