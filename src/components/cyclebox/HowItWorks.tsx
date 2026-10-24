import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarDays, Package, Truck, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import Reveal from "@/components/brand/Reveal";

/**
 * How the Cycle Box works, in four calm steps. Used on the homepage (with
 * the button) and on the Cycle Box page.
 */

const STEPS: { key: string; Icon: LucideIcon }[] = [
  { key: "often", Icon: CalendarDays },
  { key: "build", Icon: Package },
  { key: "arrives", Icon: Truck },
  { key: "adjust", Icon: SlidersHorizontal },
];

const HowItWorks = ({ withButton = false, className = "" }: { withButton?: boolean; className?: string }) => {
  const { t } = useTranslation("cyclebox");
  const { localize } = useLocalizedPath();

  return (
    <section id="how-it-works" className={`section scroll-mt-28 ${className}`}>
      <div className="container-lore">
        <Reveal className="mb-12 md:mb-16">
          <p className="eyebrow mb-6">{t("howItWorks.label")}</p>
          <h2 className="t-h1">{t("howItWorks.title")}</h2>
        </Reveal>

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ key, Icon }, i) => (
            <Reveal as="li" key={key} delay={i * 60} className="rounded-xl bg-card p-6 md:p-8">
              <div className="mb-10 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sage-mid text-[13px] text-primary">
                  {i + 1}
                </span>
                <Icon size={24} strokeWidth={1.25} className="text-sage-mid" aria-hidden="true" />
              </div>
              <h3 className="t-h3 mb-2">{t(`howItWorks.steps.${key}.title`)}</h3>
              <p className="t-body text-muted-foreground">{t(`howItWorks.steps.${key}.body`)}</p>
            </Reveal>
          ))}
        </ol>

        {withButton && (
          <div className="mt-12">
            <Link to={localize("/cycle-box")} className="btn-primary">
              {t("howItWorks.cta")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;
