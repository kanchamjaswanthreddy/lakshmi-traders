export interface Category {
  id: string;
  name: string;
  description: string | null;
  regular_discount_pct: number;
  shop_owner_discount_pct: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  unit: string | null;
  master_price: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Profile {
  id: string;
  role: "admin" | "viewer";
  created_at: string;
}

export interface PriceListUpload {
  id: string;
  filename: string;
  uploaded_at: string;
  rows_added: number;
  rows_updated: number;
}

export function computeRegularPrice(masterPrice: number, discountPct: number): number {
  return Math.round(masterPrice * (1 - discountPct / 100) * 100) / 100;
}

export function computeShopOwnerPrice(masterPrice: number, discountPct: number): number {
  return Math.round(masterPrice * (1 - discountPct / 100) * 100) / 100;
}

export function computeQuotePrice(masterPrice: number, discountPct: number): number {
  return Math.round(masterPrice * (1 - discountPct / 100) * 100) / 100;
}
