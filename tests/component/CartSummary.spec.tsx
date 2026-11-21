import { expect, test } from "@playwright/experimental-ct-react";
import { CartSummary } from "../../src/components/CartSummary";
import PRODUCTS from "../../src/data/products.json" with { type: "json" };
import { InteractiveCart } from "./stories/InteractiveCart";
import "../../src/styles.css";

test("empty cart visual snapshot and accessible empty state", async ({
  mount,
  page,
}) => {
  await mount(
    <CartSummary
      items={[]}
      onQuantityChange={() => undefined}
      onRemove={() => undefined}
    />,
  );
  await expect(page.getByRole("status")).toHaveText(
    "Your cart is empty. Add something you love.",
  );
  await expect(page.locator(".cart-panel")).toHaveScreenshot("cart-empty.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.12,
  });
});

test("quantity props recalculate total and removal restores the empty state", async ({
  mount,
  page,
}) => {
  const component = await mount(
    <InteractiveCart initialItems={[{ product: PRODUCTS[0], quantity: 2 }]} />,
  );
  await expect(page.getByLabel("Field Notes line total")).toHaveText("$24.00");
  await expect(component).toHaveScreenshot("cart-with-item.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.12,
  });

  await page.getByLabel("Field Notes quantity").fill("4");
  await expect(page.getByLabel("Field Notes line total")).toHaveText("$48.00");
  await page.getByRole("button", { name: "Remove Field Notes" }).click();
  await expect(page.getByRole("status")).toBeVisible();
});
