import type { OrderResponse } from "../types";

export async function placeOrder(name: string): Promise<OrderResponse> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("We could not place your order. Please try again.");
  }

  return (await response.json()) as OrderResponse;
}
