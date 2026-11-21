import type { Product } from "../types";
import { formatMoney } from "../utils/money";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="product-card" aria-label={product.name}>
      <div className={`product-art art-${product.id}`}>
        <img src={product.image} alt={product.imageAlt} />
      </div>
      <div className="product-copy">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
      <div className="product-action">
        <strong>{formatMoney(product.priceCents)}</strong>
        <button className="button button-dark" onClick={() => onAdd(product)}>
          Add to bag
        </button>
      </div>
    </article>
  );
}
