import { expect, test } from "@playwright/experimental-ct-react";
import { FormHarness } from "./stories/FormHarness";
import "../../src/styles.css";

test("required field error is announced, linked, and visually captured", async ({
  mount,
  page,
}) => {
  await mount(<FormHarness />);
  await page.getByRole("button", { name: "Place order" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Please enter your name to continue.",
  );
  await expect(page.getByLabel("Your name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator(".checkout-form")).toHaveScreenshot(
    "checkout-form-validation.png",
    { animations: "disabled", maxDiffPixelRatio: 0.12 },
  );
});
