// Sudhakar Rigid PVC Fittings — Complete Price List
// Source: Sudhakar_PVC_Fittings_Price_List.xlsx
// 232 products across 18 fitting categories
// Pricing: List Rate → MRP, Buy Price (53.52% off) → Cost, 48% off → Shop, 40% off → Cust1, 35% off → Cust2

const SUPABASE_URL = 'https://rmlivwqapxlvzdwpzbcp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbGl2d3FhcHhsdnpkd3B6YmNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyOTY2NiwiZXhwIjoyMDk2NTA1NjY2fQ.1lfEPkNsC8YIv_XBztomHYrdUtU0MZxqy2AS2zMLwFc';

const HSN = '39174000';
const GST = 18;

// Excel data extracted from Price List sheet
const RAW = [
  { category: "Reducer Tee", variant: "Single Stage", item_code: "251211070", size_mm: "25-20", size_inch: '3/4 x 1/2', pressure_class: "PN10", packing: 150, list_rate: 22, buy_price: 10.23, price_48: 11.44, price_40: 13.2, price_35: 14.3 },
  { category: "Reducer Tee", variant: "Single Stage", item_code: "251211071", size_mm: "32-25", size_inch: '1 x 3/4', pressure_class: "PN10", packing: 100, list_rate: 35, buy_price: 16.27, price_48: 18.2, price_40: 21, price_35: 22.75 },
  { category: "Reducer Tee", variant: "Single Stage", item_code: "251211072", size_mm: "40-32", size_inch: '1 1/4 x 1', pressure_class: "PN6", packing: 60, list_rate: 49, buy_price: 22.78, price_48: 25.48, price_40: 29.4, price_35: 31.85 },
  { category: "Reducer Tee", variant: "Single Stage", item_code: "251211076", size_mm: "63-50", size_inch: '2 x 1 1/2', pressure_class: "PN6", packing: 50, list_rate: 113, buy_price: 52.52, price_48: 58.76, price_40: 67.8, price_35: 73.45 },
  { category: "Reducer Tee", variant: "Single Stage", item_code: "251211073", size_mm: "50-32", size_inch: '1 1/2 x 1', pressure_class: "PN6", packing: 50, list_rate: 73, buy_price: 33.93, price_48: 37.96, price_40: 43.8, price_35: 47.45 },
  { category: "Reducer Tee", variant: "Single Stage", item_code: "251211074", size_mm: "50-40", size_inch: '1 1/2 x 1 1/4', pressure_class: "PN6", packing: 50, list_rate: 77, buy_price: 35.79, price_48: 40.04, price_40: 46.2, price_35: 50.05 },
];

// Instead of hardcoding all 232 products, read from the JSON file
const fs = require('fs');
const path = require('path');
const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sudhakar-products.json'), 'utf8'));

function buildProduct(r) {
  const sizeParts = r.size_inch || r.size_mm || '';
  const name = `Sudhakar ${r.category} ${sizeParts}`.trim();

  return {
    name,
    category: 'sudhakar',
    sub_type: r.category,          // Fitting type as sub_type
    size: sizeParts,
    part_no: r.item_code,
    price: r.price_48,             // Default price = shop price
    mrp: r.list_rate,
    cost_price: r.buy_price,
    shop_price: r.price_48,
    customer_price: r.price_40,
    customer2_price: r.price_35,
    discount_category: `Sudhakar ${r.category}`,
    gst_percent: GST,
    hsn_code: HSN,
    unit: 'NOS',
    is_active: true,
  };
}

const products = rawData.map(buildProduct);

async function seed() {
  console.log(`Seeding ${products.length} Sudhakar PVC Fitting products...`);
  let success = 0, failed = 0;

  for (let i = 0; i < products.length; i += 50) {
    const batch = products.slice(i, i + 50);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(batch),
    });
    if (res.ok) {
      const data = await res.json();
      success += data.length;
      console.log(`  Batch ${Math.floor(i / 50) + 1}: ${data.length} inserted`);
    } else {
      const err = await res.text();
      console.error(`  Batch ${Math.floor(i / 50) + 1} FAILED:`, err.slice(0, 300));
      failed += batch.length;
    }
  }
  console.log(`\nTotal: ${success} inserted, ${failed} failed out of ${products.length}`);
}

seed().catch(console.error);
