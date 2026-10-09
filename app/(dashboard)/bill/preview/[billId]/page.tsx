'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Printer, Download, MessageCircle, ArrowLeft, Trash2, Copy, Pencil, FileCheck, AlertTriangle, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import BillTemplate from '@/components/BillTemplate';
import PDFDownloadButton from '@/components/PDFDownloadButton';
import { Bill } from '@/types';

export default function BillPreviewPage({
  params,
}: {
  params: Promise<{ billId: string }>;
}) {
  const { billId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [ewayInput, setEwayInput] = useState('');
  const [savingEway, setSavingEway] = useState(false);

  useEffect(() => {
    async function fetchBill() {
      try {
        const res = await fetch(`/api/bills/${billId}`);
        const data = await res.json();
        if (data.bill) {
          setBill(data.bill);
          // Auto-print if redirected from bill creation
          if (searchParams.get('print') === 'true') {
            setTimeout(() => window.print(), 500);
          }
        }
        else toast.error('Bill not found');
      } catch { toast.error('Failed to load bill'); }
      setLoading(false);
    }
    fetchBill();
  }, [billId, searchParams]);

  async function handleDelete() {
    if (!bill) return;
    if (!confirm(`Delete Bill #${bill.bill_number}? It will be moved to the Recycle Bin.`)) return;
    const res = await fetch(`/api/bills/${billId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Bill moved to Recycle Bin');
      router.push('/history');
    } else {
      toast.error('Failed to delete bill');
    }
  }

  async function handleDuplicate() {
    if (!bill) return;
    // Re-create the bill with same items and customer
    const res = await fetch(`/api/bills/${billId}`);
    const data = await res.json();
    if (!data.bill) { toast.error('Could not load bill data'); return; }

    const items = (data.bill.bill_items || []).map((item: { product_id: string; product_name: string; hsn_code: string; quantity: number; unit: string; rate: number; gst_percent: number; amount: number }) => ({
      productId: item.product_id, productName: item.product_name, hsnCode: item.hsn_code,
      quantity: item.quantity, unit: item.unit, rate: item.rate, gstPercent: item.gst_percent, amount: item.amount,
    }));

    const createRes = await fetch('/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: bill.customer_name, customerAddress: bill.customer_address,
        customerGstin: bill.customer_gstin, customerState: bill.customer_state,
        date: new Date().toISOString().split('T')[0],
        dateOfDelivery: null, vehicleNo: bill.vehicle_no, items, source: 'manual',
        remarks: `Duplicate of Bill #${bill.bill_number}`,
      }),
    });

    const createData = await createRes.json();
    if (createRes.ok) {
      toast.success(`Duplicate Bill #${createData.billNumber} created`);
      router.push(`/bill/preview/${createData.bill.id}`);
    } else {
      toast.error('Failed to duplicate bill');
    }
  }

  async function handleConvertToBill() {
    if (!bill || bill.source !== 'estimate') return;
    const res = await fetch(`/api/bills/${billId}`);
    const data = await res.json();
    if (!data.bill) { toast.error('Could not load estimate'); return; }

    const items = (data.bill.bill_items || []).map((item: { product_id: string; product_name: string; hsn_code: string; quantity: number; unit: string; rate: number; gst_percent: number; amount: number }) => ({
      productId: item.product_id, productName: item.product_name, hsnCode: item.hsn_code,
      quantity: item.quantity, unit: item.unit, rate: item.rate, gstPercent: item.gst_percent, amount: item.amount,
    }));

    const createRes = await fetch('/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: bill.customer_name, customerAddress: bill.customer_address,
        customerGstin: bill.customer_gstin, customerState: bill.customer_state,
        date: new Date().toISOString().split('T')[0],
        dateOfDelivery: bill.date_of_delivery, vehicleNo: bill.vehicle_no, items, source: 'manual',
        remarks: `Converted from Estimate ${bill.bill_number}`,
      }),
    });

    const createData = await createRes.json();
    if (createRes.ok) {
      // Soft-delete the estimate
      await fetch(`/api/bills/${billId}`, { method: 'DELETE' });
      toast.success(`Bill #${createData.billNumber} created from estimate`);
      router.push(`/bill/preview/${createData.bill.id}`);
    } else {
      toast.error('Failed to convert estimate');
    }
  }

  async function handleSaveEway() {
    if (!ewayInput.trim()) return;
    setSavingEway(true);
    try {
      const res = await fetch(`/api/bills/${billId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_eway', ewayBillNo: ewayInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setBill((prev) => prev ? { ...prev, eway_bill_no: ewayInput.trim() } : prev);
        toast.success('E-Way Bill number saved');
      } else {
        toast.error(data.error || 'Failed to save E-Way Bill number');
      }
    } catch {
      toast.error('Failed to save E-Way Bill number');
    }
    setSavingEway(false);
  }

  function handlePrint() { window.print(); }

  const [sharingWhatsApp, setSharingWhatsApp] = useState(false);

  async function handleWhatsApp() {
    if (!bill) return;
    setSharingWhatsApp(true);
    try {
      const [pdfMod, billPdfMod] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/BillPDF'),
      ]);
      const BillPDF = billPdfMod.default;
      const blob = await pdfMod.pdf(<BillPDF bill={bill} />).toBlob();
      const file = new File([blob], `INV-${bill.bill_number}.pdf`, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invoice #${bill.bill_number}`,
          text: `Invoice #${bill.bill_number} - ₹${bill.grand_total.toLocaleString('en-IN')}`,
        });
      } else {
        // Fallback: download PDF and open WhatsApp with text
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `INV-${bill.bill_number}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        const text = `Tax Invoice - Sri Sri Sri Lakshmi Traders\nBill No: ${bill.bill_number}\nDate: ${bill.date}\nCustomer: ${bill.customer_name}\nAmount: ₹${bill.grand_total.toLocaleString('en-IN')}\nPlease find the PDF attached.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        toast.success('PDF downloaded — attach it in WhatsApp');
      }
    } catch {
      toast.error('Failed to share PDF');
    }
    setSharingWhatsApp(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[14px] font-medium text-[#86868B]">Loading bill...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-[14px] font-medium text-[#86868B]">Bill not found</p>
        <Link href="/dashboard" className="text-[13px] font-semibold text-[#6E6E73] hover:text-[#1A1A1A] transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 no-print">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6E6E73] hover:text-[#1A1A1A] transition-colors">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <span className="text-[#E0E0E2]">|</span>
          <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">
            Bill #{bill.bill_number}
          </h1>
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
            bill.source === 'phonepe'
              ? 'bg-[#F0F6FF] text-[#0066CC] border border-[#B8D4F5]'
              : 'bg-[#F0F0F2] text-[#86868B] border border-[#E0E0E2]'
          }`}>
            {bill.source === 'phonepe' ? 'Auto' : 'Manual'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#6E6E73] hover:border-[rgba(0,0,0,0.15)] hover:text-[#1A1A1A] transition-all shadow-sm">
            <Printer size={15} /> Print
          </button>
          <PDFDownloadButton bill={bill}
            className="inline-flex items-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#6E6E73] hover:border-[rgba(0,0,0,0.15)] hover:text-[#1A1A1A] transition-all shadow-sm cursor-pointer whitespace-nowrap">
            <Download size={15} /> Download PDF
          </PDFDownloadButton>
          <button onClick={handleWhatsApp} disabled={sharingWhatsApp}
            className="flex items-center gap-2 bg-[#1A1A1A] text-white rounded-xl px-4 py-2.5 text-[13px] font-bold hover:bg-black transition-all disabled:opacity-50">
            <MessageCircle size={15} /> {sharingWhatsApp ? 'Generating...' : 'WhatsApp'}
          </button>
          {bill.source === 'estimate' && (
            <button onClick={handleConvertToBill}
              className="flex items-center gap-2 bg-[#1C9E5A] text-white rounded-xl px-4 py-2.5 text-[13px] font-bold hover:bg-[#168a4e] transition-all cursor-pointer">
              <FileCheck size={15} /> Convert to Bill
            </button>
          )}
          <Link href={`/bill/edit/${billId}`}
            className="flex items-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#6E6E73] hover:border-[rgba(0,0,0,0.15)] hover:text-[#1A1A1A] transition-all shadow-sm">
            <Pencil size={15} /> Edit
          </Link>
          <button onClick={handleDuplicate}
            aria-label="Duplicate this bill"
            className="flex items-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#6E6E73] hover:border-[rgba(0,0,0,0.15)] hover:text-[#1A1A1A] transition-all shadow-sm cursor-pointer">
            <Copy size={15} /> Duplicate
          </button>
          <button onClick={handleDelete}
            className="flex items-center gap-2 bg-white border border-[#F5B8B8] text-[#E03020] rounded-xl px-4 py-2.5 text-[13px] font-bold hover:bg-[#FFF0F0] transition-all cursor-pointer">
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      {/* Bill Preview */}
      <div className="bg-[#F0F0F2] border border-[rgba(0,0,0,0.07)] rounded-2xl p-5 sm:p-8 shadow-sm">
        <div className="print:page-break">
          <BillTemplate bill={bill} copyType="ORIGINAL FOR RECIPIENT" />
        </div>
        <div className="hidden print:block print:page-break">
          <BillTemplate bill={bill} copyType="DUPLICATE FOR TRANSPORTER" />
        </div>
        <div className="hidden print:block">
          <BillTemplate bill={bill} copyType="TRIPLICATE FOR SUPPLIER" />
        </div>
      </div>

      {/* E-Way Bill Warning */}
      {bill.grand_total > 50000 && !bill.eway_bill_no && (
        <div className="mt-5 bg-[#FFF8F0] border border-[#F5C882] rounded-2xl p-5 no-print">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0DB] flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={18} className="text-[#D97706]" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#92400E]">E-Way Bill Required</p>
              <p className="text-[13px] font-medium text-[#B45309] mt-0.5">
                Invoice amount Rs. {bill.grand_total.toLocaleString('en-IN')} exceeds Rs. 50,000. An E-Way Bill is mandatory for this transaction.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={ewayInput}
              onChange={(e) => setEwayInput(e.target.value.toUpperCase())}
              placeholder="Enter E-Way Bill Number"
              className="flex-1 bg-white border border-[#E5C78A] rounded-xl px-4 py-3 text-[14px] font-mono font-medium text-[#1A1A1A] outline-none focus:border-[#D97706] transition-all placeholder:text-[#C4A35A]"
            />
            <button
              onClick={handleSaveEway}
              disabled={savingEway || !ewayInput.trim()}
              className="bg-[#D97706] text-white rounded-xl px-5 py-3 text-[14px] font-bold hover:bg-[#B45309] transition-all disabled:opacity-50 cursor-pointer"
            >
              {savingEway ? 'Saving...' : 'Save'}
            </button>
          </div>
          <p className="text-[11px] font-medium text-[#B45309] mt-3">
            You can also download/print the bill and write the E-Way Bill number by hand.
          </p>
        </div>
      )}

      {/* E-Way Bill Saved */}
      {bill.eway_bill_no && (
        <div className="mt-5 bg-[#F0FBF5] border border-[#C3E9D5] rounded-2xl p-5 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DFFAEB] flex items-center justify-center flex-shrink-0">
              <Check size={18} className="text-[#1C9E5A]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#166534]">E-Way Bill Number</p>
              <p className="text-[16px] font-mono font-bold text-[#1A1A1A]">{bill.eway_bill_no}</p>
            </div>
            <button
              onClick={() => {
                setBill((prev) => prev ? { ...prev, eway_bill_no: null } : prev);
                setEwayInput('');
                fetch(`/api/bills/${billId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'update_eway', ewayBillNo: null }),
                });
                toast.success('E-Way Bill number removed');
              }}
              className="text-[12px] font-semibold text-[#6E6E73] hover:text-[#E03020] transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
