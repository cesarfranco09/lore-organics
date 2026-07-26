import { Helmet } from "react-helmet-async";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { SUPPORTED_LANGS, langPrefix, type SupportedLang } from "@/lib/i18n";

const SITE_URL = "https://www.lore-organics.com";
const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/byRyPlIx2nQw1Iwz0uuNnckOQqB2/social-images/social-1779027949681-Capture_d%E2%80%99%C3%A9cran_2026-05-16_%C3%A0_20.13.45.webp";

const OG_LOCALES: Record<string, string> = { en: "en_US", nl: "nl_NL", de: "de_DE" };

interface SeoProps {
  title: string;
  description: string;
  /** Path WITHOUT language prefix (e.g. "/products") — hreflang/canonical add it. */
  path: string;
  type?: "website" | "article" | "product";
  jsonLd?: object | object[];
}

const Seo = ({ title, description, path, type = "website", jsonLd }: SeoProps) => {
  const { lang } = useLocalizedPath();
  const bare = path === "/" ? "" : path;
  const urlFor = (l: SupportedLang) => `${SITE_URL}${langPrefix(l)}${bare}`;
  const url = urlFor(lang);
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    // defer={false}: apply head tags synchronously — the default rAF batching
    // never runs in background tabs, leaving canonical/hreflang unset.
    <Helmet defer={false}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {SUPPORTED_LANGS.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={urlFor(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={urlFor("en")} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={OG_LOCALES[lang]} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  );
};

export default Seo;
