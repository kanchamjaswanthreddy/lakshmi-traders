'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, subMonths } from 'date-fns';
import { Download, TrendingUp, FileText, IndianRupee, BarChart3 } from 'lucide-react';
import { Bill } from '@/types';

function downloadExcel(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.click();
}

function generateMonthOptions(): { value: string; label: string }[] {
  const options = [];
  for (let i = 0; i < 12; i++) {
    const d = subMonths(new Date(), i);
    options.push({ value: format(d, 'yyyy-MM'), label: format(d, 'MMMM yyyy') });
  }
  return options;
}

export default function ReportsPage() {
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const monthOptions = generateMonthOptions();

  const fetchBills = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/bills?month=${month}&limit=1000`);
    const data = await res.json();
    setBills(data.bills || []);
    setLoading(false);
  }, [month]);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  const totalBills = bills.length;
  const totalRevenue = bills.reduce((s, b) => s + b.grand_total, 0);
  const totalSubtotal = bills.reduce((s, b) => s + b.subtotal, 0);
  const totalCGST = bills.reduce((s, b) => s + b.cgst_amount, 0);
  const totalSGST = bills.reduce((s, b) => s + b.sgst_amount, 0);
  const totalGST = totalCGST + totalSGST;
  const autoBills = bills.filter((b) => b.source === 'phonepe').length;
  const manualBills = bills.filter((b) => b.source === 'manual').length;
  const avgBillValue = totalBills > 0 ? totalRevenue / totalBills : 0;

  // Daily breakdown
  const dailyMap = new Map<string, { count: number; total: number }>();
  bills.forEach((b) => {
    const day = b.date;
    const existing = dailyMap.get(day) || { count: 0, total: 0 };
    dailyMap.set(day, { count: existing.count + 1, total: existing.total + b.grand_total });
  });
  const dailyData = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({ date, ...data }));

  const maxDailyTotal = Math.max(...dailyData.map((d) => d.total), 1);

  function exportBillsExcel() {
    downloadExcel(`/api/export?type=bills&month=${month}`);
  }

  function exportAllBillsExcel() {
    downloadExcel('/api/export?type=all-bills');
  }

  function exportProductsExcel() {
    downloadExcel('/api/export?type=products');
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Sales Reports</h1>
          <p className="text-[13px] font-medium text-[#86868B] mt-1">Monthly sales summary and GST breakdown</p>
        </div>
        <select value={month} onChange={(e) => setMonth(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.07)] rounded-xl px-4 py-3 text-[14px] font-semibold text-[#1A1A1A] outline-none shadow-sm cursor-pointer">
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center"><IndianRupee size={16} className="text-[#0066CC]" /></div>
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B]">Revenue</p>
          </div>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#F0FBF5] flex items-center justify-center"><TrendingUp size={16} className="text-[#1C9E5A]" /></div>
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B]">GST Collected</p>
          </div>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">₹{totalGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] flex items-center justify-center"><FileText size={16} className="text-[#E65100]" /></div>
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B]">Total Bills</p>
          </div>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">{totalBills}</p>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#F3E5F5] flex items-center justify-center"><BarChart3 size={16} className="text-[#6A1B9A]" /></div>
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B]">Avg Bill Value</p>
          </div>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">₹{avgBillValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* GST Breakdown */}
        <div className="lg:col-span-5 bento-card-static p-6">
          <p className="text-[15px] font-bold text-[#1A1A1A] mb-4">GST Breakdown</p>
          <div className="space-y-3">
            <div className="flex justify-between text-[14px]">
              <span className="font-medium text-[#6E6E73]">Total Before Tax</span>
              <span className="font-mono font-bold text-[#1A1A1A]">₹{totalSubtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="font-medium text-[#6E6E73]">CGST (9%)</span>
              <span className="font-mono font-semibold text-[#6E6E73]">₹{totalCGST.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="font-medium text-[#6E6E73]">SGST (9%)</span>
              <span className="font-mono font-semibold text-[#6E6E73]">₹{totalSGST.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[16px] font-bold pt-3 border-t border-[#E0E0E2]">
              <span className="text-[#1A1A1A]">Total Tax</span>
              <span className="font-mono text-[#1C9E5A]">₹{totalGST.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[18px] font-bold pt-3 border-t border-[#E0E0E2]">
              <span className="text-[#1A1A1A]">Grand Total</span>
              <span className="font-mono text-[#1A1A1A]">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-[#E0E0E2]">
            <p className="text-[12px] font-medium text-[#86868B]">Auto: <span className="font-bold text-[#0066CC]">{autoBills}</span></p>
            <p className="text-[12px] font-medium text-[#86868B]">Manual: <span className="font-bold text-[#1A1A1A]">{manualBills}</span></p>
          </div>
        </div>

        {/* Daily Chart */}
        <div className="lg:col-span-7 bento-card-static p-6">
          <p className="text-[15px] font-bold text-[#1A1A1A] mb-4">Daily Revenue</p>
          {loading ? (
            <div className="text-center py-12 text-[14px] font-medium text-[#86868B]">Loading...</div>
          ) : dailyData.length === 0 ? (
            <div className="text-center py-12 text-[14px] font-medium text-[#86868B]">No data for this month</div>
          ) : (
            <div className="flex items-end gap-1 h-[180px]">
              {dailyData.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer" title={`${format(new Date(d.date), 'dd MMM')}: ₹${d.total.toLocaleString('en-IN')} (${d.count} bills)`}>
                  <div
                    className="w-full bg-[#E8E8EA] group-hover:bg-[#1A1A1A] rounded-t transition-colors min-h-[4px]"
                    style={{ height: `${(d.total / maxDailyTotal) * 100}%` }}
                  />
                  <p className="text-[8px] font-bold text-[#86868B] mt-1 group-hover:text-[#1A1A1A]">
                    {format(new Date(d.date), 'd')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Section */}
      <div className="bento-card-static p-6">
        <p className="text-[15px] font-bold text-[#1A1A1A] mb-4">Export & Backup</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={exportBillsExcel}
            className="flex items-center gap-3 p-4 bg-[#F5F5F7] rounded-2xl border border-transparent hover:border-[rgba(0,0,0,0.07)] hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-[#F0F6FF] flex items-center justify-center group-hover:bg-[#0066CC] transition-colors">
              <Download size={18} className="text-[#0066CC] group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">Monthly Bills</p>
              <p className="text-[11px] font-medium text-[#86868B]">{format(new Date(month + '-01'), 'MMMM yyyy')} (.xlsx)</p>
            </div>
          </button>

          <button onClick={exportAllBillsExcel}
            className="flex items-center gap-3 p-4 bg-[#F5F5F7] rounded-2xl border border-transparent hover:border-[rgba(0,0,0,0.07)] hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-[#F0FBF5] flex items-center justify-center group-hover:bg-[#1C9E5A] transition-colors">
              <Download size={18} className="text-[#1C9E5A] group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">All Bills Backup</p>
              <p className="text-[11px] font-medium text-[#86868B]">Complete export (.xlsx)</p>
            </div>
          </button>

          <button onClick={exportProductsExcel}
            className="flex items-center gap-3 p-4 bg-[#F5F5F7] rounded-2xl border border-transparent hover:border-[rgba(0,0,0,0.07)] hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E0] flex items-center justify-center group-hover:bg-[#E65100] transition-colors">
              <Download size={18} className="text-[#E65100] group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">Products</p>
              <p className="text-[11px] font-medium text-[#86868B]">Full catalog (.xlsx)</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
