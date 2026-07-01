import { createClient } from "@/lib/supabase/server";
import { ManageSubcategories } from "@/components/manage-subcategories";

export const dynamic = "force-dynamic";

export default async function SubcategoriesPage() {
  const supabase = await createClient();

  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*, category:categories(id, name)")
    .order("name");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <ManageSubcategories
      initialSubcategories={subcategories ?? []}
      categories={categories ?? []}
    />
  );
}
