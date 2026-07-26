import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

/**
 * i18n setup — EN at the root URL, NL under /nl, DE under /de.
 * Locale files live in src/locales/{lng}/{namespace}.json and are lazy-loaded
 * per page (namespace ≈ page). Missing keys fall back to English, so pages
 * can be translated in batches.
 */

export const SUPPORTED_LANGS = ["en", "nl", "de"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const LANG_STORAGE_KEY = "lore-lang";

/** URL prefix for a language ("" for the default EN). */
export const langPrefix = (lang: SupportedLang): string => (lang === "en" ? "" : `/${lang}`);

/** Language of a pathname based on its prefix. */
export function langFromPath(pathname: string): SupportedLang {
  const seg = pathname.split("/")[1];
  return (SUPPORTED_LANGS as readonly string[]).includes(seg) && seg !== "en"
    ? (seg as SupportedLang)
    : "en";
}

/** The pathname without its language prefix (always starts with "/"). */
export function stripLangPrefix(pathname: string): string {
  const lang = langFromPath(pathname);
  if (lang === "en") return pathname;
  return pathname.slice(lang.length + 1) || "/";
}

i18n
  .use(initReactI18next)
  .use(
    resourcesToBackend((lng: string, ns: string) => import(`../locales/${lng}/${ns}.json`))
  )
  .init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGS],
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false }, // React already escapes
    react: { useSuspense: false }, // render EN fallback while a namespace loads
  });

export default i18n;
