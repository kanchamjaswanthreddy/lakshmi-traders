'use client';

import { useState, useEffect, useCallback } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { Product, CustomerType, getProductPrice } from '@/types';
import { Plus, Package } from 'lucide-react';
import { SkeletonRows } from './Skeleton';
import GlassPillSelector from './GlassPillSelector';

interface ProductBrowserProps {
  onSelect: (product: Product) => void;
  customerType?: CustomerType;
}

const SIZES_ORDER = ['½', '¾', '1', '1¼', '1½', '2', '2½', '3', '3½', '4', '5', '6'];

function extractSizes(products: Product[]): string[] {
  const sizeSet = new Set<string>();
  products.forEach((prod) => {
    const s = prod.size?.trim();
    if (s && SIZES_ORDER.includes(s)) sizeSet.add(s);
  });
  return [...sizeSet].sort((a, b) => SIZES_ORDER.indexOf(a) - SIZES_ORDER.indexOf(b));
}

export default function ProductBrowser({ onSelect, customerType = 'customer' }: ProductBrowserProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('cpvc');
  const [subType, setSubType] = useState('all');
  const [size, setSize] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/products?category=${category}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    fetchProducts();
    setSize('all');
    setSubType('all');
  }, [fetchProducts]);

  const sizes = extractSizes(products);

  const filtered = products.filter((p) => {
    if (subType !== 'all') {
      if (subType === 'Common') {
        if (p.name.includes('Pushfit') || p.name.includes('Solfit')) return false;
      } else if (!p.name.includes(subType)) return false;
    }
    if (size === 'all') return true;
    const s = p.size?.trim() || '';
    return s === size || s.startsWith(size + '"') || s.startsWith(size + ' ') || s.startsWith(size + 'x');
  });

  return (
    <div>
      {/* Category Ribbon */}
      <div className="mb-3 overflow-x-auto">
        <GlassPillSelector
          items={CATEGORIES.filter(c => ['cpvc', 'upvc', 'swr', 'other'].includes(c.id)).map(c => ({ id: c.id, label: c.label }))}
          value={category}
          onChange={(id) => { setCategory(id); setSubType('all'); setSize('all'); }}
          size="sm"
        />
      </div>

      {/* Sub-Type Ribbon (SWR) */}
      {category === 'swr' && (
        <div className="mb-2 overflow-x-auto">
          <GlassPillSelector
            items={[{ id: 'all', label: 'All' }, { id: 'Pushfit', label: 'Pushfit' }, { id: 'Solfit', label: 'Solfit' }, { id: 'Common', label: 'Common' }]}
            value={subType}
            onChange={setSubType}
            size="sm"
          />
        </div>
      )}

      {/* Size Ribbon */}
      {sizes.length > 0 && (
        <div className="mb-3 overflow-x-auto">
          <GlassPillSelector
            items={[{ id: 'all', label: 'All' }, ...sizes.map(s => ({ id: s, label: `${s}"` }))]}
            value={size}
            onChange={setSize}
            size="sm"
          />
        </div>
      )}

      {/* Product Grid */}
      <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#F9F9FB]">
        {loading ? (
          <SkeletonRows count={5} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package size={24} className="mx-auto text-[#E0E0E2] mb-2" />
            <p className="text-[13px] font-medium text-[#86868B]">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1.5 p-2">
            {filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelect(product)}
                className="flex items-center gap-3 text-left px-4 py-3 bg-white rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-[rgba(0,0,0,0.12)] hover:shadow-sm transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] font-medium text-[#86868B]">
                    HSN {product.hsn_code} · {product.unit}
                  </p>
                </div>
                <p className="font-mono text-[14px] font-bold text-[#1A1A1A] flex-shrink-0">
                  ₹{getProductPrice(product, customerType).toFixed(0)}
                </p>
                <div className="w-7 h-7 rounded-lg bg-[#F5F5F7] group-hover:bg-[#1A1A1A] flex items-center justify-center transition-all flex-shrink-0">
                  <Plus size={14} className="text-[#86868B] group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] font-medium text-[#86868B] mt-2 text-right">
        {filtered.length} product{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
