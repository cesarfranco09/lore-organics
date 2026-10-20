import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import MailtoForm from "@/components/info/MailtoForm";
import { SHIPPING, formatEuro } from "@/lib/pricing";

/** Shipping, Impressum, online withdrawal and subscription cancellation: short, plain pages. */

const InfoLayout = ({ path, section, children }: { path: string; section: string; children: ReactNode }) => {
  const { t } = useTranslation("info");
  return (
    <main>
      <Seo title={t(`${section}.seo.title`)} description={t(`${section}.seo.description`)} path={path} />
      <section className="section">
        <div className="container-lore">
          <div className="measure">
            <h1 className="t-h1 mb-6">{t(`${section}.heading`)}</h1>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
};

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
    <dt className="t-body">{label}</dt>
    <dd className="t-body text-right tabular-nums">{value}</dd>
  </div>
);

export const Shipping = () => {
  const { t, i18n } = useTranslation("info");
  const lang = i18n.language;
  return (
    <InfoLayout path="/shipping" section="shipping">
      <p className="t-lead mb-12">{t("shipping.intro")}</p>
      <h2 className="text-label mb-2 text-muted-foreground">{t("shipping.costsTitle")}</h2>
      <dl className="mb-12 border-t border-border">
        <Row label={t("shipping.oneTime")} value={formatEuro(SHIPPING.oneTime, lang)} />
        <Row label={t("shipping.cycleBox")} value={formatEuro(SHIPPING.subscription, lang)} />
        <Row label={t("shipping.freeOver", { amount: formatEuro(SHIPPING.freeThreshold, lang) })} value={t("shipping.free")} />
      </dl>
      <h2 className="text-label mb-2 text-muted-foreground">{t("shipping.timesTitle")}</h2>
      <dl className="mb-8 border-t border-border">
        <Row label={t("shipping.countries.nl")} value={t("shipping.timeTbc")} />
        <Row label={t("shipping.countries.de")} value={t("shipping.timeTbc")} />
      </dl>
      <p className="t-small text-muted-foreground">{t("shipping.note")}</p>
    </InfoLayout>
  );
};

export const Impressum = () => {
  const { t } = useTranslation("info");
  return (
    <InfoLayout path="/impressum" section="impressum">
      <dl className="mt-6 border-t border-border">
        <Row label={t("impressum.company")} value="Lore Organics B.V." />
        <Row label={t("impressum.address")} value="Schans 178, 1423CB Uithoorn, NL" />
        <Row label={t("impressum.directors")} value="Geneviève Silvestra, Rachael Hoogkamer" />
        <Row label={t("impressum.registry")} value="42047169" />
        <Row label={t("impressum.vat")} value="NL869464437B01" />
        <Row
          label={t("impressum.contact")}
          value={
            <a href="mailto:info@lore-organics.com" className="underline underline-offset-2">
              info@lore-organics.com
            </a>
          }
        />
      </dl>
    </InfoLayout>
  );
};

export const Withdrawal = () => {
  const { t } = useTranslation("info");
  return (
    <InfoLayout path="/withdrawal" section="withdrawal">
      <p className="t-body mb-10 text-foreground/85">{t("withdrawal.intro")}</p>
      <MailtoForm
        fields={[
          { name: "name", label: t("withdrawal.name"), required: true, autoComplete: "name" },
          { name: "email", label: t("withdrawal.email"), type: "email", required: true, autoComplete: "email" },
          { name: "order", label: t("withdrawal.order"), required: true },
          { name: "items", label: t("withdrawal.items") },
          { name: "received", label: t("withdrawal.received"), type: "date" },
        ]}
        submitLabel={t("withdrawal.confirm")}
        subject={(v) => t("withdrawal.subject", { order: v.order ?? "" })}
        doneTitle={t("withdrawal.doneTitle")}
        doneBody={t("withdrawal.doneBody")}
      />
    </InfoLayout>
  );
};

export const CancelSubscription = () => {
  const { t } = useTranslation("info");
  return (
    <InfoLayout path="/cancel-subscription" section="cancel">
      <p className="text-label mb-4 text-primary" lang="de">
        {t("cancel.germanLabel")}
      </p>
      <p className="t-body mb-10 text-foreground/85">{t("cancel.intro")}</p>
      <MailtoForm
        fields={[
          { name: "name", label: t("cancel.name"), required: true, autoComplete: "name" },
          { name: "email", label: t("cancel.email"), type: "email", required: true, autoComplete: "email" },
          { name: "order", label: t("cancel.order") },
        ]}
        submitLabel={t("cancel.confirm")}
        subject={(v) => t("cancel.subject", { name: v.name ?? "" })}
        doneTitle={t("cancel.doneTitle")}
        doneBody={t("cancel.doneBody")}
      />
    </InfoLayout>
  );
};
