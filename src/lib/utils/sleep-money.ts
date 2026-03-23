// Sleep Money utilities
export interface SleepMoneyDrip { day: number; discountPct: number; fireAt: Date; delaySeconds: number; isFuture: boolean; }
export const SLEEP_MONEY_SCHEDULE = [{ day: 7, discountPct: 50 },{ day: 15, discountPct: 60 },{ day: 20, discountPct: 70 },{ day: 30, discountPct: 80 }] as const;
export function buildSleepMoneyDrips(shootDate: Date, now: Date = new Date(), includeExpired = false): SleepMoneyDrip[] {
  return SLEEP_MONEY_SCHEDULE.map(({ day, discountPct }) => {
    const fireAt = new Date(shootDate.getTime() + day * 24 * 60 * 60 * 1000);
    const delayMs = fireAt.getTime() - now.getTime();
    const delaySeconds = Math.floor(delayMs / 1000);
    const isFuture = delaySeconds > 0;
    return { day, discountPct, fireAt, delaySeconds, isFuture };
  }).filter((d) => includeExpired || d.isFuture);
}
export function getNextDrip(shootDate: Date, now: Date = new Date()): SleepMoneyDrip | null {
  const drips = buildSleepMoneyDrips(shootDate, now, false);
  return drips.length > 0 ? drips[0] : null;
}
export function isGalleryAsleep(shootDate: Date, now: Date = new Date()): boolean {
  return (now.getTime() - shootDate.getTime()) / (24 * 60 * 60 * 1000) >= 7;
}
export function formatDiscount(discountPct: number): string { return `${discountPct}% OFF`; }
export function applyDiscount(basePrice: number, discountPct: number): number {
  if (discountPct < 0 || discountPct > 100) throw new RangeError("discountPct must be between 0 and 100");
  return Math.round(basePrice * (1 - discountPct / 100));
}
