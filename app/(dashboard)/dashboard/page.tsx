'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { displayDate, todayISO } from '@/lib/date';
import DateInput from '@/components/DateInput';
import {
  RefreshCw,
  IndianRupee,
  FileText,
  Zap,
  PenLine,
  Clock,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import TransactionCard from '@/components/TransactionCard';
import { PhonePeTransaction, Bill } from '@/types';
import { SkeletonRows, SkeletonStats } from '@/components/Skeleton';
import GlassPillSelector from '@/components/GlassPillSelector';

export default function DashboardPage() {
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [transactions, setTransactions] = useState<PhonePeTransaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'bills'>('transactions');
  const [loading, setLoading] = useState(false);
  const [loadingBills, setLoadingBills] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/phonepe/transactions?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch {
      toast.error('Failed to fetch transactions');
    }
    setLoading(false);
  }, [startDate, endDate]);

  const fetchBills = useCallback(async () => {
    setLoadingBills(true);
    try {
      const res = await fetch('/api/bills?limit=20');
      const data = await res.json();
      setBills(data.bills || []);
    } catch {
      toast.error('Failed to fetch bills');
    }
    setLoadingBills(false);
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchBills();
  }, [fetchTransactions, fetchBills]);

  const totalTxnAmount = transactions.reduce((s, t) => s + t.amount, 0);
  const pendingBills = transactions.filter((t) => !t.bill_created).length;
  const todayBillsCount = bills.filter(
    (b) => b.date === todayISO()
  ).length;
  const todayRevenue = bills
    .filter((b) => b.date === todayISO())
    .reduce((s, b) => s + b.grand_total, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Dashboard
          </h1>
          <p className="text-[13px] font-medium text-[#86868B] mt-1">
            {format(new Date(), 'EEEE')}, {displayDate(todayISO())}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#F0FBF5] border border-[#C3E9D5] rounded-full px-3 py-1.5">
            <span className="w-[6px] h-[6px] rounded-full bg-[#1C9E5A] animate-pulse" />
            <span className="text-[11px] font-bold text-[#1C9E5A] uppercase tracking-wide">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row — Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card p-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B] mb-2">
            PhonePe Received
          </p>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">
            ₹{totalTxnAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[12px] font-medium text-[#86868B] mt-2">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="stat-card p-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B] mb-2">
            Pending Bills
          </p>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">
            {pendingBills}
          </p>
          <p className="text-[12px] font-medium text-[#86868B] mt-2">Need billing</p>
        </div>

        <div className="stat-card p-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B] mb-2">
            Today&apos;s Bills
          </p>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">
            {todayBillsCount}
          </p>
          <p className="text-[12px] font-medium text-[#86868B] mt-2">Bills created</p>
        </div>

        <div className="stat-card p-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#86868B] mb-2">
            Today&apos;s Revenue
          </p>
          <p className="font-mono text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-none">
            ₹{todayRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[12px] font-medium text-[#86868B] mt-2">Grand total</p>
        </div>
      </div>

      {/* Quick Actions + Content — Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bento-card-static p-6">
            <p className="text-[15px] font-bold text-[#1A1A1A] mb-4">
              Quick Actions
            </p>

            <Link
              href="/bill/auto"
              className="flex items-center gap-4 bg-[#1A1A1A] rounded-2xl p-4 mb-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-white">Auto Bill</p>
                <p className="text-[12px] font-medium text-white/50">From PhonePe payment</p>
              </div>
              <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
            </Link>

            <Link
              href="/bill/manual"
              className="flex items-center gap-4 bg-[#F5F5F7] rounded-2xl p-4 mb-3 border border-transparent hover:border-[rgba(0,0,0,0.07)] hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F0F0F2] flex items-center justify-center">
                <PenLine size={18} className="text-[#6E6E73]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#1A1A1A]">
                  Manual Bill
                </p>
                <p className="text-[12px] font-medium text-[#86868B]">Create from scratch</p>
              </div>
              <ArrowRight size={16} className="text-[#86868B] group-hover:text-[#6E6E73] transition-colors" />
            </Link>

            <Link
              href="/bill/from-statement"
              className="flex items-center gap-4 bg-[#F5F5F7] rounded-2xl p-4 mb-3 border border-transparent hover:border-[rgba(0,0,0,0.07)] hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F0F0F2] flex items-center justify-center">
                <FileText size={18} className="text-[#6E6E73]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#1A1A1A]">
                  Statement Bill
                </p>
                <p className="text-[12px] font-medium text-[#86868B]">Side-by-side with PDF</p>
              </div>
              <ArrowRight size={16} className="text-[#86868B] group-hover:text-[#6E6E73] transition-colors" />
            </Link>

            <Link
              href="/products"
              className="flex items-center gap-4 bg-[#F5F5F7] rounded-2xl p-4 border border-transparent hover:border-[rgba(0,0,0,0.07)] hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F0F0F2] flex items-center justify-center">
                <IndianRupee size={18} className="text-[#6E6E73]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#1A1A1A]">Products</p>
                <p className="text-[12px] font-medium text-[#86868B]">Manage catalog</p>
              </div>
              <ArrowRight size={16} className="text-[#86868B] group-hover:text-[#6E6E73] transition-colors" />
            </Link>
          </div>
        </div>

        {/* Transactions / Bills */}
        <div className="lg:col-span-8">
          <div className="bento-card-static p-6">
            {/* Tabs + Date picker */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <GlassPillSelector
                items={[{ id: 'transactions', label: 'PhonePe Transactions' }, { id: 'bills', label: 'Recent Bills' }]}
                value={activeTab}
                onChange={(id) => setActiveTab(id as 'transactions' | 'bills')}
                size="sm"
              />

              {activeTab === 'transactions' && (
                <div className="flex items-center gap-2">
                  <DateInput
                    value={startDate}
                    onChange={setStartDate}
                    className="bg-[#F0F0F2] border border-[#E0E0E2] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#1A1A1A] outline-none"
                  />
                  <span className="text-[12px] font-medium text-[#86868B]">to</span>
                  <DateInput
                    value={endDate}
                    onChange={setEndDate}
                    className="bg-[#F0F0F2] border border-[#E0E0E2] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#1A1A1A] outline-none"
                  />
                  <button
                    onClick={fetchTransactions}
                    disabled={loading}
                    aria-label="Refresh transactions"
                    className="flex items-center gap-1.5 bg-white border border-[#E0E0E2] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#6E6E73] hover:border-[#C8C8CA] hover:text-[#1A1A1A] transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            {activeTab === 'transactions' && (
              <div className="space-y-2">
                {loading ? (
                  <SkeletonRows count={4} />
                ) : transactions.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-[14px] font-medium text-[#86868B]">
                      No transactions found for this date range.
                    </p>
                    <p className="text-[12px] font-medium text-[#86868B] mt-1">
                      PhonePe API will populate transactions once configured.
                    </p>
                  </div>
                ) : (
                  transactions.map((txn) => (
                    <TransactionCard key={txn.id} txn={txn} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'bills' && (
              <div className="space-y-2">
                {loadingBills ? (
                  <SkeletonRows count={4} />
                ) : bills.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-[14px] font-medium text-[#86868B]">
                      No bills created yet.
                    </p>
                  </div>
                ) : (
                  bills.slice(0, 20).map((bill) => (
                    <Link
                      key={bill.id}
                      href={`/bill/preview/${bill.id}`}
                      className="flex items-center gap-4 px-4 py-3.5 bg-[#F5F5F7] rounded-2xl border border-transparent hover:border-[rgba(0,0,0,0.07)] hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#F0F0F2] border border-[#E0E0E2] flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-[#6E6E73]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[14px] font-bold text-[#1A1A1A]">
                            #{bill.bill_number}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                              bill.source === 'phonepe'
                                ? 'bg-[#F0F6FF] text-[#0066CC] border border-[#B8D4F5]'
                                : 'bg-[#F0F0F2] text-[#86868B] border border-[#E0E0E2]'
                            }`}
                          >
                            {bill.source === 'phonepe' ? 'Auto' : 'Manual'}
                          </span>
                        </div>
                        <p className="text-[12px] font-medium text-[#6E6E73] truncate">
                          {bill.customer_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[14px] font-bold text-[#1A1A1A]">
                          ₹{bill.grand_total.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] font-medium text-[#86868B] flex items-center gap-1 justify-end">
                          <Clock size={10} />
                          {displayDate(bill.date)}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
