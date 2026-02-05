export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number; // 0..5
  ratingCount: number;
  imageUrl: string;
  gallery: string[];
  colors: string[];
  sizes: string[];
  description: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Moose Men’s Assorted Polo T-Shirts",
    price: 990,
    oldPrice: 1990,
    rating: 4.6,
    ratingCount: 383,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1520975958225-6d57bbf6a3b2?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1520975693411-c4c45e26ec11?auto=format&fit=crop&w=900&q=60",
    ],
    colors: ["Black", "Navy", "Green", "Purple", "Yellow"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Comfort polo tee for daily wear. Demo product for CloudRetail storefront UI.",
  },
  {
    id: "p2",
    name: "Soundpeats T3 Pro Wireless Earbuds",
    price: 3899,
    oldPrice: 6499,
    rating: 4.4,
    ratingCount: 1205,
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=900&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1590658006821-04f4008d5715?auto=format&fit=crop&w=900&q=60",
    ],
    colors: ["Black"],
    sizes: ["One Size"],
    description: "Clear audio, compact case. Demo product for UI only.",
  },
  {
    id: "p3",
    name: "5PCS Sleeping Pillows Set",
    price: 1749,
    oldPrice: 2499,
    rating: 4.2,
    ratingCount: 221,
    imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=60",
    gallery: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=60",
    ],
    colors: ["White"],
    sizes: ["Standard"],
    description: "Soft pillows bundle. Demo product for UI only.",
  },
];

export function findProduct(id: string) {
  return products.find((p) => p.id === id) || null;
}
