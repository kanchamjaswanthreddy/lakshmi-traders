"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
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
  const router = useRouter();
  const { profile } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastHref = useRef<string | null>(null);

  const visibleTabs = TABS.filter(
    (tab) => !tab.adminOnly || profile?.role === "admin"
  );

  const getTabAtX = (clientX: number): Tab | null => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    if (x < 0 || x > rect.width) return null;
    const index = Math.floor((x / rect.width) * visibleTabs.length);
    return visibleTabs[Math.max(0, Math.min(index, visibleTabs.length - 1))] ?? null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastHref.current = null;
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const tab = getTabAtX(e.clientX);
    if (!tab || tab.href === lastHref.current) return;
    lastHref.current = tab.href;
    router.push(tab.href);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    lastHref.current = null;
  };

  return (
    <nav
      className="no-print fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 10px)",
      }}
    >
      <div
        ref={containerRef}
        className="pointer-events-auto flex items-center gap-1 px-3 py-2 mx-4 select-none"
        style={{
          background: "var(--surface-elevated)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderRadius: "9999px",
          border: "0.5px solid var(--border)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
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
              draggable={false}
              className="relative flex w-20 flex-col items-center gap-0.5 py-2 transition-transform duration-150 active:scale-90"
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full liquid-glass-pill"
                />
              )}
              <tab.icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.5}
                className={`relative ${isActive ? "text-foreground" : "text-muted-foreground/50"}`}
              />
              <span
                className={`relative text-[10px] font-semibold ${
                  isActive ? "text-foreground" : "text-muted-foreground/50"
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
