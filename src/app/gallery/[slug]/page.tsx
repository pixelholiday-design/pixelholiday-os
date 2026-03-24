export const runtime = "edge";
// Guest gallery
export default function GalleryPage({ params }: { params: { slug: string } }) {
  return <div className="p-8">Gallery: {params.slug}</div>;
}
