"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Printer, ChevronDown, ChevronRight } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { computeRegularPrice, computeShopOwnerPrice } from "@/lib/types";

interface ProductsListProps {
  categories: Category[];
  products: Product[];
}

interface SubGroup {
  subCategory: string;
  items: Product[];
}

interface GroupedProducts {
  category: Category | null;
  categoryName: string;
  subGroups: SubGroup[];
  totalItems: number;
}

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

function formatPrice(value: number): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function extractSubCategory(name: string): string {
  // Extract product type from name by finding where size numbers begin
  // e.g. "Pipe SDR 11 1.5cm (½") 3mtr" → "Pipe SDR 11"
  // e.g. "Elbow 90° 2.0cm (¾")" → "Elbow 90°"
  // e.g. "Reducer Tee 2.0x1.5x2.0 (¾x½x¾")" → "Reducer Tee"
  const match = name.match(/^(.+?)\s+\d+\.\d+\s*(?:cm|x|\()/);
  if (match) return match[1].trim();
  const mMatch = name.match(/^(.+?)\s+M\d+/);
  if (mMatch) return mMatch[1].trim();
  const intMatch = name.match(/^(.+?)\s+\d+\s*(?:cm|\(|ml\b)/);
  if (intMatch) return intMatch[1].trim();
  return name;
}

function buildGrouped(
  products: Product[],
  categories: Category[],
  categoryFilter: string,
  searchQuery: string
): GroupedProducts[] {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const query = searchQuery.toLowerCase().trim();

  const filtered = products.filter((p) => {
    const matchesCategory = categoryFilter === "all" || p.category_id === categoryFilter;
    const matchesSearch = query === "" || p.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const catGroups = new Map<string, { cat: Category | null; subs: Map<string, Product[]> }>();

  for (const product of filtered) {
    const catId = product.category_id ?? "__uncategorized";
    const cat = product.category_id ? categoryMap.get(product.category_id) ?? null : null;

    if (!catGroups.has(catId)) {
      catGroups.set(catId, { cat, subs: new Map() });
    }

    const sub = extractSubCategory(product.name);
    const group = catGroups.get(catId)!;
    if (!group.subs.has(sub)) {
      group.subs.set(sub, []);
    }
    group.subs.get(sub)!.push(product);
  }

  return Array.from(catGroups.entries())
    .map(([, { cat, subs }]) => ({
      category: cat,
      categoryName: cat?.name ?? "Uncategorized",
      subGroups: Array.from(subs.entries()).map(([subCategory, items]) => ({
        subCategory,
        items,
      })),
      totalItems: Array.from(subs.values()).reduce((s, arr) => s + arr.length, 0),
    }))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}

function ProductSkeleton() {
  return (
    <div className="bg-mesh min-h-dvh px-4 pt-2 pb-8">
      <div className="skeleton mb-5 h-9 w-36" />
      <div className="skeleton mb-4 h-12 w-full rounded-2xl" />
      <div className="mb-4 flex gap-2">
        <div className="skeleton h-9 w-20 rounded-full" />
        <div className="skeleton h-9 w-24 rounded-full" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((g) => (
          <div key={g}>
            <div className="skeleton mb-2 h-5 w-20" />
            <div className="ios-group card-glow overflow-hidden rounded-[20px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < 3 ? "border-b border-border/50" : ""}`}>
                  <div className="space-y-1.5"><div className="skeleton h-4 w-32" /><div className="skeleton h-3 w-16" /></div>
                  <div className="flex gap-2"><div className="skeleton h-4 w-12" /><div className="skeleton h-4 w-12" /></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubCategorySection({
  sub,
  regularDiscountPct,
  shopOwnerDiscountPct,
  defaultOpen,
}: {
  sub: SubGroup;
  regularDiscountPct: number;
  shopOwnerDiscountPct: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-1 py-1.5 text-left transition-transform duration-100 active:scale-[0.99]"
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ChevronRight size={14} className="text-muted-foreground" strokeWidth={2.5} />
        </motion.span>
        <span className="text-[13px] font-semibold text-foreground/80">
          {sub.subCategory}
        </span>
        <span className="text-[11px] text-muted-foreground/60">
          {sub.items.length}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="ios-group card-glow overflow-hidden rounded-[16px]">
              {sub.items.map((product, idx) => {
                const regularPrice = computeRegularPrice(product.master_price, regularDiscountPct);
                const shopOwnerPrice = computeShopOwnerPrice(product.master_price, shopOwnerDiscountPct);
                // Extract just the size portion from the name
                const sizePart = product.name.replace(sub.subCategory, "").trim();

                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-2 px-3 py-2.5 ${
                      idx < sub.items.length - 1 ? "border-b border-border/30" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium leading-snug text-foreground">
                        {sizePart || product.name}
                      </p>
                      {product.unit && (
                        <p className="text-[11px] text-muted-foreground">{product.unit}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-baseline gap-1">
                      <span className="price-mono w-[60px] text-right text-[12px] text-muted-foreground/60">
                        {"\u20B9"}{formatPrice(product.master_price)}
                      </span>
                      <span
                        className={`price-mono w-[60px] text-right text-[13px] font-semibold ${
                          regularDiscountPct > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                        }`}
                      >
                        {"\u20B9"}{formatPrice(regularPrice)}
                      </span>
                      <span className="price-mono w-[60px] text-right text-[13px] font-bold text-foreground">
                        {"\u20B9"}{formatPrice(shopOwnerPrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductsList({ categories, products }: ProductsListProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isReady, setIsReady] = useState(false);
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  useEffect(() => { setIsReady(true); }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const grouped = useMemo(
    () => buildGrouped(products, categories, categoryFilter, debouncedSearch),
    [products, categories, categoryFilter, debouncedSearch]
  );

  const totalMatchingProducts = useMemo(
    () => grouped.reduce((sum, g) => sum + g.totalItems, 0),
    [grouped]
  );

  const allGrouped = useMemo(
    () => buildGrouped(products, categories, "all", ""),
    [products, categories]
  );

  if (!isReady) return <ProductSkeleton />;

  const toggleCat = (name: string) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="bg-mesh min-h-dvh px-4 pt-2 pb-8">
      {/* Header */}
      <div className="no-print flex items-center justify-between mb-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="large-title text-foreground"
        >
          Products
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING, delay: 0.05 }}
          onClick={() => window.print()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 transition-all active:scale-95 hover:bg-foreground/10"
          aria-label="Print price list"
        >
          <Printer size={20} className="text-foreground" strokeWidth={1.8} />
        </motion.button>
      </div>

      {/* Print layout */}
      <div className="print-only">
        <div className="print-header">
          <h1 className="print-store-name">Sri Sri Sri Lakshmi Traders</h1>
          <p className="print-store-location">Tadipatri, AP</p>
          <p className="print-date">Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        {allGrouped.map((group) => {
          const rPct = group.category?.regular_discount_pct ?? 0;
          const sPct = group.category?.shop_owner_discount_pct ?? 0;
          return (
            <div key={group.categoryName} className="print-category-section">
              <h2 className="print-category-title">{group.categoryName}</h2>
              {group.subGroups.map((sub) => (
                <div key={sub.subCategory} style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#555", margin: "6px 0 2px 4px" }}>{sub.subCategory}</p>
                  <table className="print-table">
                    <thead>
                      <tr>
                        <th className="print-th print-th-sno">S.No</th>
                        <th className="print-th print-th-name">Size / Variant</th>
                        <th className="print-th print-th-unit">Unit</th>
                        <th className="print-th print-th-price">MRP</th>
                        <th className="print-th print-th-price">Regular</th>
                        <th className="print-th print-th-price">Shop Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sub.items.map((p, idx) => {
                        const sizePart = p.name.replace(sub.subCategory, "").trim();
                        return (
                          <tr key={p.id} className={idx % 2 === 0 ? "print-row-even" : ""}>
                            <td className="print-td print-td-sno">{idx + 1}</td>
                            <td className="print-td print-td-name">{sizePart || p.name}</td>
                            <td className="print-td print-td-unit">{p.unit ?? "-"}</td>
                            <td className="print-td print-td-price">{"\u20B9"}{formatPrice(p.master_price)}</td>
                            <td className="print-td print-td-price">{"\u20B9"}{formatPrice(computeRegularPrice(p.master_price, rPct))}</td>
                            <td className="print-td print-td-price print-td-highlight">{"\u20B9"}{formatPrice(computeShopOwnerPrice(p.master_price, sPct))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.03 }} className="no-print relative mb-3">
        <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-2xl bg-secondary py-3.5 pl-11 pr-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)" }}
        />
      </motion.div>

      {/* Category pills */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.06 }} className="no-print mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`shrink-0 rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-150 active:scale-95 ${
            categoryFilter === "all"
              ? "bg-foreground text-background shadow-md"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`shrink-0 rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-150 active:scale-95 ${
              categoryFilter === cat.id
                ? "bg-foreground text-background shadow-md"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {totalMatchingProducts === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING} className="mt-16 flex flex-col items-center text-center">
            <div className="card-glow flex h-20 w-20 items-center justify-center rounded-[20px] bg-foreground/5">
              <Package size={36} className="text-foreground/30" strokeWidth={1.5} />
            </div>
            <p className="mt-5 text-[17px] font-medium text-foreground">No products found</p>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {debouncedSearch ? "Try a different search term" : "No products in this category"}
            </p>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING}>
            <p className="no-print mb-3 text-[13px] font-medium text-muted-foreground">
              {totalMatchingProducts} product{totalMatchingProducts !== 1 ? "s" : ""}
            </p>

            {/* Price column labels */}
            <div className="no-print mb-2 flex items-center justify-end gap-1 px-3">
              <span className="w-[60px] text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">MRP</span>
              <span className="w-[60px] text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Regular</span>
              <span className="w-[60px] text-right text-[10px] font-bold uppercase tracking-wider text-foreground">Shop</span>
            </div>

            <div className="space-y-6">
              {grouped.map((group, gi) => {
                const isCollapsed = collapsedCats.has(group.categoryName);
                const rPct = group.category?.regular_discount_pct ?? 0;
                const sPct = group.category?.shop_owner_discount_pct ?? 0;

                return (
                  <motion.section
                    key={group.categoryName}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: 0.05 + gi * 0.06 }}
                  >
                    {/* Category header - collapsible */}
                    <button
                      onClick={() => toggleCat(group.categoryName)}
                      className="mb-2 flex w-full items-center gap-2 px-1 text-left active:scale-[0.99] transition-transform duration-100"
                    >
                      <span className="inline-block h-2.5 w-2.5 rounded-sm bg-foreground/70" />
                      <span className="text-[14px] font-bold uppercase tracking-wide text-foreground">
                        {group.categoryName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {group.totalItems}
                      </span>
                      {rPct > 0 && (
                        <span className="ml-auto text-[11px] text-muted-foreground/70">
                          {rPct}% / {sPct}%
                        </span>
                      )}
                      <motion.span animate={{ rotate: isCollapsed ? 0 : 180 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                        <ChevronDown size={16} className="text-muted-foreground" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          className="overflow-hidden"
                        >
                          {group.subGroups.map((sub, si) => (
                            <SubCategorySection
                              key={sub.subCategory}
                              sub={sub}
                              regularDiscountPct={rPct}
                              shopOwnerDiscountPct={sPct}
                              defaultOpen={si === 0}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.section>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
