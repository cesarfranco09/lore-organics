import { Link, useParams } from "react-router-dom";
import { Leaf, Droplets, Award, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { isStoreLive } from "@/lib/shopify";
import Seo from "@/components/Seo";


type ProductCategory = "pads" | "tampons" | "panty-liners";

interface Variant {
  name: string;
  size?: string;
  absorbency: number;
  color?: string;
}

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  variants: Variant[];
  materials: string[];
  certifications: string[];
  description: string;
  category: ProductCategory;
  comingSoon?: boolean;
  alt?: string;
  /** Handle of the matching product in Shopify (admin → Products → the URL slug). */
  shopifyHandle?: string;
}

const products: Product[] = [
  {
    id: "day-pad",
    shopifyHandle: "organic-cotton-day-pad",
    image: "/lovable-uploads/day-pads-sage.webp",
    title: "Organic Cotton Day Pad",
    price: 6.90,
    category: "pads",
    variants: [{ name: "Day Pad", size: "240mm", absorbency: 2, color: "Sage Green" }],
    materials: ["100% GOTS-certified organic cotton", "Biodegradable backsheet", "No plastic touching skin"],
    certifications: ["GOTS", "FSC", "ICEA"],
    description: "Ultra-comfortable organic cotton day pad (240mm) for secure, irritation-free daytime protection.",
    alt: "Lore Organics organic cotton day pad in sage green packaging, 240mm GOTS certified plastic free period care",
  },
  {
    id: "night-pad",
    // NOTE: current handle in Shopify has a stray "-by" (title typo). If you fix the
    // handle in Shopify admin, update it here too.
    shopifyHandle: "organic-cotton-night-pad-by",
    image: "/lovable-uploads/6cf4ee2b-9d53-4707-a40f-661d9359f9ad.webp",
    title: "Organic Cotton Night Pad",
    price: 7.90,
    category: "pads",
    variants: [{ name: "Night Pad", size: "280mm", absorbency: 3, color: "Deep Plum" }],
    materials: ["100% GOTS-certified organic cotton", "Biodegradable backsheet", "No plastic touching skin"],
    certifications: ["GOTS", "FSC", "ICEA"],
    description: "Extended-length organic cotton night pad (280mm) designed for heavy flow and overnight confidence.",
    alt: "Lore Organics organic cotton night pad in deep plum packaging, 280mm biodegradable sustainable period care for heavy flow",
  },
  {
    id: "regular-tampon",
    // Not in Shopify yet — expected handle once created (Shopify derives it from the title).
    shopifyHandle: "organic-cotton-regular-tampons",
    image: "/lovable-uploads/tampons-box.webp",
    title: "Organic Cotton Regular Tampons",
    price: 5.90,
    category: "tampons",
    variants: [{ name: "Regular", absorbency: 2 }],
    materials: ["100% GOTS-certified organic cotton", "Cottonlock™ 360° safety veil", "No synthetic rayon", "No plastic applicator"],
    certifications: ["GOTS", "FSC", "ICEA"],
    description: "Digital tampons for light to medium flow, engineered with 360° cotton safety veil, no synthetic anti-shedding layers.",
    alt: "Lore Organics GOTS certified organic cotton regular tampons box, digital tampons with Cottonlock 360° safety veil and no plastic applicator",
  },
  {
    id: "super-tampon",
    // Not in Shopify yet — expected handle once created.
    shopifyHandle: "organic-cotton-super-tampons",
    image: "/lovable-uploads/tampons-box-super.webp",
    title: "Organic Cotton Super Tampons",
    price: 5.90,
    category: "tampons",
    variants: [{ name: "Super", absorbency: 3 }],
    materials: ["100% GOTS-certified organic cotton", "Cottonlock™ 360° safety veil", "No synthetic rayon", "No plastic applicator"],
    certifications: ["GOTS", "FSC", "ICEA"],
    description: "Higher-absorbency digital tampons for medium to heavy flow,, engineered with 360° cotton safety veil, no synthetic anti-shedding layers",
    alt: "Lore Organics organic cotton super tampons for heavier flow, GOTS certified organic tampons with no synthetic rayon",
  },
  {
    id: "liner",
    // Not in Shopify yet — expected handle once created.
    shopifyHandle: "organic-cotton-liners",
    image: "/lovable-uploads/daae0592-f7db-4ec4-99be-058364328e9a.webp",
    title: "Organic Cotton Liners",
    price: 4.90,
    category: "panty-liners",
    variants: [{ name: "Liner", absorbency: 1 }],
    materials: ["100% GOTS-certified organic cotton", "Ultra-thin design", "Breathable construction", "Biodegradable"],
    certifications: ["GOTS", "FSC"],
    description: "Ultra-thin organic cotton liners for everyday freshness. Coming soon.",
    alt: "Lore Organics organic cotton pantyliner, ultra-thin biodegradable everyday period care",
    comingSoon: true,
  },
];

const categoryTitles: Record<string, { label: string; heading: string; description: string }> = {
  pads: {
    label: "Pads",
    heading: "Organic Cotton Pads",
    description: "Day and night pads made from GOTS-certified organic cotton for all-day comfort and protection.",
  },
  tampons: {
    label: "Tampons",
    heading: "Organic Cotton Tampons",
    description: "Digital tampons with Cottonlock™ 360° safety veil, pure organic cotton, no synthetic materials.",
  },
  "panty-liners": {
    label: "Panty Liners",
    heading: "Organic Cotton Panty Liners",
    description: "Ultra-thin organic cotton liners for everyday freshness and breathable comfort.",
  },
};

const DropletIcons = ({ count }: { count: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3].map((i) => (
      <Droplets
        key={i}
        size={14}
        className={i <= count ? "text-lore-botanical" : "text-border"}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const Products = () => {
  const { category } = useParams<{ category?: string }>();
  const { addItem } = useCart();
  const { byHandle } = useShopifyProducts();
  const storeLive = isStoreLive();

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  const info = category && categoryTitles[category];
  const heroLabel = info ? info.label : "Our Products";
  const heroHeading = info ? info.heading : "Clean by design.";
  const heroDescription = info
    ? info.description
    : "Every Lore product is made from GOTS-certified organic cotton, free from plastics, toxins, and synthetic fragrances.";

  const handleAddToCart = (product: Product) => {
    const live = product.shopifyHandle ? byHandle[product.shopifyHandle] : undefined;
    addItem({
      id: product.id,
      name: product.title,
      image: product.image,
      price: live ? parseFloat(live.priceRange.minVariantPrice.amount) : product.price,
      variantId: live?.variants[0]?.id,
    });
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: heroHeading,
    description: heroDescription,
    hasPart: filteredProducts.map((p) => ({
      "@type": "Product",
      name: p.title,
      description: p.description,
      image: p.image.startsWith("http") ? p.image : `https://lore-organics-elevated.lovable.app${p.image}`,
      brand: { "@type": "Brand", name: "Lore Organics" },
      offers: {
        "@type": "Offer",
        price: p.price.toFixed(2),
        priceCurrency: "EUR",
        availability: p.comingSoon
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      },
    })),
  };

  const seoTitle = info
    ? `${info.heading} — GOTS Certified Organic Cotton | Lore Organics`
    : "Shop Organic Cotton Tampons, Pads & Liners — GOTS Certified | Lore Organics";
  const seoPath = category ? `/products/${category}` : "/products";

  return (
    <main className="pt-20">
      <Seo title={seoTitle} description={heroDescription} path={seoPath} jsonLd={productJsonLd} />
      {/* Hero */}
      <section className="section-padding text-center">
        <p className="text-label text-lore-botanical mb-4">{heroLabel}</p>
        <div className="divider-botanical mx-auto mb-8" />
        <h1 className="text-editorial-xl mb-6">{heroHeading}</h1>
        <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
          {heroDescription}
        </p>
      </section>

      {/* Product Details */}
      {filteredProducts.map((product, index) => {
        const live = product.shopifyHandle ? byHandle[product.shopifyHandle] : undefined;
        const purchasable = storeLive && !product.comingSoon && live?.availableForSale && Boolean(live.variants[0]);
        // In Shopify but not sellable (e.g. inventory at 0) → "Out of Stock".
        // Not in Shopify at all (or store not live) → "Coming Soon".
        const outOfStock = storeLive && !product.comingSoon && live && !live.availableForSale;
        return (
        <section
          key={product.title}
          className={`section-padding ${index % 2 === 0 ? "bg-card" : ""}`}
        >
          <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-start ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}>
            <div className="w-full lg:w-1/2">
              <div className="sticky top-28">
                <img
                  src={product.image}
                  alt={product.alt ?? product.title}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              {product.comingSoon && (
                <span className="inline-block text-label text-lore-botanical bg-lore-sage/30 px-3 py-1 mb-4">Coming Soon</span>
              )}
              <h2 className="text-editorial-md mb-4">{product.title}</h2>
              <p className="text-body-lg text-muted-foreground mb-4">{product.description}</p>

              {/* Price shown only once the store is live (hidden during pricing review) */}
              {purchasable && live && (
                <p className="font-serif text-2xl mb-6">
                  €{parseFloat(live.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
              )}

              {/* Buy button: live Add to Cart once the store launches, Coming Soon until then */}
              <div className="mb-10">
                {purchasable ? (
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3.5 text-label rounded-sm hover:opacity-90 transition-opacity"
                  >
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Add to Cart
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex items-center gap-3 bg-muted text-muted-foreground px-8 py-3.5 text-label rounded-sm cursor-not-allowed opacity-70"
                  >
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    {outOfStock ? "Out of Stock" : "Coming Soon"}
                  </button>
                )}
              </div>

              {/* Variants */}
              <div className="mb-10">
                <h3 className="text-label text-muted-foreground mb-4">Product Details</h3>
                <div className="space-y-3">
                  {product.variants.map((v) => (
                    <div key={v.name} className="flex items-center justify-between py-3 border-b border-border/50">
                      <div>
                        <span className="font-serif text-lg">{v.name}</span>
                        {v.size && <span className="text-body text-muted-foreground ml-3">{v.size}</span>}
                      </div>
                      <DropletIcons count={v.absorbency} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mb-10">
                <h3 className="text-label text-muted-foreground mb-4">Materials & Transparency</h3>
                <ul className="space-y-2">
                  {product.materials.map((m) => (
                    <li key={m} className="text-body text-muted-foreground flex items-start gap-3">
                      <Leaf size={14} className="text-lore-botanical mt-1 shrink-0" strokeWidth={1.5} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-label text-muted-foreground mb-4">Certifications</h3>
                <div className="flex gap-3">
                  {product.certifications.map((cert) => (
                    <div key={cert} className="flex items-center gap-2 bg-lore-sage/20 px-4 py-2">
                      <Award size={16} className="text-lore-botanical" strokeWidth={1.5} />
                      <span className="text-label text-secondary-foreground">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        );
      })}

      {/* CTA */}
      <section className="section-padding bg-lore-sage/20 text-center">
        <h2 className="text-editorial-md mb-6">Ready to make the switch?</h2>
        <p className="text-body text-muted-foreground mb-8 max-w-md mx-auto">
          Join thousands of women choosing certified organic period care.
        </p>
        <Link
          to="/cycle-box"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-label hover:opacity-90 transition-opacity"
        >
          Build Your Cycle Box <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  );
};

export default Products;
