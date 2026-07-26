import { useTranslation } from "react-i18next";

const ProblemSection = () => {
  const { t } = useTranslation("home");
  return (
    <section className="section-padding bg-lore-charcoal text-primary-foreground">
      <div className="max-w-4xl mx-auto">
        <p className="text-label opacity-50 mb-4">{t("problem.label")}</p>
        <div className="w-16 h-px bg-lore-sage mb-12" />

        <h2 className="text-editorial-lg mb-12">
          {t("problem.heading1")}<br />{t("problem.heading2")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-serif text-2xl font-medium mb-6 opacity-90">{t("problem.plasticHeading")}</h3>
            <div className="space-y-4">
              {["0", "1", "2"].map((key) => (
                <div
                  key={key}
                  className="group/stat flex items-start gap-4 p-3 -m-3 rounded-sm transition-all duration-300 hover:bg-primary-foreground/[0.04]"
                >
                  <span className="font-serif text-3xl font-light opacity-40 transition-all duration-300 group-hover/stat:opacity-80 group-hover/stat:text-lore-sage">
                    {t(`problem.stats.${key}.stat`)}
                  </span>
                  <p className="text-body opacity-70 pt-2 transition-opacity duration-300 group-hover/stat:opacity-100">
                    {t(`problem.stats.${key}.text`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-medium mb-6 opacity-90">{t("problem.chemicalsHeading")}</h3>
            <ul className="space-y-3">
              {["0", "1", "2", "3"].map((key) => (
                <li
                  key={key}
                  className="group/item text-body opacity-70 flex items-start gap-3 p-2 -m-2 rounded-sm transition-all duration-300 hover:opacity-100 hover:bg-primary-foreground/[0.04]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lore-sage mt-2 shrink-0 transition-transform duration-300 group-hover/item:scale-150" />
                  {t(`problem.risks.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-primary-foreground/10">
          <p className="text-editorial-md opacity-60 max-w-2xl italic">
            {t("problem.quote")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
