"use client";

import { XCircle } from "lucide-react";

export default function RejectedPage() {
  return (
    <main className="bg-mesh flex min-h-dvh items-center justify-center overflow-y-auto bg-background px-6 py-12">
      <div
        className="w-full max-w-sm"
      >
          <div className="card-glow relative overflow-hidden rounded-[20px] bg-card backdrop-blur-xl">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-destructive to-transparent opacity-60" />

            <div className="px-8 py-12 text-center">
              <div
                className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-destructive/10"
              >
                <XCircle
                  size={36}
                  className="text-destructive"
                  strokeWidth={1.5}
                />
              </div>

              <h1
                className="large-title text-foreground"
              >
                Access Denied
              </h1>

              <p
                className="mt-4 text-[15px] leading-relaxed text-muted-foreground"
              >
                Your account request has been declined. Please contact the admin
                if you believe this is an error.
              </p>
            </div>
          </div>
      </div>
    </main>
  );
}
