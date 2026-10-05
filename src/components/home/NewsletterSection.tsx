import { useEffect, useRef, useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import LeafShadow from "@/components/brand/LeafShadow";

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
    <section id="waitlist" className="relative isolate overflow-hidden bg-lore-regular scroll-mt-24 text-lore-charcoal">
      <LeafShadow color="rgb(35, 48, 36)" opacity={0.22} seed={19} blur={16} />
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center md:py-36">
        <p className="text-label mb-6 text-lore-superplus">{t("newsletter.label")}</p>
        {!klaviyoLoaded && (
          <>
            <h2 className="text-editorial-lg mb-6">{t("newsletter.heading")}</h2>
            <p className="text-body-lg mx-auto mb-10 max-w-lg opacity-80">{t("newsletter.body")}</p>
          </>
        )}

        <div ref={formRef} className="klaviyo-form-VYubWT" />

        {!klaviyoLoaded && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-4 flex max-w-md flex-col gap-2 rounded-[28px] bg-lore-birch/80 p-2 shadow-[0_20px_50px_-30px_rgba(30,40,30,0.6)] backdrop-blur sm:flex-row sm:rounded-full"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              {t("newsletter.placeholder")}
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-lore-charcoal placeholder:text-muted-foreground focus:outline-none"
              disabled={status === "loading" || status === "success"}
            />
            <button type="submit" disabled={status === "loading" || status === "success"} className="btn-primary">
              {status === "loading" ? t("newsletter.joining") : status === "success" ? t("newsletter.onList") : t("newsletter.join")}
            </button>
          </form>
        )}

        {status === "success" && !klaviyoLoaded && (
          <p className="mt-5 text-sm text-lore-superplus" role="status">{t("newsletter.success")}</p>
        )}
        {status === "error" && !klaviyoLoaded && (
          <p className="mt-5 text-sm text-destructive" role="alert">{errorMsg}</p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
