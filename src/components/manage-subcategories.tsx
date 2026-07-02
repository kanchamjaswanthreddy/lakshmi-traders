"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

interface SubcategoryWithCategory {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
  category: { id: string; name: string } | null;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ManageSubcategoriesProps {
  initialSubcategories: SubcategoryWithCategory[];
  categories: CategoryOption[];
}

export function ManageSubcategories({
  initialSubcategories,
  categories,
}: ManageSubcategoriesProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [subcategories, setSubcategories] = useState(initialSubcategories);
  const [showSheet, setShowSheet] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Group subcategories by parent category
  const grouped = subcategories.reduce<
    Record<string, { categoryName: string; items: SubcategoryWithCategory[] }>
  >((acc, sub) => {
    const catName = sub.category?.name ?? "Uncategorized";
    const catId = sub.category_id;
    if (!acc[catId]) {
      acc[catId] = { categoryName: catName, items: [] };
    }
    acc[catId].items.push(sub);
    return acc;
  }, {});

  const handleAdd = async () => {
    if (!newName.trim() || !selectedCategoryId) return;
    setSubmitting(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("subcategories")
      .insert({ name: newName.trim(), category_id: selectedCategoryId })
      .select("*, category:categories(id, name)")
      .single();

    if (!error && data) {
      setSubcategories((prev) => [...prev, data]);
      setNewName("");
      setShowSheet(false);
      router.refresh();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (!error) {
      setSubcategories((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    }
    setDeleting(null);
    setConfirmDelete(null);
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
      <div className="mb-6 flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="text-3xl font-bold tracking-tight text-foreground"
        >
          Subcategories
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING, delay: 0.1 }}
          onClick={() => setShowSheet(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background transition-transform active:scale-95"
        >
          <Plus size={20} strokeWidth={2} />
        </motion.button>
      </div>

      {/* Grouped list */}
      {Object.entries(grouped).length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="rounded-2xl bg-secondary px-5 py-6 text-center"
        >
          <p className="text-[15px] text-muted-foreground">
            No subcategories yet. Tap + to add one.
          </p>
        </motion.div>
      )}

      {Object.entries(grouped).map(([catId, group], groupIndex) => (
        <motion.div
          key={catId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.05 + groupIndex * 0.05 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.categoryName}
          </h2>
          <div className="ios-group card-glow overflow-hidden">
            {group.items.map((sub, index) => (
              <div
                key={sub.id}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  index < group.items.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <p className="flex-1 text-[16px] font-medium text-foreground truncate">
                  {sub.name}
                </p>

                {confirmDelete === sub.id ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deleting === sub.id}
                      className="rounded-lg bg-destructive px-3 py-1.5 text-[13px] font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {deleting === sub.id ? "..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="rounded-lg bg-secondary px-3 py-1.5 text-[13px] font-medium text-foreground transition-transform active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(sub.id)}
                    className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors active:scale-95 active:bg-destructive/10 active:text-destructive"
                  >
                    <Trash2 size={16} strokeWidth={1.8} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Bottom Sheet */}
      <AnimatePresence>
        {showSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setShowSheet(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-[60] rounded-t-[20px] bg-card backdrop-blur-xl safe-bottom"
              style={{
                boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <div className="px-6 pt-4 pb-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-foreground">
                    Add Subcategory
                  </h3>
                  <button
                    onClick={() => setShowSheet(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-transform active:scale-95"
                  >
                    <X size={16} strokeWidth={2.5} className="text-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="subcatName"
                      className="mb-1.5 block text-[13px] font-medium text-muted-foreground"
                    >
                      Name
                    </label>
                    <input
                      id="subcatName"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/40"
                      style={{
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
                      }}
                      placeholder="Subcategory name"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="parentCategory"
                      className="mb-1.5 block text-[13px] font-medium text-muted-foreground"
                    >
                      Parent Category
                    </label>
                    <select
                      id="parentCategory"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full appearance-none rounded-2xl bg-secondary px-4 py-3.5 text-[16px] text-foreground focus:outline-none focus:ring-2 focus:ring-copper/40"
                      style={{
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={submitting || !newName.trim()}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#1D1D1F] to-[#3A3A3C] py-3.5 text-[17px] font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? "Adding..." : "Add Subcategory"}
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
