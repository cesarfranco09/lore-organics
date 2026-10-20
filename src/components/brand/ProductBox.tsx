import type { CatalogProduct } from "@/lib/catalog";
import { familyColor, onFamilyColor } from "@/lib/catalog";
import LeafShadow from "./LeafShadow";
import Droplets from "./Droplets";

/**
 * A static render of the box in its family color, standing on a light
 * surface in soft daylight. Built in CSS so every product has a correct-color
 * packshot until real photos arrive (then `ProductImage` shows the photo).
 * No drag, no float, no spin (brief §2, note 7).
 */

/** Warm light from the upper left (one light direction across the site). */
const FACE_LIGHT =
  "linear-gradient(135deg, rgba(255,240,220,0.20) 0%, rgba(255,240,220,0.05) 45%, rgba(20,10,8,0.12) 100%)";

interface ProductBoxProps {
  product: CatalogProduct;
  /** Front face width in px; height and depth scale from it. */
  width?: number;
  /** Y rotation in degrees (negative shows the right side panel). */
  turn?: number;
  className?: string;
}

const ProductBox = ({ product, width = 220, turn = -24, className = "" }: ProductBoxProps) => {
  const h = width * 1.06;
  const d = width * 0.42;
  const baseGap = d * 0.6;
  const bg = familyColor(product);
  const fg = onFamilyColor(product);
  const face = "absolute inset-0 overflow-hidden";
  const unit = product.family === "tampons" ? "TAMPONS" : product.family === "liners" ? "LINERS" : "PADS";

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: width * 1.5, height: h + baseGap + d * 0.5, perspective: 1400 }}
      aria-hidden="true"
    >
      {/* soft contact and cast shadows on a light surface; light from the upper left */}
      <div
        className="absolute rounded-[50%]"
        style={{
          bottom: baseGap - d * 0.7,
          left: "50%",
          width: width * 1.6,
          height: d * 0.9,
          transform: "translateX(-42%)",
          background: "radial-gradient(closest-side, rgba(47,51,46,0.28), rgba(47,51,46,0))",
          filter: "blur(10px)",
        }}
      />
      <div
        className="absolute rounded-[50%]"
        style={{
          bottom: baseGap - d * 0.36,
          left: "50%",
          width: width * 1.12,
          height: d * 0.26,
          transform: "translateX(-50%)",
          background: "radial-gradient(closest-side, rgba(47,51,46,0.45), rgba(47,51,46,0))",
          filter: "blur(3px)",
        }}
      />
      <div className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: baseGap }}>
        <div
          style={{
            width,
            height: h,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(-8deg) rotateY(${turn}deg)`,
          }}
        >
          {/* front */}
          <div className={face} style={{ background: bg, color: fg, transform: `translateZ(${d / 2}px)` }}>
            <LeafShadow
              still
              color="rgb(20, 10, 8)"
              opacity={product.lightText ? 0.32 : 0.16}
              seed={product.packCount * 3 + product.absorbency}
              blur={Math.max(3, width / 50)}
              sunlight={false}
            />
            <div className="pointer-events-none absolute inset-0" style={{ background: FACE_LIGHT }} />
            <div className="relative flex h-full flex-col items-center justify-between py-[12%] text-center">
              <div>
                <div className="font-serif font-normal leading-none" style={{ fontSize: width * 0.2, letterSpacing: "0.01em" }}>
                  Lore
                </div>
                <div className="mt-1 font-sans font-medium" style={{ fontSize: width * 0.036, letterSpacing: "0.42em" }}>
                  ORGANICS
                </div>
              </div>
              <div>
                <div className="font-serif font-light italic" style={{ fontSize: width * 0.07 }}>
                  Organic Cotton
                </div>
                <div className="font-serif" style={{ fontSize: width * 0.082, lineHeight: 1.15, whiteSpace: "nowrap" }}>
                  {product.boxLabel.split("\n").map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
                <div className="mt-2 flex justify-center opacity-80">
                  <Droplets count={product.absorbency} size={width * 0.045} color={fg} />
                </div>
              </div>
              <div className="font-sans font-medium opacity-80" style={{ fontSize: width * 0.036, letterSpacing: "0.3em" }}>
                {product.packCount} × {unit}
              </div>
            </div>
          </div>
          {/* right side panel */}
          <div
            className="absolute top-0 overflow-hidden"
            style={{
              width: d,
              height: h,
              left: (width - d) / 2,
              background: bg,
              color: fg,
              transform: `rotateY(90deg) translateZ(${width / 2}px)`,
              filter: "brightness(0.84)",
            }}
          >
            <div
              className="relative flex h-full items-center justify-center font-sans font-medium"
              style={{ writingMode: "vertical-rl", fontSize: width * 0.036, letterSpacing: "0.4em" }}
            >
              100% ORGANIC COTTON
            </div>
          </div>
          {/* left side */}
          <div
            className="absolute top-0"
            style={{
              width: d,
              height: h,
              left: (width - d) / 2,
              background: bg,
              transform: `rotateY(-90deg) translateZ(${width / 2}px)`,
              filter: "brightness(0.96)",
            }}
          />
          {/* top */}
          <div
            className="absolute left-0"
            style={{
              width,
              height: d,
              top: (h - d) / 2,
              background: bg,
              transform: `rotateX(90deg) translateZ(${h / 2}px)`,
              filter: "brightness(1.08)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductBox;
