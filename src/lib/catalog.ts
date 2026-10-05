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

/** Tampon claims, per the website brief (compliance section). */
const TAMPON_CLAIMS: ClaimKey[] = [
  "dermatologicallyTested",
  "gynecologicallyTested",
  "fragranceFree",
  "noChlorineBleaching",
  "noPesticides",
  "madeInEurope",
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
  /** Pads/liners: only claims on approved packaging (not yet supplied), so empty. */
  claims: ClaimKey[];
  image: string;
  comingSoon?: boolean;
  /** Fits a night-time routine (used by the day → night section). */
  night?: boolean;
}

export const CATALOG: CatalogProduct[] = [
  {
    id: "day-pad",
    family: "pads",
    shopifyHandle: "organic-cotton-day-pad",
    name: "Organic Cotton Day Pad",
    boxLabel: "Day Pads",
    packCount: 10,
    size: "240mm",
    absorbency: 2,
    colorVar: "--lore-day",
    lightText: true,
    claims: [],
    image: "/lovable-uploads/day-pads-sage.webp",
  },
  {
    id: "night-pad",
    family: "pads",
    // Shopify handle has a stray "-by" from a title typo; update both if fixed in admin.
    shopifyHandle: "organic-cotton-night-pad-by",
    name: "Organic Cotton Night Pad",
    boxLabel: "Night Pads",
    packCount: 10,
    size: "280mm",
    absorbency: 3,
    colorVar: "--lore-night",
    lightText: true,
    claims: [],
    image: "/lovable-uploads/6cf4ee2b-9d53-4707-a40f-661d9359f9ad.webp",
    night: true,
  },
  {
    id: "regular-tampon",
    family: "tampons",
    shopifyHandle: "organic-cotton-tampons-regular",
    name: "Organic Cotton Regular Tampons",
    boxLabel: "Tampons\nRegular",
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
    name: "Organic Cotton Super Tampons",
    boxLabel: "Tampons\nSuper",
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
    name: "Organic Cotton Liners",
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

/** `hsl(var(--lore-day))`-style color for inline styles. */
export const familyColor = (p: CatalogProduct, alpha?: number): string =>
  alpha === undefined ? `hsl(var(${p.colorVar}))` : `hsl(var(${p.colorVar}) / ${alpha})`;

/** Text color that passes contrast on the product's shade. */
export const onFamilyColor = (p: CatalogProduct): string =>
  p.lightText ? "hsl(var(--lore-birch))" : p.family === "liners" ? "hsl(var(--lore-night))" : "hsl(var(--lore-charcoal))";
