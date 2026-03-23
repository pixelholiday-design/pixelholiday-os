import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary/signed-url";
import { z } from "zod";


export const runtime = "edge";
const schema = z.object({
  galleryId: z.string(),
  r2Key:     z.string(),
  isHook:    z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { galleryId, r2Key, isHook } = parsed.data;

  // Build public R2 URL to feed to Cloudinary
  const r2PublicUrl = `${process.env.R2_PUBLIC_URL}/${r2Key}`;

  // Upload to Cloudinary (async watermarking happens at delivery time via transformations)
  let cloudinaryId: string | null = null;
  try {
    const result = await uploadToCloudinary(r2PublicUrl, `galleries/${galleryId}`);
    cloudinaryId = result.publicId;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    // Non-fatal — watermarking will fall back to R2 watermarked key
  }

  // Create Photo record in DB
  const photo = await db.photo.create({
    data: {
      galleryId,
      r2Key,
      cloudinaryId,
      fileName:    r2Key.split("/").pop() ?? "photo.jpg",
      isHookImage: isHook,
      isPurchased: false,
      sortOrder:   0,
    },
  });

  // Update gallery totalPhotos count
  await db.gallery.update({
    where: { id: galleryId },
    data:  { totalPhotos: { increment: 1 } },
  });

  return NextResponse.json({ photoId: photo.id, cloudinaryId });
}
