import { useTranslation } from "react-i18next";

/**
 * Trust strip: a row of partner logos scrolling sideways in a slow,
 * seamless loop. The list is rendered twice and the track moves by exactly
 * half its width, so the loop has no visible seam. Hover pauses it; with
 * reduced motion it becomes a static, wrapping row.
 *
 * PLACEHOLDER: every name below is fictional. Replace them with real
 * partners (ideally their SVG logos) before launch. Showing partners or
 * stockists Lore doesn't have is a misleading endorsement under EU consumer law.
 */

type LogoStyle = "serif-italic" | "spaced-caps" | "sans-bold" | "serif-caps" | "script-lower";

interface Partner {
  name: string;
  style: LogoStyle;
  /** Optional small mark drawn before the name. */
  mark?: "circle" | "leaf" | "star";
}

const PARTNERS: Partner[] = [
  { name: "Maison Vellune", style: "serif-italic", mark: "circle" },
  { name: "NORDAVÉ", style: "spaced-caps" },
  { name: "hollowfern", style: "sans-bold", mark: "leaf" },
  { name: "Atelier Osmé", style: "serif-caps" },
  { name: "kiorra", style: "script-lower", mark: "star" },
  { name: "SÉLAINE", style: "spaced-caps" },
  { name: "Brightmoss & Co.", style: "serif-italic" },
  { name: "Velde Apotheek", style: "serif-caps", mark: "circle" },
];

const STYLE_CLASSES: Record<LogoStyle, string> = {
  "serif-italic": "font-serif text-2xl italic md:text-[28px]",
  "spaced-caps": "font-sans text-sm font-medium tracking-[0.42em] md:text-base",
  "sans-bold": "font-sans text-xl font-semibold tracking-[-0.03em] md:text-2xl",
  "serif-caps": "font-serif text-lg uppercase tracking-[0.18em] md:text-xl",
  "script-lower": "font-serif text-[28px] font-light lowercase tracking-[0.02em] md:text-[32px]",
};

const Mark = ({ kind }: { kind: NonNullable<Partner["mark"]> }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
    {kind === "circle" && (
      <>
        <circle cx="9" cy="9" r="7.5" />
        <circle cx="9" cy="9" r="3" />
      </>
    )}
    {kind === "leaf" && (
      <>
        <path d="M3 15 C3 7 8 3 15 3 C15 10 11 15 3 15 Z" />
        <path d="M3 15 L11 7" />
      </>
    )}
    {kind === "star" && <path d="M9 1.5 L10.6 7.4 L16.5 9 L10.6 10.6 L9 16.5 L7.4 10.6 L1.5 9 L7.4 7.4 Z" />}
  </svg>
);

const Logo = ({ partner }: { partner: Partner }) => (
  <span
    className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap text-lore-charcoal/55 transition-colors duration-300 hover:text-lore-night ${STYLE_CLASSES[partner.style]}`}
  >
    {partner.mark && <Mark kind={partner.mark} />}
    {partner.name}
  </span>
);

const LogoStrip = () => {
  const { t } = useTranslation("home");

  return (
    <section aria-label={t("partners.label")} className="border-y border-lore-charcoal/10 bg-lore-ivory py-10 md:py-12">
      <p className="text-label mb-7 text-center text-lore-night/60">{t("partners.label")}</p>

      {/* Screen readers get one plain list; the moving track is decorative. */}
      <ul className="sr-only">
        {PARTNERS.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="logo-marquee group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      >
        <div className="logo-marquee-track flex w-max items-center group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-16 pr-16 md:gap-24 md:pr-24">
              {PARTNERS.map((p) => (
                <Logo key={`${copy}-${p.name}`} partner={p} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;
