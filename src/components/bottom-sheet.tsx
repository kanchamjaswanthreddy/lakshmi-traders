"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * A bottom sheet that works correctly with iOS virtual keyboard.
 *
 * Instead of `fixed bottom-0` (which breaks when keyboard opens on iOS),
 * this uses a full-screen scrollable overlay. The sheet content is at the
 * bottom, and when the keyboard pushes it up, the user can scroll naturally.
 */
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll the sheet into view when opened
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Sheet container - full height, scrollable, content at bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="absolute inset-x-0 bottom-0 top-[8vh] flex flex-col"
          >
            {/* Tap-to-close spacer */}
            <div className="flex-shrink-0 min-h-0 flex-1" onClick={onClose} />

            {/* Actual sheet */}
            <div
              ref={contentRef}
              className="relative flex-shrink-0 overflow-y-auto overscroll-contain rounded-t-[24px] bg-background"
              style={{
                maxHeight: "92vh",
                WebkitOverflowScrolling: "touch",
                backdropFilter: "blur(40px) saturate(200%)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
              }}
            >
              {/* Drag handle */}
              <div className="sticky top-0 z-10 bg-background/80 pt-2 pb-1 backdrop-blur-sm rounded-t-[24px]">
                <div className="mx-auto h-1.5 w-10 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-3">
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-transform active:scale-95"
                  aria-label="Close"
                >
                  <X size={16} className="text-muted-foreground" strokeWidth={2.5} />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pb-8" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 20px) + 32px)" }}>
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
