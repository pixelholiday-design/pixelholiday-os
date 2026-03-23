// ─────────────────────────────────────────────────────────────────────────────
// Commission Calculation Utilities
// Pure functions — no DB calls, fully unit-testable
// ─────────────────────────────────────────────────────────────────────────────

export interface CommissionResult {
  gross:      number;   // total sale amount
  rate:       number;   // commission rate (0–1)
  amount:     number;   // earned commission = gross * rate
  target:     number;   // monthly commission target
  attainment: number;   // amount / target (0–1+)
  isOnTarget: boolean;  // attainment >= 1.0
}

export function calculateCommission(
  gross:          number,
  rate:           number,
  target:         number,
  alreadyEarned:  number = 0
): CommissionResult {
  if (gross < 0)  throw new RangeError("gross must be >= 0");
  if (rate < 0 || rate > 1) throw new RangeError("rate must be between 0 and 1");
  if (target < 0) throw new RangeError("target must be >= 0");
  const amount     = Math.round(gross * rate * 100) / 100;
  const totalEarned = alreadyEarned + amount;
  const attainment = target > 0 ? totalEarned / target : 0;
  return { gross, rate, amount, target, attainment, isOnTarget: attainment >= 1.0 };
}

export function aggregateCommissions(orders: number[], rate: number): number {
  if (!orders.length) return 0;
  const totalGross = orders.reduce((sum, o) => sum + o, 0);
  return Math.round(totalGross * rate * 100) / 100;
}

export function calculateTieredCommission(gross: number, baseRate: number, target: number, alreadyEarned: number = 0): number {
  const boostedRate = baseRate * 1.5;
  const gap = Math.max(0, target - alreadyEarned);
  if (gross <= gap) return Math.round(gross * baseRate * 100) / 100;
  const belowTarget = gap;
  const aboveTarget = gross - gap;
  return Math.round((belowTarget * baseRate + aboveTarget * boostedRate) * 100) / 100;
}

export function validateCommissionRate(rate: number): boolean {
  return rate >= 0.01 && rate <= 0.50;
}
