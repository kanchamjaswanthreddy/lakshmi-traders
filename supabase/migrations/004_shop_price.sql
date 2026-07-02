-- Add shop_price column to products
alter table public.products add column if not exists shop_price numeric(10,2);
