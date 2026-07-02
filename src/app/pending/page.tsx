"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 260, damping: 24 };

export default function PendingPage() {
  return (
    <main className="bg-mesh flex min-h-dvh items-center justify-center overflow-y-auto bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRING}
        className="w-full max-w-sm"
      >
          <div className="card-glow relative overflow-hidden rounded-[20px] bg-card backdrop-blur-xl">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-copper to-transparent opacity-60" />

            <div className="px-8 py-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.1 }}
                className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary"
              >
                <Clock
                  size={36}
                  className="text-foreground"
                  strokeWidth={1.5}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.15 }}
                className="large-title text-foreground"
              >
                Account Pending
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...SPRING, delay: 0.2 }}
                className="mt-4 text-[15px] leading-relaxed text-muted-foreground"
              >
                Your account is awaiting admin approval. Please check back
                later.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...SPRING, delay: 0.3 }}
                className="mt-6 rounded-2xl bg-secondary px-4 py-3"
              >
                <p className="text-[13px] text-muted-foreground">
                  You&apos;ll be able to access the app once an admin approves
                  your request.
                </p>
              </motion.div>
            </div>
          </div>
      </motion.div>
    </main>
  );
}
