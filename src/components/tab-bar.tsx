"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Calculator, Settings } from "lucide-react";
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
  { href: "/manage", label: "Manage", icon: Settings, adminOnly: true },
];

export function TabBar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const visibleTabs = TABS.filter(
    (tab) => !tab.adminOnly || profile?.role === "admin"
  );

  return (
    <nav className="tab-bar fixed inset-x-0 bottom-0 z-50 safe-bottom no-print">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pt-2">
        {visibleTabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-1 transition-transform active:scale-95"
            >
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute -top-1 h-0.5 w-8 rounded-full bg-copper"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <tab.icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.6}
                className={
                  isActive ? "text-copper" : "text-muted-foreground"
                }
              />

              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-copper" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
