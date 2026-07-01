"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, Percent, ChevronDown, Package } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { computeQuotePrice } from "@/lib/types";

interface QuoteCalculatorProps {
  categories: Category[];
  products: Product[];
}

interface GroupedProducts {
  category: Category | null;
  categoryName: string;
  items: Product[];
}

const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };

function groupAndFilter(
  products: Product[],
  categories: Category[],
  categoryFilter: string
): GroupedProducts[] {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const filtered =
    categoryFilter === "all"
      ? products
      : products.filter((p) => p.category_id === categoryFilter);

  const groups = new Map<string, GroupedProducts>();

  for (const product of filtered) {
    const catId = product.category_id ?? "__uncategorized";
    const cat = product.category_id ? categoryMap.get(product.category_id) ?? null : null;

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

function formatPrice(value: number): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function QuoteCalculator({ categories, products }: QuoteCalculatorProps) {
  const [discount, setDiscount] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const discountNum = parseFloat(discount) || 0;
  const hasValidDiscount = discountNum > 0 && discountNum <= 100;

  const grouped = useMemo(
    () => groupAndFilter(products, categories, categoryFilter),
    [products, categories, categoryFilter]
  );

  const totalMatchingProducts = useMemo(
    () => grouped.reduce((sum, g) => sum + g.items.length, 0),
    [grouped]
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="px-4 pt-2 pb-8">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_CONFIG}
          className="text-3xl font-bold tracking-tight text-foreground"
        >
          Special Quote
        </motion.h1>

        {hasValidDiscount && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING_CONFIG}
            onClick={handlePrint}
            className="no-print flex h-10 w-10 items-center justify-center rounded-full bg-copper/10 transition-transform active:scale-95"
            aria-label="Print quote"
          >
            <Printer size={20} className="text-copper" strokeWidth={1.8} />
          </motion.button>
        )}
      </div>

      {/* Print header (visible only during print) */}
      <div className="hidden print:block print:mb-6">
        <h2 className="text-xl font-bold text-black">
          Sri Sri Sri Lakshmi Traders
        </h2>
        <p className="text-sm text-gray-600">Tadipatri, AP</p>
        <p className="mt-1 text-sm font-medium text-gray-800">
          Special Quote &mdash; {discountNum}% Discount
        </p>
        <hr className="mt-3 border-gray-300" />
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_CONFIG, delay: 0.05 }}
        className="no-print mb-5 space-y-3"
      >
        {/* Discount input */}
        <div className="ios-group flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-copper/10">
            <Percent size={20} className="text-copper" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <label
              htmlFor="discount-input"
              className="block text-[13px] font-medium text-muted-foreground"
            >
              Discount Percentage
            </label>
            <input
              id="discount-input"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="0.5"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount %"
              className="mt-0.5 w-full border-none bg-transparent text-[22px] font-semibold tracking-tight text-foreground placeholder:text-muted-foreground/50 focus:outline-none price-mono"
              autoFocus
            />
          </div>
          {discount && (
            <span className="price-mono shrink-0 text-lg font-semibold text-copper">
              {discountNum}%
            </span>
          )}
        </div>

        {/* Category filter */}
        <div className="ios-group relative flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-copper/10">
            <Package size={20} className="text-copper" strokeWidth={1.8} />
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

      {/* Results */}
      <AnimatePresence mode="wait">
        {!hasValidDiscount ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING_CONFIG}
            className="mt-12 flex flex-col items-center justify-center text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-copper/10">
              <Percent size={32} className="text-copper/60" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-[17px] font-medium text-foreground">
              Enter a discount
            </p>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Type a discount percentage to compute prices
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
              {totalMatchingProducts} product{totalMatchingProducts !== 1 ? "s" : ""} &middot; {discountNum}% off MRP
            </motion.p>

            {/* Grouped product list */}
            <div className="space-y-5">
              {grouped.map((group, groupIndex) => (
                <motion.section
                  key={group.categoryName}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...SPRING_CONFIG,
                    delay: 0.05 + groupIndex * 0.04,
                  }}
                  aria-labelledby={`cat-heading-${groupIndex}`}
                >
                  <h2
                    id={`cat-heading-${groupIndex}`}
                    className="mb-1.5 px-1 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {group.categoryName}
                  </h2>

                  <div className="ios-group overflow-hidden">
                    {group.items.map((product, itemIndex) => {
                      const quotePrice = computeQuotePrice(
                        product.master_price,
                        discountNum
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
                          className={`flex items-center justify-between gap-3 px-4 py-3 ${
                            itemIndex < group.items.length - 1
                              ? "border-b border-border"
                              : ""
                          }`}
                        >
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

                          <div className="shrink-0 text-right">
                            <p className="price-mono text-[13px] text-muted-foreground line-through">
                              &#8377;{formatPrice(product.master_price)}
                            </p>
                            <p className="price-mono text-[17px] font-bold text-copper">
                              &#8377;{formatPrice(quotePrice)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
