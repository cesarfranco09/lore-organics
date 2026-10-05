import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { stripLangPrefix } from "@/lib/i18n";
import { WELCOME_DISCOUNT_PERCENT } from "@/lib/pricing";
import LeafShadow from "@/components/brand/LeafShadow";
import Wordmark from "@/components/brand/Wordmark";

/* ------------------------------------------------------------------ */
/* Klaviyo                                                             */
/* ------------------------------------------------------------------ */

const KLAVIYO_COMPANY_ID = "YiRTrJ";

/**
 * Klaviyo list for pop-up sign-ups.
 *
 * TODO (team): create/confirm a separate "Welcome 10%" list in Klaviyo, attach
 * a flow to it that sends the unique one-time 10% code, and put its id here.
 * `XdjM7r` is the "Waitlist Pre-Launch" list and is only a placeholder — the
 * waitlist list itself must stay as it is.
 */
const SIGNUP_LIST_ID = "XdjM7r";

async function subscribe(email: string): Promise<void> {
  const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", revision: "2024-10-15" },
    body: JSON.stringify({
      data: {
        type: "subscription",
        attributes: {
          custom_source: "Website Popup",
          profile: { data: { type: "profile", attributes: { email } } },
        },
        relationships: { list: { data: { type: "list", id: SIGNUP_LIST_ID } } },
      },
    }),
  });
  if (!res.ok) throw new Error(`Klaviyo ${res.status}`);
}

/* ------------------------------------------------------------------ */
/* When to show                                                        */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "lore-signup-popup";
const SHOW_DELAY_MS = 9_000;
const EXIT_INTENT_MIN_MS = 4_000;
/** Breathing room after the cookie banner is answered/gone. */
const AFTER_CONSENT_MS = 2_000;
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

interface PopupState {
  closedAt?: number;
  subscribed?: boolean;
}

function readState(): PopupState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PopupState) : {};
  } catch {
    return {};
  }
}

function writeState(next: PopupState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readState(), ...next }));
  } catch {
    /* storage unavailable: the pop-up may show again next visit, which is fine */
  }
}

function isSnoozed(): boolean {
  const s = readState();
  if (s.subscribed) return true;
  return typeof s.closedAt === "number" && Date.now() - s.closedAt < SNOOZE_MS;
}

/**
 * The iubenda banner has been dealt with: either a stored preference exists
 * (accepted or rejected), or no banner is on the page.
 */
function consentSettled(): boolean {
  try {
    const prefs = window._iub?.cs?.api?.getPreferences?.();
    if (prefs && (prefs.consent !== undefined || Object.keys(prefs.purposes ?? {}).length > 0)) return true;
  } catch {
    /* fall through to the DOM check */
  }
  // The banner is position:fixed, so offsetParent can't tell us if it's visible.
  const banner = document.getElementById("iubenda-cs-banner");
  if (!banner) return true;
  const style = window.getComputedStyle(banner);
  const rect = banner.getBoundingClientRect();
  return style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0 || rect.height === 0;
}

const isCheckoutPath = (pathname: string) => stripLangPrefix(pathname).startsWith("/checkout");

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type Status = "idle" | "loading" | "success" | "error";

const SignupPopup = () => {
  const { t, ready } = useTranslation("popup");
  const { pathname } = useLocation();
  const { isOpen: cartOpen } = useCart();
  const onCheckout = isCheckoutPath(pathname);

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Latest values for the timers without restarting them.
  const blockedRef = useRef(false);
  blockedRef.current = cartOpen || onCheckout || !ready;
  const shownRef = useRef(false);

  const show = useCallback(() => {
    if (shownRef.current || blockedRef.current || isSnoozed()) return;
    shownRef.current = true;
    writeState({ closedAt: Date.now() }); // once per visitor, even if they just leave the page
    setOpen(true);
  }, []);

  useEffect(() => {
    if (isSnoozed()) return;
    const start = Date.now();
    let settledAt: number | null = null;

    const settledLongEnough = () => {
      if (consentSettled()) {
        settledAt ??= Date.now();
      } else {
        settledAt = null;
      }
      return settledAt !== null && Date.now() - settledAt >= AFTER_CONSENT_MS;
    };

    const tick = window.setInterval(() => {
      const ok = settledLongEnough();
      if (shownRef.current) return window.clearInterval(tick);
      if (ok && Date.now() - start >= SHOW_DELAY_MS && document.visibilityState === "visible") show();
    }, 500);

    // Exit intent: desktop pointer leaving through the top of the window.
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 0) return;
      if (Date.now() - start < EXIT_INTENT_MIN_MS || !settledLongEnough()) return;
      show();
    };
    if (desktop) document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.clearInterval(tick);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [show]);

  // Never over the checkout page.
  useEffect(() => {
    if (onCheckout) setOpen(false);
  }, [onCheckout]);

  const handleOpenChange = (next: boolean) => {
    if (!next && status !== "success") writeState({ closedAt: Date.now() });
    setOpen(next);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      await subscribe(email.trim());
      writeState({ subscribed: true });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const pct = `${WELCOME_DISCOUNT_PERCENT}%`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-lore-charcoal/45 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:duration-500 motion-reduce:!animate-none" />
        <DialogPrimitive.Content
          ref={contentRef}
          onOpenAutoFocus={(e) => {
            // Desktop: straight into the email field. Phones: don't pop the keyboard.
            e.preventDefault();
            const desktop = window.matchMedia("(min-width: 768px)").matches;
            (desktop ? inputRef.current : contentRef.current)?.focus();
          }}
          className="fixed z-[101] flex flex-col overflow-hidden bg-lore-birch text-lore-charcoal shadow-[0_40px_120px_-40px_rgba(30,12,16,0.7)] outline-none
            inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[28px]
            md:inset-auto md:left-1/2 md:top-1/2 md:grid md:max-h-[min(640px,calc(100dvh-48px))] md:w-[min(880px,calc(100vw-48px))] md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-[5fr_6fr] md:overflow-hidden md:rounded-[28px]
            data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-500 data-[state=closed]:duration-300
            data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
            md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:zoom-in-[0.97] md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=closed]:zoom-out-[0.97]
            motion-reduce:!animate-none"
        >
          {/* Maroon side: compact band on phones, full panel on desktop */}
          <div className="relative flex h-36 shrink-0 items-center justify-center overflow-hidden bg-lore-night text-lore-birch md:h-auto md:min-h-[520px]">
            <LeafShadow color="rgba(18, 6, 9, 1)" opacity={0.42} seed={23} blur={12} sunlight />
            <div className="relative flex flex-col items-center gap-3 md:gap-10">
              <Wordmark size="md" />
              <span className="hidden font-serif text-[120px] font-light leading-none tracking-[-0.02em] text-lore-birch/90 md:block" aria-hidden="true">
                {pct}
              </span>
            </div>
          </div>

          {/* Cream side */}
          <div className="flex flex-col justify-center px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-7 md:px-12 md:py-14">
            {status === "success" ? (
              <div className="text-center md:text-left" role="status">
                <p className="text-label mb-4 text-lore-night/70">{t("label")}</p>
                <DialogPrimitive.Title className="text-editorial-md mb-4 text-lore-night">{t("successTitle")}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-body text-lore-charcoal/80">{t("success")}</DialogPrimitive.Description>
                <DialogPrimitive.Close className="btn-ghost mt-8 w-full text-lore-night md:w-auto">{t("close")}</DialogPrimitive.Close>
              </div>
            ) : (
              <>
                <p className="text-label mb-3 text-lore-night/70 md:mb-5">{t("label")}</p>
                <DialogPrimitive.Title className="text-editorial-md mb-3 text-lore-night md:mb-4">{t("title")}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-body mb-6 text-lore-charcoal/80 md:mb-8">{t("body")}</DialogPrimitive.Description>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <label htmlFor="signup-popup-email" className="sr-only">
                    {t("emailLabel")}
                  </label>
                  <input
                    ref={inputRef}
                    id="signup-popup-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder={t("placeholder")}
                    aria-invalid={status === "error" || undefined}
                    aria-describedby={status === "error" ? "signup-popup-error" : "signup-popup-consent"}
                    readOnly={status === "loading"}
                    className="w-full rounded-full border border-lore-night/25 bg-white/60 px-5 py-3.5 text-[15px] text-lore-charcoal placeholder:text-lore-charcoal/45 transition-colors focus:border-lore-night focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lore-night/20"
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full aria-disabled:cursor-wait aria-disabled:opacity-70"
                    aria-disabled={status === "loading" || undefined}
                  >
                    {status === "loading" ? t("submitting") : t("submit")}
                    {status !== "loading" && <ArrowRight size={14} aria-hidden="true" />}
                  </button>
                  {status === "error" && (
                    <p id="signup-popup-error" role="alert" className="text-center text-[13px] text-destructive">
                      {t("error")}
                    </p>
                  )}
                </form>

                <p id="signup-popup-consent" className="mt-4 text-center text-[12px] leading-relaxed text-lore-charcoal/60 md:text-left">
                  {t("consent")}
                </p>
                <DialogPrimitive.Close className="mx-auto mt-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-lore-night/55 underline-offset-4 transition-colors hover:text-lore-night hover:underline md:mx-0 md:self-start">
                  {t("noThanks")}
                </DialogPrimitive.Close>
              </>
            )}
          </div>

          <DialogPrimitive.Close
            aria-label={t("close")}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-lore-birch/85 transition-colors hover:bg-white/10 hover:text-lore-birch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current md:right-4 md:top-4 md:text-lore-night/70 md:hover:bg-lore-night/5 md:hover:text-lore-night"
          >
            <X size={18} strokeWidth={1.5} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default SignupPopup;
