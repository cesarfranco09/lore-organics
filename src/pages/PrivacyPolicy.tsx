import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";

const PrivacyPolicy = () => {
  const { t } = useTranslation("policies");

  useEffect(() => {
    if (!document.querySelector('script[src="https://cdn.iubenda.com/iubenda.js"]')) {
      const s = document.createElement("script");
      s.src = "https://cdn.iubenda.com/iubenda.js";
      s.type = "text/javascript";
      s.async = true;
      document.body.appendChild(s);
    } else if ((window as any).iubendaLoader) {
      try { (window as any).iubendaLoader(); } catch {}
    }
  }, []);

  return (
    <main className="pt-32 pb-24 section-padding min-h-[60vh]">
      <Seo
        title={t("privacy.seo.title")}
        description={t("privacy.seo.description")}
        path="/privacy-policy"
      />
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-label text-lore-botanical mb-4">{t("legal")}</p>
        <div className="divider-botanical mx-auto mb-8" />
        <h1 className="text-editorial-lg mb-8">{t("privacy.title")}</h1>
        {t("privacy.englishOnlyNote") && (
          <p className="text-body text-muted-foreground italic mb-8">{t("privacy.englishOnlyNote")}</p>
        )}
        <a
          href="https://www.iubenda.com/privacy-policy/78164954"
          className="iubenda-white iubenda-noiframe iubenda-embed"
          title={t("privacy.title")}
        >
          {t("privacy.title")}
        </a>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
