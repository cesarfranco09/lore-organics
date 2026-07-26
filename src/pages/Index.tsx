import { useTranslation } from "react-i18next";
import HeroSection from "@/components/home/HeroSection";
import WhyLoreSection from "@/components/home/WhyLoreSection";
import ProductPreviewSection from "@/components/home/ProductPreviewSection";
import EditorialPauseSection from "@/components/home/EditorialPauseSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Seo from "@/components/Seo";

const Index = () => {
  const { t } = useTranslation("home");
  return (
    <>
      <Seo
        title={t("seo.title")}
        description={t("seo.description")}
        path="/"
      />
      <main>
        <HeroSection />
        <WhyLoreSection />
        <ProductPreviewSection />
        <EditorialPauseSection />
        <NewsletterSection />
      </main>
    </>
  );
};

export default Index;
