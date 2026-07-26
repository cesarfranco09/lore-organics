import { describe, it, expect } from "vitest";
import { resolveSellingPlan, allPlansResolvable } from "@/lib/subscriptions";
import { buildDonationCartItem, isDonationItem, isDonationOfferable } from "@/lib/donations";
import type { ShopifyProduct } from "@/lib/shopify";

const makeProduct = (planNames: string[], overrides: Partial<ShopifyProduct> = {}): ShopifyProduct => ({
  id: "gid://shopify/Product/1",
  handle: "test-product",
  title: "Test Product",
  description: "",
  availableForSale: true,
  featuredImage: null,
  priceRange: { minVariantPrice: { amount: "6.9", currencyCode: "EUR" } },
  variants: [{ id: "gid://shopify/ProductVariant/1", title: "Default", availableForSale: true, price: { amount: "6.9", currencyCode: "EUR" } }],
  sellingPlanGroups: [
    {
      name: "Subscribe & Save",
      sellingPlans: planNames.map((name, i) => ({
        id: `gid://shopify/SellingPlan/${i + 1}`,
        name,
        options: [{ name: "Delivery frequency", value: name }],
        percentageOff: name.includes("3") ? 5 : 0,
      })),
    },
  ],
  ...overrides,
});

describe("resolveSellingPlan", () => {
  it("matches Appstle-style interval names to CycleBox frequencies", () => {
    const product = makeProduct(["Delivery every 2 months", "Delivery every 3 months"]);
    expect(resolveSellingPlan(product, "bimonthly")?.name).toBe("Delivery every 2 months");
    expect(resolveSellingPlan(product, "quarterly")?.name).toBe("Delivery every 3 months");
  });

  it("matches week-based plan names", () => {
    const product = makeProduct(["Every 8 weeks", "Every 12 weeks"]);
    expect(resolveSellingPlan(product, "bimonthly")?.name).toBe("Every 8 weeks");
    expect(resolveSellingPlan(product, "quarterly")?.name).toBe("Every 12 weeks");
  });

  it("returns null when no plan matches or product missing", () => {
    expect(resolveSellingPlan(makeProduct(["Weekly"]), "bimonthly")).toBeNull();
    expect(resolveSellingPlan(undefined, "bimonthly")).toBeNull();
    expect(resolveSellingPlan(makeProduct([]), "quarterly")).toBeNull();
  });

  it("exposes the plan's percentage discount", () => {
    const product = makeProduct(["Delivery every 3 months"]);
    expect(resolveSellingPlan(product, "quarterly")?.percentageOff).toBe(5);
  });
});

describe("allPlansResolvable", () => {
  const withPlans = makeProduct(["Every 2 months", "Every 3 months"]);
  const withoutPlans = makeProduct([]);

  it("is true only when every product has a matching plan", () => {
    expect(allPlansResolvable([withPlans, withPlans], "bimonthly")).toBe(true);
    expect(allPlansResolvable([withPlans, withoutPlans], "bimonthly")).toBe(false);
    expect(allPlansResolvable([withPlans, undefined], "bimonthly")).toBe(false);
    expect(allPlansResolvable([], "bimonthly")).toBe(false);
  });
});

describe("donations", () => {
  const product = makeProduct([], { handle: "donation-pad-box" });

  it("builds a cart line with hidden marker and visible partner attributes", () => {
    const item = buildDonationCartItem(product, { id: "de", region: "Germany", label: "x" });
    expect(item).not.toBeNull();
    expect(item!.variantId).toBe("gid://shopify/ProductVariant/1");
    expect(item!.attributes).toEqual([
      { key: "_donation", value: "true" },
      { key: "Donation partner", value: "Germany" },
    ]);
    expect(isDonationItem(item!)).toBe(true);
  });

  it("detects non-donation items and unofferable products", () => {
    expect(isDonationItem({ attributes: undefined })).toBe(false);
    expect(isDonationOfferable(undefined)).toBe(false);
    expect(isDonationOfferable(makeProduct([], { availableForSale: false }))).toBe(false);
    expect(isDonationOfferable(product)).toBe(true);
  });

  it("returns null when the product has no variant", () => {
    const noVariant = makeProduct([], { variants: [] });
    expect(buildDonationCartItem(noVariant, { id: "nl", region: "Netherlands", label: "x" })).toBeNull();
  });
});
