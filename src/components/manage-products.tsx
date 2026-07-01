"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import type { Category, Product } from "@/lib/types";

interface ManageProductsProps {
  initialProducts: Product[];
  categories: Category[];
}

interface GroupedProducts {
  categoryName: string;
  categoryId: string;
  items: Product[];
}

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const PAGE_SIZE = 50;

const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const SHEET_VARIANTS = {
  hidden: { y: "100%" },
  visible: { y: 0 },
};

function groupProducts(
  products: Product[],
  categories: Category[],
  search: string,
  categoryFilter: string
): GroupedProducts[] {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const searchLower = search.toLowerCase().trim();

  const filtered = products.filter((p) => {
    const matchesSearch =
      !searchLower || p.name.toLowerCase().includes(searchLower);
    const matchesCategory =
      categoryFilter === "all" || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const groups = new Map<string, GroupedProducts>();

  for (const product of filtered) {
    const catId = product.category_id ?? "__uncategorized";
    const cat = product.category_id
      ? categoryMap.get(product.category_id) ?? null
      : null;
    const catName = cat?.name ?? "Uncategorized";

    if (!groups.has(catId)) {
      groups.set(catId, {
        categoryName: catName,
        categoryId: catId,
        items: [],
      });
    }

    groups.get(catId)!.items.push(product);
  }

  return Array.from(groups.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName)
  );
}

function formatPrice(value: number): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function ManageProducts({
  initialProducts,
  categories,
}: ManageProductsProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newMasterPrice, setNewMasterPrice] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
      router.replace("/");
    }
  }, [loading, profile, router]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (editingProductId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingProductId]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, categoryFilter]);

  const grouped = useMemo(
    () => groupProducts(products, categories, search, categoryFilter),
    [products, categories, search, categoryFilter]
  );

  const totalFiltered = useMemo(
    () => grouped.reduce((sum, g) => sum + g.items.length, 0),
    [grouped]
  );

  // Flatten and slice for pagination
  const { visibleGroups, hasMore } = useMemo(() => {
    let count = 0;
    const result: GroupedProducts[] = [];
    let moreAvailable = false;

    for (const group of grouped) {
      if (count >= visibleCount) {
        moreAvailable = true;
        break;
      }

      const remaining = visibleCount - count;
      if (group.items.length <= remaining) {
        result.push(group);
        count += group.items.length;
      } else {
        result.push({
          ...group,
          items: group.items.slice(0, remaining),
        });
        count += remaining;
        moreAvailable = true;
      }
    }

    return { visibleGroups: result, hasMore: moreAvailable };
  }, [grouped, visibleCount]);

  const startEditPrice = useCallback(
    (productId: string, currentPrice: number) => {
      setEditingProductId(productId);
      setEditPriceValue(String(currentPrice));
    },
    []
  );

  const cancelEditPrice = useCallback(() => {
    setEditingProductId(null);
    setEditPriceValue("");
  }, []);

  const savePrice = useCallback(async () => {
    if (!editingProductId) return;

    const numValue = parseFloat(editPriceValue);
    if (isNaN(numValue) || numValue < 0) return;

    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({ master_price: numValue })
      .eq("id", editingProductId);

    setSaving(false);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProductId ? { ...p, master_price: numValue } : p
        )
      );
      setEditingProductId(null);
      setEditPriceValue("");
      router.refresh();
    }
  }, [editingProductId, editPriceValue, supabase, router]);

  const handleAddProduct = useCallback(async () => {
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    const masterPrice = parseFloat(newMasterPrice) || 0;

    setSaving(true);

    const { error } = await supabase.from("products").insert({
      name: trimmedName,
      unit: newUnit.trim() || null,
      master_price: masterPrice,
      category_id: newCategoryId || null,
    });

    setSaving(false);

    if (!error) {
      setShowAddSheet(false);
      setNewName("");
      setNewUnit("");
      setNewMasterPrice("");
      setNewCategoryId("");
      router.refresh();
    }
  }, [newName, newUnit, newMasterPrice, newCategoryId, supabase, router]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setSaving(true);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteTarget.id);

    setSaving(false);

    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
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

      <div className="mb-5 flex items-end justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="large-title text-foreground"
        >
          Products
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
          onClick={() => setShowAddSheet(true)}
          className="card-glow flex h-11 w-11 items-center justify-center rounded-[16px] bg-copper/10 transition-transform duration-150 active:scale-95"
          aria-label="Add product"
        >
          <Plus size={22} className="text-copper" strokeWidth={2} />
        </motion.button>
      </div>

      {/* Search and filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.05 }}
        className="mb-5 space-y-3"
      >
        {/* Search bar */}
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-2xl bg-secondary py-3.5 pl-11 pr-4 text-[16px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-copper/30"
            style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30 active:scale-95"
              aria-label="Clear search"
            >
              <X size={12} className="text-background" strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="ios-group card-glow relative flex items-center gap-3 rounded-[20px] px-5 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-copper/10">
            <Package size={22} className="text-copper" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[13px] font-medium text-muted-foreground">
              Category Filter
            </span>
            <div className="relative mt-0.5">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none border-none bg-transparent pr-8 text-[17px] font-medium text-foreground focus:outline-none"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product count */}
      <p className="mb-3 px-1 text-[13px] font-medium text-muted-foreground">
        {totalFiltered} product{totalFiltered !== 1 ? "s" : ""}
        {search && " matching"}
      </p>

      {/* Product list */}
      {totalFiltered === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="mt-12 flex flex-col items-center justify-center text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-copper/10">
            <Package size={32} className="text-copper/60" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[17px] font-medium text-foreground">
            {search ? "No products found" : "No products yet"}
          </p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {search
              ? "Try a different search term"
              : "Tap the + button to add your first product"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {visibleGroups.map((group, groupIndex) => (
            <motion.section
              key={group.categoryId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...SPRING,
                delay: 0.08 + groupIndex * 0.04,
              }}
              aria-labelledby={`prod-cat-${groupIndex}`}
            >
              <h2
                id={`prod-cat-${groupIndex}`}
                className="mb-1.5 flex items-center gap-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-copper/50" />
                {group.categoryName}
              </h2>

              <div className="ios-group card-glow overflow-hidden rounded-[20px]">
                {group.items.map((product, itemIndex) => (
                  <div
                    key={product.id}
                    className={`px-4 py-3 transition-transform duration-150 active:scale-[0.98] ${
                      itemIndex < group.items.length - 1
                        ? "border-b border-border/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium leading-snug text-foreground">
                          {product.name}
                        </p>
                        {product.unit && (
                          <p className="mt-0.5 text-[13px] text-muted-foreground">
                            {product.unit}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Price display / edit */}
                        {editingProductId === product.id ? (
                          <div className="flex items-center gap-1 rounded-xl bg-copper/10 px-2.5 py-1">
                            <span className="text-[13px] font-bold text-copper">
                              &#8377;
                            </span>
                            <input
                              ref={
                                editingProductId === product.id
                                  ? editInputRef
                                  : undefined
                              }
                              type="number"
                              inputMode="decimal"
                              min={0}
                              step="0.01"
                              value={editPriceValue}
                              onChange={(e) =>
                                setEditPriceValue(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") savePrice();
                                else if (e.key === "Escape")
                                  cancelEditPrice();
                              }}
                              onBlur={savePrice}
                              className="w-20 border-none bg-transparent text-right text-[15px] font-bold text-copper focus:outline-none price-mono"
                              disabled={saving}
                            />
                            <button
                              onClick={savePrice}
                              className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-copper/20 active:scale-95"
                              aria-label="Save price"
                            >
                              <Check
                                size={12}
                                className="text-copper"
                                strokeWidth={3}
                              />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              startEditPrice(
                                product.id,
                                product.master_price
                              )
                            }
                            className="flex items-center gap-1 rounded-xl bg-secondary px-2.5 py-1 transition-colors active:scale-95 active:bg-copper/10"
                          >
                            <span className="price-mono text-[15px] font-bold text-foreground">
                              &#8377;{formatPrice(product.master_price)}
                            </span>
                            <Pencil
                              size={11}
                              className="text-muted-foreground/60"
                              strokeWidth={2}
                            />
                          </button>
                        )}

                        {/* Delete button */}
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors active:scale-95 active:bg-destructive/10"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2
                            size={16}
                            className="text-destructive/70"
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}

          {/* Load More */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="flex justify-center pt-2"
            >
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="card-glow rounded-2xl bg-secondary px-6 py-3 text-[15px] font-semibold text-foreground transition-transform duration-150 active:scale-95"
              >
                Load More
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Add Product Bottom Sheet */}
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
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setShowAddSheet(false)}
            />
            <motion.div
              key="add-sheet"
              variants={SHEET_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ ...SPRING, stiffness: 400 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-background safe-bottom"
              style={{ maxHeight: "85dvh", backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)" }}
            >
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted-foreground/30" />

              <div className="px-5 pt-4 pb-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Add Product
                  </h2>
                  <button
                    onClick={() => setShowAddSheet(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-transform active:scale-95"
                    aria-label="Close"
                  >
                    <X
                      size={16}
                      className="text-muted-foreground"
                      strokeWidth={2.5}
                    />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="ios-group card-glow rounded-xl px-4 py-3">
                    <label className="block text-[13px] font-medium text-muted-foreground">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Asian Paints Tractor Emulsion"
                      className="mt-1 w-full border-none bg-transparent text-[17px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="ios-group card-glow flex-1 rounded-xl px-4 py-3">
                      <label className="block text-[13px] font-medium text-muted-foreground">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        placeholder="e.g. 20 Ltr"
                        className="mt-1 w-full border-none bg-transparent text-[17px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                      />
                    </div>

                    <div className="ios-group card-glow flex-1 rounded-xl px-4 py-3">
                      <label className="block text-[13px] font-medium text-muted-foreground">
                        Master Price
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        value={newMasterPrice}
                        onChange={(e) => setNewMasterPrice(e.target.value)}
                        placeholder="0.00"
                        className="mt-1 w-full border-none bg-transparent text-[17px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none price-mono"
                      />
                    </div>
                  </div>

                  <div className="ios-group card-glow relative rounded-xl px-4 py-3">
                    <label className="block text-[13px] font-medium text-muted-foreground">
                      Category
                    </label>
                    <div className="relative mt-1">
                      <select
                        value={newCategoryId}
                        onChange={(e) => setNewCategoryId(e.target.value)}
                        className="w-full appearance-none border-none bg-transparent pr-8 text-[17px] font-medium text-foreground focus:outline-none"
                      >
                        <option value="">No category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddProduct}
                    disabled={!newName.trim() || saving}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#1D1D1F] to-[#3A3A3C] py-3.5 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
                  >
                    {saving ? "Adding..." : "Add Product"}
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
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              key="delete-sheet"
              variants={SHEET_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ ...SPRING, stiffness: 400 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-background safe-bottom"
              style={{ backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)" }}
            >
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted-foreground/30" />

              <div className="px-5 pt-4 pb-6">
                <h2 className="text-xl font-bold text-foreground">
                  Delete Product
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    {deleteTarget.name}
                  </span>
                  ? This action cannot be undone.
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
