-- Sri Sri Sri Lakshmi Traders — Supabase Schema
-- Run this SQL in Supabase SQL Editor

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  shop_price DECIMAL(10,2),
  customer_price DECIMAL(10,2),
  customer2_price DECIMAL(10,2),
  mrp DECIMAL(10,2),
  discount_percent DECIMAL(5,2),
  part_no TEXT,
  size TEXT,
  sub_type TEXT,
  discount_category TEXT,
  gst_percent DECIMAL(5,2) NOT NULL DEFAULT 18.00,
  hsn_code TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'NOS',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: Add new columns to existing products table
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS shop_price DECIMAL(10,2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS customer_price DECIMAL(10,2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS customer2_price DECIMAL(10,2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS mrp DECIMAL(10,2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS part_no TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS size TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_type TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_category TEXT;
-- CREATE INDEX IF NOT EXISTS idx_products_part_no ON products(part_no);
-- CREATE INDEX IF NOT EXISTS idx_products_sub_type ON products(sub_type);
-- CREATE INDEX IF NOT EXISTS idx_products_discount_category ON products(discount_category);

-- Bill number sequence tracker
CREATE TABLE bill_sequence (
  id INT PRIMARY KEY DEFAULT 1,
  last_number INT NOT NULL DEFAULT 0
);
INSERT INTO bill_sequence (id, last_number) VALUES (1, 824);

-- Bills table
CREATE TABLE bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_address TEXT,
  customer_gstin TEXT,
  customer_state TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  date_of_delivery DATE,
  vehicle_no TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  cgst_percent DECIMAL(5,2) DEFAULT 9.00,
  sgst_percent DECIMAL(5,2) DEFAULT 9.00,
  igst_percent DECIMAL(5,2) DEFAULT 0.00,
  cgst_amount DECIMAL(10,2) DEFAULT 0.00,
  sgst_amount DECIMAL(10,2) DEFAULT 0.00,
  igst_amount DECIMAL(10,2) DEFAULT 0.00,
  total_gst DECIMAL(10,2) NOT NULL,
  grand_total DECIMAL(10,2) NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  phonepe_txn_id TEXT,
  phonepe_date DATE,
  phonepe_amount DECIMAL(10,2),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Bill items table
CREATE TABLE bill_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  hsn_code TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit TEXT NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  gst_percent DECIMAL(5,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  s_no INT NOT NULL
);

-- PhonePe transactions cache
CREATE TABLE phonepe_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  txn_id TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  amount DECIMAL(10,2) NOT NULL,
  txn_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  bill_created BOOLEAN DEFAULT false,
  bill_id UUID REFERENCES bills(id),
  raw_data JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bills_date ON bills(date DESC);
CREATE INDEX idx_bills_bill_number ON bills(bill_number);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_phonepe_txn_date ON phonepe_transactions(txn_date DESC);
CREATE INDEX idx_bills_deleted_at ON bills(deleted_at);

-- Function to get and increment bill number atomically
CREATE OR REPLACE FUNCTION get_next_bill_number()
RETURNS TEXT AS $$
DECLARE
  next_num INT;
BEGIN
  UPDATE bill_sequence SET last_number = last_number + 1 WHERE id = 1
  RETURNING last_number INTO next_num;
  RETURN LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;
