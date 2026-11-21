import type { CartLine } from "../types";
import { formatMoney } from "../utils/money";

type OrderBreakdownProps = { items: CartLine[] };

export function OrderBreakdown({ items }: OrderBreakdownProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );

  return (
    <section className="order-breakdown" aria-labelledby="breakdown-heading">
      <h2 id="breakdown-heading">Order summary</h2>
      <div className="breakdown-row">
        <span>Subtotal</span>
        <span data-testid="order-subtotal">{formatMoney(subtotal)}</span>
      </div>
      <div className="breakdown-row">
        <span>Shipping</span>
        <span className="free-shipping">Free</span>
      </div>
      <div className="breakdown-total">
        <strong>Order total</strong>
        <strong data-testid="order-total">{formatMoney(subtotal)}</strong>
      </div>
      <p className="shipping-note">Shipping is on us for every order.</p>
    </section>
  );
}
