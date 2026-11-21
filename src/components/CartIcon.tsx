type CartIconProps = {
  count: number;
  onNavigate: (path: string) => void;
};

export function CartIcon({ count, onNavigate }: CartIconProps) {
  return (
    <a
      className="cart-link"
      href="/cart"
      aria-label={`Shopping cart, ${count} ${count === 1 ? "item" : "items"}`}
      onClick={(event) => {
        event.preventDefault();
        onNavigate("/cart");
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      <span className="cart-count" data-testid="cart-count" aria-hidden="true">
        {count}
      </span>
    </a>
  );
}
