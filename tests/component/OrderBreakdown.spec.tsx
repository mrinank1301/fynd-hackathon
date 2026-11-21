import { expect, test } from "@playwright/experimental-ct-react";
import { OrderBreakdown } from "../../src/components/OrderBreakdown";
import PRODUCTS from "../../src/data/products.json" with { type: "json" };
import "../../src/styles.css";

test("order breakdown shows subtotal, free shipping, and total", async ({
  mount,
  page,
}) => {
  const summary = await mount(
    <OrderBreakdown
      items={[
        { product: PRODUCTS[0], quantity: 1 },
        { product: PRODUCTS[1], quantity: 2 },
      ]}
    />,
  );

  await expect(page.getByTestId("order-subtotal")).toHaveText("$68.00");
  await expect(page.getByText("Free", { exact: true })).toBeVisible();
  await expect(page.getByTestId("order-total")).toHaveText("$68.00");
  await expect(summary).toHaveScreenshot("order-breakdown.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.12,
  });
});
