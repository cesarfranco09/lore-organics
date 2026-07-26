import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANG_STORAGE_KEY, type SupportedLang } from "@/lib/i18n";

/**
 * Route layout that binds a URL prefix ("/", "/nl", "/de") to a language:
 * switches i18next, sets <html lang>, and remembers the choice. No automatic
 * redirects — hreflang tags do that job for search engines.
 */
const LangLayout = ({ lang }: { lang: SupportedLang }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* private mode */
    }
  }, [lang, i18n]);

  return <Outlet />;
};

export default LangLayout;
