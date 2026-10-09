'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, IndianRupee, Filter, Download } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { Product } from '@/types';
import GlassPillSelector from '@/components/GlassPillSelector';
import { SkeletonTable } from '@/components/Skeleton';

const DISCOUNT_CATEGORIES = [
  'CPVC Pipe/Fitting',
  'CPVC Ball Valves & Acc',
  'CPVC Solvents',
  'UPVC Pipes',
  'UPVC Fittings',
  'UPVC Valves & Acc',
  'UPVC B.Valves & Acc',
  'SWR Pipes',
  'SWR Fitting',
  'SWR Solvent',
  'Waste-N-Traps',
  'Pan Connector',
];

export default function PriceListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubType, setActiveSubType] = useState('all');
  const [activeSize, setActiveSize] = useState('all');
  const [search, setSearch] = useState('');
  const [discountCat, setDiscountCat] = useState('all');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ active: 'false' });
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (search) params.set('search', search);

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, [activeCategory, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) => {
    if (activeSubType !== 'all') {
      if (activeSubType === 'Common') {
        if (p.sub_type !== 'Common' && p.sub_type !== 'General') return false;
      } else if (p.sub_type !== activeSubType) return false;
    }
    if (activeSize !== 'all') {
      const s = p.size?.trim() || '';
      // Match if size equals, or starts with the selected size (e.g. "¾" matches "¾" x ½")
      if (s !== activeSize && !s.startsWith(activeSize + '"') && !s.startsWith(activeSize + ' ') && !s.startsWith(activeSize + 'x')) return false;
    }
    if (discountCat !== 'all' && p.discount_category !== discountCat) return false;
    return true;
  });

  // Get unique discount categories from current products
  const availableDiscountCats = [...new Set(products.map(p => p.discount_category).filter(Boolean))] as string[];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Price List
          </h1>
          <p className="text-[13px] font-medium text-[#86868B] mt-1">
            Ashirvad product prices — MRP, cost, shop & customer rates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#F0F0F2] text-[#6E6E73] rounded-full px-3 py-1.5 text-[11px] font-bold">
            {filtered.length} products
          </span>
        </div>
      </div>

      {/* Category Ribbon */}
      <div className="mb-4 overflow-x-auto">
        <GlassPillSelector
          items={[
            { id: 'all', label: 'All' },
            ...CATEGORIES.filter(c => ['cpvc', 'upvc', 'swr'].includes(c.id)).map(c => ({ id: c.id, label: c.label })),
          ]}
          value={activeCategory}
          onChange={(id) => { setActiveCategory(id); setActiveSubType('all'); setActiveSize('all'); setDiscountCat('all'); }}
        />
      </div>

      {/* Sub-Type Filter (SWR) */}
      {activeCategory === 'swr' && (
        <div className="mb-3 overflow-x-auto">
          <GlassPillSelector
            items={[
              { id: 'all', label: 'All Types' },
              { id: 'Pushfit', label: 'Pushfit' },
              { id: 'Solfit', label: 'Solfit' },
              { id: 'Common', label: 'Common' },
            ]}
            value={activeSubType}
            onChange={setActiveSubType}
            size="sm"
          />
        </div>
      )}

      {/* Size Ribbon */}
      {(() => {
        const SIZES_ORDER = ['½', '¾', '1', '1¼', '1½', '2', '2½', '3', '3½', '4', '5', '6', '8', '10', '12'];
        const sizeSet = new Set<string>();
        products.forEach((p) => {
          const s = p.size?.trim();
          if (s && SIZES_ORDER.includes(s)) sizeSet.add(s);
        });
        const sizes = [...sizeSet].sort((a, b) => SIZES_ORDER.indexOf(a) - SIZES_ORDER.indexOf(b));
        if (sizes.length === 0) return null;
        return (
          <div className="mb-3 overflow-x-auto">
            <GlassPillSelector
              items={[{ id: 'all', label: 'All Sizes' }, ...sizes.map(s => ({ id: s, label: `${s}"` }))]}
              value={activeSize}
              onChange={setActiveSize}
              size="sm"
            />
          </div>
        );
      })()}

      {/* Discount Category Filter */}
      {availableDiscountCats.length > 1 && (
        <div className="flex items-center gap-2 mb-4">
          <Filter size={13} className="text-[#86868B]" />
          <select
            value={discountCat}
            onChange={(e) => setDiscountCat(e.target.value)}
            className="bg-[#F0F0F2] border border-[#E0E0E2] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-all cursor-pointer"
          >
            <option value="all">All Discount Categories</option>
            {availableDiscountCats.sort().map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]" />
        <input
          type="text"
          placeholder="Search products by name, size, or part number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[rgba(0,0,0,0.07)] rounded-2xl pl-11 pr-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-all shadow-sm"
        />
      </div>

      {/* Price Legend */}
      <div className="flex flex-wrap gap-4 mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#86868B]" />
          <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wide">MRP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E03020]" />
          <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wide">Your Cost</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0066CC]" />
          <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wide">Shop (5%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1C9E5A]" />
          <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wide">Customer (10%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9333EA]" />
          <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wide">Customer 2 (15%)</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E0E0E2]">
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B] w-12">
                  #
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                  Product
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B] w-24">
                  Size
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B] w-24">
                  Part No
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B] w-28">
                  Category
                </th>
                <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B] w-20">
                  MRP
                </th>
                <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#E03020] w-20">
                  Cost
                </th>
                <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0066CC] w-20">
                  Shop
                </th>
                <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1C9E5A] w-20">
                  Cust.
                </th>
                <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9333EA] w-20">
                  Cust. 2
                </th>
                <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B] w-16">
                  Disc%
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11}><SkeletonTable rows={10} cols={9} /></td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-[14px] font-medium text-[#86868B]">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`border-b border-[#F0F0F2] last:border-b-0 hover:bg-[#F9F9FB] transition-colors ${
                      idx % 2 === 0 ? '' : 'bg-[#FAFAFA]'
                    }`}
                  >
                    <td className="px-4 py-3 text-[11px] font-mono font-medium text-[#86868B]">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold text-[#1A1A1A] truncate max-w-[280px]">
                        {p.name}
                      </p>
                      {p.sub_type && p.sub_type !== 'General' && (
                        <span className="text-[9px] font-bold uppercase tracking-wide bg-[#F0F0F2] text-[#6E6E73] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          {p.sub_type}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-medium text-[#6E6E73]">
                      {p.size || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] font-medium text-[#86868B]">
                        {p.part_no || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-[#F0F0F2] text-[#6E6E73] px-2 py-0.5 rounded-full truncate max-w-[100px] inline-block">
                        {p.discount_category || p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[12px] font-semibold text-[#86868B]">
                      {p.mrp ? `₹${p.mrp.toFixed(0)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[12px] font-bold text-[#E03020]">
                      {p.cost_price ? `₹${p.cost_price.toFixed(0)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[12px] font-bold text-[#0066CC]">
                      {p.shop_price ? `₹${p.shop_price.toFixed(0)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[12px] font-bold text-[#1C9E5A]">
                      {p.customer_price ? `₹${p.customer_price.toFixed(0)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[12px] font-bold text-[#9333EA]">
                      {p.customer2_price ? `₹${p.customer2_price.toFixed(0)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-[11px] font-bold text-[#6E6E73]">
                      {p.discount_percent ? `${p.discount_percent}%` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
