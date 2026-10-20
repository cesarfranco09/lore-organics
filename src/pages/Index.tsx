import { useTranslation } from "react-i18next";
import HeroSection from "@/components/home/HeroSection";
import ClaimsStrip from "@/components/home/ClaimsStrip";
import RangeSection from "@/components/home/RangeSection";
import FirstPeriodSection from "@/components/home/FirstPeriodSection";
import HowItWorks from "@/components/cyclebox/HowItWorks";
import MaterialsTabs from "@/components/home/MaterialsTabs";
import FoundersSection from "@/components/home/FoundersSection";
import LoreRow from "@/components/home/LoreRow";
import GivingBand from "@/components/home/GivingBand";
import Seo from "@/components/Seo";

/** Twelve calm sections on one cream background (brief §1): bar, header, then these, then the footer. */
const Index = () => {
  const { t } = useTranslation("home");
  return (
    <>
      <Seo title={t("seo.title")} description={t("seo.description")} path="/" />
      <main>
        <HeroSection />
        <ClaimsStrip />
        <RangeSection />
        <FirstPeriodSection />
        <HowItWorks withButton className="border-t border-border" />
        <MaterialsTabs />
        <FoundersSection />
        <LoreRow />
        <GivingBand />
      </main>
    </>
  );
};

export default Index;
