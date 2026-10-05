import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useScrollProgress, segment } from "@/hooks/useScrollProgress";

/** The quote lights up word by word as it scrolls through the viewport. */
const EditorialPauseSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const [ref, p] = useScrollProgress<HTMLElement>("pass");
  const words = t("editorial.quote").split(" ");
  const lit = segment(p, 0.2, 0.6) * words.length;

  return (
    <section ref={ref} className="bg-background px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-3xl font-light italic leading-snug md:text-5xl md:leading-[1.2]">
          {words.map((w, i) => (
            <span
              key={i}
              className="transition-colors duration-300"
              style={{ color: i < lit ? "hsl(var(--lore-night))" : "hsl(var(--lore-charcoal) / 0.18)" }}
            >
              {w}{" "}
            </span>
          ))}
        </p>
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

export default EditorialPauseSection;
