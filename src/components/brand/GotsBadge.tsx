import { useTranslation } from "react-i18next";
import { CERTIFIERS, type ProductFamily } from "@/lib/catalog";

/**
 * GOTS certification with the certifier lines exactly as printed on each box.
 *
 * The brief requires the real, unaltered GOTS logo, so we never redraw it.
 * Drop the official file in /public/certifications/ and set its path here;
 * until then only the certifier text is shown.
 */
export const GOTS_LOGO_SRC: string | null = null;

const GOTS_INFO_URL = "https://global-standard.org/";

const GotsBadge = ({ family, className = "" }: { family: ProductFamily; className?: string }) => {
  const { t } = useTranslation();
  const lines = CERTIFIERS[family].lines;
  return (
    <a
      href={GOTS_INFO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${className}`}
      style={{ borderColor: "color-mix(in srgb, currentColor 25%, transparent)" }}
      aria-label={`${t("gots.title")}: ${lines.join(" · ")}`}
    >
      {GOTS_LOGO_SRC && <img src={GOTS_LOGO_SRC} alt="GOTS" className="h-14 w-auto" />}
      <span className="flex flex-col gap-0.5">
        <span className="text-label opacity-70">{t("gots.title")}</span>
        {lines.map((l) => (
          <span key={l} className="font-sans text-sm leading-snug">
            {l}
          </span>
        ))}
        <span className="mt-1 text-[11px] underline-offset-4 opacity-60 group-hover:underline">{t("gots.learn")}</span>
      </span>
    </a>
  );
};

export default GotsBadge;
