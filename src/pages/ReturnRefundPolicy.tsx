import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";

const ReturnRefundPolicy = () => {
  const { t } = useTranslation("policies");

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

        {t("englishOnlyNote") && (
          <p className="text-body text-muted-foreground italic mb-10 text-center">{t("englishOnlyNote")}</p>
        )}

        <div className="space-y-10 text-left">
          <section>
            <h2 className="text-editorial-md mb-4">Our commitment</h2>
            <p className="text-body-lg text-muted-foreground">
              At Lore Organics we stand behind the quality of every product we make. If something isn't right with your order, we'll always make it right.
            </p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">Returns</h2>
            <p className="text-body-lg text-muted-foreground mb-4">
              Because our products are intimate personal hygiene items, we're unable to accept returns or exchanges once a product's seal has been opened — even if you've only opened one. This is in accordance with EU consumer law (Directive 2011/83/EU, Article 16(e)), which exempts sealed hygiene products from the standard right of withdrawal once unsealed.
            </p>
            <p className="text-body-lg text-muted-foreground mb-4">
              Unopened, sealed products may be returned within 14 days of delivery. Return shipping costs are covered by you, and we'll issue your refund once we've received the item back.
            </p>
            <p className="text-body-lg text-muted-foreground mb-4">
              We'll always take full responsibility if:
            </p>
            <ul className="list-disc list-inside text-body-lg text-muted-foreground space-y-2 ml-2">
              <li>Your order arrives damaged</li>
              <li>You receive the wrong product</li>
              <li>Your order doesn't arrive at all</li>
            </ul>
            <p className="text-body-lg text-muted-foreground mt-4">
              In any of these cases, please contact us within 14 days of delivery at{" "}
              <a href="mailto:info@lore-organics.com" className="underline hover:opacity-70 transition-opacity">
                info@lore-organics.com
              </a>{" "}
              with your order number and a photo where applicable. We'll send a replacement or issue a full refund immediately — no questions asked.
            </p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">Refunds</h2>
            <p className="text-body-lg text-muted-foreground">
              Once a refund is approved, it will be processed to your original payment method within 5 to 10 business days. If you haven't received your refund after 10 business days, please contact your bank or payment provider first, as processing times can vary.
            </p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">Subscription orders</h2>
            <p className="text-body-lg text-muted-foreground">
              You may cancel your subscription at any time before your next scheduled renewal. To cancel, contact us at{" "}
              <a href="mailto:info@lore-organics.com" className="underline hover:opacity-70 transition-opacity">
                info@lore-organics.com
              </a>{" "}
              or manage your subscription directly in your account. Cancellations take effect 14 days after we receive your request; any renewal already processed before then will ship as scheduled, with cancellation applying from the following cycle.
            </p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">Non-returnable items</h2>
            <p className="text-body-lg text-muted-foreground mb-4">
              We don't accept returns or offer refunds for:
            </p>
            <ul className="list-disc list-inside text-body-lg text-muted-foreground space-y-2 ml-2">
              <li>Opened or used hygiene products</li>
              <li>Products damaged due to misuse or improper storage</li>
              <li>Change of mind (for opened or unsealed products)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">Lost or delayed orders</h2>
            <p className="text-body-lg text-muted-foreground mb-4">
              If your order hasn't arrived within the expected delivery timeframe, please contact us at{" "}
              <a href="mailto:info@lore-organics.com" className="underline hover:opacity-70 transition-opacity">
                info@lore-organics.com
              </a>{" "}
              and we'll investigate immediately with our logistics partner.
            </p>
            <ul className="list-disc list-inside text-body-lg text-muted-foreground space-y-2 ml-2">
              <li>Netherlands: expected delivery within 1 to 2 business days.</li>
              <li>Germany: expected delivery within 2 to 4 business days.</li>
            </ul>
            <p className="text-body-lg text-muted-foreground mt-4">
              This policy doesn't affect your statutory rights as a consumer under EU law.
            </p>
          </section>

          <section>
            <h2 className="text-editorial-md mb-4">Contact us</h2>
            <p className="text-body-lg text-muted-foreground">
              Lore Organics B.V. · Schans 178, 1423CB Uithoorn, Nederland
              <br />
              KVK: 42047169 · BTW: NL869464437B01
              <br />
              <a href="mailto:info@lore-organics.com" className="underline hover:opacity-70 transition-opacity">
                info@lore-organics.com
              </a>
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
