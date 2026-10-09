import { supabaseAdmin } from '@/lib/supabase';
import { getNextBillNumber } from '@/lib/billNumber';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');
  const search = searchParams.get('search');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50') || 50, 500);

  const trash = searchParams.get('trash') === 'true';

  let query = supabaseAdmin
    .from('bills')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (trash) {
    query = query.not('deleted_at', 'is', null);
  } else {
    query = query.is('deleted_at', null);
  }

  if (month) {
    const [year, m] = month.split('-');
    const startDate = `${year}-${m}-01`;
    const endDate =
      m === '12'
        ? `${parseInt(year) + 1}-01-01`
        : `${year}-${String(parseInt(m) + 1).padStart(2, '0')}-01`;
    query = query.gte('date', startDate).lt('date', endDate);
  }

  if (search) {
    query = query.or(
      `customer_name.ilike.%${search}%,bill_number.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bills: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    customerName,
    customerAddress,
    customerGstin,
    customerState,
    date,
    dateOfDelivery,
    vehicleNo,
    items,
    source,
    phonepeTxnId,
    phonepeDate,
    phonepeAmount,
    remarks,
    cgstPercent = 9,
    sgstPercent = 9,
    igstPercent = 0,
    isEstimate = false,
    manualBillNumber,
  } = body;

  if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
    return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
  }

  if (!date || isNaN(Date.parse(date))) {
    return NextResponse.json({ error: 'Valid date is required' }, { status: 400 });
  }

  // Validate each item has numeric amount
  for (const item of items) {
    if (typeof item.amount !== 'number' || isNaN(item.amount)) {
      return NextResponse.json({ error: 'All items must have valid numeric amounts' }, { status: 400 });
    }
  }

  const subtotal = items.reduce(
    (sum: number, i: { amount: number }) => sum + i.amount,
    0
  );
  const cgstAmount = subtotal * (cgstPercent / 100);
  const sgstAmount = subtotal * (sgstPercent / 100);
  const igstAmount = subtotal * (igstPercent / 100);
  const totalGst = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = Math.round((subtotal + totalGst) * 100) / 100;

  const billNumber = manualBillNumber
    ? manualBillNumber
    : isEstimate
    ? `EST-${Date.now().toString(36).toUpperCase()}`
    : await getNextBillNumber();

  const { data: bill, error: billError } = await supabaseAdmin
    .from('bills')
    .insert({
      bill_number: billNumber,
      customer_name: customerName,
      customer_address: customerAddress || null,
      customer_gstin: customerGstin || null,
      customer_state: customerState || null,
      date,
      date_of_delivery: dateOfDelivery || null,
      vehicle_no: vehicleNo || null,
      subtotal: Math.round(subtotal * 100) / 100,
      cgst_percent: cgstPercent,
      sgst_percent: sgstPercent,
      igst_percent: igstPercent,
      cgst_amount: Math.round(cgstAmount * 100) / 100,
      sgst_amount: Math.round(sgstAmount * 100) / 100,
      igst_amount: Math.round(igstAmount * 100) / 100,
      total_gst: Math.round(totalGst * 100) / 100,
      grand_total: grandTotal,
      source: isEstimate ? 'estimate' : source,
      phonepe_txn_id: phonepeTxnId || null,
      phonepe_date: phonepeDate || null,
      phonepe_amount: phonepeAmount || null,
      remarks: remarks || null,
    })
    .select()
    .single();

  if (billError) {
    return NextResponse.json({ error: billError.message }, { status: 500 });
  }

  const billItems = items.map(
    (
      item: {
        productId: string;
        productName: string;
        hsnCode: string;
        quantity: number;
        unit: string;
        rate: number;
        gstPercent: number;
        amount: number;
      },
      idx: number
    ) => ({
      bill_id: bill.id,
      product_id: item.productId,
      product_name: item.productName,
      hsn_code: item.hsnCode,
      quantity: item.quantity,
      unit: item.unit,
      rate: item.rate,
      gst_percent: item.gstPercent,
      amount: item.amount,
      s_no: idx + 1,
    })
  );

  const { error: itemsError } = await supabaseAdmin
    .from('bill_items')
    .insert(billItems);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  if (phonepeTxnId) {
    await supabaseAdmin
      .from('phonepe_transactions')
      .update({ bill_created: true, bill_id: bill.id })
      .eq('txn_id', phonepeTxnId);
  }

  return NextResponse.json({ bill, billNumber });
}
