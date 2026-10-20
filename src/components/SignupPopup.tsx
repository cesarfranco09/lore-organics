import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { stripLangPrefix } from "@/lib/i18n";
import ProductImage from "@/components/brand/ProductImage";
import { getProduct } from "@/lib/catalog";
import { subscribeEmail } from "@/lib/klaviyo";

/* ------------------------------------------------------------------ */
/* When to show                                                        */
/* ------------------------------------------------------------------ */

/**
 * Once per visitor, on every device: after 15 seconds or half-way down the
 * page, whichever comes first. Closing or signing up hides it for 30 days
 * (per browser). It waits for the cookie banner to be answered, but never
 * longer than 20 extra seconds, so it can't silently never show.
 */
const STORAGE_KEY = "lore-signup-popup";
const SHOW_DELAY_MS = 15_000;
const SCROLL_SHARE = 0.5;
/** Breathing room after the cookie banner is answered/gone. */
const AFTER_CONSENT_MS = 2_000;
/** Show anyway if the cookie banner is still open this long after the trigger. */
const MAX_CONSENT_WAIT_MS = 20_000;
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
  const { t, ready, i18n } = useTranslation("popup");
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
    let triggeredAt: number | null = null;
    let settledAt: number | null = null;

    const scrolledHalf = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 && window.scrollY / max >= SCROLL_SHARE;
    };

    const tick = window.setInterval(() => {
      if (shownRef.current) return window.clearInterval(tick);
      if (triggeredAt === null && (Date.now() - start >= SHOW_DELAY_MS || scrolledHalf())) triggeredAt = Date.now();
      if (triggeredAt === null || document.visibilityState !== "visible") return;

      if (consentSettled()) settledAt ??= Date.now();
      else settledAt = null;
      const consentOk = settledAt !== null && Date.now() - settledAt >= AFTER_CONSENT_MS;
      if (consentOk || Date.now() - triggeredAt >= MAX_CONSENT_WAIT_MS) show();
    }, 500);

    return () => window.clearInterval(tick);
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
      await subscribeEmail(email.trim(), "Website Popup", i18n.language);
      writeState({ subscribed: true });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-foreground/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:duration-500 motion-reduce:!animate-none" />
        <DialogPrimitive.Content
          ref={contentRef}
          onOpenAutoFocus={(e) => {
            // Desktop: straight into the email field. Phones: don't pop the keyboard.
            e.preventDefault();
            const desktop = window.matchMedia("(min-width: 768px)").matches;
            (desktop ? inputRef.current : contentRef.current)?.focus();
          }}
          className="fixed z-[101] flex flex-col overflow-hidden bg-card text-foreground shadow-[0_40px_120px_-40px_rgba(47,51,46,0.6)] outline-none
            inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-2xl
            md:inset-auto md:left-1/2 md:top-1/2 md:grid md:max-h-[min(640px,calc(100dvh-48px))] md:w-[min(820px,calc(100vw-48px))] md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-2 md:overflow-hidden md:rounded-2xl
            data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-500 data-[state=closed]:duration-300
            data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
            md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:zoom-in-[0.97] md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=closed]:zoom-out-[0.97]
            motion-reduce:!animate-none"
        >
          {/* Daylight product photo: a short band on phones, the left half on desktop */}
          <ProductImage
            product={getProduct("night-pad")}
            alt=""
            scale={0.4}
            className="h-40 shrink-0 md:h-auto md:min-h-[480px]"
          />

          {/* Cream side */}
          <div className="flex flex-col justify-center px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-7 md:px-12 md:py-14">
            {status === "success" ? (
              <div className="text-center md:text-left" role="status">
                <p className="text-label mb-4 text-muted-foreground">{t("label")}</p>
                <DialogPrimitive.Title className="t-h2 mb-4">{t("successTitle")}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-body text-foreground/80">{t("success")}</DialogPrimitive.Description>
                <DialogPrimitive.Close className="btn-ghost mt-8 w-full text-foreground md:w-auto">{t("close")}</DialogPrimitive.Close>
              </div>
            ) : (
              <>
                <p className="text-label mb-3 text-muted-foreground md:mb-5">{t("label")}</p>
                <DialogPrimitive.Title className="t-h2 mb-3 md:mb-4">{t("title")}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-body mb-6 text-foreground/80 md:mb-8">{t("body")}</DialogPrimitive.Description>

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
                    className="h-12 w-full rounded-full border border-border bg-background px-5 text-[15px] placeholder:text-muted-foreground/80 transition-colors focus:border-primary focus:outline-none"
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

                <p id="signup-popup-consent" className="mt-4 text-center text-[12px] leading-relaxed text-muted-foreground md:text-left">
                  {t("consent")}{" "}
                  <a href="https://www.iubenda.com/privacy-policy/57601669" className="underline underline-offset-2 hover:opacity-70">
                    {t("privacy")}
                  </a>
                  .
                </p>
                <DialogPrimitive.Close className="mx-auto mt-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 transition-opacity hover:opacity-70 md:mx-0 md:self-start">
                  {t("noThanks")}
                </DialogPrimitive.Close>
              </>
            )}
          </div>

          <DialogPrimitive.Close
            aria-label={t("close")}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:right-4 md:top-4"
          >
            <X size={18} strokeWidth={1.5} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default SignupPopup;
