import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { HOME_CLAIMS } from "@/lib/catalog";

/**
 * Approved claims as one quiet, slow line on a light sage band (replaces
 * "Our partners"). One loop every 45 seconds; static under reduced motion.
 */
const ClaimsStrip = () => {
  const { t } = useTranslation();
  const { t: th } = useTranslation("home");

  const Run = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {HOME_CLAIMS.map((c) => (
        <Fragment key={c}>
          <span className="whitespace-nowrap px-6 md:px-8">{t(`claims.${c}`)}</span>
          <span className="text-sage-mid" aria-hidden="true">·</span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <section aria-label={th("claimsLabel")} className="overflow-hidden border-y border-sage-light/60 bg-sage-light/40">
      <div className="logo-marquee py-3.5 text-[12px] font-medium uppercase tracking-[0.14em] text-primary">
        <div className="logo-marquee-track flex w-max">
          <Run />
          <Run hidden />
          <Run hidden />
          <Run hidden />
        </div>
      </div>
    </section>
  );
};

export default ClaimsStrip;
