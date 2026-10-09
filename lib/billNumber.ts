import { supabaseAdmin } from './supabase';

export async function getNextBillNumber(): Promise<string> {
  const { data, error } = await supabaseAdmin.rpc('get_next_bill_number');
  if (error) throw error;
  return data;
}
