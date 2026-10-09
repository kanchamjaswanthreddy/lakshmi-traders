'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProductSearch from '@/components/ProductSearch';
import ProductBrowser from '@/components/ProductBrowser';
import BillTable from '@/components/BillTable';
import DateInput from '@/components/DateInput';
import { BillFormItem, Product, CustomerType, getProductPrice } from '@/types';
import { ShoppingCart, Printer, ChevronDown, ChevronUp, Package, Store, Users, UserCheck } from 'lucide-react';
import GlassPillSelector from '@/components/GlassPillSelector';
import { todayISO } from '@/lib/date';

export default function ManualBillPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [items, setItems] = useState<BillFormItem[]>([{ productId: '', productName: '', hsnCode: '', quantity: 1, unit: 'NOS', rate: 0, gstPercent: 18, amount: 0 }]);
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
  const [showProducts, setShowProducts] = useState(true);
  const [customerType, setCustomerType] = useState<CustomerType>('customer');

  function handleProductSelect(product: Product) {
    const rate = getProductPrice(product, customerType);
    setItems((prev) => [
      ...prev,
      { productId: product.id, productName: product.name, hsnCode: product.hsn_code, quantity: 1, unit: product.unit, rate, gstPercent: product.gst_percent, amount: rate },
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

  const inputClass = "w-full min-w-0 bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-1.5";
  const compactInput = "w-full min-w-0 bg-[#F0F0F2] border border-[#E0E0E2] rounded-lg px-3 py-2 text-[12px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all";
  const compactLabel = "block text-[9px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-1";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Manual Bill</h1>
          <p className="text-[13px] font-medium text-[#86868B] mt-0.5">Add products, build your bill</p>
        </div>
        {/* Live Grand Total badge */}
        {items.length > 0 && subtotal > 0 && (
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">Grand Total</p>
            <p className="text-[22px] font-black font-mono text-[#1A1A1A] tracking-tight">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        )}
      </div>

      {/* ═══ TOP: Bill Info + Customer Details (single card) ═══ */}
      <div className="bento-card-static p-4 mb-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="col-span-2 lg:col-span-1">
            <label className={compactLabel}>Customer Name</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={compactInput} placeholder="Customer name" />
          </div>
          <div>
            <label className={compactLabel}>Bill Date</label>
            <DateInput value={billDate} onChange={setBillDate} className={compactInput} />
          </div>
          <div>
            <label className={compactLabel}>Bill Number</label>
            <input type="text" value={billNumber} onChange={(e) => setBillNumber(e.target.value)} className={`${compactInput} font-mono`} placeholder="Auto" />
          </div>
          <div>
            <label className={compactLabel}>Txn Date</label>
            <DateInput value={txnDateInput} onChange={setTxnDateInput} className={compactInput} />
          </div>
          <div>
            <label className={compactLabel}>Target Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#86868B]">₹</span>
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value ? parseFloat(e.target.value) : '')} className={`${compactInput} pl-7 font-mono font-bold`} placeholder="0.00" />
            </div>
          </div>
        </div>

        {/* Customer Details toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E0E0E2] w-full cursor-pointer"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Customer Details</span>
          {!showDetails && (customerGstin || customerAddress) && (
            <div className="flex flex-wrap gap-1.5 ml-2">
              {customerGstin && <span className="text-[10px] font-mono font-semibold text-[#6E6E73] bg-[#F0F0F2] rounded-md px-2 py-0.5">GSTIN: {customerGstin}</span>}
              {customerAddress && <span className="text-[10px] font-medium text-[#6E6E73] bg-[#F0F0F2] rounded-md px-2 py-0.5 truncate max-w-[200px]">{customerAddress}</span>}
            </div>
          )}
          <span className="ml-auto">{showDetails ? <ChevronUp size={14} className="text-[#86868B]" /> : <ChevronDown size={14} className="text-[#86868B]" />}</span>
        </button>
        {showDetails && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            <div><label className={compactLabel}>GSTIN</label><input type="text" value={customerGstin} onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())} className={`${compactInput} font-mono uppercase`} /></div>
            <div><label className={compactLabel}>State</label><input type="text" value={customerState} onChange={(e) => setCustomerState(e.target.value)} className={compactInput} placeholder="Andhra Pradesh" /></div>
            <div className="col-span-2"><label className={compactLabel}>Address</label><input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className={compactInput} /></div>
            <div><label className={compactLabel}>Vehicle No</label><input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value.toUpperCase())} className={`${compactInput} uppercase`} /></div>
            <div><label className={compactLabel}>Delivery Date</label><DateInput value={dateOfDelivery} onChange={setDateOfDelivery} className={compactInput} /></div>
            <div className="col-span-2"><label className={compactLabel}>Remarks</label><input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} className={compactInput} /></div>
          </div>
        )}
      </div>

      {/* ═══ CUSTOMER TYPE SELECTOR ═══ */}
      <div className="bento-card-static p-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] mr-1">Pricing</span>
          <button
            onClick={() => setCustomerType('shop')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
              customerType === 'shop'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-[#F0F0F2] text-[#6E6E73] hover:bg-[#E8E8EA]'
            }`}
          >
            <Store size={13} />
            Shop
          </button>
          <button
            onClick={() => setCustomerType('customer')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
              customerType === 'customer'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-[#F0F0F2] text-[#6E6E73] hover:bg-[#E8E8EA]'
            }`}
          >
            <Users size={13} />
            Customer
          </button>
          <button
            onClick={() => setCustomerType('customer2')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
              customerType === 'customer2'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-[#F0F0F2] text-[#6E6E73] hover:bg-[#E8E8EA]'
            }`}
          >
            <UserCheck size={13} />
            Customer 2
          </button>
          <span className="text-[10px] font-medium text-[#86868B] ml-2">
            {customerType === 'shop' ? '5% margin' : customerType === 'customer' ? '10% margin' : '15% margin'}
          </span>
        </div>
      </div>

      {/* ═══ PRODUCT PICKER (collapsible, full width) ═══ */}
      <div className="bento-card-static mb-4 overflow-hidden">
        <button
          onClick={() => setShowProducts(!showProducts)}
          className="flex items-center justify-between w-full p-4 pb-0 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Package size={15} className="text-[#6E6E73]" />
            <span className="text-[14px] font-bold text-[#1A1A1A]">Products</span>
          </div>
          <div className="flex items-center gap-3">
            {showProducts && (
              <GlassPillSelector
                items={[{ id: 'browse', label: 'Browse' }, { id: 'search', label: 'Search' }]}
                value={pickerMode}
                onChange={(id) => setPickerMode(id as 'browse' | 'search')}
                size="sm"
              />
            )}
            {showProducts ? <ChevronUp size={15} className="text-[#86868B]" /> : <ChevronDown size={15} className="text-[#86868B]" />}
          </div>
        </button>
        {showProducts && (
          <div className="p-4 pt-3">
            {pickerMode === 'search' ? (
              <ProductSearch onSelect={handleProductSelect} customerType={customerType} />
            ) : (
              <ProductBrowser onSelect={handleProductSelect} customerType={customerType} />
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {target > 0 && items.length > 0 && (
        <div className="bento-card-static px-5 py-3 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-[#86868B]">Progress to target</span>
            <span className="text-[11px] font-mono font-bold text-[#6E6E73]">₹{grandTotal.toFixed(0)} / ₹{target.toFixed(0)}</span>
          </div>
          <div className="bg-[#E8E8EA] rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-[#1A1A1A] transition-all" style={{ width: `${Math.min((grandTotal / target) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {/* ═══ BILL TABLE (full width, main focus) ═══ */}
      <div className="bento-card-static p-5 overflow-hidden">
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
          {!showProducts && (
            <button onClick={() => setShowProducts(true)} className="text-[12px] font-semibold text-[#0066CC] hover:underline cursor-pointer">
              Show Products
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#E0E0E2] rounded-2xl">
            <ShoppingCart size={32} className="mx-auto text-[#E0E0E2] mb-3" />
            <p className="text-[14px] font-semibold text-[#86868B]">No items yet</p>
            <p className="text-[12px] font-medium text-[#86868B] mt-1">
              Select products above to add them to the bill
            </p>
          </div>
        ) : (
          <>
            <BillTable items={items} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddRow={handleAddRow} />

            {/* Totals — full width row layout */}
            <div className="mt-6 pt-5 border-t border-[#E0E0E2]">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                {/* Left side: action buttons */}
                <div className="flex gap-3 order-2 lg:order-1">
                  <button onClick={() => handleSave(false)} disabled={saving}
                    className="flex-1 lg:flex-none bg-[#1A1A1A] text-white rounded-2xl px-10 py-4 text-[15px] font-bold hover:bg-black transition-all disabled:opacity-50 cursor-pointer">
                    {saving ? 'Saving...' : 'Save & Preview'}
                  </button>
                  <button onClick={() => handleSave(true)} disabled={saving}
                    className="flex items-center justify-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] text-[#1A1A1A] rounded-2xl px-6 py-4 text-[15px] font-bold hover:bg-[#F5F5F7] transition-all disabled:opacity-50 shadow-sm cursor-pointer">
                    <Printer size={18} /> Print
                  </button>
                  <button onClick={() => handleSave(false, true)} disabled={saving}
                    className="flex items-center justify-center gap-2 bg-[#F0F6FF] border border-[#B8D4F5] text-[#0066CC] rounded-2xl px-6 py-4 text-[14px] font-bold hover:bg-[#E3F2FD] transition-all disabled:opacity-50 cursor-pointer">
                    Estimate
                  </button>
                </div>

                {/* Right side: totals */}
                <div className="space-y-2 w-full lg:w-[340px] order-1 lg:order-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="font-medium text-[#6E6E73]">Subtotal</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[13px] items-center">
                    <span className="font-medium text-[#6E6E73] flex items-center gap-1">
                      CGST
                      <input type="number" value={cgstPercent} onChange={(e) => setCgstPercent(parseFloat(e.target.value) || 0)} className="w-12 bg-transparent border border-transparent hover:border-[#E0E0E2] rounded px-1 py-0.5 text-center outline-none focus:border-[#1A1A1A] focus:bg-white transition-all" />%
                    </span>
                    <span className="font-mono font-semibold text-[#6E6E73]">₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[13px] items-center">
                    <span className="font-medium text-[#6E6E73] flex items-center gap-1">
                      SGST
                      <input type="number" value={sgstPercent} onChange={(e) => setSgstPercent(parseFloat(e.target.value) || 0)} className="w-12 bg-transparent border border-transparent hover:border-[#E0E0E2] rounded px-1 py-0.5 text-center outline-none focus:border-[#1A1A1A] focus:bg-white transition-all" />%
                    </span>
                    <span className="font-mono font-semibold text-[#6E6E73]">₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[20px] font-bold pt-3 border-t border-[#E0E0E2]">
                    <span className="text-[#1A1A1A]">Grand Total</span>
                    <span className="font-mono text-[#1A1A1A]">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
