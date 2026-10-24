import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";

const FAQ_COUNT = 10;

const FAQ = () => {
  const { t } = useTranslation("faq");
  const [open, setOpen] = useState<number | null>(0);
  const faqs = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`items.${i}.q`),
    a: t(`items.${i}.a`),
  }));

  return (
    <main className="bg-background">
      <Seo
        title={t("seo.title")}
        description={t("seo.description")}
        path="/faq"
      />
      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow eyebrow-center mb-6 text-center">{t("label")}</p>
          <h1 className="t-h1 text-center mb-12">{t("heading")}</h1>
          <div className="space-y-0">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="border-b border-border/40">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left"
                  >
                    <span className="t-h3 pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                    ) : (
                      <ChevronDown size={18} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                    )}
                  </button>
                  {isOpen && (
                    <div className="pb-6 pr-8">
                      <p className="text-body text-muted-foreground">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQ;
