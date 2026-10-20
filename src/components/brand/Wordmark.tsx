/**
 * The Lore Organics lockup as one locked SVG: "Lore" over spaced "ORGANICS",
 * as on the boxes. Width is fixed by the viewBox, so it never reflows with
 * the font. Swap the two <text> runs for the outlined artwork when the
 * logo file arrives (keep the viewBox proportions).
 *
 * Sized by height, about 1.5× the previous header lockup: 100px wide on
 * desktop, 80px on phones. The brief's 150/112px widths assume the final
 * outlined lockup; adjust here once it is in.
 */
const Wordmark = ({ className = "", width }: { className?: string; width?: number }) => (
  <svg
    viewBox="0 0 84 46"
    role="img"
    aria-label="Lore Organics"
    className={width ? className : `h-auto w-[80px] md:w-[100px] ${className}`}
    style={width ? { width, height: "auto" } : undefined}
    fill="currentColor"
  >
    <text
      x="42"
      y="30"
      textAnchor="middle"
      fontFamily="'Cormorant Garamond', Georgia, serif"
      fontWeight={400}
      fontSize="38"
      letterSpacing="0.5"
    >
      Lore
    </text>
    <text
      x="42"
      y="43"
      textAnchor="middle"
      fontFamily="Inter, system-ui, sans-serif"
      fontWeight={500}
      fontSize="6.6"
      letterSpacing="3"
      textLength="70"
      lengthAdjust="spacing"
    >
      ORGANICS
    </text>
  </svg>
);

export default Wordmark;
