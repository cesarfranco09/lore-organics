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
        percentageOff: name.includes("6") ? 10 : name.includes("3") ? 5 : 0,
      })),
    },
  ],
  ...overrides,
});

describe("resolveSellingPlan", () => {
  it("matches Appstle-style interval names to CycleBox cadences", () => {
    const product = makeProduct(["Delivery every 2 months", "Delivery every 3 months", "Delivery every 6 months"]);
    expect(resolveSellingPlan(product, "2m")?.name).toBe("Delivery every 2 months");
    expect(resolveSellingPlan(product, "3m")?.name).toBe("Delivery every 3 months");
    expect(resolveSellingPlan(product, "6m")?.name).toBe("Delivery every 6 months");
  });

  it("matches week-based plan names", () => {
    const product = makeProduct(["Every 8 weeks", "Every 12 weeks", "Every 26 weeks"]);
    expect(resolveSellingPlan(product, "2m")?.name).toBe("Every 8 weeks");
    expect(resolveSellingPlan(product, "3m")?.name).toBe("Every 12 weeks");
    expect(resolveSellingPlan(product, "6m")?.name).toBe("Every 26 weeks");
  });

  it("matches spelled-out and localized plan names", () => {
    expect(resolveSellingPlan(makeProduct(["Every two months"]), "2m")).not.toBeNull();
    expect(resolveSellingPlan(makeProduct(["Every three months"]), "3m")).not.toBeNull();
    expect(resolveSellingPlan(makeProduct(["Every six months"]), "6m")).not.toBeNull();
    expect(resolveSellingPlan(makeProduct(["Alle 6 Monate"]), "6m")).not.toBeNull();
    expect(resolveSellingPlan(makeProduct(["Elke 3 maanden"]), "3m")).not.toBeNull();
  });

  it("does not confuse 2 with 12 months or 6 with 26 weeks", () => {
    expect(resolveSellingPlan(makeProduct(["Every 12 months"]), "2m")).toBeNull();
    expect(resolveSellingPlan(makeProduct(["Every 18 weeks"]), "2m")).toBeNull();
    expect(resolveSellingPlan(makeProduct(["Every 16 months"]), "6m")).toBeNull();
    const product = makeProduct(["Every 26 weeks", "Every 6 months"]);
    expect(resolveSellingPlan(product, "3m")).toBeNull();
  });

  it("returns null when no plan matches or product missing", () => {
    expect(resolveSellingPlan(makeProduct(["Weekly"]), "2m")).toBeNull();
    expect(resolveSellingPlan(undefined, "2m")).toBeNull();
    expect(resolveSellingPlan(makeProduct([]), "3m")).toBeNull();
    expect(resolveSellingPlan(makeProduct(["Every 2 months", "Every 3 months"]), "6m")).toBeNull();
  });

  it("exposes the plan's percentage discount", () => {
    const product = makeProduct(["Delivery every 3 months", "Delivery every 6 months"]);
    expect(resolveSellingPlan(product, "3m")?.percentageOff).toBe(5);
    expect(resolveSellingPlan(product, "6m")?.percentageOff).toBe(10);
  });
});

describe("allPlansResolvable", () => {
  const withPlans = makeProduct(["Every 2 months", "Every 3 months", "Every 6 months"]);
  const withoutPlans = makeProduct([]);

  it("is true only when every product has a matching plan", () => {
    expect(allPlansResolvable([withPlans, withPlans], "2m")).toBe(true);
    expect(allPlansResolvable([withPlans, withPlans], "6m")).toBe(true);
    expect(allPlansResolvable([withPlans, withoutPlans], "2m")).toBe(false);
    expect(allPlansResolvable([withPlans, undefined], "3m")).toBe(false);
    expect(allPlansResolvable([], "2m")).toBe(false);
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
