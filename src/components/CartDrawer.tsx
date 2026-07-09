import { useCart } from "@/contexts/CartContext";
import { Heart } from "lucide-react";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, totalItems, subtotal, isOpen, closeCart, removeItem, updateQuantity } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer, right on desktop, bottom on mobile */}
      <div
        className={`fixed z-[70] bg-background border-border/50 transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.15,1)] flex flex-col
          /* Mobile: bottom sheet */
          inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t
          /* Desktop: right panel */
          md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:max-h-none md:rounded-t-none md:rounded-l-none md:border-t-0 md:border-l md:w-[420px]
          ${isOpen
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} strokeWidth={1.5} className="text-foreground" />
            <span className="font-serif text-xl">Your Cart</span>
            {totalItems > 0 && (
              <span className="text-label text-muted-foreground text-xs">({totalItems})</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close cart"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "hsl(var(--lore-sage)/0.15)" }}
              >
                <ShoppingBag size={24} strokeWidth={1} className="text-muted-foreground" style={{ opacity: 0.4 }} />
              </div>
              <p className="font-serif text-lg text-muted-foreground" style={{ opacity: 0.6 }}>
                Your cart is empty
              </p>
              <button
                onClick={closeCart}
                className="text-label text-lore-botanical hover:underline underline-offset-4 transition-all text-xs mt-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-border/30">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-5 first:pt-0">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-sm overflow-hidden bg-muted/30 shrink-0 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="font-serif text-base leading-tight mb-0.5">{item.name}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 border border-border/60 rounded-full flex items-center justify-center text-foreground hover:bg-muted/50 transition-all active:scale-90"
                          aria-label="Decrease"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="font-serif text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 border border-border/60 rounded-full flex items-center justify-center text-foreground hover:bg-muted/50 transition-all active:scale-90"
                          aria-label="Increase"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-label text-muted-foreground/60 hover:text-destructive transition-colors text-[0.6rem]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* From One Woman to Another donation section */}
          <div
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
              <Heart size={16} strokeWidth={1.5} style={{ color: "#C4967A" }} fill="#C4967A" />
              <h3
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
          </div>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 px-6 py-5 border-t border-border/40"
            style={{ background: "linear-gradient(0deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)" }}>
            {/* Subtotal hidden during pricing review */}

            {/* Coming Soon */}
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground px-8 py-3.5 text-label rounded-sm cursor-not-allowed opacity-70"
            >
              Coming Soon
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">Launching October 1st, 2026.</p>

            {/* Continue */}
            <button
              onClick={closeCart}
              className="w-full text-center text-label text-muted-foreground hover:text-foreground transition-colors mt-3 py-2 text-xs"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
