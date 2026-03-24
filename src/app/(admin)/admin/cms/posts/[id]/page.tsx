export const runtime = "edge";
// Server component
export default async function PostDetail({ params }: { params: { id: string } }) {
  return <div className="p-8">Post {params.id}</div>;
}
