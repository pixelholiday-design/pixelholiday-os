export const runtime = "edge";
// Detailed application view
export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  return <div className="p-8"><h1>Application {params.id}</h1></div>;
}
