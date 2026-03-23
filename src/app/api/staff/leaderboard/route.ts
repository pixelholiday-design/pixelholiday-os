// src/app/api/staff/leaderboard/route.ts
// GET /api/staff/leaderboard — top staff by MTD revenue for current hotel
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { startOfMonth } from "date-fns";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const hotelId  = searchParams.get("hotelId") ?? session.user.hotelId ?? undefined;
  const limit    = parseInt(searchParams.get("limit") ?? "10");
  const monthStart = startOfMonth(new Date());

  // Build hotel filter — CommissionEntry → order → gallery → hotelId
  const hotelFilter = hotelId ? { order: { gallery: { hotelId } } } : {};

  // Aggregate commission entries by user for current month
  const grouped = await db.commissionEntry.groupBy({
    by:     ["userId"],
    where:  {
      ...hotelFilter,
      createdAt: { gte: monthStart },
    },
    _sum:   { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: "desc" } },
    take:   limit,
  });

  if (!grouped.length) {
    return NextResponse.json({ ok: true, data: [] });
  }

  // Fetch user details
  const users = await db.user.findMany({
    where: { id: { in: grouped.map((g) => g.userId) } },
    select: { id: true, name: true, image: true },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  const leaderboard = grouped.map((g, idx) => ({
    rank:       idx + 1,
    userId:     g.userId,
    name:       userMap.get(g.userId)?.name  ?? "Unknown",
    image:      userMap.get(g.userId)?.image ?? null,
    mtdEarned:  g._sum.amount ?? 0,
    orderCount: g._count.id,
  }));

  return NextResponse.json({ ok: true, data: leaderboard });
}
