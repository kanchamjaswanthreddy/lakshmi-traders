import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { AdminUsers } from "@/components/admin-users";

export const dynamic = "force-dynamic";

export interface UserWithProfile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "viewer";
  status: "pending" | "active" | "rejected";
  created_at: string;
}

export default async function UsersPage() {
  const supabase = await createServerClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  // Use service role to get auth user details (email, metadata)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let users: UserWithProfile[] = [];

  if (serviceKey && profiles) {
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: authData } = await adminClient.auth.admin.listUsers({
      perPage: 1000,
    });

    const authUsers = authData?.users ?? [];
    const authMap = new Map(authUsers.map((u) => [u.id, u]));

    users = profiles.map((p) => {
      const authUser = authMap.get(p.id);
      return {
        id: p.id,
        email: authUser?.email ?? "Unknown",
        full_name:
          (authUser?.user_metadata?.full_name as string) ?? "",
        role: p.role,
        status: p.status ?? "active",
        created_at: p.created_at,
      };
    });
  }

  return <AdminUsers initialUsers={users} />;
}
