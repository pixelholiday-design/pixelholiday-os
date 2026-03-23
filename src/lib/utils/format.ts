export function formatCurrency(amount: number, currency = "THB", locale = "th-TH"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}
export function formatPercent(value: number, decimals = 1): string { return `${(value * 100).toFixed(decimals)}%`; }
export function formatNumber(n: number): string { return new Intl.NumberFormat().format(n); }
