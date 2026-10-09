'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, subMonths } from 'date-fns';
import { displayDate } from '@/lib/date';
import { Search, Eye, Download, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import PDFDownloadButton from '@/components/PDFDownloadButton';
import { Bill } from '@/types';
import { SkeletonTable } from '@/components/Skeleton';

function generateMonthOptions(): { value: string; label: string }[] {
  const options = [];
  for (let i = 0; i < 12; i++) {
    const d = subMonths(new Date(), i);
    options.push({ value: format(d, 'yyyy-MM'), label: format(d, 'MMMM yyyy') });
  }
  return options;
}

export default function HistoryPage() {
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [search, setSearch] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
  const [expandedBill, setExpandedBill] = useState<Bill | null>(null);

  const monthOptions = generateMonthOptions();

  const fetchBills = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ month, limit: '200' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/bills?${params}`);
    const data = await res.json();
    setBills(data.bills || []);
    setLoading(false);
  }, [month, search]);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  async function handleDeleteBill(id: string, billNumber: string) {
    if (!confirm(`Delete Bill #${billNumber}? It will be moved to the Recycle Bin.`)) return;
    const res = await fetch(`/api/bills/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Bill moved to Recycle Bin');
      fetchBills();
    } else {
      toast.error('Failed to delete');
    }
  }

  async function fetchFullBill(id: string) {
    if (expandedBillId === id && expandedBill) { setExpandedBillId(null); setExpandedBill(null); return; }
    const res = await fetch(`/api/bills/${id}`);
    const data = await res.json();
    setExpandedBill(data.bill);
    setExpandedBillId(id);
  }

  const totalBills = bills.length;
  const totalAmount = bills.reduce((s, b) => s + b.grand_total, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Bill History</h1>
          <p className="text-[13px] font-medium text-[#86868B] mt-1">View and manage all generated bills</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <select value={month} onChange={(e) => setMonth(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.07)] rounded-xl px-4 py-3 text-[14px] font-semibold text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-all shadow-sm">
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]" />
          <input type="text" placeholder="Search by customer name or bill number..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[rgba(0,0,0,0.07)] rounded-xl pl-11 pr-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-all shadow-sm" />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="stat-card p-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B] mb-2">Total Bills</p>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">{totalBills}</p>
        </div>
        <div className="stat-card p-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B] mb-2">Total Amount</p>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">₹{totalAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bento-card-static overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E2]">
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">Bill No</th>
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">Date</th>
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">Customer</th>
              <th className="text-right px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">Grand Total</th>
              <th className="text-center px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">Source</th>
              <th className="text-right px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><SkeletonTable rows={5} cols={5} /></td></tr>
            ) : bills.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-[14px] font-medium text-[#86868B]">No bills found for this period.</td></tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="border-b border-[#F0F0F2] last:border-b-0 hover:bg-[#F9F9FB] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <FileText size={15} className="text-[#86868B]" />
                      <span className="font-mono text-[14px] font-bold text-[#1A1A1A]">#{bill.bill_number}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#6E6E73]">{displayDate(bill.date)}</td>
                  <td className="px-5 py-3.5 text-[14px] font-semibold text-[#1A1A1A]">{bill.customer_name}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-[14px] font-bold text-[#1A1A1A]">₹{bill.grand_total.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                      bill.source === 'phonepe'
                        ? 'bg-[#F0F6FF] text-[#0066CC] border border-[#B8D4F5]'
                        : 'bg-[#F0F0F2] text-[#86868B] border border-[#E0E0E2]'
                    }`}>
                      {bill.source === 'phonepe' ? 'Auto' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/bill/preview/${bill.id}`} aria-label={`View bill ${bill.bill_number}`} className="p-2 rounded-lg hover:bg-[#F0F0F2] transition-all text-[#6E6E73] hover:text-[#1A1A1A]">
                        <Eye size={15} />
                      </Link>
                      <button onClick={() => fetchFullBill(bill.id)} aria-label={`Download PDF for bill ${bill.bill_number}`} className="p-2 rounded-lg hover:bg-[#F0F0F2] transition-all text-[#6E6E73] hover:text-[#1A1A1A] cursor-pointer">
                        <Download size={15} />
                      </button>
                      {expandedBillId === bill.id && expandedBill && (
                        <PDFDownloadButton bill={expandedBill} className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-white text-[10px] font-bold cursor-pointer">
                          Save PDF
                        </PDFDownloadButton>
                      )}
                      <button onClick={() => handleDeleteBill(bill.id, bill.bill_number)}
                        aria-label={`Delete bill ${bill.bill_number}`}
                        className="p-2 rounded-lg hover:bg-[#FFF0F0] transition-all text-[#86868B] hover:text-[#E03020] cursor-pointer">
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
    </div>
  );
}
