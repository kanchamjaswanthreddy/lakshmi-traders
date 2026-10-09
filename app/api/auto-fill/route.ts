import { autoFillItems } from '@/lib/autofill';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { categories, targetAmount } = await req.json();

  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .in('category', categories)
    .eq('is_active', true);

  if (!products || products.length === 0) {
    return NextResponse.json(
      { error: 'No products in selected categories' },
      { status: 400 }
    );
  }

  const result = autoFillItems(products, targetAmount);

  if (!result) {
    return NextResponse.json(
      {
        error:
          'Could not match amount. Please add more products or select more categories.',
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ items: result });
}
