import { expect, test } from "@playwright/experimental-ct-react";
import { CartIcon } from "../../src/components/CartIcon";
import "../../src/styles.css";

test("cart icon exposes the quantity and navigates to the cart", async ({
  mount,
  page,
}) => {
  let destination = "";
  await mount(
    <CartIcon count={3} onNavigate={(path) => (destination = path)} />,
  );

  const cartLink = page.getByRole("link", {
    name: "Shopping cart, 3 items",
  });
  await expect(page.getByTestId("cart-count")).toHaveText("3");
  await cartLink.click();
  expect(destination).toBe("/cart");
});
