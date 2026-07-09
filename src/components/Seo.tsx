import { Helmet } from "react-helmet-async";

const SITE_URL = "https://lore-organics-elevated.lovable.app";
const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/byRyPlIx2nQw1Iwz0uuNnckOQqB2/social-images/social-1779027949681-Capture_d%E2%80%99%C3%A9cran_2026-05-16_%C3%A0_20.13.45.webp";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "product";
  jsonLd?: object | object[];
}

const Seo = ({ title, description, path, type = "website", jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
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
