import { redirect } from 'next/navigation';

export default function AutoBillRedirect() {
  redirect('/bill/auto/new');
}
