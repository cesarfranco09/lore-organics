import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Footer = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedPath();

  return (
    <footer className="text-primary-foreground pb-20 md:pb-0" style={{ backgroundColor: "#4B2E38" }}>
      <div className="section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <span className="font-serif text-3xl font-semibold tracking-[0.05em]">LORE</span>
              <br />
              <span className="text-xs font-sans tracking-[0.3em] opacity-60">ORGANICS</span>
            </div>
            <p className="text-body opacity-70 max-w-sm">{t("footer.tagline")}</p>
            <p className="text-xs text-lore-sage mt-4 italic font-serif">{t("footer.fromOneWoman")}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-label mb-6 opacity-60">{t("footer.explore")}</h4>
            <div className="flex flex-col gap-3">
              <Link to={localize("/products")} className="text-body opacity-70 hover:opacity-100 transition-opacity">{t("nav.products")}</Link>
              <Link to={localize("/about")} className="text-body opacity-70 hover:opacity-100 transition-opacity">{t("nav.ourStory")}</Link>
              <Link to={localize("/sustainability")} className="text-body opacity-70 hover:opacity-100 transition-opacity">{t("nav.sustainability")}</Link>
              <Link to={localize("/impact")} className="text-body opacity-70 hover:opacity-100 transition-opacity">{t("nav.impact")}</Link>
              <Link to={localize("/faq")} className="text-body opacity-70 hover:opacity-100 transition-opacity">{t("footer.faq")}</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-label mb-6 opacity-60">{t("footer.connect")}</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/lore.organics/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body opacity-70 hover:opacity-100 transition-opacity"
              >
                Instagram · @lore.organics
              </a>
              <a
                href="https://tiktok.com/@lore.organics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body opacity-70 hover:opacity-100 transition-opacity"
              >
                TikTok · @lore.organics
              </a>
              <a href="mailto:info@lore-organics.com" className="text-body opacity-70 hover:opacity-100 transition-opacity">
                info@lore-organics.com
              </a>
              <span className="text-body opacity-70">Amsterdam, NL</span>
              <LanguageSwitcher className="mt-2" />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-primary-foreground/10 flex flex-wrap justify-center md:justify-between items-center gap-3 text-xs opacity-60">
          <p className="opacity-80">© 2026 Lore Organics B.V.</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 justify-center">
            <span className="opacity-40">·</span>
            <a
              href="https://www.iubenda.com/terms-and-conditions/57601669"
              className="iubenda-white iubenda-noiframe iubenda-embed hover:opacity-100 transition-opacity"
              title={t("footer.terms")}
            >
              {t("footer.terms")}
            </a>
            <span className="opacity-40">·</span>
            <a
              href="https://www.iubenda.com/privacy-policy/57601669"
              className="iubenda-white iubenda-noiframe iubenda-embed hover:opacity-100 transition-opacity"
              title={t("footer.privacy")}
            >
              {t("footer.privacy")}
            </a>
            <span className="opacity-40">·</span>
            <a
              href="https://www.iubenda.com/privacy-policy/57601669/cookie-policy"
              className="iubenda-white iubenda-noiframe iubenda-embed hover:opacity-100 transition-opacity"
              title={t("footer.cookie")}
            >
              {t("footer.cookie")}
            </a>
            <span className="opacity-40">·</span>
            <Link
              to={localize("/return-refund-policy")}
              className="hover:opacity-100 transition-opacity"
            >
              {t("footer.returnRefund")}
            </Link>
            <span className="opacity-40">·</span>
            <a
              href="https://www.instagram.com/lore.organics/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
            >
              Instagram
            </a>
            <span className="opacity-40">·</span>
            <a
              href="https://tiktok.com/@lore.organics"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
            >
              TikTok
            </a>
            <span className="opacity-40">·</span>
            <a href="mailto:info@lore-organics.com" className="hover:opacity-100 transition-opacity">
              info@lore-organics.com
            </a>
          </div>
        </div>
        <p className="mt-6 text-[11px] opacity-50 text-center md:text-left leading-relaxed">
          Lore Organics B.V. | Schans 178, 1423CB Uithoorn, Netherlands | KVK 42047169 | BTW NL869464437B01
        </p>
      </div>
    </footer>
  );
};

export default Footer;
