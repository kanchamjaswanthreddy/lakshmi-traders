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

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [open]);

  // Lock body scroll + hide tab bar when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-sheet-open", "true");
      return () => {
        document.body.style.overflow = "";
        document.body.removeAttribute("data-sheet-open");
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" style={{ isolation: "isolate" }}>
          {/* Backdrop — covers everything including tab bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Sheet — slides up from bottom, full width */}
          <motion.div
            ref={contentRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="absolute inset-x-0 bottom-0 overflow-y-auto overscroll-contain rounded-t-[24px] bg-background"
            style={{
              maxHeight: "88dvh",
              paddingBottom: "calc(env(safe-area-inset-bottom, 24px) + 24px)",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Drag handle */}
            <div className="sticky top-0 z-10 rounded-t-[24px] bg-background pt-3 pb-1">
              <div className="mx-auto h-1 w-10 rounded-full bg-muted-foreground/30" />
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
            <div className="px-5 pb-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
