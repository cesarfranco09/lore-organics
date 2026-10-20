import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import Reveal from "@/components/brand/Reveal";
import EpisodeTile from "@/components/lore/EpisodeTile";
import { EPISODES, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/lore";

/** Home for the video series: a grid of 9:16 episodes with a caption each. */
const TheLore = () => {
  const { t } = useTranslation("lore");

  return (
    <main>
      <Seo title={t("seo.title")} description={t("seo.description")} path="/the-lore" />
      <section className="section">
        <div className="container-lore">
          <Reveal className="mb-12 md:mb-16">
            <h1 className="t-h1 mb-4" lang="en">{t("heading")}</h1>
            <p className="t-lead">{t("intro")}</p>
          </Reveal>

          {EPISODES.length === 0 && (
            <Reveal className="mb-12 flex flex-col gap-4 rounded-xl bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="t-h3 mb-1">{t("soonTitle")}</p>
                <p className="t-body text-muted-foreground">{t("soonBody")}</p>
              </div>
              <div className="flex gap-3">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  {t("instagram")}
                </a>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  {t("tiktok")}
                </a>
              </div>
            </Reveal>
          )}

          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {(EPISODES.length > 0 ? EPISODES : [undefined, undefined, undefined, undefined]).map((ep, i) => (
              <li key={ep?.id ?? i}>
                <EpisodeTile episode={ep} n={i + 1} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default TheLore;
