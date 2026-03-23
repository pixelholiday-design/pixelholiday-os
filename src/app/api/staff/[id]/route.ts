import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { z } from "zod";

export const runtime = "edge";

// ─────────────────────────────────────────────────────────────────────────────
// GET    /api/staff/[id]  — fetch a single user (CEO / MANAGER / self)
// PATCH  /api/staff/[id]  — update user details (CEO / MANAGER)
// DELETE /api/staff/[id]  — soft-deactivate user (CEO only)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isSelf       = session.user.id === params.id;
  const isPrivileged = ["CEO", "MANAGER"].includes(session.user.role as string);

  if (!isSelf && !isPrivileged) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await db.user.findUnique({
    where: { id: params.id },
    select: {
      id:               true,
      name:             true,
      email:            true,
      role:             true,
      isActive:         true,
      baseSalary:       true,
      commissionRate:   true,
      commissionTarget: true,
      createdAt:        true,
      hotelId:          true,
      territoryId:      true,
      hotel:            { select: { name: true, city: true } },
      territory:        { select: { name: true } },
      commission: {
        select: { rate: true, target: true },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Manager can only see staff in their hotel
  if (
    session.user.role === "MANAGER" &&
    session.user.hotelId &&
    user.hotelId !== session.user.hotelId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ user });
}

const patchSchema = z.object({
  name:             z.string().min(1).max(100).optional(),
  email:            z.string().email().optional(),
  hotelId:          z.string().nullable().optional(),
  territoryId:      z.string().nullable().optional(),
  baseSalary:       z.number().min(0).optional(),
  commissionRate:   z.number().min(0).max(1).optional(),
  commissionTarget: z.number().min(0).optional(),
  isActive:         z.boolean().optional(),
  role:             z.enum(["CEO", "MANAGER", "FRANCHISE", "SUPERVISOR", "STAFF"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["CEO", "MANAGER"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Manager cannot change role or move staff outside their hotel
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;

  // Prevent MANAGER from elevating roles or reassigning hotels
  if (session.user.role === "MANAGER") {
    if (data.role && data.role !== "STAFF" && data.role !== "SUPERVISOR") {
      return NextResponse.json(
        { error: "Managers can only manage STAFF and SUPERVISOR roles" },
        { status: 403 }
      );
    }
    if (data.hotelId && data.hotelId !== session.user.hotelId) {
      return NextResponse.json(
        { error: "Managers cannot reassign staff to other hotels" },
        { status: 403 }
      );
    }
  }

  const user = await db.user.update({
    where: { id: params.id },
    data,
    select: {
      id: true, name: true, email: true,
      role: true, isActive: true, hotelId: true,
    },
  });

  // If commission rate/target changed, update Commission record too
  if (data.commissionRate !== undefined || data.commissionTarget !== undefined) {
    await db.commission.upsert({
      where:  { userId: params.id },
      update: {
        ...(data.commissionRate   !== undefined && { rate:   data.commissionRate }),
        ...(data.commissionTarget !== undefined && { target: data.commissionTarget }),
      },
      create: {
        userId: params.id,
        rate:   data.commissionRate   ?? 0.10,
        target: data.commissionTarget ?? 50000,
      },
    });
  }

  return NextResponse.json({ ok: true, user });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "CEO") {
    return NextResponse.json({ error: "CEO only" }, { status: 403 });
  }

  // Soft delete — set isActive: false rather than hard delete
  const user = await db.user.update({
    where: { id: params.id },
    data:  { isActive: false },
    select: { id: true, name: true },
  });

  return NextResponse.json({ ok: true, deactivated: user });
}
