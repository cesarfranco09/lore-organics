/**
 * Single source of truth for the launch range: product identity, family
 * colors (from the Website Style Guide), absorbency, pack size, certifier
 * text and the box claims each product may show.
 *
 * Display copy (titles, descriptions, materials) stays in the i18n
 * namespaces; this file holds data only.
 */

export type ProductId = "day-pad" | "night-pad" | "regular-tampon" | "super-tampon" | "liner";
export type ProductFamily = "pads" | "tampons" | "liners";

/** Claim keys, in the style guide's display order. Labels live in common.json → claims.<key>. */
export const CLAIM_KEYS = [
  "organicCotton",
  "dermatologicallyTested",
  "gynecologicallyTested",
  "fragranceFree",
  "noChlorineBleaching",
  "noPesticides",
  "madeInEurope",
  "vegan",
  "hypoallergenic",
] as const;
export type ClaimKey = (typeof CLAIM_KEYS)[number];

/**
 * Approved claims (design brief §4, Oct 19 2026). Hypoallergenic stays off
 * until Harper's results confirm it; "No chlorine bleaching" stays off until
 * it is approved for the web. Move these to Shopify metafields once set up.
 */
const PAD_CLAIMS: ClaimKey[] = [
  "dermatologicallyTested",
  "gynecologicallyTested",
  "fragranceFree",
  "madeInEurope",
  "vegan",
];
const TAMPON_CLAIMS: ClaimKey[] = [
  "dermatologicallyTested",
  "gynecologicallyTested",
  "fragranceFree",
  "madeInEurope",
  "noPesticides",
];
/** The quiet strip under the hero. */
export const HOME_CLAIMS: ClaimKey[] = [
  "dermatologicallyTested",
  "gynecologicallyTested",
  "fragranceFree",
  "madeInEurope",
  "organicCotton",
];

export interface Certifier {
  /** Lines printed under the GOTS logo, exactly as on the box. */
  lines: string[];
}

/** Pads and liners: Ecocert. Tampons: ICEA. Never mix them up. */
export const CERTIFIERS: Record<ProductFamily, Certifier> = {
  pads: { lines: ["Organic", "Ecocert Greenlife SAS", "GOTS-29472"] },
  liners: { lines: ["Organic", "Ecocert Greenlife SAS", "GOTS-29472"] },
  tampons: { lines: ["Organic", "ICEA", "10489"] },
};

export interface CatalogProduct {
  id: ProductId;
  family: ProductFamily;
  /** Shopify product handle (admin → Products → URL slug). */
  shopifyHandle: string;
  /** Product page URL segment: /products/<category>/<slug>. */
  slug: string;
  /** Canonical English name for analytics, cart lines and JSON-LD. */
  name: string;
  /** Short name printed on the 3D box ("\n" splits lines). */
  boxLabel: string;
  /** Units per pack. */
  packCount: number;
  size?: string;
  /** 1–3 droplets. */
  absorbency: number;
  /** CSS custom property holding the family shade (see index.css). */
  colorVar: string;
  /** Whether cream type is readable on this shade (style guide contrast rule). */
  lightText: boolean;
  claims: ClaimKey[];
  /** Cart thumbnail. */
  image: string;
  /**
   * Real product photos, in gallery order: box front, the product out of the
   * box, box side panel, in hand / on the shelf. Until they exist the site
   * shows a static render of the box.
   */
  photos?: string[];
  comingSoon?: boolean;
}

export const CATALOG: CatalogProduct[] = [
  {
    id: "day-pad",
    family: "pads",
    shopifyHandle: "organic-cotton-day-pad",
    slug: "medium-flow",
    name: "Organic Cotton Pads, Medium Flow",
    boxLabel: "Pads\nMedium Flow",
    packCount: 10,
    size: "240mm",
    absorbency: 2,
    colorVar: "--lore-day",
    lightText: true,
    claims: PAD_CLAIMS,
    image: "/lovable-uploads/day-pads-sage.webp",
  },
  {
    id: "night-pad",
    family: "pads",
    // Shopify handle has a stray "-by" from a title typo; update both if fixed in admin.
    shopifyHandle: "organic-cotton-night-pad-by",
    slug: "heavy-flow",
    name: "Organic Cotton Pads, Heavy Flow",
    boxLabel: "Pads\nHeavy Flow",
    packCount: 10,
    size: "280mm",
    absorbency: 3,
    colorVar: "--lore-night",
    lightText: true,
    claims: PAD_CLAIMS,
    image: "/lovable-uploads/6cf4ee2b-9d53-4707-a40f-661d9359f9ad.webp",
  },
  {
    id: "regular-tampon",
    family: "tampons",
    shopifyHandle: "organic-cotton-tampons-regular",
    slug: "light-to-medium-flow",
    name: "Organic Cotton Tampons, Light to Medium Flow",
    boxLabel: "Tampons\nLight to Medium",
    packCount: 16,
    absorbency: 2,
    colorVar: "--lore-regular",
    lightText: false,
    claims: TAMPON_CLAIMS,
    image: "/lovable-uploads/tampons-box.webp",
  },
  {
    id: "super-tampon",
    family: "tampons",
    shopifyHandle: "organic-cotton-tampons-super",
    slug: "medium-to-heavy-flow",
    name: "Organic Cotton Tampons, Medium to Heavy Flow",
    boxLabel: "Tampons\nMedium to Heavy",
    packCount: 16,
    absorbency: 3,
    colorVar: "--lore-super",
    lightText: false,
    claims: TAMPON_CLAIMS,
    image: "/lovable-uploads/tampons-box-super.webp",
  },
  {
    id: "liner",
    family: "liners",
    shopifyHandle: "organic-cotton-panty-liners",
    slug: "everyday",
    name: "Organic Cotton Panty Liners",
    boxLabel: "Panty Liners",
    packCount: 24,
    absorbency: 1,
    colorVar: "--lore-liner",
    lightText: false,
    claims: [],
    image: "/lovable-uploads/daae0592-f7db-4ec4-99be-058364328e9a.webp",
    comingSoon: true,
  },
];

export const getProduct = (id: ProductId): CatalogProduct =>
  CATALOG.find((p) => p.id === id)!;

/** URL category for each family (/products/<category>). */
export const FAMILY_CATEGORY: Record<ProductFamily, string> = {
  pads: "pads",
  tampons: "tampons",
  liners: "panty-liners",
};

export const CATEGORY_FAMILY: Record<string, ProductFamily> = {
  pads: "pads",
  tampons: "tampons",
  "panty-liners": "liners",
};

/** Bare product page path (localize before linking). */
export const productPath = (p: CatalogProduct): string => `/products/${FAMILY_CATEGORY[p.family]}/${p.slug}`;

export const productBySlug = (category: string, slug: string): CatalogProduct | undefined =>
  CATALOG.find((p) => FAMILY_CATEGORY[p.family] === category && p.slug === slug);

/** `hsl(var(--lore-day))`-style color for inline styles. */
export const familyColor = (p: CatalogProduct, alpha?: number): string =>
  alpha === undefined ? `hsl(var(${p.colorVar}))` : `hsl(var(${p.colorVar}) / ${alpha})`;

/** Text color that passes contrast on the product's shade. */
export const onFamilyColor = (p: CatalogProduct): string =>
  p.lightText ? "hsl(var(--lore-birch))" : p.family === "liners" ? "hsl(var(--lore-night))" : "hsl(var(--lore-charcoal))";
