# Shopify Integration — Setup Guide

Your site is connected to Shopify as a **headless storefront**: this React site stays
exactly as designed, and Shopify runs the commerce engine behind it (products,
inventory, cart, payments, checkout).

Right now the site is in **"Coming Soon" mode** — nothing sells yet. Everything below
is wired and ready; you flip one switch to go live.

---

## What's already been set up

| File | What it does |
|------|--------------|
| `.env` | Your Shopify store domain, public token, and the live/off switch |
| `src/lib/shopify.ts` | The connection — fetch products, manage cart, create checkout |
| `src/hooks/useShopifyProducts.ts` | Loads live products into your pages |
| `src/contexts/CartContext.tsx` | Cart now has a `checkout()` that redirects to Shopify |

---

## To finish setup (3 steps)

### 1. Set your store domain
Open `.env` and replace the placeholder with your real `*.myshopify.com` address:
```
VITE_SHOPIFY_DOMAIN=lore-organics.myshopify.com
```
(Find it in Shopify admin → **Settings → Domains**.) The token is already filled in.

### 2. Add your products in Shopify
In Shopify admin → **Products**, add each product (day pad, night pad, tampons, liners)
with prices, images, and variants. Note each product's **handle** (the URL-friendly name,
e.g. `organic-cotton-day-pad`) — you'll match these to the site's catalog.

### 3. Connect the site's products to Shopify (when ready to sell)
In `src/pages/Products.tsx`, each product needs its Shopify `handle` so the site knows
which Shopify product to sell. Then add-to-cart passes the Shopify `variantId`. See
"Going live" below — a developer can wire this in ~1 hour once products exist.

---

## Going live

When you're ready to launch (target: **Oct 1, 2026**):

1. Make sure steps 1–3 above are done.
2. In `.env`, set:
   ```
   VITE_STORE_LIVE=true
   ```
3. Re-enable the purchase UI (the "Coming Soon" buttons in `Products.tsx`,
   `CartDrawer.tsx`, and `Checkout.tsx` are currently disabled on purpose).
4. Deploy.

That's it. When `VITE_STORE_LIVE=true`, clicking "Checkout" builds a Shopify cart and
redirects the customer to Shopify's secure hosted checkout (handles iDEAL, Klarna,
cards, taxes, shipping, and order confirmation automatically).

**Safety:** while `VITE_STORE_LIVE=false`, no checkout can happen even if the code runs —
so you can't accidentally sell before launch.

---

## How checkout works

1. Customer adds products → local cart (instant, works offline).
2. Customer clicks "Checkout" → `checkout()` in `CartContext` runs.
3. It calls Shopify's `cartCreate` with the items and gets back a `checkoutUrl`.
4. The browser redirects there — Shopify owns the rest (payment, confirmation, email).

You never handle payment details on your own site, which keeps you secure and PCI-compliant
without extra work.

---

## Important notes

- The **public** Storefront token in `.env` is safe to ship in browser code — it can only
  read products and manage carts.
- **Never** put your **private** access token (`shpat_…`) or any **Admin API** key in this
  project — those are server-side secrets.
- `.env` is gitignored so your config won't be committed; `.env.example` is the shareable template.
