import { useTranslation } from "react-i18next";
import Reveal from "@/components/brand/Reveal";

/** Rachael's favorite block: the lead in Cormorant, the rest in the body sans. No stat tiles. */
const FirstPeriodSection = () => {
  const { t } = useTranslation("home");
  const lines = t("firstPeriod.lines", { returnObjects: true });
  return (
    <section className="section border-t border-border">
      <Reveal className="container-lore">
        <div className="measure mx-auto text-center">
          <p className="mb-8 font-serif text-[24px] font-normal leading-[34px] md:text-[28px] md:leading-[38px]">
            {t("firstPeriod.lead")}
          </p>
          <div className="t-body space-y-3 text-muted-foreground">
            {Array.isArray(lines) && (lines as string[]).map((l) => <p key={l}>{l}</p>)}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default FirstPeriodSection;
