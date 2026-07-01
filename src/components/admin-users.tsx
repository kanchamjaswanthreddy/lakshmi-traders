"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import type { UserWithProfile } from "@/app/(app)/manage/users/page";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

interface AdminUsersProps {
  initialUsers: UserWithProfile[];
}

export function AdminUsers({ initialUsers }: AdminUsersProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showRejected, setShowRejected] = useState(false);

  const pendingUsers = users.filter((u) => u.status === "pending");
  const activeUsers = users.filter((u) => u.status === "active");
  const rejectedUsers = users.filter((u) => u.status === "rejected");

  const updateStatus = async (
    userId: string,
    newStatus: "active" | "rejected"
  ) => {
    setUpdating(userId);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", userId);

    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      router.refresh();
    }
    setUpdating(null);
  };

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="px-4 pt-2 pb-8">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="mb-6 text-3xl font-bold tracking-tight text-foreground"
      >
        User Approvals
      </motion.h1>

      {/* Pending Users */}
      {pendingUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.05 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pending Approval ({pendingUsers.length})
          </h2>
          <div className="ios-group overflow-hidden">
            {pendingUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING, delay: 0.1 + index * 0.05 }}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  index < pendingUsers.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-medium text-foreground truncate">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-[13px] text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70">
                    {formatDate(user.created_at)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => updateStatus(user.id, "active")}
                    disabled={updating === user.id}
                    className="flex h-9 items-center gap-1.5 rounded-xl bg-[#30D158]/15 px-3.5 text-[14px] font-semibold text-[#30D158] transition-transform active:scale-95 disabled:opacity-50"
                  >
                    <UserCheck size={16} strokeWidth={2} />
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(user.id, "rejected")}
                    disabled={updating === user.id}
                    className="flex h-9 items-center gap-1.5 rounded-xl bg-destructive/10 px-3.5 text-[14px] font-semibold text-destructive transition-transform active:scale-95 disabled:opacity-50"
                  >
                    <UserX size={16} strokeWidth={2} />
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {pendingUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.05 }}
          className="mb-6 rounded-2xl bg-secondary px-5 py-6 text-center"
        >
          <p className="text-[15px] text-muted-foreground">
            No pending requests
          </p>
        </motion.div>
      )}

      {/* Active Users */}
      {activeUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            Active Users ({activeUsers.length})
          </h2>
          <div className="ios-group overflow-hidden">
            {activeUsers.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  index < activeUsers.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-medium text-foreground truncate">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-[13px] text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>

                <span className="shrink-0 rounded-lg bg-copper/10 px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide text-copper">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Rejected Users */}
      {rejectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.15 }}
        >
          <button
            onClick={() => setShowRejected((prev) => !prev)}
            className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground transition-transform active:scale-95"
          >
            {showRejected ? (
              <ChevronDown size={14} strokeWidth={2.5} />
            ) : (
              <ChevronRight size={14} strokeWidth={2.5} />
            )}
            Rejected ({rejectedUsers.length})
          </button>

          <AnimatePresence>
            {showRejected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={SPRING}
                className="overflow-hidden"
              >
                <div className="ios-group overflow-hidden opacity-60">
                  {rejectedUsers.map((user, index) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 px-4 py-3.5 ${
                        index < rejectedUsers.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-medium text-foreground truncate">
                          {user.full_name || user.email}
                        </p>
                        <p className="text-[13px] text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => updateStatus(user.id, "active")}
                        disabled={updating === user.id}
                        className="shrink-0 rounded-xl bg-[#30D158]/15 px-3 py-1.5 text-[13px] font-semibold text-[#30D158] transition-transform active:scale-95 disabled:opacity-50"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
