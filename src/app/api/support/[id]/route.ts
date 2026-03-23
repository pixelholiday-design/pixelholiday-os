// src/app/api/support/[id]/route.ts
// GET  /api/support/:id        — fetch full ticket with comments
// PATCH /api/support/:id       — update status, priority, assignedToId, resolution
// DELETE /api/support/:id      — CEO/MANAGER hard delete
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { z } from "zod";

export const runtime = "edge";

type Params = { params: { id: string } };

// ── GET ───────────────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await db.supportTicket.findUnique({
    where: { id: params.id },
    include: {
      reporter:   { select: { id: true, name: true, image: true } },
      assignedTo: { select: { id: true, name: true, image: true } },
      hotel:      { select: { id: true, name: true } },
      comments: {
        include: { author: { select: { id: true, name: true, image: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Scope check: non-admin users may only see tickets for their hotel
  const role    = session.user.role as string;
  const myHotel = (session.user as { hotelId?: string | null }).hotelId ?? null;
  if (!["CEO", "MANAGER"].includes(role) && myHotel && ticket.hotelId !== myHotel) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(ticket);
}

// ── PATCH ─────────────────────────────────────────────────────────────────
const patchSchema = z.object({
  status:       z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority:     z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  assignedToId: z.string().nullable().optional(),
  resolution:   z.string().nullable().optional(),
  subject:      z.string().min(1).max(200).optional(),
  description:  z.string().min(1).optional(),
  category:     z.string().min(1).optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await db.supportTicket.findUnique({
    where: { id: params.id },
    select: { id: true, hotelId: true, status: true },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Scope check
  const role    = session.user.role as string;
  const myHotel = (session.user as { hotelId?: string | null }).hotelId ?? null;
  if (!["CEO", "MANAGER"].includes(role) && myHotel && ticket.hotelId !== myHotel) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { status, priority, assignedToId, resolution, subject, description, category } = parsed.data;

  // Auto-set resolvedAt when status transitions to RESOLVED/CLOSED
  const resolvedAt =
    (status === "RESOLVED" || status === "CLOSED") &&
    !["RESOLVED", "CLOSED"].includes(ticket.status)
      ? new Date()
      : undefined;

  const updated = await db.supportTicket.update({
    where: { id: params.id },
    data: {
      ...(status       != null && { status }),
      ...(priority     != null && { priority }),
      ...(assignedToId !== undefined && { assignedToId }),
      ...(resolution   !== undefined && { resolution }),
      ...(subject      != null && { subject }),
      ...(description  != null && { description }),
      ...(category     != null && { category }),
      ...(resolvedAt   != null && { resolvedAt }),
    },
    include: {
      reporter:   { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } },
      hotel:      { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(updated);
}

// ── DELETE ────────────────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!["CEO", "MANAGER"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ticket = await db.supportTicket.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  await db.supportTicket.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
