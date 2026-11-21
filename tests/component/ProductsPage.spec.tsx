import { expect, test } from "@playwright/experimental-ct-react";
import { ProductsPage } from "../../src/pages/ProductsPage";
import "../../src/styles.css";

test("product catalog renders all six local images and forwards add actions", async ({
  mount,
  page,
}) => {
  let addedProduct = "";
  const catalog = await mount(
    <ProductsPage onAdd={(product) => (addedProduct = product.id)} />,
  );

  await expect(page.getByRole("article")).toHaveCount(6);
  const images = page.locator(".product-card img");
  await expect(images).toHaveCount(6);
  await expect
    .poll(() =>
      images.evaluateAll((nodes) =>
        nodes.every((node) => (node as HTMLImageElement).naturalWidth > 0),
      ),
    )
    .toBe(true);
  await expect(catalog).toHaveScreenshot("products-catalog.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.12,
  });

  await page
    .getByRole("article", { name: "Daypack" })
    .getByRole("button", { name: "Add to bag" })
    .click();
  expect(addedProduct).toBe("daypack");
});
