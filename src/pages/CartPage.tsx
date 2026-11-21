import { CartSummary } from "../components/CartSummary";
import { CheckoutForm } from "../components/CheckoutForm";
import { OrderBreakdown } from "../components/OrderBreakdown";
import type { CartLine } from "../types";

type CartPageProps = {
  items: CartLine[];
  name: string;
  error: string;
  submitting: boolean;
  onNameChange: (name: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onNavigate: (path: string) => void;
  onSubmit: () => void;
};

export function CartPage({
  items,
  name,
  error,
  submitting,
  onNameChange,
  onQuantityChange,
  onRemove,
  onNavigate,
  onSubmit,
}: CartPageProps) {
  return (
    <div className="page-content cart-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">One last look</p>
          <h1>Your cart</h1>
        </div>
        <button
          className="text-button continue-shopping"
          onClick={() => onNavigate("/products")}
        >
          ← Continue shopping
        </button>
      </div>
      <div className="cart-layout">
        <CartSummary
          items={items}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
        <aside
          className="checkout-sidebar"
          aria-label="Checkout and order total"
        >
          <OrderBreakdown items={items} />
          <CheckoutForm
            name={name}
            error={error}
            submitting={submitting}
            disabled={false}
            onNameChange={onNameChange}
            onSubmit={onSubmit}
          />
        </aside>
      </div>
    </div>
  );
}
