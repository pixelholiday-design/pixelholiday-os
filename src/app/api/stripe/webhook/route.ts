// Stripe webhook handler
export async function POST(req: Request) {
  const event = await req.json();
  return Response.json({ received: true });
}
