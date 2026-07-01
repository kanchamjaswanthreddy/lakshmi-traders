import { createClient } from "@/lib/supabase/server";
import { QuoteCalculator } from "@/components/quote-calculator";
import type { Category, Product } from "@/lib/types";

export const revalidate = 30;

export default async function QuotePage() {
  const supabase = await createClient();

  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("name", { ascending: true }),
  ]);

  const categories: Category[] = categoriesResult.data ?? [];
  const products: Product[] = productsResult.data ?? [];

  return <QuoteCalculator categories={categories} products={products} />;
}
