export const TARIFF_PER_KWH = 200; // demo rate in NGN
export const MIN_PURCHASE = 500;
export const MAX_PURCHASE = 100000;
export const quickAmounts = [1000, 2000, 5000, 10000];
export const LOW_BALANCE_THRESHOLD = 3000;

export const paymentMethods = ["Card", "Bank transfer", "USSD"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const calculateUnits = (amount: number) =>
  Number((amount / TARIFF_PER_KWH).toFixed(1));

// 20-digit demo token, grouped like a prepaid meter token.
export function generateToken() {
  return Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0"),
  ).join("-");
}

// Matches the existing mock format, e.g. "27 Oct, 10:42 AM".
export function formatTransactionDate(date: Date) {
  return date
    .toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\b(am|pm)\b/, (match) => match.toUpperCase());
}