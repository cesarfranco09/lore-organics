import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import Reveal from "@/components/brand/Reveal";
import cottonPhoto from "@/assets/cotton-texture.webp";

/** One materials block, three tabs (Materials, Testing, Certification). Tabs left, the cotton photo right. */

const TABS = ["materials", "testing", "certification"] as const;
type Tab = (typeof TABS)[number];

const MaterialsTabs = () => {
  const { t } = useTranslation("home");
  const { localize } = useLocalizedPath();
  const [tab, setTab] = useState<Tab>("materials");

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
    setTab(next);
    document.getElementById(`mat-tab-${next}`)?.focus();
  };

  return (
    <section className="section border-t border-border">
      <div className="container-lore grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-label mb-4 text-muted-foreground">{t("materials.label")}</p>
          <h2 className="t-h1 mb-10">{t("materials.heading")}</h2>

          <div role="tablist" aria-label={t("materials.label")} className="mb-8 flex flex-wrap gap-2">
            {TABS.map((k, i) => {
              const active = tab === k;
              return (
                <button
                  key={k}
                  id={`mat-tab-${k}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="mat-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setTab(k)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`h-10 rounded-full border px-5 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
                    active ? "border-primary bg-sage-light/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(`materials.tabs.${k}.title`)}
                </button>
              );
            })}
          </div>

          <div id="mat-panel" role="tabpanel" aria-labelledby={`mat-tab-${tab}`} className="min-h-[9.5rem]">
            <p key={tab} className="t-body measure fade-in text-foreground/85">
              {t(`materials.tabs.${tab}.body`)}
            </p>
          </div>

          <Link to={localize("/materials")} className="link-arrow mt-8">
            {t("materials.cta")} <ArrowRight size={13} />
          </Link>
        </Reveal>

        <Reveal delay={80}>
          <img
            src={cottonPhoto}
            alt={t("materials.imageAlt")}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-xl object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default MaterialsTabs;
