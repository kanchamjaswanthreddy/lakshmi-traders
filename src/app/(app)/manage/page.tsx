"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, Package, Upload, Camera, ChevronRight, Users, Layers } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";

interface ManageLink {
  href: string;
  icon: typeof FolderOpen;
  title: string;
  description: string;
}

const MANAGE_LINKS: ManageLink[] = [
  {
    href: "/manage/categories",
    icon: FolderOpen,
    title: "Categories",
    description: "Manage categories and discount percentages",
  },
  {
    href: "/manage/subcategories",
    icon: Layers,
    title: "Subcategories",
    description: "Manage subcategories under each category",
  },
  {
    href: "/manage/products",
    icon: Package,
    title: "Products",
    description: "Add, edit, or remove products and prices",
  },
  {
    href: "/manage/upload",
    icon: Upload,
    title: "Upload Price List",
    description: "Bulk import products from a PDF price list",
  },
  {
    href: "/manage/photos",
    icon: Camera,
    title: "Review Photos",
    description: "Review price photos submitted by staff",
  },
  {
    href: "/manage/users",
    icon: Users,
    title: "User Approvals",
    description: "Approve or reject new user access requests",
  },
];

export default function ManagePage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [pendingPhotoCount, setPendingPhotoCount] = useState<number>(0);
  const [pendingUserCount, setPendingUserCount] = useState<number>(0);

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
      router.replace("/");
    }
  }, [loading, profile, router]);

  useEffect(() => {
    async function fetchPendingCounts() {
      const supabase = createClient();
      const [photoResult, userResult] = await Promise.all([
        supabase
          .from("photo_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);
      setPendingPhotoCount(photoResult.count ?? 0);
      setPendingUserCount(userResult.count ?? 0);
    }
    if (profile?.role === "admin") {
      fetchPendingCounts();
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-copper border-t-transparent" />
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return null;
  }

  return (
    <div className="px-4 pt-2 pb-8">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="mb-6 text-3xl font-bold tracking-tight text-foreground"
      >
        Manage
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.05 }}
        className="ios-group overflow-hidden"
      >
        {MANAGE_LINKS.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-4 px-4 py-3.5 transition-colors active:scale-95 active:bg-secondary ${
              index < MANAGE_LINKS.length - 1
                ? "border-b border-border"
                : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-copper/10">
              <link.icon size={20} className="text-copper" strokeWidth={1.8} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[17px] font-medium leading-tight text-foreground">
                  {link.title}
                </p>
                {link.href === "/manage/photos" && pendingPhotoCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1.5 text-[11px] font-bold text-white">
                    {pendingPhotoCount}
                  </span>
                )}
                {link.href === "/manage/users" && pendingUserCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1.5 text-[11px] font-bold text-white">
                    {pendingUserCount}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[13px] leading-tight text-muted-foreground">
                {link.description}
              </p>
            </div>

            <ChevronRight
              size={18}
              className="shrink-0 text-muted-foreground/50"
              strokeWidth={2}
            />
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
