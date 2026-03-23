// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Image Resizing loader for Next.js
// Uses Cloudflare's built-in image resizing on production (zero extra cost).
// Falls back to direct URL in dev.
// ─────────────────────────────────────────────────────────────────────────────

interface ImageLoaderProps {
  src:     string;
  width:   number;
  quality?: number;
}

export default function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Cloudflare Image Resizing format
  // https://developers.cloudflare.com/images/image-resizing/url-format/
  if (process.env.NODE_ENV === "production") {
    return `/cdn-cgi/image/width=${width},quality=${quality ?? 85},format=auto/${src}`;
  }
  // Dev fallback — direct URL
  return src;
}
