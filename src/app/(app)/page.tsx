import { createClient } from "@/lib/supabase/server";
import { ProductsList } from "@/components/products-list";
import type { Category, Product, Subcategory } from "@/lib/types";

export const revalidate = 30;

export default async function ProductsPage() {
  const supabase = await createClient();

  const [categoriesResult, productsResult, subcategoriesResult] = await Promise.all([
    supabase.from("categories").select("*").order("name", { ascending: true }),
    supabase.from("products").select("*, category:categories(*)").order("name", { ascending: true }),
    supabase.from("subcategories").select("*").order("name", { ascending: true }),
  ]);

  const categories: Category[] = categoriesResult.data ?? [];
  const products: Product[] = productsResult.data ?? [];
  const subcategories: Subcategory[] = subcategoriesResult.data ?? [];

  return <ProductsList categories={categories} products={products} subcategories={subcategories} />;
}
