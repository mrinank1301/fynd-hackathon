import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add to bag" }).first().click();
  await page.getByRole("link", { name: "Shopping cart, 1 item" }).click();
  await page.getByLabel("Your name").fill("Taylor Reed");
});

test("submits the expected order request and displays the mocked response", async ({
  page,
}) => {
  let requestBody: unknown;
  await page.getByLabel("Your name").fill("  Taylor Reed  ");
  await page.route("**/api/orders", async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      json: { reference: "TEST-ORDER-1001" },
    });
  });

  await page.getByRole("button", { name: "Place order" }).click();

  await expect(
    page.getByRole("heading", { name: "Thanks, Taylor Reed!" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(page.getByText("TEST-ORDER-1001")).toBeVisible();
  expect(requestBody).toEqual({ name: "Taylor Reed" });
});

test("retains form values after service failure and permits a successful retry", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/orders", (route) => {
    requests += 1;
    return requests === 1
      ? route.fulfill({ status: 503, body: "Unavailable" })
      : route.fulfill({ status: 201, json: { reference: "TEST-RETRY-1" } });
  });
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page.getByRole("alert")).toHaveText(
    "We could not place your order. Please try again.",
  );
  await expect(page.getByLabel("Your name")).toHaveValue("Taylor Reed");
  await expect(page.getByLabel("Field Notes quantity")).toHaveValue("1");
  const retryButton = page.getByRole("button", { name: "Place order" });
  await expect(retryButton).toBeEnabled();
  await retryButton.click();
  await expect(
    page.getByRole("heading", { name: "Thanks, Taylor Reed!" }),
  ).toBeVisible();
  await expect(page.getByText("TEST-RETRY-1")).toBeVisible();
  expect(requests).toBe(2);
});

test("rapid repeated submission sends one request and renders one confirmation", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/orders", async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 150));
    await route.fulfill({ status: 201, json: { reference: "TEST-DOUBLE-1" } });
  });

  const button = page.getByRole("button", { name: "Place order" });
  await button.dblclick();
  await expect(
    page.getByRole("heading", { name: "Thanks, Taylor Reed!" }),
  ).toBeVisible();
  await expect(page.getByText("TEST-DOUBLE-1")).toBeVisible();
  expect(requests).toBe(1);
  await expect(page.getByRole("status")).toHaveCount(1);
});

test("empty cart is rejected with a visible message and no service request", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/orders", async (route) => {
    requests += 1;
    await route.fulfill({
      status: 201,
      json: { reference: "SHOULD-NOT-EXIST" },
    });
  });
  await page.getByRole("button", { name: "Remove Field Notes" }).click();
  await expect(page.getByTestId("cart-count")).toHaveText("0");
  await expect(page.getByRole("status")).toHaveText(
    "Your cart is empty. Add something you love.",
  );
  await page
    .getByRole("button", { name: "Place order" })
    .click({ force: true });
  await expect(page.getByRole("alert")).toHaveText(
    "Your bag is empty. Add an item before placing your order.",
  );
  expect(requests).toBe(0);
});

test("whitespace-only name is rejected and is never sent to the order service", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/orders", async (route) => {
    requests += 1;
    await route.fulfill({
      status: 201,
      json: { reference: "SHOULD-NOT-EXIST" },
    });
  });
  await page.getByLabel("Your name").fill("   ");
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page.getByRole("alert")).toHaveText(
    "Please enter your name to continue.",
  );
  await expect(page.getByLabel("Your name")).toHaveValue("   ");
  await expect(page.getByLabel("Field Notes quantity")).toHaveValue("1");
  expect(requests).toBe(0);
});
