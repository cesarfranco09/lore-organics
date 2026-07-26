import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { isStoreLive } from "@/lib/shopify";
import {
  DONATION_HANDLES,
  DONATION_PARTNERS,
  buildDonationCartItem,
  isDonationOfferable,
  type DonationPartnerId,
} from "@/lib/donations";

interface GiveOneOption {
  key: keyof typeof DONATION_HANDLES;
  label: string;
}

const OPTIONS: GiveOneOption[] = [
  { key: "pads", label: "Organic Cotton Pads" },
  { key: "tampons", label: "Organic Cotton Tampons" },
];

/**
 * "From One Woman to Another" donation block, shared by the cart drawer and
 * the checkout page. Pre-launch it renders the editorial "coming at launch"
 * state; once the store is live and the donation products exist in Shopify,
 * the buttons add a real at-cost donation line to the cart.
 */
const GiveOneSection = ({ variant = "drawer" }: { variant?: "drawer" | "page" }) => {
  const { t } = useTranslation();
  const { items, addItem } = useCart();
  const { byHandle } = useShopifyProducts();
  const storeLive = isStoreLive();
  const [partnerId, setPartnerId] = useState<DonationPartnerId>("nl");

  const partner = DONATION_PARTNERS.find((p) => p.id === partnerId) ?? DONATION_PARTNERS[0];

  return (
    <div
      className={`rounded-lg border border-[#4B2E38] bg-[#F7F5F1] p-6 ${
        variant === "drawer" ? "my-6" : ""
      }`}
    >
      <p className="font-sans text-[10px] tracking-[2px] uppercase text-[#4B2E38] mb-2">
        {t("giveOne.label")}
      </p>
      <div className="flex items-center gap-2 mb-3">
        <Heart size={16} strokeWidth={1.5} className="text-[#C4967A]" fill="#C4967A" />
        <h3 className="font-serif text-[22px] leading-[1.2] font-normal text-[#1A3528]">
          {t("giveOne.title")}
        </h3>
      </div>
      <p className="font-sans text-[13px] leading-[1.6] text-[#1A3528] mb-5">
        {t("giveOne.body")}
      </p>

      {/* Partner choice — only meaningful once donations are live */}
      {storeLive && (
        <fieldset className="mb-4">
          <legend className="font-sans text-[11px] text-[#4B2E38] mb-2">
            {t("giveOne.partnerLegend")}
          </legend>
          <div className="flex flex-col gap-1.5">
            {DONATION_PARTNERS.map((p) => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`give-one-partner-${variant}`}
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
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const product = byHandle[DONATION_HANDLES[opt.key]];
          const offerable = storeLive && isDonationOfferable(product);
          const cartItem = offerable ? buildDonationCartItem(product, partner) : null;
          const inCart =
            offerable &&
            items.some((i) => i.id.startsWith(`donation-${product.handle}-`));

          return (
            <div
              key={opt.label}
              className="rounded-md border border-[#4B2E38]/15 bg-white p-3.5"
            >
              <p className="font-sans text-[13px] font-medium text-[#1A3528] mb-0.5">{t(`giveOne.${opt.key}Option`)}</p>
              <p className="font-sans text-[11px] text-[#1A3528]/70 mb-1">
                {t("giveOne.donatedToWoman")}
              </p>
              <p className="font-sans text-[11px] text-[#4B2E38] mb-2.5">
                {offerable
                  ? t("giveOne.atCost", { price: `€${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}` })
                  : t("giveOne.reducedPrice")}
              </p>
              {inCart ? (
                <div className="w-full rounded px-3 py-2 text-[12px] font-sans bg-[#1A3528] text-[#F7F5F1] flex items-center justify-center gap-1.5">
                  <Check size={13} strokeWidth={2} /> {t("giveOne.added")}
                </div>
              ) : offerable && cartItem ? (
                <button
                  type="button"
                  onClick={() => addItem(cartItem)}
                  className="w-full rounded px-3 py-2 text-[12px] font-sans bg-[#4B2E38] text-[#F7F5F1] hover:opacity-90 transition-opacity"
                >
                  {t("giveOne.addToDonation")}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full rounded px-3 py-2 text-[12px] font-sans bg-[#9B9B9B] text-[#F7F5F1] cursor-not-allowed opacity-85"
                >
                  {t("giveOne.addToDonation")}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="font-sans italic text-[11px] leading-[1.5] text-[#9B9B9B] text-center mt-4">
        {t("giveOne.footnote")}
      </p>
    </div>
  );
};

export default GiveOneSection;
