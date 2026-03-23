export const runtime = "edge";
import { NextRequest } from "next/server";

export async function PATCH(_req: NextRequest, { params }: { params: { id?: string; token?: string } }) {
  return Response.json({ ok: true }, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id?: string; token?: string } }) {
  return Response.json({ ok: true }, { status: 200 });
}
