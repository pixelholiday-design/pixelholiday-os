// Cloudflare image loader
export function cfImageLoader(src: string) {
  return `/cdn-cgi/image/width=800/${src}`;
}
