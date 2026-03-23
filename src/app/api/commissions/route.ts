export const runtime = "edge";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id?: string; token?: string } }) {
  return Response.json({ data: [] }, { status: 200 });
}
