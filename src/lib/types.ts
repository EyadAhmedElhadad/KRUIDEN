export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  price: number;
  currency: string;
  ingredients: string[];
  benefits: string[];
  usage: string | null;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  quantity: number;
};

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  paymentMethod: "CASH_ON_DELIVERY" | "PAYMOB";
  items: { productId: string; quantity: number }[];
};
