import { Heart } from "lucide-react";

const DonationSection = () => {
  return (
    <section className="section-padding bg-lore-sage/20">
      <div className="max-w-3xl mx-auto text-center">
        <div className="group/heart inline-block cursor-default">
          <Heart
            size={32}
            className="text-lore-plum mx-auto mb-6 transition-all duration-500 group-hover/heart:scale-125 group-hover/heart:fill-lore-plum/30"
            strokeWidth={1}
          />
        </div>
        <p className="text-label text-secondary-foreground mb-4">From One Woman To Another</p>
        <div className="divider-botanical mx-auto mb-10" />

        <h2 className="text-editorial-lg mb-8">
          Period care is a right,<br />not a privilege.
        </h2>

        <p className="text-body-lg text-muted-foreground max-w-xl mx-auto mb-8">
          For every product purchased, Lore donates period care to women in underserved communities. 
          Because no woman should go without.
        </p>

        <p className="text-body text-muted-foreground max-w-lg mx-auto">
          We believe access to safe, dignified period care should be universal. 
          Our "From One Woman to Another" model ensures that your purchase 
          directly supports women who need it most.
        </p>
      </div>
    </section>
  );
};

export default DonationSection;
