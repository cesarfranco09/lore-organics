import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const EditorialPauseSection = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-serif italic text-editorial-md text-muted-foreground">
          {t("editorial.quote")}
        </p>
        <Link
          to={localize("/sustainability")}
          className="group inline-flex items-center gap-2 text-label text-foreground mt-10 transition-all duration-300 hover:gap-4"
        >
          {t("editorial.cta")}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default EditorialPauseSection;
