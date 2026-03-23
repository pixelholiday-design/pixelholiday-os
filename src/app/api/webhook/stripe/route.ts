export const runtime = "edge";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  return Response.json({ received: true }, { status: 200 });
}
