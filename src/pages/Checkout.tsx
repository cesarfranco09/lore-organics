import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { useCart } from "@/contexts/CartContext";
import { ShieldCheck, Lock, Leaf, ChevronDown, ChevronUp, CreditCard, ArrowLeft, Heart } from "lucide-react";
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

const countries = [
  "Spain", "Germany", "France", "Italy", "Netherlands", "Belgium",
  "Austria", "Portugal", "Ireland", "Sweden", "Denmark", "Finland",
  "Norway", "Switzerland", "United Kingdom",
];

const Checkout = () => {
  const { items, subtotal } = useCart();
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
        <p className="text-label text-secondary-foreground mb-4">Your Cycle Kit</p>
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
              <p className="text-body text-muted-foreground">Qty: {item.quantity}</p>
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
          <h1 className="text-editorial-md mb-4">Your cart is empty</h1>
          <p className="text-body text-muted-foreground mb-8">Add some products before checking out.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-label hover:opacity-90 transition-opacity rounded-sm"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-background">
      <Seo
        title="Checkout — Lore Organics"
        description="Secure checkout for your Lore Organics order. Plastic-free organic period care delivered across the Netherlands and Germany."
        path="/checkout"
      />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Back link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-body text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to shop
        </Link>

        <h1 className="text-editorial-lg mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* ───── LEFT COLUMN ───── */}
          <div className="lg:col-span-3 space-y-12">
            {/* Contact */}
            <section>
              <h2 className="font-serif text-2xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-body text-muted-foreground mb-1.5 block">
                    Email address
                  </Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="bg-card border-border" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-body text-muted-foreground mb-1.5 block">
                    Phone number <span className="opacity-50">(optional)</span>
                  </Label>
                  <Input id="phone" type="tel" placeholder="+34 600 000 000" className="bg-card border-border" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-serif text-2xl mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-body text-muted-foreground mb-1.5 block">First Name</Label>
                    <Input id="firstName" placeholder="María" className="bg-card border-border" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-body text-muted-foreground mb-1.5 block">Last Name</Label>
                    <Input id="lastName" placeholder="García" className="bg-card border-border" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-body text-muted-foreground mb-1.5 block">Address</Label>
                  <Input id="address" placeholder="Calle de Ejemplo 12" className="bg-card border-border" />
                </div>
                <div>
                  <Label htmlFor="apt" className="text-body text-muted-foreground mb-1.5 block">
                    Apartment / Suite <span className="opacity-50">(optional)</span>
                  </Label>
                  <Input id="apt" placeholder="2ºB" className="bg-card border-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-body text-muted-foreground mb-1.5 block">City</Label>
                    <Input id="city" placeholder="Barcelona" className="bg-card border-border" />
                  </div>
                  <div>
                    <Label htmlFor="postal" className="text-body text-muted-foreground mb-1.5 block">Postal Code</Label>
                    <Input id="postal" placeholder="08001" className="bg-card border-border" />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-body text-muted-foreground mb-1.5 block">Country</Label>
                    <Select defaultValue="Spain">
                      <SelectTrigger className="bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section>
              <h2 className="font-serif text-2xl mb-6">Shipping Method</h2>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-sm border cursor-pointer transition-colors ${
                    shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="standard" />
                    <div>
                      <p className="text-body font-medium text-foreground">Standard Shipping</p>
                      <p className="text-sm text-muted-foreground">5–7 business days</p>
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
                      <p className="text-body font-medium text-foreground">Express Shipping</p>
                      <p className="text-sm text-muted-foreground">1–3 business days</p>
                    </div>
                  </div>
                  
                </label>
              </RadioGroup>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="font-serif text-2xl mb-6">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { value: "card", label: "Card" },
                  { value: "apple", label: "Apple Pay" },
                  { value: "paypal", label: "PayPal" },
                  { value: "klarna", label: "Klarna" },
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
                    <Label htmlFor="cardNumber" className="text-body text-muted-foreground mb-1.5 block">Card Number</Label>
                    <Input id="cardNumber" placeholder="4242 4242 4242 4242" className="bg-card border-border" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-body text-muted-foreground mb-1.5 block">Expiration</Label>
                      <Input id="expiry" placeholder="MM / YY" className="bg-card border-border" />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-body text-muted-foreground mb-1.5 block">CVC</Label>
                      <Input id="cvc" placeholder="123" className="bg-card border-border" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="cardName" className="text-body text-muted-foreground mb-1.5 block">Name on Card</Label>
                      <Input id="cardName" placeholder="María García" className="bg-card border-border" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== "card" && (
                <div className="p-8 rounded-sm bg-card border border-border text-center fade-in">
                  <p className="text-body text-muted-foreground">
                    You will be redirected to {paymentMethod === "apple" ? "Apple Pay" : paymentMethod === "paypal" ? "PayPal" : "Klarna"} to complete your payment.
                  </p>
                </div>
              )}
            </section>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 py-6 border-t border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck size={18} strokeWidth={1.5} className="text-lore-botanical" />
                <span className="text-sm">Secure checkout</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock size={18} strokeWidth={1.5} className="text-lore-botanical" />
                <span className="text-sm">Encrypted & secure payment</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Leaf size={18} strokeWidth={1.5} className="text-lore-botanical" />
                <span className="text-sm">Made in Spain · GOTS-certified organic cotton</span>
              </div>
            </div>

            {/* From One Woman to Another donation section */}
            <section
              aria-labelledby="donation-title"
              style={{
                backgroundColor: "#F7F5F1",
                border: "1px solid #4B2E38",
                borderRadius: "8px",
                padding: "24px",
                margin: "24px 0",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "#4B2E38",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Our Donation Model
              </p>
              <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
                <Heart size={18} strokeWidth={1.5} style={{ color: "#C4967A" }} fill="#C4967A" />
                <h3
                  id="donation-title"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "22px",
                    color: "#1A3528",
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  From One Woman to Another
                </h3>
              </div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#1A3528",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                }}
              >
                For every order, you can choose to add a pad or tampon box at a reduced price. It will not come to you, it goes directly to a woman who needs it, through our partner organisations in the Netherlands and Germany. No admin, no middleman. Just one woman helping another.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Organic Cotton Pads" },
                  { label: "Organic Cotton Tampons" },
                ].map((opt) => (
                  <div
                    key={opt.label}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid rgba(75,46,56,0.15)",
                      borderRadius: "6px",
                      padding: "14px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        color: "#1A3528",
                        fontWeight: 500,
                        marginBottom: "2px",
                      }}
                    >
                      {opt.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "11px",
                        color: "#1A3528",
                        opacity: 0.7,
                        marginBottom: "4px",
                      }}
                    >
                      Donated to a woman in need
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "11px",
                        color: "#4B2E38",
                        marginBottom: "10px",
                      }}
                    >
                      Reduced price, coming at launch
                    </p>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      style={{
                        backgroundColor: "#9B9B9B",
                        color: "#F7F5F1",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        width: "100%",
                        cursor: "not-allowed",
                        opacity: 0.85,
                      }}
                    >
                      Add to Donation
                    </button>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontStyle: "italic",
                  fontSize: "11px",
                  color: "#9B9B9B",
                  textAlign: "center",
                  marginTop: "16px",
                  lineHeight: 1.5,
                }}
              >
                Partner organisations in the Netherlands and Germany announced at launch. Every donated box goes directly to women in need.
              </p>
            </section>

            {/* CTA */}
            <button
              disabled
              aria-disabled="true"
              className="w-full bg-muted text-muted-foreground py-4 rounded-sm text-label tracking-widest cursor-not-allowed opacity-70 flex items-center justify-center gap-3"
            >
              <CreditCard size={18} strokeWidth={1.5} />
              Coming Soon
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">Launching October 1st, 2026.</p>
          </div>

          {/* ───── RIGHT COLUMN (desktop) ───── */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-28">
              <h2 className="font-serif text-2xl mb-8">Order Summary</h2>
              <SummaryContent />
            </div>
          </aside>

          {/* ───── MOBILE SUMMARY ───── */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
            <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
              <div className="bg-card border-t border-border shadow-lg">
                <CollapsibleTrigger className="w-full flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg">Order Summary</span>
                    <span className="text-label text-muted-foreground">{items.length} items</span>
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
