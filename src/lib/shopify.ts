import { createStorefrontApiClient } from "@shopify/storefront-api-client";

/**
 * Shopify Storefront API integration.
 *
 * Everything here degrades gracefully: if the store domain/token aren't set
 * (or VITE_STORE_LIVE is false), the helpers return empty/no-op results so the
 * rest of the site keeps working in "Coming Soon" mode.
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;
const API_VERSION = "2025-10";

/** True only when a real domain + token are configured. */
export const isShopifyConfigured = (): boolean =>
  Boolean(DOMAIN && TOKEN && DOMAIN !== "your-store.myshopify.com");

/** Master launch switch — controlled by VITE_STORE_LIVE in .env. */
export const isStoreLive = (): boolean =>
  import.meta.env.VITE_STORE_LIVE === "true" && isShopifyConfigured();

const client = isShopifyConfigured()
  ? createStorefrontApiClient({
      storeDomain: DOMAIN as string,
      apiVersion: API_VERSION,
      publicAccessToken: TOKEN as string,
    })
  : null;

async function request<T>(operation: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!client) return null;
  const { data, errors } = await client.request(operation, { variables });
  if (errors) {
    console.error("Shopify Storefront API error:", errors);
    return null;
  }
  return data as T;
}

/* ----------------------------- Types ----------------------------- */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: Money };
  variants: ShopifyVariant[];
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image: { url: string; altText: string | null } | null;
    price: Money;
    product: { title: string; handle: string };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: ShopifyCartLine[];
}

/* ------------------------ GraphQL fragments ------------------------ */

const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    featuredImage { url altText }
    priceRange { minVariantPrice { amount currencyCode } }
    variants(first: 20) {
      nodes { id title availableForSale price { amount currencyCode } }
    }
  }
`;

const CART_FRAGMENT = `#graphql
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText }
            price { amount currencyCode }
            product { title handle }
          }
        }
      }
    }
  }
`;

/* ---- Normalizers: flatten Shopify's edges/nodes into plain arrays ---- */

interface RawProduct extends Omit<ShopifyProduct, "variants"> {
  variants: { nodes: ShopifyVariant[] };
}
interface RawCart extends Omit<ShopifyCart, "lines"> {
  lines: { nodes: ShopifyCartLine[] };
}

const normalizeProduct = (p: RawProduct): ShopifyProduct => ({
  ...p,
  variants: p.variants.nodes,
});

const normalizeCart = (c: RawCart): ShopifyCart => ({
  ...c,
  lines: c.lines.nodes,
});

/* --------------------------- Products --------------------------- */

export async function fetchProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await request<{ products: { nodes: RawProduct[] } }>(
    `#graphql
      ${PRODUCT_FRAGMENT}
      query Products($first: Int!) {
        products(first: $first) { nodes { ...ProductFields } }
      }
    `,
    { first }
  );
  return data ? data.products.nodes.map(normalizeProduct) : [];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await request<{ product: RawProduct | null }>(
    `#graphql
      ${PRODUCT_FRAGMENT}
      query Product($handle: String!) {
        product(handle: $handle) { ...ProductFields }
      }
    `,
    { handle }
  );
  return data?.product ? normalizeProduct(data.product) : null;
}

/* ----------------------------- Cart ----------------------------- */

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export async function createCart(lines: CartLineInput[] = []): Promise<ShopifyCart | null> {
  const data = await request<{ cartCreate: { cart: RawCart | null } }>(
    `#graphql
      ${CART_FRAGMENT}
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    { lines }
  );
  return data?.cartCreate.cart ? normalizeCart(data.cartCreate.cart) : null;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await request<{ cart: RawCart | null }>(
    `#graphql
      ${CART_FRAGMENT}
      query Cart($cartId: ID!) {
        cart(id: $cartId) { ...CartFields }
      }
    `,
    { cartId }
  );
  return data?.cart ? normalizeCart(data.cart) : null;
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<ShopifyCart | null> {
  const data = await request<{ cartLinesAdd: { cart: RawCart | null } }>(
    `#graphql
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    { cartId, lines }
  );
  return data?.cartLinesAdd.cart ? normalizeCart(data.cartLinesAdd.cart) : null;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart | null> {
  const data = await request<{ cartLinesUpdate: { cart: RawCart | null } }>(
    `#graphql
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return data?.cartLinesUpdate.cart ? normalizeCart(data.cartLinesUpdate.cart) : null;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart | null> {
  const data = await request<{ cartLinesRemove: { cart: RawCart | null } }>(
    `#graphql
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    { cartId, lineIds: [lineId] }
  );
  return data?.cartLinesRemove.cart ? normalizeCart(data.cartLinesRemove.cart) : null;
}
