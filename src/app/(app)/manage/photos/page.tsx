import { createClient } from "@/lib/supabase/server";
import { AdminPhotoReview } from "@/components/admin-photo-review";

export const dynamic = "force-dynamic";

export default async function ManagePhotosPage() {
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("photo_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminPhotoReview initialSubmissions={submissions ?? []} />;
}
