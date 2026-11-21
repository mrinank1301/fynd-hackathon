import { useState } from "react";
import { CartSummary } from "../../../src/components/CartSummary";
import type { CartLine } from "../../../src/types";

export function InteractiveCart({
  initialItems,
}: {
  initialItems: CartLine[];
}) {
  const [items, setItems] = useState(initialItems);
  return (
    <CartSummary
      items={items}
      onQuantityChange={(id, quantity) =>
        setItems((current) =>
          current.map((line) =>
            line.product.id === id ? { ...line, quantity } : line,
          ),
        )
      }
      onRemove={(id) =>
        setItems((current) => current.filter((line) => line.product.id !== id))
      }
    />
  );
}
