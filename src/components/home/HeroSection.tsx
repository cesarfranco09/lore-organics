import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-main.webp";

const LAUNCH_DATE = new Date("2026-10-01T00:00:00Z");

const daysUntilLaunch = () => {
  const now = new Date();
  const diff = LAUNCH_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const scrollToWaitlist = () => {
  const el = document.getElementById("waitlist");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const scrollToWhyLore = () => {
  const el = document.getElementById("why-lore");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const HeroSection = () => {
  const { t } = useTranslation("home");
  return (
    <section className="relative min-h-screen flex items-end pb-24 md:pb-36">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="GOTS certified organic cotton period care on natural linen — Lore Organics tampons and pads"
          className="w-full h-full object-cover object-center md:object-center [object-position:60%_center] md:[object-position:center]"
          width={1920}
          height={1080}
          loading="eager"
          {...({ fetchpriority: "high" } as any)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 w-full max-w-4xl">
        <h1 className="text-editorial-xl mb-6 fade-in-up" style={{ animationDelay: "0.1s" }}>
          {t("hero.title")}
        </h1>
        <p className="text-body-lg text-muted-foreground max-w-lg mb-6 fade-in-up" style={{ animationDelay: "0.2s" }}>
          {t("hero.body")}
        </p>
        <p className="text-body-lg text-muted-foreground max-w-lg mb-10 mt-6 fade-in-up" style={{ animationDelay: "0.25s" }}>
          {t("hero.signoff")}
        </p>
        <div className="flex gap-4 flex-wrap fade-in-up" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={scrollToWaitlist}
            className="inline-flex items-center justify-center px-8 py-3.5 text-label transition-all duration-300 hover:opacity-90 hover:translate-y-[-2px] active:translate-y-[1px]"
            style={{ backgroundColor: "#4B2E38", color: "#F7F5F1" }}
          >
            {t("hero.ctaWaitlist")}
          </button>
          <button
            onClick={scrollToWhyLore}
            className="inline-flex items-center justify-center px-8 py-3.5 text-label bg-transparent transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
            style={{ border: "1px solid #4B2E38", color: "#4B2E38" }}
          >
            {t("hero.ctaLearn")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
