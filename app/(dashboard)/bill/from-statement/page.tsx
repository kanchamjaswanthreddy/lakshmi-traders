'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProductSearch from '@/components/ProductSearch';
import ProductBrowser from '@/components/ProductBrowser';
import BillTable from '@/components/BillTable';
import DateInput from '@/components/DateInput';
import { todayISO } from '@/lib/date';
import { BillFormItem, Product } from '@/types';
import { ShoppingCart, Printer, Upload, File } from 'lucide-react';
import GlassPillSelector from '@/components/GlassPillSelector';

export default function BillFromStatementPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [items, setItems] = useState<BillFormItem[]>([]);
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [dateOfDelivery, setDateOfDelivery] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState(todayISO());
  const [txnDateInput, setTxnDateInput] = useState('');
  const [cgstPercent, setCgstPercent] = useState(9);
  const [sgstPercent, setSgstPercent] = useState(9);
  const [saving, setSaving] = useState(false);
  const [pickerMode, setPickerMode] = useState<'browse' | 'search'>('browse');
  const [showDetails, setShowDetails] = useState(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    } else {
      toast.error('Please upload a valid PDF file');
    }
  }

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
  const target = typeof targetAmount === 'number' ? targetAmount : 0;

  async function handleSave(autoPrint = false, isEstimate = false) {
    if (items.length === 0) { toast.error('Add at least one item'); return; }
    if (!customerName.trim()) { toast.error('Enter customer name'); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(), customerAddress: customerAddress || null, customerGstin: customerGstin || null,
          customerState: customerState || null, date: billDate, dateOfDelivery: dateOfDelivery || null,
          vehicleNo: vehicleNo || null,
          items: items.map((item) => ({ productId: item.productId || null, productName: item.productName, hsnCode: item.hsnCode, quantity: item.quantity, unit: item.unit, rate: item.rate, gstPercent: item.gstPercent, amount: item.amount })),
          source: 'manual', phonepeDate: txnDateInput || null, remarks: remarks || null, isEstimate,
          manualBillNumber: billNumber.trim() || undefined,
          cgstPercent,
          sgstPercent,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to save bill'); setSaving(false); return; }
      toast.success(`Bill #${data.billNumber} created`);
      router.push(`/bill/preview/${data.bill.id}${autoPrint ? '?print=true' : ''}`);
    } catch { toast.error('Failed to save bill'); }
    setSaving(false);
  }

  const inputClass = "w-full min-w-0 bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2";

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* ── LEFT: PDF Viewer ── */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="bento-card-static p-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Statement PDF</h1>
            <p className="text-[12px] font-medium text-[#86868B] mt-1">Upload to view alongside billing</p>
          </div>
          <label className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-[13px] font-bold cursor-pointer hover:bg-black transition-colors shadow-sm">
            <Upload size={16} />
            {pdfUrl ? 'Replace PDF' : 'Upload PDF'}
            <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
        
        {pdfUrl ? (
          <div className="bento-card-static flex-1 overflow-hidden relative">
            <iframe src={pdfUrl} className="absolute inset-0 w-full h-full border-0 rounded-2xl" />
          </div>
        ) : (
          <div className="bento-card-static flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#E0E0E2] text-center p-8 bg-[#F8F8F9]">
            <File size={48} className="text-[#E0E0E2] mb-4" />
            <p className="text-[15px] font-bold text-[#1A1A1A]">No PDF Uploaded</p>
            <p className="text-[13px] font-medium text-[#86868B] mt-1 mb-6 max-w-xs">
              Upload your bank statement PDF to view it here while you create bills.
            </p>
            <label className="flex items-center gap-2 bg-white border border-[#E0E0E2] text-[#1A1A1A] px-6 py-3 rounded-xl text-[14px] font-bold cursor-pointer hover:bg-[#F5F5F7] transition-all shadow-sm">
              <Upload size={16} />
              Browse Files
              <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}
      </div>

      {/* ── RIGHT: Bill Creation ── */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-y-auto pr-2 pb-10 custom-scrollbar">
        
        {/* Customer Info Bar */}
        <div className="bento-card-static p-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[15px] font-bold text-[#1A1A1A]">Customer Details</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className={labelClass}>Customer Name</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} placeholder="Customer name" />
            </div>
            <div>
              <label className={labelClass}>Bill Date</label>
              <DateInput value={billDate} onChange={setBillDate} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bill Number</label>
              <input type="text" value={billNumber} onChange={(e) => setBillNumber(e.target.value)} className={`${inputClass} font-mono`} placeholder="Auto" />
            </div>
            <div>
              <label className={labelClass}>Txn Date</label>
              <DateInput value={txnDateInput} onChange={setTxnDateInput} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Target Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#86868B]">₹</span>
                <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value ? parseFloat(e.target.value) : '')} className={`${inputClass} pl-8 font-mono font-bold`} placeholder="0.00" />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full bg-[#F5F5F7] border border-[rgba(0,0,0,0.07)] rounded-xl px-4 py-3 text-[13px] font-semibold text-[#6E6E73] hover:border-[rgba(0,0,0,0.12)] transition-all text-center"
              >
                {showDetails ? 'Hide' : 'Add'} Details
              </button>
            </div>
          </div>

          {/* Expandable Customer Details */}
          {showDetails && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4 pt-4 border-t border-[#E0E0E2]">
              <div className="sm:col-span-2"><label className={labelClass}>Address</label><input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>GSTIN</label><input type="text" value={customerGstin} onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())} className={`${inputClass} font-mono uppercase`} /></div>
              <div><label className={labelClass}>State</label><input type="text" value={customerState} onChange={(e) => setCustomerState(e.target.value)} className={inputClass} placeholder="Andhra Pradesh" /></div>
              <div><label className={labelClass}>Vehicle No</label><input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value.toUpperCase())} className={`${inputClass} uppercase`} /></div>
              <div><label className={labelClass}>Date of Delivery</label><DateInput value={dateOfDelivery} onChange={setDateOfDelivery} className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Remarks</label><input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} className={inputClass} /></div>
            </div>
          )}
        </div>

        {/* Product Picker */}
        <div className="bento-card-static p-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[15px] font-bold text-[#1A1A1A]">Products</p>
            <GlassPillSelector
              items={[{ id: 'browse', label: 'Browse' }, { id: 'search', label: 'Search' }]}
              value={pickerMode}
              onChange={(id) => setPickerMode(id as 'browse' | 'search')}
              size="sm"
            />
          </div>
          {pickerMode === 'search' ? (
            <ProductSearch onSelect={handleProductSelect} />
          ) : (
            <ProductBrowser onSelect={handleProductSelect} />
          )}
        </div>

        {/* Bill Items */}
        <div className="bento-card-static p-5 shrink-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-[#6E6E73]" />
              <p className="text-[15px] font-bold text-[#1A1A1A]">Bill Items</p>
              {items.length > 0 && (
                <span className="bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#E0E0E2] rounded-2xl">
              <ShoppingCart size={28} className="mx-auto text-[#E0E0E2] mb-3" />
              <p className="text-[14px] font-semibold text-[#86868B]">No items yet</p>
              <p className="text-[12px] font-medium text-[#86868B] mt-1">
                Browse products above and click + to add
              </p>
            </div>
          ) : (
            <>
              <BillTable items={items} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddRow={handleAddRow} />

              {/* Progress Bar */}
              {target > 0 && (
                <div className="mt-5 bg-[#F5F5F7] rounded-xl px-4 py-3 border border-[#E0E0E2]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-[#86868B]">Progress to target</span>
                    <span className="text-[12px] font-mono font-bold text-[#1A1A1A]">₹{grandTotal.toFixed(0)} / ₹{target.toFixed(0)}</span>
                  </div>
                  <div className="bg-[#E8E8EA] rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-[#1A1A1A] transition-all" style={{ width: `${Math.min((grandTotal / target) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="mt-5 pt-5 border-t border-[#E0E0E2]">
                <div className="space-y-2 max-w-sm ml-auto">
                  <div className="flex justify-between text-[13px]">
                    <span className="font-medium text-[#6E6E73]">Subtotal</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">₹{subtotal.toFixed(2)}</span>
                  </div>
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
                  <div className="flex justify-between text-[18px] font-bold pt-3 border-t border-[#E0E0E2]">
                    <span className="text-[#1A1A1A]">Grand Total</span>
                    <span className="font-mono text-[#1A1A1A]">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button onClick={() => handleSave(false)} disabled={saving}
                  className="flex-1 bg-[#1A1A1A] text-white rounded-2xl py-4 text-[15px] font-bold hover:bg-black transition-all disabled:opacity-50 cursor-pointer text-center">
                  {saving ? 'Saving...' : 'Save & Preview'}
                </button>
                <div className="flex gap-3">
                  <button onClick={() => handleSave(true)} disabled={saving}
                    className="flex-1 sm:flex-none items-center justify-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] text-[#1A1A1A] rounded-2xl px-6 py-4 text-[15px] font-bold hover:bg-[#F5F5F7] transition-all disabled:opacity-50 shadow-sm cursor-pointer flex">
                    <Printer size={18} /> Print
                  </button>
                  <button onClick={() => handleSave(false, true)} disabled={saving}
                    className="flex-1 sm:flex-none items-center justify-center gap-2 bg-[#F0F6FF] border border-[#B8D4F5] text-[#0066CC] rounded-2xl px-6 py-4 text-[14px] font-bold hover:bg-[#E3F2FD] transition-all disabled:opacity-50 cursor-pointer flex">
                    Estimate
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
