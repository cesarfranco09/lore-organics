import { useEffect, useRef, useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";

const KLAVIYO_COMPANY_ID = "YiRTrJ";
const KLAVIYO_LIST_ID = "XdjM7r";

const NewsletterSection = () => {
  const { t } = useTranslation("home");
  const formRef = useRef<HTMLDivElement>(null);
  const [klaviyoLoaded, setKlaviyoLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Detect whether the Klaviyo embed actually rendered content
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      const el = formRef.current;
      if (el && el.children.length > 0 && el.querySelector("form, iframe, input")) {
        setKlaviyoLoaded(true);
        clearInterval(interval);
      }
      if (attempts > 20) clearInterval(interval); // ~6s
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            revision: "2024-10-15",
          },
          body: JSON.stringify({
            data: {
              type: "subscription",
              attributes: {
                custom_source: "Website Waitlist",
                profile: {
                  data: {
                    type: "profile",
                    attributes: { email },
                  },
                },
              },
              relationships: {
                list: { data: { type: "list", id: KLAVIYO_LIST_ID } },
              },
            },
          }),
        }
      );
      if (res.ok || res.status === 202) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.detail || "Subscription failed");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };


  return (
    <section id="waitlist" className="section-padding bg-lore-sage/10 scroll-mt-24">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-label text-muted-foreground mb-4">{t("newsletter.label")}</p>
        <div className="divider-botanical mx-auto mb-8" />
        {!klaviyoLoaded && (
          <>
            <h2 className="text-editorial-lg mb-6">
              {t("newsletter.heading")}
            </h2>
            <p className="text-body text-muted-foreground mb-10">
              {t("newsletter.body")}
            </p>
          </>
        )}

        <div ref={formRef} className="klaviyo-form-VYubWT" />

        {!klaviyoLoaded && (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="flex-1 px-4 py-3 bg-background border border-lore-charcoal/20 text-lore-charcoal placeholder:text-muted-foreground focus:outline-none focus:border-lore-sage transition-colors"
              disabled={status === "loading" || status === "success"}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-3 bg-lore-charcoal text-primary-foreground text-xs tracking-[0.2em] uppercase hover:bg-lore-charcoal/90 transition-colors disabled:opacity-60"
            >
              {status === "loading" ? t("newsletter.joining") : status === "success" ? t("newsletter.onList") : t("newsletter.join")}
            </button>
          </form>
        )}

        {status === "success" && !klaviyoLoaded && (
          <p className="text-sm text-lore-sage mt-4">{t("newsletter.success")}</p>
        )}
        {status === "error" && !klaviyoLoaded && (
          <p className="text-sm text-destructive mt-4">{errorMsg}</p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
