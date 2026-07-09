import Seo from "@/components/Seo";
import FAQSection from "@/components/home/FAQSection";

const FAQ = () => {
  return (
    <main className="bg-background">
      <Seo
        title="FAQ — Organic Period Care, GOTS Certified Tampons & Pads | Lore Organics"
        description="What is in a conventional tampon? Are your products plastic free? Answers on GOTS certified organic cotton tampons and pads, delivery in the Netherlands and Germany, our subscription and 1% donation model. Biologische tampons & Bio Binden, beantwoord."
        path="/faq"
      />
      <FAQSection />
    </main>
  );
};

export default FAQ;
