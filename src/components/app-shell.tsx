"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { TabBar } from "@/components/tab-bar";

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-copper border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Top fade — covers status bar area and blends content on scroll */}
      <div
        className="no-print pointer-events-none fixed inset-x-0 top-0 z-40"
        style={{
          height: "calc(env(safe-area-inset-top, 0px) + 48px)",
          background: "linear-gradient(to bottom, var(--background) calc(env(safe-area-inset-top, 0px) + 8px), transparent 100%)",
        }}
      />
      <main className="flex-1 overflow-x-hidden pb-36 pwa-main-pad">{children}</main>
      {/* Bottom fade — blends scrolling content into background before the navbar */}
      <div
        className="no-print pointer-events-none fixed bottom-0 inset-x-0 z-40"
        style={{
          height: "100px",
          background: "linear-gradient(to top, var(--background) 30%, transparent 100%)",
        }}
      />
      <TabBar />
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </AuthProvider>
  );
}
