import { createClient } from "@/lib/supabase/server";
import { ManageCategories } from "@/components/manage-categories";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <ManageCategories initialCategories={(categories as Category[]) ?? []} />
  );
}
