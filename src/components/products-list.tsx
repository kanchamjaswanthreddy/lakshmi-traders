"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { computeRegularPrice, computeShopOwnerPrice } from "@/lib/types";

interface ProductsListProps {
  categories: Category[];
  products: Product[];
}

interface GroupedProducts {
  category: Category | null;
  categoryName: string;
  items: Product[];
}

const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };
const DEBOUNCE_DELAY = 300;

function formatPrice(value: number): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function groupAndFilter(
  products: Product[],
  categories: Category[],
  categoryFilter: string,
  searchQuery: string
): GroupedProducts[] {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const query = searchQuery.toLowerCase().trim();

  const filtered = products.filter((p) => {
    const matchesCategory =
      categoryFilter === "all" || p.category_id === categoryFilter;
    const matchesSearch = query === "" || p.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const groups = new Map<string, GroupedProducts>();

  for (const product of filtered) {
    const catId = product.category_id ?? "__uncategorized";
    const cat = product.category_id
      ? categoryMap.get(product.category_id) ?? null
      : null;

    if (!groups.has(catId)) {
      groups.set(catId, {
        category: cat,
        categoryName: cat?.name ?? "Uncategorized",
        items: [],
      });
    }

    groups.get(catId)!.items.push(product);
  }

  return Array.from(groups.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName)
  );
}

function ProductSkeleton() {
  return (
    <div className="px-4 pt-2 pb-8">
      <div className="skeleton mb-5 h-9 w-36" />
      <div className="skeleton mb-4 h-11 w-full" />
      <div className="mb-4 flex gap-2">
        <div className="skeleton h-8 w-20 rounded-full" />
        <div className="skeleton h-8 w-24 rounded-full" />
        <div className="skeleton h-8 w-16 rounded-full" />
      </div>
      <div className="space-y-5">
        {[1, 2].map((group) => (
          <div key={group}>
            <div className="skeleton mb-2 h-4 w-24" />
            <div className="ios-group overflow-hidden">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`flex items-center justify-between px-4 py-3 ${
                    item < 3 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-4 w-32" />
                    <div className="skeleton h-3 w-16" />
                  </div>
                  <div className="flex gap-3">
                    <div className="skeleton h-4 w-14" />
                    <div className="skeleton h-4 w-14" />
                    <div className="skeleton h-4 w-14" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductsList({ categories, products }: ProductsListProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const grouped = useMemo(
    () => groupAndFilter(products, categories, categoryFilter, debouncedSearch),
    [products, categories, categoryFilter, debouncedSearch]
  );

  const totalMatchingProducts = useMemo(
    () => grouped.reduce((sum, g) => sum + g.items.length, 0),
    [grouped]
  );

  if (!isReady) {
    return <ProductSkeleton />;
  }

  return (
    <div className="px-4 pt-2 pb-8">
      {/* iOS large title */}
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_CONFIG}
        className="mb-4 text-[34px] font-bold tracking-tight text-foreground"
      >
        Products
      </motion.h1>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_CONFIG, delay: 0.03 }}
        className="relative mb-3"
      >
        <Search
          size={18}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search products"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="ios-search w-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/30"
          aria-label="Search products"
        />
      </motion.div>

      {/* Category filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_CONFIG, delay: 0.06 }}
        className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        role="tablist"
        aria-label="Filter by category"
      >
        <button
          role="tab"
          aria-selected={categoryFilter === "all"}
          onClick={() => setCategoryFilter("all")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all active:scale-95 ${
            categoryFilter === "all"
              ? "bg-copper text-white shadow-sm"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={categoryFilter === cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all active:scale-95 ${
              categoryFilter === cat.id
                ? "bg-copper text-white shadow-sm"
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
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING_CONFIG}
            className="mt-16 flex flex-col items-center justify-center text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-copper/10">
              <Package
                size={32}
                className="text-copper/60"
                strokeWidth={1.5}
              />
            </div>
            <p className="mt-4 text-[17px] font-medium text-foreground">
              No products found
            </p>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {debouncedSearch
                ? "Try a different search term"
                : "No products available in this category"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Product count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SPRING_CONFIG, delay: 0.05 }}
              className="mb-3 text-[13px] font-medium text-muted-foreground"
            >
              {totalMatchingProducts} product
              {totalMatchingProducts !== 1 ? "s" : ""}
            </motion.p>

            {/* Price column header */}
            <div className="mb-2 flex items-center justify-end gap-1 px-4">
              <span className="w-[72px] text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                MRP
              </span>
              <span className="w-[72px] text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Regular
              </span>
              <span className="w-[72px] text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Shop
              </span>
            </div>

            {/* Grouped product list */}
            <div className="space-y-5">
              {grouped.map((group, groupIndex) => {
                const regularDiscountPct =
                  group.category?.regular_discount_pct ?? 0;
                const shopOwnerDiscountPct =
                  group.category?.shop_owner_discount_pct ?? 0;

                return (
                  <motion.section
                    key={group.categoryName}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...SPRING_CONFIG,
                      delay: 0.05 + groupIndex * 0.04,
                    }}
                    aria-labelledby={`products-cat-${groupIndex}`}
                  >
                    <h2
                      id={`products-cat-${groupIndex}`}
                      className="mb-1.5 px-1 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {group.categoryName}
                      {regularDiscountPct > 0 && (
                        <span className="ml-2 text-[11px] font-normal normal-case text-muted-foreground/70">
                          {regularDiscountPct}% / {shopOwnerDiscountPct}% off
                        </span>
                      )}
                    </h2>

                    <div className="ios-group overflow-hidden">
                      {group.items.map((product, itemIndex) => {
                        const regularPrice = computeRegularPrice(
                          product.master_price,
                          regularDiscountPct
                        );
                        const shopOwnerPrice = computeShopOwnerPrice(
                          product.master_price,
                          shopOwnerDiscountPct
                        );

                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              ...SPRING_CONFIG,
                              delay:
                                0.08 +
                                groupIndex * 0.04 +
                                itemIndex * 0.02,
                            }}
                            className={`flex items-center gap-3 px-4 py-3 transition-transform active:scale-[0.98] ${
                              itemIndex < group.items.length - 1
                                ? "border-b border-border"
                                : ""
                            }`}
                          >
                            {/* Product info */}
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

                            {/* Price columns */}
                            <div className="flex shrink-0 items-baseline gap-1">
                              <span className="price-mono w-[72px] text-right text-[13px] text-muted-foreground">
                                {"\u20B9"}
                                {formatPrice(product.master_price)}
                              </span>
                              <span className="price-mono w-[72px] text-right text-[14px] font-semibold text-foreground">
                                {"\u20B9"}
                                {formatPrice(regularPrice)}
                              </span>
                              <span className="price-mono w-[72px] text-right text-[14px] font-bold text-copper">
                                {"\u20B9"}
                                {formatPrice(shopOwnerPrice)}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
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
