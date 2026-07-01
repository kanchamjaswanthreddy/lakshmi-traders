import { createClient } from "@supabase/supabase-js";
import { categories, products } from "@/lib/seed-data";
import { NextResponse } from "next/server";

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY env var" },
      { status: 500 }
    );
  }

  // Use service role key to bypass RLS
  const supabase = createClient(supabaseUrl, serviceKey);

  // 1. Upsert categories
  const { data: categoryRows, error: catError } = await supabase
    .from("categories")
    .upsert(
      categories.map((c) => ({
        name: c.name,
        description: c.description,
        regular_discount_pct: c.regular_discount_pct,
        shop_owner_discount_pct: c.shop_owner_discount_pct,
      })),
      { onConflict: "name" }
    )
    .select();

  if (catError) {
    return NextResponse.json(
      { error: `Categories error: ${catError.message}` },
      { status: 500 }
    );
  }

  // Build category name -> id map
  const catMap = new Map<string, string>();
  for (const row of categoryRows ?? []) {
    catMap.set(row.name, row.id);
  }

  // 2. Insert products in batches of 200
  const batchSize = 200;
  let totalInserted = 0;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize).map((p) => ({
      category_id: catMap.get(p.category) ?? null,
      name: p.name,
      unit: p.unit,
      master_price: p.master_price,
    }));

    const { error: prodError } = await supabase
      .from("products")
      .insert(batch);

    if (prodError) {
      return NextResponse.json(
        {
          error: `Products batch ${i} error: ${prodError.message}`,
          inserted_so_far: totalInserted,
        },
        { status: 500 }
      );
    }

    totalInserted += batch.length;
  }

  return NextResponse.json({
    success: true,
    categories_created: categoryRows?.length ?? 0,
    products_created: totalInserted,
  });
}
