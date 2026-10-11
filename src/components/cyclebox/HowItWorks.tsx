import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/brand/Reveal";
import LeafShadow from "@/components/brand/LeafShadow";
import { CATALOG, familyColor } from "@/lib/catalog";
import { SUBSCRIPTION_CADENCES, type SubscriptionCadence } from "@/lib/pricing";
import { useScrollProgress, segment } from "@/hooks/useScrollProgress";

/**
 * "How it works" as a four-step timeline: choose a rhythm (a 12-month
 * calendar), build the box, it arrives, adjust anytime. The connecting line
 * draws itself as the section scrolls into view; each step has a small,
 * calm visual. Animations stop under prefers-reduced-motion.
 */

const MONTHS_BETWEEN: Record<SubscriptionCadence, number> = { "2m": 2, "3m": 3, "6m": 6 };

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Cycles through values every `ms` until the visitor interacts. */
function useAutoCycle<T>(values: readonly T[], initial: T, ms: number) {
  const [value, setValue] = useState<T>(initial);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (touched || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setValue((v) => values[(values.indexOf(v) + 1) % values.length]);
    }, ms);
    return () => window.clearInterval(id);
  }, [touched, values, ms]);
  const choose = (v: T) => {
    setTouched(true);
    setValue(v);
  };
  return [value, choose] as const;
}

/* ─── Step visuals ─── */

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`relative isolate flex min-h-[15rem] w-full items-center justify-center overflow-hidden rounded-3xl py-6 bg-lore-birch shadow-[0_24px_50px_-34px_rgba(58,46,41,0.55)] ${className}`}
  >
    <LeafShadow color="rgb(58, 46, 41)" opacity={0.07} seed={8} blur={10} still sunlight={false} />
    <div className="relative w-full px-5">{children}</div>
  </div>
);

const YearCalendar = () => {
  const { t, i18n } = useTranslation("cyclebox");
  const [cadence, choose] = useAutoCycle(SUBSCRIPTION_CADENCES, "3m" as SubscriptionCadence, 2600);
  const step = MONTHS_BETWEEN[cadence];
  const months = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(i18n.language, { month: "narrow" });
    return Array.from({ length: 12 }, (_, m) => fmt.format(new Date(2026, m, 1)));
  }, [i18n.language]);

  return (
    <Card>
      <div className="mb-4 flex justify-center gap-1.5" role="radiogroup" aria-label={t("howItWorks.step1.title")}>
        {SUBSCRIPTION_CADENCES.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={c === cadence}
            onClick={() => choose(c)}
            onMouseEnter={() => choose(c)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors duration-300 ${
              c === cadence ? "bg-lore-night text-lore-birch" : "bg-lore-linen text-lore-charcoal/70 hover:text-lore-night"
            }`}
          >
            {t("howItWorks.months", { count: MONTHS_BETWEEN[c] })}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1.5" aria-hidden="true">
        {months.map((m, i) => {
          const delivery = i % step === 0;
          return (
            <div
              key={i}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-[10px] transition-all duration-500 ${
                delivery ? "bg-lore-night text-lore-birch" : "bg-lore-linen/70 text-lore-charcoal/50"
              }`}
              style={{ transform: delivery ? "scale(1)" : "scale(0.92)" }}
            >
              <span>{m}</span>
              <span
                className="mt-0.5 h-1 w-1 rounded-full bg-current transition-opacity duration-500"
                style={{ opacity: delivery ? 1 : 0 }}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[11px] text-lore-charcoal/70" aria-live="polite">
        {t("howItWorks.perYear", { count: 12 / step })}
      </p>
    </Card>
  );
};

const BoxStack = () => {
  const products = CATALOG.filter((p) => !p.comingSoon);
  return (
    <Card>
      <div className="relative mx-auto h-36 w-32" aria-hidden="true">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="hiw-drop absolute left-1/2 h-8 rounded-md shadow-[0_6px_14px_-8px_rgba(30,15,18,0.6)]"
            style={{
              background: familyColor(p),
              width: 112 - i * 8,
              bottom: i * 30,
              marginLeft: -(112 - i * 8) / 2,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
        <div className="absolute -bottom-2 left-1/2 h-3 w-40 -translate-x-1/2 rounded-[50%] bg-lore-charcoal/15 blur-sm" />
      </div>
    </Card>
  );
};

const Arrival = () => {
  const { t } = useTranslation("cyclebox");
  return (
    <Card>
      <div className="relative mx-auto h-36 w-44" aria-hidden="true">
        <svg viewBox="0 0 176 144" className="h-full w-full" fill="none" stroke="hsl(var(--lore-night))" strokeWidth={1.3}>
          {/* door frame + mat */}
          <path d="M40 8 V120 M136 8 V120 M40 8 H136" opacity={0.35} />
          <circle cx="124" cy="68" r="2" fill="hsl(var(--lore-night))" opacity={0.35} />
          <path d="M22 132 H154" opacity={0.5} />
          <rect x="52" y="124" width="72" height="6" rx="2" opacity={0.35} />
        </svg>
        <div className="hiw-arrive absolute bottom-[22px] left-1/2 -ml-[34px] h-[46px] w-[68px] rounded-md bg-lore-night shadow-[0_10px_20px_-10px_rgba(30,15,18,0.7)]">
          <div className="absolute inset-x-0 top-[13px] h-px bg-lore-birch/30" />
          <span className="absolute inset-x-0 bottom-2 text-center font-serif text-[11px] tracking-[0.2em] text-lore-birch">
            LORE
          </span>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-lore-night/80">
        {t("hero.discreet")}
      </p>
    </Card>
  );
};

type AdjustAction = "skip" | "pause" | "cancel";
const ACTIONS: readonly AdjustAction[] = ["skip", "pause", "cancel"];

const Adjust = () => {
  const { t, i18n } = useTranslation("cyclebox");
  const [action, choose] = useAutoCycle(ACTIONS, "skip" as AdjustAction, 2400);
  const next = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + (action === "skip" ? 6 : 3), 12);
    return new Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "long" }).format(d);
  }, [action, i18n.language]);
  const status =
    action === "skip"
      ? t("howItWorks.adjust.skipped", { date: next })
      : action === "pause"
        ? t("howItWorks.adjust.paused")
        : t("howItWorks.adjust.cancelled");

  return (
    <Card>
      <div className="mx-auto max-w-[260px] rounded-2xl bg-lore-linen/70 p-4">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-lore-charcoal/60">
          {t("howItWorks.adjust.title")}
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {ACTIONS.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={a === action}
              onClick={() => choose(a)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-300 ${
                a === action ? "bg-lore-night text-lore-birch" : "bg-lore-birch text-lore-charcoal/70 hover:text-lore-night"
              }`}
            >
              {t(`howItWorks.adjust.${a}`)}
            </button>
          ))}
        </div>
        <p key={action} className="fade-in-up text-[12px] leading-snug text-lore-charcoal" aria-live="polite">
          {status}
        </p>
      </div>
    </Card>
  );
};

/* ─── Section ─── */

const HowItWorks = () => {
  const { t } = useTranslation("cyclebox");
  const [ref, p] = useScrollProgress<HTMLElement>("pass");
  const line = segment(p, 0.18, 0.55);

  const steps = [
    { title: t("howItWorks.step1.title"), body: t("builder.carbon"), visual: <YearCalendar /> },
    { title: t("howItWorks.step2.title"), body: t("howItWorks.step2.desc"), visual: <BoxStack /> },
    { title: t("howItWorks.step3.title"), body: t("howItWorks.step1.desc"), visual: <Arrival /> },
    { title: t("howItWorks.step4.title"), body: t("perks.2"), visual: <Adjust /> },
  ];

  return (
    <section ref={ref} id="how-it-works" className="relative overflow-hidden bg-lore-ivory px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <style>{HIW_STYLES}</style>
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-16 text-center md:mb-20">
          <p className="text-label mb-4 text-lore-night/70">{t("howItWorks.label")}</p>
          <h2 className="text-editorial-lg">{t("howItWorks.title")}</h2>
        </Reveal>

        <ol className="relative grid grid-cols-1 gap-14 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {/* connecting line: horizontal on desktop, vertical on phones */}
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-lore-charcoal/10 xl:block" aria-hidden="true">
            <div className="h-full origin-left bg-lore-night/60" style={{ transform: `scaleX(${line})` }} />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-5 top-5 w-px bg-lore-charcoal/10 md:hidden" aria-hidden="true">
            <div className="w-full origin-top bg-lore-night/60" style={{ height: `${line * 100}%` }} />
          </div>

          {steps.map((s, i) => (
            <Reveal as="li" key={i} delay={i * 110} className="relative pl-14 md:pl-0">
              <div className="mb-6 flex items-center md:justify-start xl:justify-center">
                <span
                  className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border font-sans text-sm font-medium transition-colors duration-500 md:static"
                  style={{
                    borderColor: "hsl(var(--lore-night) / 0.4)",
                    background: line > (i + 0.5) / 4 ? "hsl(var(--lore-night))" : "hsl(var(--lore-ivory))",
                    color: line > (i + 0.5) / 4 ? "hsl(var(--lore-birch))" : "hsl(var(--lore-night))",
                  }}
                >
                  {i + 1}
                </span>
              </div>
              {s.visual}
              <h3 className="mb-2 mt-6 font-serif text-2xl font-light xl:text-center">{s.title}</h3>
              <p className="text-body text-muted-foreground xl:text-center">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};

const HIW_STYLES = `
@keyframes hiwDrop {
  0%, 8% { transform: translateY(-140px); opacity: 0; }
  22% { transform: translateY(4px); opacity: 1; }
  28%, 80% { transform: translateY(0); opacity: 1; }
  92%, 100% { transform: translateY(0); opacity: 0; }
}
@keyframes hiwArrive {
  0% { transform: translateY(-120px) rotate(-6deg); opacity: 0; }
  30% { transform: translateY(3px) rotate(0deg); opacity: 1; }
  38%, 82% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(0); opacity: 0; }
}
.hiw-drop { animation: hiwDrop 5.5s cubic-bezier(0.22, 1, 0.36, 1) infinite both; }
.hiw-arrive { animation: hiwArrive 4.5s cubic-bezier(0.22, 1, 0.36, 1) infinite both; }
@media (prefers-reduced-motion: reduce) {
  .hiw-drop, .hiw-arrive { animation: none; }
}
`;

export default HowItWorks;
