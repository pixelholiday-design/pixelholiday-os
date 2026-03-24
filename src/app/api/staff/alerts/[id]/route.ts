export const runtime = "edge";
export async function GET(req, { params }) { return Response.json({ id: params.id }); }
