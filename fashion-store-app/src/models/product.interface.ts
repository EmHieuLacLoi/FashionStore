import type { ProductVariant } from "./productVariant.interface";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  category_id: number;
  category_name: string | null;
  image_url: string | string[];
  is_available: boolean;
  variants: ProductVariant[];
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
}
