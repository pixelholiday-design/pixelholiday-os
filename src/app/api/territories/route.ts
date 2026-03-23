import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { z } from "zod";

export const runtime = "edge";

// ───────────────────────────────────────────────────────────────────────────
// GET /api/territories — list all territories (CEO / MANAGER)
// POST /api/territories — create territory (CEO only)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["CEO", "MANAGER"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const territories = await db.territory.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { hotels: true, users: true } },
    },
  });

  return NextResponse.json({ territories });
}

const createSchema = z.object({
  name:    z.string().min(2).max(80),
  country: z.string().min(2).max(80),
  region:  z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "CEO") {
    return NextResponse.json({ error: "CEO only" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, country, region } = parsed.data;

  const territory = await db.territory.create({
    data: { name, country, region },
  });

  return NextResponse.json({ ok: true, id: territory.id, data: territory }, { status: 201 });
}
