// Print API
export async function POST(req: Request) {
  return Response.json({ printed: true });
}
