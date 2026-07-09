import { Leaf, Recycle, TreePine, Factory, Sun, Droplets } from "lucide-react";
import sustainabilityHero from "@/assets/sustainability-hero.webp";
import Seo from "@/components/Seo";

const pillars = [
  {
    icon: Leaf,
    title: "Organic Cotton Sourcing",
    description: "Our cotton is GOTS-certified organic, grown without synthetic pesticides, herbicides, or GMO seeds. Sourced from certified farms with full traceability from field to product.",
  },
  {
    icon: Recycle,
    title: "Full Ingredient Disclosure",
    description: "EU law doesn't require period care brands to list what's in their products. We do it anyway. Every ingredient, every SKU, on the pack and on this site. Because you have the right to know.",
  },
  {
    icon: TreePine,
    title: "FSC-Certified Packaging",
    description: "All packaging is FSC-certified, sourced from responsibly managed forests. We use kraft paper, soy-based inks, and minimal packaging design to reduce waste.",
  },
  {
    icon: Sun,
    title: "Carbon-Conscious Supply Chain",
    description: "We optimize logistics to minimize emissions, sourcing materials and manufacturing within Europe to reduce transport distances.",
  },
  {
    icon: Droplets,
    title: "Water Stewardship",
    description: "Organic cotton farming uses significantly less water than conventional methods. Our partners implement water recycling and responsible irrigation practices.",
  },
];

const Sustainability = () => {
  return (
    <main className="pt-20">
      <Seo
        title="Sustainable Period Care — Plastic Free, Biodegradable Tampons & Pads | Lore Organics"
        description="GOTS certified organic cotton, FSC packaging and biodegradable materials. Sustainable, plastic free period care for Europe — duurzaam maandverband and nachhaltige Periodenprodukte, built to return to the earth."
        path="/sustainability"
      />
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-end pb-16">
        <div className="absolute inset-0">
          <img src={sustainabilityHero} alt="GOTS certified organic cotton field at golden hour, source for Lore Organics plastic free tampons and pads" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-3xl">
          <p className="text-label text-lore-botanical mb-4">Sustainability</p>
          <div className="divider-botanical mb-8" />
          <h1 className="text-editorial-xl mb-6">Designed to return<br />to the earth.</h1>
          <p className="text-body-lg text-muted-foreground max-w-lg">
            Sustainability isn't a feature we add. It's how we design from the start.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding bg-card">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          <p className="text-body-lg text-muted-foreground">
            While you've been changing and evolving into the woman you are today, the pad from your very first period probably hasn't.
          </p>
          <p className="text-body-lg text-muted-foreground">
            Mainstream period products are up to 90% plastic and can take 500–800 years to break down.
          </p>
          <p className="text-body-lg text-muted-foreground">
            That's why we created Lore Organics.
          </p>
          <p className="text-body-lg text-muted-foreground">
            100% GOTS-certified organic cotton top sheet & core to keep you dry. Plant-based bioplastic backing to keep you leak-free. FSC-certified packaging.
          </p>
          <p className="text-body-lg text-muted-foreground">
            But like all humans, we're not perfect. Yet.
          </p>
          <p className="text-body-lg text-muted-foreground">
            Our adhesive is still a work in progress, but other than that, we're biodegrading, honey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
          {[
            { stat: "100%", label: "Organic Cotton" },
            { stat: "FSC", label: "Certified Packaging" },
            { stat: "GOTS", label: "Certified Materials" },
          ].map((item) => (
            <div key={item.label} className="text-center p-6 bg-lore-sage/10 rounded-sm">
              <span className="font-serif text-4xl md:text-5xl font-light text-lore-botanical">{item.stat}</span>
              <p className="text-label text-muted-foreground mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding">
        <div className="text-center mb-16">
          <p className="text-label text-lore-botanical mb-4">Our Commitments</p>
          <div className="divider-botanical mx-auto mb-8" />
          <h2 className="text-editorial-lg">Sustainability pillars.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="group p-5 -m-3 rounded-sm transition-all duration-300 hover:bg-lore-sage/15">
              <div className="w-12 h-12 rounded-full bg-lore-sage/25 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-lore-sage/40">
                <pillar.icon size={28} className="text-lore-botanical" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-medium mb-3">{pillar.title}</h3>
              <p className="text-body text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Lifecycle */}
      <section className="section-padding bg-lore-sage/15">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-editorial-lg mb-6">Product lifecycle.</h2>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
              From certified organic farms to natural decomposition, every stage is considered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Source", desc: "GOTS-certified organic cotton from traceable farms" },
              { step: "02", title: "Manufacture", desc: "Manufactured in Europe. Shorter supply chains, stricter standards" },
              { step: "03", title: "Deliver", desc: "FSC packaging, optimized logistics, minimal waste" },
              { step: "04", title: "Return", desc: "Biodegradable materials designed for natural decomposition. Except for our adhesive, everyone is a work in progress after all" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="font-serif text-5xl font-light text-lore-sage">{item.step}</span>
                <h3 className="font-serif text-xl font-medium mt-4 mb-2">{item.title}</h3>
                <p className="text-body text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Sustainability;
