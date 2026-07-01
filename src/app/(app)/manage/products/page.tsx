import { createClient } from "@/lib/supabase/server";
import { ManageProducts } from "@/components/manage-products";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
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

  return (
    <ManageProducts initialProducts={products} categories={categories} />
  );
}
