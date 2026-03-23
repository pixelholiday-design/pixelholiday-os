// src/app/api/users/[id]/route.ts
// GET    /api/users/[id] — fetch single user
// PATCH  /api/users/[id] — update role, hotel, active status, commission rate
// DELETE /api/users/[id] — soft-delete (set isActive = false)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export const runtime = "edge";

type Context = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Staff can only see their own profile; managers see their hotel's users
  const canViewOthers = ["CEO", "MANAGER", "SUPERVISOR"].includes(session.user.role as string);
  if (!canViewOthers && params.id !== session.user.id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const user = await db.user.findUnique({
    where: { id: params.id },
    select: {
      id:          true,
      name:        true,
      email:       true,
      role:        true,
      isActive:    true,
      image:       true,
      createdAt:   true,
      hotel:       { select: { id: true, name: true } },
      territory:   { select: { id: true, name: true } },
      commission:  { select: { rate: true, target: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: user });
}

export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!["CEO", "MANAGER"].includes(session.user.role as string)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  // Manager can only modify users in their own hotel
  if (
    session.user.role === "MANAGER" &&
    session.user.hotelId &&
    user.hotelId !== session.user.hotelId
  ) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name, role, hotelId, territoryId,
    isActive, commissionRate, commissionTarget,
  } = body;

  // Only CEO can promote to MANAGER or above
  if (role && ["CEO", "MANAGER"].includes(role) && session.user.role !== "CEO") {
    return NextResponse.json({ ok: false, error: "Only CEO can assign CEO/MANAGER role" }, { status: 403 });
  }

  // Sequential writes — Neon HTTP adapter does not support interactive transactions;
  // these two operations are independent enough that partial failure is recoverable.
  await db.user.update({
    where: { id: params.id },
    data: {
      ...(name        != null && { name }),
      ...(role        != null && { role }),
      ...(hotelId     != null && { hotelId }),
      ...(territoryId != null && { territoryId }),
      ...(isActive    != null && { isActive }),
    },
  });

  // Upsert commission config if provided
  if (commissionRate != null || commissionTarget != null) {
    await db.commission.upsert({
      where:  { userId: params.id },
      create: {
        userId: params.id,
        rate:   commissionRate   ?? 0.10,
        target: commissionTarget ?? 0,
      },
      update: {
        ...(commissionRate   != null && { rate:   commissionRate }),
        ...(commissionTarget != null && { target: commissionTarget }),
      },
    });
  }

  const updated = await db.user.findUnique({
    where: { id: params.id },
    select: {
      id: true, name: true, email: true,
      role: true, isActive: true,
      hotel:      { select: { id: true, name: true } },
      commission: { select: { rate: true, target: true } },
    },
  });

  return NextResponse.json({ ok: true, data: updated });
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "CEO") {
    return NextResponse.json({ ok: false, error: "Only CEO can deactivate users" }, { status: 403 });
  }
  if (params.id === session.user.id) {
    return NextResponse.json({ ok: false, error: "Cannot deactivate yourself" }, { status: 400 });
  }

  await db.user.update({
    where: { id: params.id },
    data:  { isActive: false },
  });

  return NextResponse.json({ ok: true, data: { id: params.id, isActive: false } });
}
