"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

const TAB_SPRING = { type: "spring" as const, stiffness: 400, damping: 30 };

export function TabBar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const visibleTabs = TABS.filter(
    (tab) => !tab.adminOnly || profile?.role === "admin"
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 no-print px-4 pb-2 safe-bottom pwa-tab-bottom">
      <div
        className="mx-auto max-w-lg overflow-hidden rounded-[22px]"
        style={{
          background: "var(--surface-elevated)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderTop: "0.5px solid rgba(255,255,255,0.2)",
          border: "0.5px solid var(--border)",
          boxShadow: "0 -2px 20px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {visibleTabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 transition-transform duration-150 active:scale-95"
              >
                {/* Active pill background */}
                {isActive && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1D1D1F]/15 to-[#3A3A3C]/15"
                    transition={TAB_SPRING}
                    style={{
                      boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.2)",
                    }}
                  />
                )}

                <motion.div
                  animate={isActive ? { scale: 1 } : { scale: 0.92 }}
                  transition={TAB_SPRING}
                >
                  <tab.icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    className={
                      isActive ? "text-copper" : "text-muted-foreground opacity-60"
                    }
                  />
                </motion.div>

                <span
                  className={`relative text-[10px] font-semibold ${
                    isActive ? "text-copper" : "text-muted-foreground opacity-60"
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
