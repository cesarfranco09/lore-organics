import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { COMMUNITY_PHOTOS, EPISODES, INSTAGRAM_URL } from "@/lib/lore";
import EpisodeTile from "@/components/lore/EpisodeTile";
import Reveal from "@/components/brand/Reveal";

/** Episodes mixed with photos of the founders and friends, in one scroll row. */
const LoreRow = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();

  // Until episodes exist, three quiet placeholders hold their places.
  const episodes = EPISODES.length > 0 ? EPISODES.slice(0, 6) : [undefined, undefined, undefined];
  const tiles: JSX.Element[] = [];
  episodes.forEach((ep, i) => {
    tiles.push(<EpisodeTile key={ep?.id ?? `ep-${i}`} episode={ep} n={i + 1} />);
    const photo = COMMUNITY_PHOTOS[i];
    if (photo) {
      tiles.push(
        <img
          key={photo.src}
          src={photo.src}
          alt={t(photo.altKey)}
          loading="lazy"
          className="aspect-[9/16] w-full rounded-xl object-cover object-[center_35%]"
        />
      );
    }
  });

  return (
    <section className="section border-t border-border">
      <div className="container-lore">
        <Reveal className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="t-h1 mb-3">{t("lore.heading")}</h2>
            <p className="t-body text-muted-foreground">{t("lore.subline")}</p>
          </div>
          <div className="flex gap-8">
            <Link to={localize("/the-lore")} className="link-arrow">
              {t("lore.watch")} <ArrowRight size={13} />
            </Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="link-arrow">
              {t("lore.instagram")} <ArrowRight size={13} />
            </a>
          </div>
        </Reveal>
      </div>
      <div className="no-scrollbar overflow-x-auto">
        <ul className="container-lore flex snap-x snap-mandatory gap-4">
          {tiles.map((tile, i) => (
            <li key={i} className="w-[58vw] max-w-[260px] shrink-0 snap-start sm:w-[240px]">
              {tile}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LoreRow;
