import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import {
  DONATION_HANDLES,
  DONATION_PARTNERS,
  buildDonationCartItem,
  isDonationOfferable,
  type DonationPartnerId,
} from "@/lib/donations";

/**
 * The "step before final checkout": when the shopper clicks Checkout without a
 * donation in the cart, this dialog offers the Give-One add-on once per
 * session, then hands off to Shopify checkout either way.
 */
const GiveOneInterstitial = () => {
  const { t } = useTranslation();
  const { isGiveOneOpen, closeGiveOne, addItem, checkout, isCheckingOut } = useCart();
  const { byHandle } = useShopifyProducts();
  const [partnerId, setPartnerId] = useState<DonationPartnerId>("nl");

  const partner = DONATION_PARTNERS.find((p) => p.id === partnerId) ?? DONATION_PARTNERS[0];

  const options = (
    [
      { key: "pads" as const, label: "Organic Cotton Pads" },
      { key: "tampons" as const, label: "Organic Cotton Tampons" },
    ]
  )
    .map((opt) => ({ ...opt, product: byHandle[DONATION_HANDLES[opt.key]] }))
    .filter((opt) => isDonationOfferable(opt.product));

  const addAndContinue = (optKey: "pads" | "tampons") => {
    const product = byHandle[DONATION_HANDLES[optKey]];
    if (!product) return;
    const item = buildDonationCartItem(product, partner);
    if (!item) return;
    addItem(item); // keeps the cart consistent if the redirect fails
    closeGiveOne();
    void checkout([item]); // include immediately without waiting for React state
  };

  const declineAndContinue = () => {
    closeGiveOne(true);
    void checkout();
  };

  return (
    <Dialog open={isGiveOneOpen} onOpenChange={(open) => !open && closeGiveOne()}>
      <DialogContent className="max-w-md bg-[#F7F5F1] border-[#4B2E38]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Heart size={18} strokeWidth={1.5} className="text-[#C4967A]" fill="#C4967A" />
            <DialogTitle className="font-serif text-2xl font-normal text-[#1A3528]">
              {t("giveOne.interTitle")}
            </DialogTitle>
          </div>
          <DialogDescription className="font-sans text-[13px] leading-[1.6] text-[#1A3528]">
            {t("giveOne.interBody")}
          </DialogDescription>
        </DialogHeader>

        <fieldset>
          <legend className="font-sans text-[11px] text-[#4B2E38] mb-2">
            {t("giveOne.partnerLegend")}
          </legend>
          <div className="flex flex-col gap-1.5">
            {DONATION_PARTNERS.map((p) => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="give-one-interstitial-partner"
                  value={p.id}
                  checked={partnerId === p.id}
                  onChange={() => setPartnerId(p.id)}
                  className="accent-[#4B2E38]"
                />
                <span className="font-sans text-[12px] text-[#1A3528]">{t(p.id === "nl" ? "giveOne.partnerNl" : "giveOne.partnerDe")}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-2.5">
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              disabled={isCheckingOut}
              onClick={() => addAndContinue(opt.key)}
              className="w-full flex items-center justify-between rounded-md border border-[#4B2E38]/20 bg-white px-4 py-3 text-left hover:border-[#4B2E38] transition-colors disabled:opacity-60"
            >
              <span>
                <span className="block font-sans text-[13px] font-medium text-[#1A3528]">
                  {t("giveOne.interAdd", { product: t(`giveOne.${opt.key}Option`) })}
                </span>
                <span className="block font-sans text-[11px] text-[#4B2E38]">
                  {t("giveOne.interAtCost", { price: `€${parseFloat(opt.product.priceRange.minVariantPrice.amount).toFixed(2)}` })}
                </span>
              </span>
              <ArrowRight size={14} className="text-[#4B2E38] shrink-0" />
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={isCheckingOut}
          onClick={declineAndContinue}
          className="w-full text-center font-sans text-[12px] text-[#9B9B9B] hover:text-[#4B2E38] transition-colors py-1 disabled:opacity-60"
        >
          {isCheckingOut ? t("cart.redirecting") : t("giveOne.interDecline")}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default GiveOneInterstitial;
