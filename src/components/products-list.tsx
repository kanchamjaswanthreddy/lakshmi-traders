"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Package, Printer, ChevronRight, ArrowLeft, Layers, X } from "lucide-react";
import type { Category, Product, Subcategory } from "@/lib/types";
import { computeRegularPrice, computeShopOwnerPrice } from "@/lib/types";

interface ProductsListProps {
  categories: Category[];
  products: Product[];
  subcategories: Subcategory[];
}

type View =
  | { type: "home" }
  | { type: "category"; categoryId: string }
  | { type: "subcategory"; subcategoryId: string; categoryId: string }
  | { type: "search" };

function formatPrice(value: number): string {
  const hasDecimals = value % 1 !== 0;
  return "\u20B9" + value.toLocaleString("en-IN", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export function ProductsList({ categories, products, subcategories }: ProductsListProps) {
  const [view, setView] = useState<View>({ type: "home" });
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isReady, setIsReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsReady(true); }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // When search is active, switch to search view
  useEffect(() => {
    if (debouncedSearch.trim()) {
      setView({ type: "search" });
    } else if (view.type === "search") {
      setView({ type: "home" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, debouncedSearch]);

  const currentCategory = useMemo(() => {
    if (view.type === "category" || view.type === "subcategory") {
      return categories.find((c) => c.id === (view.type === "category" ? view.categoryId : view.categoryId));
    }
    return null;
  }, [view, categories]);

  const subsForCategory = useMemo(() => {
    if (view.type === "category") {
      return subcategories.filter((s) => s.category_id === view.categoryId);
    }
    return [];
  }, [view, subcategories]);

  const productsForView = useMemo(() => {
    if (view.type === "category") {
      // Products with no subcategory in this category
      return products.filter(
        (p) => p.category_id === view.categoryId && !p.subcategory_id
      );
    }
    if (view.type === "subcategory") {
      return products.filter((p) => p.subcategory_id === view.subcategoryId);
    }
    return [];
  }, [view, products]);

  const currentSubcategory = useMemo(() => {
    if (view.type === "subcategory") {
      return subcategories.find((s) => s.id === view.subcategoryId);
    }
    return null;
  }, [view, subcategories]);

  if (!isReady) {
    return (
      <div className="bg-mesh min-h-dvh px-4 pt-4 pb-8">
        <div className="skeleton mb-5 h-9 w-36" />
        <div className="skeleton mb-4 h-14 w-full rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  const goBack = () => {
    if (view.type === "subcategory") {
      setView({ type: "category", categoryId: view.categoryId });
    } else {
      setView({ type: "home" });
      setSearchInput("");
    }
  };

  const showBack = view.type !== "home" && view.type !== "search";

  const title =
    view.type === "home" || view.type === "search"
      ? "Products"
      : view.type === "category"
        ? currentCategory?.name ?? "Category"
        : currentSubcategory?.name ?? "Subcategory";

  return (
    <div ref={scrollRef} className="bg-mesh min-h-dvh px-4 pt-4 pb-8">
      {/* Fade overlay at top — visible when scrolled */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background to-transparent no-print" />

      {/* Header */}
      <div className="no-print mb-4 flex items-center gap-3">
        {showBack && (
          <button
            onClick={goBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-foreground/[0.07] shadow-sm transition-all active:scale-90 active:bg-foreground/[0.12]"
          >
            <ArrowLeft size={20} className="text-foreground" strokeWidth={2} />
          </button>
        )}
        <h1 className="large-title flex-1 text-foreground">{title}</h1>
        <button
          onClick={() => window.print()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-foreground/[0.07] shadow-sm transition-all active:scale-90 active:bg-foreground/[0.12]"
          aria-label="Print"
        >
          <Printer size={18} className="text-foreground" strokeWidth={2} />
        </button>
      </div>

      {/* Search bar - always visible */}
      <div className="no-print relative mb-5">
        <Search size={18} strokeWidth={2} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input
          type="text"
          placeholder="Search all products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-2xl border border-border/60 bg-white/70 py-3.5 pl-11 pr-10 text-[16px] font-medium text-foreground shadow-sm backdrop-blur-sm placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 dark:bg-white/5"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 active:scale-90"
          >
            <X size={14} className="text-foreground" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Print layout */}
      <div className="print-only">
        <div className="print-header">
          <h1 className="print-store-name">Sri Sri Sri Lakshmi Traders</h1>
          <p className="print-store-location">Tadipatri, AP</p>
          <p className="print-date">Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category_id === cat.id);
          if (catProducts.length === 0) return null;
          const rPct = cat.regular_discount_pct;
          const sPct = cat.shop_owner_discount_pct;
          return (
            <div key={cat.id} className="print-category-section">
              <h2 className="print-category-title">{cat.name}</h2>
              <table className="print-table">
                <thead>
                  <tr>
                    <th className="print-th print-th-sno">S.No</th>
                    <th className="print-th print-th-name">Product</th>
                    <th className="print-th print-th-unit">Unit</th>
                    <th className="print-th print-th-price">MRP</th>
                    <th className="print-th print-th-price">Regular</th>
                    <th className="print-th print-th-price">Shop</th>
                  </tr>
                </thead>
                <tbody>
                  {catProducts.map((p, i) => (
                    <tr key={p.id} className={i % 2 === 0 ? "print-row-even" : ""}>
                      <td className="print-td print-td-sno">{i + 1}</td>
                      <td className="print-td print-td-name">{p.name}</td>
                      <td className="print-td print-td-unit">{p.unit ?? "-"}</td>
                      <td className="print-td print-td-price">{formatPrice(p.master_price)}</td>
                      <td className="print-td print-td-price">{formatPrice(computeRegularPrice(p.master_price, rPct))}</td>
                      <td className="print-td print-td-price print-td-highlight">
                        {p.shop_price != null ? formatPrice(p.shop_price) : formatPrice(computeShopOwnerPrice(p.master_price, sPct))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {/* ===== SEARCH RESULTS ===== */}
        {view.type === "search" && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="mb-3 text-[13px] font-medium text-muted-foreground">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
            </p>
            {searchResults.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
                  <Package size={32} className="text-foreground/20" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-[16px] font-medium text-foreground">No products found</p>
              </div>
            ) : (
              <>
                <PriceHeaders />
                <div className="ios-group card-glow overflow-hidden rounded-2xl">
                  {searchResults.map((p, i) => (
                    <ProductRow key={p.id} product={p} category={categories.find((c) => c.id === p.category_id)} isLast={i === searchResults.length - 1} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ===== HOME: Category list ===== */}
        {view.type === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="mb-3 text-[13px] font-medium text-muted-foreground">
              {categories.length} categor{categories.length !== 1 ? "ies" : "y"} &middot; {products.length} products
            </p>
            <div className="space-y-2.5">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id).length;
                const subCount = subcategories.filter((s) => s.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setView({ type: "category", categoryId: cat.id })}
                    className="flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-white/60 px-4 py-4 shadow-sm backdrop-blur-sm transition-all active:scale-[0.97] active:bg-foreground/[0.04] dark:bg-white/5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.07]">
                      <Package size={22} className="text-foreground/70" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[16px] font-semibold text-foreground">{cat.name}</p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">
                        {count} product{count !== 1 ? "s" : ""}
                        {subCount > 0 && ` · ${subCount} subcategor${subCount !== 1 ? "ies" : "y"}`}
                      </p>
                    </div>
                    <ChevronRight size={20} className="shrink-0 text-foreground/30" strokeWidth={2} />
                  </button>
                );
              })}
            </div>
            {categories.length === 0 && (
              <div className="mt-12 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
                  <Package size={32} className="text-foreground/20" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-[16px] font-medium text-foreground">No categories yet</p>
                <p className="mt-1 text-[14px] text-muted-foreground">Add categories from the Manage tab</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== CATEGORY: Subcategory list + uncategorized products ===== */}
        {view.type === "category" && (
          <motion.div key={`cat-${view.categoryId}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
            {subsForCategory.length > 0 && (
              <>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Subcategories
                </p>
                <div className="mb-5 space-y-2.5">
                  {subsForCategory.map((sub) => {
                    const count = products.filter((p) => p.subcategory_id === sub.id).length;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setView({ type: "subcategory", subcategoryId: sub.id, categoryId: view.categoryId })}
                        className="flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-white/60 px-4 py-3.5 shadow-sm backdrop-blur-sm transition-all active:scale-[0.97] active:bg-foreground/[0.04] dark:bg-white/5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.07]">
                          <Layers size={18} className="text-foreground/70" strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[15px] font-semibold text-foreground">{sub.name}</p>
                          <p className="text-[12px] text-muted-foreground">{count} product{count !== 1 ? "s" : ""}</p>
                        </div>
                        <ChevronRight size={18} className="shrink-0 text-foreground/30" strokeWidth={2} />
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Products with no subcategory */}
            {productsForView.length > 0 && (
              <>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {subsForCategory.length > 0 ? "Other Products" : "Products"}
                </p>
                <PriceHeaders />
              <div className="ios-group card-glow overflow-hidden rounded-2xl">
                  {productsForView.map((p, i) => (
                    <ProductRow key={p.id} product={p} category={currentCategory} isLast={i === productsForView.length - 1} />
                  ))}
                </div>
              </>
            )}

            {subsForCategory.length === 0 && productsForView.length === 0 && (
              <div className="mt-12 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
                  <Package size={32} className="text-foreground/20" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-[16px] font-medium text-foreground">No products yet</p>
                <p className="mt-1 text-[14px] text-muted-foreground">Add products from Manage &gt; Products</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== SUBCATEGORY: Product list ===== */}
        {view.type === "subcategory" && (
          <motion.div key={`sub-${view.subcategoryId}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
            <p className="mb-3 text-[13px] font-medium text-muted-foreground">
              {productsForView.length} product{productsForView.length !== 1 ? "s" : ""}
            </p>
            {productsForView.length > 0 ? (
              <>
                <PriceHeaders />
                <div className="ios-group card-glow overflow-hidden rounded-2xl">
                  {productsForView.map((p, i) => (
                    <ProductRow key={p.id} product={p} category={currentCategory} isLast={i === productsForView.length - 1} />
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-12 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
                  <Package size={32} className="text-foreground/20" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-[16px] font-medium text-foreground">No products</p>
                <p className="mt-1 text-[14px] text-muted-foreground">Add products and assign this subcategory</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PriceHeaders() {
  return (
    <div className="mb-1 flex items-center px-4">
      <div className="flex-1" />
      <span className="w-[60px] text-right text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40">Buy</span>
      <span className="w-[60px] text-right text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">W.Sale</span>
      <span className="w-[64px] text-right text-[9px] font-bold uppercase tracking-wider text-foreground/70">Retail</span>
    </div>
  );
}

function ProductRow({ product, category, isLast }: { product: Product; category?: Category | null; isLast: boolean }) {
  return (
    <div className={`flex items-center px-4 py-3 ${!isLast ? "border-b border-border/30" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium leading-snug text-foreground">{product.name}</p>
        {product.unit && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{product.unit}</p>
        )}
      </div>
      <span className="price-mono w-[60px] text-right text-[12px] font-semibold text-foreground/70">
        {product.master_price > 0 ? formatPrice(product.master_price) : "—"}
      </span>
      <span className="price-mono w-[60px] text-right text-[13px] font-semibold text-foreground/80">
        {product.wholesale_price != null && product.wholesale_price > 0 ? formatPrice(product.wholesale_price) : "—"}
      </span>
      <span className="price-mono w-[64px] text-right text-[14px] font-bold text-foreground">
        {product.shop_price != null && product.shop_price > 0 ? formatPrice(product.shop_price) : "—"}
      </span>
    </div>
  );
}
