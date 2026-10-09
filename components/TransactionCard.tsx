'use client';

import { PhonePeTransaction } from '@/types';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface TransactionCardProps {
  txn: PhonePeTransaction;
}

export default function TransactionCard({ txn }: TransactionCardProps) {
  const initials = (txn.customer_name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 bg-[#F5F5F7] rounded-2xl border border-transparent hover:border-[rgba(0,0,0,0.07)] hover:bg-white hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-full bg-[#F0F0F2] border border-[#E0E0E2] flex items-center justify-center flex-shrink-0">
        <span className="text-[12px] font-bold text-[#6E6E73]">
          {initials}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">
          {txn.customer_name || 'Unknown'}
        </p>
        <p className="text-[12px] text-[#86868B] font-medium">
          {format(new Date(txn.txn_date), 'hh:mm a')}
        </p>
      </div>

      <p className="font-mono text-[15px] font-bold text-[#1A1A1A] mr-3">
        ₹{txn.amount.toLocaleString('en-IN')}
      </p>

      {txn.bill_created ? (
        <span className="flex items-center gap-1.5 bg-[#F0FBF5] text-[#1C9E5A] border border-[#C3E9D5] text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
          <Check size={12} />
          Billed
        </span>
      ) : (
        <Link
          href={`/bill/auto/${txn.txn_id}`}
          className="bg-white border border-[#C8C8CA] rounded-xl px-4 py-2 text-[12px] font-semibold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all"
        >
          Create Bill
        </Link>
      )}
    </div>
  );
}
