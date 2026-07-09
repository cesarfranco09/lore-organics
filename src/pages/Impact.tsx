import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const IVORY = "#F7F5F1";
const FOREST = "#1A3528";
const TERRA = "#C4967A";
const PLUM = "#4B2E38";

const Impact = () => {
  return (
    <main className="pt-[112px]">
      <Seo
        title="Impact — Period Equity in the Netherlands & Germany | Lore Organics"
        description="1% of revenue and a From One Woman to Another donation model. How every purchase of our GOTS certified organic cotton tampons and pads funds period equity across the Netherlands and Germany."
        path="/impact"
      />
      {/* SECTION 1, HERO */}
      <section
        className="px-6 md:px-12 lg:px-24 py-32 md:py-48"
        style={{ backgroundColor: "#D6DDD3", color: FOREST }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
            Period care is a right,<br />not a privilege.
          </h1>
          <p className="font-sans text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            From our very first sale, we give back. Built into every purchase, automatically.
          </p>
        </div>
      </section>

      {/* SECTION 2, THE STAT */}
      <section
        className="px-6 md:px-12 lg:px-24 py-24 md:py-32 text-center"
        style={{ backgroundColor: IVORY }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="font-serif text-8xl md:text-[10rem] leading-none mb-6"
            style={{ color: TERRA }}
          >
            1 in 4
          </p>
          <p className="font-sans text-lg md:text-xl mb-10" style={{ color: FOREST }}>
            women in Germany say the monthly cost of their period is a financial burden.
            <sup><a href="#footnote-1" style={{ color: TERRA }}>1</a></sup> In the Netherlands,
            1 in 8 women couldn't afford the period products they needed in the past year
            and another 1 in 5 could only pay for them with difficulty.
            <sup><a href="#footnote-2" style={{ color: TERRA }}>2</a></sup>
          </p>
          <p className="font-sans text-base leading-relaxed max-w-2xl mx-auto" style={{ color: FOREST }}>
            Lack of access to safe period products impacts education, employment, health, and
            dignity. We believe every woman deserves access to clean, safe period care,
            regardless of circumstance. That belief is built into our business model from
            day one.
          </p>
        </div>
      </section>

      {/* SECTION 3, HOW IT WORKS */}
      <section
        className="px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-foreground/10"
        style={{ backgroundColor: IVORY }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
          {[
            {
              n: "01",
              t: "What We Donate",
              b: "GOTS-certified organic cotton pads and tampons. The same products you buy. We hold the same standard for every Lore product, because women who receive donations deserve the same quality as women who can afford to shop.",
            },
            {
              n: "02",
              t: "Community Partnerships",
              b: <>We partner with local shelters, schools, and community centres to ensure donations reach the women who need them most. Our partner organisations are announced at launch. If you represent an organisation working on period poverty in the Netherlands or Germany, we would love to hear from you at <a href="mailto:info@lore-organics.com" className="underline-offset-4 hover:underline transition-colors" style={{ color: PLUM }}>info@lore-organics.com</a>.</>,
            },
            {
              n: "03",
              t: "Systemic Change",
              b: "Period poverty isn't solved by donations alone. It requires policy change around product transparency, affordability, and access. We're a small brand, but we believe every voice counts and ours will be used.",
            },
          ].map((c) => (
            <div key={c.n}>
              <p className="font-serif text-2xl mb-4" style={{ color: TERRA }}>
                {c.n}
              </p>
              <h3 className="font-serif text-3xl mb-4" style={{ color: FOREST }}>
                {c.t}
              </h3>
              <p className="font-sans text-base leading-relaxed" style={{ color: FOREST }}>
                {c.b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4, TWO WAYS WE GIVE BACK */}
      <section
        className="px-6 md:px-12 lg:px-24 py-24 md:py-32"
        style={{ backgroundColor: IVORY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto items-start">
          <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ color: FOREST }}>
            Two ways<br />we give back.
          </h2>
          <div className="space-y-10">
            <div>
              <p
                className="font-sans text-xs tracking-[0.2em] uppercase mb-4"
                style={{ color: TERRA }}
              >
                1% of revenue, automatic
              </p>
              <p className="font-sans text-base leading-relaxed" style={{ color: FOREST }}>
                Giving is embedded in us. With every purchase, 1% of our proceeds goes towards donating our products to local women in need. We made this choice consciously because every woman deserves access to safe period care, but not every woman has that access. Join us in taking care of each other.
              </p>
            </div>
            <div className="border-t" style={{ borderColor: `${FOREST}33` }} />
            <div>
              <p
                className="font-sans text-xs tracking-[0.2em] uppercase mb-4"
                style={{ color: TERRA }}
              >
                Split the difference
              </p>
              <p className="font-sans text-base leading-relaxed" style={{ color: FOREST }}>
                Because giving should feel active. At checkout, add a pad at cost and we donate it, in full, to women's shelters and local organizations. We track every one, and we'll show you exactly where your impact goes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5, QUOTE PULL */}
      <section
        className="px-6 md:px-12 lg:px-24 py-32 md:py-48 text-center"
        style={{ backgroundColor: PLUM, color: IVORY }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="font-serif italic text-4xl md:text-6xl leading-tight mb-8 whitespace-pre-line">
            Love,&nbsp;{"\n"}
            Rachael &amp; Geneviève.{"\n\n"}
          </p>
          <p className="font-sans text-sm tracking-wide opacity-80">
            Co-Founders of Lore Organics
          </p>
          <div className="mt-16 pt-8 border-t max-w-2xl mx-auto text-left space-y-2" style={{ borderColor: `${IVORY}33` }}>
            <p id="footnote-1" className="font-sans text-xs opacity-70 leading-relaxed">
              <sup>1</sup> Plan International Deutschland &amp; WASH United, "Menstruation im Fokus," 2022.
            </p>
            <p id="footnote-2" className="font-sans text-xs opacity-70 leading-relaxed">
              <sup>2</sup> Neighborhood Feminists &amp; Opinium, CODE RED 2024.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6, CTA */}
      <section
        className="px-6 md:px-12 lg:px-24 py-24 md:py-32 text-center"
        style={{ backgroundColor: IVORY }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl mb-6" style={{ color: FOREST }}>
            Every purchase makes a difference.
          </h2>
          <p className="font-sans text-lg mb-10" style={{ color: FOREST }}>
            Join the waitlist and be part of the movement from day one.
          </p>
          <Link
            to="/#waitlist"
            className="inline-block px-10 py-4 font-sans text-sm tracking-[0.15em] uppercase transition-opacity hover:opacity-90"
            style={{ backgroundColor: FOREST, color: IVORY }}
          >
            Join the waitlist
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Impact;
