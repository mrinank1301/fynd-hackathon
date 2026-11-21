import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { placeOrder } from "../services/orders";
import type { CartLine, Product } from "../types";
import { CartPage } from "./CartPage";
import { ProductsPage } from "./ProductsPage";
import { ThankYouPage } from "./ThankYouPage";

type ConfirmationState = { name: string; reference: string } | null;

export function CheckoutPage() {
  const [path, setPath] = useState(() => {
    const current = window.location.pathname;
    return current === "/" ? "/products" : current;
  });
  const [items, setItems] = useState<CartLine[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (window.location.pathname === "/") {
      window.history.replaceState({}, "", "/products");
    }
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (path === "/thank-you" && !confirmation) {
      window.history.replaceState({}, "", "/products");
      setPath("/products");
    }
  }, [path, confirmation]);

  function navigate(nextPath: string) {
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setPath(nextPath);
    window.scrollTo(0, 0);
  }

  function addProduct(product: Product) {
    setItems((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (!existing) return [...current, { product, quantity: 1 }];
      return current.map((line) =>
        line.product.id === product.id
          ? { ...line, quantity: Math.min(99, line.quantity + 1) }
          : line,
      );
    });
    setError("");
  }

  function changeQuantity(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setItems((current) =>
      current.map((line) =>
        line.product.id === productId
          ? { ...line, quantity: Math.min(99, quantity) }
          : line,
      ),
    );
  }

  function removeProduct(productId: string) {
    setItems((current) =>
      current.filter((line) => line.product.id !== productId),
    );
  }

  async function submitOrder() {
    if (submittingRef.current || confirmation) return;
    if (items.length === 0) {
      setError("Your bag is empty. Add an item before placing your order.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name to continue.");
      return;
    }

    setError("");
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const customerName = name.trim();
      const order = await placeOrder(customerName);
      setConfirmation({ name: customerName, reference: order.reference });
      setItems([]);
      navigate("/thank-you");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Please try again.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  const safePath = ["/products", "/cart", "/thank-you"].includes(path)
    ? path
    : "/products";

  return (
    <main className="page-shell">
      <SiteHeader cartCount={cartCount} onNavigate={navigate} />
      {safePath === "/cart" ? (
        <CartPage
          items={items}
          name={name}
          error={error}
          submitting={submitting}
          onNameChange={(value) => {
            setName(value);
            if (error) setError("");
          }}
          onQuantityChange={changeQuantity}
          onRemove={removeProduct}
          onNavigate={navigate}
          onSubmit={submitOrder}
        />
      ) : safePath === "/thank-you" && confirmation ? (
        <ThankYouPage
          name={confirmation.name}
          reference={confirmation.reference}
          onNavigate={navigate}
        />
      ) : (
        <ProductsPage onAdd={addProduct} />
      )}
      <footer className="site-footer">
        © 2025 Northstar Supply Co. <span>Made for the everyday.</span>
      </footer>
    </main>
  );
}
