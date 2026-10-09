import { Product, SelectedItem } from '@/types';

export function autoFillItems(
  products: Product[],
  targetAmount: number,
  maxOvershoot: number = 200
): SelectedItem[] | null {
  const MAX_ATTEMPTS = 500;
  const maxAllowed = targetAmount + maxOvershoot;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const items: SelectedItem[] = [];
    let runningTotal = 0;
    const shuffled = [...products].sort(() => Math.random() - 0.5);

    for (const product of shuffled) {
      if (runningTotal >= targetAmount) break;

      const remaining = targetAmount - runningTotal;
      const priceWithGst = product.price * (1 + product.gst_percent / 100);

      const maxQty = Math.floor((maxAllowed - runningTotal) / priceWithGst);
      if (maxQty < 1) continue;

      const idealQty = Math.ceil(remaining / priceWithGst);
      const qty = Math.min(idealQty, maxQty, 10);

      const amount = product.price * qty;
      const gstAmount = amount * (product.gst_percent / 100);
      const totalWithGst = amount + gstAmount;

      if (runningTotal + totalWithGst > maxAllowed) continue;

      items.push({ product, quantity: qty, amount, gstAmount, totalWithGst });
      runningTotal += totalWithGst;
    }

    if (runningTotal >= targetAmount && runningTotal <= maxAllowed) {
      return items;
    }
  }

  return null;
}
