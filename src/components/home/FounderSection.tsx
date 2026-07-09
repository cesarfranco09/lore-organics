import foundersImage from "@/assets/founders.webp";

const FounderSection = () => {
  return (
    <section className="section-padding bg-lore-sage/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Image */}
        <div className="overflow-hidden">
          <img
            src={foundersImage}
            alt="Geneviève Silvestra and Rachael Hoogkamer, co-founders of Lore Organics — the organic period care brand with nothing to hide"
            className="w-full aspect-[4/3] object-cover object-[center_35%] brightness-110"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div>
          <p className="text-label text-muted-foreground mb-4">Our Founders</p>
          <div className="divider-botanical mb-8" />
          <h2 className="text-editorial-lg mb-8">
            Built by women<br />who wanted better.
          </h2>

          <div className="space-y-4">
            {[
              {
                name: "Geneviève Silvestra",
                role: "Co-Founder & Co-CEO, Brand, Product & Partnerships",
                bio: "Geneviève leads brand development, product strategy, and material standards. With a background in global modeling and brand collaborations, she brings a deep understanding of premium positioning and storytelling.",
              },
              {
                name: "Rachael Hoogkamer",
                role: "Co-Founder & Co-CEO, Operations & Finance",
                bio: "Rachael leads supply chain, logistics, packaging execution, and financial planning. With experience building and scaling multiple businesses, she brings the operational discipline required for sustainable growth.",
              },
            ].map((founder) => (
              <div
                key={founder.name}
                className="group/founder p-6 -mx-6 rounded-sm transition-all duration-300 hover:bg-lore-sage/15 hover:shadow-[0_2px_16px_-4px_hsl(var(--lore-sage)/0.2)]"
              >
                <h3 className="font-serif text-xl font-semibold mb-1">{founder.name}</h3>
                <p className="text-label text-muted-foreground mb-3">{founder.role}</p>
                <p className="text-body text-muted-foreground">{founder.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
