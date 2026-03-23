import { describe, it, expect } from "vitest";
import {
  calculateCommission,
  aggregateCommissions,
  calculateTieredCommission,
  validateCommissionRate,
} from "@/lib/utils/commission";

// ─────────────────────────────────────────────────────────────────────────────
// Commission Calculation Unit Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("calculateCommission", () => {
  it("calculates 8% commission on ฿1200 order", () => {
    const result = calculateCommission(1200, 0.08, 50000);
    expect(result.amount).toBe(96);
    expect(result.gross).toBe(1200);
    expect(result.rate).toBe(0.08);
  });

  it("calculates 10% commission on ฿2500 order", () => {
    const result = calculateCommission(2500, 0.10, 50000);
    expect(result.amount).toBe(250);
  });

  it("attainment is 0 when target is 0", () => {
    const result = calculateCommission(5000, 0.08, 0);
    expect(result.attainment).toBe(0);
    expect(result.isOnTarget).toBe(false);
  });

  it("isOnTarget when cumulative earnings meet target", () => {
    // target = ฿50,000, already earned ฿49,000, new sale earns ฿1,250
    // 49000 + 1250 = 50250 > 50000 → on target
    const result = calculateCommission(15625, 0.08, 50000, 49000);
    expect(result.isOnTarget).toBe(true);
    expect(result.attainment).toBeGreaterThanOrEqual(1.0);
  });

  it("isOnTarget is false when below target", () => {
    const result = calculateCommission(1200, 0.08, 50000, 0);
    expect(result.isOnTarget).toBe(false);
    expect(result.attainment).toBeCloseTo(96 / 50000, 6);
  });

  it("rounds to 2 decimal places", () => {
    // 333 * 0.08 = 26.64
    const result = calculateCommission(333, 0.08, 50000);
    expect(result.amount).toBe(26.64);
  });

  it("throws RangeError for negative gross", () => {
    expect(() => calculateCommission(-100, 0.08, 50000)).toThrow(RangeError);
  });

  it("throws RangeError for rate > 1", () => {
    expect(() => calculateCommission(1000, 1.5, 50000)).toThrow(RangeError);
  });

  it("throws RangeError for negative rate", () => {
    expect(() => calculateCommission(1000, -0.1, 50000)).toThrow(RangeError);
  });

  it("throws RangeError for negative target", () => {
    expect(() => calculateCommission(1000, 0.08, -500)).toThrow(RangeError);
  });

  it("zero order value yields zero commission", () => {
    const result = calculateCommission(0, 0.08, 50000);
    expect(result.amount).toBe(0);
  });

  it("supervisor 5% rate on ฿3000", () => {
    const result = calculateCommission(3000, 0.05, 80000);
    expect(result.amount).toBe(150);
  });
});

describe("aggregateCommissions", () => {
  it("sums commissions across multiple orders", () => {
    const orders = [1200, 1500, 800, 2200]; // total = 5700
    const total = aggregateCommissions(orders, 0.08);
    expect(total).toBe(456); // 5700 * 0.08
  });

  it("returns 0 for empty order array", () => {
    expect(aggregateCommissions([], 0.08)).toBe(0);
  });

  it("handles single order", () => {
    expect(aggregateCommissions([990], 0.08)).toBeCloseTo(79.2, 2);
  });

  it("rounds correctly for fractional results", () => {
    // 3 * 333 = 999; 999 * 0.08 = 79.92
    const total = aggregateCommissions([333, 333, 333], 0.08);
    expect(total).toBe(79.92);
  });
});

describe("calculateTieredCommission", () => {
  it("uses base rate when entirely below target", () => {
    // target=50000, alreadyEarned=0, gross=1000
    // 1000 * 0.08 = 80
    const earned = calculateTieredCommission(1000, 0.08, 50000, 0);
    expect(earned).toBe(80);
  });

  it("uses boosted rate (1.5×) when entirely above target", () => {
    // target=50000, alreadyEarned=50000, gross=1000
    // boostedRate = 0.12; 1000 * 0.12 = 120
    const earned = calculateTieredCommission(1000, 0.08, 50000, 50000);
    expect(earned).toBe(120);
  });

  it("splits correctly across target boundary", () => {
    // target=50000, alreadyEarned=49500
    // gap = 500; gross = 1000
    // below = 500 * 0.08 = 40
    // above = 500 * 0.12 = 60
    // total = 100
    const earned = calculateTieredCommission(1000, 0.08, 50000, 49500);
    expect(earned).toBe(100);
  });

  it("full sale above target: 0 gap means all at boosted rate", () => {
    const earned = calculateTieredCommission(2000, 0.08, 50000, 50000);
    // 2000 * 0.12 = 240
    expect(earned).toBe(240);
  });
});

describe("validateCommissionRate", () => {
  it("accepts 8% (staff rate)", () => {
    expect(validateCommissionRate(0.08)).toBe(true);
  });

  it("accepts 5% (supervisor rate)", () => {
    expect(validateCommissionRate(0.05)).toBe(true);
  });

  it("accepts 10% (hotel rate)", () => {
    expect(validateCommissionRate(0.10)).toBe(true);
  });

  it("rejects 0% (too low)", () => {
    expect(validateCommissionRate(0)).toBe(false);
  });

  it("rejects 51% (too high)", () => {
    expect(validateCommissionRate(0.51)).toBe(false);
  });

  it("accepts boundary 1% and 50%", () => {
    expect(validateCommissionRate(0.01)).toBe(true);
    expect(validateCommissionRate(0.50)).toBe(true);
  });
});
