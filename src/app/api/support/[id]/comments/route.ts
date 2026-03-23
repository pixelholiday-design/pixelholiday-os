// src/app/api/support/[id]/comments/route.ts
// GET  /api/support/:id/comments    — list comments on a ticket
// POST /api/support/:id/comments    — add a comment
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db }   from "@/lib/db/prisma";
import { z }    from "zod";

export const runtime = "edge";

type Params = { params: { id: string } };

// ── GET (list comments) ───────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await db.supportTicket.findUnique({
    where:  { id: params.id },
    select: { id: true, hotelId: true },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Hotel scope check
  const role    = session.user.role as string;
  const myHotel = (session.user as { hotelId?: string | null }).hotelId ?? null;
  if (!["CEO", "MANAGER"].includes(role) && myHotel && ticket.hotelId !== myHotel) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const comments = await db.ticketComment.findMany({
    where:   { ticketId: params.id },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}

// ── POST (add comment) ────────────────────────────────────────────────────
const commentSchema = z.object({
  body:       z.string().min(1).max(10_000),
  isInternal: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await db.supportTicket.findUnique({
    where:  { id: params.id },
    select: { id: true, hotelId: true, status: true },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Hotel scope check
  const role    = session.user.role as string;
  const myHotel = (session.user as { hotelId?: string | null }).hotelId ?? null;
  if (!["CEO", "MANAGER"].includes(role) && myHotel && ticket.hotelId !== myHotel) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Internal comments are CEO/MANAGER only
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { body: commentBody, isInternal } = parsed.data;

  // Only CEO/MANAGER can post internal notes
  if (isInternal && !["CEO", "MANAGER"].includes(role)) {
    return NextResponse.json({ error: "Only managers can post internal notes" }, { status: 403 });
  }

  // Auto-move OPEN → IN_PROGRESS when an agent first replies
  if (
    ticket.status === "OPEN" &&
    ["CEO", "MANAGER"].includes(role)
  ) {
    await db.supportTicket.update({
      where: { id: params.id },
      data:  { status: "IN_PROGRESS", assignedToId: session.user.id as string },
    });
  }

  const comment = await db.ticketComment.create({
    data: {
      ticketId:   params.id,
      authorId:   session.user.id as string,
      body:       commentBody,
      isInternal,
    },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
