export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  imageAlt: string;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type OrderResponse = { reference: string };
