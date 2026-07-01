"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  Clock,
  X,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

interface PhotoSubmission {
  id: string;
  user_id: string;
  image_url: string;
  message: string | null;
  status: "pending" | "reviewed" | "rejected";
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

interface AdminPhotoReviewProps {
  initialSubmissions: PhotoSubmission[];
}

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

function getStatusBadge(status: PhotoSubmission["status"]) {
  switch (status) {
    case "pending":
      return {
        icon: Clock,
        label: "Pending",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      };
    case "reviewed":
      return {
        icon: CheckCircle2,
        label: "Reviewed",
        className:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      };
    case "rejected":
      return {
        icon: XCircle,
        label: "Rejected",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminPhotoReview({
  initialSubmissions,
}: AdminPhotoReviewProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
      router.replace("/");
    }
  }, [loading, profile, router]);

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const processedSubmissions = submissions.filter(
    (s) => s.status !== "pending"
  );

  const handleUpdateStatus = useCallback(
    async (id: string, status: "reviewed" | "rejected") => {
      setUpdatingId(id);

      try {
        const supabase = createClient();
        const notes = adminNotes[id]?.trim() || null;

        const { error } = await supabase
          .from("photo_submissions")
          .update({
            status,
            admin_notes: notes,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) {
          throw new Error(error.message);
        }

        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status,
                  admin_notes: notes,
                  reviewed_at: new Date().toISOString(),
                }
              : s
          )
        );

        router.refresh();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to update status.";
        alert(msg);
      } finally {
        setUpdatingId(null);
      }
    },
    [adminNotes, router]
  );

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

  function renderSubmissionCard(
    submission: PhotoSubmission,
    index: number,
    showActions: boolean
  ) {
    const badge = getStatusBadge(submission.status);
    const StatusIcon = badge.icon;
    const isUpdating = updatingId === submission.id;

    return (
      <motion.div
        key={submission.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: index * 0.04 }}
        className="ios-group card-glow overflow-hidden"
      >
        {/* Full-width photo */}
        <button
          onClick={() => setLightboxUrl(submission.image_url)}
          className="relative w-full transition-transform active:scale-[0.98]"
          aria-label="View full size photo"
        >
          <img
            src={submission.image_url}
            alt="Submitted price photo"
            className="w-full object-cover"
            style={{ maxHeight: "300px" }}
            loading="lazy"
          />
        </button>

        {/* Details */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${badge.className}`}
            >
              <StatusIcon size={13} strokeWidth={2.5} />
              {badge.label}
            </span>
            <span className="text-[12px] text-muted-foreground">
              {formatDate(submission.created_at)}
            </span>
          </div>

          {/* Submitter info */}
          <p className="mt-2 text-[12px] text-muted-foreground">
            User: {submission.user_id.slice(0, 8)}...
          </p>

          {submission.message && (
            <p className="mt-2 text-[14px] leading-relaxed text-foreground">
              {submission.message}
            </p>
          )}

          {/* Existing admin notes (for processed items) */}
          {submission.admin_notes && !showActions && (
            <div className="mt-2.5 rounded-lg bg-secondary px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Admin Notes
              </p>
              <p className="mt-0.5 text-[13px] text-foreground">
                {submission.admin_notes}
              </p>
            </div>
          )}

          {submission.reviewed_at && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Reviewed: {formatDate(submission.reviewed_at)}
            </p>
          )}

          {/* Action buttons for pending items */}
          {showActions && (
            <div className="mt-3 space-y-3">
              <textarea
                value={adminNotes[submission.id] ?? ""}
                onChange={(e) =>
                  setAdminNotes((prev) => ({
                    ...prev,
                    [submission.id]: e.target.value,
                  }))
                }
                placeholder="Admin notes (optional)"
                rows={2}
                className="w-full resize-none rounded-xl bg-secondary px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/30"
              />

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(submission.id, "reviewed")
                  }
                  disabled={isUpdating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[14px] font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                  )}
                  Mark Reviewed
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(submission.id, "rejected")
                  }
                  disabled={isUpdating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-[14px] font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <XCircle size={16} strokeWidth={2.5} />
                  )}
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-4 pt-2 pb-8">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={SPRING}
      >
        <Link
          href="/manage"
          className="mb-2 inline-flex items-center gap-1 text-[15px] font-medium text-copper transition-transform active:scale-95"
        >
          <ChevronLeft size={18} strokeWidth={2} />
          Manage
        </Link>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.02 }}
        className="mb-5 text-[34px] font-bold tracking-tight text-foreground"
      >
        Review Photos
      </motion.h1>

      {/* Pending Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.05 }}
      >
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
          Pending ({pendingSubmissions.length})
        </h2>

        {pendingSubmissions.length === 0 ? (
          <div className="mb-6 flex flex-col items-center justify-center rounded-2xl bg-secondary/50 py-8 text-center">
            <CheckCircle2
              size={32}
              className="text-emerald-500/60"
              strokeWidth={1.5}
            />
            <p className="mt-3 text-[15px] font-medium text-foreground">
              All caught up
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              No pending photos to review
            </p>
          </div>
        ) : (
          <div className="mb-6 space-y-3">
            {pendingSubmissions.map((s, i) =>
              renderSubmissionCard(s, i, true)
            )}
          </div>
        )}
      </motion.div>

      {/* Processed Section */}
      {processedSubmissions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.1 }}
        >
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            Processed ({processedSubmissions.length})
          </h2>

          <div className="space-y-3">
            {processedSubmissions.map((s, i) =>
              renderSubmissionCard(s, i, false)
            )}
          </div>
        </motion.div>
      )}

      {/* Empty state when no submissions at all */}
      {submissions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="mt-12 flex flex-col items-center justify-center text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-copper/10">
            <Camera
              size={32}
              className="text-copper/60"
              strokeWidth={1.5}
            />
          </div>
          <p className="mt-4 text-[17px] font-medium text-foreground">
            No photos submitted
          </p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Staff members can submit photos from the Photos tab
          </p>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={SPRING}
              className="relative max-h-[85vh] max-w-[92vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxUrl}
                alt="Full size photo"
                className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain"
              />
              <button
                onClick={() => setLightboxUrl(null)}
                className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform active:scale-90 dark:bg-zinc-800 dark:text-white"
                aria-label="Close lightbox"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
