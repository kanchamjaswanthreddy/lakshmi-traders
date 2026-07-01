"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Calculator, Camera, Settings } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

interface Tab {
  href: string;
  label: string;
  icon: typeof Package;
  adminOnly?: boolean;
}

const TABS: Tab[] = [
  { href: "/", label: "Products", icon: Package },
  { href: "/quote", label: "Quote", icon: Calculator },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/manage", label: "Manage", icon: Settings, adminOnly: true },
];

export function TabBar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const visibleTabs = TABS.filter(
    (tab) => !tab.adminOnly || profile?.role === "admin"
  );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 no-print"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className="border-t border-border/40"
        style={{
          background: "var(--surface-elevated)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
        }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
          {visibleTabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                prefetch={true}
                className="flex flex-1 flex-col items-center gap-0.5 py-1 transition-transform duration-100 active:scale-90"
              >
                <tab.icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.5}
                  className={
                    isActive ? "text-foreground" : "text-muted-foreground/50"
                  }
                />
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
