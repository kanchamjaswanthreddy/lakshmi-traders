"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const SPRING = { type: "spring" as const, stiffness: 260, damping: 24 };

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
    <main className="bg-mesh flex min-h-dvh items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRING}
        className="w-full max-w-sm"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            type: "spring" as const,
            stiffness: 40,
            damping: 12,
            repeat: Infinity,
            repeatType: "reverse" as const,
            duration: 4,
          }}
        >
          <div className="card-glow relative overflow-hidden rounded-[20px] bg-card backdrop-blur-xl">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-copper to-transparent opacity-60" />

            <div className="px-8 pt-10 pb-9">
              {/* Monogram and branding */}
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...SPRING, delay: 0.1 }}
                  className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] shadow-lg"
                >
                  <span
                    className="text-[32px] font-bold leading-none text-white"
                    style={{
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                  >
                    L
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.15 }}
                  className="large-title text-foreground"
                >
                  Request Access
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...SPRING, delay: 0.2 }}
                  className="mt-2 text-[13px] font-medium uppercase tracking-[3px] text-muted-foreground"
                >
                  Sri Sri Sri Lakshmi Traders
                </motion.p>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={SPRING}
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
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={SPRING}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING, delay: 0.25 }}
                    >
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
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING, delay: 0.3 }}
                    >
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
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING, delay: 0.35 }}
                    >
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
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING, delay: 0.4 }}
                    >
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
                    </motion.div>

                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -8, height: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          className="overflow-hidden rounded-xl bg-destructive/10 px-4 py-2.5 text-[14px] text-destructive"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING, delay: 0.45 }}
                      className="pt-1"
                    >
                      <button
                        type="submit"
                        disabled={submitting}
                        className="login-btn-shimmer relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#1D1D1F] to-[#3A3A3C] py-3.5 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-95 disabled:opacity-50"
                      >
                        {submitting ? "Sending request..." : "Request Access"}
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...SPRING, delay: 0.5 }}
                className="mt-6 text-center text-[14px] text-muted-foreground"
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-foreground underline underline-offset-2 transition-opacity active:scale-95 active:opacity-70"
                >
                  Sign in
                </Link>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
