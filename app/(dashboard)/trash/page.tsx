'use client';

import { useState, useEffect, useCallback } from 'react';
import { displayDate, displayDateTime } from '@/lib/date';
import { RotateCcw, Trash2, FileText, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Bill } from '@/types';

export default function TrashPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/bills?trash=true&limit=200');
    const data = await res.json();
    setBills(data.bills || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  async function handleRestore(id: string) {
    const res = await fetch(`/api/bills/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore' }),
    });
    if (res.ok) {
      toast.success('Bill restored');
      fetchTrash();
    } else {
      toast.error('Failed to restore');
    }
  }

  async function handlePermanentDelete(id: string, billNumber: string) {
    if (!confirm(`Permanently delete Bill #${billNumber}? This cannot be undone.`)) return;

    const res = await fetch(`/api/bills/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'permanent_delete' }),
    });
    if (res.ok) {
      toast.success('Bill permanently deleted');
      fetchTrash();
    } else {
      toast.error('Failed to delete');
    }
  }

  async function handleEmptyTrash() {
    if (!confirm('Permanently delete ALL bills in trash? This cannot be undone.')) return;

    let failed = 0;
    for (const bill of bills) {
      const res = await fetch(`/api/bills/${bill.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'permanent_delete' }),
      });
      if (!res.ok) failed++;
    }

    if (failed === 0) {
      toast.success('Trash emptied');
    } else {
      toast.error(`Failed to delete ${failed} bill(s)`);
    }
    fetchTrash();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Recycle Bin
          </h1>
          <p className="text-[13px] font-medium text-[#86868B] mt-1">
            Deleted bills can be restored or permanently removed
          </p>
        </div>
        {bills.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center gap-2 bg-white border border-[#F5B8B8] text-[#E03020] rounded-xl px-5 py-2.5 text-[13px] font-bold hover:bg-[#FFF0F0] transition-all"
          >
            <Trash2 size={15} />
            Empty Trash
          </button>
        )}
      </div>

      {/* Warning */}
      <div className="flex items-center gap-3 bg-[#FFF8F0] border border-[#FFE0B2] rounded-2xl px-5 py-4 mb-6">
        <AlertTriangle size={18} className="text-[#F59E0B] flex-shrink-0" />
        <p className="text-[13px] font-medium text-[#92400E]">
          Bills in the recycle bin will stay here until you restore or permanently delete them. Permanently deleted bills cannot be recovered.
        </p>
      </div>

      {/* Trash Table */}
      <div className="bento-card-static overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E2]">
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Bill No
              </th>
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Customer
              </th>
              <th className="text-right px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Amount
              </th>
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Bill Date
              </th>
              <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Deleted On
              </th>
              <th className="text-right px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#86868B]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-[14px] font-medium text-[#86868B]">
                  Loading...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <Trash2 size={32} className="mx-auto text-[#E0E0E2] mb-3" />
                  <p className="text-[14px] font-semibold text-[#86868B]">
                    Recycle bin is empty
                  </p>
                  <p className="text-[12px] font-medium text-[#86868B] mt-1">
                    Deleted bills will appear here
                  </p>
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-b border-[#F0F0F2] last:border-b-0 hover:bg-[#F9F9FB] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <FileText size={15} className="text-[#86868B]" />
                      <span className="font-mono text-[14px] font-bold text-[#1A1A1A]">
                        #{bill.bill_number}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[14px] font-semibold text-[#1A1A1A]">
                    {bill.customer_name}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-[14px] font-bold text-[#1A1A1A]">
                    ₹{bill.grand_total.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#6E6E73]">
                    {displayDate(bill.date)}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#86868B]">
                    {bill.deleted_at
                      ? displayDateTime(bill.deleted_at)
                      : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRestore(bill.id)}
                        className="flex items-center gap-1.5 bg-[#F0FBF5] border border-[#C3E9D5] text-[#1C9E5A] rounded-xl px-3.5 py-2 text-[12px] font-bold hover:bg-[#E0F7EC] transition-all"
                      >
                        <RotateCcw size={13} />
                        Restore
                      </button>
                      <button
                        onClick={() =>
                          handlePermanentDelete(bill.id, bill.bill_number)
                        }
                        className="flex items-center gap-1.5 bg-white border border-[#F5B8B8] text-[#E03020] rounded-xl px-3.5 py-2 text-[12px] font-bold hover:bg-[#FFF0F0] transition-all"
                      >
                        <Trash2 size={13} />
                        Delete
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
