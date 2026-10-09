'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProductSearch from '@/components/ProductSearch';
import ProductBrowser from '@/components/ProductBrowser';
import BillTable from '@/components/BillTable';
import DateInput from '@/components/DateInput';
import { BillFormItem, Product, Bill } from '@/types';
import { ShoppingCart, Printer, ArrowLeft } from 'lucide-react';
import GlassPillSelector from '@/components/GlassPillSelector';
import Link from 'next/link';

export default function EditBillPage({ params }: { params: Promise<{ billId: string }> }) {
  const { billId } = use(params);
  const router = useRouter();

  const [bill, setBill] = useState<Bill | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<BillFormItem[]>([]);
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [dateOfDelivery, setDateOfDelivery] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [cgstPercent, setCgstPercent] = useState(9);
  const [sgstPercent, setSgstPercent] = useState(9);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pickerMode, setPickerMode] = useState<'browse' | 'search'>('browse');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function fetchBill() {
      const res = await fetch(`/api/bills/${billId}`);
      const data = await res.json();
      if (!data.bill) { toast.error('Bill not found'); setLoading(false); return; }
      const b: Bill = data.bill;
      setBill(b);
      setCustomerName(b.customer_name);
      setCustomerAddress(b.customer_address || '');
      setCustomerGstin(b.customer_gstin || '');
      setCustomerState(b.customer_state || '');
      setDateOfDelivery(b.date_of_delivery || '');
      setVehicleNo(b.vehicle_no || '');
      setRemarks(b.remarks || '');
      setCgstPercent(b.cgst_percent ?? 9);
      setSgstPercent(b.sgst_percent ?? 9);
      setItems((b.bill_items || []).map((item) => ({
        productId: item.product_id || '',
        productName: item.product_name,
        hsnCode: item.hsn_code,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        gstPercent: item.gst_percent,
        amount: item.amount,
      })));
      if (b.customer_address || b.customer_gstin || b.vehicle_no) setShowDetails(true);
      setLoading(false);
    }
    fetchBill();
  }, [billId]);

  function handleProductSelect(product: Product) {
    setItems((prev) => [
      ...prev,
      { productId: product.id, productName: product.name, hsnCode: product.hsn_code, quantity: 1, unit: product.unit, rate: product.price, gstPercent: product.gst_percent, amount: product.price },
    ]);
  }

  function handleUpdateItem(index: number, field: keyof BillFormItem, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity') updated.amount = updated.rate * (value as number);
        if (field === 'rate') updated.amount = (value as number) * updated.quantity;
        return updated;
      })
    );
  }

  function handleDeleteItem(index: number) { setItems((prev) => prev.filter((_, i) => i !== index)); }
  function handleAddRow() {
    setItems((prev) => [...prev, { productId: '', productName: '', hsnCode: '', quantity: 1, unit: 'NOS', rate: 0, gstPercent: 18, amount: 0 }]);
  }

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const cgstAmount = subtotal * (cgstPercent / 100);
  const sgstAmount = subtotal * (sgstPercent / 100);
  const grandTotal = subtotal + cgstAmount + sgstAmount;

  async function handleSave(autoPrint = false) {
    if (items.length === 0) { toast.error('Add at least one item'); return; }
    if (!customerName.trim()) { toast.error('Enter customer name'); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/bills/${billId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(), customerAddress: customerAddress || null,
          customerGstin: customerGstin || null, customerState: customerState || null,
          dateOfDelivery: dateOfDelivery || null, vehicleNo: vehicleNo || null,
          items: items.map((item) => ({
            productId: item.productId || null, productName: item.productName, hsnCode: item.hsnCode,
            quantity: item.quantity, unit: item.unit, rate: item.rate, gstPercent: item.gstPercent, amount: item.amount,
          })),
          remarks: remarks || null,
          cgstPercent,
          sgstPercent,
        }),
      });
      if (!res.ok) { toast.error('Failed to update bill'); setSaving(false); return; }
      toast.success('Bill updated');
      router.push(`/bill/preview/${billId}${autoPrint ? '?print=true' : ''}`);
    } catch { toast.error('Failed to update bill'); }
    setSaving(false);
  }

  const inputClass = "w-full min-w-0 bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2";

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><p className="text-[14px] font-medium text-[#86868B]">Loading bill...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/bill/preview/${billId}`} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6E6E73] hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <span className="text-[#E0E0E2]">|</span>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
          Edit Bill #{bill?.bill_number}
        </h1>
      </div>

      {/* Customer Info */}
      <div className="bento-card-static p-5 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6">
          <div>
            <label className={labelClass}>Customer Name</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Remarks</label>
            <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-end">
            <button onClick={() => setShowDetails(!showDetails)}
              className="w-full bg-[#F5F5F7] border border-[rgba(0,0,0,0.07)] rounded-xl px-4 py-3 text-[13px] font-semibold text-[#6E6E73] hover:border-[rgba(0,0,0,0.12)] transition-all text-center cursor-pointer">
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>
        </div>
        {showDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6 mt-4 pt-4 border-t border-[#E0E0E2]">
            <div><label className={labelClass}>Address</label><input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>GSTIN</label><input type="text" value={customerGstin} onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())} className={`${inputClass} font-mono uppercase`} /></div>
            <div><label className={labelClass}>State</label><input type="text" value={customerState} onChange={(e) => setCustomerState(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Vehicle No</label><input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value.toUpperCase())} className={`${inputClass} uppercase`} /></div>
            <div><label className={labelClass}>Date of Delivery</label><DateInput value={dateOfDelivery} onChange={setDateOfDelivery} className={inputClass} /></div>
          </div>
        )}
      </div>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <div className="bento-card-static p-5 lg:sticky lg:top-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-bold text-[#1A1A1A]">Add Products</p>
              <GlassPillSelector
                items={[{ id: 'browse', label: 'Browse' }, { id: 'search', label: 'Search' }]}
                value={pickerMode}
                onChange={(id) => setPickerMode(id as 'browse' | 'search')}
                size="sm"
              />
            </div>
            {pickerMode === 'search' ? <ProductSearch onSelect={handleProductSelect} /> : <ProductBrowser onSelect={handleProductSelect} />}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bento-card-static p-5 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart size={16} className="text-[#6E6E73]" />
              <p className="text-[15px] font-bold text-[#1A1A1A]">Bill Items</p>
              {items.length > 0 && <span className="bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{items.length}</span>}
            </div>

            <BillTable items={items} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddRow={handleAddRow} />

            <div className="mt-5 pt-5 border-t border-[#E0E0E2]">
              <div className="space-y-2 max-w-sm ml-auto">
                <div className="flex justify-between text-[13px]"><span className="font-medium text-[#6E6E73]">Subtotal</span><span className="font-mono font-bold text-[#1A1A1A]">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-[13px] items-center">
                  <span className="font-medium text-[#6E6E73] flex items-center gap-1">
                    CGST
                    <input type="number" value={cgstPercent} onChange={(e) => setCgstPercent(parseFloat(e.target.value) || 0)} className="w-12 bg-transparent border border-transparent hover:border-[#E0E0E2] rounded px-1 py-0.5 text-center outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"/>%
                  </span>
                  <span className="font-mono font-semibold text-[#6E6E73]">₹{cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px] items-center">
                  <span className="font-medium text-[#6E6E73] flex items-center gap-1">
                    SGST
                    <input type="number" value={sgstPercent} onChange={(e) => setSgstPercent(parseFloat(e.target.value) || 0)} className="w-12 bg-transparent border border-transparent hover:border-[#E0E0E2] rounded px-1 py-0.5 text-center outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"/>%
                  </span>
                  <span className="font-mono font-semibold text-[#6E6E73]">₹{sgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[18px] font-bold pt-3 border-t border-[#E0E0E2]"><span className="text-[#1A1A1A]">Grand Total</span><span className="font-mono text-[#1A1A1A]">₹{grandTotal.toFixed(2)}</span></div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex-1 bg-[#1A1A1A] text-white rounded-2xl py-4 text-[15px] font-bold hover:bg-black transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : 'Update Bill'}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving}
                className="flex items-center justify-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] text-[#1A1A1A] rounded-2xl px-6 py-4 text-[15px] font-bold hover:bg-[#F5F5F7] transition-all disabled:opacity-50 shadow-sm cursor-pointer">
                <Printer size={18} /> Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
