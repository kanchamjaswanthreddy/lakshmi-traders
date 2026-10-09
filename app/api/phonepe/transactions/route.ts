import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchPhonePeTransactions } from '@/lib/phonepe';
import { format } from 'date-fns';

function getTodayDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate') || getTodayDate();
  const endDate = searchParams.get('endDate') || getTodayDate();

  try {
    const data = await fetchPhonePeTransactions(startDate, endDate);
    const transactions = data?.data?.transactions || [];

    for (const txn of transactions) {
      await supabaseAdmin.from('phonepe_transactions').upsert(
        {
          txn_id: txn.transactionId,
          customer_name: txn.payerName || 'Unknown',
          customer_phone: txn.payerVpa || '',
          amount: txn.amount / 100,
          txn_date: txn.transactionDate,
          status: txn.transactionState,
          raw_data: txn,
        },
        { onConflict: 'txn_id' }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message !== 'PHONEPE_API_NOT_CONFIGURED') {
      return NextResponse.json(
        { error: 'Failed to fetch from PhonePe' },
        { status: 500 }
      );
    }
  }

  const { data: cached } = await supabaseAdmin
    .from('phonepe_transactions')
    .select('*')
    .gte('txn_date', startDate)
    .lte('txn_date', endDate + 'T23:59:59')
    .eq('status', 'SUCCESS')
    .order('txn_date', { ascending: false });

  return NextResponse.json({ transactions: cached || [] });
}
