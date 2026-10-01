import { useNavigate } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { SUPPORTED_LANGS, type SupportedLang } from "@/lib/i18n";

const LABELS: Record<SupportedLang, string> = { en: "EN", nl: "NL", de: "DE" };

/**
 * EN / NL / DE switcher — navigates to the same page under the new prefix.
 * `inverted` is for dark backgrounds (e.g. the footer), where the theme's
 * foreground colour would be invisible.
 */
const LanguageSwitcher = ({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) => {
  const navigate = useNavigate();
  const { lang, switchLangPath } = useLocalizedPath();

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {SUPPORTED_LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className={`${inverted ? "opacity-40" : "text-border"} select-none`}>·</span>}
          <button
            type="button"
            onClick={() => l !== lang && navigate(switchLangPath(l))}
            aria-current={l === lang ? "true" : undefined}
            className={`text-label text-xs px-1 py-0.5 transition-colors ${
              l === lang
                ? `${inverted ? "opacity-100" : "text-foreground"} underline underline-offset-4`
                : inverted
                  ? "opacity-60 hover:opacity-100"
                  : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LABELS[l]}
          </button>
        </span>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
