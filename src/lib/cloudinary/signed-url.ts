import { v2 as cloudinary } from "cloudinary";

// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary — Signed URL generation & watermarking
// ─────────────────────────────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export { cloudinary };

interface SignedUrlOptions {
  r2Key:        string;
  cloudinaryId: string | null;
  isPurchased:  boolean;
  isHook:       boolean;
}

/**
 * Get a photo URL:
 *  - Purchased or hook images → direct R2 public URL (no watermark)
 *  - Unpurchased locked images → Cloudinary signed URL with watermark overlay
 */
export async function getSignedPhotoUrl(opts: SignedUrlOptions): Promise<string> {
  const r2PublicUrl = process.env.R2_PUBLIC_URL ?? "";

  // If purchased or free hook → serve from R2 directly
  if (opts.isPurchased || opts.isHook) {
    return `${r2PublicUrl}/${opts.r2Key}`;
  }

  // If Cloudinary public_id exists → return signed watermarked URL
  if (opts.cloudinaryId) {
    return cloudinary.url(opts.cloudinaryId, {
      sign_url:  true,
      secure:    true,
      type:      "authenticated",
      expires_at: Math.floor(Date.now() / 1000) + 7200, // 2-hour signed URL
      transformation: [
        { width: 1080, crop: "limit" },
        {
          overlay: {
            font_family: "Arial",
            font_size:   60,
            font_style:  "bold",
            text:        "PIXELHOLIDAY.COM",
          },
          gravity: "center",
          opacity: 30,
          color:   "#ffffff",
        },
        {
          overlay: {
            font_family: "Arial",
            font_size:   60,
            font_style:  "bold",
            text:        "PIXELHOLIDAY.COM",
          },
          gravity: "south_east",
          x: 20,
          y: 20,
          opacity: 60,
          color:   "#ffffff",
        },
      ],
    });
  }

  // Fallback → serve watermarked version from R2 if it exists
  return `${r2PublicUrl}/${opts.r2Key.replace("galleries/", "galleries/wm/")}`;
}

/**
 * Upload an image from R2 to Cloudinary for watermarking pipeline.
 * Called server-side after R2 upload is confirmed.
 */
export async function uploadToCloudinary(
  r2PublicUrl: string,
  folder:      string
): Promise<{ publicId: string; secureUrl: string }> {
  const result = await cloudinary.uploader.upload(r2PublicUrl, {
    folder,
    type:                "authenticated",
    access_mode:         "authenticated",
    invalidate:          true,
    use_filename:        true,
    unique_filename:     true,
    overwrite:           false,
    resource_type:       "image",
  });

  return {
    publicId:  result.public_id,
    secureUrl: result.secure_url,
  };
}

/**
 * Create a signed download ZIP URL for all purchased photos in a gallery.
 */
export async function createGalleryZipUrl(
  publicIds:  string[],
  galleryId:  string
): Promise<string> {
  const archiveParams = cloudinary.utils.download_zip_url({
    public_ids: publicIds,
    resource_type: "image",
    use_filename: true,
    expires_at: Math.floor(Date.now() / 1000) + 86400, // 24h
    tags: [`gallery-${galleryId}`],
  } as any);

  return archiveParams;
}
