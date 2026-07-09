const ProblemSection = () => {
  return (
    <section className="section-padding bg-lore-charcoal text-primary-foreground">
      <div className="max-w-4xl mx-auto">
        <p className="text-label opacity-50 mb-4">The Problem</p>
        <div className="w-16 h-px bg-lore-sage mb-12" />

        <h2 className="text-editorial-lg mb-12">
          The period care industry<br />is broken.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-serif text-2xl font-medium mb-6 opacity-90">A Plastic Crisis Disguised as Hygiene</h3>
            <div className="space-y-4">
              {[
                { stat: "49B", text: "products used annually in the EU alone" },
                { stat: "90%", text: "of conventional pads are made from plastic" },
                { stat: "800yr", text: "for a single pad to degrade in landfill" },
              ].map((item) => (
                <div
                  key={item.stat}
                  className="group/stat flex items-start gap-4 p-3 -m-3 rounded-sm transition-all duration-300 hover:bg-primary-foreground/[0.04]"
                >
                  <span className="font-serif text-3xl font-light opacity-40 transition-all duration-300 group-hover/stat:opacity-80 group-hover/stat:text-lore-sage">
                    {item.stat}
                  </span>
                  <p className="text-body opacity-70 pt-2 transition-opacity duration-300 group-hover/stat:opacity-100">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-medium mb-6 opacity-90">Hidden Chemicals. Hidden Risks.</h3>
            <ul className="space-y-3">
              {[
                "Super-absorbent rayon linked to higher toxic shock syndrome risk",
                "Dioxins & PEGs raising hormone disruption concerns",
                "Titanium dioxide & synthetic dyes under carcinogen scrutiny",
                "Plastics & coatings causing irritation, allergic reactions & odors",
              ].map((item) => (
                <li
                  key={item}
                  className="group/item text-body opacity-70 flex items-start gap-3 p-2 -m-2 rounded-sm transition-all duration-300 hover:opacity-100 hover:bg-primary-foreground/[0.04]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lore-sage mt-2 shrink-0 transition-transform duration-300 group-hover/item:scale-150" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-primary-foreground/10">
          <p className="text-editorial-md opacity-60 max-w-2xl italic">
            Women manage a natural biological process with products designed decades ago, made of plastic and petrochemicals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
