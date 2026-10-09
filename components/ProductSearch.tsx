'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Product, CustomerType, getProductPrice } from '@/types';
import { CATEGORIES } from '@/lib/categories';

interface ProductSearchProps {
  onSelect: (product: Product) => void;
  customerType?: CustomerType;
}

export default function ProductSearch({ onSelect, customerType = 'customer' }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/products?search=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.products || []);
      setShowDropdown(true);
      setLoading(false);
    }, 200);
  }

  function handleSelect(product: Product) {
    onSelect(product);
    setQuery('');
    setShowDropdown(false);
    setResults([]);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search products — type name, size, or category..."
          className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-2xl pl-11 pr-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#86868B]">
            ...
          </span>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-20 top-full mt-2 w-full bg-white border border-[rgba(0,0,0,0.07)] rounded-2xl shadow-lg max-h-[320px] overflow-y-auto">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className="w-full text-left px-4 py-3.5 flex items-center gap-4 hover:bg-[#F5F5F7] transition-all border-b border-[#F0F0F2] last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">
                  {p.name}
                </p>
                <p className="text-[11px] font-medium text-[#86868B]">
                  {CATEGORIES.find((c) => c.id === p.category)?.label || p.category}
                  {' · '}HSN {p.hsn_code}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-[14px] font-bold text-[#1A1A1A]">
                  ₹{getProductPrice(p, customerType).toFixed(2)}
                </p>
                <p className="text-[11px] font-medium text-[#86868B]">
                  +{p.gst_percent}% GST
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && query && results.length === 0 && !loading && (
        <div className="absolute z-20 top-full mt-2 w-full bg-white border border-[rgba(0,0,0,0.07)] rounded-2xl shadow-lg p-5 text-center">
          <p className="text-[13px] font-medium text-[#86868B]">
            No products found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
