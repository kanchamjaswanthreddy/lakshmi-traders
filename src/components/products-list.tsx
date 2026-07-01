"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Printer } from "lucide-react";
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
    <div className="bg-mesh min-h-dvh px-4 pt-2 pb-8">
      <div className="skeleton mb-5 h-9 w-36" />
      <div className="skeleton mb-4 h-12 w-full rounded-2xl" />
      <div className="mb-4 flex gap-2">
        <div className="skeleton h-9 w-20 rounded-full" />
        <div className="skeleton h-9 w-24 rounded-full" />
        <div className="skeleton h-9 w-16 rounded-full" />
      </div>
      <div className="space-y-5">
        {[1, 2].map((group) => (
          <div key={group}>
            <div className="skeleton mb-2 h-4 w-24" />
            <div className="ios-group card-glow overflow-hidden rounded-[20px]">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`flex items-center justify-between px-4 py-3 ${
                    item < 3 ? "border-b border-border/50" : ""
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

  const allGrouped = useMemo(
    () => groupAndFilter(products, categories, "all", ""),
    [products, categories]
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-mesh min-h-dvh px-4 pt-2 pb-8">
      {/* Large title + Print button */}
      <div className="no-print flex items-center justify-between mb-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_CONFIG}
          className="large-title text-foreground"
        >
          Products
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING_CONFIG, delay: 0.05 }}
          onClick={handlePrint}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-copper/10 transition-all active:scale-95 hover:bg-copper/20"
          aria-label="Print price list"
        >
          <Printer size={20} className="text-copper" strokeWidth={1.8} />
        </motion.button>
      </div>

      {/* Print-only layout */}
      <div className="print-only">
        <div className="print-header">
          <h1 className="print-store-name">Sri Sri Sri Lakshmi Traders</h1>
          <p className="print-store-location">Tadipatri, AP</p>
          <p className="print-date">Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        {allGrouped.map((group) => {
          const regularDiscountPct = group.category?.regular_discount_pct ?? 0;
          const shopOwnerDiscountPct = group.category?.shop_owner_discount_pct ?? 0;

          return (
            <div key={group.categoryName} className="print-category-section">
              <h2 className="print-category-title">{group.categoryName}</h2>
              <table className="print-table">
                <thead>
                  <tr>
                    <th className="print-th print-th-sno">S.No</th>
                    <th className="print-th print-th-name">Product Name</th>
                    <th className="print-th print-th-unit">Unit</th>
                    <th className="print-th print-th-price">MRP</th>
                    <th className="print-th print-th-price">Regular Price</th>
                    <th className="print-th print-th-price">Shop Owner Price</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((product, idx) => {
                    const regularPrice = computeRegularPrice(product.master_price, regularDiscountPct);
                    const shopOwnerPrice = computeShopOwnerPrice(product.master_price, shopOwnerDiscountPct);
                    return (
                      <tr key={product.id} className={idx % 2 === 0 ? "print-row-even" : ""}>
                        <td className="print-td print-td-sno">{idx + 1}</td>
                        <td className="print-td print-td-name">{product.name}</td>
                        <td className="print-td print-td-unit">{product.unit ?? "-"}</td>
                        <td className="print-td print-td-price">{"\u20B9"}{formatPrice(product.master_price)}</td>
                        <td className="print-td print-td-price">{"\u20B9"}{formatPrice(regularPrice)}</td>
                        <td className="print-td print-td-price print-td-highlight">{"\u20B9"}{formatPrice(shopOwnerPrice)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

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
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search products"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-2xl bg-secondary py-3.5 pl-11 pr-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/30"
          style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)" }}
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
          className={`shrink-0 rounded-[20px] px-5 py-2 text-[13px] font-semibold transition-all duration-150 active:scale-95 ${
            categoryFilter === "all"
              ? "bg-gradient-to-r from-[#B5651D] to-[#D4924B] text-white shadow-md"
              : "bg-secondary text-secondary-foreground"
          }`}
          style={categoryFilter === "all" ? { boxShadow: "0 2px 12px rgba(181,101,29,0.3)" } : undefined}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={categoryFilter === cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`shrink-0 rounded-[20px] px-5 py-2 text-[13px] font-semibold transition-all duration-150 active:scale-95 ${
              categoryFilter === cat.id
                ? "bg-gradient-to-r from-[#B5651D] to-[#D4924B] text-white shadow-md"
                : "bg-secondary text-secondary-foreground"
            }`}
            style={categoryFilter === cat.id ? { boxShadow: "0 2px 12px rgba(181,101,29,0.3)" } : undefined}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING_CONFIG}
            className="mt-16 flex flex-col items-center justify-center text-center"
          >
            <div className="card-glow flex h-20 w-20 items-center justify-center rounded-[20px] bg-copper/10">
              <Package
                size={36}
                className="text-copper/60"
                strokeWidth={1.5}
              />
            </div>
            <p className="mt-5 text-[17px] font-medium text-foreground">
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
              <span className="w-[72px] text-right text-[11px] font-semibold uppercase tracking-wider text-copper">
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
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...SPRING_CONFIG,
                      delay: 0.05 + groupIndex * 0.06,
                    }}
                    aria-labelledby={`products-cat-${groupIndex}`}
                  >
                    <h2
                      id={`products-cat-${groupIndex}`}
                      className="mb-1.5 flex items-center gap-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-copper/50" />
                      {group.categoryName}
                      {regularDiscountPct > 0 && (
                        <span className="ml-1 text-[11px] font-normal normal-case text-muted-foreground/70">
                          {regularDiscountPct}% / {shopOwnerDiscountPct}% off
                        </span>
                      )}
                    </h2>

                    <div className="ios-group card-glow overflow-hidden rounded-[20px]">
                      {group.items.map((product, itemIndex) => {
                        const regularPrice = computeRegularPrice(
                          product.master_price,
                          regularDiscountPct
                        );
                        const shopOwnerPrice = computeShopOwnerPrice(
                          product.master_price,
                          shopOwnerDiscountPct
                        );
                        const regularDiffersFromMRP =
                          regularDiscountPct > 0;

                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              ...SPRING_CONFIG,
                              delay:
                                0.08 +
                                groupIndex * 0.06 +
                                itemIndex * 0.03,
                            }}
                            className={`flex items-center gap-3 px-4 py-3 transition-transform duration-150 active:scale-[0.98] ${
                              itemIndex < group.items.length - 1
                                ? "border-b border-border/50"
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
                              <span className="price-mono w-[72px] text-right text-[13px] text-muted-foreground/70">
                                {"\u20B9"}
                                {formatPrice(product.master_price)}
                              </span>
                              <span
                                className={`price-mono w-[72px] text-right text-[14px] font-semibold ${
                                  regularDiffersFromMRP
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-foreground"
                                }`}
                              >
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
