import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "react-i18next";
import { X, Minus, Plus, ArrowRight, Heart, Truck } from "lucide-react";
import { isStoreLive } from "@/lib/shopify";
import { isDonationItem } from "@/lib/donations";
import { SHIPPING, formatEuro } from "@/lib/pricing";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import GiveOneSection from "@/components/donation/GiveOneSection";

/** Progress toward free shipping on the cart subtotal (threshold from the brief). */
const FreeShippingProgress = ({ subtotal, lang }: { subtotal: number; lang: string }) => {
  const { t } = useTranslation();
  const remaining = Math.max(0, SHIPPING.freeThreshold - subtotal);
  const unlocked = remaining <= 0.004; // guard against float noise
  const progress = Math.min(1, subtotal / SHIPPING.freeThreshold);

  return (
    <div className="mb-4">
      <p className="flex items-center gap-2 text-[13px] leading-snug text-lore-night" aria-live="polite">
        <Truck size={14} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
        {unlocked
          ? t("freeShipping.unlocked")
          : t("freeShipping.away", { amount: formatEuro(remaining, lang) })}
      </p>
      <div
        className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-lore-night/10"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left rounded-full bg-lore-night transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
};

const CartDrawer = () => {
  const { t } = useTranslation();
  const { lang } = useLocalizedPath();
  const { items, totalItems, subtotal, isOpen, closeCart, removeItem, updateQuantity, beginCheckout, isCheckingOut } = useCart();
  const storeLive = isStoreLive();

  return (
    <>
      {/* Backdrop. Above the mobile WaitlistBar (z-80) so it can't cover the checkout button. */}
      <div
        className={`fixed inset-0 z-[85] bg-lore-charcoal/30 backdrop-blur-[3px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer, right on desktop, bottom sheet on mobile */}
      <div
        role="dialog"
        aria-label={t("cart.title")}
        className={`fixed z-[90] flex flex-col bg-lore-birch text-lore-charcoal shadow-[0_-20px_60px_-30px_rgba(40,20,24,0.45)] transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.32,0,0.15,1)] motion-reduce:transition-none
          inset-x-0 bottom-0 max-h-[85vh] max-h-[85dvh] rounded-t-[28px]
          md:top-0 md:bottom-0 md:right-0 md:left-auto md:max-h-none md:w-[440px] md:rounded-none md:shadow-[-30px_0_80px_-40px_rgba(40,20,24,0.5)]
          ${isOpen ? "visible translate-y-0 md:translate-x-0" : "invisible translate-y-full md:translate-y-0 md:translate-x-full"}
        `}
      >
        {/* Grab handle (mobile) */}
        <div className="flex justify-center pt-3 md:hidden" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-lore-night/15" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-3 md:px-8 md:pb-5 md:pt-7">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-[28px] font-light leading-none text-lore-night">{t("cart.title")}</span>
            {totalItems > 0 && (
              <span className="text-label text-lore-night/60">({totalItems})</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-lore-night/70 transition-colors hover:bg-lore-night/5 hover:text-lore-night"
            aria-label={t("cart.close")}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="mx-6 h-px shrink-0 bg-lore-night/10 md:mx-8" />

        {/* Items */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 md:px-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 py-14 text-center">
              <p className="font-serif text-2xl font-light text-lore-night/70">{t("cart.empty")}</p>
              <button onClick={closeCart} className="btn-ghost px-7 py-3 text-lore-night">
                {t("cart.continueShopping")}
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-lore-night/10">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5 first:pt-0">
                  {/* Image */}
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-lore-linen">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-serif text-[19px] font-normal leading-tight text-lore-night">{item.name}</p>
                        {isDonationItem(item) && (
                          <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-lore-night/80">
                            <Heart size={10} strokeWidth={1.5} fill="currentColor" />
                            {t("cart.donated", { region: item.attributes?.find((a) => a.key === "Donation partner")?.value })}
                          </p>
                        )}
                      </div>
                      {storeLive && (
                        <span className="shrink-0 font-serif text-[17px] text-lore-night">
                          {formatEuro(item.price * item.quantity, lang)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Qty controls */}
                      <div className="flex items-center rounded-full border border-lore-night/20">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-lore-night transition-colors hover:bg-lore-night/5 active:scale-90"
                          aria-label={t("cart.decrease")}
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="w-6 text-center font-sans text-[13px] tabular-nums" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-lore-night transition-colors hover:bg-lore-night/5 active:scale-90"
                          aria-label={t("cart.increase")}
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] font-medium uppercase tracking-[0.22em] text-lore-night/50 underline-offset-4 transition-colors hover:text-lore-night hover:underline"
                      >
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* From One Woman to Another donation section */}
          <GiveOneSection variant="drawer" />
        </div>

        {/* Footer: shrink-0 keeps checkout visible on every viewport */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-lore-night/10 bg-lore-ivory px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-7">
            {/* Shipping progress + subtotal once the store is live (hidden during pricing review) */}
            {storeLive && (
              <>
                <FreeShippingProgress subtotal={subtotal} lang={lang} />
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-label text-lore-night/70">{t("cart.subtotal")}</span>
                  <span className="font-serif text-2xl font-light text-lore-night">{formatEuro(subtotal, lang)}</span>
                </div>
              </>
            )}

            {/* Checkout: hands off to Shopify's secure hosted checkout when live */}
            {storeLive ? (
              <button
                type="button"
                onClick={beginCheckout}
                disabled={isCheckingOut}
                className="btn-primary w-full disabled:cursor-wait"
              >
                {isCheckingOut ? t("cart.redirecting") : t("cart.checkout")}
                {!isCheckingOut && <ArrowRight size={14} />}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-lore-night/10 px-8 py-3.5 text-label text-lore-night/60"
                >
                  {t("cart.comingSoon")}
                </button>
                <p className="mt-2 text-center text-xs text-lore-night/60">{t("cart.launching")}</p>
              </>
            )}

            {/* Continue */}
            <button
              onClick={closeCart}
              className="mt-2 w-full py-2 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-lore-night/60 transition-colors hover:text-lore-night"
            >
              {t("cart.continueShopping")}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
