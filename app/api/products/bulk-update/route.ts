import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { updates } = body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
  }

  let success = 0;
  let failed = 0;

  for (const update of updates) {
    const { name, price } = update;
    if (!name || !price) { failed++; continue; }

    const { error } = await supabaseAdmin
      .from('products')
      .update({ price: parseFloat(price) })
      .ilike('name', name.trim());

    if (error) { failed++; } else { success++; }
  }

  return NextResponse.json({ success, failed, total: updates.length });
}
