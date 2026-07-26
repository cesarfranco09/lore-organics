import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import { useCart } from "@/contexts/CartContext";
import { isStoreLive } from "@/lib/shopify";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { ShieldCheck, Lock, Leaf, ChevronDown, ChevronUp, CreditCard, ArrowLeft, Heart } from "lucide-react";
import GiveOneSection from "@/components/donation/GiveOneSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Select values stay stable (English names); only the visible label is translated.
const countries = [
  { value: "Spain", key: "spain" },
  { value: "Germany", key: "germany" },
  { value: "France", key: "france" },
  { value: "Italy", key: "italy" },
  { value: "Netherlands", key: "netherlands" },
  { value: "Belgium", key: "belgium" },
  { value: "Austria", key: "austria" },
  { value: "Portugal", key: "portugal" },
  { value: "Ireland", key: "ireland" },
  { value: "Sweden", key: "sweden" },
  { value: "Denmark", key: "denmark" },
  { value: "Finland", key: "finland" },
  { value: "Norway", key: "norway" },
  { value: "Switzerland", key: "switzerland" },
  { value: "United Kingdom", key: "unitedKingdom" },
];

const Checkout = () => {
  const { t } = useTranslation("checkout");
  const { localize } = useLocalizedPath();
  const { items, subtotal, beginCheckout, isCheckingOut } = useCart();
  const storeLive = isStoreLive();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [summaryOpen, setSummaryOpen] = useState(false);

  const shippingCost = shippingMethod === "express" ? 6.9 : 5.95;
  const taxes = (subtotal + shippingCost) * 0.21;
  const total = subtotal + shippingCost + taxes;

  const SummaryContent = () => (
    <>
      {/* Cycle Kit visual */}
      <div className="bg-lore-sage/20 rounded-sm p-6 mb-8">
        <p className="text-label text-secondary-foreground mb-4">{t("summary.kit")}</p>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item.id} className="bg-background rounded-sm overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Item list */}
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-16 rounded-sm overflow-hidden bg-muted shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-base text-foreground leading-snug">{item.name}</p>
              <p className="text-body text-muted-foreground">{t("summary.qty", { count: item.quantity })}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals hidden during pricing review */}
    </>
  );

  if (items.length === 0) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-editorial-md mb-4">{t("empty.title")}</h1>
          <p className="text-body text-muted-foreground mb-8">{t("empty.body")}</p>
          <Link
            to={localize("/products")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-label hover:opacity-90 transition-opacity rounded-sm"
          >
            {t("empty.cta")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-background">
      <Seo
        title={t("seo.title")}
        description={t("seo.description")}
        path="/checkout"
      />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Back link */}
        <Link
          to={localize("/products")}
          className="inline-flex items-center gap-2 text-body text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {t("back")}
        </Link>

        <h1 className="text-editorial-lg mb-12">{t("title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* ───── LEFT COLUMN ───── */}
          <div className="lg:col-span-3 space-y-12">
            {/* Contact */}
            <section>
              <h2 className="font-serif text-2xl mb-6">{t("contact.title")}</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-body text-muted-foreground mb-1.5 block">
                    {t("contact.email")}
                  </Label>
                  <Input id="email" type="email" placeholder={t("contact.emailPlaceholder")} className="bg-card border-border" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-body text-muted-foreground mb-1.5 block">
                    {t("contact.phone")} <span className="opacity-50">{t("contact.optional")}</span>
                  </Label>
                  <Input id="phone" type="tel" placeholder={t("contact.phonePlaceholder")} className="bg-card border-border" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-serif text-2xl mb-6">{t("address.title")}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-body text-muted-foreground mb-1.5 block">{t("address.firstName")}</Label>
                    <Input id="firstName" placeholder={t("address.firstNamePlaceholder")} className="bg-card border-border" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-body text-muted-foreground mb-1.5 block">{t("address.lastName")}</Label>
                    <Input id="lastName" placeholder={t("address.lastNamePlaceholder")} className="bg-card border-border" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-body text-muted-foreground mb-1.5 block">{t("address.address")}</Label>
                  <Input id="address" placeholder={t("address.addressPlaceholder")} className="bg-card border-border" />
                </div>
                <div>
                  <Label htmlFor="apt" className="text-body text-muted-foreground mb-1.5 block">
                    {t("address.apt")} <span className="opacity-50">{t("contact.optional")}</span>
                  </Label>
                  <Input id="apt" placeholder={t("address.aptPlaceholder")} className="bg-card border-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-body text-muted-foreground mb-1.5 block">{t("address.city")}</Label>
                    <Input id="city" placeholder={t("address.cityPlaceholder")} className="bg-card border-border" />
                  </div>
                  <div>
                    <Label htmlFor="postal" className="text-body text-muted-foreground mb-1.5 block">{t("address.postal")}</Label>
                    <Input id="postal" placeholder={t("address.postalPlaceholder")} className="bg-card border-border" />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-body text-muted-foreground mb-1.5 block">{t("address.country")}</Label>
                    <Select defaultValue="Spain">
                      <SelectTrigger className="bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{t(`address.countries.${c.key}`)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section>
              <h2 className="font-serif text-2xl mb-6">{t("shipping.title")}</h2>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-sm border cursor-pointer transition-colors ${
                    shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="standard" />
                    <div>
                      <p className="text-body font-medium text-foreground">{t("shipping.standard")}</p>
                      <p className="text-sm text-muted-foreground">{t("shipping.standardTime")}</p>
                    </div>
                  </div>
                </label>
                <label
                  className={`flex items-center justify-between p-4 rounded-sm border cursor-pointer transition-colors ${
                    shippingMethod === "express" ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="express" />
                    <div>
                      <p className="text-body font-medium text-foreground">{t("shipping.express")}</p>
                      <p className="text-sm text-muted-foreground">{t("shipping.expressTime")}</p>
                    </div>
                  </div>

                </label>
              </RadioGroup>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="font-serif text-2xl mb-6">{t("payment.title")}</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { value: "card", label: t("payment.card") },
                  { value: "apple", label: t("payment.applePay") },
                  { value: "paypal", label: t("payment.paypal") },
                  { value: "klarna", label: t("payment.klarna") },
                ].map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex items-center justify-center gap-2 p-3 rounded-sm border cursor-pointer text-center transition-colors ${
                      paymentMethod === pm.value ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <RadioGroupItem value={pm.value} className="sr-only" />
                    <span className="text-body font-medium text-foreground">{pm.label}</span>
                  </label>
                ))}
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4 fade-in">
                  <div>
                    <Label htmlFor="cardNumber" className="text-body text-muted-foreground mb-1.5 block">{t("payment.cardNumber")}</Label>
                    <Input id="cardNumber" placeholder={t("payment.cardNumberPlaceholder")} className="bg-card border-border" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-body text-muted-foreground mb-1.5 block">{t("payment.expiry")}</Label>
                      <Input id="expiry" placeholder={t("payment.expiryPlaceholder")} className="bg-card border-border" />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-body text-muted-foreground mb-1.5 block">{t("payment.cvc")}</Label>
                      <Input id="cvc" placeholder={t("payment.cvcPlaceholder")} className="bg-card border-border" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="cardName" className="text-body text-muted-foreground mb-1.5 block">{t("payment.nameOnCard")}</Label>
                      <Input id="cardName" placeholder={t("payment.nameOnCardPlaceholder")} className="bg-card border-border" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== "card" && (
                <div className="p-8 rounded-sm bg-card border border-border text-center fade-in">
                  <p className="text-body text-muted-foreground">
                    {t("payment.redirect", {
                      provider: paymentMethod === "apple" ? "Apple Pay" : paymentMethod === "paypal" ? "PayPal" : "Klarna",
                    })}
                  </p>
                </div>
              )}
            </section>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 py-6 border-t border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck size={18} strokeWidth={1.5} className="text-lore-botanical" />
                <span className="text-sm">{t("trust.secure")}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock size={18} strokeWidth={1.5} className="text-lore-botanical" />
                <span className="text-sm">{t("trust.encrypted")}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Leaf size={18} strokeWidth={1.5} className="text-lore-botanical" />
                <span className="text-sm">{t("trust.madeIn")}</span>
              </div>
            </div>

            {/* From One Woman to Another donation section */}
            <GiveOneSection variant="page" />

            {/* CTA: hands off to Shopify's secure hosted checkout when live */}
            {storeLive ? (
              <button
                type="button"
                onClick={beginCheckout}
                disabled={isCheckingOut}
                className="w-full bg-primary text-primary-foreground py-4 rounded-sm text-label tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-3"
              >
                <CreditCard size={18} strokeWidth={1.5} />
                {isCheckingOut ? t("cta.redirecting") : t("cta.continue")}
              </button>
            ) : (
              <>
                <button
                  disabled
                  aria-disabled="true"
                  className="w-full bg-muted text-muted-foreground py-4 rounded-sm text-label tracking-widest cursor-not-allowed opacity-70 flex items-center justify-center gap-3"
                >
                  <CreditCard size={18} strokeWidth={1.5} />
                  {t("cta.comingSoon")}
                </button>
                <p className="text-xs text-muted-foreground text-center mt-2">{t("cta.launching")}</p>
              </>
            )}
          </div>

          {/* ───── RIGHT COLUMN (desktop) ───── */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-28">
              <h2 className="font-serif text-2xl mb-8">{t("summary.title")}</h2>
              <SummaryContent />
            </div>
          </aside>

          {/* ───── MOBILE SUMMARY ───── */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
            <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
              <div className="bg-card border-t border-border shadow-lg">
                <CollapsibleTrigger className="w-full flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg">{t("summary.title")}</span>
                    <span className="text-label text-muted-foreground">{t("summary.items", { count: items.length })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {summaryOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
                    <SummaryContent />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
