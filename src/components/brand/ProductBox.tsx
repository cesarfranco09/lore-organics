import { useRef, useState, type PointerEvent } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { familyColor, onFamilyColor } from "@/lib/catalog";
import LeafShadow from "./LeafShadow";
import Droplets from "./Droplets";

/**
 * A 3D box mockup in the product's family color, built in CSS. It tilts
 * toward the pointer and can be dragged to turn. A stand-in until renders of
 * the new packaging are supplied: swap in a photo via `ProductVisual` then.
 */

/** Warm light from the upper right, falling off to the lower left (matches the hero footage). */
const SIDE_LIGHT =
  "linear-gradient(225deg, rgba(255,226,196,0.22) 0%, rgba(255,226,196,0.06) 40%, rgba(10,3,5,0.18) 100%)";

interface ProductBoxProps {
  product: CatalogProduct;
  /** Front face width in px; height and depth scale from it. */
  width?: number;
  /** Resting Y rotation in degrees. */
  turn?: number;
  interactive?: boolean;
  float?: boolean;
  /**
   * Scene mode for photographic backgrounds: the box rests on an implied
   * surface (contact + ambient shadow at its base, no floating) and moving
   * leaf shadows and warm side light fall across its faces.
   */
  grounded?: boolean;
  className?: string;
}

const ProductBox = ({
  product,
  width = 220,
  turn = -24,
  interactive = true,
  float = false,
  grounded = false,
  className = "",
}: ProductBoxProps) => {
  const h = width * 1.06;
  const d = width * 0.42;
  /** Space below a grounded box for its shadows. Perspective pushes the
   *  front edge ~0.3·depth below the box's layout bottom, hence the offsets. */
  const baseGap = d * 0.75;
  const bg = familyColor(product);
  const fg = onFamilyColor(product);
  const [tilt, setTilt] = useState({ x: -8, y: 0 });
  const drag = useRef<{ startX: number; base: number } | null>(null);
  const [spin, setSpin] = useState(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (drag.current) {
      setSpin(drag.current.base + (e.clientX - drag.current.startX) * 0.6);
      return;
    }
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -8 - py * 14, y: px * 26 });
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    drag.current = { startX: e.clientX, base: spin };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onUp = () => {
    drag.current = null;
  };

  const face = "absolute inset-0 overflow-hidden";

  return (
    <div
      className={`relative select-none ${interactive ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      style={{ width: width * 1.5, height: h * 1.35, perspective: 1400, touchAction: "pan-y" }}
      onPointerMove={onMove}
      onPointerLeave={() => !drag.current && setTilt({ x: -8, y: 0 })}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {grounded ? (
        <>
          {/* ambient occlusion: wide, soft, offset away from the light (upper right) */}
          <div
            className="absolute rounded-[50%]"
            style={{
              bottom: baseGap - d * 0.95,
              left: "50%",
              width: width * 1.75,
              height: d * 1.1,
              transform: "translateX(-60%)",
              background: "radial-gradient(closest-side, rgba(10,3,5,0.62), rgba(10,3,5,0))",
              filter: "blur(8px)",
            }}
          />
          {/* cast shadow stretching left, away from the light */}
          <div
            className="absolute"
            style={{
              bottom: baseGap - d * 0.4,
              left: width * 0.25 - width * 0.55,
              width: width * 0.75,
              height: d * 0.42,
              transform: "skewX(-38deg)",
              transformOrigin: "100% 100%",
              background: "linear-gradient(to left, rgba(8,2,4,0.6), rgba(8,2,4,0))",
              filter: "blur(7px)",
              borderRadius: "40% 0 0 40%",
            }}
          />
          {/* contact shadow: tight and dark along the base edge */}
          <div
            className="absolute rounded-[50%]"
            style={{
              bottom: baseGap - d * 0.46,
              left: "50%",
              width: width * 1.1,
              height: d * 0.34,
              transform: "translateX(-51%)",
              background: "radial-gradient(closest-side, rgba(6,1,3,0.92), rgba(6,1,3,0))",
              filter: "blur(2px)",
            }}
          />
        </>
      ) : (
        /* floor shadow */
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-[50%] blur-xl"
          style={{ bottom: h * 0.06, width: width * 1.25, height: d * 0.55, background: "rgba(30,15,18,0.28)" }}
        />
      )}
      <div
        className={`absolute inset-0 flex justify-center ${grounded ? "items-end" : "items-center"} ${float && !grounded ? "float-slow" : ""}`}
        style={grounded ? { paddingBottom: baseGap } : undefined}
      >
        <div
          style={{
            width,
            height: h,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${turn + tilt.y + spin}deg)`,
            transition: drag.current ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* front */}
          <div className={face} style={{ background: bg, color: fg, transform: `translateZ(${d / 2}px)` }}>
            {grounded ? (
              <>
                <LeafShadow
                  color="rgb(10, 3, 5)"
                  opacity={product.lightText ? 0.5 : 0.32}
                  seed={product.packCount * 3 + product.absorbency}
                  blur={4}
                  sunlight={false}
                />
                <div className="pointer-events-none absolute inset-0" style={{ background: SIDE_LIGHT }} />
              </>
            ) : (
              <LeafShadow still opacity={product.lightText ? 0.22 : 0.12} seed={product.packCount + product.absorbency} blur={6} />
            )}
            <div className="relative flex h-full flex-col items-center justify-between py-[12%] text-center">
              <div>
                <div className="font-serif font-light leading-none" style={{ fontSize: width * 0.2, letterSpacing: "0.08em" }}>
                  LORE
                </div>
                <div className="mt-1 font-sans font-medium" style={{ fontSize: width * 0.042, letterSpacing: "0.45em" }}>
                  ORGANICS
                </div>
              </div>
              <div>
                <div className="font-serif font-light italic" style={{ fontSize: width * 0.075 }}>
                  Organic Cotton
                </div>
                <div className="font-serif" style={{ fontSize: width * 0.09, lineHeight: 1.1, whiteSpace: "nowrap" }}>
                  {product.boxLabel.split("\n").map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
                <div className="mt-2 flex justify-center opacity-80">
                  <Droplets count={product.absorbency} size={width * 0.05} color={fg} />
                </div>
              </div>
              <div className="font-sans font-medium opacity-80" style={{ fontSize: width * 0.038, letterSpacing: "0.3em" }}>
                {product.packCount} × {product.family === "tampons" ? "TAMPONS" : product.family === "liners" ? "LINERS" : "PADS"}
              </div>
            </div>
          </div>
          {/* back */}
          <div className={face} style={{ background: bg, transform: `rotateY(180deg) translateZ(${d / 2}px)`, filter: "brightness(0.9)" }} />
          {/* right */}
          <div
            className="absolute top-0 overflow-hidden"
            style={{
              width: d,
              height: h,
              left: (width - d) / 2,
              background: bg,
              color: fg,
              transform: `rotateY(90deg) translateZ(${width / 2}px)`,
              filter: grounded ? "brightness(0.96)" : "brightness(0.82)",
            }}
          >
            {grounded && (
              <LeafShadow color="rgb(10, 3, 5)" opacity={0.45} seed={product.packCount * 5} blur={3} sunlight={false} />
            )}
            <div
              className="relative flex h-full items-center justify-center font-sans font-medium"
              style={{ writingMode: "vertical-rl", fontSize: width * 0.04, letterSpacing: "0.4em" }}
            >
              100% ORGANIC COTTON
            </div>
          </div>
          {/* left */}
          <div
            className="absolute top-0"
            style={{
              width: d,
              height: h,
              left: (width - d) / 2,
              background: bg,
              transform: `rotateY(-90deg) translateZ(${width / 2}px)`,
              filter: grounded ? "brightness(0.62)" : "brightness(0.82)",
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
              filter: "brightness(1.1)",
            }}
          />
          {/* bottom */}
          <div
            className="absolute left-0"
            style={{
              width,
              height: d,
              top: (h - d) / 2,
              background: bg,
              transform: `rotateX(-90deg) translateZ(${h / 2}px)`,
              filter: "brightness(0.7)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductBox;
