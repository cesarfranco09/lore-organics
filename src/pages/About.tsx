import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";

const scrollTop = () => window.scrollTo(0, 0);

const About = () => {
  return (
    <main className="pt-20">
      <Seo
        title="About — Transparent, Organic Period Care Brand | Lore Organics"
        description="A transparent period care brand built around GOTS certified organic cotton tampons and plastic free pads. Meet the founders and the mission behind Lore Organics, organic period care for the Netherlands, Germany and Europe."
        path="/about"
      />

      {/* ═══ SECTION 1, OUR MISSION ═══ */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <p className="text-label text-lore-botanical mb-6">Our Mission</p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-lore-sage to-transparent mb-12" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <h1 className="text-editorial-xl sticky top-28">
                Period care,<br />redesigned.
              </h1>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <div className="bg-card rounded-sm p-8 md:p-12 shadow-[inset_0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-border/40">
                <div className="space-y-6">
                  <p className="text-body-lg text-muted-foreground">
                    We created Lore Organics to bring organic cotton period care to a global scale and make it accessible to all. And in true womanly fashion, it doesn't hurt that we look cute while we do it. Set us on your bathroom counter, give a girlfriend the gift of a non-irritated vagina. And treat yourself to a peaceful mind on your period. No unnecessary chemicals. Plant-based backing that biodegrades. Just GOTS-certified organic cotton, the way it should be.
                  </p>
                </div>
              </div>

              <Link
                to="/products"
                onClick={scrollTop}
                className="inline-flex items-center gap-3 mt-10 text-label text-foreground group"
              >
                Shop Now
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* ═══ SECTION 4, GET TO KNOW US ═══ */}
      <section className="bg-card shadow-[inset_0_2px_12px_-4px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          <div className="relative min-h-[50vh] lg:min-h-full shadow-[8px_0_30px_-10px_rgba(0,0,0,0.1)]">
            <img
              src="/lovable-uploads/1f7dba6d-beca-4ead-bc43-1c502b6f78cc.webp"
              alt="Portrait of Lore Organics co-founders Geneviève Silvestra and Rachael Hoogkamer, founders of a transparent organic period care brand"
              className="absolute inset-0 w-full h-full object-cover object-[center_35%] brightness-110"
              loading="lazy"
            />
          </div>

          <div className="flex items-center px-8 md:px-16 lg:px-20 py-20 md:py-28">
            <div>
              <p className="text-label text-lore-botanical mb-4">Our Story</p>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-lore-sage to-transparent mb-10" />

              <div className="space-y-6">
                <p className="text-body-lg text-muted-foreground">
                  Rachael and Geneviève met nine years ago in Paris, brought together by mutual friends and stories best left untold. The two of them have stuck together ever since.
                </p>
                <p className="text-body-lg text-muted-foreground">
                  Life has changed a lot since then. Rachael gave birth to her two beautiful children, Sofia and Dayan, and moved to Portugal with the love of her life. (Turns out sometimes you just have to kick a few bad apples to the curb, and Prince Charming arrives.)
                </p>
                <p className="text-body-lg text-muted-foreground">
                  Geneviève, godmother to Sofia and Dayan, moved to LA to pursue her acting career and, after a few too many frogs, also met the love of her life.
                </p>
                <p className="text-body-lg text-muted-foreground">
                  Time zones made phone calls harder to catch. Babies and parties made them harder to make. But the two of them were always on the other end of the line when it counted.
                </p>
                <p className="text-body-lg text-muted-foreground">
                  When Geneviève came to Rachael with concerns about toxic period care, the two of them became intoxicated by the idea of a better future, for themselves, for Sofia and Dayan, and for every woman who has ever opened a box of pads.
                </p>
                <p className="text-body-lg text-muted-foreground">
                  And so the Lore began.
                </p>
              </div>


              <Link
                to="/products"
                onClick={scrollTop}
                className="inline-flex items-center gap-3 mt-12 text-label text-foreground group"
              >
                Explore Products
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CLOSING CTA, WAITLIST ═══ */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-editorial-lg mb-6">Be the first to know.</h2>
          <p className="text-body-lg text-muted-foreground mb-10">
            We launch October 1st in the Netherlands and Germany. Get 10% off your first order.
          </p>
          <Link
            to="/#waitlist"
            className="inline-flex items-center justify-center px-8 py-3.5 text-label transition-all duration-300 hover:opacity-90 hover:translate-y-[-2px] active:translate-y-[1px]"
            style={{ backgroundColor: "#4B2E38", color: "#F7F5F1" }}
          >
            Join the waitlist
          </Link>
        </div>
      </section>

    </main>
  );
};

export default About;
