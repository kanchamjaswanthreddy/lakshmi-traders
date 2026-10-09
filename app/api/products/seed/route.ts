import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ParsedProduct {
  name: string;
  category: string;
  price: number;
  cost_price: number;
  shop_price: number;
  customer_price: number;
  customer2_price: number;
  mrp: number;
  discount_percent: number;
  part_no: string;
  size: string;
  sub_type: string;
  discount_category: string;
  gst_percent: number;
  hsn_code: string;
  unit: string;
  sort_order: number;
}

// Convert cm size to inch size
const CM_TO_INCH: Record<string, string> = {
  '1.5': '½"', '2': '¾"', '2.0': '¾"', '2.5': '1"', '3.2': '1¼"', '4': '1½"', '4.0': '1½"',
  '5': '2"', '5.0': '2"', '6.3': '2½"', '6.5': '2½"',
  '7.5': '3"', '8.0': '3"', '9.0': '3½"',
  '10.0': '4"', '10': '4"', '11': '4"', '11.0': '4"',
  '12.5': '5"',
  '15': '6"', '15.0': '6"',
  '20': '8"', '20.0': '8"',
  '25': '10"', '25.0': '10"',
  '29.5': '12"',
};

function cmToInch(cmSize: string): string {
  const trimmed = cmSize.trim();

  // Values like 50, 100, 200, 500, 946, 1000, 5000 — solvent/lubricant grams/ml, keep as-is
  const num = parseFloat(trimmed);
  if (!isNaN(num) && num >= 50) return trimmed;

  // Special values like "M16 x 125", "11 (4 Square)", etc. — keep as-is
  if (trimmed.startsWith('M') || trimmed.includes('Square') || trimmed.includes('Deeper') || trimmed.includes('Long') || trimmed.includes('With') || trimmed.includes('Without')) {
    // Still convert individual cm parts where possible
    return trimmed.replace(/(\d+\.?\d*)/g, (match) => {
      const inch = CM_TO_INCH[match];
      return inch ? inch.replace('"', '') : match;
    }) ;
  }

  // Handle compound sizes like "2.0 x 1.5" → "¾ x ½" or "2.0x1.5x1.5" → "¾x½x½"
  if (trimmed.includes('x')) {
    const separator = trimmed.includes(' x ') ? ' x ' : 'x';
    return trimmed.split(separator).map(p => {
      const part = p.trim();
      return CM_TO_INCH[part] || part;
    }).join(separator === ' x ' ? ' x ' : 'x');
  }

  return CM_TO_INCH[trimmed] || trimmed;
}

function parseMarkdown(md: string): ParsedProduct[] {
  const lines = md.split('\n');
  const products: ParsedProduct[] = [];

  let currentCategory = '';
  let discountPercent = 0;
  let subSection = '';

  const catRegex = /^## Category (\d+): (.+?) — (\d+\.?\d*)% Discount/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const catMatch = line.match(catRegex);
    if (catMatch) {
      currentCategory = catMatch[2];
      discountPercent = parseFloat(catMatch[3]);
      subSection = '';
      continue;
    }

    const subMatch = line.match(/^#{3,4}\s+(.+)/);
    if (subMatch) {
      subSection = subMatch[1];
      continue;
    }

    if (!currentCategory) continue;
    if (!line.startsWith('|')) continue;
    if (line.includes('---')) continue;
    if (line.includes('Product') && (line.includes('Size') || line.includes('Part No'))) continue;

    const cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0);
    if (cells.length < 3) continue;

    let productName: string, size: string, partNo: string, mrpStr: string;

    if (cells.length === 5) {
      // Product | Size (cm) | Size (inch) | Part No | MRP — use inch size
      productName = cells[0];
      size = cells[2] || cmToInch(cells[1]);
      partNo = cells[3];
      mrpStr = cells[4];
    } else if (cells.length === 4) {
      // Product | Size (cm) | Part No | MRP — convert cm to inch
      productName = cells[0];
      size = cmToInch(cells[1]);
      partNo = cells[2];
      mrpStr = cells[3];
    } else if (cells.length === 6) {
      // Product | Size (cm) | Size (inch) | ? | Part No | MRP — use inch size
      productName = cells[0];
      size = cells[2] || cmToInch(cells[1]);
      partNo = cells[4];
      mrpStr = cells[5];
    } else {
      continue;
    }

    const mrp = parseFloat(mrpStr.replace(/,/g, ''));
    if (isNaN(mrp)) continue;
    if (partNo === '-' && mrp === 0) continue;

    const costPrice = Math.round(mrp * (1 - discountPercent / 100) * 100) / 100;
    const shopPrice = Math.round(mrp * (1 - (discountPercent - 5) / 100) * 100) / 100;
    const customerPrice = Math.round(mrp * (1 - (discountPercent - 10) / 100) * 100) / 100;
    const customer2Price = Math.round(mrp * (1 - (discountPercent - 15) / 100) * 100) / 100;

    // Determine main category for DB
    let dbCategory = 'other';
    const catLower = currentCategory.toLowerCase();
    if (catLower.includes('cpvc')) dbCategory = 'cpvc';
    else if (catLower.includes('upvc')) dbCategory = 'upvc';
    else if (catLower.includes('swr') || catLower.includes('waste') || catLower.includes('pan')) dbCategory = 'swr';

    // Determine sub_type
    let subType = 'General';
    const subLower = subSection.toLowerCase();
    if (subLower.includes('pushfit')) subType = 'Pushfit';
    else if (subLower.includes('solfit')) subType = 'Solfit';
    else if (subLower.includes('common') || subLower.includes('both')) subType = 'Common';

    // Determine unit
    let unit = 'NOS';
    const nameLower = productName.toLowerCase();
    if (nameLower.includes('pipe') && !nameLower.includes('cleaning pipe') && !nameLower.includes('access pipe')) {
      unit = 'MTR';
    }
    if (nameLower.includes('solvent') || nameLower.includes('lubricant')) unit = 'NOS';

    // Build descriptive name: "Size ProductName" (e.g. "¾ Elbow 90°")
    const fullName = size ? `${size} ${productName}`.trim() : productName.trim();

    // HSN code
    let hsnCode = '39172390';
    if (catLower.includes('solvent')) hsnCode = '35061000';
    else if (catLower.includes('ball valve')) hsnCode = '39174000';
    else if (nameLower.includes('o ring') || nameLower.includes('o\'') || nameLower.includes('lubricant')) hsnCode = '40169300';

    products.push({
      name: fullName,
      category: dbCategory,
      price: shopPrice,
      cost_price: costPrice,
      shop_price: shopPrice,
      customer_price: customerPrice,
      customer2_price: customer2Price,
      mrp,
      discount_percent: discountPercent,
      part_no: partNo !== '-' ? partNo : '',
      size,
      sub_type: subType,
      discount_category: currentCategory,
      gst_percent: 18,
      hsn_code: hsnCode,
      unit,
      sort_order: products.length,
    });
  }

  return products;
}

export async function POST() {
  try {
    const mdPath = path.join(process.cwd(), 'ashirvad-products.md');
    const md = fs.readFileSync(mdPath, 'utf-8');
    const products = parseMarkdown(md);

    if (products.length === 0) {
      return NextResponse.json({ error: 'No products parsed from markdown' }, { status: 400 });
    }

    // Insert in batches
    const BATCH_SIZE = 100;
    let inserted = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const { error } = await supabaseAdmin.from('products').insert(batch);
      if (error) {
        failed += batch.length;
        errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
      } else {
        inserted += batch.length;
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      failed,
      total: products.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
