import { db } from "@/lib/db/prisma";
import { subDays, startOfDay, endOfDay } from "date-fns";

// ─────────────────────────────────────────────────────────────────────────────
// AI Intelligence Layer — Staff Valuation & Hotel RPG Ranking
// ─────────────────────────────────────────────────────────────────────────────

const TRAINING_VIDEOS: Record<string, { threshold: number; videoUrl: string; message: string }[]> = {
  low_aov: [
    {
      threshold: 500,   // AOV below ฿500 triggers Level 1
      videoUrl:  "https://academy.pixelholiday.com/videos/upsell-basics",
      message:   "Your AOV is below target. Watch this upsell basics training to boost your numbers! 🎯",
    },
    {
      threshold: 300,   // AOV below ฿300 triggers Level 2 (urgent)
      videoUrl:  "https://academy.pixelholiday.com/videos/package-selling-masterclass",
      message:   "⚠️ Critical: Your AOV needs attention. Watch the Package Selling Masterclass NOW.",
    },
  ],
};

/**
 * Run daily AOV calculation for all active photographers.
 * Called by the /api/cron/aov-snapshot endpoint.
 * Inserts AovSnapshot records and creates AovAlert if AOV drops.
 */
export async function runDailyAovValuation(): Promise<void> {
  const today     = new Date();
  const yesterday = subDays(today, 1);
  const dayStart  = startOfDay(yesterday);
  const dayEnd    = endOfDay(yesterday);

  // Fetch all active photographers
  const photographers = await db.user.findMany({
    where: { role: "STAFF", isActive: true },
    select: { id: true, hotelId: true, commissionTarget: true },
  });

  for (const photographer of photographers) {
    const orders = await db.order.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: dayStart, lte: dayEnd },
        gallery: { staffId: photographer.id },
      },
      select: { totalAmount: true },
    });

    const totalSales  = orders.reduce((s, o) => s + o.totalAmount, 0);
    const orderCount  = orders.length;
    const aov         = orderCount > 0 ? totalSales / orderCount : 0;

    // Compute dropPct against 7-day rolling average (needs prior data)
    let dropPct: number | null = null;
    const previousSnaps = await db.aovSnapshot.findMany({
      where: {
        photographerId: photographer.id,
        date:           { gte: subDays(yesterday, 7), lt: dayStart },
      },
      orderBy: { date: "desc" },
      take: 7,
    });
    if (previousSnaps.length >= 3) {
      const avgPrevAov = previousSnaps.reduce((s, s2) => s + s2.aov, 0) / previousSnaps.length;
      if (avgPrevAov > 0) {
        dropPct = ((aov - avgPrevAov) / avgPrevAov) * 100; // negative = drop
      }
    }

    // Upsert snapshot (now includes dropPct)
    await db.aovSnapshot.upsert({
      where: {
        photographerId_date: {
          photographerId: photographer.id,
          date:           dayStart,
        },
      },
      create: {
        photographerId: photographer.id,
        date:           dayStart,
        aov,
        totalSales,
        orderCount,
        hotelId:        photographer.hotelId ?? "",
        dropPct,
      },
      update: { aov, totalSales, orderCount, dropPct },
    });

    // Check AOV against thresholds → insert alert if needed
    if (orderCount > 0 && dropPct !== null && dropPct < -20) {
      const level = TRAINING_VIDEOS.low_aov.find(
        (l) => aov < l.threshold
      ) ?? TRAINING_VIDEOS.low_aov[0];

      await db.aovAlert.create({
        data: {
          userId:           photographer.id,
          message:          level.message,
          trainingVideoUrl: level.videoUrl,
          isRead:           false,
        },
      });
    }
  }
}

/**
 * Location Valuation: rank hotels by Revenue Per Guest (RPG).
 * Used on CEO dashboard to evaluate contract profitability.
 */
export async function getHotelRpgRanking(
  fromDate: Date,
  toDate:   Date
): Promise<Array<{
  hotelId:     string;
  hotelName:   string;
  city:        string;
  totalRevenue: number;
  guestCount:  number;
  rpg:         number;
  monthlyRent: number;
  roiRatio:    number; // revenue / rent
}>> {
  const hotels = await db.hotel.findMany({
    where: { isActive: true },
    include: {
      galleries: {
        where: { shootDate: { gte: fromDate, lte: toDate } },
        include: {
          orders: {
            where: { status: "COMPLETED", createdAt: { gte: fromDate, lte: toDate } },
            select: { totalAmount: true },
          },
        },
      },
    },
  });

  const ranked = hotels
    .map((hotel) => {
      const totalRevenue = hotel.galleries.reduce(
        (sum, g) => sum + g.orders.reduce((os, o) => os + o.totalAmount, 0),
        0
      );
      const guestCount = hotel.galleries.length;
      const rpg        = guestCount > 0 ? totalRevenue / guestCount : 0;
      const roiRatio   = hotel.monthlyRent > 0 ? totalRevenue / hotel.monthlyRent : 0;

      return {
        hotelId:     hotel.id,
        hotelName:   hotel.name,
        city:        hotel.city ?? "",
        totalRevenue,
        guestCount,
        rpg,
        monthlyRent: hotel.monthlyRent,
        roiRatio,
      };
    })
    .sort((a, b) => b.rpg - a.rpg);

  return ranked;
}
