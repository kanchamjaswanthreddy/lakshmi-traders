"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 260, damping: 24 };

export default function RejectedPage() {
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
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-destructive to-transparent opacity-60" />

            <div className="px-8 py-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.1 }}
                className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-destructive/10"
              >
                <XCircle
                  size={36}
                  className="text-destructive"
                  strokeWidth={1.5}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.15 }}
                className="large-title text-foreground"
              >
                Access Denied
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...SPRING, delay: 0.2 }}
                className="mt-4 text-[15px] leading-relaxed text-muted-foreground"
              >
                Your account request has been declined. Please contact the admin
                if you believe this is an error.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
