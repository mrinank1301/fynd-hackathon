import { ProductCard } from "../components/ProductCard";
import PRODUCTS from "../data/products.json";
import type { Product } from "../types";

type ProductsPageProps = {
  onAdd: (product: Product) => void;
};

export function ProductsPage({ onAdd }: ProductsPageProps) {
  return (
    <div className="page-content products-page">
      <div className="intro">
        <p className="eyebrow">The good stuff</p>
        <h1>
          A few things
          <br />
          <em>for the journey.</em>
        </h1>
        <p>Useful everyday essentials, chosen with care.</p>
      </div>
      <section className="products" aria-labelledby="products-heading">
        <div className="section-title">
          <h2 id="products-heading">Shop essentials</h2>
          <span>{PRODUCTS.length} considered things</span>
        </div>
        <div className="product-list">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      </section>
    </div>
  );
}
