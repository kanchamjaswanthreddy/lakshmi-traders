import { toWords } from 'number-to-words';

export function amountInWords(amount: number): string {
  const rounded = Math.round(amount);
  try {
    const words = toWords(rounded);
    return words.charAt(0).toUpperCase() + words.slice(1) + ' Rupees Only';
  } catch {
    return `${rounded} Rupees Only`;
  }
}
