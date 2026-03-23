import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { getPresignedPutUrl, buildR2Key } from "@/lib/r2/client";
import { z } from "zod";


export const runtime = "edge";
const schema = z.object({
  galleryId:   z.string(),
  fileName:    z.string(),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize:    z.number().max(50 * 1024 * 1024, "Max 50MB"),
  isHook:      z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { galleryId, fileName, contentType, isHook } = parsed.data;

  const prefix    = isHook ? "hook_" : "";
  const r2Key     = buildR2Key(galleryId, fileName, prefix);
  const uploadUrl = await getPresignedPutUrl(r2Key, contentType);

  return NextResponse.json({ uploadUrl, r2Key });
}
