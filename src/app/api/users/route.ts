// src/app/api/users/route.ts
// GET  /api/users  — list users (CEO/MANAGER only, scoped by hotel)
// POST /api/users  — create new staff user (CEO only)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!["CEO", "MANAGER"].includes(session.user.role as string)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const hotelId = searchParams.get("hotelId") ?? undefined;
  const role    = searchParams.get("role") ?? undefined;
  const search  = searchParams.get("search") ?? undefined;
  const page    = parseInt(searchParams.get("page") ?? "1");
  const pageSize= parseInt(searchParams.get("pageSize") ?? "50");

  // Manager scoped to their hotel
  const scopedHotelId =
    session.user.role === "MANAGER" && session.user.hotelId
      ? session.user.hotelId
      : hotelId;

  const where = {
    ...(scopedHotelId && { hotelId: scopedHotelId }),
    ...(role          && { role: role as any }),
    ...(search && {
      OR: [
        { name:  { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id:         true,
        name:       true,
        email:      true,
        role:       true,
        isActive:   true,
        createdAt:  true,
        hotel:      { select: { id: true, name: true } },
        territory:  { select: { id: true, name: true } },
      },
      orderBy: [{ role: "asc" }, { name: "asc" }],
      skip:  (page - 1) * pageSize,
      take:  pageSize,
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({
    ok: true,
    data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "CEO") {
    return NextResponse.json({ ok: false, error: "Only CEO can create users" }, { status: 403 });
  }

  const body = await req.json();
  const { name, email, password, role, hotelId, territoryId, commissionRate } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { ok: false, error: "name, email, password, and role are required" },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: false, error: "Email already in use" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      role,
      hotelId:     hotelId     ?? null,
      territoryId: territoryId ?? null,
      isActive:    true,
    },
    select: {
      id: true, name: true, email: true,
      role: true, isActive: true, createdAt: true,
      hotel:     { select: { id: true, name: true } },
      territory: { select: { id: true, name: true } },
    },
  });

  // Persist commission rate if provided (mirrors PATCH /api/users/[id] behaviour)
  if (commissionRate != null) {
    await db.commission.upsert({
      where:  { userId: user.id },
      create: { userId: user.id, rate: commissionRate, target: 0 },
      update: { rate: commissionRate },
    });
  }

  return NextResponse.json({ ok: true, data: user }, { status: 201 });
}
