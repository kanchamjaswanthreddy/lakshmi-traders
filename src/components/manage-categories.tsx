"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  X,
  Check,
  Pencil,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import type { Category } from "@/lib/types";

interface ManageCategoriesProps {
  initialCategories: Category[];
}

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const SHEET_VARIANTS = {
  hidden: { y: "100%" },
  visible: { y: 0 },
};

interface EditingField {
  categoryId: string;
  field: "regular_discount_pct" | "shop_owner_discount_pct";
}

export function ManageCategories({ initialCategories }: ManageCategoriesProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState(initialCategories);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [editing, setEditing] = useState<EditingField | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newRegularDiscount, setNewRegularDiscount] = useState("");
  const [newShopOwnerDiscount, setNewShopOwnerDiscount] = useState("");

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
      router.replace("/");
    }
  }, [loading, profile, router]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editing]);

  const startEditing = useCallback(
    (categoryId: string, field: EditingField["field"], currentValue: number) => {
      setEditing({ categoryId, field });
      setEditValue(String(currentValue));
    },
    []
  );

  const cancelEditing = useCallback(() => {
    setEditing(null);
    setEditValue("");
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editing) return;

    const numValue = parseFloat(editValue);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    setSaving(true);

    const { error } = await supabase
      .from("categories")
      .update({ [editing.field]: numValue })
      .eq("id", editing.categoryId);

    setSaving(false);

    if (!error) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editing.categoryId
            ? { ...cat, [editing.field]: numValue }
            : cat
        )
      );
      setEditing(null);
      setEditValue("");
      router.refresh();
    }
  }, [editing, editValue, supabase, router]);

  const handleAddCategory = useCallback(async () => {
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    const regularPct = parseFloat(newRegularDiscount) || 0;
    const shopOwnerPct = parseFloat(newShopOwnerDiscount) || 0;

    setSaving(true);

    const { error } = await supabase.from("categories").insert({
      name: trimmedName,
      description: newDescription.trim() || null,
      regular_discount_pct: regularPct,
      shop_owner_discount_pct: shopOwnerPct,
    });

    setSaving(false);

    if (!error) {
      setShowAddSheet(false);
      setNewName("");
      setNewDescription("");
      setNewRegularDiscount("");
      setNewShopOwnerDiscount("");
      router.refresh();
    }
  }, [newName, newDescription, newRegularDiscount, newShopOwnerDiscount, supabase, router]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setSaving(true);

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", deleteTarget.id);

    setSaving(false);

    if (!error) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    }
  }, [deleteTarget, supabase, router]);

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
    <div className="bg-mesh min-h-dvh px-4 pt-2 pb-8">
      {/* Header */}
      <div className="mb-1 flex items-center gap-2">
        <Link
          href="/manage"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 active:scale-95 active:bg-secondary"
          aria-label="Back to manage"
        >
          <ArrowLeft size={22} className="text-copper" strokeWidth={2} />
        </Link>
      </div>

      <div className="mb-6 flex items-end justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="large-title text-foreground"
        >
          Categories
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
          onClick={() => setShowAddSheet(true)}
          className="card-glow flex h-11 w-11 items-center justify-center rounded-[16px] bg-copper/10 transition-transform duration-150 active:scale-95"
          aria-label="Add category"
        >
          <Plus size={22} className="text-copper" strokeWidth={2} />
        </motion.button>
      </div>

      {/* Categories list */}
      {categories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="mt-12 flex flex-col items-center justify-center text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-copper/10">
            <FolderOpen size={32} className="text-copper/60" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[17px] font-medium text-foreground">
            No categories yet
          </p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Tap the + button to add your first category
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.05 }}
          className="space-y-5"
        >
          <p className="px-1 text-[13px] font-medium text-muted-foreground">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>

          <div className="ios-group card-glow overflow-hidden rounded-[20px]">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`px-4 py-3.5 ${
                  index < categories.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-medium leading-tight text-foreground">
                      {category.name}
                    </p>
                    {category.description && (
                      <p className="mt-0.5 text-[13px] leading-tight text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setDeleteTarget(category)}
                    className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors active:scale-95 active:bg-destructive/10"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2
                      size={16}
                      className="text-destructive/70"
                      strokeWidth={1.8}
                    />
                  </button>
                </div>

                {/* Discount fields */}
                <div className="mt-2.5 flex gap-3">
                  <DiscountBadge
                    label="Regular"
                    value={category.regular_discount_pct}
                    isEditing={
                      editing?.categoryId === category.id &&
                      editing.field === "regular_discount_pct"
                    }
                    editValue={editValue}
                    onEditValueChange={setEditValue}
                    onStartEdit={() =>
                      startEditing(
                        category.id,
                        "regular_discount_pct",
                        category.regular_discount_pct
                      )
                    }
                    onSave={saveEdit}
                    onCancel={cancelEditing}
                    inputRef={
                      editing?.categoryId === category.id &&
                      editing.field === "regular_discount_pct"
                        ? editInputRef
                        : undefined
                    }
                    saving={saving}
                  />
                  <DiscountBadge
                    label="Shop Owner"
                    value={category.shop_owner_discount_pct}
                    isEditing={
                      editing?.categoryId === category.id &&
                      editing.field === "shop_owner_discount_pct"
                    }
                    editValue={editValue}
                    onEditValueChange={setEditValue}
                    onStartEdit={() =>
                      startEditing(
                        category.id,
                        "shop_owner_discount_pct",
                        category.shop_owner_discount_pct
                      )
                    }
                    onSave={saveEdit}
                    onCancel={cancelEditing}
                    inputRef={
                      editing?.categoryId === category.id &&
                      editing.field === "shop_owner_discount_pct"
                        ? editInputRef
                        : undefined
                    }
                    saving={saving}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Category Bottom Sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <>
            <motion.div
              key="add-overlay"
              variants={OVERLAY_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setShowAddSheet(false)}
            />
            <motion.div
              key="add-sheet"
              variants={SHEET_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ ...SPRING, stiffness: 400 }}
              className="fixed inset-x-0 bottom-0 z-[60] rounded-t-[28px] bg-background safe-bottom"
              style={{ maxHeight: "85dvh", backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)" }}
            >
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted-foreground/30" />

              <div className="px-5 pt-4 pb-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Add Category
                  </h2>
                  <button
                    onClick={() => setShowAddSheet(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-transform active:scale-95"
                    aria-label="Close"
                  >
                    <X size={16} className="text-muted-foreground" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="ios-group card-glow rounded-xl px-4 py-3">
                    <label className="block text-[13px] font-medium text-muted-foreground">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Paints"
                      className="mt-1 w-full border-none bg-transparent text-[17px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="ios-group card-glow rounded-xl px-4 py-3">
                    <label className="block text-[13px] font-medium text-muted-foreground">
                      Description (optional)
                    </label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Brief description"
                      className="mt-1 w-full border-none bg-transparent text-[17px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="ios-group card-glow flex-1 rounded-xl px-4 py-3">
                      <label className="block text-[13px] font-medium text-muted-foreground">
                        Regular Discount %
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        step="0.5"
                        value={newRegularDiscount}
                        onChange={(e) => setNewRegularDiscount(e.target.value)}
                        placeholder="0"
                        className="mt-1 w-full border-none bg-transparent text-[17px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none price-mono"
                      />
                    </div>

                    <div className="ios-group card-glow flex-1 rounded-xl px-4 py-3">
                      <label className="block text-[13px] font-medium text-muted-foreground">
                        Shop Owner Discount %
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        step="0.5"
                        value={newShopOwnerDiscount}
                        onChange={(e) => setNewShopOwnerDiscount(e.target.value)}
                        placeholder="0"
                        className="mt-1 w-full border-none bg-transparent text-[17px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none price-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddCategory}
                    disabled={!newName.trim() || saving}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#1D1D1F] to-[#3A3A3C] py-3.5 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
                  >
                    {saving ? "Adding..." : "Add Category"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Bottom Sheet */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              key="delete-overlay"
              variants={OVERLAY_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              key="delete-sheet"
              variants={SHEET_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ ...SPRING, stiffness: 400 }}
              className="fixed inset-x-0 bottom-0 z-[60] rounded-t-[28px] bg-background safe-bottom"
              style={{ backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)" }}
            >
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted-foreground/30" />

              <div className="px-5 pt-4 pb-6">
                <h2 className="text-xl font-bold text-foreground">
                  Delete Category
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    {deleteTarget.name}
                  </span>
                  ? Products in this category will become uncategorized.
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 rounded-2xl bg-secondary py-3.5 text-[17px] font-semibold text-foreground transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex-1 rounded-2xl bg-destructive py-3.5 text-[17px] font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    {saving ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --- Discount Badge Sub-component --- */

interface DiscountBadgeProps {
  label: string;
  value: number;
  isEditing: boolean;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  saving: boolean;
}

function DiscountBadge({
  label,
  value,
  isEditing,
  editValue,
  onEditValueChange,
  onStartEdit,
  onSave,
  onCancel,
  inputRef,
  saving,
}: DiscountBadgeProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5 rounded-xl bg-copper/10 px-3 py-1.5">
        <span className="text-[12px] font-medium text-muted-foreground">
          {label}
        </span>
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step="0.5"
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onSave}
          className="w-14 border-none bg-transparent text-center text-[15px] font-bold text-copper focus:outline-none price-mono"
          disabled={saving}
        />
        <span className="text-[13px] font-bold text-copper">%</span>
        <button
          onClick={onSave}
          className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-copper/20 active:scale-95"
          aria-label="Save"
        >
          <Check size={12} className="text-copper" strokeWidth={3} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onStartEdit}
      className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 transition-colors active:scale-95 active:bg-copper/10"
    >
      <span className="text-[12px] font-medium text-muted-foreground">
        {label}
      </span>
      <span className="price-mono text-[15px] font-bold text-foreground">
        {value}%
      </span>
      <Pencil size={11} className="text-muted-foreground/60" strokeWidth={2} />
    </button>
  );
}
