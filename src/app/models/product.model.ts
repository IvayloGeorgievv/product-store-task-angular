export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number; // Optional - only during sales
  inStock: boolean;
  description: string;
  rating: number; // 1-5
  reviewCount: number;
  createdAt: Date;
  specs: Record<string, string>;
  relatedIds: number[];
}
