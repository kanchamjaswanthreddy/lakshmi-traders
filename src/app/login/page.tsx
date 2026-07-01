"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const SPRING = { type: "spring" as const, stiffness: 260, damping: 24 };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

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
    <main className="bg-mesh flex min-h-dvh items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRING}
        className="w-full max-w-sm"
      >
        {/* Floating card with subtle hover */}
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
            {/* Decorative copper accent line at top */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-copper to-transparent opacity-60" />

            <div className="px-8 pt-10 pb-9">
              {/* Monogram and branding */}
              <div className="mb-10 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...SPRING, delay: 0.1 }}
                  className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#B5651D] to-[#D4924B] shadow-lg"
                >
                  <span className="text-[32px] font-bold leading-none text-white" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                    L
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.15 }}
                  className="large-title text-foreground"
                >
                  Sri Sri Sri
                  <br />
                  Lakshmi Traders
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...SPRING, delay: 0.2 }}
                  className="mt-2 text-[13px] font-medium uppercase tracking-[3px] text-muted-foreground"
                >
                  Tadipatri, AP
                </motion.p>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.25 }}
                >
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[13px] font-medium text-muted-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/40"
                    style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }}
                    placeholder="you@example.com"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.3 }}
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/40"
                    style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }}
                    placeholder="Enter password"
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="overflow-hidden rounded-xl bg-destructive/10 px-4 py-2.5 text-[14px] text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.35 }}
                  className="pt-1"
                >
                  <button
                    type="submit"
                    disabled={submitting}
                    className="login-btn-shimmer relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#B5651D] to-[#D4924B] py-3.5 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
                  >
                    {submitting ? "Signing in..." : "Sign In"}
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
