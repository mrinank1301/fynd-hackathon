import { CartIcon } from "./CartIcon";

type SiteHeaderProps = {
  cartCount: number;
  onNavigate: (path: string) => void;
};

export function SiteHeader({ cartCount, onNavigate }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="/products"
        aria-label="Northstar Supply home"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("/products");
        }}
      >
        <span>✳</span> NORTHSTAR <small>SUPPLY CO.</small>
      </a>
      <span className="header-note">
        <span aria-hidden="true">⌑</span> Thoughtful goods, made to last
      </span>
      <CartIcon count={cartCount} onNavigate={onNavigate} />
    </header>
  );
}
