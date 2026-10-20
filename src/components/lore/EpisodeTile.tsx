import { useTranslation } from "react-i18next";
import LeafShadow from "@/components/brand/LeafShadow";
import type { Episode } from "@/lib/lore";

/** A 9:16 episode poster with its caption; a quiet placeholder until the episode exists. */
const EpisodeTile = ({ episode, n }: { episode?: Episode; n: number }) => {
  const { t, i18n } = useTranslation("home");
  const lang = i18n.language as keyof Episode["caption"];

  if (!episode) {
    return (
      <div className="relative isolate flex aspect-[9/16] w-full flex-col justify-between overflow-hidden rounded-xl bg-card p-5">
        <LeafShadow still color="rgb(60, 66, 58)" opacity={0.1} seed={n * 11} blur={10} sunlight={false} />
        <span className="text-label relative text-muted-foreground">{t("lore.episode", { n: String(n).padStart(2, "0") })}</span>
        <div className="relative">
          <p className="font-serif text-[22px] font-light leading-[28px]">The Lore of LORE</p>
          <p className="t-small mt-1 text-muted-foreground">{t("lore.soon")}</p>
        </div>
      </div>
    );
  }

  const caption = episode.caption[lang] ?? episode.caption.en;
  return (
    <a href={episode.url} target="_blank" rel="noopener noreferrer" className="group block">
      <div className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-card">
        <img
          src={episode.poster}
          alt={caption}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <p className="t-small mt-3">{caption}</p>
    </a>
  );
};

export default EpisodeTile;
