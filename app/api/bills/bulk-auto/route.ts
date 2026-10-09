import { supabaseAdmin } from '@/lib/supabase';
import { getNextBillNumber } from '@/lib/billNumber';
import { autoFillItems } from '@/lib/autofill';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { transactions, categories } = await req.json();

  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return NextResponse.json({ error: 'No transactions provided' }, { status: 400 });
  }

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return NextResponse.json({ error: 'No categories provided' }, { status: 400 });
  }

  // Fetch products
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .in('category', categories)
    .eq('is_active', true);

  if (!products || products.length === 0) {
    return NextResponse.json(
      { error: 'No active products found in the selected categories.' },
      { status: 400 }
    );
  }

  const results = [];
  const errors = [];

  for (const txn of transactions) {
    try {
      const { amount, date, customerName, reference } = txn;
      const targetAmount = parseFloat(amount);

      if (isNaN(targetAmount) || targetAmount <= 0) {
        errors.push({ txn, error: 'Invalid amount' });
        continue;
      }

      // 1. Auto-fill items
      const items = autoFillItems(products, targetAmount);
      if (!items || items.length === 0) {
        errors.push({ txn, error: 'Could not match target amount with available products.' });
        continue;
      }

      // 2. Calculate totals
      const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
      const cgstAmount = subtotal * 0.09;
      const sgstAmount = subtotal * 0.09;
      const totalGst = cgstAmount + sgstAmount;
      const grandTotal = Math.round((subtotal + totalGst) * 100) / 100;

      // 3. Get Bill Number
      const billNumber = await getNextBillNumber();

      // 4. Insert Bill
      const { data: bill, error: billError } = await supabaseAdmin
        .from('bills')
        .insert({
          bill_number: billNumber,
          customer_name: customerName?.trim() || 'Cash Customer',
          date: date,
          subtotal: Math.round(subtotal * 100) / 100,
          cgst_percent: 9,
          sgst_percent: 9,
          igst_percent: 0,
          cgst_amount: Math.round(cgstAmount * 100) / 100,
          sgst_amount: Math.round(sgstAmount * 100) / 100,
          igst_amount: 0,
          total_gst: Math.round(totalGst * 100) / 100,
          grand_total: grandTotal,
          source: 'auto_bulk',
          remarks: reference || null,
        })
        .select()
        .single();

      if (billError) throw new Error(`Bill insertion failed: ${billError.message}`);

      // 5. Insert Items
      const billItems = items.map((item, idx) => ({
        bill_id: bill.id,
        product_id: item.product.id,
        product_name: item.product.name,
        hsn_code: item.product.hsn_code,
        quantity: item.quantity,
        unit: item.product.unit,
        rate: item.product.price,
        gst_percent: item.product.gst_percent,
        amount: item.amount,
        s_no: idx + 1,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('bill_items')
        .insert(billItems);

      if (itemsError) throw new Error(`Items insertion failed: ${itemsError.message}`);

      results.push({ billNumber: bill.bill_number, amount: grandTotal, customerName });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      errors.push({ txn, error: message });
    }
  }

  return NextResponse.json({
    successCount: results.length,
    errorCount: errors.length,
    results,
    errors,
  });
}
