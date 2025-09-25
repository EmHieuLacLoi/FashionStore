import type { OrderItem } from "./orderItem.interface";

export interface Order {
  id: number;
  code: string;
  user_id: number;
  user_name?: string;
  total_amount: number;
  status: string;
  address: string;
  phone_number: string;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  order_items: OrderItem[];
}
