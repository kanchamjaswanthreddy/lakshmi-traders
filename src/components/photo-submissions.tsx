"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Send, Image as ImageIcon, Clock, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";

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

interface PhotoSubmissionsProps {
  initialSubmissions: PhotoSubmission[];
  isAdmin: boolean;
}

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const STORAGE_BUCKET = "price-photos";
const SUPABASE_URL = "https://ptrukbtgywzilksgwuco.supabase.co";

function getStatusBadge(status: PhotoSubmission["status"]) {
  switch (status) {
    case "pending":
      return {
        icon: Clock,
        label: "Pending",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      };
    case "reviewed":
      return {
        icon: CheckCircle2,
        label: "Reviewed",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      };
    case "rejected":
      return {
        icon: XCircle,
        label: "Rejected",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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

export function PhotoSubmissions({ initialSubmissions, isAdmin }: PhotoSubmissionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please select a JPEG, PNG, WebP, or HEIC image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be under 10MB.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setMessage("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const timestamp = Date.now();
      const ext = selectedFile.name.split(".").pop() ?? "jpg";
      const filePath = `${user.id}/${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;

      const { data: newSubmission, error: insertError } = await supabase
        .from("photo_submissions")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          message: message.trim() || null,
          status: "pending",
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (newSubmission) {
        setSubmissions((prev) => [newSubmission as PhotoSubmission, ...prev]);
      }

      clearSelection();
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [selectedFile, user, message, clearSelection, router]);

  return (
    <div className="px-4 pt-2 pb-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="mb-5 text-[34px] font-bold tracking-tight text-foreground"
      >
        Price Updates
      </motion.h1>

      {/* Camera / Upload Button */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.03 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Take photo or select image"
        />

        {!selectedFile ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-copper px-6 py-4 text-[17px] font-semibold text-white shadow-lg transition-all active:scale-95 hover:opacity-90"
          >
            <Camera size={22} strokeWidth={2} />
            Take Photo or Upload
          </button>
        ) : (
          /* Preview + Message + Submit */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING}
            className="ios-group card-glow overflow-hidden"
          >
            {/* Preview image */}
            <div className="relative">
              <img
                src={previewUrl!}
                alt="Selected photo preview"
                className="h-56 w-full object-cover"
              />
              <button
                onClick={clearSelection}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-90"
                aria-label="Remove photo"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Message input */}
            <div className="p-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note (optional)... e.g., 'Competitor price list from XYZ store'"
                rows={2}
                className="w-full resize-none rounded-xl bg-secondary px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/30"
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={SPRING}
                  className="mt-2 text-[13px] font-medium text-destructive"
                >
                  {error}
                </motion.p>
              )}

              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-copper px-6 py-3 text-[15px] font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {uploading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={18} strokeWidth={2} />
                )}
                {uploading ? "Uploading..." : "Submit Photo"}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Error (outside preview context) */}
      {error && !selectedFile && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="mt-3 text-center text-[13px] font-medium text-destructive"
        >
          {error}
        </motion.p>
      )}

      {/* Submissions List */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.08 }}
        className="mt-6"
      >
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
          Your Submissions
        </h2>

        <AnimatePresence mode="wait">
          {submissions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRING}
              className="mt-12 flex flex-col items-center justify-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-copper/10">
                <Camera size={32} className="text-copper/60" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-[17px] font-medium text-foreground">
                No submissions yet
              </p>
              <p className="mt-1 text-[15px] text-muted-foreground">
                Take a photo of a price list to get started
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {submissions.map((submission, index) => {
                const badge = getStatusBadge(submission.status);
                const StatusIcon = badge.icon;

                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: index * 0.04 }}
                    className="ios-group card-glow overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <button
                      onClick={() => setLightboxUrl(submission.image_url)}
                      className="relative w-full transition-transform active:scale-[0.98]"
                      aria-label="View full size photo"
                    >
                      <img
                        src={submission.image_url}
                        alt="Submitted price photo"
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/10">
                        <ImageIcon size={24} className="text-white/0 transition-colors hover:text-white/80" />
                      </div>
                    </button>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${badge.className}`}>
                          <StatusIcon size={13} strokeWidth={2.5} />
                          {badge.label}
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          {formatDate(submission.created_at)}
                        </span>
                      </div>

                      {submission.message && (
                        <p className="mt-2.5 text-[14px] leading-relaxed text-foreground">
                          {submission.message}
                        </p>
                      )}

                      {submission.admin_notes && (
                        <div className="mt-2.5 rounded-lg bg-secondary px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Admin Notes
                          </p>
                          <p className="mt-0.5 text-[13px] text-foreground">
                            {submission.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
