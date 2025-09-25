export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  status: string;
  transaction_id: string;
  payment_date: Date;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
}
