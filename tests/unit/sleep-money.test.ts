import { describe, it, expect, beforeEach } from "vitest";
import {
  buildSleepMoneyDrips,
  getNextDrip,
  isGalleryAsleep,
  formatDiscount,
  applyDiscount,
  SLEEP_MONEY_SCHEDULE,
} from "@/lib/utils/sleep-money";

// ─────────────────────────────────────────────────────────────────────────────
// Sleep Money Scheduler Unit Tests
// ─────────────────────────────────────────────────────────────────────────────

// Fixed reference dates for deterministic tests
const SHOOT_DATE   = new Date("2024-01-01T08:00:00Z"); // shoot day
const DAY_1        = new Date("2024-01-02T08:00:00Z"); // 1 day after
const DAY_7        = new Date("2024-01-08T08:00:00Z"); // exactly day 7
const DAY_8        = new Date("2024-01-09T08:00:00Z"); // 1 day past first drip
const DAY_16       = new Date("2024-01-17T08:00:00Z"); // past first 2 drips
const DAY_31       = new Date("2024-02-01T08:00:00Z"); // all drips fired

describe("SLEEP_MONEY_SCHEDULE", () => {
  it("has exactly 4 drip steps", () => {
    expect(SLEEP_MONEY_SCHEDULE).toHaveLength(4);
  });

  it("discount percentages increase over time", () => {
    const pcts = SLEEP_MONEY_SCHEDULE.map((s) => s.discountPct);
    for (let i = 1; i < pcts.length; i++) {
      expect(pcts[i]).toBeGreaterThan(pcts[i - 1]);
    }
  });

  it("days increase monotonically", () => {
    const days = SLEEP_MONEY_SCHEDULE.map((s) => s.day);
    for (let i = 1; i < days.length; i++) {
      expect(days[i]).toBeGreaterThan(days[i - 1]);
    }
  });

  it("first drip is day 7 at 50% discount", () => {
    expect(SLEEP_MONEY_SCHEDULE[0]).toEqual({ day: 7, discountPct: 50 });
  });

  it("final drip is day 30 at 80% discount", () => {
    expect(SLEEP_MONEY_SCHEDULE[3]).toEqual({ day: 30, discountPct: 80 });
  });
});

describe("buildSleepMoneyDrips", () => {
  it("returns all 4 drips when shoot is today", () => {
    const drips = buildSleepMoneyDrips(SHOOT_DATE, DAY_1);
    expect(drips).toHaveLength(4);
  });

  it("returns 3 drips after day 7 has passed", () => {
    const drips = buildSleepMoneyDrips(SHOOT_DATE, DAY_8);
    expect(drips).toHaveLength(3);
    expect(drips[0].day).toBe(15);
  });

  it("returns 2 drips after days 7 and 15 have passed", () => {
    const drips = buildSleepMoneyDrips(SHOOT_DATE, DAY_16);
    expect(drips).toHaveLength(2);
    expect(drips[0].day).toBe(20);
  });

  it("returns 0 drips when all have fired", () => {
    const drips = buildSleepMoneyDrips(SHOOT_DATE, DAY_31);
    expect(drips).toHaveLength(0);
  });

  it("includes expired drips when includeExpired=true", () => {
    const drips = buildSleepMoneyDrips(SHOOT_DATE, DAY_31, true);
    expect(drips).toHaveLength(4);
    drips.forEach((d) => expect(d.isFuture).toBe(false));
  });

  it("all returned drips have isFuture=true by default", () => {
    const drips = buildSleepMoneyDrips(SHOOT_DATE, DAY_1);
    drips.forEach((d) => expect(d.isFuture).toBe(true));
  });

  it("delay seconds are positive for future drips", () => {
    const drips = buildSleepMoneyDrips(SHOOT_DATE, DAY_1);
    drips.forEach((d) => expect(d.delaySeconds).toBeGreaterThan(0));
  });

  it("first drip fires exactly on day 7", () => {
    const drips = buildSleepMoneyDrips(SHOOT_DATE, DAY_1, true);
    const day7Drip = drips.find((d) => d.day === 7)!;
    expect(day7Drip.fireAt.getTime()).toBe(
      new Date("2024-01-08T08:00:00Z").getTime()
    );
  });

  it("delays decrease as now approaches fire date", () => {
    const earlyDrips = buildSleepMoneyDrips(SHOOT_DATE, DAY_1);
    const laterDrips = buildSleepMoneyDrips(SHOOT_DATE, DAY_7);
    // Day 1: day-7 drip has larger delay than at day 7
    const earlyDay7  = earlyDrips.find((d) => d.day === 7);
    const laterDay7  = laterDrips.find((d) => d.day === 7);
    if (earlyDay7 && laterDay7) {
      expect(earlyDay7.delaySeconds).toBeGreaterThan(laterDay7.delaySeconds);
    }
  });
});

describe("getNextDrip", () => {
  it("returns day 7 drip shortly after shoot", () => {
    const next = getNextDrip(SHOOT_DATE, DAY_1);
    expect(next?.day).toBe(7);
    expect(next?.discountPct).toBe(50);
  });

  it("returns day 15 drip after day 7 fires", () => {
    const next = getNextDrip(SHOOT_DATE, DAY_8);
    expect(next?.day).toBe(15);
    expect(next?.discountPct).toBe(60);
  });

  it("returns null when all drips have fired", () => {
    const next = getNextDrip(SHOOT_DATE, DAY_31);
    expect(next).toBeNull();
  });

  it("returns drip with positive delaySeconds", () => {
    const next = getNextDrip(SHOOT_DATE, DAY_1);
    expect(next?.delaySeconds).toBeGreaterThan(0);
  });
});

describe("isGalleryAsleep", () => {
  it("not asleep on shoot day", () => {
    expect(isGalleryAsleep(SHOOT_DATE, DAY_1)).toBe(false);
  });

  it("asleep on day 7", () => {
    expect(isGalleryAsleep(SHOOT_DATE, DAY_7)).toBe(true);
  });

  it("asleep after day 7", () => {
    expect(isGalleryAsleep(SHOOT_DATE, DAY_8)).toBe(true);
  });

  it("asleep after 30 days", () => {
    expect(isGalleryAsleep(SHOOT_DATE, DAY_31)).toBe(true);
  });
});

describe("formatDiscount", () => {
  it('formats 50 as "50% OFF"', () => {
    expect(formatDiscount(50)).toBe("50% OFF");
  });

  it('formats 80 as "80% OFF"', () => {
    expect(formatDiscount(80)).toBe("80% OFF");
  });

  it("handles edge case 0%", () => {
    expect(formatDiscount(0)).toBe("0% OFF");
  });

  it("handles 100%", () => {
    expect(formatDiscount(100)).toBe("100% OFF");
  });
});

describe("applyDiscount", () => {
  it("applies 50% discount to ฿1000", () => {
    expect(applyDiscount(1000, 50)).toBe(500);
  });

  it("applies 80% discount to ฿990", () => {
    // 990 * 0.20 = 198
    expect(applyDiscount(990, 80)).toBe(198);
  });

  it("0% discount returns original price", () => {
    expect(applyDiscount(1200, 0)).toBe(1200);
  });

  it("100% discount returns 0", () => {
    expect(applyDiscount(1200, 100)).toBe(0);
  });

  it("rounds fractional results", () => {
    // 333 * (1 - 0.60) = 333 * 0.40 = 133.2 → 133
    expect(applyDiscount(333, 60)).toBe(133);
  });

  it("throws RangeError for discount > 100", () => {
    expect(() => applyDiscount(1000, 101)).toThrow(RangeError);
  });

  it("throws RangeError for negative discount", () => {
    expect(() => applyDiscount(1000, -1)).toThrow(RangeError);
  });

  it("real-world: day-7 drip on ฿990 photo package", () => {
    // Full package = 5 photos × ฿990 = ฿4950; 50% off = ฿2475
    expect(applyDiscount(4950, 50)).toBe(2475);
  });

  it("real-world: day-30 drip on ฿990 photo package", () => {
    // Full package = 5 photos × ฿990 = ฿4950; 80% off = ฿990
    expect(applyDiscount(4950, 80)).toBe(990);
  });
});
