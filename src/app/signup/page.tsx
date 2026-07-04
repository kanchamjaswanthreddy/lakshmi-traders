"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function usernameToEmail(username: string): string {
  return `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@lakshmitraders.app`;
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    const email = usernameToEmail(username);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username: username.trim() },
      },
    });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="bg-mesh min-h-dvh overflow-y-auto bg-background px-6 pb-12 pt-[10vh]">
      <div
        className="w-full max-w-sm"
      >
          <div className="card-glow relative overflow-hidden rounded-[20px] bg-card backdrop-blur-xl">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-copper to-transparent opacity-60" />

            <div className="px-8 pt-10 pb-9">
              {/* Monogram and branding */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center">
                  <img src="/icons/logo.png" alt="Lakshmi Traders" className="h-full w-full object-contain drop-shadow-lg" />
                </div>

                <h1
                  className="large-title text-foreground"
                >
                  Request Access
                </h1>

                <p
                  className="mt-2 text-[13px] font-medium uppercase tracking-[3px] text-muted-foreground"
                >
                  Sri Sri Sri Lakshmi Traders
                </p>
              </div>

              {submitted ? (
                <div
                  className="rounded-2xl bg-secondary px-5 py-6 text-center"
                >
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
                    <svg
                      className="h-7 w-7 text-background"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-[17px] font-semibold text-foreground">
                    Request Sent
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                    Your account request has been sent to the admin for
                    approval. You&apos;ll be notified once approved.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1.5 block text-[13px] font-medium text-muted-foreground"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/40"
                      style={{
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
                      }}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="mb-1.5 block text-[13px] font-medium text-muted-foreground"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/40"
                      style={{
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
                      }}
                      placeholder="Choose a username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-[13px] font-medium text-muted-foreground"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/40"
                      style={{
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
                      }}
                      placeholder="Min 6 characters"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1.5 block text-[13px] font-medium text-muted-foreground"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/40"
                      style={{
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
                      }}
                      placeholder="Re-enter password"
                    />
                  </div>

                  {error && (
                    <p
                      className="overflow-hidden rounded-xl bg-destructive/10 px-4 py-2.5 text-[14px] text-destructive"
                    >
                      {error}
                    </p>
                  )}

                  <div
                    className="pt-1"
                  >
                    <button
                      type="submit"
                      disabled={submitting}
                      className="login-btn-shimmer relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#1D1D1F] to-[#3A3A3C] py-3.5 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-95 disabled:opacity-50"
                    >
                      {submitting ? "Sending request..." : "Request Access"}
                    </button>
                  </div>
                </form>
              )}

              <p
                className="mt-6 text-center text-[14px] text-muted-foreground"
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-foreground underline underline-offset-2 transition-opacity active:scale-95 active:opacity-70"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
      </div>
    </main>
  );
}
