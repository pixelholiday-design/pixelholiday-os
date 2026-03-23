// src/app/api/support/route.ts
// Support ticket management — list and create.
// GET  /api/support?status=OPEN&priority=HIGH&hotelId=...&page=1
// POST /api/support   { hotelId, subject, description, category, priority? }
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { z } from "zod";

export const runtime = "edge";

// ── List ──────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status   = searchParams.get("status")   || undefined;
  const priority = searchParams.get("priority") || undefined;
  const hotelId  = searchParams.get("hotelId")  || undefined;
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = 25;

  // Scope hotel access
  const role    = session.user.role as string;
  const myHotel = (session.user as { hotelId?: string | null }).hotelId ?? null;

  // Non-CEO/MANAGER roles are limited to their hotel
  const effectiveHotelId: string | undefined =
    ["CEO", "MANAGER"].includes(role)
      ? hotelId
      : (myHotel ?? undefined);

  const where = {
    ...(effectiveHotelId && { hotelId: effectiveHotelId }),
    ...(status   && { status   }),
    ...(priority && { priority }),
  };

  const [tickets, total] = await Promise.all([
    db.supportTicket.findMany({
      where,
      include: {
        reporter:   { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
        hotel:      { select: { id: true, name: true } },
        _count:     { select: { comments: true } },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      skip:  (page - 1) * pageSize,
      take:  pageSize,
    }),
    db.supportTicket.count({ where }),
  ]);

  return NextResponse.json({
    tickets,
    pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
  });
}

// ── Create ────────────────────────────────────────────────────────────────
const createSchema = z.object({
  hotelId:     z.string().min(1),
  subject:     z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  category:    z.string().min(1).max(100),
  priority:    z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional().default("MEDIUM"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { hotelId, subject, description, category, priority } = parsed.data;

  // Non-admin users can only create tickets for their own hotel
  const role    = session.user.role as string;
  const myHotel = (session.user as { hotelId?: string | null }).hotelId ?? null;
  if (!["CEO", "MANAGER"].includes(role) && myHotel && myHotel !== hotelId) {
    return NextResponse.json({ error: "Cannot create tickets for another hotel" }, { status: 403 });
  }

  // Verify hotel exists
  const hotel = await db.hotel.findUnique({ where: { id: hotelId }, select: { id: true } });
  if (!hotel) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  }

  const ticket = await db.supportTicket.create({
    data: {
      hotelId,
      reporterId: session.user.id as string,
      subject,
      description,
      category,
      priority,
      status: "OPEN",
    },
    include: {
      reporter: { select: { id: true, name: true } },
      hotel:    { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
