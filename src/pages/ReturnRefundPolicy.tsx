import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";

const EMAIL = "info@lore-organics.com";

const MailLink = () => (
  <a href={`mailto:${EMAIL}`} className="underline hover:opacity-70 transition-opacity">
    {EMAIL}
  </a>
);

const ReturnRefundPolicy = () => {
  const { t } = useTranslation("policies");
  // Arrays come back as the key string until the namespace has loaded.
  const list = (key: string): string[] => {
    const value = t(key, { returnObjects: true });
    return Array.isArray(value) ? (value as string[]) : [];
  };

  return (
    <main className="pt-32 pb-24 section-padding min-h-[60vh] bg-background">
      <Seo
        title={t("returns.seo.title")}
        description={t("returns.seo.description")}
        path="/return-refund-policy"
      />
      <div className="max-w-3xl mx-auto">
        <p className="text-label text-lore-botanical mb-4 text-center">{t("legal")}</p>
        <div className="divider-botanical mx-auto mb-8" />
        <h1 className="text-editorial-lg mb-8 text-center">{t("returns.title")}</h1>

        <p className="text-body text-muted-foreground mb-10 text-center">
          {t("returns.lastUpdated")}
        </p>

        <div className="space-y-10 text-left">
          <section>
            <h2 className="text-editorial-md mb-4">{t("returns.commitment.title")}</h2>
            <p className="text-body-lg text-muted-foreground">{t("returns.commitment.body")}</p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">{t("returns.returns.title")}</h2>
            <p className="text-body-lg text-muted-foreground mb-4">{t("returns.returns.hygiene")}</p>
            <p className="text-body-lg text-muted-foreground mb-4">{t("returns.returns.unopened")}</p>
            <p className="text-body-lg text-muted-foreground mb-4">{t("returns.returns.responsibility")}</p>
            <ul className="list-disc list-inside text-body-lg text-muted-foreground space-y-2 ml-2">
              {list("returns.returns.cases").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-body-lg text-muted-foreground mt-4">
              {t("returns.returns.contactBefore")} <MailLink /> {t("returns.returns.contactAfter")}
            </p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">{t("returns.refunds.title")}</h2>
            <p className="text-body-lg text-muted-foreground">{t("returns.refunds.body")}</p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">{t("returns.subscriptions.title")}</h2>
            <p className="text-body-lg text-muted-foreground">
              {t("returns.subscriptions.before")} <MailLink /> {t("returns.subscriptions.after")}
            </p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">{t("returns.nonReturnable.title")}</h2>
            <p className="text-body-lg text-muted-foreground mb-4">{t("returns.nonReturnable.intro")}</p>
            <ul className="list-disc list-inside text-body-lg text-muted-foreground space-y-2 ml-2">
              {list("returns.nonReturnable.items").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">{t("returns.lost.title")}</h2>
            <p className="text-body-lg text-muted-foreground mb-4">
              {t("returns.lost.before")} <MailLink /> {t("returns.lost.after")}
            </p>
            <ul className="list-disc list-inside text-body-lg text-muted-foreground space-y-2 ml-2">
              {list("returns.lost.delivery").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-body-lg text-muted-foreground mt-4">{t("returns.lost.statutory")}</p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">{t("returns.contact.title")}</h2>
            <p className="text-body-lg text-muted-foreground">
              Lore Organics B.V. · Schans 178, 1423CB Uithoorn, {t("returns.contact.country")}
              <br />
              KVK: 42047169 · {t("returns.contact.vat")}: NL869464437B01
              <br />
              <MailLink />
              {" · "}
              <a href="https://www.lore-organics.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">
                www.lore-organics.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ReturnRefundPolicy;
