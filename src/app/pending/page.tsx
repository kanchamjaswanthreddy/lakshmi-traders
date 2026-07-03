"use client";

import { Clock } from "lucide-react";

export default function PendingPage() {
  return (
    <main className="bg-mesh flex min-h-dvh items-center justify-center overflow-y-auto bg-background px-6 py-12">
      <div
        className="w-full max-w-sm"
      >
          <div className="card-glow relative overflow-hidden rounded-[20px] bg-card backdrop-blur-xl">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-copper to-transparent opacity-60" />

            <div className="px-8 py-12 text-center">
              <div
                className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary"
              >
                <Clock
                  size={36}
                  className="text-foreground"
                  strokeWidth={1.5}
                />
              </div>

              <h1
                className="large-title text-foreground"
              >
                Account Pending
              </h1>

              <p
                className="mt-4 text-[15px] leading-relaxed text-muted-foreground"
              >
                Your account is awaiting admin approval. Please check back
                later.
              </p>

              <div
                className="mt-6 rounded-2xl bg-secondary px-4 py-3"
              >
                <p className="text-[13px] text-muted-foreground">
                  You&apos;ll be able to access the app once an admin approves
                  your request.
                </p>
              </div>
            </div>
          </div>
      </div>
    </main>
  );
}
