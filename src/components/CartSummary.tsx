import type { CartLine } from "../types";
import { formatMoney } from "../utils/money";

type CartSummaryProps = {
  items: CartLine[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

export function CartSummary({
  items,
  onQuantityChange,
  onRemove,
}: CartSummaryProps) {
  return (
    <section className="cart-panel" aria-labelledby="cart-items-heading">
      <div className="panel-heading">
        <h2 id="cart-items-heading">Items in your cart</h2>
        <span className="item-count">
          {items.reduce((sum, item) => sum + item.quantity, 0)} items
        </span>
      </div>
      {items.length === 0 ? (
        <p className="empty-cart" role="status">
          Your cart is empty. Add something you love.
        </p>
      ) : (
        <ul className="cart-items">
          {items.map(({ product, quantity }) => (
            <li className="cart-line" key={product.id}>
              <div className={`mini-art art-${product.id}`}>
                <img src={product.image} alt="" />
              </div>
              <div className="line-info">
                <strong>{product.name}</strong>
                <span>{formatMoney(product.priceCents)} each</span>
                <button
                  aria-label={`Remove ${product.name}`}
                  className="text-button"
                  onClick={() => onRemove(product.id)}
                >
                  Remove item
                </button>
              </div>
              <label className="quantity-control">
                <span className="visually-hidden">{product.name} quantity</span>
                <input
                  aria-label={`${product.name} quantity`}
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(event) =>
                    onQuantityChange(product.id, Number(event.target.value))
                  }
                />
              </label>
              <strong
                className="line-total"
                aria-label={`${product.name} line total`}
              >
                {formatMoney(product.priceCents * quantity)}
              </strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
