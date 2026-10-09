export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost_price: number | null;
  shop_price: number | null;
  customer_price: number | null;
  customer2_price: number | null;
  mrp: number | null;
  discount_percent: number | null;
  part_no: string | null;
  size: string | null;
  sub_type: string | null;
  discount_category: string | null;
  gst_percent: number;
  hsn_code: string;
  unit: string;
  is_active: boolean;
  created_at: string;
}

export type CustomerType = 'shop' | 'customer' | 'customer2';

export function getProductPrice(product: Product, customerType: CustomerType): number {
  switch (customerType) {
    case 'shop': return product.shop_price ?? product.price;
    case 'customer': return product.customer_price ?? product.price;
    case 'customer2': return product.customer2_price ?? product.price;
  }
}

export interface BillItem {
  id?: string;
  bill_id?: string;
  product_id: string;
  product_name: string;
  hsn_code: string;
  quantity: number;
  unit: string;
  rate: number;
  gst_percent: number;
  amount: number;
  s_no: number;
}

export interface Bill {
  id: string;
  bill_number: string;
  customer_name: string;
  customer_address: string | null;
  customer_gstin: string | null;
  customer_state: string | null;
  date: string;
  date_of_delivery: string | null;
  vehicle_no: string | null;
  subtotal: number;
  cgst_percent: number;
  sgst_percent: number;
  igst_percent: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_gst: number;
  grand_total: number;
  source: 'manual' | 'phonepe' | 'estimate' | 'auto_bulk';
  phonepe_txn_id: string | null;
  phonepe_date: string | null;
  phonepe_amount: number | null;
  remarks: string | null;
  eway_bill_no: string | null;
  created_at: string;
  deleted_at: string | null;
  bill_items?: BillItem[];
}

export interface PhonePeTransaction {
  id: string;
  txn_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  amount: number;
  txn_date: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  bill_created: boolean;
  bill_id: string | null;
  raw_data: Record<string, unknown> | null;
  fetched_at: string;
}

export interface SelectedItem {
  product: Product;
  quantity: number;
  amount: number;
  gstAmount: number;
  totalWithGst: number;
}

export interface BillFormItem {
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  gstPercent: number;
  amount: number;
}

export interface Category {
  id: string;
  label: string;
  hsn_default: string;
}
