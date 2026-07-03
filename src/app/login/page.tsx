"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function usernameToEmail(username: string): string {
  return `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@lakshmitraders.app`;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const email = usernameToEmail(username);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    router.replace("/");
  };

  return (
    <main className="bg-mesh min-h-dvh overflow-y-auto bg-background px-6 pb-12 pt-[12vh]">
      <div className="mx-auto w-full max-w-sm">
        <div className="card-glow relative overflow-hidden rounded-[20px] bg-card backdrop-blur-xl">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

          <div className="px-8 pt-10 pb-9">
            {/* Branding */}
            <div className="mb-10 text-center">
              <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] shadow-lg">
                <span className="text-[32px] font-bold leading-none text-white" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                  L
                </span>
              </div>
              <h1 className="large-title text-foreground">
                Sri Sri Sri
                <br />
                Lakshmi Traders
              </h1>
              <p className="mt-2 text-[13px] font-medium uppercase tracking-[3px] text-muted-foreground">
                Tadipatri, AP
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-[13px] font-medium text-muted-foreground">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }}
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-muted-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }}
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-[14px] text-destructive">
                  {error}
                </p>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#1D1D1F] to-[#3A3A3C] py-3.5 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
                >
                  {submitting ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-[14px] text-muted-foreground">
              Need an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-foreground underline underline-offset-2"
              >
                Request access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
