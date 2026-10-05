import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import cottonBoll from "@/assets/cotton-texture.webp";
import cottonField from "@/assets/sustainability-hero.webp";
import linen from "@/assets/hero-main.webp";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * What's inside (inspired by pangaia.com's "Pioneering material science"
 * band): one spaced-caps statement with material images drifting past at
 * different speeds.
 */

const CornIllustration = () => (
  <svg viewBox="0 0 120 160" className="h-full w-full" fill="none" stroke="#563037" strokeWidth={1.2} strokeLinecap="round" aria-hidden="true">
    <path d="M60 18 C78 30 82 70 76 110 C72 132 66 144 60 150 C54 144 48 132 44 110 C38 70 42 30 60 18 Z" />
    {Array.from({ length: 9 }, (_, r) => (
      <path key={r} d={`M${46 + Math.abs(4 - r) * 0.8} ${36 + r * 12} H${74 - Math.abs(4 - r) * 0.8}`} opacity={0.55} />
    ))}
    <path d="M52 30 V140 M60 22 V146 M68 30 V140" opacity={0.4} />
    <path d="M60 150 C40 140 22 112 24 76 C34 98 46 116 58 128" />
    <path d="M60 150 C80 140 98 112 96 76 C86 98 74 116 62 128" />
    <path d="M60 18 C58 10 54 6 48 4 M60 18 C62 9 66 5 72 3 M60 18 V6" opacity={0.7} />
  </svg>
);

interface Tile {
  key: string;
  className: string;
  speed: number;
  render: () => JSX.Element;
}

const TILES: Tile[] = [
  {
    key: "boll",
    className: "left-[3%] top-[8%] h-28 w-36 md:h-44 md:w-56",
    speed: -140,
    render: () => <img src={cottonBoll} alt="" className="h-full w-full object-cover" loading="lazy" />,
  },
  {
    key: "field",
    className: "right-[4%] top-[4%] h-24 w-32 md:h-36 md:w-52",
    speed: -60,
    render: () => <img src={cottonField} alt="" className="h-full w-full object-cover" loading="lazy" />,
  },
  {
    key: "corn",
    className: "right-[12%] bottom-[6%] h-32 w-24 md:h-48 md:w-36",
    speed: -180,
    render: () => (
      <div className="flex h-full w-full items-center justify-center bg-lore-liner p-4">
        <CornIllustration />
      </div>
    ),
  },
  {
    key: "linen",
    className: "left-[16%] bottom-[2%] h-20 w-28 md:h-32 md:w-44",
    speed: -100,
    render: () => <img src={linen} alt="" className="h-full w-full object-cover object-left" loading="lazy" />,
  },
];

const MaterialsSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const [ref, p] = useScrollProgress<HTMLElement>("pass");

  return (
    <section ref={ref} className="relative overflow-hidden bg-lore-linen py-32 md:py-44">
      {TILES.map((tile) => (
        <div
          key={tile.key}
          className={`absolute overflow-hidden rounded-sm shadow-[0_20px_50px_-25px_rgba(58,46,41,0.5)] ${tile.className}`}
          style={{ transform: `translate3d(0, ${(p - 0.5) * tile.speed}px, 0)` }}
          aria-hidden="true"
        >
          {tile.render()}
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="text-label mb-8 text-lore-night/70">{t("materials.label")}</p>
        <h2 className="font-sans text-xl font-normal uppercase leading-[1.7] tracking-[0.28em] text-lore-charcoal md:text-3xl md:tracking-[0.32em]">
          <span className="font-semibold text-lore-night">LORE.</span> {t("whyLore.tagline")}
        </h2>
        <div className="mx-auto mt-14 grid max-w-xl grid-cols-2 gap-6 text-left">
          <div className="border-t border-lore-charcoal/20 pt-4">
            <p className="text-label mb-2 text-lore-night">{t("materials.cotton.title")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("materials.cotton.body")}</p>
          </div>
          <div className="border-t border-lore-charcoal/20 pt-4">
            <p className="text-label mb-2 text-lore-night">{t("materials.backing.title")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("materials.backing.body")}</p>
          </div>
        </div>
        <Link
          to={localize("/sustainability")}
          className="group mt-12 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-lore-night"
        >
          {t("editorial.cta")}
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default MaterialsSection;
