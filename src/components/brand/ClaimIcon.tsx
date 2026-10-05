import { useTranslation } from "react-i18next";
import type { ClaimKey } from "@/lib/catalog";

/**
 * Thin-line claim icons in a circle frame, matching the packaging style.
 * Interim drawings: replace each glyph with the team's packaging icon
 * (SVG, same 48×48 frame) when supplied.
 */

const STRIKE = <path d="M14 34 L34 14" />;

const GLYPHS: Record<ClaimKey, JSX.Element> = {
  // skin with a check
  dermatologicallyTested: (
    <>
      <path d="M13 29 C17 26 21 32 25 29 C29 26 33 32 36 29" />
      <path d="M19 20 L22.5 23.5 L29 17" />
    </>
  ),
  // flower: care for intimate health
  gynecologicallyTested: (
    <>
      <circle cx="24" cy="21" r="3" />
      <path d="M24 18 C21 13 27 13 24 18 M27 21 C32 18 32 24 27 21 M24 24 C27 29 21 29 24 24 M21 21 C16 24 16 18 21 21" />
      <path d="M24 26 L24 35" />
    </>
  ),
  // perfume bottle with a stripe across it
  fragranceFree: (
    <>
      <rect x="18" y="22" width="12" height="13" rx="2" />
      <path d="M21 22 L21 18 L27 18 L27 22 M22.5 18 L22.5 15 L25.5 15 L25.5 18" />
      {STRIKE}
    </>
  ),
  // water drop with a stripe
  noChlorineBleaching: (
    <>
      <path d="M24 13 C24 13 17 21 17 26 A7 7 0 0 0 31 26 C31 21 24 13 24 13 Z" />
      {STRIKE}
    </>
  ),
  // sprout
  noPesticides: (
    <>
      <path d="M24 35 L24 22" />
      <path d="M24 24 C24 18 19 16 15 16 C15 21 18 24 24 24 Z" />
      <path d="M24 22 C24 16 29 13 33 13 C33 18 30 22 24 22 Z" />
    </>
  ),
  // ring of stars
  madeInEurope: (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={24 + Math.cos(a) * 9} cy={24 + Math.sin(a) * 9} r="0.9" fill="currentColor" />;
      })}
    </>
  ),
  // leaf with V
  vegan: (
    <>
      <path d="M15 33 C15 22 22 15 33 15 C33 26 26 33 15 33 Z" />
      <path d="M15 33 L27 21" />
    </>
  ),
  // feather
  hypoallergenic: (
    <>
      <path d="M17 33 C17 23 23 15 32 14 C32 23 26 30 17 33 Z" />
      <path d="M17 33 L28 19 M21 27 L26 27 M23 24 L28 24" />
    </>
  ),
};

export const ClaimIcon = ({ claim, size = 48 }: { claim: ClaimKey; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.1}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="22" />
    {GLYPHS[claim]}
  </svg>
);

/** 4 × 2 on desktop, 2 × 4 on mobile (style guide). */
export const ClaimGrid = ({ claims, className = "" }: { claims: readonly ClaimKey[]; className?: string }) => {
  const { t } = useTranslation();
  return (
    <ul className={`grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 ${className}`}>
      {claims.map((c) => (
        <li key={c} className="flex flex-col items-center gap-3 text-center">
          <ClaimIcon claim={c} />
          <span className="max-w-[20ch] text-[10px] font-medium uppercase leading-relaxed tracking-[0.16em] md:text-[11px]">{t(`claims.${c}`)}</span>
        </li>
      ))}
    </ul>
  );
};
