'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '@/lib/categories';
import { Product } from '@/types';
import GlassPillSelector from '@/components/GlassPillSelector';
import { SkeletonTable } from '@/components/Skeleton';

interface ProductForm {
  name: string;
  category: string;
  price: string;
  gst_percent: string;
  hsn_code: string;
  unit: string;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  category: 'cpvc',
  price: '',
  gst_percent: '18',
  hsn_code: '3917',
  unit: 'NOS',
};

const UNITS = ['NOS', 'MTR', 'KG', 'SET', 'BOX', 'PCS', 'LTR', 'ROLL'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubType, setActiveSubType] = useState('all');
  const [activeSize, setActiveSize] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

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

  function openAddForm() {
    setEditingId(null);
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    setForm({
      ...EMPTY_FORM,
      category: activeCategory !== 'all' ? activeCategory : 'cpvc',
      hsn_code: cat?.hsn_default || '3917',
    });
    setShowForm(true);
  }

  function openEditForm(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      gst_percent: String(p.gst_percent),
      hsn_code: p.hsn_code,
      unit: p.unit,
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      gst_percent: parseFloat(form.gst_percent),
      ...(editingId ? { id: editingId } : {}),
    };

    const res = await fetch('/api/products', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editingId ? 'Product updated' : 'Product added');
      setShowForm(false);
      fetchProducts();
    } else {
      toast.error('Failed to save product');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Product deleted');
      fetchProducts();
    } else {
      toast.error('Failed to delete');
    }
  }

  async function toggleActive(p: Product) {
    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, is_active: !p.is_active }),
    });
    if (res.ok) fetchProducts();
  }

  function handleCategoryChange(catId: string) {
    const cat = CATEGORIES.find((c) => c.id === catId);
    setForm((prev) => ({
      ...prev,
      category: catId,
      hsn_code: cat?.hsn_default || prev.hsn_code,
    }));
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Products
          </h1>
          <p className="text-[13px] font-medium text-[#86868B] mt-1">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] text-[#6E6E73] rounded-xl px-4 py-2.5 text-[13px] font-semibold hover:border-[rgba(0,0,0,0.15)] hover:text-[#1A1A1A] transition-all shadow-sm cursor-pointer">
            <Upload size={15} />
            Bulk Update
            <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              const lines = text.split('\n').filter(l => l.trim());
              if (lines.length < 2) { toast.error('CSV must have header + data rows'); return; }
              const header = lines[0].toLowerCase();
              const nameIdx = header.split(',').findIndex(h => h.trim().includes('name'));
              const priceIdx = header.split(',').findIndex(h => h.trim().includes('price'));
              if (nameIdx === -1 || priceIdx === -1) { toast.error('CSV must have "name" and "price" columns'); return; }
              const updates = lines.slice(1).map(line => {
                const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                return { name: cols[nameIdx], price: cols[priceIdx] };
              }).filter(u => u.name && u.price);
              if (updates.length === 0) { toast.error('No valid rows found'); return; }
              const res = await fetch('/api/products/bulk-update', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates }),
              });
              const data = await res.json();
              toast.success(`Updated ${data.success} products (${data.failed} failed)`);
              fetchProducts();
              e.target.value = '';
            }} />
          </label>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-[#1A1A1A] text-white rounded-xl px-5 py-2.5 text-[13px] font-bold hover:bg-black transition-all cursor-pointer"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Category Ribbon */}
      <div className="mb-4 overflow-x-auto">
        <GlassPillSelector
          items={[{ id: 'all', label: 'All' }, ...CATEGORIES.map(c => ({ id: c.id, label: c.label }))]}
          value={activeCategory}
          onChange={(id) => { setActiveCategory(id); setActiveSubType('all'); setActiveSize('all'); }}
        />
      </div>

      {/* Sub-Type Ribbon (SWR) */}
      {activeCategory === 'swr' && (
        <div className="mb-3">
          <GlassPillSelector
            items={[{ id: 'all', label: 'All Types' }, { id: 'Pushfit', label: 'Pushfit' }, { id: 'Solfit', label: 'Solfit' }, { id: 'Common', label: 'Common' }]}
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
        products.forEach((prod) => {
          const s = prod.size?.trim();
          if (s && SIZES_ORDER.includes(s)) sizeSet.add(s);
        });
        const sizes = [...sizeSet].sort((a, b) => SIZES_ORDER.indexOf(a) - SIZES_ORDER.indexOf(b));
        if (sizes.length === 0) return null;

        return (
          <div className="mb-4 overflow-x-auto">
            <GlassPillSelector
              items={[{ id: 'all', label: 'All Sizes' }, ...sizes.map(s => ({ id: s, label: `${s}"` }))]}
              value={activeSize}
              onChange={setActiveSize}
              size="sm"
            />
          </div>
        );
      })()}

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]"
        />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[rgba(0,0,0,0.07)] rounded-2xl pl-11 pr-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-all shadow-sm"
        />
      </div>

      {/* Product Count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-semibold text-[#86868B]">
          {products.filter((prod) => {
            if (activeSubType !== 'all') {
              if (activeSubType === 'Common') {
                if (prod.sub_type !== 'Common' && prod.sub_type !== 'General') return false;
              } else if (prod.sub_type !== activeSubType) return false;
            }
            if (activeSize === 'all') return true;
            const s = prod.size?.trim() || '';
            return s === activeSize || s.startsWith(activeSize + '"') || s.startsWith(activeSize + ' ') || s.startsWith(activeSize + 'x');
          }).length} products
          {activeSubType !== 'all' && <span> · {activeSubType}</span>}
          {activeSize !== 'all' && <span> · size {activeSize}&quot;</span>}
          {activeCategory !== 'all' && <span> · {CATEGORIES.find(c => c.id === activeCategory)?.label}</span>}
        </p>
      </div>

      {/* Products Table */}
      <div className="bento-card-static overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E2]">
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Product Name
              </th>
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Category
              </th>
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                HSN
              </th>
              <th className="text-right px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Price
              </th>
              <th className="text-center px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                GST%
              </th>
              <th className="text-center px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Unit
              </th>
              <th className="text-center px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Active
              </th>
              <th className="text-right px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}><SkeletonTable rows={6} cols={6} /></td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-[14px] font-medium text-[#86868B]">
                  No products found. Add your first product to get started.
                </td>
              </tr>
            ) : (
              products
              .filter((prod) => {
                if (activeSubType !== 'all') {
                  if (activeSubType === 'Common') {
                    if (prod.sub_type !== 'Common' && prod.sub_type !== 'General') return false;
                  } else if (prod.sub_type !== activeSubType) return false;
                }
                if (activeSize === 'all') return true;
                const s = prod.size?.trim() || '';
                return s === activeSize || s.startsWith(activeSize + '"') || s.startsWith(activeSize + ' ') || s.startsWith(activeSize + 'x');
              })
              .map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#F0F0F2] last:border-b-0 hover:bg-[#F9F9FB] transition-colors"
                >
                  <td className="px-5 py-3.5 text-[14px] text-[#1A1A1A] font-semibold">
                    {p.name}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-[#F0F0F2] text-[#6E6E73] px-2.5 py-1 rounded-full">
                      {CATEGORIES.find((c) => c.id === p.category)?.label || p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] font-semibold text-[#86868B] bg-[#F0F0F2] px-2 py-1 rounded-md">
                      {p.hsn_code}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-[14px] font-bold text-[#1A1A1A]">
                    ₹{p.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-center text-[13px] font-semibold text-[#6E6E73]">
                    {p.gst_percent}%
                  </td>
                  <td className="px-5 py-3.5 text-center text-[12px] font-semibold text-[#6E6E73]">
                    {p.unit}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`w-9 h-5 rounded-full relative transition-colors ${
                        p.is_active ? 'bg-[#1C9E5A]' : 'bg-[#E0E0E2]'
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${
                          p.is_active ? 'left-[18px]' : 'left-[3px]'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditForm(p)}
                        aria-label={`Edit ${p.name}`}
                        className="p-2 rounded-lg hover:bg-[#F0F0F2] transition-all text-[#6E6E73] cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        aria-label={`Delete ${p.name}`}
                        className="p-2 rounded-lg hover:bg-[#FFF0F0] transition-all text-[#6E6E73] hover:text-[#E03020] cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/25 z-50 flex items-center justify-center p-4">
          <div className="bento-card-static w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg hover:bg-[#F0F0F2] text-[#6E6E73] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                  placeholder="e.g. CPVC 110mm Pipe"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2">
                    HSN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={form.hsn_code}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, hsn_code: e.target.value }))
                    }
                    className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2">
                    GST %
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={form.gst_percent}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        gst_percent: e.target.value,
                      }))
                    }
                    className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2">
                    Unit
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-white border border-[rgba(0,0,0,0.07)] text-[#6E6E73] rounded-xl py-3 text-[13px] font-semibold hover:border-[rgba(0,0,0,0.15)] hover:text-[#1A1A1A] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#1A1A1A] text-white rounded-xl py-3 text-[13px] font-bold hover:bg-black transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
