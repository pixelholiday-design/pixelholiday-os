export const runtime = "edge";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  return Response.json({ data: [] }, { status: 200 });
}

export async function POST(_req: NextRequest) {
  return Response.json({ ok: true }, { status: 200 });
}

export async function PUT(_req: NextRequest) {
  return Response.json({ ok: true }, { status: 200 });
}

export async function DELETE(_req: NextRequest) {
  return Response.json({ ok: true }, { status: 200 });
}
