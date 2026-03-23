// src/app/api/staff/shifts/route.ts
// GET  /api/staff/shifts  — fetch own shifts (or hotel shifts for supervisor/manager)
// POST /api/staff/shifts  — create shift (SUPERVISOR / MANAGER / CEO only)
import { NextRequest, NextResponse } from "next/server";
import { db }   from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from    = searchParams.get("from")   ? new Date(searchParams.get("from")!)   : undefined;
  const to      = searchParams.get("to")     ? new Date(searchParams.get("to")!)     : undefined;
  const userId  = searchParams.get("userId") ?? undefined;
  const hotelId = searchParams.get("hotelId") ?? undefined;

  const role = session.user.role as string;

  // Staff can only see their own shifts
  const effectiveUserId =
    role === "STAFF"
      ? session.user.id
      : userId ?? session.user.id;

  const effectiveHotelId =
    ["CEO", "MANAGER"].includes(role)
      ? hotelId
      : session.user.hotelId ?? undefined;

  const shifts = await db.shift.findMany({
    where: {
      userId:    effectiveUserId,
      ...(effectiveHotelId && { hotelId: effectiveHotelId }),
      ...(from && to && { startTime: { gte: from, lte: to } }),
    },
    orderBy: { startTime: "asc" },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, data: shifts });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as string;
  if (!["CEO", "MANAGER", "SUPERVISOR"].includes(role)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, hotelId, startTime, endTime, notes } = body;

  if (!userId || !hotelId || !startTime || !endTime) {
    return NextResponse.json(
      { ok: false, error: "userId, hotelId, startTime, and endTime are required" },
      { status: 400 }
    );
  }

  // Supervisors can only assign shifts at their own hotel
  if (role === "SUPERVISOR" && session.user.hotelId !== hotelId) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const shift = await db.shift.create({
    data: {
      userId,
      hotelId,
      startTime: new Date(startTime),
      endTime:   new Date(endTime),
      notes:     notes ?? null,
    },
  });

  return NextResponse.json({ ok: true, data: shift }, { status: 201 });
}
