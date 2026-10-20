import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { stripLangPrefix } from "@/lib/i18n";
import { subscribeEmail } from "@/lib/klaviyo";
import Wordmark from "@/components/brand/Wordmark";

const IUBENDA = {
  terms: "https://www.iubenda.com/terms-and-conditions/57601669",
  privacy: "https://www.iubenda.com/privacy-policy/57601669",
  cookies: "https://www.iubenda.com/privacy-policy/57601669/cookie-policy",
};

type Status = "idle" | "loading" | "success" | "error";

const Newsletter = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      await subscribeEmail(email.trim(), "Website Footer", i18n.language);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,420px)] md:items-end md:gap-12">
      <div>
        <h2 className="t-h2 mb-2">{t("footer.newsletter.title")}</h2>
        <p className="t-body text-muted-foreground">{t("footer.newsletter.body")}</p>
      </div>
      {status === "success" ? (
        <p className="t-body" role="status">
          {t("footer.newsletter.success")}
        </p>
      ) : (
        <form onSubmit={submit} className="w-full">
          <div className="flex gap-2">
            <label htmlFor="footer-email" className="sr-only">
              {t("footer.newsletter.label")}
            </label>
            <input
              id="footer-email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder={t("footer.newsletter.placeholder")}
              aria-describedby="footer-consent"
              className="h-12 min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-[15px] placeholder:text-muted-foreground/80 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="btn-primary shrink-0 px-5"
              aria-label={t("footer.newsletter.submit")}
              aria-disabled={status === "loading" || undefined}
            >
              <span className="hidden sm:inline">{t("footer.newsletter.submit")}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
          {status === "error" && (
            <p role="alert" className="t-small mt-2 text-destructive">
              {t("footer.newsletter.error")}
            </p>
          )}
          <p id="footer-consent" className="t-small mt-3 text-muted-foreground">
            {t("footer.newsletter.consent")}{" "}
            <a href={IUBENDA.privacy} className="underline underline-offset-2 hover:opacity-70">
              {t("footer.privacy")}
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedPath();
  // The Cycle Box page keeps a bar fixed to the bottom on phones: leave room for it.
  const roomForBar = stripLangPrefix(useLocation().pathname) === "/cycle-box";

  const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
    {
      title: t("footer.cols.shop"),
      links: [
        { label: t("nav.pads"), href: "/products/pads" },
        { label: t("nav.tampons"), href: "/products/tampons" },
        { label: t("nav.liners"), href: "/products/panty-liners" },
        { label: t("nav.cycleBox"), href: "/cycle-box" },
      ],
    },
    {
      title: t("footer.cols.about"),
      links: [
        { label: t("nav.ourStory"), href: "/about" },
        { label: t("nav.materials"), href: "/materials" },
        { label: t("nav.giving"), href: "/giving" },
        { label: t("nav.theLore"), href: "/the-lore" },
      ],
    },
    {
      title: t("footer.cols.help"),
      links: [
        { label: t("footer.faq"), href: "/faq" },
        { label: t("footer.shipping"), href: "/shipping" },
        { label: t("footer.returns"), href: "/return-refund-policy" },
        { label: t("footer.contact"), href: "mailto:info@lore-organics.com", external: true },
      ],
    },
    {
      title: t("footer.cols.legal"),
      links: [
        { label: t("footer.terms"), href: IUBENDA.terms, external: true },
        { label: t("footer.privacy"), href: IUBENDA.privacy, external: true },
        { label: t("footer.cookie"), href: IUBENDA.cookies, external: true },
        { label: t("footer.impressum"), href: "/impressum" },
      ],
    },
  ];

  return (
    <footer className={`border-t border-sage-light bg-background ${roomForBar ? "pb-20 lg:pb-0" : ""}`}>
      <div className="container-lore py-[72px] md:py-[96px]">
        <Newsletter />

        <div className="mt-16 border-t border-border pt-12 md:mt-20">
          <Wordmark className="text-foreground" />
          <p className="t-body mt-5 max-w-md text-muted-foreground">{t("footer.tagline")}</p>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-label mb-4 text-foreground">{col.title}</h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a href={l.href} className="t-small text-muted-foreground transition-opacity duration-200 hover:opacity-70">
                          {l.label}
                        </a>
                      ) : (
                        <Link to={localize(l.href)} className="t-small text-muted-foreground transition-opacity duration-200 hover:opacity-70">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-border pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="t-small text-muted-foreground">
            © 2026 Lore Organics B.V. · Schans 178, 1423CB Uithoorn, {t("footer.country")} · KvK 42047169 · BTW NL869464437B01
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:shrink-0 lg:flex-nowrap">
            <Link to={localize("/withdrawal")} className="link-arrow">
              {t("footer.withdraw")}
            </Link>
            <Link to={localize("/cancel-subscription")} className="t-small text-muted-foreground hover:opacity-70">
              {t("footer.cancelSubscription")}
            </Link>
            <a href="https://www.instagram.com/lore.organics/" target="_blank" rel="noopener noreferrer" className="t-small text-muted-foreground hover:opacity-70">
              Instagram
            </a>
            <a href="https://tiktok.com/@lore.organics" target="_blank" rel="noopener noreferrer" className="t-small text-muted-foreground hover:opacity-70">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
