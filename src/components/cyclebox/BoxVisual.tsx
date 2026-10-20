import { CATALOG, familyColor, onFamilyColor, type ProductId } from "@/lib/catalog";

/**
 * The Cycle Box itself: an open cream box with its lid tipped back. Every
 * pack added drops in as a small thumbnail (300ms) and stands in line with
 * the others, like books on a shelf; past ~8 they lean closer together, so
 * 10, 14 or 28 packs all fit.
 */

const PACK_W = 24;
/** Room for the row inside the box, in px. */
const ROW_W = 200;

const PackThumb = ({ id, overlap }: { id: ProductId; overlap: number }) => {
  const p = CATALOG.find((c) => c.id === id)!;
  return (
    <span
      className="cb-pack relative block h-[58px] w-[24px] shrink-0 rounded-[3px] shadow-[2px_0_6px_-2px_rgba(47,51,46,0.45)]"
      style={{ background: familyColor(p), color: onFamilyColor(p), marginLeft: overlap }}
      aria-hidden="true"
    >
      <span className="absolute inset-x-0 top-[5px] text-center font-serif text-[7px] leading-none">Lore</span>
      <span className="absolute inset-x-[5px] bottom-[6px] h-px bg-current opacity-40" />
    </span>
  );
};

const BoxVisual = ({ packs }: { packs: ProductId[] }) => {
  const n = packs.length;
  // Gap between packs; negative once they no longer fit side by side.
  const step = n > 1 ? Math.min(PACK_W + 4, (ROW_W - PACK_W) / (n - 1)) : 0;
  const overlap = step - PACK_W;

  return (
    <div className="relative mx-auto h-[150px] w-full max-w-[300px]" aria-hidden="true">
      <style>{BOX_STYLES}</style>
      {/* lid, tipped open behind the box */}
      <div
        className="absolute left-[10%] right-[10%] top-[6px] h-[46px] origin-bottom rounded-t-[10px] border border-[#E2D6C2] bg-[#F1E7D6]"
        style={{ transform: "perspective(400px) rotateX(48deg)" }}
      />
      {/* back wall */}
      <div className="absolute bottom-[18px] left-[8%] right-[8%] h-[92px] rounded-t-[6px] bg-[#EADFCC]" />
      {/* the packs, standing inside */}
      <div className="absolute bottom-[20px] left-0 right-0 flex items-end justify-center">
        {packs.map((id, i) => (
          <PackThumb key={`${id}-${packs.slice(0, i + 1).filter((x) => x === id).length}`} id={id} overlap={i === 0 ? 0 : overlap} />
        ))}
      </div>
      {/* front panel */}
      <div className="absolute bottom-0 left-[4%] right-[4%] flex h-[46px] items-center justify-center rounded-b-[12px] rounded-t-[4px] border border-[#E2D6C2] bg-[#F6EEDF] shadow-[0_14px_24px_-16px_rgba(47,51,46,0.45)]">
        <span className="-mt-2.5 font-serif text-[22px] leading-none text-foreground">Lore</span>
        <span className="absolute bottom-[5px] text-[7px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Cycle Box</span>
      </div>
    </div>
  );
};

const BOX_STYLES = `
@keyframes cbPackIn {
  from { opacity: 0; transform: translateY(-46px); }
  to { opacity: 1; transform: none; }
}
.cb-pack { animation: cbPackIn 300ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .cb-pack { animation: none; } }
`;

export default BoxVisual;
