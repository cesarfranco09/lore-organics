import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const EditorialPauseSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-serif italic text-editorial-md text-muted-foreground">
          We manage one of our most natural processes with products designed decades ago by people who never had a period. Made with plastic. Made with petrochemicals. Made without us in mind.
        </p>
        <Link
          to="/sustainability"
          className="group inline-flex items-center gap-2 text-label text-foreground mt-10 transition-all duration-300 hover:gap-4"
        >
          See what we did differently
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default EditorialPauseSection;
