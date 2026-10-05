import { useTranslation } from "react-i18next";
import HeroSection from "@/components/home/HeroSection";
import DayNightSection from "@/components/home/DayNightSection";
import ChooseFlowSection from "@/components/home/ChooseFlowSection";
import WhyLoreSection from "@/components/home/WhyLoreSection";
import MaterialsSection from "@/components/home/MaterialsSection";
import EditorialPauseSection from "@/components/home/EditorialPauseSection";
import DonationSection from "@/components/home/DonationSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Seo from "@/components/Seo";

const Index = () => {
  const { t } = useTranslation("home");
  return (
    <>
      <Seo title={t("seo.title")} description={t("seo.description")} path="/" />
      <main>
        <HeroSection />
        <DayNightSection />
        <ChooseFlowSection />
        <WhyLoreSection />
        <MaterialsSection />
        <EditorialPauseSection />
        <DonationSection />
        <NewsletterSection />
      </main>
    </>
  );
};

export default Index;
