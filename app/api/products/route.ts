import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const activeOnly = searchParams.get('active') !== 'false';
  const subType = searchParams.get('sub_type');
  const discountCategory = searchParams.get('discount_category');

  let query = supabaseAdmin.from('products').select('*');

  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (subType && subType !== 'all') {
    query = query.eq('sub_type', subType);
  }
  if (discountCategory && discountCategory !== 'all') {
    query = query.eq('discount_category', discountCategory);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  query = query.order('sort_order', { ascending: true });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function POST(req: Request) {
  const body = await req.json();

  // Bulk insert mode
  if (Array.isArray(body.products)) {
    const products = body.products;
    const BATCH_SIZE = 100;
    let inserted = 0;
    let failed = 0;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const { error } = await supabaseAdmin.from('products').insert(batch);
      if (error) {
        failed += batch.length;
      } else {
        inserted += batch.length;
      }
    }

    return NextResponse.json({ inserted, failed, total: products.length });
  }

  // Single insert
  const { name, category, price, gst_percent, hsn_code, unit,
    cost_price, shop_price, customer_price, customer2_price,
    mrp, discount_percent, part_no, size, sub_type, discount_category } = body;

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name,
      category,
      price,
      cost_price: cost_price ?? null,
      shop_price: shop_price ?? null,
      customer_price: customer_price ?? null,
      customer2_price: customer2_price ?? null,
      mrp: mrp ?? null,
      discount_percent: discount_percent ?? null,
      part_no: part_no ?? null,
      size: size ?? null,
      sub_type: sub_type ?? null,
      discount_category: discount_category ?? null,
      gst_percent: gst_percent ?? 18,
      hsn_code,
      unit: unit || 'NOS',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
  }

  // Allowlist of updatable fields
  const allowedFields = ['name', 'category', 'price', 'gst_percent', 'hsn_code', 'unit', 'is_active',
    'cost_price', 'shop_price', 'customer_price', 'customer2_price', 'mrp', 'discount_percent',
    'part_no', 'size', 'sub_type', 'discount_category'] as const;
  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
