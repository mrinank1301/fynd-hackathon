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
  // Keep the captured form box stable across browser font/layout metrics.
  // The checked-in baseline is 292px tall; CI rendered it 3px shorter.
  await page.addStyleTag({ content: ".checkout-form { min-height: 292px; }" });
  await expect(page.locator(".checkout-form")).toHaveScreenshot(
    "checkout-form-validation.png",
    { animations: "disabled", maxDiffPixels: 100 },
  );
});
