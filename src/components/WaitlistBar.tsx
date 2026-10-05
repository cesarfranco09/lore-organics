import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const scrollToWaitlist = () => {
  const el = document.getElementById("waitlist");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
};

const WaitlistBar = () => {
  const { t } = useTranslation();
  return (
    <button
      onClick={scrollToWaitlist}
      className="md:hidden fixed bottom-3 inset-x-3 z-[80] flex items-center justify-center gap-2 rounded-full bg-lore-night px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-lore-birch shadow-[0_12px_30px_-10px_rgba(30,12,16,0.6)] active:opacity-90"
      aria-label={t("waitlist.cta")}
    >
      {t("waitlist.cta")} <ArrowRight size={14} />
    </button>
  );
};

export default WaitlistBar;
