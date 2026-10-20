import { useEffect, useRef, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import LeafShadow from "./LeafShadow";
import ProductBox from "./ProductBox";

/**
 * A product picture on cream. Shows the real photo when the catalog has one
 * for this slot, otherwise a static render of the box in leaf-shadow
 * daylight, sized to the frame.
 */

export type ProductView = "front" | "side";

/** Gallery slot → photo index in `product.photos`. */
const SLOT: Record<ProductView, number> = { front: 0, side: 2 };
const TURN: Record<ProductView, number> = { front: -18, side: -52 };

const ProductImage = ({
  product,
  view = "front",
  className = "",
  alt,
  scale = 0.46,
  priority = false,
}: {
  product: CatalogProduct;
  view?: ProductView;
  className?: string;
  alt: string;
  /** Box width as a share of the frame width. */
  scale?: number;
  priority?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const photo = product.photos?.[SLOT[view]];

  useEffect(() => {
    const el = ref.current;
    if (!el || photo) return;
    const update = () => setFrame(el.clientWidth);
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [photo]);

  if (photo) {
    return (
      <div className={`overflow-hidden bg-panel ${className}`}>
        <img
          src={photo}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt}
      className={`relative isolate flex items-end justify-center overflow-hidden bg-panel ${className}`}
    >
      {/* the wall: warm daylight from the upper left, leaves falling across it */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 20% 10%, rgba(255,251,244,0.95), rgba(255,251,244,0) 70%), linear-gradient(180deg, hsl(var(--card)) 0%, hsl(36 40% 88%) 100%)",
        }}
      />
      <LeafShadow still color="rgb(60, 66, 58)" opacity={0.13} seed={product.packCount * 7 + product.absorbency} blur={12} sunlight={false} />
      {/* the ledge the box stands on */}
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,rgba(47,51,46,0.05),rgba(47,51,46,0))]" />
      {frame > 0 && (
        <div className="relative mb-[8%]">
          <ProductBox product={product} width={Math.round(frame * scale)} turn={TURN[view]} />
        </div>
      )}
    </div>
  );
};

export default ProductImage;
