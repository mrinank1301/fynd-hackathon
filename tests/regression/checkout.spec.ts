import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/products");
});

test("customer places a valid order and sees one confirmation reference", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add to bag" }).first().click();
  await expect(page.getByTestId("cart-count")).toHaveText("1");
  await page.getByRole("link", { name: "Shopping cart, 1 item" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await page.getByLabel("Your name").fill("Jamie Park");
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(
    page.getByRole("heading", { name: "Thanks, Jamie Park!" }),
  ).toBeVisible();
  await expect(page.getByText("NS-20481")).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(1);
});

test("blank required name blocks checkout and preserves the bag", async ({
  page,
}) => {
  await page
    .getByRole("article", { name: "Trail Bottle" })
    .getByRole("button", { name: "Add to bag" })
    .click();
  await page.getByRole("link", { name: "Shopping cart, 1 item" }).click();
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page.getByRole("alert")).toHaveText(
    "Please enter your name to continue.",
  );
  await expect(
    page.getByRole("heading", { name: "Your cart", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Trail Bottle quantity")).toHaveValue("1");
});

test("changing quantity updates the line amount and exact order total", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add to bag" }).first().click();
  await page.getByRole("link", { name: "Shopping cart, 1 item" }).click();
  await page.getByLabel("Field Notes quantity").fill("3");

  await expect(page.getByLabel("Field Notes line total")).toHaveText("$36.00");
  await expect(page.getByTestId("order-total")).toHaveText("$36.00");
});

test("adding the same product twice updates badge, quantity, and totals", async ({
  page,
}) => {
  const addFieldNotes = page
    .getByRole("article", { name: "Field Notes" })
    .getByRole("button", { name: "Add to bag" });
  await addFieldNotes.click();
  await addFieldNotes.click();

  await expect(page.getByTestId("cart-count")).toHaveText("2");
  await page.getByRole("link", { name: "Shopping cart, 2 items" }).click();
  await expect(page.getByLabel("Field Notes quantity")).toHaveValue("2");
  await expect(page.getByLabel("Field Notes line total")).toHaveText("$24.00");
  await expect(page.getByTestId("order-total")).toHaveText("$24.00");
});

test("removing one product keeps the other cart item and recalculates the total", async ({
  page,
}) => {
  await page
    .getByRole("article", { name: "Field Notes" })
    .getByRole("button", { name: "Add to bag" })
    .click();
  await page
    .getByRole("article", { name: "Trail Bottle" })
    .getByRole("button", { name: "Add to bag" })
    .click();
  await expect(page.getByTestId("cart-count")).toHaveText("2");
  await page.getByRole("link", { name: "Shopping cart, 2 items" }).click();

  await expect(page.getByTestId("order-total")).toHaveText("$40.00");
  await page.getByRole("button", { name: "Remove Field Notes" }).click();

  await expect(page.getByLabel("Field Notes quantity")).toHaveCount(0);
  await expect(page.getByLabel("Trail Bottle quantity")).toHaveValue("1");
  await expect(page.getByTestId("order-total")).toHaveText("$28.00");
});

test("products page shows the full catalog with working local product images", async ({
  page,
}) => {
  await expect(page.getByRole("article")).toHaveCount(6);
  await expect(
    page.getByRole("heading", { name: "Canvas Tote" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Camp Mug" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Daypack" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Brass Key Clip" }),
  ).toBeVisible();

  const images = page.locator(".product-card img");
  await expect(images).toHaveCount(6);
  await expect
    .poll(() =>
      images.evaluateAll((nodes) =>
        nodes.every((node) => (node as HTMLImageElement).naturalWidth > 0),
      ),
    )
    .toBe(true);
});
