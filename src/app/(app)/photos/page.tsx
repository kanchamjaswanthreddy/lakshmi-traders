import { createClient } from "@/lib/supabase/server";
import { PhotoSubmissions } from "@/components/photo-submissions";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  const isAdmin = profile?.role === "admin";

  const query = supabase
    .from("photo_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (!isAdmin && user) {
    query.eq("user_id", user.id);
  }

  const { data: submissions } = await query;

  return (
    <PhotoSubmissions
      initialSubmissions={submissions ?? []}
      isAdmin={isAdmin}
    />
  );
}
