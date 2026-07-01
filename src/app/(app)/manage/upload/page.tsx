"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, FileUp, Upload } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function UploadPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
      router.replace("/");
    }
  }, [loading, profile, router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
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

  return (
    <div className="px-4 pt-2 pb-8">
      {/* Header */}
      <div className="mb-1 flex items-center gap-2">
        <Link
          href="/manage"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors active:scale-95 active:bg-secondary"
          aria-label="Back to manage"
        >
          <ArrowLeft size={22} className="text-copper" strokeWidth={2} />
        </Link>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="mb-6 text-3xl font-bold tracking-tight text-foreground"
      >
        Upload Price List
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.05 }}
        className="space-y-5"
      >
        {/* Description */}
        <div className="ios-group px-4 py-4">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Upload a PDF price list to bulk import or update products and prices.
            The system will parse the document and match entries to existing
            products or create new ones.
          </p>
        </div>

        {/* Drop zone */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`ios-group flex w-full flex-col items-center justify-center gap-4 px-6 py-12 transition-all active:scale-95 ${
            dragOver
              ? "border-copper bg-copper/5"
              : selectedFile
                ? "border-copper/50 bg-copper/5"
                : ""
          }`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
              selectedFile ? "bg-copper/15" : "bg-copper/10"
            }`}
          >
            {selectedFile ? (
              <FileUp size={32} className="text-copper" strokeWidth={1.5} />
            ) : (
              <Upload size={32} className="text-copper/60" strokeWidth={1.5} />
            )}
          </div>

          {selectedFile ? (
            <>
              <div className="text-center">
                <p className="text-[17px] font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <p className="text-[13px] text-muted-foreground">
                Tap to choose a different file
              </p>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-[17px] font-medium text-foreground">
                  Tap to select a file
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  or drag and drop a PDF here
                </p>
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.csv,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload price list file"
          />
        </button>

        {/* Coming soon notice */}
        <div className="ios-group px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-copper/10">
              <span className="text-[12px] font-bold text-copper">i</span>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-foreground">
                PDF parsing coming soon
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                The automated PDF parsing and import feature is under
                development. For now, you can manage products and prices
                manually through the Products page.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
