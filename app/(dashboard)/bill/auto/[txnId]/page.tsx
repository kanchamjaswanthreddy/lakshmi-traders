'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { displayDate, todayISO } from '@/lib/date';
import { Shuffle, Check, AlertTriangle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import CategorySelector from '@/components/CategorySelector';
import BillTable from '@/components/BillTable';
import DateInput from '@/components/DateInput';
import { BillFormItem, PhonePeTransaction } from '@/types';

export default function AutoBillPage({
  params,
}: {
  params: Promise<{ txnId: string }>;
}) {
  const { txnId } = use(params);
  const router = useRouter();

  const [txn, setTxn] = useState<PhonePeTransaction | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTransaction = useCallback(async () => {
    if (txnId === 'new') return;
    try {
      const res = await fetch(
        `/api/phonepe/transactions?startDate=2020-01-01&endDate=2030-12-31`
      );
      const data = await res.json();
      const found = data.transactions?.find(
        (t: PhonePeTransaction) => t.txn_id === txnId
      );
      if (found) {
        setTxn(found);
        setCustomerName(found.customer_name || '');
        setTargetAmount(found.amount);
        setTxnDateInput(format(new Date(found.txn_date), 'yyyy-MM-dd'));
        setRemarks(
          `PhonePe - ${displayDate(format(new Date(found.txn_date), 'yyyy-MM-dd'))} - ₹${found.amount}`
        );
      }
    } catch {
      toast.error('Failed to load transaction');
    }
  }, [txnId]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  async function handleAutoFill() {
    if (selectedCategories.length === 0) {
      toast.error('Select at least one category');
      return;
    }
    if (targetAmount <= 0) {
      toast.error('Enter a target amount');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auto-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: selectedCategories,
          targetAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      const mapped: BillFormItem[] = data.items.map(
        (item: { product: { id: string; name: string; hsn_code: string; unit: string; price: number; gst_percent: number }; quantity: number; amount: number }) => ({
          productId: item.product.id,
          productName: item.product.name,
          hsnCode: item.product.hsn_code,
          quantity: item.quantity,
          unit: item.product.unit,
          rate: item.product.price,
          gstPercent: item.product.gst_percent,
          amount: item.amount,
        })
      );

      setItems(mapped);
      toast.success('Items auto-filled');
    } catch {
      toast.error('Auto-fill failed');
    }
    setLoading(false);
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

  function handleDeleteItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddRow() {
    setItems((prev) => [
      ...prev,
      { productId: '', productName: '', hsnCode: '', quantity: 1, unit: 'NOS', rate: 0, gstPercent: 18, amount: 0 },
    ]);
  }

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const cgstAmount = subtotal * (cgstPercent / 100);
  const sgstAmount = subtotal * (sgstPercent / 100);
  const grandTotal = subtotal + cgstAmount + sgstAmount;
  const diff = grandTotal - targetAmount;
  const isMatched = targetAmount > 0 && diff >= 0 && diff <= 200;
  const isOver = targetAmount > 0 && diff > 200;

  async function handleSave(autoPrint = false) {
    if (items.length === 0) { toast.error('Add at least one item'); return; }
    if (!customerName.trim()) { toast.error('Enter customer name'); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerAddress: customerAddress || null,
          customerGstin: customerGstin || null,
          customerState: customerState || null,
          date: billDate,
          dateOfDelivery: dateOfDelivery || null,
          vehicleNo: vehicleNo || null,
          items: items.map((item) => ({
            productId: item.productId || null, productName: item.productName, hsnCode: item.hsnCode,
            quantity: item.quantity, unit: item.unit, rate: item.rate, gstPercent: item.gstPercent, amount: item.amount,
          })),
          source: txnId !== 'new' ? 'phonepe' : 'manual',
          phonepeTxnId: txnId !== 'new' ? txnId : null,
          phonepeDate: txnDateInput || null,
          phonepeAmount: txn ? txn.amount : null,
          remarks: remarks || null,
          manualBillNumber: billNumber.trim() || undefined,
          cgstPercent,
          sgstPercent,
        }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to save bill'); setSaving(false); return; }

      toast.success(`Bill #${data.billNumber} created`);
      router.push(`/bill/preview/${data.bill.id}${autoPrint ? '?print=true' : ''}`);
    } catch {
      toast.error('Failed to save bill');
    }
    setSaving(false);
  }

  const inputClass = "w-full min-w-0 bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
          Auto Bill
        </h1>
        <p className="text-[13px] font-medium text-[#86868B] mt-1">
          {txnId !== 'new' ? 'Create bill from PhonePe transaction' : 'Auto-generate items to match a target amount'}
        </p>
      </div>

      {/* Transaction Info */}
      <div className="bento-card-static p-6 mb-4">
        <p className="text-[15px] font-bold text-[#1A1A1A] mb-4">Transaction Details</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6">
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
            <label className={labelClass}>Target Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#86868B]">₹</span>
              <input type="number" value={targetAmount || ''} onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 0)} className={`${inputClass} pl-8 font-mono font-bold`} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Txn Date</label>
            <DateInput value={txnDateInput} onChange={setTxnDateInput} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Customer GSTIN</label>
            <input type="text" value={customerGstin} onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())} className={`${inputClass} font-mono uppercase`} placeholder="e.g. 37AABCU9603R1ZM" />
          </div>
        </div>
      </div>

      {/* Step 1: Categories */}
      <div className="bento-card-static p-6 mb-4">
        <p className="text-[15px] font-bold text-[#1A1A1A] mb-1">Step 1 — Select Categories</p>
        <p className="text-[12px] font-medium text-[#86868B] mb-4">Choose which product categories to pick items from</p>
        <CategorySelector
          selected={selectedCategories}
          onToggle={(id) => setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])}
        />
        <div className="flex gap-3 mt-5">
          <button onClick={handleAutoFill} disabled={loading}
            className="flex-1 bg-[#1A1A1A] text-white rounded-2xl py-3.5 text-[14px] font-bold hover:bg-black transition-all disabled:opacity-50">
            {loading ? 'Finding items...' : 'Auto Fill Items'}
          </button>
          {items.length > 0 && (
            <button onClick={handleAutoFill} disabled={loading}
              className="flex items-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] rounded-2xl px-5 py-3.5 text-[13px] font-semibold text-[#6E6E73] hover:border-[rgba(0,0,0,0.15)] hover:text-[#1A1A1A] transition-all shadow-sm">
              <Shuffle size={15} /> Re-shuffle
            </button>
          )}
        </div>
      </div>

      {/* Step 2: Items Table */}
      {items.length > 0 && (
        <div className="bento-card-static p-6 mb-4 overflow-hidden">
          <p className="text-[15px] font-bold text-[#1A1A1A] mb-4">Step 2 — Review & Edit Items</p>
          <BillTable items={items} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddRow={handleAddRow} />

          <div className="mt-5 pt-5 border-t border-[#E0E0E2]">
            {targetAmount > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-medium text-[#86868B]">Progress to target</span>
                  <span className="text-[12px] font-mono font-bold text-[#6E6E73]">₹{grandTotal.toFixed(0)} / ₹{targetAmount.toFixed(0)}</span>
                </div>
                <div className="bg-[#E8E8EA] rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#1A1A1A] transition-all" style={{ width: `${Math.min((grandTotal / targetAmount) * 100, 100)}%` }} />
                </div>
              </div>
            )}

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
              <div className="flex justify-between text-[16px] font-bold pt-3 border-t border-[#E0E0E2]">
                <span className="text-[#1A1A1A]">Grand Total</span>
                <span className="font-mono text-[#1A1A1A]">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {isMatched && (
              <div className="flex items-center gap-2 mt-4 bg-[#F0FBF5] border border-[#C3E9D5] rounded-2xl px-4 py-3">
                <Check size={16} className="text-[#1C9E5A]" />
                <span className="text-[13px] font-semibold text-[#1C9E5A]">Amount matched (₹{diff.toFixed(0)} over target)</span>
              </div>
            )}
            {isOver && (
              <div className="flex items-center gap-2 mt-4 bg-[#FFF0F0] border border-[#F5B8B8] rounded-2xl px-4 py-3">
                <AlertTriangle size={16} className="text-[#E03020]" />
                <span className="text-[13px] font-semibold text-[#E03020]">₹{diff.toFixed(0)} over target — adjust items or re-shuffle</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Details */}
      {items.length > 0 && (
        <div className="bento-card-static p-6 mb-4">
          <p className="text-[15px] font-bold text-[#1A1A1A] mb-4">Customer Details (Optional)</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div><label className={labelClass}>Address</label><input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>State</label><input type="text" value={customerState} onChange={(e) => setCustomerState(e.target.value)} className={inputClass} placeholder="Andhra Pradesh" /></div>
            <div><label className={labelClass}>Vehicle No</label><input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value.toUpperCase())} className={`${inputClass} uppercase`} /></div>
            <div><label className={labelClass}>Date of Delivery</label><DateInput value={dateOfDelivery} onChange={setDateOfDelivery} className={inputClass} /></div>
            <div><label className={labelClass}>Remarks</label><input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} className={inputClass} /></div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex gap-3">
          <button onClick={() => handleSave(false)} disabled={saving}
            className="flex-1 bg-[#1A1A1A] text-white rounded-2xl py-4 text-[15px] font-bold hover:bg-black transition-all disabled:opacity-50 cursor-pointer">
            {saving ? 'Saving...' : 'Save & Preview'}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="flex items-center justify-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] text-[#1A1A1A] rounded-2xl px-6 py-4 text-[15px] font-bold hover:bg-[#F5F5F7] transition-all disabled:opacity-50 shadow-sm cursor-pointer">
            <Printer size={18} /> Print
          </button>
        </div>
      )}
    </div>
  );
}
