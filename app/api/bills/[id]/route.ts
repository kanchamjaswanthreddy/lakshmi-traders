import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: bill, error: billError } = await supabaseAdmin
    .from('bills')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (billError) {
    return NextResponse.json({ error: billError.message }, { status: 404 });
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from('bill_items')
    .select('*')
    .eq('bill_id', id)
    .order('s_no');

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ bill: { ...bill, bill_items: items } });
}

// Update bill
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const {
    customerName, customerAddress, customerGstin, customerState,
    dateOfDelivery, vehicleNo, items, remarks,
    cgstPercent = 9, sgstPercent = 9, igstPercent = 0,
  } = body;

  const subtotal = items.reduce((sum: number, i: { amount: number }) => sum + i.amount, 0);
  const cgstAmount = subtotal * (cgstPercent / 100);
  const sgstAmount = subtotal * (sgstPercent / 100);
  const igstAmount = subtotal * (igstPercent / 100);
  const totalGst = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = Math.round((subtotal + totalGst) * 100) / 100;

  const { error: billError } = await supabaseAdmin
    .from('bills')
    .update({
      customer_name: customerName,
      customer_address: customerAddress || null,
      customer_gstin: customerGstin || null,
      customer_state: customerState || null,
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
      remarks: remarks || null,
    })
    .eq('id', id);

  if (billError) {
    return NextResponse.json({ error: billError.message }, { status: 500 });
  }

  // Replace items: delete old, insert new
  const { error: deleteError } = await supabaseAdmin.from('bill_items').delete().eq('bill_id', id);
  if (deleteError) {
    return NextResponse.json({ error: 'Failed to update bill items' }, { status: 500 });
  }

  const billItems = items.map(
    (item: { productId: string; productName: string; hsnCode: string; quantity: number; unit: string; rate: number; gstPercent: number; amount: number }, idx: number) => ({
      bill_id: id,
      product_id: item.productId || null,
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

  const { error: insertError } = await supabaseAdmin.from('bill_items').insert(billItems);
  if (insertError) {
    return NextResponse.json({ error: 'Failed to insert bill items' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Soft delete a bill
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('bills')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Unlink PhonePe transaction if any
  await supabaseAdmin
    .from('phonepe_transactions')
    .update({ bill_created: false, bill_id: null })
    .eq('bill_id', id);

  return NextResponse.json({ success: true });
}

// Restore or permanently delete
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, ewayBillNo } = body;

  if (action === 'update_eway') {
    try {
      const { error } = await supabaseAdmin
        .from('bills')
        .update({ eway_bill_no: ewayBillNo || null })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  if (action === 'restore') {
    const { error } = await supabaseAdmin
      .from('bills')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === 'permanent_delete') {
    // Delete bill items first
    const { error: itemsError } = await supabaseAdmin.from('bill_items').delete().eq('bill_id', id);
    if (itemsError) {
      return NextResponse.json({ error: 'Failed to delete bill items' }, { status: 500 });
    }

    // Unlink PhonePe transaction
    await supabaseAdmin
      .from('phonepe_transactions')
      .update({ bill_created: false, bill_id: null })
      .eq('bill_id', id);

    const { error } = await supabaseAdmin
      .from('bills')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
