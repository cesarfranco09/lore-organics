import { Leaf, Shield, Eye, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Engineered for Comfort",
    description: "Every tampon is wrapped in a 360° cotton safety veil to prevent shedding. No rayon, no polyester, no nasties. Our cotton pads are tested to minimize irritation and odor. Because your period is enough to deal with already.",
  },
  {
    icon: Shield,
    title: "Clean by Design",
    description: "100% organic cotton. A corn-derived bio backing. Chemical free, the way it should be.",
  },
  {
    icon: Eye,
    title: "GOTS-Certified, Field to Shelf",
    description: "Certified at every step. Fair wages. Safe working conditions. No child labor. Because all people are created equal but not all pads are.",
  },
  {
    icon: Heart,
    title: "Transparent by Default",
    description: "Nothing hidden. Every ingredient disclosed. Every product we donate, documented. Because communication is key.",
  },
];

const WhyLoreSection = () => {
  return (
    <section id="why-lore" className="section-padding bg-card">
      <div className="max-w-5xl mx-auto">
        <div>
          <p className="text-label text-muted-foreground mb-4">Why Lore</p>
          <div className="divider-botanical mb-8" />
          <h2 className="text-editorial-lg mb-12">
            A new standard<br />in period care.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 -m-5 rounded-sm transition-all duration-300 hover:bg-lore-sage/15 hover:shadow-[0_4px_20px_-4px_hsl(var(--lore-sage)/0.2)]"
              >
                <div className="w-12 h-12 rounded-full bg-lore-sage/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-lore-sage/35 group-hover:scale-110">
                  <feature.icon
                    size={22}
                    className="text-lore-botanical transition-transform duration-300"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-body text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <p className="font-serif italic text-center text-muted-foreground mt-12">
            Safe. Certified. Transparent.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyLoreSection;
