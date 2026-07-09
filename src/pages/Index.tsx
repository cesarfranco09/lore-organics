import HeroSection from "@/components/home/HeroSection";
import WhyLoreSection from "@/components/home/WhyLoreSection";
import ProductPreviewSection from "@/components/home/ProductPreviewSection";
import EditorialPauseSection from "@/components/home/EditorialPauseSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Seo from "@/components/Seo";

const Index = () => {
  return (
    <>
      <Seo
        title="Organic Cotton Tampons & Pads — GOTS Certified | Lore Organics"
        description="Premium organic period care for the Netherlands and Germany. GOTS certified organic cotton tampons, plastic free pads and biodegradable liners. Biologische tampons, biologisch maandverband en Bio Binden, launching October 2026."
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
