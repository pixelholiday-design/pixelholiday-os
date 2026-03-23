// Daily cron job
export async function POST(req: Request) {
  // Run daily sync
  return Response.json({ success: true });
}
