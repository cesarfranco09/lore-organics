import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import Reveal from "@/components/brand/Reveal";
import ProductImage from "@/components/brand/ProductImage";
import { CERTIFIERS, getProduct, type ProductId } from "@/lib/catalog";

/** Replaces Sustainability: the calm layout kept, one product photo, one accordion from the manufacturer specs. */

interface Material {
  label: string;
  value: string;
}

const SECTIONS = ["pads", "tampons", "liners", "packaging", "certification", "testing"] as const;
const MATERIAL_SOURCE: Partial<Record<(typeof SECTIONS)[number], ProductId>> = {
  pads: "day-pad",
  tampons: "regular-tampon",
  liners: "liner",
};

const Materials = () => {
  const { t } = useTranslation("materials");
  const { t: ts } = useTranslation("shop");
  const [open, setOpen] = useState<string | null>("pads");

  const materialList = (id: ProductId) => {
    const raw = ts(`items.${id}.materials`, { returnObjects: true });
    const list = Array.isArray(raw) ? (raw as Material[]) : [];
    return (
      <dl className="space-y-2">
        {list.map((m) => (
          <div key={m.label} className="flex gap-2">
            <dt className="font-medium text-foreground">{m.label}:</dt>
            <dd>{m.value || <span className="italic">{ts("product.accordion.specSoon")}</span>}</dd>
          </div>
        ))}
      </dl>
    );
  };

  const certBlock = (label: string, lines: string[]) => (
    <div>
      <p className="font-medium text-foreground">{label}</p>
      <p>{lines.join(" · ")}</p>
    </div>
  );

  const body = (key: (typeof SECTIONS)[number]) => {
    const source = MATERIAL_SOURCE[key];
    if (source) return materialList(source);
    if (key === "packaging") return <p>{t("packaging")}</p>;
    if (key === "testing") return <p>{t("testing")}</p>;
    return (
      <div className="space-y-4">
        <p>{t("certification")}</p>
        {certBlock(t("certPads"), CERTIFIERS.pads.lines)}
        {certBlock(t("certTampons"), CERTIFIERS.tampons.lines)}
      </div>
    );
  };

  return (
    <main>
      <Seo title={t("seo.title")} description={t("seo.description")} path="/materials" />

      <section className="section">
        <div className="container-lore grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h1 className="t-h1 mb-6">{t("heading")}</h1>
            <p className="t-lead measure">{t("intro")}</p>
          </Reveal>
          <Reveal delay={80}>
            <ProductImage product={getProduct("day-pad")} alt={t("imageAlt")} className="aspect-[4/3] w-full rounded-xl" scale={0.34} priority />
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-lore grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <Reveal>
            <p className="t-body measure text-muted-foreground">{t("line")}</p>
          </Reveal>
          <div className="border-t border-border">
            {SECTIONS.map((key) => {
              const isOpen = open === key;
              return (
                <div key={key} id={key} className="scroll-mt-32 border-b border-border">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="t-h3">{t(`sections.${key}`)}</span>
                    <Plus size={18} strokeWidth={1.25} className={`text-sage-mid transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <div className="t-body measure pb-6 text-muted-foreground">{body(key)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Materials;
