import { useLocation } from "react-router-dom";
import { langFromPath, langPrefix, stripLangPrefix, type SupportedLang } from "@/lib/i18n";

/**
 * Locale-aware path helpers.
 *
 *   const { lang, localize, switchLangPath } = useLocalizedPath();
 *   <Link to={localize("/products")} />          → "/nl/products" when on /nl/…
 *   navigate(switchLangPath("de"))               → same page under /de
 */
export function useLocalizedPath() {
  const { pathname, search } = useLocation();
  const lang = langFromPath(pathname);

  const localize = (path: string): string => `${langPrefix(lang)}${path === "/" ? "" : path}` || "/";

  const switchLangPath = (target: SupportedLang): string => {
    const bare = stripLangPrefix(pathname);
    const prefixed = `${langPrefix(target)}${bare === "/" ? "" : bare}` || "/";
    return `${prefixed}${search}`;
  };

  return { lang, localize, switchLangPath };
}
